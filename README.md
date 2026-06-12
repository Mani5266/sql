# SQLSENSEI

> Master SQL through a mind-map curriculum, in-browser SQLite, and 40+ real interview questions.
> Zero setup, zero signup, zero nonsense.

**Live:** open `index.html` in any browser.

## What's inside (7 pages, all static)

| Page | What it does |
|------|--------------|
| `index.html` | Landing — hero + 6 tiles for each tool |
| `mindmap.html` | The curriculum as a visual map — click any module to open its lesson |
| `lesson.html` | Individual lesson page — concept + examples + practice queries + key takeaways |
| `playground.html` | Real SQLite (sql.js WASM) in your browser, dataset preloaded |
| `interview.html` | 40+ real interview questions tagged by company, difficulty, topic |
| `patterns.html` | 25 production SQL recipes (top-N, sessionization, cohorts, etc.) |
| `cheatsheet.html` | Single-page syntax reference + dialect comparison |
| `SQL-Practice-Resources.pdf` | Curated external practice sites (clickable links) |

## Curriculum (5 levels, 31 modules)

- **L1 Foundations** — SELECT, WHERE, ORDER BY, DISTINCT, NULL
- **L2 Shaping Data** — aggregates, GROUP BY, HAVING, strings, dates
- **L3 Multi-Table SQL** — joins, subqueries, CTEs
- **L4 Advanced SQL** — window functions, CASE WHEN, EXISTS, indexes
- **L5 Real-World SQL** — schema design, transactions, views, optimization

## Stack

Plain HTML / CSS / vanilla JS. sql.js (CDN) for the playground. Google Fonts. No build, no install.

## Run locally

```bash
python -m http.server 8000
# or
npx serve .
```

Then go to http://localhost:8000
