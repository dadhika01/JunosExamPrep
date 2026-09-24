/* Juniper JNCIS Mock Exams (ENT + SP) — application logic
 * - Timer scaled to exam length (~83s per question, matching ~90 min for 65 Q).
 * - Progress saved in localStorage: resume an in-progress exam + attempt history.
 * - Score and explanations revealed at the end. No external database.
 */
(function () {
  "use strict";

  // Seconds allotted per question (65 questions * 83s ≈ 90 minutes, the real exam clock).
  const SECONDS_PER_QUESTION = 83;
  const PASS_MARK = 65; // % study benchmark

  const LS_RESUME = "jncis.resume.v1";   // in-progress session
  const LS_HISTORY = "jncis.history.v1"; // array of past attempts

  const state = {
    cert: null,
    exam: null,
    questions: [],     // active session questions (order/options as presented)
    answers: {},       // qIndex -> array of chosen option indexes
    flagged: {},       // qIndex -> bool
    current: 0,
    timeLimit: 0,      // seconds
    remaining: 0,
    timerId: null,
    submitted: false
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const LETTERS = ["A", "B", "C", "D", "E", "F"];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function showScreen(id) {
    $$(".screen").forEach((s) => s.classList.remove("active"));
    $("#" + id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }
  function domainLabel(cert, key) { return (cert.domains && cert.domains[key]) || key; }
  function answerIndexes(q) { return Array.isArray(q.answer) ? q.answer.slice() : [q.answer]; }
  function examQuestionCount(cert) { return cert.exams.reduce((n, e) => n + e.questions.length, 0); }
  function findCert(id) { return CERTS.find((c) => c.id === id) || null; }
  function findExam(cert, id) { return cert ? cert.exams.find((e) => e.id === id) || null : null; }

  // ---------- localStorage helpers ----------
  function lsGet(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function lsRemove(key) { try { localStorage.removeItem(key); } catch (e) {} }

  function saveResume() {
    if (state.submitted || !state.exam) return;
    lsSet(LS_RESUME, {
      certId: state.cert.id,
      examId: state.exam.id,
      // persist the presented question order by id, and the presented option order
      questions: state.questions.map((q) => ({
        id: q.id, domain: q.domain, text: q.text, options: q.options,
        answer: q.answer, multi: q.multi, explanation: q.explanation
      })),
      answers: Object.keys(state.answers).reduce((acc, k) => {
        acc[k] = Array.from(state.answers[k]); return acc;
      }, {}),
      flagged: state.flagged,
      current: state.current,
      timeLimit: state.timeLimit,
      remaining: state.remaining,
      savedAt: Date.now()
    });
  }
  function clearResume() { lsRemove(LS_RESUME); }

  function getHistory() { return lsGet(LS_HISTORY, []); }
  function addHistory(entry) {
    const h = getHistory();
    h.unshift(entry);
    lsSet(LS_HISTORY, h.slice(0, 100)); // cap
  }

  // ---------- Home: certification cards + resume banner + history ----------
  function initHome() {
    const wrap = $("#cert-cards");
    wrap.innerHTML = "";
    CERTS.forEach((cert) => {
      const card = document.createElement("button");
      card.className = "cert-card";
      card.innerHTML =
        '<div class="cert-card-code">' + escapeHtml(cert.code) + '</div>' +
        '<h2>' + escapeHtml(cert.name) + '</h2>' +
        '<p class="cert-card-full">' + escapeHtml(cert.fullName) + '</p>' +
        '<div class="cert-card-stats">' +
          '<span>' + cert.exams.length + ' mock exams</span>' +
          '<span>' + examQuestionCount(cert) + ' questions</span>' +
          '<span>' + Object.keys(cert.domains).length + ' domains</span>' +
        '</div>' +
        '<span class="cert-card-go">View mock exams &rarr;</span>';
      card.addEventListener("click", () => openCert(cert));
      wrap.appendChild(card);
    });
    $("#back-home").addEventListener("click", () => showScreen("screen-home"));
    renderResumeBanner();
    renderHistory();
  }

  function renderResumeBanner() {
    const banner = $("#resume-banner");
    const r = lsGet(LS_RESUME, null);
    if (!r) { banner.hidden = true; return; }
    const cert = findCert(r.certId);
    const exam = cert ? cert.exams.find((e) => e.id === r.examId) : null;
    if (!cert || !exam) { clearResume(); banner.hidden = true; return; }
    const answered = Object.values(r.answers || {}).filter((a) => a && a.length).length;
    $("#resume-text").innerHTML =
      "You have an unfinished exam: <strong>" + escapeHtml(cert.name) + " · " + escapeHtml(exam.name) +
      "</strong> — " + answered + "/" + r.questions.length + " answered, " +
      formatClock(r.remaining) + " left.";
    banner.hidden = false;
    $("#resume-btn").onclick = () => resumeExam();
    $("#discard-btn").onclick = () => { clearResume(); renderResumeBanner(); };
  }

  function renderHistory() {
    const box = $("#history-box");
    const list = $("#history-list");
    const h = getHistory();
    if (!h.length) { box.hidden = true; return; }
    box.hidden = false;
    list.innerHTML = "";
    h.slice(0, 12).forEach((a) => {
      const row = document.createElement("div");
      row.className = "history-row";
      const when = new Date(a.date);
      row.innerHTML =
        '<span class="hist-badge ' + (a.passed ? "hist-pass" : "hist-fail") + '">' + a.pct + '%</span>' +
        '<span class="hist-name">' + escapeHtml(a.certName) + ' · ' + escapeHtml(a.examName) + '</span>' +
        '<span class="hist-score">' + a.correct + '/' + a.total + '</span>' +
        '<span class="hist-date">' + when.toLocaleDateString() + ' ' +
          when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + '</span>';
      list.appendChild(row);
    });
    $("#clear-history-btn").onclick = () => {
      if (window.confirm("Clear all saved attempt history?")) { lsRemove(LS_HISTORY); renderHistory(); }
    };
  }

  // ---------- Cert detail: exam list + blueprint ----------
  function openCert(cert) {
    state.cert = cert;
    $("#cert-code").textContent = cert.code;
    $("#cert-name").textContent = cert.name;
    $("#cert-full").textContent = cert.fullName;
    $("#cert-meta").textContent = cert.track + "  ·  Real exam: " + cert.realExam +
      (cert.junos ? "  ·  " + cert.junos : "") + "  ·  Prerequisite: JNCIA-Junos";

    const list = $("#exam-list");
    list.innerHTML = "";
    cert.exams.forEach((exam) => {
      const mins = Math.round(exam.questions.length * SECONDS_PER_QUESTION / 60);
      const row = document.createElement("div");
      row.className = "exam-row";
      row.innerHTML =
        '<div class="exam-row-info">' +
          '<h3>' + escapeHtml(exam.name) + '</h3>' +
          '<p>' + escapeHtml(exam.description || "") + '</p>' +
          '<span class="exam-row-count">' + exam.questions.length + ' questions · ' + mins + ' min</span>' +
        '</div>';
      const btn = document.createElement("button");
      btn.className = "btn btn-primary";
      btn.textContent = "Start";
      btn.addEventListener("click", () => startExam(exam));
      row.appendChild(btn);
      list.appendChild(row);
    });

    const counts = {};
    cert.exams.forEach((e) => e.questions.forEach((q) => { counts[q.domain] = (counts[q.domain] || 0) + 1; }));
    const bp = $("#blueprint-list");
    bp.innerHTML = "";
    Object.keys(cert.domains).forEach((key) => {
      const div = document.createElement("div");
      div.className = "blueprint-item";
      div.innerHTML = '<span>' + escapeHtml(cert.domains[key]) + '</span>' +
        '<span class="count">' + (counts[key] || 0) + '</span>';
      bp.appendChild(div);
    });

    showScreen("screen-cert");
  }

  // ---------- Start / resume ----------
  function startExam(exam) {
    if (lsGet(LS_RESUME, null)) {
      if (!window.confirm("Starting a new exam will discard your unfinished session. Continue?")) return;
    }
    state.exam = exam;
    const doShuffle = $("#shuffle").checked;

    let pool = exam.questions.slice();
    if (doShuffle) pool = shuffle(pool);

    state.questions = pool.map((q) => {
      const originalAnswers = answerIndexes(q);
      let order = q.options.map((_, i) => i);
      if (doShuffle) order = shuffle(order);
      const options = order.map((i) => q.options[i]);
      const answer = order
        .map((origIdx, newIdx) => (originalAnswers.includes(origIdx) ? newIdx : -1))
        .filter((i) => i !== -1);
      return { id: q.id, domain: q.domain, text: q.text, options, answer, multi: !!q.multi, explanation: q.explanation };
    });

    state.answers = {};
    state.flagged = {};
    state.current = 0;
    state.submitted = false;
    state.timeLimit = exam.questions.length * SECONDS_PER_QUESTION;
    state.remaining = state.timeLimit;

    enterExam();
  }

  function resumeExam() {
    const r = lsGet(LS_RESUME, null);
    if (!r) { renderResumeBanner(); return; }
    const cert = findCert(r.certId);
    const exam = cert ? cert.exams.find((e) => e.id === r.examId) : null;
    if (!cert || !exam) { clearResume(); renderResumeBanner(); return; }

    state.cert = cert;
    state.exam = exam;
    state.questions = r.questions.map((q) => ({
      id: q.id, domain: q.domain, text: q.text, options: q.options,
      answer: q.answer, multi: !!q.multi, explanation: q.explanation
    }));
    state.answers = {};
    Object.keys(r.answers || {}).forEach((k) => { state.answers[k] = new Set(r.answers[k]); });
    state.flagged = r.flagged || {};
    state.current = r.current || 0;
    state.submitted = false;
    state.timeLimit = r.timeLimit;
    state.remaining = r.remaining;

    enterExam();
  }

  function enterExam() {
    $("#exam-title-mini").textContent = state.cert.name + " · " + state.exam.name;
    buildNavigator();
    renderQuestion();
    startTimer();
    saveResume();
    showScreen("screen-exam");
  }

  // ---------- Timer ----------
  function startTimer() {
    stopTimer();
    updateTimerLabel();
    state.timerId = setInterval(() => {
      state.remaining--;
      updateTimerLabel();
      if (state.remaining % 5 === 0) saveResume(); // periodic checkpoint
      if (state.remaining <= 0) { stopTimer(); submitExam(true); }
    }, 1000);
  }
  function stopTimer() { if (state.timerId) { clearInterval(state.timerId); state.timerId = null; } }
  function formatClock(sec) {
    sec = Math.max(0, sec | 0);
    const m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }
  function updateTimerLabel() {
    const el = $("#timer");
    el.textContent = formatClock(state.remaining);
    el.classList.toggle("danger", state.remaining <= 60);
    el.classList.toggle("warn", state.remaining > 60 && state.remaining <= 300);
  }

  // ---------- Navigator ----------
  function buildNavigator() {
    const grid = $("#q-grid");
    grid.innerHTML = "";
    state.questions.forEach((_, i) => {
      const cell = document.createElement("button");
      cell.className = "q-cell";
      cell.textContent = i + 1;
      cell.addEventListener("click", () => { state.current = i; renderQuestion(); });
      grid.appendChild(cell);
    });
  }
  function refreshNavigator() {
    $$("#q-grid .q-cell").forEach((cell, i) => {
      cell.classList.toggle("answered", !!state.answers[i] && state.answers[i].size > 0);
      cell.classList.toggle("flagged", !!state.flagged[i]);
      cell.classList.toggle("current", i === state.current);
    });
  }

  // ---------- Render question ----------
  function renderQuestion() {
    const q = state.questions[state.current];
    const total = state.questions.length;

    $("#q-position").textContent = "Question " + (state.current + 1) + " of " + total;
    $("#progress-bar").style.width = ((state.current + 1) / total * 100) + "%";
    $("#q-domain").textContent = domainLabel(state.cert, q.domain);
    $("#q-text").textContent = q.text;
    $("#q-hint").textContent = q.multi
      ? "Select all that apply (" + q.answer.length + " correct)."
      : "Select one answer.";

    $("#flag-btn").classList.toggle("active", !!state.flagged[state.current]);

    const wrap = $("#q-options");
    wrap.innerHTML = "";
    const chosen = state.answers[state.current] || new Set();
    q.options.forEach((text, i) => {
      const opt = document.createElement("div");
      opt.className = "option" + (q.multi ? " multi" : "") + (chosen.has(i) ? " selected" : "");
      opt.innerHTML = '<span class="marker">' + LETTERS[i] + '</span><span class="opt-text">' + escapeHtml(text) + '</span>';
      opt.addEventListener("click", () => selectOption(i));
      wrap.appendChild(opt);
    });

    $("#prev-btn").disabled = state.current === 0;
    $("#next-btn").disabled = state.current === total - 1;
    refreshNavigator();
  }

  function selectOption(i) {
    const q = state.questions[state.current];
    if (!state.answers[state.current]) state.answers[state.current] = new Set();
    const set = state.answers[state.current];
    if (q.multi) { if (set.has(i)) set.delete(i); else set.add(i); }
    else { set.clear(); set.add(i); }
    saveResume();
    renderQuestion();
  }

  // ---------- Scoring ----------
  function isCorrect(q, chosenSet) {
    const chosen = chosenSet ? Array.from(chosenSet).sort() : [];
    const correct = q.answer.slice().sort();
    if (chosen.length !== correct.length) return false;
    return chosen.every((v, idx) => v === correct[idx]);
  }

  function submitExam(auto) {
    if (state.submitted) return;
    if (!auto) {
      const unanswered = state.questions.filter((_, i) => !state.answers[i] || state.answers[i].size === 0).length;
      let msg = "Submit your exam?";
      if (unanswered > 0) msg = unanswered + " question(s) are unanswered. Submit anyway?";
      if (!window.confirm(msg)) return;
    }
    state.submitted = true;
    stopTimer();
    clearResume();
    renderResults();
    showScreen("screen-results");
  }

  // ---------- Results ----------
  function renderResults() {
    const total = state.questions.length;
    let correctCount = 0;
    const perDomain = {};
    state.questions.forEach((q, i) => {
      const ok = isCorrect(q, state.answers[i]);
      if (ok) correctCount++;
      if (!perDomain[q.domain]) perDomain[q.domain] = { correct: 0, total: 0 };
      perDomain[q.domain].total++;
      if (ok) perDomain[q.domain].correct++;
    });

    const pct = Math.round((correctCount / total) * 100);
    const passed = pct >= PASS_MARK;

    // Persist to attempt history
    addHistory({
      date: Date.now(),
      certId: state.cert.id, certName: state.cert.name,
      examId: state.exam.id, examName: state.exam.name,
      correct: correctCount, total: total, pct: pct, passed: passed
    });

    $("#score-pct").textContent = pct + "%";
    const ring = $("#score-ring");
    const ringColor = passed ? "var(--ok)" : "var(--bad)";
    ring.style.background = "conic-gradient(" + ringColor + " " + (pct * 3.6) + "deg, var(--ring-track) 0deg)";

    const verdict = $("#result-verdict");
    verdict.textContent = (passed ? "Pass ✓" : "Keep studying") + " — " + state.cert.name;
    verdict.className = passed ? "pass" : "fail";
    $("#result-detail").textContent =
      state.exam.name + ": " + correctCount + " of " + total + " correct · time used: " + formatUsed() + ".";

    const bd = $("#domain-breakdown");
    bd.innerHTML = "";
    Object.keys(perDomain).sort().forEach((key) => {
      const d = perDomain[key];
      const p = Math.round((d.correct / d.total) * 100);
      const row = document.createElement("div");
      row.className = "dom-row";
      row.innerHTML =
        '<span class="dom-name">' + escapeHtml(domainLabel(state.cert, key)) + '</span>' +
        '<div class="dom-bar"><div class="dom-bar-fill" style="width:' + p + '%; background:' +
          (p >= PASS_MARK ? "var(--ok)" : p >= 40 ? "var(--warn)" : "var(--bad)") + '"></div></div>' +
        '<span class="dom-score">' + d.correct + "/" + d.total + '</span>';
      bd.appendChild(row);
    });

    renderReview(false);
    const wrongOnly = $("#wrong-only");
    wrongOnly.checked = false;
    wrongOnly.onchange = () => renderReview(wrongOnly.checked);
  }

  function formatUsed() {
    const used = state.timeLimit - state.remaining;
    const m = Math.floor(used / 60), s = used % 60;
    return m + "m " + String(s).padStart(2, "0") + "s";
  }

  function renderReview(wrongOnly) {
    const list = $("#review-list");
    list.innerHTML = "";
    state.questions.forEach((q, i) => {
      const chosen = state.answers[i] || new Set();
      const ok = isCorrect(q, chosen);
      if (wrongOnly && ok) return;
      const item = document.createElement("div");
      item.className = "review-item " + (ok ? "correct" : "incorrect");
      let html =
        '<div class="review-tag">Q' + (i + 1) + " · " + escapeHtml(domainLabel(state.cert, q.domain)) +
        " · " + (ok ? "Correct" : "Incorrect") + '</div>' +
        '<div class="review-q">' + escapeHtml(q.text) + '</div>';
      q.options.forEach((text, oi) => {
        const isAns = q.answer.includes(oi);
        const isChosen = chosen.has(oi);
        let cls = "review-opt";
        if (isAns) cls += " correct-ans"; else if (isChosen) cls += " chosen-wrong";
        let suffix = "";
        if (isAns) suffix += "  ✓";
        if (isChosen && !isAns) suffix += "  ✗ (your answer)";
        else if (isChosen && isAns) suffix += "  (your answer)";
        html += '<div class="' + cls + '">' + LETTERS[oi] + ". " + escapeHtml(text) + suffix + '</div>';
      });
      html += '<div class="explanation"><strong>Explanation:</strong> ' + escapeHtml(q.explanation) + '</div>';
      item.innerHTML = html;
      list.appendChild(item);
    });
    if (!list.children.length) {
      list.innerHTML = '<p class="muted">No items to show. Nice work — nothing incorrect!</p>';
    }
  }

  // ---------- Static controls ----------
  function initControls() {
    $("#prev-btn").addEventListener("click", () => { if (state.current > 0) { state.current--; saveResume(); renderQuestion(); } });
    $("#next-btn").addEventListener("click", () => { if (state.current < state.questions.length - 1) { state.current++; saveResume(); renderQuestion(); } });
    $("#flag-btn").addEventListener("click", () => { state.flagged[state.current] = !state.flagged[state.current]; saveResume(); renderQuestion(); });
    $("#submit-btn").addEventListener("click", () => submitExam(false));

    $("#retry-btn").addEventListener("click", () => startExam(state.exam));
    $("#other-exam-btn").addEventListener("click", () => openCert(state.cert));
    $("#home-btn").addEventListener("click", () => { initHome(); showScreen("screen-home"); });

    document.addEventListener("keydown", (e) => {
      if (!$("#screen-exam").classList.contains("active")) return;
      if (e.key === "ArrowRight") $("#next-btn").click();
      if (e.key === "ArrowLeft") $("#prev-btn").click();
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= 6) {
        const q = state.questions[state.current];
        if (q && n <= q.options.length) selectOption(n - 1);
      }
    });

    // Persist on tab hide/close so nothing is lost.
    window.addEventListener("beforeunload", saveResume);
    document.addEventListener("visibilitychange", () => { if (document.hidden) saveResume(); });
  }

  document.addEventListener("DOMContentLoaded", () => { initHome(); initControls(); });
})();
