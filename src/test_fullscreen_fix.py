import sys, time
from playwright.sync_api import sync_playwright

errors = []

# Simulates exactly the reproduced production bug: requestFullscreen() never
# resolves and never rejects (a permanently-pending Promise) -- this is what
# was observed on the live Vercel deployment via real trusted clicks, and is
# indistinguishable, from the calling code's point of view, from a browser
# that simply never settles the fullscreen promise.
INIT_SCRIPT = """
Element.prototype.requestFullscreen = function () {
  window.__fsRequestCount = (window.__fsRequestCount || 0) + 1;
  return new Promise(function () { /* never resolves, never rejects */ });
};
"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 1280, 'height': 900})
    page = context.new_page()
    page.add_init_script(INIT_SCRIPT)
    page.on('pageerror', lambda exc: errors.append(str(exc)))

    page.goto('file:///home/claude/ielts-roadmap/index.html')
    page.wait_for_timeout(800)

    page.click('[data-day-toggle="1"]', force=True)
    page.wait_for_timeout(300)
    page.click('[data-launch-exercise="listening"][data-launch-day="1"]')
    page.wait_for_timeout(200)
    print('Gate screen visible before click:', page.is_visible('#btnStartEx'))

    t0 = time.time()
    page.click('#btnStartEx')

    # Button should immediately show a "starting" state and be disabled --
    # proves the click handler didn't just hang synchronously either.
    page.wait_for_timeout(150)
    btn_disabled = page.eval_on_selector('#btnStartEx', 'el => el.disabled') if page.query_selector('#btnStartEx') else None
    print('Start button disabled right after click (mid-attempt):', btn_disabled)

    # Poll until the exercise actually renders (proves the app didn't hang
    # forever) -- should happen at ~3000ms (FS_REQUEST_TIMEOUT_MS), well
    # under this 6s ceiling which would fail the test if the hang were real.
    rendered = False
    for _ in range(60):
        if page.is_visible('#btnPlayAudio'):
            rendered = True
            break
        page.wait_for_timeout(100)
    elapsed_ms = (time.time() - t0) * 1000

    print('Exercise rendered despite hung fullscreen promise:', rendered)
    print('Time to degrade + render (ms):', round(elapsed_ms))
    print('requestFullscreen() call count:', page.evaluate('window.__fsRequestCount || 0'))

    # A toast warning should have appeared explaining the degraded mode.
    toast_text = page.text_content('#toastContainer') or ''
    print('Toast shown:', bool(toast_text.strip()))
    print('Toast mentions standard mode:', 'standard mode' in toast_text.lower())

    # The exercise itself must be fully usable in degraded mode.
    gap_inputs = page.query_selector_all('[data-ex-answer]')
    print('Listening question inputs still rendered in degraded mode:', len(gap_inputs))

    # Anti-cheat must be OFF in degraded mode: a blur should NOT show the
    # cheat-reset screen, since the attempt was never fullscreen-locked.
    page.evaluate('window.dispatchEvent(new Event("blur"))')
    page.wait_for_timeout(300)
    cheat_text = page.text_content('#exerciseBody') or ''
    print('Cheat screen wrongly triggered in degraded mode (should be False):', 'Attempt reset' in cheat_text)

    page.click('[data-close-exercise]')
    page.wait_for_timeout(200)

    browser.close()

print('\n--- page errors ---')
for e in errors:
    print('ERROR:', e)

ok = (
    rendered and
    elapsed_ms < 5000 and
    len(gap_inputs) > 0 and
    'Attempt reset' not in cheat_text and
    not errors
)
print('\nOVERALL:', 'PASS' if ok else 'FAIL')
sys.exit(0 if ok else 1)
