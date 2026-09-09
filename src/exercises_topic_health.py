"""
Week 4 exercise content — topic: Health & Wellbeing.

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
        "title": "Willowbrook Wellbeing Clinic — Sleep Assessment Booking",
        "instructions": "Listen to the call once. Complete the booking form below using words and numbers from the recording.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Receptionist", "text": "Good morning, Willowbrook Wellbeing Clinic, this is Grace speaking."},
            {"speaker": "Caller", "text": "Oh, hello — I picked up a leaflet about your sleep assessment service. I've been struggling to sleep properly for a few months now."},
            {"speaker": "Receptionist", "text": "I'm sorry to hear that. We run a sleep and screen-time assessment every Monday and Thursday afternoon, from 1 till 4pm. Would you like to book a slot?"},
            {"speaker": "Caller", "text": "Yes please, that would be great."},
            {"speaker": "Receptionist", "text": "Lovely. Could I take your full name?"},
            {"speaker": "Caller", "text": "It's Thomas Ashworth — that's A-S-H-W-O-R-T-H."},
            {"speaker": "Receptionist", "text": "Thanks, Thomas. And a contact number, in case we need to reschedule?"},
            {"speaker": "Caller", "text": "Of course, it's 07923 445 761."},
            {"speaker": "Receptionist", "text": "Perfect. Your first appointment will be with one of our sleep advisors, and it lasts around 45 minutes."},
            {"speaker": "Caller", "text": "Is there anything I should bring?"},
            {"speaker": "Receptionist", "text": "Please bring a completed sleep diary — we'll email you the template — covering the two weeks before your appointment. There's also a consultation fee of £15, payable on the day, though it's waived if you've been referred by a GP."},
            {"speaker": "Caller", "text": "I haven't been referred, so I'll pay on the day. Is there anything else I should know?"},
            {"speaker": "Receptionist", "text": "Just one more thing — we'd recommend avoiding screens, so phones and tablets, for at least an hour before bed in the two weeks leading up to your appointment, so the diary reflects that properly."},
            {"speaker": "Caller", "text": "Understood, thank you."},
            {"speaker": "Receptionist", "text": "You're very welcome — we'll see you Thursday."},
        ],
        "formTitle": "Sleep & Screen-Time Assessment — Booking",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Full name:", "answer": "Thomas Ashworth", "altAnswers": ["thomas ashworth"]},
            {"id": "q2", "type": "gap", "prompt": "Contact number:", "answer": "07923 445 761", "altAnswers": ["07923445761", "07923 445761"]},
            {"id": "q3", "type": "gap", "prompt": "Appointment length:", "answer": "45 minutes", "altAnswers": ["45 mins", "forty-five minutes"]},
            {"id": "q4", "type": "gap", "prompt": "Bring:", "answer": "a completed sleep diary", "altAnswers": ["completed sleep diary", "sleep diary"]},
            {"id": "q5", "type": "gap", "prompt": "Consultation fee (£):", "answer": "15", "altAnswers": ["£15", "fifteen"]},
            {"id": "q6", "type": "gap", "prompt": "Fee is waived if:", "answer": "referred by a GP", "altAnswers": ["referred by your GP", "GP referral", "referred by their GP"]},
            {"id": "q7", "type": "gap", "prompt": "Recommended: avoid screens for at least ___ before bed", "answer": "an hour", "altAnswers": ["1 hour", "one hour"]},
        ],
    },
    "reading": {
        "title": "Is the Four-Day Work Week Good for Our Health?",
        "passage": [
            "Over the past few years, a growing number of organisations across Europe, North America and parts of Asia have trialled a four-day working week, typically compressing a standard forty-hour role into four longer days rather than five shorter ones. What began as a fringe experiment among a handful of small firms has, in some countries, expanded into large-scale pilot programmes involving thousands of employees across dozens of industries. Advocates frame the shift primarily as a wellbeing measure rather than simply a scheduling change, arguing that an additional day of rest each week gives employees more time to recover from work-related stress, exercise, sleep and attend to family or medical needs that might otherwise be squeezed into evenings and weekends. Sceptics, meanwhile, question whether such gains are sustainable once the novelty of a pilot scheme wears off.",
            "The evidence gathered so far is, on balance, encouraging. In one widely cited UK-based trial spanning several dozen companies, a majority of participating organisations reported that measures of staff burnout fell over the six-month pilot period, while self-reported sleep quality and job satisfaction both improved. Notably, most participating firms chose to continue the policy after the trial concluded, suggesting that the benefits, at least from an employer's perspective, outweighed any operational disruption. Proponents also point to a body of earlier research linking chronic overwork to a heightened risk of cardiovascular problems and anxiety disorders, arguing that a shorter week functions as a preventative health measure rather than a mere perk. Productivity, perhaps counter-intuitively, did not fall in most trials; several organisations reported output holding steady or even rising slightly, which researchers attribute to employees working with greater focus during their four days.",
            "Not everyone is convinced the model can be applied broadly. Critics point out that most published trials have involved office-based or knowledge-sector roles, where tasks can be reorganised relatively easily, and argue that the findings may not transfer to sectors such as healthcare, hospitality or manufacturing, where staffing a fifth day is often unavoidable regardless of how hours are distributed. Some occupational health researchers have also raised a more subtle concern: compressing the same workload into four days can, for certain roles, mean longer and more intense daily shifts, which may offset any wellbeing gains from the extra day off. A handful of pilot organisations have quietly abandoned the scheme after finding that client demands did not shrink to match the reduced availability of staff.",
            "Taken together, the research paints a cautiously optimistic but incomplete picture. Most published evidence does suggest measurable wellbeing benefits, at least in sectors where the model has been tested, yet few studies have tracked outcomes beyond a year or two, leaving open questions about whether early gains persist once initial enthusiasm fades. Public health specialists broadly welcome the trend as one piece of a much larger effort to reduce work-related stress, while cautioning that a four-day week is unlikely to compensate for genuinely excessive workloads simply redistributed across fewer days. For now, most commentators agree that the policy deserves further, longer-term study before any government mandates it more broadly, rather than either wholesale adoption or dismissal.",
        ],
        "questions": [
            {"id": "q1", "type": "tfng", "prompt": "All published trials of the four-day work week described in the passage have involved employees in the healthcare sector.", "answer": "False"},
            {"id": "q2", "type": "tfng", "prompt": "In the UK-based trial mentioned, most participating organisations chose to keep the four-day week after the pilot ended.", "answer": "True"},
            {"id": "q3", "type": "tfng", "prompt": "According to the passage, productivity fell in most of the trials described.", "answer": "False"},
            {"id": "q4", "type": "mcq", "prompt": "According to paragraph 3, in which types of sectors do critics say the four-day week model may be harder to apply?",
             "options": ["Office-based and knowledge-sector roles", "Healthcare, hospitality and manufacturing", "Technology and finance", "Education and research"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "What is the overall stance of paragraph 4 regarding the four-day work week?",
             "options": ["It should be adopted immediately by all governments", "It should be dismissed as ineffective", "The evidence is promising but more long-term research is needed", "It has been proven to have no effect on wellbeing"], "answerIndex": 2},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the results of a survey in which 500 adults were asked to identify the single biggest barrier preventing them from living a healthier lifestyle. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "pie", "data": [
            {"label": "Lack of time", "value": 34, "color": "#f472b6"},
            {"label": "Cost of healthy food", "value": 24, "color": "#34d399"},
            {"label": "Lack of motivation", "value": 18, "color": "#60a5fa"},
            {"label": "Not knowing where to start", "value": 14, "color": "#fbbf24"},
            {"label": "Other reasons", "value": 10, "color": "#94a3b8"},
        ]},
        "minWords": 150, "timeLimitMinutes": 20,
        "checklist": TASK1_CHART_CHECKLIST,
        "modelAnswer": "The pie chart illustrates the results of a survey in which 500 adults were asked to identify the single biggest barrier preventing them from living a healthier lifestyle.\n\nOverall, a lack of time was cited as the most common obstacle, while the remaining reasons were spread fairly evenly across cost, motivation and a lack of information. Practical constraints outweighed purely psychological ones as the dominant barrier reported.\n\nA lack of time was identified by the largest proportion of respondents, at 34%, considerably ahead of the second most common answer, the cost of healthy food, at 24%. Together, these two practical barriers accounted for well over half of all responses. A lack of motivation was reported by 18% of respondents, only slightly ahead of not knowing where to start, at 14%.\n\nThe remaining 10% of respondents cited other, unspecified reasons. In summary, practical obstacles — time and cost — appear to present a greater challenge to healthier living than either motivation or a lack of information, at least according to this sample.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question immediately, within about 3-5 seconds of it appearing — don't translate in your head. Record your answer, then move to the next question.",
        "items": [
            {"prompt": "How many hours of sleep do you usually get each night?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Do you do any form of regular exercise?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "What do you typically eat for breakfast?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Do you find it easy to relax after a busy day?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Have you ever used a fitness or wellness app?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Would you say stress is a big part of your daily life?", "prepSeconds": 3, "speakSeconds": 30},
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
            {"speaker": "Clip A", "text": "Hi, I'm calling about the six-week beginners' Pilates course you're running — could you tell me if there's still space, and how much it costs for the full course?"},
            {"speaker": "Clip B", "text": "Welcome to the Wellbeing Pavilion. As you come through the entrance, the nutrition and healthy-eating stand is on your right, and the free blood-pressure and health-screening area is at the far end of the hall, just past the mental health support stand."},
            {"speaker": "Clip C", "text": "For our seminar on telemedicine, I think we should focus on rural access rather than cost, since that's where the data's strongest. Do you both agree, or should we cover both angles?"},
            {"speaker": "Clip D", "text": "Today's lecture examines how an ageing population is reshaping healthcare systems, beginning with the rising demand for long-term chronic disease management among the over-65s."},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Clip A — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Clip B — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Clip C — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 2},
            {"id": "q4", "type": "mcq", "prompt": "Clip D — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 3},
        ],
    },
    "reading": {
        "title": "Should Sugar Taxes Be Used to Fight Obesity?",
        "passage": [
            "Public health authorities in a growing number of countries have introduced taxes on sugar-sweetened beverages, arguing that such measures are among the most effective tools available for tackling rising rates of obesity and related conditions such as type 2 diabetes. The central claim made by supporters is straightforward: if manufacturers pass the tax on to consumers through higher prices, demand for the taxed products should fall, particularly among price-sensitive shoppers, nudging overall dietary patterns in a healthier direction without requiring individuals to rely on willpower alone.",
            "Several national and city-level case studies lend some support to this claim. Following the introduction of a sugar tax, one country reported that manufacturers reformulated a large proportion of soft drinks to fall below the taxed sugar threshold, effectively reducing sugar intake across the population without consumers even changing their shopping habits. A separate study of a major city that introduced a similar levy recorded a measurable decline in sales of sugary drinks within eighteen months, alongside a smaller, though still notable, rise in sales of bottled water and diet alternatives.",
            "Critics, however, argue that sugar taxes are a regressive policy that places a disproportionate financial burden on lower-income households, who tend to spend a larger share of their income on food and drink and may not have easy access to healthier, often pricier, alternatives. Others question whether the measured effects are large enough to meaningfully shift obesity rates, noting that sugary drinks represent only one source of excess sugar in most diets, and that consumers may simply substitute the money saved for other sugary snacks the tax does not cover.",
            "On balance, most public health researchers now view sugar taxes as a useful, if partial, tool rather than a standalone solution. The clearest evidence of impact comes from reformulation — taxes appear more effective at changing what manufacturers produce than at directly changing consumer behaviour — suggesting that taxation works best when combined with other measures, such as restrictions on advertising to children and clearer nutritional labelling, rather than being relied upon in isolation.",
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
        "prompt": "Some people believe that governments should tax unhealthy processed foods and sugary drinks in order to improve public health, while others believe this unfairly interferes with individual freedom of choice. Discuss both views and give your own opinion.",
        "chart": None, "minWords": 0, "timeLimitMinutes": 15,
        "checklist": THESIS_CHECKLIST,
        "modelAnswer": "Five sample thesis statements (for comparison, not to copy):\n1. Although taxing unhealthy food raises valid concerns about personal freedom, the public health benefits of reduced sugar consumption justify the intervention.\n2. Taxing processed foods does little to change behaviour and instead punishes low-income consumers who have the fewest affordable alternatives.\n3. Whether a sugar tax genuinely improves public health depends less on the tax itself than on whether the revenue is reinvested in healthier food access.\n4. Government intervention in diet should focus on education and clearer labelling rather than taxation, which addresses symptoms rather than causes.\n5. A carefully designed tax, paired with subsidies for healthy alternatives, offers the most balanced route between individual choice and public health.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering the question below for about 40 seconds. Try to speak naturally — self-corrections are completely fine. Afterwards, use the transcript (or listen back) and note every place you corrected yourself or repeated a word.",
        "items": [
            {"prompt": "Do you think people today are more health-conscious than in the past?", "prepSeconds": 10, "speakSeconds": 40},
        ],
        "reflectionPrompt": SELF_CORRECTION_REFLECTION,
    },
},

# ---------------------------------------------------------------- PATTERN C
# Listening: Section 1 MCQ Baseline | Reading: Command-Word Awareness
# Writing: Task 1 Overview Paragraph Drill | Speaking: Part 1 Fluency & Reflex
"C": {
    "listening": {
        "title": "'Mind & Body' Workplace Wellbeing Workshop — Booking Call",
        "instructions": "Listen to the call, then answer the multiple-choice questions below.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Good afternoon, Evershaw Community Hub, this is Ben speaking."},
            {"speaker": "Caller", "text": "Hi Ben, I saw a poster for a wellbeing workshop — could I book on to it?"},
            {"speaker": "Officer", "text": "Of course — that's our 'Mind & Body' Workplace Wellbeing Workshop, running this coming Saturday from 10am to 1pm."},
            {"speaker": "Caller", "text": "Is there a cost?"},
            {"speaker": "Officer", "text": "It's £12 per person, or £8 each if you book as part of a group of three or more."},
            {"speaker": "Caller", "text": "I'll just be booking for myself, so it'll be £12 then."},
            {"speaker": "Officer", "text": "That's fine. We can take up to 30 people in the room, and so far we've got 18 booked in."},
            {"speaker": "Caller", "text": "Great, still room then. Could I book one place?"},
            {"speaker": "Officer", "text": "Certainly — could I take your name?"},
            {"speaker": "Caller", "text": "It's Priya Chandrasekaran."},
            {"speaker": "Officer", "text": "Thank you. Do you have any dietary requirements? We're providing a light lunch afterwards."},
            {"speaker": "Caller", "text": "Yes, I'm vegetarian, if that's possible."},
            {"speaker": "Officer", "text": "No problem at all, I'll note that down. The session itself runs for two and a half hours, and then lunch is served for about half an hour afterwards, so people can chat and network."},
            {"speaker": "Caller", "text": "Sounds good, thank you."},
            {"speaker": "Officer", "text": "You're welcome — we'll see you Saturday at 10!"},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "What is the event called?", "options": ["'Mind & Body' Workplace Wellbeing Workshop", "'Healthy Habits' Seminar", "'Work-Life Balance' Talk"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "When does it take place?", "options": ["Saturday, 10am-1pm", "Sunday, 10am-1pm", "Saturday, 9am-12pm"], "answerIndex": 0},
            {"id": "q3", "type": "mcq", "prompt": "How much does it cost for one person?", "options": ["£8", "£10", "£12"], "answerIndex": 2},
            {"id": "q4", "type": "mcq", "prompt": "What is the room's maximum capacity?", "options": ["20", "30", "40"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "How many people are already booked in?", "options": ["8", "18", "28"], "answerIndex": 1},
            {"id": "q6", "type": "mcq", "prompt": "What is the caller's name?", "options": ["Priya Chandrasekaran", "Priya Chakrabarti", "Priti Chandrasekaran"], "answerIndex": 0},
            {"id": "q7", "type": "mcq", "prompt": "What dietary requirement does the caller mention?", "options": ["Vegan", "Vegetarian", "Gluten-free"], "answerIndex": 1},
            {"id": "q8", "type": "mcq", "prompt": "How long does the session itself run for, not counting lunch?", "options": ["One hour", "Two hours", "Two and a half hours"], "answerIndex": 2},
        ],
    },
    "reading": COMMAND_WORD_READING,
    "writing": {
        "taskType": "Task 1",
        "prompt": "Below are three separate sets of chart data. For EACH one, write only the overview paragraph (2-3 sentences) — do not describe every individual figure, just the main trend(s).",
        "chart": None,
        "extraPrompts": [
            "Chart 1 (line graph): Average number of monthly telemedicine (remote GP) consultations per 1,000 patients in one healthcare system, 2019-2023. Consultations rose from 15 per 1,000 patients in 2019 to 210 per 1,000 in 2023, with the sharpest increase occurring between 2019 and 2021.",
            "Chart 2 (bar chart): Percentage of adults meeting the recommended 150 minutes of weekly physical activity, by age group, in one national survey. Ages 16-24: 68%, 25-44: 54%, 45-64: 41%, 65+: 29%.",
            "Chart 3 (table): Percentage of parents citing each source as most influential when deciding whether to vaccinate their child. Family doctor/GP: 61%, Government health campaigns: 24%, Online forums and social media: 10%, Other parents: 5%.",
        ],
        "minWords": 0, "timeLimitMinutes": 45,
        "checklist": TASK1_OVERVIEW_DRILL_CHECKLIST,
        "modelAnswer": "Chart 1: Overall, telemedicine consultations increased dramatically over the period shown, growing more than tenfold, with the steepest rise occurring in the first two years.\n\nChart 2: Overall, physical activity levels fell steadily with age, with the youngest adults roughly twice as likely to meet the weekly exercise guideline as the oldest group.\n\nChart 3: Overall, family doctors were the single most influential source of vaccination advice by a wide margin, far ahead of government campaigns, online sources and other parents.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question with no more than 5 seconds of thinking time. Don't worry about giving a long answer — the goal here is reflex, not depth.",
        "items": [
            {"prompt": "Do you eat a healthy diet?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "How often do you exercise?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you get enough sleep most nights?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you prefer exercising indoors or outdoors?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Have you ever used a fitness tracker or health app?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you find it easy to manage stress?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you take any vitamins or supplements?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Would you say your lifestyle is healthy overall?", "prepSeconds": 5, "speakSeconds": 20},
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
            {"speaker": "Guide", "text": "Good morning, everyone, and welcome to the Wellbeing and Public Health Exhibition here at Fairfield Hall. My name's Charlotte, and I'll be showing you round for about half an hour before you're free to explore on your own. We've organised the exhibition roughly in the order most visitors find useful, so we'll start with the sleep and mental health zone just here on your left, which includes a rather popular interactive display on the effects of screen time before bed — do have a go if a booth's free, though there can be a short queue at lunchtime. Moving further in, you'll come to our nutrition area, where local dietitians are on hand throughout the day to answer questions, though I should mention they're not able to give individual medical advice, only general guidance. In the centre of the hall, we've got a free health-screening station offering blood pressure and cholesterol checks — these are run on a first-come, first-served basis, and I'd recommend getting your name down early if that's something you're interested in, since the queue tends to build up by mid-afternoon. Towards the back, there's a section dedicated to the rise of wearable technology and fitness tracking, put together in partnership with a couple of local tech companies; several of the devices on display are available to try, though please do ask a volunteer before removing anything from its stand, as a few are on loan and rather difficult to replace. We've also set aside a quiet room just past the wearables section for anyone who needs a moment away from the noise — it's unmarked on your map, but any of the volunteers in blue can point you towards it. Photography is welcome throughout most of the exhibition, but the final room, which focuses on patient stories and includes some rather sensitive personal accounts, kindly asks that you don't take any photographs or recordings, out of respect for the people who've shared them. If anything's unclear as we go round, do just stop me and ask — right, shall we make a start?"},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "What can visitors do at the health-screening station in the centre of the hall?", "options": ["Book a GP appointment", "Get blood pressure and cholesterol checks", "Buy healthy snacks"], "answerIndex": 1},
            {"id": "q2", "type": "mcq", "prompt": "What does the guide say about the health-screening queue?", "options": ["It disappears by mid-afternoon", "It tends to build up by mid-afternoon", "It is only open in the morning"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "What is not allowed in the final room?", "options": ["Talking", "Touching exhibits", "Photography or recording"], "answerIndex": 2},
        ],
        "reflectionPrompt": VOCAB_REFLECTION,
    },
    "reading": {
        "title": "Timed Paragraph Skim",
        "instructions": "You have 90 seconds per paragraph. Read it, then write a one-sentence summary before moving on — try not to reread.",
        "passage": [
            "Employers in many industries have begun treating mental health with the same seriousness once reserved for physical safety, introducing measures such as mental health first-aiders, confidential counselling lines and mandatory workload reviews. Advocates credit this shift partly to a generational change in attitudes, with younger employees more willing to discuss stress openly than previous generations were. Sceptics question whether such initiatives address root causes like understaffing, or merely paper over them.",
            "Complementary and alternative therapies, from acupuncture to herbal remedies, continue to attract a substantial and, in some regions, growing following, even though scientific evidence for many specific treatments remains limited. Surveys suggest many users turn to such therapies alongside conventional medicine rather than instead of it, often citing a desire for a more holistic approach. Regulators in several countries now call for clearer labelling of efficacy claims.",
            "Public health campaigns increasingly emphasise early detection over treatment, encouraging routine screening for conditions such as high blood pressure, certain cancers and diabetes well before symptoms appear. Proponents argue that catching such conditions early dramatically improves outcomes and can reduce long-term treatment costs. Critics counter that widespread screening can also lead to overdiagnosis, causing anxiety and unnecessary treatment for conditions that might never have caused harm.",
            "In many low-income urban and rural areas, residents face what researchers term a 'food desert' — a lack of nearby shops selling affordable fresh produce, leaving processed and fast food as the most convenient option. Some local governments have responded by subsidising mobile grocery services or incentivising supermarkets to open in underserved neighbourhoods, though access alone does not guarantee changed eating habits.",
            "The market for home fitness equipment and wearable activity trackers expanded rapidly following a global shift towards exercising at home, and much of that growth has proven durable rather than temporary. Wearables in particular have moved beyond simple step-counting, now offering sleep analysis and heart-rate tracking, though clinicians caution users against treating consumer devices as a substitute for professional diagnosis.",
            "Public trust in vaccination programmes varies considerably both between and within countries, shaped by historical experience with healthcare systems and the clarity of official communication during health emergencies. Researchers generally agree that trust, once eroded, is difficult to rebuild, and that transparent messaging from trusted local sources — often GPs rather than national institutions — tends to be more effective than mass-media campaigns.",
        ],
        "skimSecondsPerParagraph": 90,
        "modelSummaries": [
            "Employers are prioritising mental health at work, though some question whether this addresses underlying causes like understaffing.",
            "Complementary medicine remains popular alongside conventional treatment, despite limited scientific evidence for many therapies.",
            "Preventative health screening aims to catch conditions early, but critics warn it can also cause overdiagnosis.",
            "'Food deserts' limit access to affordable fresh food in some areas, and access alone hasn't fixed eating habits.",
            "Home fitness and wearable trackers have grown durably popular, though they shouldn't replace professional medical diagnosis.",
            "Public trust in vaccination programmes depends on transparent, locally trusted communication, which is hard to rebuild once lost.",
        ],
        "questions": [],
    },
    "writing": {
        "taskType": "Task 2",
        "prompt": "Some people believe that employers should be primarily responsible for protecting their employees' mental health and wellbeing, while others believe individuals are responsible for managing their own mental health. Discuss both views and give your own opinion. Write at least 250 words.",
        "chart": None, "minWords": 250, "timeLimitMinutes": 0,
        "checklist": TASK2_ESSAY_CHECKLIST,
        "modelAnswer": "Workplace mental health has become a prominent topic of public debate, with disagreement over where the primary responsibility for employee wellbeing should lie. This essay will examine both positions before outlining my own view.\n\nThose who argue that employers bear the main responsibility point out that many of the pressures contributing to poor mental health — unrealistic deadlines, excessive workloads, job insecurity and poor management — originate directly from the workplace itself. From this perspective, it would be unreasonable to expect individuals to manage stress that is, in large part, created by decisions outside their control, such as staffing levels or performance targets set by senior management. Proponents of this view often call for structural changes, including reasonable workloads, access to confidential support services, and training for managers to recognise early signs of burnout.\n\nOn the other hand, those who emphasise individual responsibility argue that no employer, however well-intentioned, can fully control an employee's mental state, which is also shaped by factors entirely outside work, such as personal relationships, finances and physical health. They contend that placing too much responsibility on employers risks fostering a culture of dependency, and that individuals ultimately benefit most from developing their own coping strategies, seeking help when needed, and setting personal boundaries around work.\n\nIn my view, both perspectives capture part of the picture, and treating this as an either-or question is unhelpful. Employers clearly have a duty to remove or reduce workplace conditions that predictably damage mental health, much as they are expected to maintain physical safety standards. At the same time, individuals cannot outsource all responsibility for their own wellbeing, and personal coping skills remain valuable regardless of how supportive an employer is.\n\nIn conclusion, meaningful progress on workplace mental health is most likely when employers address the structural causes of stress while supporting, rather than replacing, individual coping strategies.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering all six questions as though this were the real Part 1 interview. Afterwards, count how many times you said 'um', 'uh', or similar filler words.",
        "items": [
            {"prompt": "Let's talk about health. Do you think you lead a healthy lifestyle?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "What do you usually do to relax after a stressful day?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Is health education taught well in schools in your country?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think people worry too much about their health nowadays?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "How do you usually find out information about health issues?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think working from home is better or worse for people's health?", "prepSeconds": 5, "speakSeconds": 45},
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
            {"speaker": "Officer", "text": "Hi, thanks for calling about the free health check."},
            {"speaker": "Caller", "text": "Hi, yes, I saw a poster in the pharmacy window and wanted to book on to it."},
            {"speaker": "Officer", "text": "Lovely. They're running every Friday this month, from 9am to 12, at Fenwick Pharmacy on Priory Road."},
            {"speaker": "Caller", "text": "Is there a cost?"},
            {"speaker": "Officer", "text": "No, it's completely free for anyone aged 40 and over."},
            {"speaker": "Caller", "text": "Perfect, that's me. What does it actually involve?"},
            {"speaker": "Officer", "text": "Just a quick blood pressure check and a cholesterol test, plus a short chat about lifestyle — the whole thing takes about 20 minutes."},
            {"speaker": "Caller", "text": "That sounds simple enough. Do I need a specific time?"},
            {"speaker": "Officer", "text": "Yes, we only take 12 people per session, so I'll give you a slot now if that's alright."},
            {"speaker": "Caller", "text": "Of course, whatever's earliest is fine."},
            {"speaker": "Officer", "text": "I can offer you 9:30. Could I take your name and date of birth?"},
            {"speaker": "Caller", "text": "It's Graham Wetherby, and my date of birth is the 14th of March, 1978."},
            {"speaker": "Officer", "text": "Lovely, you're all booked in — Friday, the 9:30 slot. Just bring a form of ID with you on the day."},
        ],
        "formTitle": "Free Community Health Check — Registration",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Day:", "answer": "Friday", "altAnswers": []},
            {"id": "q2", "type": "gap", "prompt": "Time slot:", "answer": "9:30", "altAnswers": ["9.30", "09:30", "half past nine"]},
            {"id": "q3", "type": "gap", "prompt": "Location: Fenwick Pharmacy, ___ Road", "answer": "Priory", "altAnswers": []},
            {"id": "q4", "type": "gap", "prompt": "Free for anyone aged ___ and over", "answer": "40", "altAnswers": ["forty"]},
            {"id": "q5", "type": "gap", "prompt": "Checks include blood pressure and a ___ test", "answer": "cholesterol", "altAnswers": []},
            {"id": "q6", "type": "gap", "prompt": "Appointment length: ___ minutes", "answer": "20", "altAnswers": ["twenty"]},
            {"id": "q7", "type": "gap", "prompt": "Bring:", "answer": "a form of ID", "altAnswers": ["ID", "some form of ID", "identification"]},
        ],
        "predictionMode": True,
    },
    "reading": {
        "title": "Skimming & Scanning Basics",
        "instructions": "You have 60 seconds to skim each short passage. Then identify which numbered sentence is the true topic sentence (the one stating the paragraph's main idea).",
        "passage": [
            "Wearable Fitness Trackers\n\n(1) Wearable fitness trackers have become one of the most popular pieces of consumer technology of the past decade, moving from a niche gadget to a mainstream accessory worn by people of all ages. (2) Early models simply counted steps, but current devices can monitor heart rate, sleep stages and even blood oxygen levels. (3) Despite this growing sophistication, some doctors caution that constant self-monitoring can occasionally increase health anxiety rather than reduce it.",
            "Complementary Medicine's Growing Popularity\n\n(1) A growing number of pharmacies and health food shops now stock everything from herbal supplements to homeopathic remedies, often displayed prominently near the till. (2) Sales of such products have risen steadily over the past five years, even in countries with well-funded public healthcare systems. (3) Taken together, this reflects a broader trend: complementary and alternative medicine is no longer a fringe interest but a mainstream, if still scientifically contested, part of how many people manage their health.",
        ],
        "skimSecondsPerParagraph": 60,
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Passage 1 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Passage 2 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 2},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the percentage of adults meeting the recommended 150 minutes of weekly physical activity in four countries in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "bar", "data": [
            {"label": "Country A", "value": 47, "color": "#10b981"},
            {"label": "Country B", "value": 62, "color": "#6366f1"},
            {"label": "Country C", "value": 38, "color": "#f59e0b"},
            {"label": "Country D", "value": 55, "color": "#ec4899"},
        ]},
        "minWords": 150, "timeLimitMinutes": 20,
        "checklist": TASK1_CHART_CHECKLIST,
        "modelAnswer": "The bar chart shows the percentage of adults meeting the recommended 150 minutes of weekly physical activity in four different countries in 2023.\n\nOverall, Country B had the highest proportion of physically active adults, while Country C had the lowest, with a gap of 24 percentage points between them.\n\nCountry B led with 62% of adults meeting the guideline, ahead of Country D at 55%. Country A trailed behind these two, with just under half of adults, at 47%, reaching the recommended level, while Country C recorded the lowest figure of all, at 38% — considerably below every other country shown.\n\nIn summary, physical activity levels varied noticeably across the four countries, with less than two-thirds of adults meeting the guideline even in the best-performing country.",
    },
    "speaking": {
        "part": 1,
        "instructions": "For each prompt, give a one-sentence answer first, then extend it to three sentences by adding a reason and an example. Record the extended version.",
        "items": [
            {"prompt": "Do you get enough exercise during a typical week?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Is eating healthily important to you?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Do you think you get enough sleep most nights?", "prepSeconds": 10, "speakSeconds": 45},
        ],
    },
},

}
