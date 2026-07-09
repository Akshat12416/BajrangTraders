const zlib = require('zlib');
const str = "e797f7WSS2pJYmZOsZJVtVJwSWJJKZCl5AYUKS1KVdJR8k0tLk5MTwWJlebkKBRX5iUr5GTmZpYopFYkp6ampKboKdXWAgA=";
try {
  const bytes = Buffer.from(str, 'base64');
  const result = zlib.inflateRawSync(bytes).toString('utf8');
  console.log(result);
} catch (e) {
  console.log("Error:", e.message);
}
