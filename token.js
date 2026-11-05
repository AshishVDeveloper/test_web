/*
 * token.js — makes and reads greeting tokens in the browser.
 *   token = base64url( deflate-raw( JSON ) ) . "." . first SIG_LENGTH chars of base64url( HMAC-SHA256(payload) )
 * Same format as the old PHP version, so links made by generate.php still open.
 */
(function () {
  'use strict';

  /* ---------- SHA-256 / HMAC (plain JS, works on http:// and file:// too) ---------- */
  function primes(n) {
    var out = [], c = 2;
    while (out.length < n) { var ok = true; for (var i = 0; i < out.length && out[i] * out[i] <= c; i++) if (c % out[i] === 0) { ok = false; break; } if (ok) out.push(c); c++; }
    return out;
  }
  var P = primes(64);
  var frac = function (x) { return ((x - Math.floor(x)) * 4294967296) >>> 0; };
  var K = P.map(function (p) { return frac(Math.cbrt(p)); });
  var H0 = P.slice(0, 8).map(function (p) { return frac(Math.sqrt(p)); });
  var rotr = function (x, n) { return (x >>> n) | (x << (32 - n)); };

  function sha256(bytes) {
    var l = bytes.length, n = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(n);
    m.set(bytes); m[l] = 0x80;
    var dv = new DataView(m.buffer);
    dv.setUint32(n - 4, (l * 8) >>> 0); dv.setUint32(n - 8, Math.floor(l / 536870912));
    var H = H0.slice(), w = new Uint32Array(64);
    for (var off = 0; off < n; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (i = 16; i < 64; i++) {
        var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        var t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = new Uint8Array(32), odv = new DataView(out.buffer);
    H.forEach(function (v, i) { odv.setUint32(i * 4, v >>> 0); });
    return out;
  }

  function hmac(keyBytes, msgBytes) {
    if (keyBytes.length > 64) keyBytes = sha256(keyBytes);
    var k = new Uint8Array(64); k.set(keyBytes);
    var ip = new Uint8Array(64 + msgBytes.length), op = new Uint8Array(96);
    for (var i = 0; i < 64; i++) { ip[i] = k[i] ^ 0x36; op[i] = k[i] ^ 0x5c; }
    ip.set(msgBytes, 64);
    op.set(sha256(ip), 64);
    return sha256(op);
  }

  /* ---------- base64url ---------- */
  var enc = new TextEncoder(), dec = new TextDecoder();
  function b64urlEncode(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(str) {
    if (!/^[A-Za-z0-9_-]*$/.test(str)) return null;
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    try { var s = atob(str), b = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; }
    catch (e) { return null; }
  }

  /* ---------- deflate-raw (built into modern browsers; pako as a fallback) ---------- */
  function pipe(bytes, stream) {
    return new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  var pakoLoading = null;
  function loadPako() {
    if (window.pako) return Promise.resolve();
    return pakoLoading || (pakoLoading = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js';
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    }));
  }
  async function deflateRaw(bytes) {
    try { return await pipe(bytes, new CompressionStream('deflate-raw')); }
    catch (e) { await loadPako(); return window.pako.deflateRaw(bytes, { level: 9 }); }
  }
  async function inflateRaw(bytes) {
    var stream;
    try { stream = new DecompressionStream('deflate-raw'); } catch (e) { stream = null; }
    if (stream) return pipe(bytes, stream);
    await loadPako(); return window.pako.inflateRaw(bytes);
  }

  function sign(payload, cfg) {
    return b64urlEncode(hmac(enc.encode(cfg.SECRET_KEY), enc.encode(payload))).slice(0, cfg.SIG_LENGTH);
  }

  /** data object -> token */
  async function makeToken(data, cfg) {
    var payload = b64urlEncode(await deflateRaw(enc.encode(JSON.stringify(data))));
    return payload + '.' + sign(payload, cfg);
  }

  /** token -> data object, or null if the token is broken or was changed */
  async function readToken(token, cfg) {
    var parts = String(token).split('.');
    if (parts.length !== 2) return null;
    if (sign(parts[0], cfg) !== parts[1]) return null;
    var raw = b64urlDecode(parts[0]);
    if (!raw) return null;
    try {
      var data = JSON.parse(dec.decode(await inflateRaw(raw)));
      return (data && typeof data === 'object' && !Array.isArray(data) && data.name) ? data : null;
    } catch (e) { return null; }
  }

  window.GreetingToken = { makeToken: makeToken, readToken: readToken, sha256: sha256, hmac: hmac };
})();
