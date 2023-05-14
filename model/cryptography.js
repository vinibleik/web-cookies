const {
  createHash,
  scryptSync,
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require("node:crypto");

const password = randomBytes(256);
const salt = randomBytes(16);
const algorithm = "aes-256-ctr";
const key = scryptSync(password, salt, 32);
const iv = randomBytes(16);

/**
 * Encrypt the data and return it.
 * @param {string} data Data to be encrypted
 * @returns {string}
 */
function encrypt(data) {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypt += cipher.final("hex");
  return encrypted;
}

/**
 * Return the decrypted data
 * @param {string} data Encrypted data
 * @returns {string}
 */
function decrypt(data) {
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Return the data's hash hex string
 * @param {string} data
 * @returns {string}
 */
function getHash(data) {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

module.exports = {
  getHash,
  encrypt,
  decrypt,
};
