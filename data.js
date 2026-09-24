/*
 * Certification registry.
 * Each certification (ENT, SP) defines its metadata, domains, and an array of
 * independent mock exams. The app reads CERTS to build the UI dynamically.
 *
 * Browser load order (see index.html): data-ent.js, data-ent-2.js, data-sp.js,
 * data-sp-2.js, then this file. The "-2" files append their exams to the cert
 * objects, so by the time this runs the globals already include all exams.
 *
 * balanceAnswerPositions(): the source questions were authored with the correct
 * option written in a natural place, which left the correct-answer letter
 * unevenly distributed (heavily "B"). To avoid a guessable answer-position
 * pattern, we deterministically reorder each single-answer question's options
 * at load time so the correct letter cycles evenly across A/B/C/D. It is
 * deterministic (seeded by a per-cert round-robin) so scoring stays stable, and
 * it skips multi-answer questions. The app also shuffles at runtime by default;
 * this additionally fixes the stored order for when shuffle is turned off.
 */
function balanceAnswerPositions(cert) {
  var slot = 0; // round-robin target position across the whole cert
  cert.exams.forEach(function (exam) {
    exam.questions.forEach(function (q) {
      if (q.multi || !Array.isArray(q.options)) return;           // leave multi-answer as-is
      var n = q.options.length;
      var correctIdx = Array.isArray(q.answer) ? q.answer[0] : q.answer;
      if (typeof correctIdx !== "number") return;
      var target = slot % n;                                       // desired position for the correct option
      slot++;
      if (target === correctIdx) return;                           // already there
      // Move the correct option to `target`, preserving the relative order of the others.
      var correctOpt = q.options[correctIdx];
      var rest = q.options.slice(0, correctIdx).concat(q.options.slice(correctIdx + 1));
      var newOpts = rest.slice(0, target).concat([correctOpt]).concat(rest.slice(target));
      q.options = newOpts;
      q.answer = target;
    });
  });
}

var CERTS;
if (typeof ENT_CERT !== "undefined" && typeof SP_CERT !== "undefined") {
  // Browser (globals already populated and augmented by the -2 files).
  CERTS = [ENT_CERT, SP_CERT];
} else {
  // Node (validation/tooling): load base data, then apply the appended exams.
  var ent = require("./data-ent.js").ENT_CERT;
  var sp = require("./data-sp.js").SP_CERT;
  global.ENT_CERT = ent;
  global.SP_CERT = sp;
  require("./data-ent-2.js");
  require("./data-sp-2.js");
  CERTS = [ent, sp];
}

CERTS.forEach(balanceAnswerPositions);

if (typeof module !== "undefined") { module.exports = { CERTS }; }
