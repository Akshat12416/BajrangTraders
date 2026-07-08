/**
 * DESIGN TOKENS
 * Source: GroceryApp Starter (Community) - Figma
 * https://www.figma.com/design/vYv2IQblzR24CTM4vTeq9M/GroceryApp-Starter--Community-
 *
 * HOW TO USE IN NATIVEWIND:
 * Import these into tailwind.config.js under theme.extend
 * Then use as Tailwind classes: bg-primary, text-secondary, p-spacing-md, etc.
 *
 * HOW TO USE DIRECTLY IN REACT NATIVE STYLESHEETS:
 * import { colors, spacing } from '../design/design-tokens';
 * style={{ backgroundColor: colors.primary }}
 */

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────

export const colors = {

  // Brand / Primary — Green (grocery / fresh food feel)
  primary:        '#53B175',   // Main green — buttons, active tab, highlights
  primaryLight:   '#E8F5EE',   // Light green — input backgrounds, badges, chips
  primaryDark:    '#3A8A55',   // Dark green — pressed states, headers

  // Secondary — Orange/Amber (sales, badges, offers)
  secondary:      '#F8A44C',   // Orange — scheme badges, discount tags
  secondaryLight: '#FEF0DC',   // Light orange — scheme card backgrounds

  // Background
  background:     '#FFFFFF',   // Main screen background
  surface:        '#F2F3F2',   // Card backgrounds, input fields, list rows
  surfaceDark:    '#E2E2E2',   // Dividers, inactive elements

  // Text
  textPrimary:    '#181725',   // Main dark text — headings, product names
  textSecondary:  '#7C7C7C',   // Subtitles, labels, metadata
  textHint:       '#B3B3B3',   // Placeholder text in inputs
  textOnPrimary:  '#FFFFFF',   // White text on green buttons

  // Status / Feedback
  success:        '#53B175',   // Same as primary (green = success in grocery)
  error:          '#E2523A',   // Red — out of stock, errors, debit entries
  warning:        '#F8A44C',   // Orange — pending status, low stock
  info:           '#5383EC',   // Blue — info chips, links

  // Ledger specific
  debit:          '#E2523A',   // Red for debit/amount due
  credit:         '#53B175',   // Green for credit/payment received

  // Order status chips
  statusPending:  '#F8A44C',   // Orange
  statusApproved: '#5383EC',   // Blue
  statusDispatch: '#53B175',   // Green

  // Navigation / UI Chrome
  border:         '#E2E2E2',   // Borders, separators
  overlay:        'rgba(24, 23, 37, 0.5)',  // Modal overlays
  shadow:         'rgba(0, 0, 0, 0.08)',    // Card shadows
};

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────

export const typography = {
  // Font family (GroceryApp uses Gilroy — fallback to Inter for React Native)
  fontFamily:   'Gilroy',         // Primary font (load via expo-font if available)
  fontFallback: 'Inter',          // Fallback
  fontSystem:   'System',         // React Native system default if fonts not loaded

  // Font sizes (in px → use as React Native numbers)
  fontSize: {
    xs:   10,   // Tiny labels, badges
    sm:   12,   // Captions, metadata, timestamps
    base: 14,   // Body text, list items, product descriptions
    md:   16,   // Input text, body paragraphs
    lg:   18,   // Section headings, product names
    xl:   20,   // Screen subtitles
    '2xl': 24,  // Screen titles
    '3xl': 30,  // Hero numbers (outstanding balance, etc.)
  },

  // Font weights
  fontWeight: {
    regular:    '400',
    medium:     '500',
    semibold:   '600',
    bold:       '700',
    extrabold:  '800',
  },

  // Line heights
  lineHeight: {
    tight:  1.2,
    normal: 1.5,
    loose:  1.8,
  },
};

// ─────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────
// Based on 4px base unit — standard for mobile apps

export const spacing = {
  0:    0,
  1:    4,    // xs — icon padding, tiny gaps
  2:    8,    // sm — between inline elements
  3:    12,   // between label and input
  4:    16,   // md — standard component padding
  5:    20,   // section padding
  6:    24,   // lg — card padding, section gaps
  8:    32,   // xl — screen horizontal padding
  10:   40,
  12:   48,   // between major sections
  16:   64,
  20:   80,
};

// Named aliases for readability
export const spacing_named = {
  screenH:      spacing[6],   // 24 — horizontal screen padding (left/right)
  screenV:      spacing[6],   // 24 — vertical screen padding (top/bottom)
  cardPadding:  spacing[4],   // 16 — padding inside cards
  cardGap:      spacing[4],   // 16 — gap between cards in a list
  sectionGap:   spacing[8],   // 32 — gap between major page sections
  inputPadding: spacing[4],   // 16 — inside text inputs
  buttonV:      spacing[4],   // 16 — button vertical padding
  buttonH:      spacing[6],   // 24 — button horizontal padding
  iconSize:     spacing[6],   // 24 — default icon size
  iconSizeSm:   spacing[4],   // 16 — small icons
  iconSizeLg:   spacing[8],   // 32 — large icons
};

// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────

export const radius = {
  none:   0,
  sm:     4,    // Small chips, tiny badges
  md:     8,    // Inputs, small buttons
  lg:     12,   // Cards, product cards
  xl:     18,   // Large cards, category cards
  '2xl':  24,   // Bottom sheets, modals
  full:   9999, // Pills, circular avatars, round buttons
};

// ─────────────────────────────────────────────
// SHADOWS (React Native format)
// ─────────────────────────────────────────────

export const shadows = {
  none: {},
  sm: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius:  4,
    elevation:     2,           // Android
  },
  md: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius:  8,
    elevation:     4,
  },
  lg: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius:  16,
    elevation:     8,
  },
};

// ─────────────────────────────────────────────
// COMPONENT SIZES
// ─────────────────────────────────────────────

export const sizes = {
  // Buttons
  buttonHeightLg:   56,   // Primary CTA buttons (Place Order, Send OTP)
  buttonHeightMd:   48,   // Secondary buttons
  buttonHeightSm:   36,   // Small inline buttons (Add to cart)

  // Inputs
  inputHeight:      52,   // Text input fields
  otpBoxSize:       56,   // OTP digit box (square)

  // Bottom Tab Bar
  tabBarHeight:     72,   // Bottom nav height (includes safe area)
  tabBarIconSize:   24,

  // Product Cards (horizontal list on Home)
  productCardW:     174,  // Width of product card
  productCardH:     248,  // Height of product card

  // Category Cards (horizontal scroll)
  categoryCardW:    100,
  categoryCardH:    100,

  // Images
  productImageLg:   280,  // Product detail screen image
  productImageSm:   100,  // Product card thumbnail
  avatarSm:         36,
  avatarMd:         52,
};
