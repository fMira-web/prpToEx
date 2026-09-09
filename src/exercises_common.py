"""
Shared, genuinely topic-independent exercise fragments reused across every
topic-week (weeks 2+). Only fragments that are legitimately generic belong
here — task_banks.py itself confirms which task titles never get a {topic}
substitution (e.g. "Command-Word Awareness" reviews IELTS instruction
wording, not the week's theme). Everything else (scripts, passages,
prompts, speaking questions) must be freshly written per topic so the whole
week stays thematically coherent — do not add topic-specific content here.
"""

# Reading — "Command-Word Awareness" pattern. Purely about recognising exact
# IELTS instruction wording; never topic-substituted in task_banks.py, so
# it is legitimately identical every time it appears.
COMMAND_WORD_READING = {
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
}

# Generic, skill-level self-assessment checklists — genuinely topic-independent.
TASK1_CHART_CHECKLIST = [
    "Does your opening paragraph paraphrase the question without copying it word-for-word?",
    "Does your overview state the 1-2 biggest features without giving exact numbers?",
    "Have you grouped supporting details logically (e.g. by size) rather than just listing them in chart order?",
    "Have you used proportion or comparison language accurately (e.g. 'just over two-fifths', 'nearly double')?",
    "Is your report purely descriptive, with no opinion or speculation about causes?",
]

TASK1_OVERVIEW_DRILL_CHECKLIST = [
    "Does each overview avoid mentioning every individual number?",
    "Does each overview state the 1-2 most noticeable features or trends?",
    "Have you avoided starting every overview with the same phrase?",
    "Is each overview 2-3 sentences, not a full paragraph of detail?",
]

TASK2_ESSAY_CHECKLIST = [
    "Task Response: Have you addressed every part of the question, not just one side of it?",
    "Coherence & Cohesion: Does each paragraph have one clear main idea, linked logically to the next?",
    "Lexical Resource: Have you used topic-specific vocabulary rather than repeating simple words?",
    "Grammar: Have you used a mix of sentence structures, including at least one complex sentence per paragraph?",
]

THESIS_CHECKLIST = [
    "Does each thesis statement take a clear position (agree / disagree / partly agree, or a clear stance on both views)?",
    "Is each one a single, arguable sentence rather than a description of the topic?",
    "Would a reader know, from the thesis alone, roughly what your essay would argue?",
    "Have you avoided simply restating the question?",
    "Have you written five genuinely different statements, not five versions of the same idea?",
]

# Generic reflection prompts for Speaking/Listening self-review steps.
SELF_CORRECTION_REFLECTION = "List the self-corrections, repeated words, or filler words you noticed in your answer:"
FILLER_WORD_REFLECTION = "Filler-word count / notes on your fluency:"
VOCAB_REFLECTION = "New or unfamiliar words you noticed while listening:"
