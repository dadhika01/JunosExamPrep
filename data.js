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
/*
 * balanceAnswerLengths(): several questions were authored with the correct
 * option carrying an inline justification (", because ...", " so ...", " — ..."),
 * which made the correct answer conspicuously the LONGEST option — a guessable
 * tell. This pass removes that tell WITHOUT losing information:
 *   1. If the correct option is the longest AND is much longer than the others,
 *      trim a trailing justification clause from it (the reasoning already lives
 *      in q.explanation, which is shown on the review screen).
 *   2. If it is still the longest by a wide margin, extend the shortest
 *      distractor(s) with a neutral, grammatical qualifier so lengths cluster.
 * Runs before balanceAnswerPositions so indexes stay valid.
 */
function balanceAnswerLengths(cert) {
  var QUALIFIERS = [
    " in this particular scenario",
    " under the default configuration",
    " on the device in question",
    " for the interface involved",
    " according to the exhibit"
  ];
  cert.exams.forEach(function (exam) {
    exam.questions.forEach(function (q) {
      if (q.multi || !Array.isArray(q.options) || q.options.length < 2) return;
      var ci = Array.isArray(q.answer) ? q.answer[0] : q.answer;
      if (typeof ci !== "number") return;
      var lens = q.options.map(function (o) { return o.length; });
      var maxOther = Math.max.apply(null, lens.filter(function (_, i) { return i !== ci; }));
      var gap = lens[ci] - maxOther;
      if (gap < 12) return; // not a meaningful tell

      // Step 1: trim a trailing justification clause from the correct option
      // (the reasoning is preserved in q.explanation shown on the review screen).
      var opt = q.options[ci];
      var cut = opt.search(/(,\s+(because|since|so that|so |as it|as they|which|whose|leaving|preventing|allowing|rather than|instead of|and can|and will|to prevent|to avoid))|( \u2014 )/i);
      if (cut > 24) { // keep a substantive core clause
        q.options[ci] = opt.slice(0, cut).replace(/[\s,;:\u2014-]+$/, "");
      }

      // Step 2: pad distractors (round-robin) with neutral qualifiers until the
      // correct option is no longer conspicuously the longest.
      lens = q.options.map(function (o) { return o.length; });
      var guard = 0;
      while (guard++ < 12) {
        var ciLen = lens[ci];
        // find the shortest distractor
        var sIdx = -1, sLen = Infinity;
        for (var i = 0; i < q.options.length; i++) {
          if (i === ci) continue;
          if (lens[i] < sLen) { sLen = lens[i]; sIdx = i; }
        }
        if (sIdx === -1 || ciLen - sLen < 12) break;
        var qual = QUALIFIERS[(guard + sIdx) % QUALIFIERS.length];
        if (q.options[sIdx].indexOf(qual) !== -1) {
          // already has this qualifier; try the next one to keep growing
          qual = QUALIFIERS[(guard + sIdx + 1) % QUALIFIERS.length];
          if (q.options[sIdx].indexOf(qual) !== -1) break;
        }
        q.options[sIdx] = q.options[sIdx].replace(/[.\s]+$/, "") + qual;
        lens[sIdx] = q.options[sIdx].length;
      }
    });
  });
}

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
  require("./data-ent-3.js");
  require("./data-ent-exam.js");
  require("./data-ent-exam2.js");
  require("./data-ent-exam3.js");
  require("./data-sp-2.js");
  require("./data-sp-3.js");
  CERTS = [ent, sp];
}

CERTS.forEach(balanceAnswerLengths);
CERTS.forEach(balanceAnswerPositions);

if (typeof module !== "undefined") { module.exports = { CERTS }; }
