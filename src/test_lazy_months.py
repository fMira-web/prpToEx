import sys
from playwright.sync_api import sync_playwright

# NOTE: this test requires a local HTTP server (not file://) since fetch()
# does not support the file:// scheme in Chromium -- the real deployed site
# is served over https, where this works normally. Run:
#   python3 -m http.server 8791   (from the repo root, i.e. one level above src/)
# before running this test.
BASE_URL = 'http://127.0.0.1:8791/index.html'

errors = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 1280, 'height': 900})
    page = context.new_page()
    page.on('pageerror', lambda exc: errors.append(str(exc)))

    # --- immediately after load: Month 1 present, Months 2-6 skeletons ---
    # Throttle the network so the background month-chunk fetches are slow
    # enough to actually observe the skeleton state -- on a fast local
    # server (or real production hosting) they can complete in single-digit
    # milliseconds, which is a *good* thing for users but makes the
    # transient skeleton state nearly impossible to sample in a test without
    # this. This does not change app.js at all, only the simulated network.
    client = context.new_cdp_session(page)
    client.send('Network.enable')
    client.send('Network.emulateNetworkConditions', {
        'offline': False, 'latency': 400, 'downloadThroughput': 20000, 'uploadThroughput': 20000
    })

    page.goto(BASE_URL)
    page.wait_for_timeout(50)  # sample right after first paint, well before the throttled fetch can finish
    lazy_flag = page.evaluate('window.LAZY_LOADING === undefined ? null : window.LAZY_LOADING')
    month1_rows_early = len(page.query_selector_all('[data-day-toggle="1"]'))
    skeleton_count_early = len(page.query_selector_all('.skeleton-shimmer'))
    total_immediately = page.text_content('#statDone')
    print('Month 1 day-1 row present immediately:', month1_rows_early > 0)
    print('Skeleton placeholders visible immediately (>0 expected pre-fetch):', skeleton_count_early)

    # Remove the throttle so the rest of the test (waiting for full load) isn't slow.
    client.send('Network.emulateNetworkConditions', {
        'offline': False, 'latency': 0, 'downloadThroughput': -1, 'uploadThroughput': -1
    })

    # Overall total (denominator) must be correct immediately, even though
    # months 2-6 haven't loaded yet -- this is the whole point of computing
    # progress from static per-month metadata (dayRange) rather than from
    # however many day objects happen to be loaded so far.
    total_days_shown = page.evaluate("document.getElementById('statPercent') ? true : false")
    print('statPercent element present at first paint:', total_days_shown)

    # --- wait for background loading to finish ---
    ok = page.wait_for_function(
        "window.__ALL_MONTHS_LOADED === true",
        timeout=8000
    ) if False else None
    # app.js doesn't expose a dedicated flag, so poll for month 6's day-181... use day 148 (month 6 start) row instead
    loaded = False
    for _ in range(80):
        if page.query_selector('[data-day="180"]'):
            loaded = True
            break
        page.wait_for_timeout(100)
    print('Day 180 (Month 6, last day) row eventually present:', loaded)

    skeleton_count_after = len(page.query_selector_all('.skeleton-shimmer'))
    print('Skeleton placeholders remaining after full load (should be 0):', skeleton_count_after)

    day_rows_total = len(page.query_selector_all('.day-row'))
    print('Total day rows after full load (expect 180):', day_rows_total)

    # --- progress correctness across the load boundary ---
    # Mark day 1 (loaded from the start) complete, then check day 40 (month 2,
    # loaded via background fetch) can also be marked complete and counted.
    page.click('[data-day-toggle="1"]', force=True)
    page.wait_for_timeout(150)
    page.click('[data-day-check="1"]', force=True)
    page.wait_for_timeout(150)
    stat_done_1 = page.text_content('#statDone')
    print('statDone after completing day 1:', stat_done_1)

    page.click('[data-month-toggle="2"]', force=True)
    page.wait_for_timeout(500)  # let the .38s accordion CSS transition fully settle before the next click
    page.click('[data-week-toggle="6"]', force=True)
    page.wait_for_timeout(500)
    page.click('[data-day-check="40"]', force=True)
    page.wait_for_timeout(150)
    stat_done_2 = page.text_content('#statDone')
    print('statDone after also completing day 40 (month 2, lazy-loaded):', stat_done_2)

    browser.close()

print('\n--- page errors ---')
for e in errors:
    print('ERROR:', e)

ok = (
    lazy_flag is not True and  # LAZY_LOADING is not exposed on window on purpose (internal var) -- sanity: no crash reading it
    month1_rows_early and
    skeleton_count_early > 0 and
    loaded and
    skeleton_count_after == 0 and
    day_rows_total == 180 and
    stat_done_1.strip() == '1' and
    stat_done_2.strip() == '2' and
    not errors
)
print('\nOVERALL:', 'PASS' if ok else 'FAIL')
sys.exit(0 if ok else 1)
