# JunosExamPrep — Juniper JNCIS Mock Exams (ENT & SP)

Interactive, timed practice exams for two Juniper Specialist certifications, built as a
static site (plain HTML/CSS/JS). No build step, no dependencies, **no external database** —
all progress is stored in your browser's `localStorage`.

- **JNCIS-ENT (JN0-352)** — Enterprise Routing and Switching, Specialist
- **JNCIS-SP (JN0-364)** — Service Provider Routing and Switching, Specialist

## Live site (GitHub Pages)

Once Pages is enabled for this repo, the app is served from the repo root at:

**https://dadhika01.github.io/JunosExamPrep/**

### Enabling GitHub Pages
Repo → **Settings → Pages** → *Build and deployment* → **Deploy from a branch** →
Branch **`main`**, folder **`/ (root)`** → **Save**. The site goes live in a minute or two.

## Features

- **Multiple separate mock exams per certification** (8 each).
- **Performance Dashboard** (📊 on the home screen): overall stats (attempts, best/average score,
  pass rate, most recent), **weakest and strongest areas** aggregated per domain across your attempts,
  a score trend chart, and best score per exam — with a certification filter. Built entirely from your
  localStorage attempt history (no server).
- **Revision Cheat Sheet** (📝 on the home screen): a printable quick-reference covering both certs'
  objectives. Each feature card has five sections — **Concept · Why it's needed · Key values/defaults ·
  Important flows · Limitations** — with illustrative CLI where it aids memory. Includes a cert filter,
  search, and a Print/PDF button.
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

### JNCIS-ENT (JN0-352) — 11 exams, 340 questions
*Real exam: 65 questions / 90 min · Junos OS 23.1 · Prerequisite: JNCIA-Junos*

**Full-length, exam-realistic mocks (60 Q / 90-minute clock):**
| Exam | Style | Questions |
|------|-------|-----------|
| ★ Full Mock — Voucher Style | Exhibits, choose-two, defaults; weighted to weak areas | 60 |
| ★ Full Mock 2 — Hard | Tougher, exhibit-heavy, multi-step, edge-case distractors | 60 |
| ★ Full Mock 3 — Hard | Tougher, exhibit-heavy, multi-step, edge-case distractors | 60 |

**Topic / practice sets:**
| Exam | Focus | Questions |
|------|-------|-----------|
| Mock Exam A | Full blueprint (all 9 domains) | 25 |
| Mock Exam B | Full blueprint, fresh scenarios | 25 |
| Mock Exam C | Rapid mixed check-in | 15 |
| Mock Exam D | Scenarios & troubleshooting | 25 |
| Mock Exam E | Configuration & design (incl. config-snippet reads) | 25 |
| Mock Exam F | Mixed rapid check-in | 15 |
| Mock Exam G | Layer 2 security & filters (DHCP snooping, DAI, IP source guard, MACsec, L2 filters) | 15 |
| Mock Exam H | High availability & filter-based forwarding (Virtual Chassis, RTG, NSB, ISSU, FBF) | 15 |

### JNCIS-SP (JN0-364) — 8 exams, 150 questions
*Real exam: 65 questions / 90 min · Junos OS 25.2 · Prerequisite: JNCIA-Junos*

| Exam | Focus | Questions |
|------|-------|-----------|
| Mock Exam A | Full blueprint (all 12 domains) | 25 |
| Mock Exam B | MPLS & MPLS-VPN focus | 20 |
| Mock Exam C | Routing, IPv6, tunnels, CoS & HA | 20 |
| Mock Exam D | MPLS & VPN scenarios | 20 |
| Mock Exam E | Routing, IPv6 & design | 20 |
| Mock Exam F | Mixed rapid check-in | 15 |
| Mock Exam G | Segment Routing (SR-MPLS), MPLS forwarding & provider bridging (Q-in-Q, virtual switches) | 15 |
| Mock Exam H | IPv6, IPv6-over-IPv4 tunneling & high availability (NSB, LAG, BFD, VRRP) | 15 |

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
data-ent-3.js   # appends ENT mock exams G–H (objective gap coverage)
data-ent-exam.js  / -exam2.js / -exam3.js  # three full-length 60 Q / 90 min ENT mocks
data-sp.js      # SP_CERT:  metadata, domains, mock exams A–C
data-sp-2.js    # appends SP mock exams D–F
data-sp-3.js    # appends SP mock exams G–H (objective gap coverage)
cheatsheet.js   # CHEATSHEET data for the revision cheat-sheet screen
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
