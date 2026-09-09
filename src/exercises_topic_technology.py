"""
Week 2 exercise content — topic: Technology & Artificial Intelligence.

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
        "title": "Northgate Community Tech Repair Café — Booking Call",
        "instructions": "Listen to the call once. Complete the booking form below using words and numbers from the recording.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Hello, Northgate Community Centre, this is Alex."},
            {"speaker": "Caller", "text": "Hi, I heard you run a free tech repair drop-in — is that still happening?"},
            {"speaker": "Officer", "text": "Yes, every second Wednesday, from 2 till 5pm."},
            {"speaker": "Caller", "text": "Great, could I bring my laptop in? The screen's cracked."},
            {"speaker": "Officer", "text": "We can take a look, though very severe screen damage sometimes needs a specialist. Could I take your name?"},
            {"speaker": "Caller", "text": "It's Daniela Kowalski. That's K-O-W-A-L-S-K-I."},
            {"speaker": "Officer", "text": "Thanks. And what's the make and model of the laptop, if you know it?"},
            {"speaker": "Caller", "text": "It's a Bramwell Series 4."},
            {"speaker": "Officer", "text": "Got it. And a contact number in case a volunteer needs to reach you?"},
            {"speaker": "Caller", "text": "07712 903 488."},
            {"speaker": "Officer", "text": "Perfect. There's no charge for the diagnosis, but if a part needs replacing, that's a suggested donation of ten pounds."},
            {"speaker": "Caller", "text": "That's fine. Should I bring the charger too?"},
            {"speaker": "Officer", "text": "Yes please, and if you can, back up anything important beforehand — we can't guarantee your files are safe during repairs."},
            {"speaker": "Caller", "text": "Understood, thank you."},
            {"speaker": "Officer", "text": "See you next Wednesday!"},
        ],
        "formTitle": "Tech Repair Café — Booking",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Full name:", "answer": "Daniela Kowalski", "altAnswers": ["daniela kowalski"]},
            {"id": "q2", "type": "gap", "prompt": "Device model:", "answer": "Bramwell Series 4", "altAnswers": ["bramwell series 4"]},
            {"id": "q3", "type": "gap", "prompt": "Problem:", "answer": "cracked screen", "altAnswers": ["screen cracked", "the screen is cracked"]},
            {"id": "q4", "type": "gap", "prompt": "Contact number:", "answer": "07712 903488", "altAnswers": ["07712903488", "07712 903 488"]},
            {"id": "q5", "type": "gap", "prompt": "Suggested donation if a part is replaced (£):", "answer": "10", "altAnswers": ["£10", "ten"]},
            {"id": "q6", "type": "gap", "prompt": "Bring in addition to the laptop:", "answer": "charger", "altAnswers": ["the charger"]},
            {"id": "q7", "type": "gap", "prompt": "Recommended before the appointment:", "answer": "back up your files", "altAnswers": ["back up important files", "backup files", "back up files"]},
        ],
    },
    "reading": {
        "title": "Can Algorithms Be Biased?",
        "passage": [
            "When people think of bias, they often picture a person making an unfair judgement. Increasingly, however, researchers are documenting bias in something that seems, at first glance, entirely neutral: computer algorithms. From facial recognition systems that perform less accurately on darker skin tones to hiring software that quietly favours certain names over others, algorithmic bias has moved from a theoretical concern to a documented, measurable problem.",
            "The root of the issue is rarely the mathematics itself. Most algorithms learn patterns from historical data, and if that data reflects decades of unequal treatment, the algorithm will reproduce — and sometimes amplify — those patterns. A hiring tool trained on a company's past successful applicants, for instance, may learn to prefer whatever characteristics those applicants happened to share, even if those characteristics have nothing to do with genuine job performance.",
            "Some technologists argue that the solution is simply better data, and progress has certainly been made: several major technology companies have published bias audits and adjusted their training datasets accordingly. Critics counter that data alone cannot fix the problem, since the people designing and testing these systems bring their own blind spots, and a lack of diversity within technology teams can mean that certain failure modes go unnoticed until the software is already in use.",
            "Regulators in several countries are now beginning to require bias testing before high-stakes algorithms — those used in hiring, lending or policing — can be deployed. Whether such regulation keeps pace with the speed of technological development remains an open question, but the debate itself marks a shift: algorithmic fairness is no longer treated as a footnote to innovation, but as a central design requirement.",
        ],
        "questions": [
            {"id": "q1", "type": "tfng", "prompt": "Algorithmic bias is a purely theoretical concern with no documented real-world examples.", "answer": "False"},
            {"id": "q2", "type": "tfng", "prompt": "Some hiring software has been found to favour certain applicant characteristics unrelated to job performance.", "answer": "True"},
            {"id": "q3", "type": "tfng", "prompt": "All technology companies have published bias audits of their systems.", "answer": "Not Given"},
            {"id": "q4", "type": "mcq", "prompt": "According to the passage, what is usually the root cause of algorithmic bias?",
             "options": ["Faulty mathematics", "Biased historical training data", "Deliberate programmer prejudice", "Regulatory failure"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "What does the passage suggest about the current regulatory approach?",
             "options": ["It is complete and fully effective", "It doesn't exist anywhere yet", "It is emerging, but its adequacy is uncertain", "It has been abandoned"], "answerIndex": 2},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows how a sample of office workers reported using generative AI tools at work in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "pie", "data": [
            {"label": "Drafting emails/documents", "value": 35, "color": "#818cf8"},
            {"label": "Summarising documents", "value": 22, "color": "#34d399"},
            {"label": "Writing code", "value": 18, "color": "#38bdf8"},
            {"label": "Brainstorming ideas", "value": 15, "color": "#fbbf24"},
            {"label": "Other uses", "value": 10, "color": "#94a3b8"},
        ]},
        "minWords": 150, "timeLimitMinutes": 20,
        "checklist": TASK1_CHART_CHECKLIST,
        "modelAnswer": "The pie chart illustrates how a sample of office workers reported using generative AI tools in their jobs in 2024.\n\nOverall, drafting written material was the most common use of these tools, while a range of other applications made up a smaller combined share. Practical writing tasks dominated over more exploratory ones such as brainstorming.\n\nDrafting emails and documents was the leading use, reported by 35% of workers, followed by summarising existing documents at 22%. Together, these two writing-related tasks accounted for well over half of all reported usage. Writing code was the next most common application, at 18%, notably lower than the two writing-related categories despite AI's strong reputation in this area.\n\nBrainstorming ideas accounted for a smaller share, at 15%, while all other uses combined made up the remaining 10%. In summary, office workers appear to rely on generative AI primarily as a writing and summarising aid rather than for idea generation or other tasks.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question immediately, within about 3-5 seconds of it appearing — don't translate in your head. Record your answer, then move to the next question.",
        "items": [
            {"prompt": "How often do you use a smartphone in a typical day?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "What was the last new piece of technology you bought?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Do you think artificial intelligence will change your job?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Is it easy for older people in your country to use new technology?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "Do you prefer reading news online or in print?", "prepSeconds": 3, "speakSeconds": 30},
            {"prompt": "What app do you use the most?", "prepSeconds": 3, "speakSeconds": 30},
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
            {"speaker": "Clip A", "text": "Hi, I'm calling to check if there are any spaces left on the 'Intro to Coding' workshop this Saturday, and how much it costs for one person."},
            {"speaker": "Clip B", "text": "Welcome to the Science and Technology Museum. As you enter the main hall, the robotics gallery is straight ahead, and the interactive AI exhibit is upstairs on the second floor."},
            {"speaker": "Clip C", "text": "For our presentation on wearable technology, I think we should compare fitness trackers rather than smartwatches, since we have more data on them. What do you two think?"},
            {"speaker": "Clip D", "text": "Today's lecture considers the environmental cost of training large machine learning models, starting with the energy consumption of modern data centres."},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Clip A — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "Clip B — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "Clip C — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 2},
            {"id": "q4", "type": "mcq", "prompt": "Clip D — which section does this resemble?", "options": ["Section 1", "Section 2", "Section 3", "Section 4"], "answerIndex": 3},
        ],
    },
    "reading": {
        "title": "Should Schools Ban Smartphones?",
        "passage": [
            "As smartphone ownership among teenagers has become near-universal, a growing number of schools have introduced outright bans on the devices during the school day. Proponents argue that such bans are a necessary, if blunt, response to a genuine problem, and that the benefits clearly outweigh the inconvenience.",
            "Several studies conducted in schools that introduced bans have reported improvements in standardised test scores, particularly among lower-performing students, alongside reductions in reported bullying incidents linked to social media use during school hours. Teachers in these schools frequently describe calmer classrooms and improved student engagement during lessons.",
            "Critics argue that blanket bans are a crude solution that fails to teach students the self-regulation they will eventually need as adults, and that smartphones also offer legitimate educational uses, from research to accessibility tools for students with disabilities. Some also note that determined students simply find ways around bans, undermining their practical effectiveness.",
            "A middle path favoured by some educators involves teaching structured, supervised smartphone use rather than prohibition — for example, permitting devices only during specific activities. Whether such compromises can deliver the same measurable benefits as a full ban, however, remains contested.",
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
        "prompt": "Some people believe that children should not be allowed to use smartphones until they are teenagers, while others believe there is no harm in allowing younger children to use them. Discuss both views and give your own opinion.",
        "chart": None, "minWords": 0, "timeLimitMinutes": 15,
        "checklist": THESIS_CHECKLIST,
        "modelAnswer": "Five sample thesis statements (for comparison, not to copy):\n1. Although early smartphone use carries real risks, an outright ban until the teenage years is impractical in an increasingly digital world.\n2. Allowing young children unrestricted smartphone access does more harm than good to their attention and social development.\n3. Whether smartphone use is harmful depends far more on supervision and content than on the child's age alone.\n4. Both camps overstate their case: the real issue is a lack of clear guidance for parents, not the devices themselves.\n5. Delaying smartphone ownership until the teenage years gives children a better foundation for using technology responsibly later.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering the question below for about 40 seconds. Try to speak naturally — self-corrections are completely fine. Afterwards, use the transcript (or listen back) and note every place you corrected yourself or repeated a word.",
        "items": [
            {"prompt": "Do you think technology has made communication between people better or worse?", "prepSeconds": 10, "speakSeconds": 40},
        ],
        "reflectionPrompt": SELF_CORRECTION_REFLECTION,
    },
},

# ---------------------------------------------------------------- PATTERN C
# Listening: Section 1 MCQ Baseline | Reading: Command-Word Awareness
# Writing: Task 1 Overview Paragraph Drill | Speaking: Part 1 Fluency & Reflex
"C": {
    "listening": {
        "title": "‘AI and You’ Library Talk — Booking Call",
        "instructions": "Listen to the call, then answer the multiple-choice questions below.",
        "voiceHint": "en-GB",
        "segments": [
            {"speaker": "Officer", "text": "Hello, Riverside Library, events desk, this is Priya speaking."},
            {"speaker": "Caller", "text": "Hi, I saw a poster about a talk on artificial intelligence next week — could I book a seat?"},
            {"speaker": "Officer", "text": "Of course! It's called 'AI and You', on Thursday evening at 7pm in the main hall."},
            {"speaker": "Caller", "text": "Is it free?"},
            {"speaker": "Officer", "text": "Yes, free entry, but seats are limited to 60, so booking is recommended."},
            {"speaker": "Caller", "text": "Great, I'll book two seats then, for myself and a friend."},
            {"speaker": "Officer", "text": "No problem. Could I take a name for the booking?"},
            {"speaker": "Caller", "text": "Yes, it's Marcus Whitfield."},
            {"speaker": "Officer", "text": "Thanks. And a contact email, in case the event changes?"},
            {"speaker": "Caller", "text": "It's marcus dot whitfield at mailbox dot com."},
            {"speaker": "Officer", "text": "Got it. Do you need any accessibility support — a hearing loop, wheelchair access?"},
            {"speaker": "Caller", "text": "Actually yes, could you reserve two seats near the front? My friend has a hearing aid."},
            {"speaker": "Officer", "text": "Absolutely, I'll note that. The talk runs for about 75 minutes, with questions afterwards."},
            {"speaker": "Caller", "text": "Perfect, thank you."},
            {"speaker": "Officer", "text": "You're welcome — see you Thursday at 7!"},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "What is the event called?", "options": ["‘AI and You’", "‘Tech Talk Tuesday’", "‘Digital Futures’"], "answerIndex": 0},
            {"id": "q2", "type": "mcq", "prompt": "When is it?", "options": ["Thursday, 7pm", "Tuesday, 6pm", "Thursday, 6pm"], "answerIndex": 0},
            {"id": "q3", "type": "mcq", "prompt": "Is there a fee?", "options": ["Yes, £5", "Free entry", "Free, but donations welcome"], "answerIndex": 1},
            {"id": "q4", "type": "mcq", "prompt": "How many seats does the hall have in total?", "options": ["40", "60", "100"], "answerIndex": 1},
            {"id": "q5", "type": "mcq", "prompt": "How many seats does the caller book?", "options": ["1", "2", "3"], "answerIndex": 1},
            {"id": "q6", "type": "mcq", "prompt": "What accessibility support is requested?", "options": ["Wheelchair access", "Seats near the front (hearing aid)", "A sign language interpreter"], "answerIndex": 1},
            {"id": "q7", "type": "mcq", "prompt": "How long does the talk run?", "options": ["45 minutes", "60 minutes", "75 minutes"], "answerIndex": 2},
            {"id": "q8", "type": "mcq", "prompt": "What happens after the talk?", "options": ["A film screening", "Questions", "A guided tour"], "answerIndex": 1},
        ],
    },
    "reading": COMMAND_WORD_READING,
    "writing": {
        "taskType": "Task 1",
        "prompt": "Below are three separate sets of chart data. For EACH one, write only the overview paragraph (2-3 sentences) — do not describe every individual figure, just the main trend(s).",
        "chart": None,
        "extraPrompts": [
            "Chart 1 (line graph): Smartphone ownership among UK adults aged 65+, 2015-2023. Ownership rose steadily from 20% in 2015 to 72% in 2023.",
            "Chart 2 (bar chart): Average time spent on social media apps per day by age group, 2023. Ages 16-24: 150 minutes, 25-34: 95 minutes, 35-44: 60 minutes, 45+: 35 minutes.",
            "Chart 3 (table): Global spending on AI research by sector. Technology companies 54%, Government 21%, Universities 15%, Other 10%.",
        ],
        "minWords": 0, "timeLimitMinutes": 45,
        "checklist": TASK1_OVERVIEW_DRILL_CHECKLIST,
        "modelAnswer": "Chart 1: Overall, smartphone ownership among older adults rose dramatically over the period, more than tripling from around a fifth to nearly three-quarters of this age group.\n\nChart 2: Overall, time spent on social media fell sharply with age, with the youngest group spending more than four times as long on these apps as the oldest group.\n\nChart 3: Overall, the technology sector accounted for by far the largest share of global AI research spending, more than double that of government and universities combined.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Answer each question with no more than 5 seconds of thinking time. Don't worry about giving a long answer — the goal here is reflex, not depth.",
        "items": [
            {"prompt": "Do you use social media?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "What's your favourite app?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you prefer texting or calling?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Have you ever taken an online course?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Is Wi-Fi easy to find where you live?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Do you play video games?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "Would you trust a robot to do household chores?", "prepSeconds": 5, "speakSeconds": 20},
            {"prompt": "How many hours a day do you spend on your phone?", "prepSeconds": 5, "speakSeconds": 20},
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
            {"speaker": "Guide", "text": "Good afternoon, and welcome to the Turing Gallery here at the National Computing Museum. My name's Eleanor, and I'll be guiding you through the next forty minutes. This gallery traces the history of computing from the earliest mechanical calculators right through to the smartphone in your pocket today. We'll begin with the reconstructed Colossus machine on your left, which was used to break codes during the Second World War — remarkable, considering it has less processing power than a modern digital watch. As we move further in, you'll see a section dedicated to the personal computer boom of the 1980s; do feel free to try the working exhibits, though please don't attempt to remove any of the floppy disks, as several of them are now irreplaceable. Midway through the gallery, there's a hands-on area where you can build a simple logic circuit — this tends to be popular with younger visitors, so there may be a short wait at busier times. Towards the end, we reach our newest exhibit, an interactive display exploring machine learning, which was only installed last spring. Please note that photography without flash is permitted throughout, but the final room, which contains some fragile early prototypes on loan from a private collection, does not allow any photography at all. If you have any questions as we go, don't hesitate to ask — right, let's make a start."},
        ],
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "What does the Colossus machine relate to?", "options": ["Modern smartphones", "Code-breaking in WWII", "The 1980s PC boom"], "answerIndex": 1},
            {"id": "q2", "type": "mcq", "prompt": "What should visitors NOT do in the 1980s exhibit area?", "options": ["Touch the working exhibits", "Remove the floppy disks", "Take photographs"], "answerIndex": 1},
            {"id": "q3", "type": "mcq", "prompt": "What is not allowed in the final room?", "options": ["Talking", "Touching exhibits", "Photography"], "answerIndex": 2},
        ],
        "reflectionPrompt": VOCAB_REFLECTION,
    },
    "reading": {
        "title": "Timed Paragraph Skim",
        "instructions": "You have 90 seconds per paragraph. Read it, then write a one-sentence summary before moving on — try not to reread.",
        "passage": [
            "As AI-generated images and video, commonly called deepfakes, have become harder to distinguish from genuine footage, researchers have raced to develop reliable detection tools. Early detection methods relied on spotting visual glitches, but as the underlying technology improves, some experts warn that purely visual detection may soon become unreliable, shifting the emphasis towards verifying content at its source instead.",
            "Open-source artificial intelligence models, whose underlying code is published publicly rather than kept private by a single company, have grown rapidly in capability over the past few years. Supporters argue this openness accelerates innovation and allows independent researchers to audit systems for safety issues, while critics worry it also lowers the barrier for malicious use.",
            "Despite rapid technological progress, a significant digital divide persists both between and within countries, with rural and lower-income communities often lacking reliable high-speed internet access. Governments in several regions have launched subsidy programmes to expand broadband infrastructure, though progress has been slower in geographically remote areas where the cost per household connected remains high.",
            "The 'right to repair' movement advocates for laws requiring manufacturers to make replacement parts, tools and repair manuals available to consumers and independent repair shops, rather than requiring devices to be serviced only by the original company. Several regions have passed early versions of such legislation, arguing it reduces electronic waste and consumer cost.",
            "Recommendation algorithms, which decide what content users see on social media and streaming platforms, are optimised primarily to maximise engagement — the amount of time a user spends on the platform. Critics argue this design incentive can inadvertently promote sensational or polarising content, since such content tends to generate stronger engagement than neutral material.",
            "Quantum computers, which use principles of quantum mechanics rather than traditional binary logic, remain in an early experimental stage but have already demonstrated an ability to solve certain narrow problems far faster than classical computers. Widespread practical use remains years away, according to most experts, largely due to the extreme conditions — near absolute-zero temperatures — that current quantum hardware requires.",
        ],
        "skimSecondsPerParagraph": 90,
        "modelSummaries": [
            "Deepfakes are getting harder to detect visually, so verification may need to shift to the source.",
            "Open-source AI speeds up innovation and enables safety audits, but also lowers barriers to misuse.",
            "A digital divide persists due to unequal internet access; subsidies help but remote areas lag behind.",
            "Right-to-repair laws aim to let consumers fix devices independently, cutting waste and cost.",
            "Engagement-focused recommendation algorithms can end up promoting sensational content.",
            "Quantum computers show promise for narrow problems but need extreme conditions and more development.",
        ],
        "questions": [],
    },
    "writing": {
        "taskType": "Task 2",
        "prompt": "Some people believe that the increasing use of artificial intelligence in the workplace will lead to widespread job losses, while others believe it will create as many new jobs as it eliminates. Discuss both views and give your own opinion. Write at least 250 words.",
        "chart": None, "minWords": 250, "timeLimitMinutes": 0,
        "checklist": TASK2_ESSAY_CHECKLIST,
        "modelAnswer": "The rise of artificial intelligence in the modern workplace has sparked considerable debate about its long-term effect on employment. This essay will examine both perspectives before presenting my own view.\n\nThose who anticipate widespread job losses point to the fact that AI systems are increasingly capable of performing tasks once thought to require human judgement, from analysing legal documents to responding to customer enquiries. Roles that involve repetitive, rules-based work are considered particularly vulnerable, and some economists warn that displaced workers, especially those in mid-skill administrative roles, may struggle to transition into new fields without significant retraining.\n\nOthers, however, note that previous waves of automation — from mechanised agriculture to computerisation — ultimately created more jobs than they destroyed, often in roles that did not previously exist. They argue that AI is likely to follow a similar pattern, generating demand for new occupations such as AI system trainers, ethicists and maintenance specialists, while also increasing productivity in ways that lower costs and expand overall economic activity, indirectly supporting employment elsewhere.\n\nIn my view, both effects are likely to occur simultaneously: some roles will genuinely disappear, while new ones emerge, but the transition is unlikely to be smooth or evenly distributed. Governments and employers will need to invest significantly in retraining programmes to help affected workers move into new roles, rather than assuming the labour market will adjust on its own.\n\nIn conclusion, while AI will likely both destroy and create jobs, proactive support for affected workers will determine whether the transition is a net benefit or a source of prolonged hardship.",
    },
    "speaking": {
        "part": 1,
        "instructions": "Record yourself answering all six questions as though this were the real Part 1 interview. Afterwards, count how many times you said 'um', 'uh', or similar filler words.",
        "items": [
            {"prompt": "Let's talk about technology. Do you use a lot of apps on your phone?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "How has technology changed the way you study or work?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think people rely on technology too much nowadays?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "What piece of technology could you not live without?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Do you think AI will make life easier or more difficult in the future?", "prepSeconds": 5, "speakSeconds": 45},
            {"prompt": "Were you taught how to use computers at school?", "prepSeconds": 5, "speakSeconds": 45},
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
            {"speaker": "Officer", "text": "Hi, thanks for calling about the cybersecurity workshop."},
            {"speaker": "Caller", "text": "Hi, yes, I run a small shop and saw the flyer — I'd like to sign up."},
            {"speaker": "Officer", "text": "Great, it's on Tuesday the 9th, from 6 to 8pm, at the Business Hub on Mill Street."},
            {"speaker": "Caller", "text": "Is there a cost?"},
            {"speaker": "Officer", "text": "It's free for anyone running a business with under 20 staff."},
            {"speaker": "Caller", "text": "Perfect, that's me. Do I need to bring anything?"},
            {"speaker": "Officer", "text": "Just a notepad — we'll cover password security and how to spot phishing emails."},
            {"speaker": "Caller", "text": "Sounds useful. Is there a limit on numbers?"},
            {"speaker": "Officer", "text": "Yes, we can only take 25 people, so I'd register soon if you're keen."},
            {"speaker": "Caller", "text": "I'll register now then. What's the best way?"},
            {"speaker": "Officer", "text": "Just give me your business name and an email address, and I'll send confirmation."},
            {"speaker": "Caller", "text": "It's Riverside Bakery, and the email is orders at riversidebakery dot co dot uk."},
            {"speaker": "Officer", "text": "Lovely, you're booked in."},
        ],
        "formTitle": "Free Cybersecurity Workshop — Registration",
        "questions": [
            {"id": "q1", "type": "gap", "prompt": "Date: Tuesday the ___", "answer": "9th", "altAnswers": ["9", "ninth"]},
            {"id": "q2", "type": "gap", "prompt": "Time:", "answer": "6 to 8pm", "altAnswers": ["6-8pm", "6 till 8pm", "18:00-20:00"]},
            {"id": "q3", "type": "gap", "prompt": "Location: Business Hub, ___ Street", "answer": "Mill", "altAnswers": []},
            {"id": "q4", "type": "gap", "prompt": "Free for businesses with under ___ staff", "answer": "20", "altAnswers": ["twenty"]},
            {"id": "q5", "type": "gap", "prompt": "Bring:", "answer": "a notepad", "altAnswers": ["notepad"]},
            {"id": "q6", "type": "gap", "prompt": "Maximum attendees:", "answer": "25", "altAnswers": ["twenty-five", "twenty five"]},
            {"id": "q7", "type": "gap", "prompt": "Business name:", "answer": "Riverside Bakery", "altAnswers": ["riverside bakery"]},
        ],
        "predictionMode": True,
    },
    "reading": {
        "title": "Skimming & Scanning Basics",
        "instructions": "You have 60 seconds to skim each short passage. Then identify which numbered sentence is the true topic sentence (the one stating the paragraph's main idea).",
        "passage": [
            "Voice Assistants in the Home\n\n(1) Voice-activated assistants have moved from novelty gadgets to fixtures in millions of households within less than a decade. (2) Their growing popularity is largely explained by convenience: users can set timers, control smart lighting, or check the weather without touching a screen. (3) Some privacy researchers, however, have raised concerns about how much audio data these devices collect and retain.",
            "The Rise of No-Code Platforms\n\n(1) Building a website or a simple app once required years of programming training. (2) No-code platforms have changed this by allowing people with no technical background to build working software using visual, drag-and-drop tools. (3) As a result, small business owners increasingly build their own websites and internal tools rather than hiring a developer.",
        ],
        "skimSecondsPerParagraph": 60,
        "questions": [
            {"id": "q1", "type": "mcq", "prompt": "Passage 1 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 1},
            {"id": "q2", "type": "mcq", "prompt": "Passage 2 — which sentence is the true topic sentence?", "options": ["Sentence 1", "Sentence 2", "Sentence 3"], "answerIndex": 1},
        ],
    },
    "writing": {
        "taskType": "Task 1",
        "prompt": "The chart below shows the percentage of households owning a smart speaker in four countries in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        "chart": {"type": "bar", "data": [
            {"label": "Country A", "value": 58, "color": "#10b981"},
            {"label": "Country B", "value": 41, "color": "#6366f1"},
            {"label": "Country C", "value": 30, "color": "#f59e0b"},
            {"label": "Country D", "value": 65, "color": "#ec4899"},
        ]},
        "minWords": 150, "timeLimitMinutes": 20,
        "checklist": TASK1_CHART_CHECKLIST,
        "modelAnswer": "The bar chart shows the proportion of households owning a smart speaker in four different countries in 2023.\n\nOverall, Country D had the highest rate of smart speaker ownership, while Country C had the lowest, with a gap of 35 percentage points between them.\n\nCountry D led with 65% of households owning a smart speaker, narrowly ahead of Country A at 58%. Country B trailed behind these two, with 41% ownership, while Country C had the lowest figure of all, at just 30% — less than half the rate seen in Country D.\n\nIn summary, smart speaker ownership varied considerably across the four countries, with more than a thirty-point gap separating the highest and lowest figures.",
    },
    "speaking": {
        "part": 1,
        "instructions": "For each prompt, give a one-sentence answer first, then extend it to three sentences by adding a reason and an example. Record the extended version.",
        "items": [
            {"prompt": "Do you enjoy trying out new gadgets?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Is technology a big part of your daily routine?", "prepSeconds": 10, "speakSeconds": 45},
            {"prompt": "Do you think you could go a full day without your phone?", "prepSeconds": 10, "speakSeconds": 45},
        ],
    },
},

}
