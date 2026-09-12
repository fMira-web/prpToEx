# -*- coding: utf-8 -*-
"""
Per-month-phase task template banks for Listening, Reading, Writing and
Speaking. Each entry is (title, detail_template) where detail_template may
contain {topic} / {topic_lower}. Grounded in the official IELTS format:
Listening = 4 parts / 40 Q / ~30 min; Reading = 3 passages / 40 Q / 60 min;
Writing Task 1 = 150 words / 20 min, Task 2 = 250 words / 40 min;
Speaking = 3 parts, 11-14 minutes total.
"""

PHASE_NAMES = {
    1: "Foundations & Diagnosis",
    2: "Accuracy & Task 1 / Reading Deep-Dive",
    3: "Argumentation & Task 2 Mastery",
    4: "Listening Stamina & Speed Reading",
    5: "Integrated Timed Practice & Feedback Loops",
    6: "Full Exam Simulation & Peak Performance",
}

LISTENING = {
1: [
    ("Section 1 — Form Completion", "Complete a Section 1 style form-completion drill (everyday conversation, e.g. booking or registration) on {topic_lower}; check spelling and number transcription carefully."),
    ("Diagnostic: Question-Type Recognition", "Listen once through a mixed-format clip and label each question as Section 1-4 style before checking transcripts — the goal is spotting traps, not scoring."),
    ("Section 1 — Multiple Choice Baseline", "Practise 10 multiple-choice items from a Section 1 recording, noting which distractor language nearly misled you."),
    ("British Accent Calibration", "Listen to 8 minutes of standard British-accent audio on {topic_lower} and log any words whose pronunciation surprised you."),
    ("Keyword Prediction Drill", "Before playing the audio, underline likely keywords/synonyms in the question paper for a {topic_lower} recording, then check your predictions."),
],
2: [
    ("Section 2 — Multiple Choice & Matching", "Complete a Section 2 monologue drill (multiple choice + matching) on {topic_lower}, tracking the sequence markers the speaker uses."),
    ("Map & Plan Labelling", "Practise a map/plan-labelling task related to {topic_lower}; focus on prepositions of place (adjacent to, opposite, beyond)."),
    ("Australian Accent Introduction", "Listen to 10 minutes of Australian-accent audio on {topic_lower}, noting vowel-sound differences from British English."),
    ("Distractor Tracking", "Replay a Section 2 clip and mark every place the speaker corrects or changes information — a classic Section 2 trap."),
    ("Paraphrase Spotting (Listening)", "Match 10 spoken phrases about {topic_lower} to their written paraphrases before consulting the answer key."),
],
3: [
    ("Section 3 — Academic Discussion", "Complete a Section 3 style multiple-answer and sentence-completion drill on {topic_lower} involving two or three speakers."),
    ("Shadowing Technique Practice", "Shadow a 3-minute academic discussion on {topic_lower} line-by-line, matching rhythm and stress rather than just words."),
    ("North American Accent Introduction", "Listen to 10 minutes of North American-accent audio on {topic_lower}, noting differences in intonation and reduced forms."),
    ("Speaker-Attitude Tracking", "Note each speaker's stance (agree/disagree/uncertain) throughout a Section 3 discussion on {topic_lower} — a frequent question focus."),
    ("Transcript Micro-Analysis", "After completing a Section 3 task, transcribe one challenging 90-second segment word-for-word and compare it with the official script."),
],
4: [
    ("Section 4 — Academic Lecture Notes", "Complete a Section 4 lecture-style note/summary-completion drill on {topic_lower}, writing no more than the stated word limit per gap."),
    ("Mixed-Accent Stress Test", "Listen to a lecture on {topic_lower} featuring a non-British accent (Australian/NZ/North American) without pausing, then review errors."),
    ("Speed Note-Taking", "Practise abbreviated note-taking while listening to an unscripted-style lecture on {topic_lower}; aim to capture every signposted main point."),
    ("Distraction-Trap Audit", "Review a Section 4 recording and list every instance of a distractor (a plausible-but-wrong answer mentioned then corrected)."),
    ("Signal-Word Bank Review", "Compile the discourse markers (furthermore, in contrast, to sum up) used in a lecture on {topic_lower} into your running signal-word bank."),
],
5: [
    ("Full Timed Listening Test", "Complete a full 4-part, 40-question Listening test (~30 minutes) under exam timing; do not pause the recording."),
    ("Mistake Audit Log", "Log every incorrect answer from your last full Listening test by error type (mis-heard word, spelling, distractor, missed signpost)."),
    ("Paraphrase-Matching Drill", "Complete a rapid paraphrase-matching drill across 20 spoken/written pairs related to {topic_lower} against the clock."),
    ("Weak-Section Repeat", "Re-attempt only your weakest section from your last timed test, focused entirely on the error pattern in your audit log."),
    ("Answer-Transfer Speed Drill", "Time yourself transferring answers from notes to the answer sheet format used in the computer-delivered test — accuracy under two minutes."),
],
6: [
    ("Authentic Past-Paper Listening", "Complete an authentic Cambridge IELTS past-paper Listening test end-to-end under strict exam conditions."),
    ("Final Accent & Distraction Stress-Test", "Complete a past-paper Listening section featuring an unfamiliar accent with zero pauses or replays."),
    ("Exam-Day Simulation Warm-Up", "Run a 10-minute focused-listening warm-up (as you would on exam morning) before a full past-paper attempt."),
    ("Error-Pattern Review", "Cross-check every remaining recurring error type against your six-month audit log and note what still needs polishing."),
    ("Listening Confidence Check", "Re-listen to one previously difficult Section 3/4 recording and confirm you now follow it with full comprehension."),
],
}

READING = {
1: [
    ("Skimming & Scanning Basics", "Practise 5-minute skim-reads of two passages on {topic_lower}, identifying topic sentences before reading in full."),
    ("Diagnostic Reading Passage", "Complete one diagnostic Reading passage on {topic_lower} under no time pressure; mark every unfamiliar word for your vocabulary log."),
    ("Passage Structure Mapping", "Read a passage on {topic_lower} and sketch its paragraph-by-paragraph structure (claim, evidence, counterpoint) in your notes."),
    ("Command-Word Awareness", "Review the exact instructions for 4 IELTS Reading question types and note the precise wording that defines each one."),
    ("Timed Paragraph Skim", "Skim 6 paragraphs on {topic_lower} in 90 seconds each, then write one sentence summarising each before checking accuracy."),
],
2: [
    ("True / False / Not Given Deep-Dive", "Complete a full True/False/Not Given set on {topic_lower}, explicitly justifying each 'Not Given' answer in writing."),
    ("Yes / No / Not Given (GT-style Opinion Texts)", "Complete a Yes/No/Not Given set on an opinion-based passage about {topic_lower}, distinguishing writer opinion from fact."),
    ("Keyword Paraphrase Spotting", "Highlight 15 paraphrased keyword pairs between the questions and passage on {topic_lower} before answering."),
    ("False vs Not Given Discrimination", "Review 10 previously-missed True/False/Not Given items and categorise exactly why each was misjudged."),
    ("Fact vs Opinion Marking", "Annotate a passage on {topic_lower}, marking every sentence as fact, writer's opinion, or reported opinion."),
],
3: [
    ("Heading Matching", "Complete a heading-matching task on {topic_lower}, writing a one-line gist summary for each paragraph first."),
    ("Sentence Completion Under Word Limit", "Complete a sentence-completion set on {topic_lower}, strictly respecting the 'no more than two words' style limit."),
    ("Summary Completion", "Complete a summary-completion task on {topic_lower} using a word bank, checking grammatical fit as well as meaning."),
    ("Distractor Heading Elimination", "For a heading-matching task, list why each incorrect heading option was a plausible distractor."),
    ("Matching Features/Information", "Complete a matching-features task on {topic_lower}, tracking which paragraph each piece of information came from."),
],
4: [
    ("Speed Reading — Passage 2 Style", "Complete a Passage-2-style text on {topic_lower} in 20 minutes flat, including all questions."),
    ("Speed Reading — Passage 3 Style", "Complete a dense, academic Passage-3-style text on {topic_lower} in 20 minutes, prioritising question order strategically."),
    ("Distractor Elimination Under Time", "Re-attempt a timed passage and log which distractor types (synonym trap, scope shift, negation) cost you the most time."),
    ("Vocabulary-in-Context Consolidation", "Extract 10 high-level words from today's passage on {topic_lower} and infer meaning from context before checking a dictionary."),
    ("20-Minutes-Per-Passage Discipline", "Practise strict self-timed 20-minute segments across two passages, tracking exactly where time was lost."),
],
5: [
    ("Full Timed Reading Test", "Complete a full 3-passage, 40-question Reading test (60 minutes) under exam conditions, all question types mixed."),
    ("Error-Pattern Reading Audit", "Categorise every error from your last full Reading test by type and passage position (early/mid/late)."),
    ("Time-Allocation Review", "Review your per-passage timing from the last test and adjust your strategy for passages you consistently overrun."),
    ("Weak Question-Type Repeat", "Re-attempt only the question type that most frequently appears in your error log, drawn from a fresh passage on {topic_lower}."),
    ("Answer-Transfer Accuracy Check", "Time and verify your answer-transfer accuracy against the computer-delivered answer format."),
],
6: [
    ("Authentic Past-Paper Reading", "Complete an authentic Cambridge IELTS past-paper Reading test end-to-end under strict 60-minute exam conditions."),
    ("Toughest-Passage Repeat", "Re-attempt the single hardest passage type from your audit log from a fresh past paper, timed."),
    ("Exam-Day Pacing Rehearsal", "Rehearse your exact passage order and time checkpoints (20/40/60 minutes) on a full past paper."),
    ("Final Vocabulary Cross-Check", "Cross-check your six-month vocabulary log against today's passage on {topic_lower} for genuine mastery, not just recognition."),
    ("Reading Confidence Check", "Re-attempt one previously low-scoring passage and confirm measurable improvement against your first attempt."),
],
}

WRITING = {
1: [
    ("Task 2 — Diagnostic Essay", "Write a diagnostic 250-word Task 2 essay on {topic_lower} with no time limit; focus on getting a clear position onto the page."),
    ("Task 1 — Bar Chart Basics", "Describe a bar chart related to {topic_lower} in 150 words, practising basic comparison language (higher than, the same as)."),
    ("Task 1 — Pie Chart Basics", "Describe a pie chart on {topic_lower} in 150 words, focusing on proportion language (a quarter of, the majority)."),
    ("Task 2 — Thesis Statement Practice", "Write five different thesis statements responding to a {topic_lower} prompt, then choose the clearest for full development."),
    ("Task 1 — Overview Paragraph Drill", "Write only the overview paragraph for three different Task 1 charts on {topic_lower}, without describing every detail."),
],
2: [
    ("Task 1 — Dynamic Line Graph", "Describe a line graph showing change over time in {topic_lower} in 150 words within 20 minutes, using accurate trend verbs."),
    ("Task 1 — Map / Process Diagram", "Describe a map-change or process diagram related to {topic_lower} in 150 words, using correct sequencing language."),
    ("Task 1 — Data Synthesis (Two Charts)", "Combine two related charts on {topic_lower} into a single coherent 150-word Task 1 report, selecting only the key features."),
    ("Comparison Language Bank", "Draft 10 sentences using varied comparative structures (marginally higher, nearly triple) describing data on {topic_lower}."),
    ("Task 1 — Timed Full Attempt", "Complete a full Task 1 response on {topic_lower} in exactly 20 minutes, then self-check word count and accuracy."),
],
3: [
    ("Task 2 — Opinion Essay (Agree/Disagree)", "Write a full opinion-style Task 2 essay on {topic_lower}, stating and maintaining a clear position throughout."),
    ("Task 2 — Discussion Essay (Both Views)", "Write a discussion-style Task 2 essay on {topic_lower}, presenting both views fairly before giving your own opinion."),
    ("Task 2 — Problem-Solution Essay", "Write a problem-solution Task 2 essay on {topic_lower}, ensuring solutions logically address the problems raised."),
    ("Task 2 — Two-Part Question Essay", "Write a two-part-question Task 2 essay on {topic_lower}, allocating a clear, balanced paragraph to each part."),
    ("Paragraph Architecture Drill", "Rewrite one body paragraph on {topic_lower} using the Topic Sentence -> Explanation -> Example -> Link structure."),
],
4: [
    ("Timed Task 1 + Task 2 Combo", "Complete Task 1 (20 minutes) and Task 2 (40 minutes) back-to-back on {topic_lower}, exactly as in the real test."),
    ("Cohesive Device Upgrade", "Revise a previous essay on {topic_lower}, replacing basic linkers (also, but) with C1-level alternatives (moreover, that said)."),
    ("Collocation Injection Drill", "Rewrite five sentences from a previous essay, inserting today's topic collocations naturally into the argument."),
    ("Vocabulary Range Self-Audit", "Count repeated words in your last essay on {topic_lower} and replace at least six with precise synonyms."),
    ("Task Response Precision Check", "Re-read a previous Task 2 essay and verify every paragraph directly answers the set question, cutting anything off-topic."),
],
5: [
    ("Full Timed Writing Test", "Complete Task 1 (20 min/150 words) and Task 2 (40 min/250 words) on {topic_lower} in one uninterrupted 60-minute sitting."),
    ("Band-Descriptor Self-Marking", "Mark your last full writing test against the TA/CC/LR/GRA band descriptors line by line, assigning an honest estimated band."),
    ("Mistake Audit Log (Writing)", "Log every grammar and vocabulary error from your last essay by category to identify your single most frequent error type."),
    ("Model-Answer Comparison", "Compare your last Task 2 essay to a Band 8 model answer on a similar theme, listing three concrete upgrades to make."),
    ("Targeted Rewrite", "Rewrite your weakest paragraph from the last test, applying today's grammar point and topic vocabulary explicitly."),
],
6: [
    ("Authentic Past-Paper Writing Test", "Complete an authentic Cambridge past-paper Writing Task 1 and Task 2 under full 60-minute exam conditions."),
    ("Final Polish — High-Frequency Errors", "Review your six-month error log and proofread today's essay specifically for your three most frequent recurring mistakes."),
    ("Timing Rehearsal", "Rehearse exact time checkpoints (20 min for Task 1, 40 min for Task 2) using a visible countdown, exactly as on exam day."),
    ("Band 8+ Model Benchmarking", "Compare a fresh essay against a Band 8-9 model on {topic_lower}, annotating precisely what separates the two."),
    ("Confidence Consolidation", "Write a concise essay plan (not the full essay) for three different {topic_lower}-style prompts in under five minutes each, to build planning speed."),
],
}

SPEAKING = {
1: [
    ("Part 1 — Fluency & Reflex Drill", "Answer 8 rapid Part 1 questions on {topic_lower} with no more than 5 seconds of thinking time each."),
    ("Diagnostic Recorded Interview", "Record yourself answering a full Part 1 set on {topic_lower}; listen back and note filler-word frequency."),
    ("Personal-Topic Extension Practice", "Extend three short Part 1 answers on {topic_lower} from one sentence to three, adding reasons and examples."),
    ("Natural Response Timing", "Practise answering Part 1 questions on {topic_lower} without translating mentally — aim for an immediate, natural response."),
    ("Self-Correction Awareness", "Record a short answer, transcribe it, and mark every self-correction — then redo it more fluently."),
],
2: [
    ("Part 2 — Cue Card Structure", "Study a Part 2 cue card on {topic_lower} and build a 1-minute PAST-PRESENT-FUTURE plan before speaking for 2 minutes."),
    ("Part 2 — Point-Reason-Example Framework", "Plan and deliver a Part 2 answer on {topic_lower} using the Point -> Reason -> Example -> Feeling framework."),
    ("2-Minute Delivery Timing", "Time a full Part 2 monologue on {topic_lower} to land as close to 2 minutes as possible without rushing."),
    ("Cue Card Bullet Coverage Check", "Record a Part 2 answer and verify every bullet point on the cue card about {topic_lower} was addressed."),
    ("Planning-Note Efficiency Drill", "Practise writing effective 1-minute planning notes (keywords only, not sentences) for three different cue cards."),
],
3: [
    ("Part 3 — Hypothesising", "Practise 5 Part 3 questions on {topic_lower} that require hypothesising ('What might happen if...'), using appropriate modals."),
    ("Part 3 — Evaluating Societal Trends", "Answer 5 Part 3 questions comparing past and present trends in {topic_lower}, then speculate about the future."),
    ("Extended Answer Structure", "Practise extending Part 3 answers on {topic_lower} using Answer -> Reason -> Example -> Counterpoint."),
    ("Abstract Vocabulary Injection", "Answer 4 Part 3 questions on {topic_lower}, deliberately using today's C1 collocations at least twice each."),
    ("Comparing & Contrasting Drill", "Practise comparing attitudes toward {topic_lower} across different generations or countries in extended Part 3 answers."),
],
4: [
    ("Fluency Under Pressure", "Answer 6 mixed Part 1-3 questions on {topic_lower} back-to-back with zero pause between them."),
    ("Filler-Word Reduction Drill", "Record a 3-minute mixed answer set and replace every 'um/like' instance with a natural pause or discourse marker instead."),
    ("On-the-Spot Paraphrasing", "Practise instantly paraphrasing 8 given sentences about {topic_lower} aloud, without preparation time."),
    ("Shadowing a Native Model", "Shadow a 2-minute native-speaker sample answer on {topic_lower}, matching intonation, stress and pacing exactly."),
    ("Accent-Neutral Clarity Check", "Record yourself and check that consonant endings and word stress remain clear even at a natural, fast pace."),
],
5: [
    ("Full Simulated Speaking Interview", "Complete a full simulated 11-14 minute interview (Parts 1-3) on {topic_lower}, recorded start to finish."),
    ("Self-Review Against Band Descriptors", "Review your recorded interview against the FC/LR/GRA/Pronunciation band descriptors and assign an honest estimated band."),
    ("Examiner-Style Follow-Up Drill", "Practise answering unscripted, examiner-style follow-up questions on {topic_lower} that push beyond your prepared content."),
    ("Weak-Part Repeat", "Re-record only your weakest part (1, 2 or 3) from today's interview, applying the specific fix you identified."),
    ("Vocabulary & Grammar Cross-Check", "Transcribe two minutes of your recording and mark every use of today's grammar point and topic collocations."),
],
6: [
    ("Authentic Past-Paper Speaking Test", "Complete a full authentic past-paper speaking test on {topic_lower} under realistic exam-room conditions."),
    ("Mock Interview Under Time Pressure", "Complete a mock interview with a strict 1-minute Part 2 planning limit and no extra thinking time in Parts 1 and 3."),
    ("Confidence & Mental Preparation", "Practise a 2-minute pre-interview calming routine (breathing plus a confident opening line) before your mock interview."),
    ("Final Weak-Point Polish", "Re-record your single most-improved-but-still-imperfect answer type from your six-month log, aiming for a clean take."),
    ("Peak-Performance Rehearsal", "Run a full mock interview exactly at your real exam time of day to rehearse mental readiness under authentic conditions."),
],
}
