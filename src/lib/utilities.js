import { supabase } from "../lib/api";

var CryptoJS = require("crypto-js");

export function encodeJSON(data) {
  // Encrypt
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    supabase.auth.user().id
  ).toString();
}

export function decodeJSON(encodedString) {
  // Decrypt
  var bytes = CryptoJS.AES.decrypt(encodedString, supabase.auth.user().id);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
