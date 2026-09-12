import sys
from playwright.sync_api import sync_playwright

errors = []
console_msgs = []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/opt/pw-browsers/chromium/chrome-linux/chrome' if False else None)
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    page.on('console', lambda msg: console_msgs.append(f'{msg.type}: {msg.text}'))
    page.on('pageerror', lambda exc: errors.append(str(exc)))

    page.goto('file:///home/claude/ielts-roadmap/index.html')
    page.wait_for_timeout(1200)

    print('timerModal visible at load (should be False):', page.is_visible('#timerModal'))
    print('aboutModal visible at load (should be False):', page.is_visible('#aboutModal'))

    # basic checks
    day_rows = page.query_selector_all('.day-row')
    print('day rows found:', len(day_rows))

    month_sections = page.query_selector_all('.month-section')
    print('month sections found:', len(month_sections))

    stat_done = page.text_content('#statDone')
    print('statDone initial:', stat_done)

    page.screenshot(path='shot_initial.png', full_page=False)

    # expand month 1 -> already open by default; expand week1 already open; click a day row to expand detail
    first_day_toggle = page.query_selector('[data-day-toggle="1"]')
    first_day_toggle.click()
    page.wait_for_timeout(500)
    detail = page.query_selector('[data-day-inner="1"]')
    print('day1 detail text length:', len((detail.inner_text() if detail else '') or ''))
    page.screenshot(path='shot_day_expanded.png', full_page=False)

    # test checkbox toggle + progress update
    cb = page.query_selector('[data-day-check="1"]')
    cb.click()
    page.wait_for_timeout(300)
    print('statDone after check:', page.text_content('#statDone'))
    print('statPercent after check:', page.text_content('#statPercent'))

    # test search filter
    page.fill('#searchInput', 'inversion')
    page.wait_for_timeout(400)
    filter_status = page.text_content('#filterStatus')
    print('filter status (inversion):', filter_status)
    page.screenshot(path='shot_search.png', full_page=False)

    page.fill('#searchInput', '')
    page.wait_for_timeout(300)

    # test skill chip filter
    page.query_selector('[data-chip="Speaking"]').click()
    page.wait_for_timeout(400)
    print('filter status (Speaking chip):', page.text_content('#filterStatus'))
    page.query_selector('[data-chip="Speaking"]').click()
    page.wait_for_timeout(300)

    # test timer modal open
    page.click('#btnTimer')
    page.wait_for_timeout(300)
    timer_visible = page.is_visible('#timerModal')
    print('timer modal visible:', timer_visible)
    page.screenshot(path='shot_timer.png', full_page=False)
    page.click('[data-close-timer]')
    page.wait_for_timeout(200)

    # test about modal
    page.click('#btnAbout')
    page.wait_for_timeout(300)
    print('about modal visible:', page.is_visible('#aboutModal'))
    page.click('[data-close-about]')

    # expand all
    page.click('#btnExpandAll')
    page.wait_for_timeout(500)
    open_months = page.query_selector_all('.accordion.open')
    print('open accordions after expand all:', len(open_months))

    # reload to test persistence (localStorage file:// works in Chromium per-origin)
    page.reload()
    page.wait_for_timeout(800)
    print('statDone after reload (persistence check):', page.text_content('#statDone'))

    browser.close()

print('\\n--- console messages (last 30) ---')
for m in console_msgs[-30:]:
    print(m)
print('\\n--- page errors ---')
for e in errors:
    print('ERROR:', e)

if errors:
    sys.exit(1)
