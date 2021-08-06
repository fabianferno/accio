var CryptoJS = require("crypto-js");

function encodeJSON(data, key) {
  // Encrypt
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

function decodeJSON(encodedString, key) {
  // Decrypt
  var bytes = CryptoJS.AES.decrypt(encodedString, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = { encodeJSON, decodeJSON };
