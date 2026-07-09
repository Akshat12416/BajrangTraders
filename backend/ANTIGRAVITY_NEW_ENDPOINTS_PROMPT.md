# Antigravity Prompt — Apply New/Renamed Endpoints & Test
### Copy everything below the line into Antigravity's chat

---

Act as a senior Node.js backend engineer. We've updated several files to add
missing endpoints and rename one for consistency with the client's API design
doc. Apply these changes, then test everything end-to-end.

**What changed (files to overwrite with the versions I'm providing):**

1. `config/index.js` — added `categorySgcode` (best-guess default `'CATEGO'`,
   overridable via `MARG_CATEGORY_SGCODE` env var)
2. `services/marg/masterSyncService.js` — now parses `Stype` records into
   categories, and joins category name onto each product (`category` field)
3. `services/marg/corporateEdeService.js` — added `getCustomerOrderHistory()`,
   reusing the same bill data as the ledger, filtered to Sales only
4. `controllers/productController.js` + `routes/productRoutes.js` — added
   `GET /api/products/:id`
5. `controllers/categoryController.js` + `routes/categoryRoutes.js` — NEW,
   adds `GET /api/categories`
6. `controllers/orderController.js` + `routes/orderRoutes.js` — dispatch
   status REMOVED from here (moved to its own resource, see next), ADDED
   `GET /api/orders/:customerCode` for order history
7. `controllers/dispatchController.js` + `routes/dispatchRoutes.js` — NEW,
   this is the RENAMED version of the old `/orders/status/:salesmanId` — same
   underlying logic, new location: `GET /api/dispatch/:salesmanId`
8. `routes/index.js` — mounts the two new route groups

**After applying, restart the server** (`npm run dev`) and confirm it boots
clean with no errors — the config changes are backward compatible, nothing
should break.

**Then test each endpoint, in this order:**

1. `GET /api/products` — should still work exactly as before (this endpoint
   didn't change in behavior, just gained a `category`/`categoryCode` field
   on each product — check whether `category` comes back as a real name or
   `null` for every product; `null` for everything means the `Sgcode` guess
   in Section 9 of `MARG_API_GUIDE.md` needs correcting)

2. `GET /api/categories` — should return an array. If it's empty, that's the
   `categorySgcode` guess being wrong — follow the debugging steps in
   `MARG_API_GUIDE.md` Section 9 (temporarily log the raw `Stype` array from
   inside `syncMasterData()` to see the real `Sgcode` values present, then
   set `MARG_CATEGORY_SGCODE` in `.env` to whatever the real one is)

3. `GET /api/products/:id` — use a real product ID from test 1's response

4. `GET /api/orders/:customerCode` — use `WQB` (confirmed real customer code
   from earlier testing) or another real code from the Corporate EDE account.
   Compare this against what `GET /api/ledger/WQB` returns — the order
   history should be a subset of the ledger (Sales only, no purchases/returns)

5. `GET /api/dispatch/001` — should behave identically to the old
   `/orders/status/001` we already confirmed working (same service function,
   just a new route)

**Report back PASS/FAIL for each of the 5 tests**, and for test 1 + 2
specifically, tell me whether real category names came through or `null` —
that tells us whether the `Sgcode` guess needs fixing before we move on.

Do not modify `mobile/` in this task.
