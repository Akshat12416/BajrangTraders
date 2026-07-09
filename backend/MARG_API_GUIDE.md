# MARG API INTEGRATION GUIDE
## What you were given, what it means, and how it powers the app

---

## 1. The big picture: you actually have TWO separate Marg products

This is the most important thing to understand before touching any code.

Marg ERP sells **two different integration products**, and you were given documentation + credentials for **both**, from what look like **two different demo accounts**:

| | Mobile App Solution | Corporate Collaboration (EDE) |
|---|---|---|
| **PDF** | `MobileAppSolution01.pdf` | `CorporateCollabration_App_Solution_type2.pdf` |
| **Credentials file** | `Mobile app credentials.txt` | `Corporate Demo Login & credentials-.txt` |
| **Demo Company Code** | `Praveentest2` | `RAKESHCORPORATE3` |
| **Direction** | **Two-way** — pulls data AND lets you push orders | **One-way** — only pulls data (no order placement) |
| **What it returns** | Products, customers, a single running balance per customer | Products, customers, **itemized bill-by-bill transaction history** |
| **Use for** | Product List, Cart, Checkout (placing orders), Order tracking | Detailed Ledger screen (transaction history) |

**Why this matters:** these use different company codes, which strongly suggests they're unrelated demo/sandbox accounts for two different Marg products — not the same client account exposed two ways. Your actual client (the business owner using Marg ERP) will need to tell you which of these two products **they've** actually purchased/enabled, and get you **their own** credentials — the ones in your files are Marg's generic demo/sample accounts, not your client's real data.

**The good news:** since our app only needs to *place orders* (not the Corporate EDE product, which can't do that), the **Mobile App Solution is the one you actually need**. The Corporate EDE API is a nice-to-have for richer ledger history, but not required to get the app working end-to-end.

---

## 2. File-by-file: what each upload actually is

### `MobileAppSolution01.pdf`
The official spec for the **Mobile App Solution** (the one you need). It documents three POST endpoints:

1. **`MargMST2017`** — "Master Sync." Send it your company code, and it returns *everything*: all products (`Pro_N`), price/stock updates (`Pro_U`/`Pro_S`/`Pro_R`), customer/ledger records (`Party`), and salesmen (`Users`). This is your Product List, Categories, Search, and Customer Profile data source.
2. **`InsertOrderDetail`** — Places one order line item in Marg. This is what "Place Order" on your Checkout screen calls.
3. **`LiveOrderDispatchStatus2017`** — Returns order/dispatch status for a salesman's orders. This is your Order History data source.

### `Mobile app credentials.txt`
The actual login details for the account above: `CompanyCode: Praveentest2`, `MargID: 230965`, and a **decryption key** (`LGWSIDNMXJ2Q`) needed to read the responses (explained in Section 3 below). It also shows sample request bodies for each of the three endpoints.

### `CorporateCollabration_App_Solution_type2.pdf`
The spec for a **different** Marg product — a bulk data-sync API mainly meant for accounting/back-office integrations, not live customer ordering. It returns much richer per-transaction data (`MDis` = bill-wise detail: invoice number, date, amount) which is exactly what a detailed Ledger screen wants, but it **cannot place orders** — it's read-only.

### `Corporate Demo Login & credentials-.txt`
Login details for the Corporate EDE demo account: `CompanyCode: RAKESHCORPORATE3`, a 36-character `MargKey` (a sync key, different purpose from the decryption key), and its own decryption key (`BXOW2BIS1IGD`).

### `Decryptionlogic.txt` (appears twice — same content)
**This is the most important file.** It's C# source code showing exactly how to turn Marg's encrypted API responses back into readable JSON. Every Marg response comes back scrambled (encrypted + compressed) — this file is the instruction manual for unscrambling it. Full explanation in Section 3.

### `Decompress logic.txt`
Just the second half of the above (the decompression function alone) — a partial duplicate, no new information.

### `CORPORATE_COLLABRATION_-HELPBOOK2.xlsx`
A condensed, spreadsheet version of the Corporate EDE response fields — same information as the PDF, just laid out as a field-mapping reference table. Useful as a quick lookup when writing the parser, which I already did for you (see `corporateEdeService.js`).

---

## 3. The decryption pipeline — what it does and why

Every response Marg sends back looks like meaningless text, e.g.:

```
Huy7X7t6Wh20ILOL+yeIJURFcdKxrwwmi5OhVH2aJSWnby33jtrifjaZZFKISRGw...
```

This is **encrypted** (for security in transit) and then **compressed** (to save bandwidth). To read it, you reverse both steps in order. I tested this end-to-end against Marg's own sample data and confirmed it works — here's what each step does:

```
Encrypted text from Marg
        │
        ▼
① Base64-decode          → turns the text into raw bytes
        │
        ▼
② AES-128-CBC decrypt     → "unlocks" the bytes using your decryption key
        │                    (the key is turned into 16 bytes, and reused
        │                     as both the encryption key AND the IV — this
        │                     is a quirk of Marg's own implementation)
        ▼
③ Base64-decode AGAIN     → the decrypted text is *itself* a base64 string
        │                    (this double-encoding surprised me too — but
        │                     it's confirmed by testing against real data)
        ▼
④ Raw DEFLATE decompress  → unpacks the compressed bytes into final text
        │                    (must be "raw" deflate, no zlib/gzip header,
        │                     because that's what .NET's DeflateStream produces)
        ▼
Plain JSON — the actual product/customer/order data
```

I ported this from the C# original into `backend/utils/margCrypto.js` and **tested it against Marg's own sample ciphertext** — it correctly decoded real product records (`ITEM C PACK10`, stock `90.000`, etc.) and customer ledger records. You don't need to touch this file; just call `decryptMargResponseToJson(response, yourDecryptionKey)` wherever you need it.

**One nuance:** the `InsertOrderDetail` endpoint's example responses in the PDF are very short ("Success", an order number). It's unclear from the docs whether short responses like this are encrypted too, or sent plain. I built `parseMaybeEncrypted()` to handle both cases automatically — it tries plain JSON first, and only decrypts if that fails.

---

## 4. How each API maps to your app's screens

| Screen (from the PRD) | Marg Endpoint | Notes |
|---|---|---|
| Product List / Categories / Search | `MargMST2017` → `Pro_N`, `Pro_U` | Cached, refreshed every few minutes |
| Product Detail (stock, price) | Same sync data | `Pro_S` = stock-only updates, `Pro_R` = rate-only updates |
| Profile / Outstanding (balance) | `MargMST2017` → `Party.balance` | Single running total, not itemized |
| **Ledger (transaction history)** | `MargCorporateEDE` → `MDis` | Needs the EDE product — see Section 1 |
| Checkout → Place Order | `InsertOrderDetail` | One call per cart line item (see note below) |
| Order History / dispatch tracking | `LiveOrderDispatchStatus2017` | Status inferred from which date fields are filled in |

**Important limitation to know about:** `InsertOrderDetail` takes **one product per API call** — there's no batch/multi-line-item version documented. So a cart with 5 items means 5 separate calls to Marg when the customer checks out. I built this into `orderService.js` already (it loops over `order.items`), but flag to your client: if one of the 5 calls fails partway through, Marg will have a partial order. Ask Marg support if there's an atomic multi-line alternative before you go live.

---

## 5. What I built for you

Structured to match your existing backend/ skeleton (controllers, services, utils, etc.) as a proper layered architecture — routes call controllers, controllers call services, services talk to Marg:

```
backend/
├── config/
│   └── index.js                 ← All env vars read here ONCE; everything else imports this
├── utils/
│   └── margCrypto.js            ← Tested decrypt/decompress logic (Section 3)
├── services/marg/
│   ├── margClient.js            ← Base HTTP wrapper (axios, error handling)
│   ├── masterSyncService.js     ← MargMST2017 → products + customers (with caching)
│   ├── orderService.js          ← InsertOrderDetail + LiveOrderDispatchStatus2017
│   └── corporateEdeService.js   ← MargCorporateEDE → detailed ledger (optional)
├── middleware/
│   ├── asyncHandler.js          ← Wraps async routes so errors auto-forward
│   ├── errorHandler.js          ← Central error → JSON response formatter
│   └── authMiddleware.js        ← PLACEHOLDER for JWT/OTP phase (not wired in yet)
├── controllers/
│   ├── productController.js
│   ├── customerController.js
│   ├── ledgerController.js
│   └── orderController.js
├── routes/
│   ├── index.js                  ← Mounts all routes under /api
│   ├── productRoutes.js
│   ├── customerRoutes.js
│   ├── ledgerRoutes.js
│   └── orderRoutes.js
├── server.js                      ← Entry point
├── package.json
├── .env                           ← Real demo credentials (gitignored)
├── .env.example                   ← Safe template to commit
└── .gitignore
```

Request flow for any endpoint: `route → controller → service → margClient → Marg ERP`,
then the response flows back up, getting decrypted in the service layer and formatted
as `{ success, data }` JSON in the controller.

Your app never talks to Marg directly — it calls **your backend's** clean endpoints, which do the Marg integration behind the scenes:

| Your app calls... | Which internally calls Marg's... |
|---|---|
| `GET /api/products?search=...` | `MargMST2017` |
| `GET /api/products/:id` | `MargMST2017` (single product lookup) |
| `GET /api/categories` | `MargMST2017` (`Stype` records, filtered to category type) |
| `GET /api/customer/:code` | `MargMST2017` (Party data) |
| `GET /api/ledger/:customerCode` | `MargCorporateEDE` |
| `GET /api/orders/:customerCode` | `MargCorporateEDE` (same bill data as ledger, filtered to Sales only) |
| `POST /api/orders` | `InsertOrderDetail` (once per item) |
| `GET /api/dispatch/:salesmanId` | `LiveOrderDispatchStatus2017` — renamed from the earlier `/orders/status/:salesmanId`, same logic |

**Two design decisions worth knowing about, both flagged with comments in the code:**

1. **`GET /categories`** filters `Stype` records by `sgcode === 'CATEGO'` — but that exact string
   is a best guess from Marg's inconsistent docs, not yet confirmed against live data. Check
   `config/index.js` and log a raw `Stype` record once to confirm/correct it.
2. **`GET /orders/:customerCode`** reuses the same `MDis` bill data as the ledger endpoint,
   filtered to `Type === 'S'` (Sales only). This means "order history" includes past orders
   placed by phone/WhatsApp too, not just ones placed through this app — which is probably
   what customers actually want to see, but confirm that assumption with your client.

---

## 6. How to run and test this locally

```bash
cd backend
npm install
npm run dev
```

Then in a browser or Postman, hit:
```
http://localhost:3000/api/products
```

**⚠️ Important — read this before you run it:** the decrypt/decompress logic in
`margCrypto.js` was tested and confirmed working, but only **offline**, against
the sample ciphertext bundled in Marg's own `Decryptionlogic.txt` demo code. My
sandbox environment cannot reach `corporate.margerp.com` (it's not on the
network allowlist I have access to), so **this will be the first time the
decrypt logic gets tested against a real live API response.** The algorithm is
correct — I verified that against real decoded product/customer data — but a
live HTTP round-trip can surface things a static sample can't (different
response wrapping, timeouts, rate limits, etc.). Treat your first successful
`/api/products` call as the real integration test, not a formality.

If it works, you'll see real product data pulled live from Marg's demo
account, decrypted automatically. If you get an error, check:
- Is your machine's outbound network allowed to reach `corporate.margerp.com`?
- Did `npm install` finish without errors?
- Log the RAW response from `margPost()` before it hits the decrypt step —
  if the raw response doesn't look like the base64 blob you'd expect, the
  issue is upstream of decryption (auth, request shape, etc.), not the crypto.
- Check the terminal — descriptive error messages are built into `margClient.js`
  specifically for this kind of debugging.

---

## 7. Open questions to confirm with your client / Marg support

I flagged these with `// CONFIRM` comments directly in the code too, but listing them here so nothing gets lost:

1. **Which product does your actual client have?** Mobile App Solution, Corporate EDE, or both? Get your client's real credentials — the ones in your files are Marg's generic demo accounts.
2. **Box/piece pricing** — Marg's `Rate` field is the per-piece price, and `Conversion` is the pack size, but confirm whether `Rate × Conversion` is really the box price for this account, or whether box pricing is set separately.
3. **Order status meaning** — I inferred Pending/Approved/Dispatched from which date fields (`DateSub`/`Dateisu`/`Datedis`) are populated. Confirm this is correct for your client's Marg configuration.
4. **Multi-item orders** — confirm whether there's a batch order endpoint, since `InsertOrderDetail` appears to be one-product-per-call only.
5. **`InsertOrderDetail` encryption** — confirm with Marg support whether this endpoint's response is encrypted or plain (the docs are ambiguous; I built defensive handling either way).
6. **The category `Sgcode` value** (see Section 9 below) and **whether "order history" should include phone/WhatsApp orders**, not just app-placed ones.

---

## 9. Confirming the category lookup (`Stype`) shape

`GET /api/categories` and the `category` field on products depend on two
things Marg's docs don't fully pin down:

1. **Field casing.** Every other object in `MargMST2017`'s response
   (`pro_N`, `Party`) mixes `lowercase` and `ProperCase` field names in ways
   we only know for certain because we tested them against live data. We
   have NOT yet seen a real `Stype` record, so `mapStype()` in
   `masterSyncService.js` defensively checks both casings for every field
   (`margStype.Sgcode ?? margStype.sgcode`, etc.).
2. **Which `Sgcode` value means "category."** The docs mention candidates
   like `"CATEGO"` and `"CATGO"` inconsistently. `config/index.js` defaults
   to `'CATEGO'` via `MARG_CATEGORY_SGCODE`, but this is a guess.

**To confirm both at once:** temporarily log the raw `Stype` array the first
time you call `GET /api/categories` or `GET /api/products` (which triggers
the same sync) — e.g. inside `syncMasterData()`:
```js
console.log('Raw Stype sample:', JSON.stringify((details.Stype || []).slice(0, 10), null, 2));
```
Look at the actual field names and the different `Sgcode`/`sgcode` values
present. Once confirmed:
- If the casing differs from what `mapStype()` expects, simplify the
  function to match exactly (delete the unused fallback).
- Set `MARG_CATEGORY_SGCODE` in `.env` to whatever the real category marker
  turns out to be, if it's not `"CATEGO"`.

---

## 10. Next step

Once you confirm real credentials from your client, just update `backend/.env` with their values — nothing else in the code needs to change. The whole point of the service-layer structure above is that your React Native screens and Express routes stay exactly the same; only the `.env` file changes between demo and production.
