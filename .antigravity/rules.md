# Project Rules — Customer Ordering App

## What this project is
A React Native (Expo) Android app for B2B customers to browse products, place orders,
and view their ledger. It connects to a Marg ERP system via a Node.js backend.
The app is a customer portal — Marg ERP is the source of truth. We only display Marg's data.

## Read these files before doing anything
- PRD.md — Full product requirements, screen list, architecture
- design/DESIGN_REFERENCE.md — Colors, spacing, component specs from Figma
- design/design-tokens.js — All color and spacing values as JS constants

## Tech Stack (do not deviate)
- React Native with Expo SDK 51+
- NativeWind v4 for styling (Tailwind classes only)
- React Navigation v6 — Stack Navigator + Bottom Tab Navigator
- Zustand for state management
- Axios for all HTTP requests

## Styling Rules (CRITICAL)
- NEVER hardcode hex color values in component files
- NEVER hardcode spacing numbers directly in className or StyleSheet
- ALL colors must come from design/design-tokens.js
- Use NativeWind className prop for ALL styling — no StyleSheet.create()
- Every screen must have 24px horizontal padding: className="px-6"
- All touch targets minimum 44×44px for accessibility

## Code Structure Rules
- Every screen → its own file in /app/screens/
- Every reusable component → its own file in /app/components/
- All API/data calls → through /app/services/ files only (never fetch() in screens)
- Screens import from services, services return data (dummy now, real later)
- Functional components only — no class components
- No inline anonymous arrow functions in JSX for performance

## File Naming
- Screens: PascalCase + Screen suffix → HomeScreen.jsx
- Components: PascalCase → ProductCard.jsx
- Services: camelCase + Service suffix → productService.js
- Stores: camelCase + Store suffix → cartStore.js

## Current Phase: 2 — Frontend with Dummy Data
- Do NOT connect to any real API
- All data comes from /app/data/ JSON files via service functions
- Services are structured to be swapped for real Axios calls in Phase 4 with zero screen changes
- Goal: every screen built, navigation works, dummy data displays, matches Figma

## When building a screen
1. Check design/figma-export/<ScreenName>.png for the visual reference
2. Check design/DESIGN_REFERENCE.md for that screen's component specs
3. Use only colors from design-tokens.js
4. Use the 4px spacing grid (4, 8, 12, 16, 24, 32px)
5. Wire the screen into navigation before marking it done

## Do NOT build (these already exist in Marg ERP)
- Admin panel
- Inventory management UI
- Accounting / invoice creation
- Customer registration / onboarding
- Product pricing editor

## Navigation Structure
AuthNavigator (Stack) → Splash, Login, OTP
MainNavigator (Bottom Tabs) → Home, Products, Cart, Orders, Account
Products stack → Categories → ProductList → ProductDetail
Account stack → Profile → Ledger / Outstanding / Invoices
