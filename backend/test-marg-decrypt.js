const { decryptMargResponseToJson } = require('./utils/margCrypto');
const cipherText = "e797f7WSS2pJYmZOsZJVtVJwSWJJKZCl5AYUKS1KVdJR8k0tLk5MTwWJlebkKBRX5iUr5GTmZpYopFYkp6ampKboKdXWAgA=";
const key = "LGWSIDNMXJ2Q";
try {
  const result = decryptMargResponseToJson(cipherText, key);
  console.log(result);
} catch (e) {
  console.log("Error:", e.message);
}
