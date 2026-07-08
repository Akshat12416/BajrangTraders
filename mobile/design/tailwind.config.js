/** @type {import('tailwindcss').Config} */

/**
 * TAILWIND CONFIG — NativeWind v4
 * Imports design tokens from /design/design-tokens.js
 * so all custom colors/spacing are available as Tailwind classes.
 *
 * Usage examples:
 *   <View className="bg-primary px-screen rounded-card" />
 *   <Text className="text-textPrimary font-bold text-lg" />
 *   <TouchableOpacity className="bg-primary h-btn-lg rounded-full" />
 */

module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {

      // ─── COLORS ───────────────────────────────────
      // Usage: bg-primary, text-textSecondary, border-border
      colors: {
        primary:        '#53B175',
        primaryLight:   '#E8F5EE',
        primaryDark:    '#3A8A55',
        secondary:      '#F8A44C',
        secondaryLight: '#FEF0DC',
        background:     '#FFFFFF',
        surface:        '#F2F3F2',
        surfaceDark:    '#E2E2E2',
        textPrimary:    '#181725',
        textSecondary:  '#7C7C7C',
        textHint:       '#B3B3B3',
        textOnPrimary:  '#FFFFFF',
        success:        '#53B175',
        error:          '#E2523A',
        warning:        '#F8A44C',
        info:           '#5383EC',
        debit:          '#E2523A',
        credit:         '#53B175',
        border:         '#E2E2E2',
        statusPending:  '#F8A44C',
        statusApproved: '#5383EC',
        statusDispatch: '#53B175',
      },

      // ─── SPACING ──────────────────────────────────
      // Usage: px-screen, py-card, gap-section
      spacing: {
        screen:  '24px',    // Horizontal screen padding
        card:    '16px',    // Card internal padding
        section: '32px',    // Between major sections
        input:   '16px',    // Input field padding
      },

      // ─── BORDER RADIUS ────────────────────────────
      // Usage: rounded-card, rounded-btn, rounded-chip
      borderRadius: {
        chip:   '4px',
        btn:    '8px',
        card:   '12px',
        'card-lg': '18px',
        modal:  '24px',
      },

      // ─── FONT SIZES ───────────────────────────────
      // Usage: text-xs, text-sm, text-base already built into Tailwind
      // These are extra aliases for semantic naming
      fontSize: {
        'caption': ['10px', { lineHeight: '14px' }],
        'label':   ['12px', { lineHeight: '16px' }],
        'body':    ['14px', { lineHeight: '22px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'title-sm':['18px', { lineHeight: '26px' }],
        'title':   ['20px', { lineHeight: '28px' }],
        'heading': ['24px', { lineHeight: '32px' }],
        'hero':    ['30px', { lineHeight: '38px' }],
      },

      // ─── HEIGHTS (for buttons & inputs) ───────────
      // Usage: h-btn-lg, h-btn-md, h-input
      height: {
        'btn-lg':  '56px',
        'btn-md':  '48px',
        'btn-sm':  '36px',
        'input':   '52px',
        'otp-box': '56px',
        'tab-bar': '72px',
      },

      // ─── WIDTHS ───────────────────────────────────
      width: {
        'otp-box':      '56px',
        'product-card': '174px',
        'category-card':'100px',
      },
    },
  },

  plugins: [],
};
