import sys
from playwright.sync_api import sync_playwright

errors = []
console_msgs = []

with sync_playwright() as p:
    browser = p.chromium.launch(args=[
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
    ])
    context = browser.new_context(viewport={'width': 1280, 'height': 900}, permissions=['microphone'])
    page = context.new_page()
    page.on('console', lambda msg: console_msgs.append(f'{msg.type}: {msg.text}'))
    page.on('pageerror', lambda exc: errors.append(str(exc)))

    page.goto('file:///home/claude/ielts-roadmap/index.html')
    page.wait_for_timeout(1000)

    # expand day 1
    page.click('[data-day-toggle="1"]')
    page.wait_for_timeout(400)

    launch_btns = page.query_selector_all('[data-launch-exercise]')
    print('Start Exercise buttons found on day 1:', len(launch_btns))

    # ---------------- LISTENING ----------------
    page.click('[data-launch-exercise="listening"][data-launch-day="1"]')
    page.wait_for_timeout(200)
    print('Gate screen visible:', page.is_visible('#btnStartEx'))
    page.click('#btnStartEx')
    page.wait_for_timeout(600)
    print('Listening play button visible:', page.is_visible('#btnPlayAudio'))
    gap_inputs = page.query_selector_all('[data-ex-answer]')
    print('Listening question inputs found:', len(gap_inputs))
    # fill first gap answer correctly, leave rest blank
    first_gap = page.query_selector('input[type="text"][data-ex-answer]')
    if first_gap:
        first_gap.fill('Siobhan McAllister')
    page.click('#btnGradeListening')
    page.wait_for_timeout(200)
    result_text = page.text_content('#listeningResult')
    print('Listening grade result:', result_text.strip().split('\n')[0] if result_text else None)
    print('Finish button present:', page.is_visible('[data-finish-exercise]'))
    page.click('[data-finish-exercise]')
    page.wait_for_timeout(300)
    print('statDone after finishing listening exercise:', page.text_content('#statDone'))
    print('Modal hidden after finish:', 'hidden' in (page.get_attribute('#exerciseModal', 'class') or ''))

    # reset day 1 completion so later checks are clean-ish (not required, just informative)

    # ---------------- READING (graded) ----------------
    page.click('[data-launch-exercise="reading"][data-launch-day="1"]')
    page.wait_for_timeout(200)
    page.click('#btnStartEx')
    page.wait_for_timeout(400)
    print('Reading passage rendered, questions:', len(page.query_selector_all('[data-ex-answer]')))
    # answer first TFNG mcq with radio index 1 (False) for q1 (correct answer is False)
    radios = page.query_selector_all('input[type="radio"][name="mcq-q1"]')
    if len(radios) >= 2:
        radios[1].check()
    page.click('#btnGradeReading')
    page.wait_for_timeout(200)
    print('Reading grade result:', (page.text_content('#readingResult') or '').strip().split('\n')[0])
    page.click('[data-close-exercise]')
    page.wait_for_timeout(300)
    print('Modal hidden after close (reading):', 'hidden' in (page.get_attribute('#exerciseModal', 'class') or ''))

    # ---------------- WRITING ----------------
    page.click('[data-launch-exercise="writing"][data-launch-day="1"]')
    page.wait_for_timeout(200)
    page.click('#btnStartEx')
    page.wait_for_timeout(400)
    print('Writing textarea visible:', page.is_visible('#writingMain'))
    page.fill('#writingMain', 'The pie chart shows electricity generation sources. ' * 8)
    page.wait_for_timeout(200)
    print('Word count text:', page.text_content('#wordCount'))
    page.click('#btnRevealModel')
    page.wait_for_timeout(150)
    print('Model answer revealed:', page.is_visible('#modelAnswerBox'))
    page.click('[data-close-exercise]')
    page.wait_for_timeout(300)

    # ---------------- ANTI-CHEAT (simulate blur mid-exercise) ----------------
    page.click('[data-launch-exercise="speaking"][data-launch-day="1"]')
    page.wait_for_timeout(200)
    page.click('#btnStartEx')
    page.wait_for_timeout(900)  # let the start grace period expire
    print('Speaking stage visible pre-blur:', page.is_visible('#speakStage'))
    page.evaluate('window.dispatchEvent(new Event("blur"))')
    page.wait_for_timeout(300)
    cheat_text = page.text_content('#exerciseBody')
    print('Cheat screen triggered:', 'Attempt reset' in (cheat_text or ''))
    page.click('[data-close-exercise]')
    page.wait_for_timeout(300)
    print('Modal hidden after cheat-close:', 'hidden' in (page.get_attribute('#exerciseModal', 'class') or ''))

    browser.close()

print('\n--- console messages (last 40) ---')
for m in console_msgs[-40:]:
    print(m)
print('\n--- page errors ---')
for e in errors:
    print('ERROR:', e)

# Tailwind/Fonts CDN are blocked in this sandbox only (known env limitation) -
# filter those specific errors out before deciding pass/fail.
real_errors = [e for e in errors if 'tailwind' not in e.lower()]
if real_errors:
    sys.exit(1)
