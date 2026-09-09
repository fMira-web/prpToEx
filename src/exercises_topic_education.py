"""
Week 3 exercise content — topic: Education & Learning.

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
        "title": "Thornfield Adult Learning Centre — Course Enrolment Call",
        "instructions": "Listen to the call once. Complete the booking form below using words and numbers from the recording.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Good morning, Thornfield Adult Learning Centre, this is Grace speaking."},
            {"speaker": "Caller", "text": "Oh hi, I'm calling about the Conversational Italian course — is there still space on it?"},
            {"speaker": "Officer", "text": "Let me check... yes, there are a few spaces left on the Tuesday evening group."},
            {"speaker": "Caller", "text": "Brilliant. What time does it run?"},
            {"speaker": "Officer", "text": "From 6:30 until 8:30 in the evening, for ten weeks."},
            {"speaker": "Caller", "text": "That works for me. How much does it cost?"},
            {"speaker": "Officer", "text": "It's eighty-five pounds for the full ten weeks."},
            {"speaker": "Caller", "text": "I'll pay in full then. Do I need any previous experience?"},
            {"speaker": "Officer", "text": "No, this group is for complete beginners. Could I take your name to register you?"},
            {"speaker": "Caller", "text": "Yes, it's Rosalind Achebe — that's A-C-H-E-B-E."},
            {"speaker": "Officer", "text": "Thank you. And a contact number, in case the class is ever cancelled?"},
            {"speaker": "Caller", "text": "07923 461 705."},
            {"speaker": "Officer", "text": "Perfect. You'll just need to bring a notebook and a pen for the first session — everything else is provided. Oh, and do try to arrive ten minutes early on the first evening, so we can get everyone registered."},
            {"speaker": "Caller", "text": "Will do, thank you very much."},
            {"speaker": "Officer", "text": "You're welcome — we'll see you on Tuesday!"},
        ],
        "formTitle": "Adult Evening Course — Enrolment",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Full name:", "answer": "Rosalind Achebe", "altAnswers": ["rosalind achebe"]},
            {"id": "q2", "type": "gap", "prompt": "Course name:", "answer": "Conversational Italian", "altAnswers": ["conversational italian"]},
            {"id": "q3", "type": "gap", "prompt": "Day and time of class:", "answer": "Tuesday, 6:30 until 8:30", "altAnswers": ["Tuesday 6:30-8:30pm", "Tuesdays 6.30-8.30pm", "Tuesday evening 6:30 to 8:30", "Tuesday, 6:30 to 8:30"]},
            {"id": "q4", "type": "gap", "prompt": "Contact number:", "answer": "07923 461 705", "altAnswers": ["07923461705", "07923 461705"]},
            {"id": "q5", "type": "gap", "prompt": "Course fee for ten weeks (£):", "answer": "85", "altAnswers": ["£85", "eighty-five", "eighty five"]},
            {"id": "q6", "type": "gap", "prompt": "Bring to the first session:", "answer": "a notebook and a pen", "altAnswers": ["notebook and pen", "a notebook and pen"]},
            {"id": "q7", "type": "gap", "prompt": "Recommended before the first class:", "answer": "arrive ten minutes early", "altAnswers": ["arrive 10 minutes early", "come ten minutes early", "be there ten minutes early"]},
        ],
    },
    "reading": {
        "title": "Should Standardised Testing Be Abolished?",
        "passage": [
            "Standardised tests — from national school-leaving examinations to entrance assessments for university admission — have shaped education systems worldwide for over a century. Proponents view them as one of the few tools capable of measuring, in a consistent way, whether learners across vastly different schools and backgrounds have reached a comparable level of knowledge. In recent years, however, a growing coalition of educators, parents and even some employers have begun to question whether a single timed exam can meaningfully capture what a young person has actually learned.",
            "Supporters of standardised testing point to research suggesting that, whatever their flaws, such tests remain more objective than teacher assessment alone, which can be influenced by unconscious bias or inconsistent grading standards between schools. Because every candidate answers the same questions under the same conditions, results can be compared fairly across a whole country, allowing policymakers to identify which schools or regions are falling behind and target resources accordingly.",
            "Critics counter that this apparent objectivity comes at a considerable cost. When a single exam carries so much weight, teachers report feeling pressured to 'teach to the test', narrowing the curriculum to whatever is likely to appear on the paper rather than fostering broader understanding or curiosity. Test-related anxiety has also been linked, in several long-term studies, to reduced wellbeing among adolescents, and critics argue that a two- or three-hour exam is a poor proxy for skills such as collaboration or creative problem-solving that increasingly matter in the workplace.",
            "A number of education systems have begun experimenting with hybrid models that combine coursework, project-based assessment and a reduced-weight final exam, in an attempt to retain some comparability while easing pressure on individual test days. Early results are mixed: some studies report improved student wellbeing without a measurable drop in academic standards, while others warn that coursework-heavy models can disadvantage students who lack quiet space or support at home. Whether such compromises represent a genuine long-term solution, or simply a different set of trade-offs, remains an open question among researchers.",
        ],
        "questions": [
            {"id": "q1", "type": "tfng", "prompt": "Standardised tests have only been used in education systems for the past twenty years.", "answer": "False"},
            {"id": "q2", "type": "tfng", "prompt": "Some studies have found a link between test-related anxiety and reduced wellbeing in teenagers.", "answer": "True"},
            {"id": "q3", "type": "tfng", "prompt": "All education systems that have trialled hybrid assessment models have reported improved results with no drawbacks.", "answer": "False"},
            {"id": "q4", "type": "mcq", "prompt": "What advantage of standardised testing does the passage mention?",
             "options": ["It requires no funding from local governments", "It allows fair comparison of results across different schools and regions", "It has been proven to reduce student anxiety", "It is favoured by all classroom teachers"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "What do critics say is a risk of high-stakes standardised exams?",
             "options": ["They cost too much money to administer", "They may narrow the curriculum as teachers 'teach to the test'", "They are usually too easy for most students", "They have replaced coursework entirely in every country"], "answerIndex": 1},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the reasons given by a sample of UK adults aged 25-45 for enrolling in an adult-education course in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "pie", "data": [
            {"label": "Career progression or change", "value": 38, "color": "#a78bfa"},
            {"label": "Personal interest / hobby", "value": 24, "color": "#2dd4bf"},
            {"label": "To gain a formal qualification", "value": 20, "color": "#fb923c"},
            {"label": "To improve a specific skill", "value": 12, "color": "#60a5fa"},
            {"label": "Other reasons", "value": 6, "color": "#cbd5e1"},
        ]},
        "minWords": 150, "timeLimitMinutes": 20,
        "checklist": TASK1_CHART_CHECKLIST,
        "modelAnswer": "The pie chart illustrates the reasons a sample of UK adults aged 25-45 gave for enrolling in an adult-education course in 2023.\n\nOverall, work-related motivations were the single biggest driver of enrolment, while personal or qualification-focused reasons together accounted for a substantial share of the remainder. Only a small minority cited reasons outside these main categories.\n\nCareer progression or a career change was the leading reason, cited by 38% of respondents — considerably more than any other category. Personal interest or a hobby was the second most common motivation, at 24%, closely followed by a desire to gain a formal qualification, at 20%. Together, these two categories accounted for nearly as much as the career-related reason alone.\n\nImproving a specific skill, such as a language or a digital ability, motivated 12% of adults, while all other reasons combined made up just 6% of responses. In summary, adults returning to education in this age group were driven primarily by career considerations, with personal development and formal qualifications playing a clearly secondary role.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question immediately, within about 3-5 seconds of it appearing — don't translate in your head. Record your answer, then move to the next question.",
        "items": [
            {"prompt": "Did you enjoy school when you were younger?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "What subject were you best at in school?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Do you think you'll ever go back to studying formally?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Is it common for adults to take evening classes in your country?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Do you prefer learning by reading or by doing?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Who was your favourite teacher, and why?", "prepSeconds": 3, "speakSeconds": 30},
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
            {"speaker": "Clip A", "text": "Hi, I'm calling to check if there are any spaces left on the Saturday morning homework club for my daughter, and what time it starts."},
            {"speaker": "Clip B", "text": "Welcome to Bellfield Sixth Form College. As you come through the main entrance, the library is straight ahead, and the science block is just across the courtyard on the second floor."},
            {"speaker": "Clip C", "text": "For our presentation on assessment methods, I think we should focus on portfolio-based assessment rather than final exams, since we've got more case studies on it. What do you two think?"},
            {"speaker": "Clip D", "text": "Today's lecture considers the long-term effects of early-childhood education on cognitive development, beginning with findings from a forty-year longitudinal study."},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Clip A — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Clip B — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Clip C — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 2},
            {"id": "q4", "type": "mcq", "prompt": "Clip D — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 3},
        ],
    },
    "reading": {
        "title": "Is Homework Still Necessary?",
        "passage": [
            "Homework has been a fixture of school life for generations, yet a small but vocal movement of parents, teachers and even some school administrators now argues that its costs to family time and student wellbeing outweigh any academic benefit it provides — and that most homework, particularly at primary level, should simply be scrapped.",
            "Several studies lend weight to this position. Research examining students under the age of eleven has generally found little to no measurable correlation between the amount of homework assigned and academic performance, and surveys of parents in multiple countries report that evening homework is a leading cause of family conflict, with many describing nightly arguments over unfinished assignments.",
            "Other researchers caution against dismissing homework altogether. At secondary level in particular, several large-scale studies have found a positive, if modest, relationship between time spent on independent study and exam outcomes, and some educators argue that homework teaches time-management and self-discipline that cannot easily be replicated within the school day alone.",
            "Taken together, the evidence suggests that homework's value depends heavily on age, subject and how it is designed, rather than being uniformly beneficial or harmful. A growing number of schools have responded by scaling back repetitive homework for younger children while retaining purposeful, skill-building tasks for older students — a compromise that may explain why blanket policies in either direction have struggled to gain lasting support.",
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
        "prompt": "Some people believe that homework is an essential part of a child's education, while others believe it causes unnecessary stress and should be reduced or removed altogether. Discuss both views and give your own opinion.",
        "chart": None, "minWords": 0, "timeLimitMinutes": 15,
        "checklist": THESIS_CHECKLIST,
        "modelAnswer": "Five sample thesis statements (for comparison, not to copy):\n1. Although homework can reinforce classroom learning, its benefits for younger children are too marginal to justify the stress it places on family life.\n2. Removing homework entirely would deprive students of a crucial opportunity to develop independent study skills before they reach further education.\n3. The real issue is not whether homework exists but how much is set and how carefully it is designed.\n4. Both sides underestimate how unevenly homework's burden falls on families with fewer resources to support it at home.\n5. Homework should be retained for secondary students, where the evidence of benefit is strongest, but scaled back significantly for primary-aged children.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering the question below for about 40 seconds. Try to speak naturally — self-corrections are completely fine. Afterwards, use the transcript (or listen back) and note every place you corrected yourself or repeated a word.",
        "items": [
            {"prompt": "Do you think homework helps students learn, or does it cause more stress than it's worth?", "prepSeconds": 10, "speakSeconds": 40},
        ],
        "reflectionPrompt": SELF_CORRECTION_REFLECTION,
    },
},

# ---------------------------------------------------------------- PATTERN C
# Listening: Section 1 MCQ Baseline | Reading: Command-Word Awareness
# Writing: Task 1 Overview Paragraph Drill | Speaking: Part 1 Fluency & Reflex
"C": {
    "listening": {
        "title": "Global Pathways Study Fair — Booking Call",
        "instructions": "Listen to the call, then answer the multiple-choice questions below.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Hello, Global Pathways events line, this is Ben speaking."},
            {"speaker": "Caller", "text": "Hi, I saw an advert for the study abroad fair next month — is it possible to book a place?"},
            {"speaker": "Officer", "text": "Of course. It's called the Global Pathways Study Fair, on Saturday the 14th."},
            {"speaker": "Caller", "text": "What time does it run?"},
            {"speaker": "Officer", "text": "From 10am until 3pm, at the Riverside Conference Centre."},
            {"speaker": "Caller", "text": "Is there an entry fee?"},
            {"speaker": "Officer", "text": "It's £3 on the door, or free if you book in advance, like you're doing now."},
            {"speaker": "Caller", "text": "Perfect. How many people can the venue hold altogether?"},
            {"speaker": "Officer", "text": "Up to 400 visitors across the day. We're at around 250 bookings so far, so there's still plenty of room."},
            {"speaker": "Caller", "text": "Great, could I book two places — for myself and my brother? It's under the name Femi Okonkwo."},
            {"speaker": "Officer", "text": "Thanks, Femi. Does either of you need any accessibility support?"},
            {"speaker": "Caller", "text": "Yes, actually — my brother uses a wheelchair, so step-free access would help."},
            {"speaker": "Officer", "text": "Not a problem, the whole venue is step-free. I'll also mention that over 40 universities will be exhibiting, with short talks running every hour throughout the day."},
            {"speaker": "Caller", "text": "Brilliant, thank you."},
            {"speaker": "Officer", "text": "You're welcome — see you on the 14th!"},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "What is the event called?", "options": ["Global Pathways Study Fair", "World Learning Expo", "Future Campus Fair"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "When is it?", "options": ["Saturday 14th, 10am-3pm", "Sunday 14th, 9am-2pm", "Saturday 7th, 10am-3pm"], "answerIndex": 0},
            {"id": "q3", "type": "mcq", "prompt": "Is there a fee?", "options": ["£5 on the door, no advance option", "£3 on the door, free if booked in advance", "Always free, no exceptions"], "answerIndex": 1},
            {"id": "q4", "type": "mcq", "prompt": "What is the venue's total capacity?", "options": ["250", "400", "600"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "How many bookings had already been made when the caller called?", "options": ["Around 100", "Around 250", "Around 400"], "answerIndex": 1},
            {"id": "q6", "type": "mcq", "prompt": "What name is the booking made under?", "options": ["Femi Okonkwo", "Kwame Okonkwo", "Femi Adeyemi"], "answerIndex": 0},
            {"id": "q7", "type": "mcq", "prompt": "What accessibility support is requested?", "options": ["A hearing loop", "Step-free access", "Large-print materials"], "answerIndex": 1},
            {"id": "q8", "type": "mcq", "prompt": "What else does the officer mention about the fair?", "options": ["Over 40 universities will be exhibiting, with talks every hour", "There will be a free raffle for a laptop", "Only local colleges will attend"], "answerIndex": 0},
        ],
    },
    "reading": COMMAND_WORD_READING,
    "writing": {
        "taskType": "Task 1",
        "prompt": "Below are three separate sets of chart data. For EACH one, write only the overview paragraph (2-3 sentences) — do not describe every individual figure, just the main trend(s).",
        "chart": None,
        "extraPrompts": [
            "Chart 1 (line graph): International student enrolment at UK universities, 2015-2023. Numbers rose steadily from around 310,000 in 2015 to over 500,000 by 2023, with a brief dip in 2020.",
            "Chart 2 (bar chart): Average annual tuition fees for a bachelor's degree by institution type in a given country, 2023 (thousands of local currency units). Public university: 9, Private non-profit university: 28, Private for-profit college: 34, Community/vocational college: 4.",
            "Chart 3 (table): Pupil-to-teacher ratio by education level, three countries, 2022. Primary — Country A 14:1, Country B 22:1, Country C 18:1. Secondary — Country A 12:1, Country B 19:1, Country C 15:1.",
        ],
        "minWords": 0, "timeLimitMinutes": 45,
        "checklist": TASK1_OVERVIEW_DRILL_CHECKLIST,
        "modelAnswer": "Chart 1: Overall, international student enrolment at UK universities grew substantially over the period, rising by more than 60% despite a brief interruption in 2020.\n\nChart 2: Overall, tuition fees varied considerably by institution type, with private for-profit colleges charging by far the most and public universities remaining the most affordable option.\n\nChart 3: Overall, pupil-to-teacher ratios were consistently higher at primary level than at secondary level across all three countries, with Country B recording the largest class sizes at both stages.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question with no more than 5 seconds of thinking time. Don't worry about giving a long answer — the goal here is reflex, not depth.",
        "items": [
            {"prompt": "Do you enjoy learning new things?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "What was your favourite subject at school?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you prefer studying alone or in a group?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Have you ever taken an online course?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Is education free in your country?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you read for pleasure?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Would you like to study abroad one day?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "How do you usually revise for an exam?", "prepSeconds": 5, "speakSeconds": 20},
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
            {"speaker": "Guide", "text": "Good morning, everyone, and welcome to Ashcombe University's open day — thank you all for braving the rain to be here! My name's Imogen, and I'm a third-year student here, so I'll be showing you around campus for the next hour or so before you split off into your subject-specific sessions. We'll start just outside here, in the Founders' Quad, which is actually the oldest part of campus — some of these buildings date back to the 1890s, though don't worry, the wifi is a lot more recent than that. As we head towards the library, you'll notice the glass extension on the left; that was only finished two years ago, and it's open twenty-four hours during exam periods, which honestly saved me more than once in my first year. Just past the library is the Students' Union building, where you'll find the cafés, a small supermarket, and the box office for events — tickets for the welcome concert in September usually sell out within a day, so it's worth signing up to the mailing list early if that's something you're interested in. Now, a couple of things I get asked a lot: no, you don't need to bring your own laptop, though most students end up doing so anyway, and yes, first-year accommodation is guaranteed for everyone who applies before the June deadline, though after that it can't be promised. We'll pass the sports centre next, which has a climbing wall that's more popular than you'd think, and then loop back past the science building, where today only, the chemistry department is running short demonstrations every twenty minutes — well worth popping in if you've got the time. One last thing before we set off: photography is absolutely fine everywhere on today's tour except inside the archive room in the library, since some of the material there is quite fragile and light-sensitive. If anything's unclear as we go, just shout — there's no such thing as a silly question today. Right, let's get moving before the rain gets any worse!"},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "How old are the buildings in the Founders' Quad?", "options": ["Built in the 1990s", "Date back to the 1890s", "Built this year"], "answerIndex": 1},
            {"id": "q2", "type": "mcq", "prompt": "What is guaranteed for first-year students who apply before the June deadline?", "options": ["A parking space", "Accommodation", "Free bus travel"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Where is photography NOT allowed on the tour?", "options": ["The sports centre", "The science building", "The archive room in the library"], "answerIndex": 2},
        ],
        "reflectionPrompt": VOCAB_REFLECTION,
    },
    "reading": {
        "title": "Timed Paragraph Skim",
        "instructions": "You have 90 seconds per paragraph. Read it, then write a one-sentence summary before moving on — try not to reread.",
        "passage": [
            "Micro-credentials — short, focused qualifications often completed entirely online — have grown rapidly in popularity as employers increasingly value demonstrable skills over traditional degrees. Universities and technology companies alike now offer bite-sized courses in areas from data analysis to project management, typically completed in a matter of weeks. Critics, however, question whether such certificates carry the same weight with employers as a full degree, particularly in more traditional or regulated professions.",
            "Grade inflation — the gradual rise in average grades awarded over time, without a corresponding rise in ability — has become a persistent concern at both school and university level. Some researchers attribute it to competitive pressure between institutions, each reluctant to appear stricter than its rivals, while others argue that teaching methods have genuinely improved. Whatever the cause, admissions officers increasingly report difficulty distinguishing between top-performing candidates.",
            "A shortage of qualified teachers, particularly in subjects such as mathematics and physics, has become a pressing issue in many countries. Low starting salaries relative to other graduate careers, combined with heavy workloads, have made teaching a harder sell to new graduates than it once was. Some governments have responded with financial incentives or fast-track training routes, though unions argue that pay alone will not solve the underlying retention problem.",
            "Homeschooling, once a niche choice associated mainly with religious or rural communities, has grown substantially in several countries over the past decade. Supporters point to the flexibility it offers and the ability to tailor learning to an individual child's pace, while critics raise concerns about socialisation and the wide variation in educational quality between families, given the limited oversight most regions apply to homeschooling.",
            "The growing presence of tablets, laptops and interactive whiteboards in classrooms has divided educators. Advocates argue that such tools can personalise learning and better prepare students for a digital workplace, while a vocal group of critics, backed by some recent studies, warns that excessive screen time may be undermining attention spans and handwriting skills, particularly among younger children still developing fine motor control.",
            "Decades of longitudinal research now suggest that high-quality early-childhood education can produce measurable benefits that persist well into adulthood, including higher rates of employment and lower rates of involvement with the criminal justice system. Economists studying such programmes frequently describe them as offering an unusually high return on public investment, though researchers caution that quality — not merely access — appears to be the decisive factor.",
        ],
        "skimSecondsPerParagraph": 90,
        "modelSummaries": [
            "Micro-credentials offer fast, skills-focused alternatives to degrees, though employers may not always value them equally.",
            "Grade inflation makes it harder for admissions staff to distinguish top candidates, with the causes still debated.",
            "Low pay and heavy workloads are driving a teacher shortage, especially in maths and physics.",
            "Homeschooling has grown but raises questions about socialisation and inconsistent educational quality.",
            "Classroom technology may aid personalised learning but could also be harming attention and handwriting.",
            "High-quality early-childhood education appears to deliver long-lasting benefits, provided the quality is genuinely high.",
        ],
        "questions": [],
    },
    "writing": {
        "taskType": "Task 2",
        "prompt": "Some people believe that governments should invest more in vocational and technical education, while others believe university education should remain the priority. Discuss both views and give your own opinion. Write at least 250 words.",
        "chart": None, "minWords": 250, "timeLimitMinutes": 0,
        "checklist": TASK2_ESSAY_CHECKLIST,
        "modelAnswer": "Governments around the world face difficult choices about where to direct limited education budgets, and the debate between prioritising vocational training and prioritising university education has become increasingly prominent. This essay will examine both perspectives before offering my own view.\n\nAdvocates of greater investment in vocational and technical education argue that many economies currently suffer from a shortage of practical skills in areas such as construction, healthcare support and skilled trades, even as graduate unemployment or underemployment remains stubbornly high in some fields. They contend that vocational routes often lead more directly and more quickly to stable employment, and that expanding apprenticeships and technical colleges would reduce both individual student debt and the broader mismatch between what graduates can do and what employers actually need.\n\nThose who favour continued investment in universities counter that a strong higher-education sector delivers benefits that extend beyond individual employability, including fundamental research, technological innovation and a more adaptable workforce capable of responding to rapidly changing industries. They also point out that university graduates, on average, continue to earn more over a lifetime than those without a degree, even accounting for the cost of tuition, and that a well-educated population brings broader civic and social benefits that are harder to measure but no less real.\n\nIn my view, framing this as a choice between the two paths is ultimately unhelpful, since a modern economy plainly needs both skilled tradespeople and university-educated specialists. The more productive question is how to remove the stigma that still surrounds vocational routes in many countries, so that young people choose between them based on genuine interest and aptitude rather than perceived prestige, while ensuring that funding for both pathways reflects actual labour-market needs rather than historical habit.\n\nIn conclusion, rather than favouring one system over the other, governments would be better served by investing in both vocational and university education in a more balanced and needs-based way, while working to make vocational routes a genuinely respected first choice rather than a fallback option.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering all six questions as though this were the real Part 1 interview. Afterwards, count how many times you said 'um', 'uh', or similar filler words.",
        "items": [
            {"prompt": "Let's talk about education. Did you enjoy school when you were a child?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "What is the education system like in your country?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think students today have too much homework?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Is it common for people in your country to study abroad?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think university is necessary for everyone?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "How do you think technology has changed education?", "prepSeconds": 5, "speakSeconds": 45},
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
            {"speaker": "Officer", "text": "Hi, thanks for calling Bright Minds Tutoring."},
            {"speaker": "Caller", "text": "Hi, I'd like to register my son for the half-term revision bootcamp, if there's still space."},
            {"speaker": "Officer", "text": "Let me check... yes, we've got room. It runs from Monday the 26th, for three days."},
            {"speaker": "Caller", "text": "What time does it start each day?"},
            {"speaker": "Officer", "text": "9am until 1pm, at our centre on Chapel Road."},
            {"speaker": "Caller", "text": "And how much does it cost?"},
            {"speaker": "Officer", "text": "It's £120 for all three days, covering maths and English."},
            {"speaker": "Caller", "text": "That's fine. Do I need to bring anything?"},
            {"speaker": "Officer", "text": "Just a calculator and pens — we provide all the worksheets."},
            {"speaker": "Caller", "text": "Great. It's under the name Tobias Nwosu — he's in Year 9."},
            {"speaker": "Officer", "text": "Perfect, that's exactly the right group for this bootcamp. We'll see him on the 26th."},
            {"speaker": "Caller", "text": "Brilliant, thank you."},
        ],
        "formTitle": "Half-Term Revision Bootcamp — Registration",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Course starts: Monday the ___", "answer": "26th", "altAnswers": ["26", "twenty-sixth"]},
            {"id": "q2", "type": "gap", "prompt": "Length of course (days):", "answer": "3", "altAnswers": ["three", "3 days"]},
            {"id": "q3", "type": "gap", "prompt": "Time each day:", "answer": "9am until 1pm", "altAnswers": ["9-1pm", "9am-1pm", "9 till 1pm", "9am to 1pm"]},
            {"id": "q4", "type": "gap", "prompt": "Location: ___ Road", "answer": "Chapel", "altAnswers": []},
            {"id": "q5", "type": "gap", "prompt": "Cost for three days (£):", "answer": "120", "altAnswers": ["£120", "one hundred and twenty"]},
            {"id": "q6", "type": "gap", "prompt": "Bring:", "answer": "a calculator and pens", "altAnswers": ["calculator and pens", "a calculator, pens", "calculator and some pens"]},
            {"id": "q7", "type": "gap", "prompt": "Student's year group:", "answer": "Year 9", "altAnswers": ["year 9", "9", "Yr 9"]},
        ],
        "predictionMode": True,
    },
    "reading": {
        "title": "Skimming & Scanning Basics",
        "instructions": "You have 60 seconds to skim each short passage. Then identify which numbered sentence is the true topic sentence (the one stating the paragraph's main idea).",
        "passage": [
            "The Global Teacher Shortage\n\n(1) A shortage of qualified teachers, especially in mathematics and the sciences, has become one of the most pressing challenges facing schools worldwide. (2) In some regions, more than one in ten teaching positions currently stands vacant or is filled by an unqualified substitute. (3) Governments have responded with a mix of signing bonuses, fast-track training schemes and international recruitment drives.",
            "The Case for Lifelong Learning\n\n(1) Traditional models of education concentrate almost all formal learning into the first two decades of a person's life. (2) Surveys suggest that today's graduates can expect to change careers, not just jobs, several times before retirement. (3) As a result, a growing number of employers and policymakers now argue that affordable retraining should be available throughout adulthood, not treated as an optional extra.",
        ],
        "skimSecondsPerParagraph": 60,
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Passage 1 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Passage 2 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 2},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the average number of hours per week that university students in four countries spent on independent, self-directed study in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "bar", "data": [
            {"label": "Country A", "value": 14, "color": "#10b981"},
            {"label": "Country B", "value": 9, "color": "#6366f1"},
            {"label": "Country C", "value": 19, "color": "#f59e0b"},
            {"label": "Country D", "value": 11, "color": "#ec4899"},
        ]},
        "minWords": 150, "timeLimitMinutes": 20,
        "checklist": TASK1_CHART_CHECKLIST,
        "modelAnswer": "The bar chart shows the average number of hours per week that university students in four different countries devoted to independent study in 2023.\n\nOverall, there was considerable variation between the four countries, with students in Country C spending well over twice as many hours on self-directed study as those in Country B, who recorded the lowest figure.\n\nStudents in Country C spent the most time on independent study, at 19 hours per week, followed by Country A at 14 hours. Country D students studied independently for 11 hours per week on average, only slightly more than students in Country B, who spent the least time of all four countries at just 9 hours per week.\n\nIn summary, students in Country C spent noticeably more time on independent study than their counterparts elsewhere, while those in Country B relied comparatively less on self-directed study outside of scheduled classes.",
    },
    "speaking": {
        "part": 1,
        "instructions": "For each prompt, give a one-sentence answer first, then extend it to three sentences by adding a reason and an example. Record the extended version.",
        "items": [
            {"prompt": "Do you enjoy studying alone, or do you prefer group study?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Is it important to keep learning new things as an adult?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Would you say your country's education system is effective?", "prepSeconds": 10, "speakSeconds": 45},
        ],
    },
},

}
