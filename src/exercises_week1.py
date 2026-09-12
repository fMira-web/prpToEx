"""
Real, gradable exercise content for Week 1 (days 1-5; day 6 reuses day 1's
content and day 7 reuses day 2's content, since generate.py gives those days
identical task titles/details, just different time budgets).

Each day maps to a dict with four keys: listening, reading, writing, speaking.
Schema (see README / app.js exerciseRunner for how each type is rendered):

listening: {
  title, instructions, voiceHint ("en-GB"|"en-US"),
  segments: [{speaker: str|None, text: str}, ...],   # read aloud via TTS
  formTitle (optional, shown above gap questions),
  questions: [
    {id, type: "gap", prompt, answer, altAnswers: [...]},
    {id, type: "mcq", prompt, options: [...], answerIndex},
  ]
}

reading: {
  title, passage: [para1, para2, ...],
  questions: [
    {id, type: "tfng", prompt, answer: "True"|"False"|"Not Given"},
    {id, type: "mcq", prompt, options: [...], answerIndex},
  ]
}

writing: {
  taskType, prompt, chart: {type:"pie"|"bar", data:[{label,value,color}]} | None,
  minWords, timeLimitMinutes (0 = untimed), checklist: [...], modelAnswer
}

speaking: {
  part, instructions,
  items: [{prompt, prepSeconds, speakSeconds}, ...],
  reflectionPrompt (optional, shown as a free-text box after recording)
}
"""

EXERCISES = {

# ------------------------------------------------------------------ DAY 1 --
1: {
    "listening": {
        "title": "Greenfield Community Recycling Scheme — Registration Call",
        "instructions": "Listen to the call once. Complete the registration form below using words and numbers from the recording.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Good morning, Winchcombe District Council, Waste and Recycling team, this is Daniel speaking. How can I help you today?"},
            {"speaker": "Caller", "text": "Hi, I'd like to register for the new home composting scheme, please."},
            {"speaker": "Officer", "text": "Of course. Let me just take a few details. Could I have your full name, please?"},
            {"speaker": "Caller", "text": "Yes, it's Siobhan McAllister. That's S-I-O-B-H-A-N, and McAllister is M-C-A-L-L-I-S-T-E-R."},
            {"speaker": "Officer", "text": "Thank you. And what's your house number and postcode?"},
            {"speaker": "Caller", "text": "Number 47, and the postcode is GL54 5JP."},
            {"speaker": "Officer", "text": "Perfect. Do you already have a garden waste bin, or would this be your first?"},
            {"speaker": "Caller", "text": "This would be my first one."},
            {"speaker": "Officer", "text": "Right, in that case there's a one-off delivery charge of eighteen pounds fifty for the bin itself."},
            {"speaker": "Officer", "text": "And can I take a contact number in case the driver can't find the property?"},
            {"speaker": "Caller", "text": "Sure, it's 07984 226 310."},
            {"speaker": "Officer", "text": "Great. Now, we deliver on Tuesdays and Thursdays — which would suit you better?"},
            {"speaker": "Caller", "text": "Thursday works best for me."},
            {"speaker": "Officer", "text": "Lovely. And finally, is there anything the driver should know, like a shared driveway or a dog?"},
            {"speaker": "Caller", "text": "Yes, actually — please leave the bin by the side gate, not the front door."},
            {"speaker": "Officer", "text": "Noted. So that's confirmed for Thursday delivery, side gate. You'll get a text confirmation shortly."},
        ],
        "formTitle": "Home Composting Scheme — Registration",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Full name:", "answer": "Siobhan McAllister", "altAnswers": ["siobhan mcallister"]},
            {"id": "q2", "type": "gap", "prompt": "Postcode:", "answer": "GL54 5JP", "altAnswers": ["gl545jp"]},
            {"id": "q3", "type": "gap", "prompt": "First-time bin? (Yes/No):", "answer": "Yes", "altAnswers": []},
            {"id": "q4", "type": "gap", "prompt": "Delivery charge (£):", "answer": "18.50", "altAnswers": ["18.5", "£18.50", "eighteen fifty"]},
            {"id": "q5", "type": "gap", "prompt": "Contact number:", "answer": "07984 226310", "altAnswers": ["07984226310", "07984 226 310"]},
            {"id": "q6", "type": "gap", "prompt": "Preferred delivery day:", "answer": "Thursday", "altAnswers": []},
            {"id": "q7", "type": "gap", "prompt": "Leave the bin by the:", "answer": "side gate", "altAnswers": []},
        ],
    },
    "reading": {
        "title": "The Quiet Rise of Urban Rewilding",
        "passage": [
            "For most of the twentieth century, city parks around the world were designed according to a single, largely unspoken principle: nature should look tidy. Lawns were mown into smooth green carpets, borders were trimmed into straight lines, and anything that grew where it was not supposed to was quickly removed. In the last decade, however, a growing number of city councils have begun to reverse this approach through a practice known as urban rewilding — deliberately allowing patches of public land to grow wild rather than manicuring them.",
            "The ecological case for rewilding is strong. Uncut meadows and wildflower verges support far more insect life than mown grass, and a healthier insect population in turn supports birds and small mammals further up the food chain. Wild vegetation also absorbs rainfall more effectively than short grass, reducing the risk of surface flooding after heavy storms — an increasingly common concern as rainfall patterns shift. Several cities that have converted road verges and roundabouts into wildflower strips report measurable increases in bee and butterfly populations within just two or three years.",
            "Not everyone has welcomed the change, however. Some residents associate longer grass with neglect rather than ecological benefit, and local authorities have received complaints that unmown areas look untidy or even encourage rats. Councils have also had to adjust maintenance budgets, since rewilded areas still require occasional management — usually a single late-season cut — to prevent coarse grasses from crowding out the very wildflowers the scheme is meant to encourage. Without that intervention, a rewilded meadow can, somewhat counterintuitively, end up less diverse than a traditionally managed one.",
            "Despite these teething problems, the trend shows no sign of reversing. Cities including Paris and Melbourne now manage significant areas of former lawn as wildflower meadow, and several UK councils have committed to expanding their rewilded verges each year. Advocates argue that as residents grow more familiar with the look of a wild meadow — and see the pollinators it attracts — public attitudes are likely to shift, much as attitudes toward household recycling did a generation ago.",
        ],
        "questions": [
            {"id": "q1", "type": "tfng", "prompt": "Urban rewilding has been standard practice in most cities since the twentieth century.", "answer": "False"},
            {"id": "q2", "type": "tfng", "prompt": "Wildflower verges have been linked to increases in bee and butterfly numbers.", "answer": "True"},
            {"id": "q3", "type": "tfng", "prompt": "All councils have increased their maintenance budgets to support rewilding.", "answer": "Not Given"},
            {"id": "q4", "type": "mcq", "prompt": "According to the passage, why might a rewilded meadow end up LESS diverse without management?",
             "options": ["Because rats become more common", "Because coarse grasses crowd out wildflowers", "Because rainfall increases flooding risk", "Because residents complain and councils mow it"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "What does the writer suggest about public attitudes towards rewilding?",
             "options": ["They will never change", "They already fully support it", "They may shift over time, as with recycling", "They are the main obstacle preventing any rewilding"], "answerIndex": 2},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the sources of electricity generation in a small European country in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "pie", "data": [
            {"label": "Renewables (wind, solar, hydro)", "value": 42, "color": "#10b981"},
            {"label": "Natural gas", "value": 28, "color": "#6366f1"},
            {"label": "Nuclear", "value": 18, "color": "#f59e0b"},
            {"label": "Coal", "value": 7, "color": "#ef4444"},
            {"label": "Other", "value": 5, "color": "#94a3b8"},
        ]},
        "minWords": 150,
        "timeLimitMinutes": 20,
        "checklist": [
            "Does your opening paragraph paraphrase the question without copying it word-for-word?",
            "Does your overview state the 1-2 biggest features without giving exact numbers?",
            "Have you grouped supporting details logically (e.g. by size) rather than just listing chart order?",
            "Have you used proportion language accurately (e.g. 'just over two-fifths', 'the majority')?",
            "Is your report purely descriptive, with no opinion or speculation about causes?",
        ],
        "modelAnswer": "The pie chart illustrates the different sources used to generate electricity in a small European country in 2023.\n\nOverall, renewable sources accounted for the largest share of electricity generation, while coal contributed the least. Fossil and nuclear sources combined still made up over half of the total.\n\nRenewables, including wind, solar and hydropower, supplied 42% of the country's electricity, making them the single largest contributor. Natural gas was the second-largest source, providing just over a quarter (28%) of generation. Nuclear power accounted for a further 18%, meaning that these three sources together made up almost nine-tenths of the total electricity supply.\n\nBy contrast, coal represented only a small proportion of the mix, at just 7%, and the remaining 5% came from other, unspecified sources. In summary, the country relied on renewable energy as its primary source of electricity, with fossil fuels and nuclear power playing a supporting rather than dominant role.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question immediately, within about 3-5 seconds of it appearing — don't translate in your head. Record your answer, then move to the next question.",
        "items": [
            {"prompt": "Do you think people in your country care about the environment?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "What do you usually do to save energy at home?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Is recycling common where you live?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Did you learn about environmental issues at school?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Would you say your city is a green city?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "How do you feel when you see litter in public places?", "prepSeconds": 3, "speakSeconds": 30},
        ],
    },
},

# ------------------------------------------------------------------ DAY 2 --
2: {
    "listening": {
        "title": "Diagnostic: Question-Type Recognition",
        "instructions": "You'll hear four short, unrelated clips. After each one, decide which part of the IELTS Listening test (Section 1-4) it most resembles, based on the situation and number of speakers.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Clip A", "text": "Hi, I'm calling about the tickets for the Saturday walking tour of the botanical gardens. Could you tell me what time it starts and how much it costs for two adults?"},
            {"speaker": "Clip B", "text": "Welcome to Riverside Park. As you enter through the main gate, you'll see the visitor centre on your left, and the wildlife pond is just beyond it, about two hundred metres along the main path."},
            {"speaker": "Clip C", "text": "So, for our group project on renewable energy, I think we should focus on solar rather than wind, because the data's more accessible. What do you two think?"},
            {"speaker": "Clip D", "text": "Today's lecture examines the long-term effects of ocean acidification on coral reef ecosystems, beginning with the chemistry of dissolved carbon dioxide in seawater."},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Clip A — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Clip B — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Clip C — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 2},
            {"id": "q4", "type": "mcq", "prompt": "Clip D — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 3},
        ],
    },
    "reading": {
        "title": "Individual Action versus Systemic Change",
        "passage": [
            "It has become fashionable to argue that individual choices — recycling, cycling to work, eating less meat — are largely irrelevant to solving climate change, and that only large-scale government and corporate action can make a meaningful difference. This view, though understandable, overstates its case.",
            "Research into household carbon footprints suggests that in wealthy countries, personal consumption choices such as diet, travel and home energy use can account for a substantial share of an individual's total emissions — in some studies, more than half. Small changes, multiplied across millions of households, are far from negligible.",
            "Critics counter that focusing public attention on individual behaviour can distract from the fact that a relatively small number of large companies are responsible for the majority of global industrial emissions, and that campaigns emphasising personal responsibility were, in some cases, originally promoted by those same industries to shift blame away from themselves.",
            "The most persuasive position is not that individuals or institutions alone hold the answer, but that the two operate together: individual demand shapes what companies and governments consider acceptable, while systemic policy makes individual action easier and more effective. Treating the two as opposites, this passage suggests, misses how change actually happens.",
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
        "prompt": "Some people believe that individual actions such as recycling and reducing plastic use make little difference to climate change, and that only large-scale government and corporate action can be effective. To what extent do you agree or disagree?",
        "chart": None,
        "minWords": 0,
        "timeLimitMinutes": 15,
        "checklist": [
            "Does each thesis statement take a clear position (agree / disagree / partly agree)?",
            "Is each one a single, arguable sentence rather than a description of the topic?",
            "Would a reader know, from the thesis alone, roughly what your essay would argue?",
            "Have you avoided simply restating the question?",
            "Have you written five genuinely different statements, not five versions of the same idea?",
        ],
        "modelAnswer": "Five sample thesis statements (for comparison, not to copy):\n1. While individual choices matter less than large-scale policy, dismissing them entirely ignores their cumulative effect on emissions.\n2. Government and corporate action is necessary but insufficient without a parallel shift in individual behaviour.\n3. Personal actions are largely symbolic and should not distract from the urgent need for systemic regulation.\n4. Individual and institutional change are not competing solutions but mutually reinforcing ones.\n5. Because a small number of companies produce most emissions, individual action is far less important than corporate accountability.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering the question below for about 40 seconds. Try to speak naturally — self-corrections are completely fine. Afterwards, use the transcript (or listen back) and note every place you corrected yourself or repeated a word.",
        "items": [
            {"prompt": "Do you think it's easy or difficult to live an environmentally friendly lifestyle in a big city?", "prepSeconds": 10, "speakSeconds": 40},
        ],
        "reflectionPrompt": "List the self-corrections, repeated words, or filler words you noticed in your answer:",
    },
},

# ------------------------------------------------------------------ DAY 3 --
3: {
    "listening": {
        "title": "Section 1 — Multiple Choice Baseline",
        "instructions": "Listen to the call, then answer the multiple-choice questions below.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Hello, Parks and Allotments, this is Grace speaking."},
            {"speaker": "Caller", "text": "Hi, I saw online that there's an open day for new allotment plots this weekend — could I come along?"},
            {"speaker": "Officer", "text": "Of course! It's this Saturday, from 10am to 2pm, at Elm Street Allotments."},
            {"speaker": "Caller", "text": "Great, do I need to book, or can I just turn up?"},
            {"speaker": "Officer", "text": "Booking's not essential, but it does help us plan — there's space for about 30 visitors."},
            {"speaker": "Caller", "text": "OK, I'll book then. What should I bring?"},
            {"speaker": "Officer", "text": "Just wear sturdy shoes — the site can get muddy — and bring some ID, since we'll need to register you if you want to go on the plot waiting list."},
            {"speaker": "Caller", "text": "Understood. And is there a fee for a plot, if I do get one?"},
            {"speaker": "Officer", "text": "Yes, plots start at twenty-five pounds a year for a half-plot, or forty-five for a full one."},
            {"speaker": "Caller", "text": "That's more affordable than I expected. Is there parking on site?"},
            {"speaker": "Officer", "text": "There's limited parking for about ten cars, so we do recommend walking or cycling if you can."},
            {"speaker": "Caller", "text": "No problem, I'll cycle. Thanks very much for the information."},
            {"speaker": "Officer", "text": "You're welcome — see you Saturday!"},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "When is the open day?", "options": ["Saturday 10am-2pm", "Sunday 9am-1pm", "Saturday 9am-12pm"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Where is it held?", "options": ["Elm Street Allotments", "Oak Road Gardens", "Park Lane Allotments"], "answerIndex": 0},
            {"id": "q3", "type": "mcq", "prompt": "Is booking essential?", "options": ["Yes, compulsory", "No, but recommended", "Only for groups"], "answerIndex": 1},
            {"id": "q4", "type": "mcq", "prompt": "What should visitors bring?", "options": ["Wellington boots and cash", "Sturdy shoes and ID", "A membership card"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "Cost of a half-plot per year?", "options": ["£15", "£25", "£45"], "answerIndex": 1},
            {"id": "q6", "type": "mcq", "prompt": "Cost of a full plot per year?", "options": ["£30", "£40", "£45"], "answerIndex": 2},
            {"id": "q7", "type": "mcq", "prompt": "How many parking spaces are available?", "options": ["About 10", "About 30", "None"], "answerIndex": 0},
            {"id": "q8", "type": "mcq", "prompt": "How will the caller get there?", "options": ["Drive", "Cycle", "Bus"], "answerIndex": 1},
        ],
    },
    "reading": {
        "title": "Command-Word Awareness",
        "passage": [
            "IELTS Reading uses a small set of recurring instruction formats. Recognising the exact wording of an instruction — before you even look at the questions — tells you what kind of matching you need to do and how the text should be searched. Below are four instructions exactly as they might appear on a real question paper. Match each one to the question type it describes.",
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "\"Choose the correct heading for paragraphs A-F from the list of headings below.\"",
             "options": ["Matching Headings", "True/False/Not Given", "Summary Completion", "Multiple Choice"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "\"Do the following statements agree with the information given in the passage? Write TRUE, FALSE, or NOT GIVEN.\"",
             "options": ["Matching Headings", "True/False/Not Given", "Summary Completion", "Multiple Choice"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "\"Complete the summary below using NO MORE THAN TWO WORDS from the passage for each answer.\"",
             "options": ["Matching Headings", "True/False/Not Given", "Summary Completion", "Multiple Choice"], "answerIndex": 2},
            {"id": "q4", "type": "mcq", "prompt": "\"Choose the correct letter, A, B, C or D.\"",
             "options": ["Matching Headings", "True/False/Not Given", "Summary Completion", "Multiple Choice"], "answerIndex": 3},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "Below are three separate sets of chart data. For EACH one, write only the overview paragraph (2-3 sentences) — do not describe every individual figure, just the main trend(s).",
        "chart": None,
        "extraPrompts": [
            "Chart 1 (line graph): Average household water usage, 2000-2020. Usage rose steadily from 140 to 165 litres per day between 2000 and 2015. After 2015, following a national conservation campaign, usage fell back to 150 litres per day by 2020.",
            "Chart 2 (bar chart): Recycling rates in four countries, 2022. Sweden 68%, Germany 65%, UK 44%, USA 32%.",
            "Chart 3 (table): Sources of plastic waste by sector. Packaging 47%, Textiles 14%, Consumer goods 20%, Other 19%.",
        ],
        "minWords": 0,
        "timeLimitMinutes": 45,
        "checklist": [
            "Does each overview avoid mentioning every individual number?",
            "Does each overview state the 1-2 most noticeable features or trends?",
            "Have you avoided starting every overview with the same phrase?",
            "Is each overview 2-3 sentences, not a full paragraph of detail?",
        ],
        "modelAnswer": "Chart 1: Overall, household water usage rose over the first half of the period before falling again after a conservation campaign was introduced.\n\nChart 2: Overall, recycling rates varied considerably between the four countries, with the two European countries recycling roughly twice the proportion of waste that the USA did.\n\nChart 3: Overall, packaging was by far the largest source of plastic waste, while textiles contributed the smallest share.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question with no more than 5 seconds of thinking time. Don't worry about giving a long answer — the goal here is reflex, not depth.",
        "items": [
            {"prompt": "Do you recycle at home?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "What's your favourite season, and why?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Is public transport popular in your city?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you prefer walking or driving?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Have you ever planted a tree?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Is it easy to buy eco-friendly products where you live?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you turn off lights when you leave a room?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "What's one small thing you do to help the environment?", "prepSeconds": 5, "speakSeconds": 20},
        ],
    },
},

# ------------------------------------------------------------------ DAY 4 --
4: {
    "listening": {
        "title": "British Accent Calibration",
        "instructions": "Listen to the guide's introduction, then answer the comprehension questions. Note down any words whose pronunciation or meaning surprised you.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Guide", "text": "Good morning, everyone, and welcome to Farley Wetlands Nature Reserve. My name's Tom, and I'll be your guide for the next hour. Before we set off, let me give you a quick overview of the site. The reserve covers about eighty hectares, and it's home to over a hundred and fifty species of bird, including several that are quite rare in this part of the country, such as the bittern. We'll start at the visitor centre behind me, then follow the boardwalk trail out towards the main lake, which takes around twenty minutes on foot. Please stay on the marked paths at all times — much of the ground either side is very boggy, and disturbing the vegetation can damage nesting sites. Halfway along the boardwalk, you'll notice a wooden hide on your right; this is a great spot to stop for five or ten minutes with binoculars, as it overlooks a shallow feeding area where wading birds often gather at low water. Do keep your voices down once we're inside the hide, since sudden noise can startle the birds away. After the hide, the path splits: one route continues around the lake and back to the centre, taking about forty minutes in total, while the shorter route cuts back directly and takes only fifteen. Given the weather forecast for later this afternoon, I'd recommend we take the shorter route today. Right, if everyone's ready, let's make our way to the boardwalk."},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "How large is the reserve?", "options": ["18 hectares", "80 hectares", "150 hectares"], "answerIndex": 1},
            {"id": "q2", "type": "mcq", "prompt": "Why should visitors stay on the marked paths?", "options": ["To avoid getting lost", "Because of nesting sites and boggy ground", "Because of dangerous animals"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Which route will the group take today, and why?", "options": ["The longer route, because of the weather", "The shorter route, because of the weather", "Neither — the hide is closed"], "answerIndex": 1},
        ],
        "reflectionPrompt": "New or unfamiliar words you noticed while listening:",
    },
    "reading": {
        "title": "Timed Paragraph Skim",
        "instructions": "You have 90 seconds per paragraph. Read it, then write a one-sentence summary before moving on — try not to reread.",
        "passage": [
            "When many countries introduced a small charge for single-use plastic bags, retailers and campaigners were divided on whether it would change behaviour. Within two years, however, plastic bag usage in several of these countries fell by more than eighty percent, suggesting that even a very small financial disincentive can produce a large shift in everyday habits.",
            "Electric vehicle sales have grown rapidly over the past decade, driven by falling battery costs and expanding charging infrastructure. Even so, electric cars still account for a minority of vehicles on the road in most countries, and analysts disagree about how quickly petrol and diesel vehicles will be phased out entirely.",
            "Satellite monitoring has made it possible to track deforestation in near real time, allowing environmental agencies to identify illegal logging within days rather than months. While this has improved enforcement in some regions, monitoring alone cannot address the underlying economic pressures that drive forest clearance for agriculture.",
            "Cities are typically several degrees warmer than surrounding rural areas, an effect known as the urban heat island. Dark road surfaces and a lack of vegetation both contribute to this, and some cities have responded by painting roofs white or planting more street trees to reduce local temperatures.",
            "The rapid production of cheap, trend-led clothing, often referred to as fast fashion, has been linked to significant water consumption and textile waste. Some brands have introduced clothing recycling schemes in response, though critics argue these initiatives address only a small fraction of the industry's overall environmental footprint.",
            "Carbon offset schemes allow individuals or companies to pay for projects, such as tree planting, that are intended to balance out their own emissions. The effectiveness of such schemes varies considerably, and some studies have found that a portion of offset projects would have happened anyway, reducing their real climate benefit.",
        ],
        "skimSecondsPerParagraph": 90,
        "modelSummaries": [
            "Small charges on plastic bags led to sharp falls in their use.",
            "EV sales are rising fast but still form a minority; full phase-out timing is uncertain.",
            "Satellite tracking speeds up detection of illegal logging but doesn't fix the economic causes of deforestation.",
            "Cities are hotter than rural areas due to surfaces and lack of greenery; some are combating this with reflective roofs and trees.",
            "Fast fashion causes major water use and waste; recycling schemes only partly address the problem.",
            "Carbon offsetting varies in effectiveness; some projects may not add real climate benefit.",
        ],
        "questions": [],
    },
    "writing": {
        "taskType": "Task 2",
        "prompt": "In many countries, the amount of rubbish that people throw away is increasing. What do you think are the causes of this? What solutions can you suggest? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        "chart": None,
        "minWords": 250,
        "timeLimitMinutes": 0,
        "checklist": [
            "Task Response: Have you addressed BOTH causes and solutions, not just one?",
            "Coherence & Cohesion: Does each paragraph have one clear main idea, linked logically to the next?",
            "Lexical Resource: Have you used topic-specific vocabulary (e.g. 'single-use packaging', 'consumer culture') rather than repeating simple words?",
            "Grammar: Have you used a mix of sentence structures, including at least one complex sentence per paragraph?",
        ],
        "modelAnswer": "In many parts of the world, the volume of household waste has been rising steadily for several decades. This essay will examine the main reasons behind this trend before suggesting some practical solutions.\n\nOne of the primary causes is the growth of consumer culture, particularly the popularity of single-use packaging. Modern shoppers increasingly buy pre-packaged food and disposable products for convenience, generating far more waste than earlier generations, who tended to buy loose goods and repair rather than replace broken items. A second cause is population growth combined with rising incomes, which means that more people are consuming more goods overall, particularly in rapidly developing economies where consumption patterns are shifting towards those of wealthier nations.\n\nSeveral solutions could help address this problem. Governments could introduce stricter regulations on packaging, such as requiring manufacturers to use recyclable or biodegradable materials, as some countries have already begun to do. Financial incentives, such as charging households by the weight of non-recyclable waste they produce, could also encourage individuals to reduce and separate their rubbish more carefully. Finally, public education campaigns, especially in schools, could help build habits of reducing and reusing from an early age, which tend to last into adulthood.\n\nIn conclusion, rising waste levels stem largely from convenience-driven consumption and population growth, but a combination of regulation, financial incentives and education could meaningfully reverse this trend.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering all six questions as though this were the real Part 1 interview. Afterwards, count how many times you said 'um', 'uh', or similar filler words.",
        "items": [
            {"prompt": "Let's talk about your hometown. Is it a clean and green place?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "What kinds of environmental problems does your area face, if any?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think schools should teach more about the environment?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Have your habits changed at all because of environmental concerns?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think environmental problems are more the responsibility of governments or individuals?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "What environmental changes would you like to see in the next ten years?", "prepSeconds": 5, "speakSeconds": 45},
        ],
        "reflectionPrompt": "Filler-word count / notes on your fluency:",
    },
},

# ------------------------------------------------------------------ DAY 5 --
5: {
    "listening": {
        "title": "Keyword Prediction Drill",
        "instructions": "First, look at the note-completion form below and type what word or type of word you'd PREDICT for each gap (e.g. a number, a place name). Then press Play, listen, and reveal the real answers to check your predictions.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Hi there, thanks for calling about the Beach Clean-Up event."},
            {"speaker": "Caller", "text": "Hi, yes, I wanted to find out more and maybe sign up."},
            {"speaker": "Officer", "text": "Great! It's happening on Sunday the 14th, meeting at Sandy Cove car park at 9am."},
            {"speaker": "Caller", "text": "Do I need to bring my own equipment?"},
            {"speaker": "Officer", "text": "We provide gloves and bin bags, but we'd recommend bringing your own reusable water bottle."},
            {"speaker": "Caller", "text": "Understood. Is there an age limit?"},
            {"speaker": "Officer", "text": "Volunteers need to be at least ten years old, and under-16s must be accompanied by an adult."},
            {"speaker": "Caller", "text": "That's fine, I'll be coming alone. How long does the clean-up usually last?"},
            {"speaker": "Officer", "text": "About two and a half hours, finishing around half past eleven, then we usually have a short debrief with tea and biscuits."},
            {"speaker": "Caller", "text": "Sounds good. Should I register in advance?"},
            {"speaker": "Officer", "text": "Yes please — just give us your name and a contact email, and we'll add you to the list."},
        ],
        "formTitle": "Beach Clean-Up Volunteer Day",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Date: Sunday the ___", "answer": "14th", "altAnswers": ["14", "fourteenth"]},
            {"id": "q2", "type": "gap", "prompt": "Meeting point: ___ car park", "answer": "Sandy Cove", "altAnswers": []},
            {"id": "q3", "type": "gap", "prompt": "Meeting time:", "answer": "9am", "altAnswers": ["9:00", "9 am", "nine am"]},
            {"id": "q4", "type": "gap", "prompt": "Provided: gloves and ___", "answer": "bin bags", "altAnswers": []},
            {"id": "q5", "type": "gap", "prompt": "Recommended to bring:", "answer": "reusable water bottle", "altAnswers": ["water bottle"]},
            {"id": "q6", "type": "gap", "prompt": "Minimum age:", "answer": "10", "altAnswers": ["ten"]},
            {"id": "q7", "type": "gap", "prompt": "Duration: about ___ hours", "answer": "two and a half", "altAnswers": ["2.5", "2 1/2"]},
        ],
        "predictionMode": True,
    },
    "reading": {
        "title": "Skimming & Scanning Basics",
        "instructions": "You have 60 seconds to skim each short passage. Then identify which numbered sentence is the true topic sentence (the one stating the paragraph's main idea).",
        "passage": [
            "Community Solar Gardens\n\n(1) Not everyone who wants to use solar power owns a roof suitable for panels — renters and apartment residents are often excluded entirely. (2) Community solar gardens solve this by allowing multiple households to buy or lease a share of a single, larger solar installation, typically built on unused land nearby. (3) Subscribers then receive a credit on their electricity bill proportional to their share of the output, without needing to install anything at their own property.",
            "The Trouble with 'Biodegradable' Labels\n\n(1) The word 'biodegradable' appears on an increasing number of products, from plastic bags to coffee cups, and is often assumed by shoppers to mean the item will safely disappear if thrown away. (2) In reality, most biodegradable plastics only break down under very specific industrial composting conditions — high heat and controlled moisture — that are rarely present in a landfill or the ocean. (3) As a result, many biodegradable products persist in the environment for years, behaving almost identically to conventional plastic.",
        ],
        "skimSecondsPerParagraph": 60,
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Passage 1 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 1},
            {"id": "q2", "type": "mcq", "prompt": "Passage 2 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 1},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the percentage of household waste that was recycled in four cities in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "bar", "data": [
            {"label": "City A", "value": 62, "color": "#10b981"},
            {"label": "City B", "value": 48, "color": "#6366f1"},
            {"label": "City C", "value": 35, "color": "#f59e0b"},
            {"label": "City D", "value": 71, "color": "#ec4899"},
        ]},
        "minWords": 150,
        "timeLimitMinutes": 20,
        "checklist": [
            "Does your overview identify the highest and lowest cities without listing every number?",
            "Have you used comparison language accurately (e.g. 'nearly double', 'the same as')?",
            "Have you grouped cities logically (e.g. highest to lowest) rather than describing them in the order given?",
            "Is your report purely descriptive, with no speculation about why the rates differ?",
        ],
        "modelAnswer": "The bar chart shows the proportion of household waste that was recycled in four different cities in 2023.\n\nOverall, City D recycled the highest proportion of its waste, while City C recycled the least, with a difference of 36 percentage points between them.\n\nCity D recycled 71% of household waste, narrowly ahead of City A at 62%. City B recycled just under half of its waste, at 48%, roughly two-thirds of the rate achieved by City D. City C lagged behind the other three cities, recycling only 35% of household waste — around half the proportion recycled in City D.\n\nIn summary, recycling rates varied considerably between the four cities, with more than a twenty-point gap separating the two highest-performing cities from the two lowest.",
    },
    "speaking": {
        "part": 1,
        "instructions": "For each prompt, give a one-sentence answer first, then extend it to three sentences by adding a reason and an example. Record the extended version.",
        "items": [
            {"prompt": "Do you enjoy spending time outdoors?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Is your neighbourhood a good place for walking or cycling?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Do you think your habits are eco-friendly?", "prepSeconds": 10, "speakSeconds": 45},
        ],
    },
},

}
