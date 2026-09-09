# -*- coding: utf-8 -*-
import json, math, sys
from content_banks import GRAMMAR_BANK, TOPICS, VOCAB_BANK
from task_banks import LISTENING, READING, WRITING, SPEAKING, PHASE_NAMES
from exercises_week1 import EXERCISES as WEEK1_EXERCISES
from exercises_topic_technology import EXERCISES as TECH_EXERCISES
from exercises_topic_education import EXERCISES as EDU_EXERCISES
from exercises_topic_health import EXERCISES as HEALTH_EXERCISES
from exercises_topic_urban import EXERCISES as URBAN_EXERCISES

# ---------------------------------------------------------------------------
# Real, gradable exercise content — Month 1 (Weeks 1-5, days 1-35).
#
# Discovery: across the whole 180-day schedule, day_type/primary-skill only
# depends on wd (weekday-in-week), and wd cycles identically every week — but
# the *specific* task-block title chosen by pick() depends on the running
# counters (which increment every day, never reset per week), so within a
# month the title actually shown for a given wd shifts by 2 positions each
# week (7 days-per-week mod a 5-entry bank). Empirically this settles into a
# clean rule: pattern_letter = ['A','B','C','D','E'][(day_number - 1) % 5],
# i.e. the pattern rotates purely off the *global* day number, not wd or week.
# Week 1's days 1-5 happen to give patterns A-E in order (which is how those
# letters were originally named), and day 6/7 of every week naturally reuse
# patterns A/B this same way (no special-casing needed).
#
# WEEK1_EXERCISES is keyed 1-5 (day-number-within-week) rather than A-E for
# historical reasons; every later topic file is keyed directly A-E.
_LETTER_TO_WEEK1_NUM = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}
PATTERN_LETTERS = ["A", "B", "C", "D", "E"]

# topic name -> exercise bank (keyed "A".."E"), for every topic with content
# authored so far. Add future topics' banks here as they're written.
TOPIC_EXERCISE_BANKS = {
    "Environment & Climate Change": {L: WEEK1_EXERCISES[_LETTER_TO_WEEK1_NUM[L]] for L in PATTERN_LETTERS},
    "Technology & Artificial Intelligence": TECH_EXERCISES,
    "Education & Learning": EDU_EXERCISES,
    "Health & Wellbeing": HEALTH_EXERCISES,
    "Urban Development & Housing": URBAN_EXERCISES,
}

TOPIC_LOWER = {
"Environment & Climate Change": "environmental and climate issues",
"Technology & Artificial Intelligence": "technology and artificial intelligence",
"Education & Learning": "education and learning",
"Health & Wellbeing": "health and wellbeing",
"Urban Development & Housing": "urban development and housing",
"Globalisation & Trade": "globalisation and trade",
"Work, Careers & the Gig Economy": "work, careers and the gig economy",
"Media, Advertising & Social Media": "media, advertising and social media",
"Crime, Law & Punishment": "crime, law and punishment",
"Government, Policy & Public Spending": "government policy and public spending",
"Family, Society & Demographics": "family, society and demographics",
"Culture, Tradition & Identity": "culture, tradition and identity",
"Science, Space & Innovation": "science, space and innovation",
"Transport & Infrastructure": "transport and infrastructure",
"Tourism & Travel": "tourism and travel",
"Arts, Museums & Heritage": "the arts, museums and heritage",
"Sport & Recreation": "sport and recreation",
"Food, Agriculture & Sustainability": "food, agriculture and sustainability",
"Energy & Natural Resources": "energy and natural resources",
"Population Growth & Ageing Societies": "population growth and ageing societies",
"Privacy, Surveillance & Data": "privacy, surveillance and data",
"Wildlife & Conservation": "wildlife and conservation",
"Inequality & Poverty": "inequality and poverty",
"Language & the Globalisation of English": "language and the globalisation of English",
"The Future of Work & Automation": "the future of work and automation",
"Exam Mindset, Wellbeing & Peak Performance": "exam mindset, wellbeing and peak performance",
}

assert len(TOPICS) == 26
assert len(GRAMMAR_BANK) == 24
for t in TOPICS:
    assert t in VOCAB_BANK, t
    assert len(VOCAB_BANK[t]) == 8, t
    assert t in TOPIC_LOWER, t

# ---- Week -> Month mapping --------------------------------------------
MONTH_WEEKS = {1: list(range(1, 6)), 2: list(range(6, 10)), 3: list(range(10, 14)),
               4: list(range(14, 18)), 5: list(range(18, 22)), 6: list(range(22, 27))}
WEEK_MONTH = {}
for m, wks in MONTH_WEEKS.items():
    for w in wks:
        WEEK_MONTH[w] = m
assert len(WEEK_MONTH) == 26

TAPER_WEEKS = {25, 26}

def days_in_week(w):
    return 6 if w in TAPER_WEEKS else 7

def month_of(w):
    return WEEK_MONTH[w]

def grammar_pass_label(month):
    if month <= 2:
        return "Pass 1 · Recognition & Controlled Practice"
    if month <= 4:
        return "Pass 2 · Production in Writing & Speech"
    return "Pass 3 · Fluent, Timed Mastery"

def pick(bank_dict, month, idx):
    lst = bank_dict[month]
    title, tmpl = lst[idx % len(lst)]
    return title, tmpl

def fmt(s, topic):
    return s.format(topic=topic, topic_lower=TOPIC_LOWER[topic])

def vocab_for(topic, offset, n=3):
    items = VOCAB_BANK[topic]
    out = []
    for i in range(n):
        phrase, sent = items[(offset + i) % len(items)]
        out.append({"phrase": phrase, "sentence": sent})
    return out

def make_grammar(g_counter, topic, month):
    g = GRAMMAR_BANK[g_counter % len(GRAMMAR_BANK)]
    return {
        "name": g["name"],
        "level": g["level"],
        "pass_": grammar_pass_label(month),
        "rule": g["rule"],
        "formula": g["formula"],
        "example": fmt(g["example"], topic),
        "tip": g["tip"],
    }

def skill_block(bank, month, idx, topic, minutes):
    title, tmpl = pick(bank, month, idx)
    return {"title": title, "detail": fmt(tmpl, topic), "minutes": minutes}

DAYS = []
day_number = 0
grammar_counter = 0
# independent rotation counters per skill, offset so the four skill banks never
# rotate in lockstep (avoids picking the same list-position title on the same day)
counters = {"listening": 0, "reading": 1, "writing": 2, "speaking": 3}
vocab_offset_by_week = {}

for week in range(1, 27):
    month = month_of(week)
    phase = PHASE_NAMES[month]
    topic = TOPICS[week - 1]
    nd = days_in_week(week)
    vocab_offset_by_week[week] = 0

    for wd in range(1, nd + 1):
        day_number += 1
        is_taper = week in TAPER_WEEKS

        if not is_taper:
            weekday_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            weekday_name = weekday_names[wd - 1]
            if wd == 1:
                day_type, primary = "grammar", ["Grammar", "Reading"]
            elif wd == 2:
                day_type, primary = "listening", ["Listening"]
            elif wd == 3:
                day_type, primary = "writing", ["Writing"]
            elif wd == 4:
                day_type, primary = "speaking", ["Speaking"]
            elif wd == 5:
                day_type, primary = "grammar", ["Grammar", "Reading"]
            elif wd == 6:
                day_type, primary = "mock", ["Listening", "Reading", "Writing", "Speaking"]
            else:
                day_type, primary = "rest", ["Rest & Review"]
        else:
            weekday_names = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"]
            weekday_name = weekday_names[wd - 1]
            pattern = [
                ("mock", ["Reading", "Listening"]),
                ("mock", ["Writing"]),
                ("mock", ["Speaking"]),
                ("grammar", ["Grammar", "Reading"]),
                ("mock", ["Listening", "Reading", "Writing", "Speaking"]),
                ("rest", ["Speaking", "Rest & Review"]),
            ]
            day_type, primary = pattern[wd - 1]

        # ---- grammar (every day gets one, rotating through the bank) ----
        grammar = make_grammar(grammar_counter, topic, month)
        grammar_counter += 1

        # ---- four macro-skill blocks (always populated; deeper on primary day) ----
        is_l_primary = "Listening" in primary
        is_r_primary = "Reading" in primary
        is_w_primary = "Writing" in primary
        is_s_primary = "Speaking" in primary

        listening = skill_block(LISTENING, month, counters["listening"], topic, 45 if is_l_primary else 15)
        counters["listening"] += 1
        reading = skill_block(READING, month, counters["reading"], topic, 45 if is_r_primary else 15)
        counters["reading"] += 1
        writing = skill_block(WRITING, month, counters["writing"], topic, 45 if is_w_primary else 15)
        counters["writing"] += 1
        speaking = skill_block(SPEAKING, month, counters["speaking"], topic, 30 if is_s_primary else 10)
        counters["speaking"] += 1

        # ---- rest day gets a lighter, consolidation-flavoured overlay ----
        if day_type == "rest" and not is_taper:
            listening["minutes"] = 20
            reading["minutes"] = 10
            writing["minutes"] = 10
            speaking["minutes"] = 15
            action = (f"Consolidation day: redo your Week {week} vocabulary as active-recall flashcards, "
                      f"re-listen to one difficult clip from this week without notes, and rewrite one sentence "
                      f"from this week's grammar point ({grammar['name']}) from memory. No new content today.")
            est_minutes = 60
        elif is_taper and day_type == "rest":
            listening["minutes"] = 15
            reading["minutes"] = 10
            writing["minutes"] = 10
            speaking["minutes"] = 25
            action = ("Peak-performance & confidence day: deliver one final full Part 1-3 Speaking rehearsal, "
                       "then close your six-month mistake audit log by re-reading its three most frequent entries. "
                       "Finish with light review only — protect your energy for exam day.")
            est_minutes = 70
        elif is_taper and day_type == "grammar":
            action = (f"Final grammar polish: write 6 original C1-level sentences using {grammar['name']} on "
                      f"'{topic}', then proofread your last three practice essays specifically for this structure "
                      f"and your other recurring error types from the six-month audit log.")
            est_minutes = 90
        elif day_type == "mock" and is_taper:
            focus_str = " + ".join(primary)
            action = (f"Exam-simulation day ({focus_str}): work under full, uninterrupted timing exactly as you "
                      f"will on test day, using an authentic past-paper style task, then log results against your "
                      f"six-month mistake audit.")
            est_minutes = 100
        elif day_type == "mock":
            action = (f"Integrated practice: complete a mixed timed set touching Listening, Reading, Writing and "
                      f"Speaking on '{topic}' — simulate real exam pacing across all four skills in one sitting.")
            est_minutes = 105
        else:
            deliverable_map = {
                "grammar": f"Write 6 original sentences using today's grammar point ({grammar['name']}) about '{topic}', then redo the primary {primary[1] if len(primary)>1 else primary[0]} task above and self-check against the answer key.",
                "listening": f"Complete today's Listening drill under timed conditions, then write 5 dictation sentences from the trickiest section to check spelling and word-form accuracy.",
                "writing": f"{writing['detail']} Self-check word count and time.",
                "speaking": f"Record your Speaking answers on '{topic}' as audio, then transcribe 60 seconds of it and mark every use of today's grammar point and vocabulary.",
            }
            action = deliverable_map[day_type]
            est_minutes = 90

        vocab = vocab_for(topic, vocab_offset_by_week[week], 3)
        vocab_offset_by_week[week] += 3

        DAYS.append({
            "n": day_number,
            "m": month,
            "w": week,
            "wd": wd,
            "wdName": weekday_name,
            "phase": phase,
            "dayType": day_type,
            "topic": topic,
            "focus": primary,
            "grammar": grammar,
            "listening": listening,
            "reading": reading,
            "writing": writing,
            "speaking": speaking,
            "vocab": vocab,
            "action": action,
            "estMinutes": est_minutes,
        })

assert day_number == 180, day_number

# Attach real, gradable exercise content for every topic we've authored so
# far (currently Month 1 / Weeks 1-5 / days 1-35 — see TOPIC_EXERCISE_BANKS).
for d in DAYS:
    bank = TOPIC_EXERCISE_BANKS.get(d["topic"])
    if bank:
        letter = PATTERN_LETTERS[(d["n"] - 1) % 5]
        d["exercise"] = bank[letter]

months_summary = []
for m in range(1, 7):
    wks = MONTH_WEEKS[m]
    d = [x for x in DAYS if x["m"] == m]
    months_summary.append({"month": m, "phase": PHASE_NAMES[m], "weeks": wks, "dayCount": len(d)})

out = {"days": DAYS, "months": months_summary, "topics": TOPICS, "phaseNames": PHASE_NAMES,
       "grammarBankSize": len(GRAMMAR_BANK), "totalDays": day_number}

with open("roadmap_data.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False)

print("OK — total days:", day_number)
for ms in months_summary:
    print(ms)
print("File size bytes:", __import__("os").path.getsize("roadmap_data.json"))
