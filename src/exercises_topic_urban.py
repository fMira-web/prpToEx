"""
Week 5 exercise content — topic: Urban Development & Housing.

Keyed by pattern letter (A-E), matching the exact task-title "shape" that
repeats across every week (see src/exercises_week1.py's days 1-5, which
define patterns A-E respectively). generate.py maps each day's (week, wd)
onto the correct pattern letter.
"""
from exercises_common import (
    COMMAND_WORD_READING, TASK1_CHART_CHECKLIST, TASK1_OVERVIEW_DRILL_CHECKLIST,
    TASK2_ESSAY_CHECKLIST, THESIS_CHECKLIST, SELF_CORRECTION_REFLECTION,
    FILLER_WORD_REFLECTION, VOCAB_REFLECTION,
)

EXERCISES = {

# ---------------------------------------------------------------- PATTERN A
# Listening: Section 1 Form Completion | Reading: Diagnostic Passage
# Writing: Task 1 Pie Chart | Speaking: Part 1 Natural Response Timing
"A": {
    "listening": {
        "title": "Elmsworth Council Housing Advice Line — Booking Call",
        "instructions": "Listen to the call once. Complete the booking form below using words and numbers from the recording.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Advisor", "text": "Good morning, Elmsworth Council Housing Advice Line, this is Robert."},
            {"speaker": "Caller", "text": "Hi, I'd like to book an appointment to talk about applying for social housing, if possible."},
            {"speaker": "Advisor", "text": "Of course. We run drop-in appointments every Tuesday and Thursday, nine till one."},
            {"speaker": "Caller", "text": "Thursday would suit me better. Can I get a slot then?"},
            {"speaker": "Advisor", "text": "Yes, I can fit you in at eleven fifteen. Could I take your name, please?"},
            {"speaker": "Caller", "text": "It's Fatima Ahsan. That's A-H-S-A-N."},
            {"speaker": "Advisor", "text": "Thank you. And what's the main reason for the appointment — is it a new application or a review of an existing one?"},
            {"speaker": "Caller", "text": "It's a new application. My landlord's selling the flat and I need to move out by December."},
            {"speaker": "Advisor", "text": "I see, that'll go down as urgent housing need. Could I take a contact number in case we need to reschedule?"},
            {"speaker": "Caller", "text": "07829 441 605."},
            {"speaker": "Advisor", "text": "Lovely. Please bring proof of identity and your current tenancy agreement to the appointment."},
            {"speaker": "Caller", "text": "Do I need anything else — payslips, maybe?"},
            {"speaker": "Advisor", "text": "Yes please, your last three payslips, or a benefits statement if that applies to you."},
            {"speaker": "Caller", "text": "Understood. And where do I go on the day?"},
            {"speaker": "Advisor", "text": "Reception on the ground floor of the Elmsworth Civic Centre — just give your name and they'll point you to room 4."},
            {"speaker": "Caller", "text": "Perfect, thank you so much."},
            {"speaker": "Advisor", "text": "You're welcome. See you Thursday, Fatima."},
        ],
        "formTitle": "Housing Advice Appointment — Booking",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Full name:", "answer": "Fatima Ahsan", "altAnswers": ["fatima ahsan"]},
            {"id": "q2", "type": "gap", "prompt": "Appointment day and time:", "answer": "Thursday, 11.15", "altAnswers": ["thursday at 11:15", "thursday 11:15am", "thursday eleven fifteen"]},
            {"id": "q3", "type": "gap", "prompt": "Reason for appointment:", "answer": "new application", "altAnswers": ["a new application", "applying for social housing"]},
            {"id": "q4", "type": "gap", "prompt": "Contact number:", "answer": "07829 441605", "altAnswers": ["07829441605", "07829 441 605"]},
            {"id": "q5", "type": "gap", "prompt": "Bring proof of ID and current:", "answer": "tenancy agreement", "altAnswers": ["a tenancy agreement", "current tenancy agreement"]},
            {"id": "q6", "type": "gap", "prompt": "Also bring:", "answer": "last three payslips", "altAnswers": ["three payslips", "payslips", "last 3 payslips"]},
            {"id": "q7", "type": "gap", "prompt": "On arrival, go to:", "answer": "room 4", "altAnswers": ["room four"]},
        ],
    },
    "reading": {
        "title": "Who Should Pay for Affordable Housing?",
        "passage": [
            "In cities across the world, the gap between average incomes and average house prices has widened steadily over the past two decades, prompting a fierce debate about who bears responsibility for restoring affordability. Some economists argue that the primary cause is simple: a chronic undersupply of new homes relative to demand, particularly in cities with strong job growth, and that the solution lies almost entirely in building more.",
            "Supporters of this supply-focused view point to cities that have relaxed planning restrictions and seen construction rates rise accordingly, alongside a subsequent, if modest, moderation in price growth. They argue that restrictive zoning laws, which in many cities prevent anything taller than a few storeys in large residential areas, artificially constrain the housing stock and push prices upward regardless of underlying demand.",
            "Critics of this framing, however, contend that supply alone cannot explain the crisis, since much of the housing built in recent years has been aimed at the luxury end of the market, doing little to help lower-income households. They argue that without direct government intervention — rent controls, subsidised housing quotas, or public investment in social housing — market forces alone will continue to favour profitable developments over genuinely affordable ones.",
            "A growing number of urban policy researchers now advocate for a combined approach: loosening restrictive zoning to increase overall supply, while simultaneously requiring that a fixed proportion of any new development be set aside as affordable units. Whether cities have the political will to pursue both strategies at once, rather than treating them as competing alternatives, may ultimately determine whether the affordability crisis eases or deepens.",
        ],
        "questions": [
            {"id": "q1", "type": "tfng", "prompt": "All economists agree that undersupply is the sole cause of the affordability crisis.", "answer": "False"},
            {"id": "q2", "type": "tfng", "prompt": "Cities that relaxed planning restrictions have seen construction rates increase.", "answer": "True"},
            {"id": "q3", "type": "tfng", "prompt": "Most newly built housing in recent years has targeted lower-income households.", "answer": "False"},
            {"id": "q4", "type": "mcq", "prompt": "According to critics of the supply-focused view, what is missing from that argument?",
             "options": ["Accurate price data", "Direct government intervention", "International comparisons", "Historical context"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "What approach do many urban policy researchers now recommend?",
             "options": ["Relying entirely on the free market", "Banning new luxury developments", "Combining relaxed zoning with affordable-housing quotas", "Freezing all rents nationally"], "answerIndex": 2},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the results of a survey asking residents of a large city what they considered the single biggest barrier to finding affordable housing in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "pie", "data": [
            {"label": "High rent/purchase prices", "value": 38, "color": "#818cf8"},
            {"label": "Limited housing supply", "value": 24, "color": "#34d399"},
            {"label": "Low or unstable income", "value": 18, "color": "#38bdf8"},
            {"label": "Strict landlord/lender requirements", "value": 12, "color": "#fbbf24"},
            {"label": "Other barriers", "value": 8, "color": "#94a3b8"},
        ]},
        "minWords": 150, "timeLimitMinutes": 20,
        "checklist": TASK1_CHART_CHECKLIST,
        "modelAnswer": "The pie chart illustrates residents' opinions on the single biggest barrier to finding affordable housing in a large city in 2024.\n\nOverall, cost-related factors were seen as the dominant obstacle, with structural issues such as supply and lending requirements playing a secondary role, and only a small proportion of residents citing other reasons.\n\nHigh rent and purchase prices were identified as the main barrier by 38% of respondents, comfortably the largest single category. This was followed by limited housing supply, cited by just under a quarter of residents at 24%, suggesting that many people connect high prices directly to a shortage of available homes.\n\nLow or unstable income was named by 18% of respondents, while strict landlord or lender requirements — such as demands for guarantors or high deposits — accounted for 12%. The remaining 8% pointed to other, unspecified barriers. In summary, affordability itself, rather than eligibility requirements, was perceived as the primary obstacle to housing access.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question immediately, within about 3-5 seconds of it appearing — don't translate in your head. Record your answer, then move to the next question.",
        "items": [
            {"prompt": "What type of housing do you currently live in?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Would you prefer to live in a city centre or the suburbs?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Do you think it's becoming harder for young people to afford housing?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Are there enough green spaces near where you live?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Do you know your neighbours well?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Would you rather rent or own a home?", "prepSeconds": 3, "speakSeconds": 30},
        ],
    },
},

# ---------------------------------------------------------------- PATTERN B
# Listening: Diagnostic Question-Type Recognition | Reading: Passage Structure Mapping
# Writing: Task 2 Thesis Statements | Speaking: Self-Correction Awareness
"B": {
    "listening": {
        "title": "Diagnostic: Question-Type Recognition",
        "instructions": "You'll hear four short, unrelated clips. After each one, decide which part of the IELTS Listening test (Section 1-4) it most resembles, based on the situation and number of speakers.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Clip A", "text": "Hi, I'm calling about the flat viewing on Bridge Street — is Saturday morning still available, and how many bedrooms does it have?"},
            {"speaker": "Clip B", "text": "Welcome to the Riverside Regeneration exhibition. As you walk through, the first section shows the site's industrial history, and the scale model of the finished development is in the room straight ahead."},
            {"speaker": "Clip C", "text": "For our group project on housing density, I think we should focus on mid-rise apartment blocks rather than high-rise towers, since the data's more complete. What do you two reckon?"},
            {"speaker": "Clip D", "text": "Today's lecture examines the long-term social effects of large-scale slum clearance programmes, beginning with the displacement of established communities in the 1960s."},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Clip A — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Clip B — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Clip C — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 2},
            {"id": "q4", "type": "mcq", "prompt": "Clip D — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 3},
        ],
    },
    "reading": {
        "title": "Should Historic City Centres Be Protected from New Development?",
        "passage": [
            "As cities grow and housing demand intensifies, planners are increasingly confronted with a difficult tension: whether to preserve historic city centres largely as they are, or to permit new, higher-density development within them to help ease housing shortages. A number of heritage advocates argue firmly that protection should take clear priority over expansion in these areas.",
            "Research into cities that have maintained strict heritage protections shows that such areas often sustain significant tourism revenue and civic pride over the long term, with visitor numbers to protected historic quarters frequently outperforming comparable but undesignated neighbourhoods. Local business owners in these areas also report that the distinctive character of the streetscape is central to their commercial appeal.",
            "Opponents of blanket protection counter that treating entire historic districts as effectively frozen in time worsens housing shortages precisely where transport links and services are already strongest, forcing lower-income residents further from the urban core. They argue that sensitive, architecturally sympathetic infill development can add housing without erasing a district's character, and that some heritage rules go far beyond protecting genuinely significant buildings.",
            "Increasingly, city authorities are experimenting with a middle path: designating only the most architecturally or historically significant structures for strict protection, while allowing careful, height-limited development on surrounding sites. Whether this compromise can deliver enough new housing to meaningfully address shortages, without eroding the qualities that make historic centres worth protecting in the first place, remains an open and closely watched question.",
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Which paragraph states the writer's main claim?", "options": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Which paragraph provides supporting evidence for that claim?", "options": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Which paragraph introduces a counter-argument?", "options": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], "answerIndex": 2},
            {"id": "q4", "type": "mcq", "prompt": "Which paragraph offers a concluding synthesis?", "options": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], "answerIndex": 3},
        ],
    },
    "writing": {
        "taskType": "Task 2",
        "prompt": "Some people believe that governments should prioritise building affordable high-density apartments in cities, while others believe that low-density suburban housing should remain the priority. Discuss both views and give your own opinion.",
        "chart": None, "minWords": 0, "timeLimitMinutes": 15,
        "checklist": THESIS_CHECKLIST,
        "modelAnswer": "Five sample thesis statements (for comparison, not to copy):\n1. Given the scale of the housing shortage, governments should prioritise high-density apartments over suburban expansion, despite the trade-offs involved.\n2. Suburban housing remains the better long-term priority, since it better matches most families' preferences and avoids overcrowding city infrastructure.\n3. Neither density nor sprawl should be treated as a universal priority; the right approach depends heavily on a city's existing transport and land constraints.\n4. Both positions ignore the deeper problem: without stronger public investment, neither high-density nor suburban housing will become genuinely affordable.\n5. A balanced strategy that increases density near transport hubs while preserving limited suburban growth serves cities better than committing fully to either extreme.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering the question below for about 40 seconds. Try to speak naturally — self-corrections are completely fine. Afterwards, use the transcript (or listen back) and note every place you corrected yourself or repeated a word.",
        "items": [
            {"prompt": "Do you think building more apartment towers is a good way to solve housing shortages in cities?", "prepSeconds": 10, "speakSeconds": 40},
        ],
        "reflectionPrompt": SELF_CORRECTION_REFLECTION,
    },
},

# ---------------------------------------------------------------- PATTERN C
# Listening: Section 1 MCQ Baseline | Reading: Command-Word Awareness
# Writing: Task 1 Overview Paragraph Drill | Speaking: Part 1 Fluency & Reflex
"C": {
    "listening": {
        "title": "'Building Better Cities' Talk — Booking Call",
        "instructions": "Listen to the call, then answer the multiple-choice questions below.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Hello, Elmsworth Central Library, events desk, this is Priya speaking."},
            {"speaker": "Caller", "text": "Hi, I saw a poster about a talk on the future of city housing next week — could I book a seat?"},
            {"speaker": "Officer", "text": "Of course! It's called 'Building Better Cities', on Wednesday evening at 6.30pm in the main hall."},
            {"speaker": "Caller", "text": "Is it free?"},
            {"speaker": "Officer", "text": "Yes, free entry, but seats are limited to 80, so booking is recommended."},
            {"speaker": "Caller", "text": "Great, I'll book two seats then, for myself and a colleague."},
            {"speaker": "Officer", "text": "No problem. Could I take a name for the booking?"},
            {"speaker": "Caller", "text": "Yes, it's Tomasz Nowak."},
            {"speaker": "Officer", "text": "Thanks. And a contact email, in case the event changes?"},
            {"speaker": "Caller", "text": "It's tomasz dot nowak at mailbox dot com."},
            {"speaker": "Officer", "text": "Got it. Do you need any accessibility support — a hearing loop, wheelchair access?"},
            {"speaker": "Caller", "text": "Actually yes, could you reserve two seats near the front? My colleague uses a wheelchair."},
            {"speaker": "Officer", "text": "Absolutely, I'll note that. The talk runs for about 90 minutes, with a Q and A afterwards."},
            {"speaker": "Caller", "text": "Perfect, thank you."},
            {"speaker": "Officer", "text": "You're welcome — see you Wednesday at 6.30!"},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "What is the event called?", "options": ["'Building Better Cities'", "'Homes of Tomorrow'", "'Urban Futures Forum'"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "When is it?", "options": ["Wednesday, 6.30pm", "Wednesday, 7pm", "Thursday, 6.30pm"], "answerIndex": 0},
            {"id": "q3", "type": "mcq", "prompt": "Is there a fee?", "options": ["Yes, £5", "Free entry", "Free, but donations welcome"], "answerIndex": 1},
            {"id": "q4", "type": "mcq", "prompt": "How many seats does the hall have in total?", "options": ["50", "80", "120"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "How many seats does the caller book?", "options": ["1", "2", "3"], "answerIndex": 1},
            {"id": "q6", "type": "mcq", "prompt": "What accessibility support is requested?", "options": ["A hearing loop", "Seats near the front (wheelchair user)", "A sign language interpreter"], "answerIndex": 1},
            {"id": "q7", "type": "mcq", "prompt": "How long does the talk run?", "options": ["45 minutes", "60 minutes", "90 minutes"], "answerIndex": 2},
            {"id": "q8", "type": "mcq", "prompt": "What happens after the talk?", "options": ["A film screening", "A Q and A", "A guided tour"], "answerIndex": 1},
        ],
    },
    "reading": COMMAND_WORD_READING,
    "writing": {
        "taskType": "Task 1",
        "prompt": "Below are three separate sets of chart data. For EACH one, write only the overview paragraph (2-3 sentences) — do not describe every individual figure, just the main trend(s).",
        "chart": None,
        "extraPrompts": [
            "Chart 1 (line graph): Average monthly rent for a one-bedroom city-centre flat in a major city, 2014-2024. Rent rose steadily from £650 in 2014 to £1,180 in 2024.",
            "Chart 2 (bar chart): Percentage of city residents commuting by different methods, 2023. Car: 42%, Public transport: 33%, Walking/cycling: 20%, Other: 5%.",
            "Chart 3 (table): Distribution of new housing permits granted by dwelling type in one city, 2023. High-rise apartments 46%, Terraced/townhouses 28%, Detached/semi-detached houses 18%, Other 8%.",
        ],
        "minWords": 0, "timeLimitMinutes": 45,
        "checklist": TASK1_OVERVIEW_DRILL_CHECKLIST,
        "modelAnswer": "Chart 1: Overall, average rent for a one-bedroom city-centre flat rose substantially over the period, growing by more than 80% and outpacing typical wage growth over the same decade.\n\nChart 2: Overall, the private car remained the most common way for residents to commute, though public transport and active travel combined accounted for over half of all journeys.\n\nChart 3: Overall, high-rise apartments made up by far the largest share of new housing permits, while detached and semi-detached houses accounted for the smallest proportion after other dwelling types.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question with no more than 5 seconds of thinking time. Don't worry about giving a long answer — the goal here is reflex, not depth.",
        "items": [
            {"prompt": "Do you live in a house or an apartment?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Is your area noisy or quiet?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you prefer old buildings or modern ones?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Have you ever moved house?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Is public transport reliable where you live?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you walk a lot in your city?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Would you like to live somewhere greener?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "How long is your daily commute?", "prepSeconds": 5, "speakSeconds": 20},
        ],
    },
},

# ---------------------------------------------------------------- PATTERN D
# Listening: British Accent Calibration | Reading: Timed Paragraph Skim
# Writing: Task 2 Diagnostic Essay | Speaking: Diagnostic Recorded Interview
"D": {
    "listening": {
        "title": "British Accent Calibration",
        "instructions": "Listen to the guide's introduction, then answer the comprehension questions. Note down any words whose pronunciation or meaning surprised you.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Guide", "text": "Good afternoon, and welcome to the Greenfield Quarter show home here on the edge of the new development. My name's Charlotte, and I'll be showing you round over the next thirty minutes or so, so do stop me at any point if something catches your eye. This particular plot is one of our two-bedroom terraced designs, and it's fully furnished so you can get a proper feel for the layout rather than just looking at an empty shell, which is what a lot of visitors tell us they find most useful. We'll start downstairs in the open-plan kitchen and living area, which looks out onto a small private garden — do have a wander, though I'd ask you not to sit on the display furniture, as several pieces are on loan from our supplier and rather awkward to replace. The kitchen itself comes fitted as standard, so what you see is genuinely what you'd get, right down to the appliances. Upstairs, you'll find the two bedrooms and a family bathroom; the smaller of the two bedrooms has been dressed as a home office, which tends to be popular with buyers who work remotely, though of course it can just as easily be a nursery or a guest room. One thing worth mentioning is that the development includes a car-free central square, so residents' parking is provided in a shared area just off the main road rather than outside individual homes — that surprises quite a few visitors at first, though most say they come to appreciate the quieter street once they've lived here a while. Towards the back of the site, there's a communal orchard and allotment space that residents can apply to use, which was only planted last autumn, so it'll be a good few years before the fruit trees are properly established. There's also a small community hall booked out for residents' meetings and children's activities on weekends. Please note that photography is welcome throughout the show home, but the sales office next door, which holds some commercially sensitive pricing documents, is strictly no photography, I'm afraid. If you have any questions as we go, do ask — right, shall we start in the kitchen?"},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "What kind of property is the show home?", "options": ["A one-bedroom flat", "A two-bedroom terraced house", "A detached family house"], "answerIndex": 1},
            {"id": "q2", "type": "mcq", "prompt": "What are visitors asked NOT to do?", "options": ["Take photographs in the show home", "Sit on the display furniture", "Visit the upstairs bedrooms"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Where is residents' parking located?", "options": ["Outside individual homes", "In a shared area off the main road", "There is no parking provided"], "answerIndex": 1},
        ],
        "reflectionPrompt": VOCAB_REFLECTION,
    },
    "reading": {
        "title": "Timed Paragraph Skim",
        "instructions": "You have 90 seconds per paragraph. Read it, then write a one-sentence summary before moving on — try not to reread.",
        "passage": [
            "The '15-minute city' concept proposes that residents should be able to reach most daily necessities — work, shops, schools, healthcare and green space — within a 15-minute walk or cycle of home. Proponents argue it reduces car dependency and strengthens local community ties, while some critics have raised concerns, often unfounded, that such planning restricts residents' freedom of movement.",
            "Co-living developments, in which residents have private bedrooms but share kitchens, lounges and other facilities, have grown rapidly in expensive cities as a response to soaring rents. Supporters argue they offer affordability and built-in community for young professionals, while critics note that per-square-metre rents in some schemes are actually higher than in a shared conventional flat.",
            "Gentrification, the process by which rising property values and an influx of wealthier residents transform a previously lower-income neighbourhood, remains one of the most contested topics in urban studies. While it can bring improved infrastructure and reduced crime, long-term residents are often displaced as rents rise beyond what they can afford.",
            "Green roofs and vertical gardens, once a niche architectural feature reserved for showcase buildings, are increasingly required by city building codes as a practical response to urban heat and flooding. Beyond their environmental benefits, several studies have linked visible greenery on buildings to measurable improvements in residents' reported wellbeing and even lower reported stress.",
            "Homelessness policy has shifted in many cities towards a 'housing first' model, which provides permanent housing before addressing other issues such as employment or addiction, rather than requiring people to meet strict conditions before being housed at all. Early evidence from several pilot programmes suggests higher long-term housing stability compared with traditional, condition-based approaches.",
            "Smart city technology, including sensors that monitor traffic flow, air quality and energy use in real time, is increasingly used by city planners to make faster, better-informed, data-driven decisions about where to invest. Critics caution that such systems raise significant questions about data privacy and who ultimately controls, and profits from, the information collected.",
        ],
        "skimSecondsPerParagraph": 90,
        "modelSummaries": [
            "The 15-minute city aims to put daily essentials within a short walk, though some wrongly fear it limits freedom of movement.",
            "Co-living offers affordability and community but can sometimes cost more per square metre than a shared flat.",
            "Gentrification can improve neighbourhoods but often displaces the long-term residents who lived there before.",
            "Green roofs tackle urban heat and flooding while also boosting residents' wellbeing.",
            "'Housing first' policies house homeless people before tackling other issues, and show promising long-term results.",
            "Smart city sensors help planners make data-driven decisions but raise privacy and control concerns.",
        ],
        "questions": [],
    },
    "writing": {
        "taskType": "Task 2",
        "prompt": "Some people believe that rapid urban development benefits a city's economy more than it harms local communities, while others believe the social costs outweigh the economic gains. Discuss both views and give your own opinion. Write at least 250 words.",
        "chart": None, "minWords": 250, "timeLimitMinutes": 0,
        "checklist": TASK2_ESSAY_CHECKLIST,
        "modelAnswer": "Rapid urban development has transformed cities around the world, and opinion remains sharply divided over whether its economic benefits outweigh its social costs. This essay will consider both perspectives before offering my own view.\n\nThose who emphasise the economic benefits point to the jobs created during construction, the increased tax revenue that funds public services, and the way new infrastructure can attract further investment and skilled workers to a city. Redeveloped districts often see a marked rise in local business activity, as new residents and workers create demand for shops, restaurants and services that previously struggled to survive.\n\nOthers, however, argue that these economic gains frequently come at the expense of established communities. Rising property values can price out long-term residents, a process widely known as gentrification, while small independent businesses are often replaced by chains that can afford higher commercial rents. Critics also note that rapid development can place unsustainable strain on transport, schools and healthcare services if infrastructure investment fails to keep pace with population growth.\n\nIn my view, the two outcomes are not inevitable opposites: cities that pair development with proactive protections — such as affordable housing quotas, rent stabilisation measures and support for existing small businesses — can capture much of the economic upside while limiting displacement. Development that proceeds without such safeguards, by contrast, tends to concentrate benefits among newcomers and investors while imposing costs on those least able to absorb them.\n\nIn conclusion, whether urban development ultimately benefits or harms a community depends less on the pace of growth itself than on the policies that accompany it.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering all six questions as though this were the real Part 1 interview. Afterwards, count how many times you said 'um', 'uh', or similar filler words.",
        "items": [
            {"prompt": "Let's talk about your hometown. What is it like?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Has your hometown changed much in recent years?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think cities are becoming too crowded?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "What kind of housing would you like to live in one day?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you prefer living near the city centre or further out?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "What could be done to improve housing in your area?", "prepSeconds": 5, "speakSeconds": 45},
        ],
        "reflectionPrompt": FILLER_WORD_REFLECTION,
    },
},

# ---------------------------------------------------------------- PATTERN E
# Listening: Keyword Prediction Drill | Reading: Skimming & Scanning Basics
# Writing: Task 1 Bar Chart Basics | Speaking: Personal-Topic Extension
"E": {
    "listening": {
        "title": "Keyword Prediction Drill",
        "instructions": "First, look at the note-completion form below and type what word or type of word you'd PREDICT for each gap (e.g. a number, a place name). Then press Play, listen, and reveal the real answers to check your predictions.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Hi, thanks for calling about the community allotment scheme."},
            {"speaker": "Caller", "text": "Hi, yes, I live nearby and saw the noticeboard — I'd like to register for a plot."},
            {"speaker": "Officer", "text": "Great, the next open registration day is Saturday the 14th, from 10 till 1, at the Fenwick Road allotments."},
            {"speaker": "Caller", "text": "Is there a fee?"},
            {"speaker": "Officer", "text": "It's £15 a year for residents of the surrounding estate."},
            {"speaker": "Caller", "text": "That's me. Do I need to bring anything?"},
            {"speaker": "Officer", "text": "Just proof of address — we'll cover plot sizes and the waiting list on the day."},
            {"speaker": "Caller", "text": "Sounds good. Is there a limit on plots?"},
            {"speaker": "Officer", "text": "Yes, we only have 30 plots available this year, so I'd register early if you're keen."},
            {"speaker": "Caller", "text": "I'll come along then. What's the best way to reserve a spot on the day?"},
            {"speaker": "Officer", "text": "Just give me your full name and an email address, and I'll add you to the list."},
            {"speaker": "Caller", "text": "It's Bethany Wallace, and the email is bwallace at postbox dot co dot uk."},
            {"speaker": "Officer", "text": "Lovely, you're on the list."},
        ],
        "formTitle": "Community Allotment Scheme — Registration",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Date: Saturday the ___", "answer": "14th", "altAnswers": ["14", "fourteenth"]},
            {"id": "q2", "type": "gap", "prompt": "Time:", "answer": "10 to 1", "altAnswers": ["10-1", "10 till 1", "10am to 1pm"]},
            {"id": "q3", "type": "gap", "prompt": "Location: ___ Road allotments", "answer": "Fenwick", "altAnswers": []},
            {"id": "q4", "type": "gap", "prompt": "Annual fee for residents:", "answer": "£15", "altAnswers": ["15", "fifteen pounds"]},
            {"id": "q5", "type": "gap", "prompt": "Bring:", "answer": "proof of address", "altAnswers": ["proof of address only", "address proof"]},
            {"id": "q6", "type": "gap", "prompt": "Number of plots available this year:", "answer": "30", "altAnswers": ["thirty"]},
            {"id": "q7", "type": "gap", "prompt": "Caller's full name:", "answer": "Bethany Wallace", "altAnswers": ["bethany wallace"]},
        ],
        "predictionMode": True,
    },
    "reading": {
        "title": "Skimming & Scanning Basics",
        "instructions": "You have 60 seconds to skim each short passage. Then identify which numbered sentence is the true topic sentence (the one stating the paragraph's main idea).",
        "passage": [
            "Micro-Apartments in Dense Cities\n\n(1) Floor space in some new city-centre developments has shrunk to as little as 15 square metres per unit. (2) Micro-apartments have emerged as one response to acute housing shortages, packing clever storage and multi-purpose furniture into a minimal footprint. (3) Housing charities have warned that such units should never become the only affordable option available to low-income renters.",
            "Public Transport and Car Dependency\n\n(1) Cities built primarily around private car use often struggle to retrofit efficient public transport decades later. (2) As a result, many urban planners now argue that transport investment decisions made today will shape a city's car dependency for generations to come. (3) Some cities have responded by expanding light rail networks and introducing dedicated bus lanes.",
        ],
        "skimSecondsPerParagraph": 60,
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Passage 1 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 1},
            {"id": "q2", "type": "mcq", "prompt": "Passage 2 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 1},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the percentage of the population living in high-rise apartment buildings in four cities in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "bar", "data": [
            {"label": "City A", "value": 62, "color": "#10b981"},
            {"label": "City B", "value": 45, "color": "#6366f1"},
            {"label": "City C", "value": 28, "color": "#f59e0b"},
            {"label": "City D", "value": 71, "color": "#ec4899"},
        ]},
        "minWords": 150, "timeLimitMinutes": 20,
        "checklist": TASK1_CHART_CHECKLIST,
        "modelAnswer": "The bar chart shows the proportion of the population living in high-rise apartment buildings in four different cities in 2023.\n\nOverall, City D had by far the highest share of residents in high-rise housing, while City C had the lowest, with a gap of 43 percentage points separating them.\n\nCity D led with 71% of its population living in high-rise apartments, ahead of City A at 62%. City B trailed some way behind these two, with 45% of residents in such housing, while City C had the lowest figure of all, at just 28% — less than half the proportion seen in City D.\n\nIn summary, reliance on high-rise living varied considerably across the four cities, with more than forty percentage points separating the highest and lowest figures.",
    },
    "speaking": {
        "part": 1,
        "instructions": "For each prompt, give a one-sentence answer first, then extend it to three sentences by adding a reason and an example. Record the extended version.",
        "items": [
            {"prompt": "Do you enjoy spending time in parks or green spaces?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Is housing expensive where you live?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Would you consider living in a smaller home to save money?", "prepSeconds": 10, "speakSeconds": 45},
        ],
    },
},

}
