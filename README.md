# SQLSENSEI

> Master SQL the way senior engineers learned it. Socratic tutor + interactive mind map + in-browser playground + 40 interview questions.

A complete static site for learning SQL from zero to senior. No build, no server, no signup.
Just open `index.html`.

## Pages

| Page | What it does |
|------|--------------|
| `index.html` | Landing — hero, mind map preview, curriculum overview, interview teaser |
| `mindmap.html` | Interactive radial mind map of all 31 modules across 5 levels |
| `curriculum.html` | Browse every module grouped by level |
| `chat.html` | SQLSENSEI scripted tutor — Socratic method, exercises, hints, checkpoint quizzes |
| `playground.html` | Real SQLite (via sql.js WASM) with the curriculum dataset preloaded |
| `interview.html` | 40+ real interview questions tagged by company (Google, Amazon, Meta, Netflix, Stripe, Uber, Goldman, TCS, +more), difficulty, topic, and tricky-but-easy gotchas |
| `patterns.html` | 25 production SQL recipes (top-N, sessionization, cohorts, gaps & islands, etc.) |
| `cheatsheet.html` | Single-page syntax reference with PostgreSQL / MySQL / SQLite comparison table |

## Curriculum (5 levels, 31 modules)

- **Level 1 — Foundations** — SELECT, WHERE, ORDER BY, DISTINCT, NULL
- **Level 2 — Shaping Data** — aggregates, GROUP BY, HAVING, aliases, string/date functions
- **Level 3 — Multi-Table SQL** — joins, subqueries, CTEs
- **Level 4 — Advanced SQL** — window functions, CASE WHEN, EXISTS, indexes
- **Level 5 — Real-World SQL** — schema design, transactions, views, optimization, capstone

Each level ends in a 3-question checkpoint quiz (recall · apply · debug). 3/3 to unlock the next level.

## Stack

Plain HTML / CSS / vanilla JS. sql.js (CDN) for the playground. Google Fonts. **No build step, no dependencies to install.**

## Run locally

Just open `index.html` in any browser, or serve the folder:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then go to http://localhost:8000

## Progress is saved to localStorage

Completed modules, current module, streak, quiz scores, query history — all stored in your browser. Reset via `/reset` in the chat or the button on the Mind Map page.
