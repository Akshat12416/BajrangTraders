# PRD — Customer Ordering & Ledger Management App
### For AI-Assisted IDE (Cursor / Windsurf / Copilot)

---

## 1. Project Overview

**What this is:** A React Native (Expo) Android application that acts as a self-service customer portal for a manufacturer/distributor. Customers can browse products, place orders, view their ledger, and download invoices — all powered by their existing Marg ERP system.

**What this is NOT:** An ERP, inventory system, admin panel, or accounting tool. Marg ERP remains the single source of truth. This app is purely a mobile window into Marg's data.

**Business problem being solved:**
- Customers currently place orders via phone calls and WhatsApp
- Employees manually type those orders into Marg ERP
- Customers have no visibility into stock, prices, or their outstanding balance
- This app eliminates manual entry and gives customers self-service access

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native + Expo |
| Styling | NativeWind (Tailwind for React Native) |
| Navigation | React Navigation (Stack + Bottom Tab) |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Auth | JWT + OTP via MSG91 |
| Notifications | Firebase Cloud Messaging (FCM) |
| Hosting | Hostinger Managed Node.js |
| Version Control | GitHub |
| Testing | Expo Go + Android Device |
| ERP | Marg ERP (via REST APIs provided by client) |

---

## 3. Project Folder Structure

```
/CustomerOrderingApp
│
├── /app                        ← React Native (Expo Router or React Navigation)
│   ├── /assets
│   │   ├── /images             ← App logos, banners, placeholder images
│   │   ├── /fonts              ← Custom fonts if any
│   │   └── /icons              ← Tab bar and UI icons
│   │
│   ├── /components             ← Reusable UI components
│   │   ├── ProductCard.jsx
│   │   ├── CartItem.jsx
│   │   ├── LedgerRow.jsx
│   │   ├── OrderCard.jsx
│   │   ├── CategoryCard.jsx
│   │   └── NotificationBadge.jsx
│   │
│   ├── /screens                ← One file per screen
│   │   ├── SplashScreen.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── OTPScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── CategoriesScreen.jsx
│   │   ├── ProductListScreen.jsx
│   │   ├── SearchScreen.jsx
│   │   ├── ProductDetailScreen.jsx
│   │   ├── CartScreen.jsx
│   │   ├── CheckoutScreen.jsx
│   │   ├── OrderSuccessScreen.jsx
│   │   ├── OrderHistoryScreen.jsx
│   │   ├── LedgerScreen.jsx
│   │   ├── OutstandingScreen.jsx
│   │   ├── InvoicesScreen.jsx
│   │   └── ProfileScreen.jsx
│   │
│   ├── /navigation             ← Navigation config
│   │   ├── AppNavigator.jsx    ← Root navigator
│   │   ├── AuthNavigator.jsx   ← Login + OTP stack
│   │   └── BottomTabNavigator.jsx
│   │
│   ├── /store                  ← State management (Zustand or Context API)
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── userStore.js
│   │
│   ├── /services               ← API call functions (replace dummy data with real later)
│   │   ├── api.js              ← Axios instance with base URL + JWT headers
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   └── ledgerService.js
│   │
│   ├── /data                   ← Dummy JSON for Phase 2/3 (frontend-first development)
│   │   ├── dummyProducts.json
│   │   ├── dummyCategories.json
│   │   ├── dummyOrders.json
│   │   └── dummyLedger.json
│   │
│   ├── /utils
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── constants.js
│   │
│   └── App.jsx                 ← Entry point
│
├── /backend                    ← Node.js + Express
│   ├── /routes
│   ├── /controllers
│   ├── /middleware
│   ├── /services
│   └── server.js
│
├── /design                     ← ★ WHERE TO KEEP FIGMA FILES (see Section 4)
│   ├── figma-export/           ← Exported assets from Figma (PNG, SVG)
│   ├── design-tokens.js        ← Colors, fonts, spacing extracted from Figma
│   ├── DESIGN_REFERENCE.md     ← Notes on Figma link, component names, color palette
│   └── screenshots/            ← Screen-by-screen Figma screenshots for reference
│
├── .env                        ← API keys, base URLs (never commit to GitHub)
├── .env.example                ← Template with key names only (commit this)
├── app.json                    ← Expo config
├── package.json
└── README.md
```

---

## 4. Figma Design — Where to Keep It

### Location in project
Store everything design-related inside `/design/` at the root level.

### What to put there

| File / Folder | What goes in it |
|---|---|
| `/design/DESIGN_REFERENCE.md` | Paste the Figma share link here. Write down the frame names, color palette (hex codes), font names, and any grid/spacing rules. This is what the AI IDE reads. |
| `/design/design-tokens.js` | Export your colors, font sizes, border radius, and spacing as JS constants so NativeWind and the app can import them directly. |
| `/design/figma-export/` | Export every screen frame from Figma as PNG at 2x. Name them exactly like the screen files: `HomeScreen.png`, `CartScreen.png`, etc. |
| `/design/screenshots/` | Screenshots of the Figma file (useful when giving context to the AI IDE via image upload). |

### How to export from Figma
1. Select a frame → right-click → Export
2. Set scale to 2x, format PNG
3. Name the file after the screen: `ProductListScreen.png`
4. Drop into `/design/figma-export/`

### DESIGN_REFERENCE.md template

```markdown
# Design Reference

## Figma Link
https://www.figma.com/file/YOUR_FILE_ID/YOUR_FILE_NAME

## Color Palette
- Primary: #YOUR_PRIMARY_COLOR
- Background: #YOUR_BG_COLOR
- Text Primary: #YOUR_TEXT_COLOR
- Text Secondary: #YOUR_SECONDARY_TEXT
- Success: #YOUR_SUCCESS_COLOR
- Error: #YOUR_ERROR_COLOR
- Border: #YOUR_BORDER_COLOR

## Typography
- Font Family: [e.g. Inter, Poppins]
- Heading 1: 24px Bold
- Heading 2: 18px SemiBold
- Body: 14px Regular
- Caption: 12px Regular

## Spacing Scale
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

## Border Radius
- Card: 12px
- Button: 8px
- Input: 8px

## Component Notes
[Add any notes about specific component behavior in the design]
```

---

## 5. Application Screens & Features

### 5.1 Auth Flow

#### Splash Screen
- App logo centered
- 2-second delay then auto-navigate

#### Login Screen
- Phone number input (10 digits, India format)
- "Send OTP" button
- No password required

#### OTP Screen
- 6-digit OTP input
- 60-second countdown resend timer
- Verify button
- On success: JWT stored, navigate to Home

---

### 5.2 Main App Flow

#### Home Screen
- Greeting with customer name
- Outstanding balance summary card (tappable → Outstanding Screen)
- Category horizontal scroll
- Featured / recently ordered products
- Search bar (navigates to Search Screen)
- Notification bell icon

#### Categories Screen
- Grid layout of all product categories from Marg
- Each category card shows name + icon/image
- Tap → Product List for that category

#### Product List Screen
- Filter by category
- Product cards showing: Name, Company, Price/piece, Price/box, Stock status
- Add to cart button inline
- Tap card → Product Detail Screen

#### Search Screen
- Full-text search bar (searches Marg product master)
- Results update as user types (debounced 300ms)
- Same product card layout as Product List

#### Product Detail Screen
- Product image
- Name, category, company
- Price per piece / per box
- Stock availability (In Stock / Out of Stock)
- Active schemes / offers if any
- Quantity selector (piece or box toggle)
- Add to Cart button

#### Cart Screen
- List of added items with quantity and total
- Edit quantity or remove item
- Order summary: subtotal, GST, total
- Proceed to Checkout button

#### Checkout Screen
- Delivery address (from Marg customer master)
- Order notes / special instructions (optional free text)
- Final order summary
- Place Order button

#### Order Success Screen
- Checkmark animation
- Order number returned from Marg ERP
- "View Order" and "Continue Shopping" buttons

#### Order History Screen
- List of all previous orders
- Order number, date, total, status (pending/approved/dispatched)
- Tap → Order detail view with item breakdown

#### Ledger Screen
- Chronological list of all transactions
- Each row: date, description (invoice/payment/credit note), debit, credit, balance
- Color coded: debits red, credits green
- Filterable by date range

#### Outstanding Screen
- Total outstanding amount prominently displayed
- Credit limit
- Overdue vs within-credit breakdown
- List of unpaid invoices

#### Invoices Screen
- List of all invoices
- Invoice number, date, amount, payment status
- Download as PDF button (PDF served from Marg)

#### Profile Screen
- Customer name, phone number
- Linked shops / ledger names
- Logout button

---

## 6. Authentication & Security

- OTP sent via MSG91 to the customer's registered phone number
- Phone number must exist in Marg's customer master (no self-registration)
- On OTP verification, backend issues a JWT (expiry: 7 days)
- All subsequent API calls include `Authorization: Bearer <token>` header
- Backend validates JWT before proxying any request to Marg ERP
- API keys for Marg ERP are stored only on the backend, never in the app

---

## 7. API Layer (Backend → Marg ERP)

The Node.js backend is a secure proxy. It never exposes Marg's internal API keys.

### Required Marg API Endpoints (to be confirmed with client)

| Purpose | Endpoint (example) |
|---|---|
| Verify customer by phone | `GET /customer/verify?phone=` |
| Get customer profile | `GET /customer/:id` |
| Get all categories | `GET /categories` |
| Get products by category | `GET /products?category=` |
| Search products | `GET /products/search?q=` |
| Get product detail | `GET /products/:id` |
| Get inventory / stock | `GET /inventory/:productId` |
| Place order | `POST /orders` |
| Get order history | `GET /orders?customerId=` |
| Get ledger | `GET /ledger?customerId=` |
| Get outstanding | `GET /outstanding?customerId=` |
| Get invoices | `GET /invoices?customerId=` |
| Download invoice PDF | `GET /invoices/:id/pdf` |

### Dummy Data Strategy (Phase 2–3)
During frontend development, all service files return hardcoded JSON from `/app/data/`. When backend is ready, only the service files need to be updated — screens don't change.

---

## 8. State Management

Use **Zustand** (lightweight, works well with React Native).

| Store | Holds |
|---|---|
| `authStore` | JWT token, customer ID, phone number, isLoggedIn |
| `cartStore` | Cart items array, item count, total |
| `userStore` | Customer profile, outstanding balance |

---

## 9. Notifications (FCM)

Firebase Cloud Messaging sends push notifications triggered by backend events.

| Trigger | Notification |
|---|---|
| Order placed | "Your order #XXXX has been received" |
| Order approved by sales | "Your order #XXXX has been approved" |
| Order dispatched | "Your order #XXXX is on its way" |
| Payment recorded | "Payment of ₹X received. Thank you!" |
| Payment overdue | "You have an outstanding of ₹X due" |

---

## 10. Development Phases

### Phase 1 — Setup
- [ ] Create Expo project with TypeScript or JSX
- [ ] Install dependencies: NativeWind, React Navigation, Axios, Zustand
- [ ] Configure NativeWind with `tailwind.config.js`
- [ ] Set up navigation structure (Auth stack + App tabs)
- [ ] Create `/design/design-tokens.js` from Figma

### Phase 2 — Frontend with Dummy Data
- [ ] Build all screens using dummy JSON from `/app/data/`
- [ ] No backend calls yet
- [ ] Match every screen exactly to Figma designs
- [ ] Test navigation flow end-to-end

### Phase 3 — Backend
- [ ] Node.js + Express setup
- [ ] JWT middleware
- [ ] OTP flow with MSG91
- [ ] Route handlers for all endpoints
- [ ] Marg ERP API integration

### Phase 4 — API Integration
- [ ] Replace dummy data in service files with real Axios calls
- [ ] Error handling and loading states on all screens
- [ ] JWT refresh logic

### Phase 5 — Testing
- [ ] OTP flow on real device
- [ ] Place real order end-to-end
- [ ] Ledger and invoice loading
- [ ] FCM notifications
- [ ] Edge cases: out of stock, exceeded credit limit, no orders yet

### Phase 6 — Deployment
- [ ] Backend deployed on Hostinger
- [ ] FCM configured in Firebase console
- [ ] MSG91 sender ID configured
- [ ] App signed and uploaded to Play Store

---

## 11. Key Constraints & Rules

1. **Marg ERP is always the source of truth.** The app never stores business data locally beyond session caching.
2. **No admin panel is needed.** Product management, customer records, pricing — all managed inside Marg.
3. **No self-registration.** A customer can only log in if their phone number is already in Marg's customer master.
4. **One phone number can map to multiple ledgers.** This is already handled by Marg. The app just displays what Marg returns.
5. **The app is Android-only** for Phase 1 (Play Store deployment).
6. **All prices come from Marg.** The app never hardcodes any pricing logic.
7. **Network errors must be handled gracefully** — show user-friendly messages, not raw API errors.

---

## 12. Biggest Technical Risk

> The Marg ERP API is the single biggest uncertainty in this project.

The entire project timeline depends on:
- Marg providing working API documentation
- Marg exposing endpoints for: products, inventory, orders, ledger, invoices
- Marg returning product images via API
- Marg's order creation API being stable

**Mitigation:** Build the entire frontend with dummy data first. Backend and API integration are Phase 3–4. If Marg APIs are incomplete, only the service layer needs adjustment, not the UI.

---

## 13. Environment Variables (.env)

```env
# Backend
PORT=3000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d

# Marg ERP
MARG_API_BASE_URL=https://your-marg-api-url.com
MARG_API_KEY=your_marg_api_key

# MSG91
MSG91_AUTH_KEY=your_msg91_key
MSG91_TEMPLATE_ID=your_otp_template_id

# Firebase
FCM_SERVER_KEY=your_fcm_server_key

# App (Expo)
EXPO_PUBLIC_API_BASE_URL=https://your-backend.hostinger.com
```

---

*PRD Version 1.0 — Generated for AI-assisted IDE development*
*Stack: React Native + Expo + NativeWind + Node.js + Marg ERP*
