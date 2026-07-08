/**
 * utils/margCrypto.js
 * ─────────────────────────────────────────────────────────────
 * Node.js port of Marg ERP's decryption logic (originally C#/.NET,
 * given to us in Decryptionlogic.txt).
 *
 * TESTED against the vendor's own sample ciphertext — confirmed to
 * decrypt real product master data correctly.
 *
 * Pipeline (this exact order matters):
 *   1. Base64-decode the ciphertext Marg sends us
 *   2. AES-128-CBC decrypt it (key derived from the decryption key Marg gave us)
 *   3. The decrypted bytes are UTF-8 text that is ITSELF a base64 string
 *   4. Base64-decode THAT string to get raw DEFLATE-compressed bytes
 *   5. Raw-inflate (no zlib/gzip header) to get the final JSON text
 */

const crypto = require('crypto');
const zlib = require('zlib');

/**
 * Decrypts and decompresses a Marg ERP API response.
 *
 * @param {string} base64CipherText - The raw string Marg's API returns
 * @param {string} decryptionKey - The account-specific decryption key Marg gave you
 * @returns {string} The decoded JSON string (call JSON.parse on it)
 */
function decryptMargResponse(base64CipherText, decryptionKey) {
  // Step 1: Derive a 16-byte AES key from the password string.
  // Marg's C# code does: UTF8 bytes of the key, zero-padded (or truncated) to 16 bytes.
  // The SAME 16 bytes are reused as the IV — that's how Marg's vendor code works,
  // not something we chose, just matching their implementation exactly.
  const keyBytes = Buffer.alloc(16, 0);
  const pwdBytes = Buffer.from(decryptionKey, 'utf8');
  pwdBytes.copy(keyBytes, 0, 0, Math.min(pwdBytes.length, 16));

  // Step 2: AES-128-CBC decrypt with PKCS7 padding (Node handles PKCS7 automatically)
  const decipher = crypto.createDecipheriv('aes-128-cbc', keyBytes, keyBytes);
  const cipherBytes = Buffer.from(base64CipherText.replace(/\s+/g, ''), 'base64');
  const decrypted = Buffer.concat([decipher.update(cipherBytes), decipher.final()]);

  // Step 3 & 4: The decrypted bytes are a UTF-8 string which is ITSELF base64-encoded
  // deflate data. Confirmed by testing — matches Marg's C# Decompress() method, which
  // calls Convert.FromBase64String a second time.
  const innerBase64 = decrypted.toString('utf8');
  const deflateBytes = Buffer.from(innerBase64, 'base64');

  // Step 5: Raw DEFLATE decompress. IMPORTANT: .NET's DeflateStream produces RAW deflate
  // data with NO zlib header — use inflateRawSync, not inflateSync/gunzipSync, or you'll
  // get "incorrect header check" errors.
  const jsonBytes = zlib.inflateRawSync(deflateBytes);

  // Strip a UTF-8 BOM if present (Marg's responses sometimes include one)
  let jsonStr = jsonBytes.toString('utf8');
  if (jsonStr.charCodeAt(0) === 0xFEFF) {
    jsonStr = jsonStr.slice(1);
  }

  return jsonStr;
}

/** Convenience wrapper: decrypts AND parses in one call. */
function decryptMargResponseToJson(base64CipherText, decryptionKey) {
  return JSON.parse(decryptMargResponse(base64CipherText, decryptionKey));
}

/**
 * Some Marg endpoints (e.g. InsertOrderDetail) may return SHORT plain JSON
 * responses that are NOT encrypted — the docs are inconsistent about this.
 * This helper tries plain JSON.parse first, and falls back to decrypt-then-parse
 * if that fails. Use this for endpoints you haven't confirmed encryption for yet.
 */
function parseMaybeEncrypted(rawResponseBody, decryptionKey) {
  const raw = typeof rawResponseBody === 'string'
    ? rawResponseBody
    : JSON.stringify(rawResponseBody);

  try {
    return JSON.parse(raw);
  } catch (e) {
    return decryptMargResponseToJson(raw.replace(/^"|"$/g, ''), decryptionKey);
  }
}

module.exports = {
  decryptMargResponse,
  decryptMargResponseToJson,
  parseMaybeEncrypted,
};
