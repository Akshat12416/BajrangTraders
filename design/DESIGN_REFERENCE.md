# DESIGN REFERENCE
## GroceryApp Starter — Customer Ordering App

> This file is the single source of truth for design decisions.
> The AI IDE (Antigravity) reads this file to understand visual rules.
> All values here match `/design/design-tokens.js` and `tailwind.config.js`.

---

## Figma File

**Link:** https://www.figma.com/design/vYv2IQblzR24CTM4vTeq9M/GroceryApp-Starter--Community-?node-id=111-24

**Name:** GroceryApp Starter (Community)
**Type:** Flutter Grocery App — Light & Dark Theme

> Note: Use the **Light Theme** screens as the reference. This app is light mode only for Phase 1.

---

## Color Palette

| Token Name | Hex | Where it's used |
|---|---|---|
| `primary` | `#53B175` | Buttons, active tab icon, checkboxes, progress bars |
| `primaryLight` | `#E8F5EE` | Input focus background, success chips, add-to-cart confirm |
| `primaryDark` | `#3A8A55` | Button pressed state, dark header elements |
| `secondary` | `#F8A44C` | Scheme/offer badges, "Pending" status chips |
| `secondaryLight` | `#FEF0DC` | Scheme card backgrounds |
| `background` | `#FFFFFF` | Every screen background |
| `surface` | `#F2F3F2` | Product cards, input fields, list rows, bottom nav |
| `surfaceDark` | `#E2E2E2` | Dividers, inactive tab icons, borders |
| `textPrimary` | `#181725` | All main headings and body text |
| `textSecondary` | `#7C7C7C` | Subtitles, metadata, category labels |
| `textHint` | `#B3B3B3` | Input placeholder text |
| `error` | `#E2523A` | Out of stock label, error messages, debit amounts |
| `info` | `#5383EC` | "Approved" status chip, informational links |
| `border` | `#E2E2E2` | Input borders, card borders, divider lines |

---

## Typography

**Primary Font:** Gilroy (load via expo-font if available, otherwise use Inter)
**Fallback:** Inter → System

| Name | Size | Weight | Used For |
|---|---|---|---|
| `caption` | 10px | Regular | Tiny metadata, count badges |
| `label` | 12px | Regular | Timestamps, helper text |
| `body` | 14px | Regular | Product descriptions, list item text |
| `body-md` | 16px | Regular | Input text, paragraph body |
| `title-sm` | 18px | SemiBold | Product names, card titles |
| `title` | 20px | Bold | Screen sub-headings |
| `heading` | 24px | Bold | Screen titles (e.g. "My Cart") |
| `hero` | 30px | ExtraBold | Outstanding balance, big numbers |

---

## Spacing Rules

All spacing is based on a **4px grid**. Never use arbitrary values.

| Token | Value | Use |
|---|---|---|
| `4px` | xs | Icon padding, tiny gaps |
| `8px` | sm | Between inline elements |
| `12px` | — | Between label and input |
| `16px` | md / card | Standard padding inside cards and components |
| `20px` | — | Section sub-padding |
| `24px` | screen | **Horizontal padding on every screen** |
| `32px` | section | Gap between major page sections |
| `48px` | — | Large section separators |

---

## Border Radius

| Token | Value | Used On |
|---|---|---|
| `rounded-chip` | 4px | Tiny status badges |
| `rounded-btn` | 8px | Small buttons, inputs |
| `rounded-card` | 12px | Product cards, list cards |
| `rounded-card-lg` | 18px | Category cards, featured banners |
| `rounded-modal` | 24px | Bottom sheets, modals, large CTA cards |
| `rounded-full` | 9999px | Circle buttons, avatar images, pill chips |

---

## Component Specs

### Buttons
- **Primary (full width):** height 56px, `bg-primary`, `text-textOnPrimary`, `rounded-modal` (24px), font Bold 16px
- **Secondary:** height 48px, `border border-primary`, `text-primary`, `rounded-modal`, font SemiBold 16px
- **Small inline (Add to Cart):** height 36px, `bg-primary`, white `+` icon, `rounded-btn`

### Input Fields
- Height: 52px
- Background: `surface` (#F2F3F2)
- Border: none by default; `border-primary` on focus
- Border radius: `rounded-btn` (8px)
- Padding: 16px horizontal
- Placeholder color: `textHint`

### OTP Input Boxes
- 6 boxes, each 56×56px
- Background: `surface`
- Border: `border-surfaceDark`, changes to `border-primary` when active
- Border radius: `rounded-btn` (8px)
- Font: Bold 24px `textPrimary`

### Product Cards (Home horizontal scroll)
- Width: 174px, Height: 248px
- Background: `surface`
- Border radius: `rounded-card-lg` (18px)
- Shadow: subtle (elevation 2)
- Image: top 60% of card
- Name: Bold 14px `textPrimary`
- Price: SemiBold 14px `textPrimary`
- Add button: small green circle `+` bottom right

### Category Cards (horizontal scroll)
- Width & Height: 100×100px
- Background: `primaryLight` or color-coded by category
- Border radius: `rounded-card` (12px)
- Icon centered, label below

### Bottom Tab Bar
- Height: 72px (includes safe area)
- Background: `background` (white)
- Active icon: `primary` green
- Inactive icon: `surfaceDark` grey
- 5 tabs: Home, Products, Cart (center, raised), Orders, Account

### Cards (Ledger, Orders, Invoices)
- Background: `background` white
- Border: `1px solid border`
- Border radius: `rounded-card` (12px)
- Padding: 16px
- Shadow: sm

### Status Chips
- Pending: bg `secondaryLight`, text `secondary` (orange)
- Approved: bg `#EBF0FD`, text `info` (blue)
- Dispatched: bg `primaryLight`, text `primary` (green)
- Border radius: `rounded-full`
- Padding: 4px 12px

---

## Screen-by-Screen Notes

### Splash Screen
- White background
- Centered app logo (green primary color)
- No other elements

### Login Screen
- White background
- Top: illustration or banner image (~40% screen height)
- "Login" heading (24px Bold)
- Subtext (14px textSecondary)
- Phone number input (52px height, surface background)
- "Send OTP" full-width green button at bottom

### OTP Screen
- Back arrow top left
- "Enter OTP" heading
- Instruction text with masked phone number
- 6 OTP boxes in a row
- Resend timer text (textSecondary)
- "Verify" full-width green button

### Home Screen
- Top bar: location pin left, notification bell right
- Search bar below top bar (surface bg, search icon)
- Banner/carousel (rounded-card-lg)
- "Exclusive Offer" section heading + horizontal product scroll
- "Best Selling" section heading + horizontal product scroll

### Product List Screen
- Filter chips horizontal scroll at top
- Vertical grid (2 columns) of product cards
- Each card: image, name, unit, price, add button

### Product Detail Screen
- Large product image (top half)
- Back button overlay top left
- Product name (18px Bold)
- Price per piece / per box toggle
- Quantity stepper (– N +)
- "Add To Basket" full-width button

### Cart Screen
- Header "My Cart"
- List of cart items: image left, name+price right, qty stepper far right
- Divider between items
- "Go to Checkout" full-width green button at bottom

### Ledger Screen
- Header "My Ledger"
- Balance summary card at top (outstanding in large red text)
- Transaction list below
- Each row: date, description, debit (red) or credit (green), balance

### Outstanding Screen
- Large outstanding amount (hero size, error color)
- Credit limit bar (primary color fill)
- List of unpaid invoices

---

## What NOT to do (Design Rules for AI)

1. Never hardcode hex values in component files — always use token names
2. Never use arbitrary spacing — stick to the 4px grid
3. Never use a different font weight than what's specified per component
4. The bottom tab bar must always be visible on main app screens
5. Every screen must have 24px horizontal padding
6. Out-of-stock products must show error red badge, never just grey out silently
7. All touch targets must be minimum 44×44px (accessibility)
