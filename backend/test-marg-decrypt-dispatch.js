const { decryptMargResponseToJson } = require('./utils/margCrypto');
const cipherText = "LRG0Ak4gga1wouR4YKn2qfWJHiCjN3Rnlmi2lq22MDlj1W1edUsYErw+OmnBGxa3IstvbYdE4zWUJA+lM/Twf6hOeD5E+oq3cedNpY3gZo9JeVf8aLeuH4cj/oIAFz7Ox7GXIFknjCTMGncGXFDZnrUAJHg62yLajBQxOxEPJbueqs8MdtOzNnUlwWye4OkMLSe4DibPD5YgfpM7Lv9uOrChzmnfkaccTfpNGmZnQjc=";
const key = "LGWSIDNMXJ2Q";
try {
  const result = decryptMargResponseToJson(cipherText, key);
  console.log(result);
} catch (e) {
  console.log("Error:", e.message);
}
