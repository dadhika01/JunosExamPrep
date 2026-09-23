/*
 * Certification registry.
 * Each certification (ENT, SP) defines its metadata, domains, and an array of
 * independent mock exams. The app reads CERTS to build the UI dynamically.
 *
 * Data lives in data-ent.js and data-sp.js (loaded before this file).
 */
const CERTS = [
  (typeof ENT_CERT !== "undefined") ? ENT_CERT : require("./data-ent.js").ENT_CERT,
  (typeof SP_CERT !== "undefined") ? SP_CERT : require("./data-sp.js").SP_CERT
];

if (typeof module !== "undefined") { module.exports = { CERTS }; }
