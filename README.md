# JunosExamPrep — Juniper JNCIS Mock Exams (ENT & SP)

Interactive, timed practice exams for two Juniper Specialist certifications, built as a
static site (plain HTML/CSS/JS). No build step, no dependencies, **no external database** —
all progress is stored in your browser's `localStorage`.

- **JNCIS-ENT (JN0-351)** — Enterprise Routing and Switching, Specialist
- **JNCIS-SP (JN0-363)** — Service Provider Routing and Switching, Specialist

## Live site (GitHub Pages)

Once Pages is enabled for this repo, the app is served from the repo root at:

**https://dadhika01.github.io/JunosExamPrep/**

### Enabling GitHub Pages
Repo → **Settings → Pages** → *Build and deployment* → **Deploy from a branch** →
Branch **`main`**, folder **`/ (root)`** → **Save**. The site goes live in a minute or two.

## Features

- **Multiple separate mock exams per certification** (3 each).
- **Timed** at ~83 seconds per question — matching the real ~90-minute / 65-question exam pace.
  (A 25-question mock runs ~35 min; a 20-question mock ~28 min.) Auto-submits at time zero.
- **Progress saved in localStorage:**
  - **Resume** an in-progress exam (answers, current question, flags, and remaining time)
    even after closing the tab — a *Resume* banner appears on the home screen.
  - **Attempt history** — your recent scores per exam are listed on the home screen.
- **Score + explanations revealed at the end**, with a per-domain performance breakdown and a
  full answer review (with a "show incorrect only" filter).
- **Shuffle** questions and answer options (answer keys are remapped internally so scoring stays correct).
- **Keyboard shortcuts:** `←`/`→` move between questions, number keys `1–6` pick options.

## Mock exams

### JNCIS-ENT (JN0-351) — 6 exams, 130 questions
| Exam | Focus | Questions |
|------|-------|-----------|
| Mock Exam A | Full blueprint (all 9 domains) | 25 |
| Mock Exam B | Full blueprint, fresh scenarios | 25 |
| Mock Exam C | Rapid mixed check-in | 15 |
| Mock Exam D | Scenarios & troubleshooting | 25 |
| Mock Exam E | Configuration & design (incl. config-snippet reads) | 25 |
| Mock Exam F | Mixed rapid check-in | 15 |

### JNCIS-SP (JN0-363) — 6 exams, 120 questions
| Exam | Focus | Questions |
|------|-------|-----------|
| Mock Exam A | Full blueprint (all 12 domains) | 25 |
| Mock Exam B | MPLS & MPLS-VPN focus | 20 |
| Mock Exam C | Routing, IPv6, tunnels, CoS & HA | 20 |
| Mock Exam D | MPLS & VPN scenarios | 20 |
| Mock Exam E | Routing, IPv6 & design | 20 |
| Mock Exam F | Mixed rapid check-in | 15 |

Questions mix easy recall, tougher configuration/troubleshooting, and multi-step scenarios.
Correct-answer positions are balanced across A/B/C/D (no guessable pattern), and no question is
repeated across exams.

## Run locally

Open `index.html` directly, or serve it:

```
python3 -m http.server 8000    # then visit http://localhost:8000
```

## File layout

```
index.html      # UI shell (home → cert → exam → results)
styles.css      # dark theme
app.js          # engine: timer, localStorage resume + history, scoring, review
data.js         # CERTS registry + answer-position balancing
data-ent.js     # ENT_CERT: metadata, domains, mock exams A–C
data-ent-2.js   # appends ENT mock exams D–F
data-sp.js      # SP_CERT:  metadata, domains, mock exams A–C
data-sp-2.js    # appends SP mock exams D–F
.nojekyll       # tells GitHub Pages to serve files as-is
```

## Adding questions or exams

Push a new exam object into the relevant cert's `exams` array (`data-ent.js` / `data-sp.js`):

```js
{
  id: "ENT-D",
  name: "Mock Exam D",
  description: "Shown on the cert page.",
  questions: [
    { id: "D1", domain: "OSPF", text: "…",
      options: ["A", "B", "C", "D"], answer: 2, multi: false,
      explanation: "Why the answer is correct." }
  ]
}
```

`answer` is a 0-based index into `options` (use an array + `multi: true` for select-all-that-apply).

## Disclaimer

Questions are **original, exam-style** items written to the publicly published exam objectives for
study purposes only. This is an **unofficial** practice tool, not affiliated with or endorsed by
Juniper Networks. Always confirm current objectives on the official Juniper certification site.
