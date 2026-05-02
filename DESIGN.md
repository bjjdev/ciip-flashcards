---
name: CIIP Flashcard Study App
description: Precision exam prep tool for ABII CIIP certification
colors:
  void: "#0a0b0e"
  console: "#12141b"
  panel: "#181c24"
  trace: "#23262f"
  signal: "#e4e6f0"
  static: "#6e7286"
  platinum: "#eceef8"
  critical: "#d04f46"
  caution: "#c69138"
  nominal: "#3ea658"
  deep: "#8a67d4"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.07em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.platinum}"
    textColor: "{colors.void}"
    rounded: "{rounded.sm}"
    padding: "9px 20px"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.void}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.static}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
  button-ghost-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.signal}"
  domain-tile:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.signal}"
    rounded: "{rounded.md}"
    padding: "16px"
  domain-tile-hover:
    backgroundColor: "#1e2230"
    textColor: "{colors.platinum}"
  card-face:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.signal}"
    rounded: "{rounded.lg}"
    padding: "28px"
---

# Design System: CIIP Flashcard Study App

## 1. Overview

**Creative North Star: "The Diagnostic Console"**

This is a precision instrument for a high-stakes professional credential. The CIIP exam is real — the person studying for it is technically literate and under real pressure. Every design decision should reflect that context. The interface behaves like a clinical workstation: information is displayed with maximal clarity, interactive elements announce themselves without decoration, and nothing exists on screen without a reason. The emotional register is calm, capable, and focused — not motivational, not playful, not celebratory.

Depth comes from tonal layering, not borders or shadows. The darkest layer (#0a0b0e) is the ground. Surfaces (#12141b), panels (#181c24), and elevated cards lift off it through value alone — borders are reserved for structural divisions, not decorative frames. The platinum accent (#eceef8) is used with extreme restraint: it is the one bright signal in a field of near-black. When it appears, it means "this is the action."

This system explicitly rejects the GitHub UI it was built on: no flat cornflower-blue links, no repository-viewer grey-on-grey card grids, no header-with-logo-and-actions cloned from every developer tool built in 2020. It also rejects the SaaS landing-page aesthetic (no rounded pill buttons everywhere, no gradient CTAs, no teal-white pairs), the flashy AI tool look (no glassmorphism, no neon gradients, no purple-to-pink anything), and gamified learning apps (no confetti, no streak-hero UIs, no mascots).

**Key Characteristics:**
- Tonal elevation — depth from value, not shadow or border density
- Platinum as the one accent — rare, decisive, never decorative
- Clinical typography — tight tracking on headings, generous line-height on body
- Semantic color kept functional — red/amber/green/violet are SRS ratings only, never decoration
- Keyboard-first affordances — every primary action has a key hint

## 2. Colors: The Diagnostic Palette

Five tonal steps from void to platinum. Semantic colors kept strictly functional.

### Primary
- **Platinum** (#eceef8): The one voice. Used on primary buttons, active states, and high-focus interactive elements. Never decorative. On a given screen, platinum should occupy at most 5% of the surface area. Its rarity is exactly the point.

### Neutral (Tonal Scale — darkest to lightest)
- **Void** (#0a0b0e): The deepest layer. App background. Never used as a surface — only as the ground that everything else lifts from.
- **Console** (#12141b): Structural surfaces: header, navigation bar, footer. One step above Void.
- **Panel** (#181c24): Interactive surfaces: cards, domain tiles, modals, inputs. Two steps above Void.
- **Trace** (#23262f): Structural borders only. Dividers between header and content, table row separators, input outlines. Not used as card borders — cards rely on tonal contrast instead.
- **Signal** (#e4e6f0): Primary text. All body copy, question text, option labels.
- **Static** (#6e7286): Secondary text. Labels, metadata, muted values, placeholder text.

### Semantic (SRS ratings — never used decoratively)
- **Critical** (#d04f46): "Again" rating. Weak domain warning. Never used for any non-rating purpose.
- **Caution** (#c69138): "Hard" rating. Difficulty badge (medium). Learning-phase maturity indicator.
- **Nominal** (#3ea658): "Good" rating. Retention success. Mastery bar fill.
- **Deep** (#8a67d4): "Mastered" state. Long-interval cards. Mastered maturity indicator.

**The One Voice Rule.** Platinum is the only accent. It does not share accent duties with any semantic color. If you are tempted to use Nominal green as a positive accent or Deep purple as a brand color, you are violating this rule. Semantic colors belong exclusively to SRS feedback.

**The No-Inversion Rule.** Do not use semantic colors for backgrounds. `rgba(nominal, 0.1)` tints are permitted only for rating buttons — nowhere else.

## 3. Typography: The Console Stack

**Display/Headline/Body/Label Font:** System UI stack — `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Character:** The system font is the right choice for a precision tool — it renders at native quality on every device, loads instantly, and imposes no personality beyond structure. Hierarchy comes entirely from size, weight, and letter-spacing contrast. A 16px body and an 18px headline feel identical without tracking discipline — this system enforces it.

### Hierarchy
- **Headline** (700 weight, 18px, -0.02em tracking, 1.2 line-height): Page title and card question text. Maximum 2 lines.
- **Title** (600 weight, 14px, -0.01em tracking, 1.3 line-height): Domain names, section headings, card option labels.
- **Body** (400 weight, 14px, normal tracking, 1.6 line-height): Explanations, metadata paragraphs. Maximum 68ch line length on content-heavy surfaces.
- **Label** (600 weight, 11px, 0.07em tracking, uppercase): Section labels, badge text, keyboard hints, metadata keys. All-caps only at 11px or below — never at body size.

**The No-Caps-Creep Rule.** Uppercase labels are permitted only at 11px or smaller. A 12px uppercase label with 0.07em tracking is already borderline. A 13px uppercase label is prohibited — the tracking becomes loud and the case becomes aggressive. When in doubt, stay lowercase at 12px.

**The Weight Discipline Rule.** Two weights only: 400 (body) and 600–700 (headings and labels). Never 300 or 500. The system font's 500 weight renders inconsistently across platforms; 400→600 is the reliable jump.

## 4. Elevation: Tonal Only

This system is flat by doctrine. No `box-shadow` on interactive surfaces at rest. No border-glow on hover. Depth is communicated exclusively through tonal layering — Void → Console → Panel — and the inherent contrast those values create against each other.

**The Flat-By-Default Rule.** Surfaces are flat at all times. A card on a dark background does not need a shadow — the tonal step from #0a0b0e to #181c24 already reads as elevation. Adding a shadow on top of tonal elevation is redundant and defeats the precision aesthetic.

**Structural borders** (Trace #23262f, 1px) are used to divide regions: the header from the content area, table rows from each other, input fields from their container. They are not used to "frame" cards or tiles — tonal contrast does that job.

**The Single Border Weight Rule.** All structural borders are 1px solid. No 2px borders, no colored accent borders, no left-stripe borders of any width.

## 5. Components

### Buttons

The primary button is platinum on void — maximum contrast, undeniable presence. Ghost is barely-there. Nothing between them.

- **Shape:** Gently squared (6px radius). Not a pill. Not a rectangle. 6px is exactly enough to soften the corner without rounding it into softness.
- **Primary:** Platinum background (#eceef8), Void text (#0a0b0e), 9px 20px padding, 600 weight, 14px, -0.01em tracking. Hover: pure white (#ffffff). Active: scale(0.97).
- **Ghost:** Transparent background, Static text (#6e7286), same padding and radius. Hover: Panel background (#181c24), Signal text (#e4e6f0). Used for secondary actions and icon-only header controls.
- **Danger:** Critical red (#d04f46), white text. Used for destructive actions (reset progress) only.
- **Transitions:** opacity and transform only — 120ms ease-out. Never animate background-color; use opacity layering instead.

### Cards / Domain Tiles

- **Corner Style:** 10px radius (md). Consistent across domain tiles, modal boxes, and session summary.
- **Background:** Panel (#181c24). No border at rest — tonal contrast provides separation.
- **Hover state:** Lift to #1e2230 (halfway between Panel and Trace). Title text transitions to Platinum. No border appears on hover — the background shift is sufficient.
- **Internal Padding:** 16px on domain tiles. 28px on study cards.
- **Weak domain indicator:** Replace the current `border-left: 3px solid red` stripe with a Critical-colored dot (6px circle) in the top-right corner. No stripe borders, ever.

### Study Card

The card is the most important surface in the app. It deserves the most care.

- **Size:** Full-width up to 720px, 460–520px tall depending on option count.
- **Front face:** Headline-weight question text (700, 20px), centered vertically. "Tap to reveal" hint in Label style at bottom.
- **Back face:** Question repeated in Title weight (600, 14px, Static color). Options as rows with letter prefix in Label style. Correct answer row: Nominal (#3ea658) left border-free — instead, correct option gets Nominal text for letter and text, with Panel+15% lightness background tint. Wrong options: 45% opacity.
- **Card flip:** rotateY(180deg), 420ms, cubic-bezier(0.4, 0, 0.2, 1). Perspective: 1200px.
- **Difficulty badge:** 10px uppercase label, tinted pill (no stripe border). Easy = Nominal tint, Medium = Caution tint, Hard = Critical tint.

### Rating Buttons (SRS)

- Four buttons: Again / Hard / Good / Easy.
- Style: Transparent background at rest, 1px border in the semantic color at 30% opacity, semantic text color. On hover: semantic color at 18% opacity background.
- Key hint displayed below label in Label style (10px, Static color).
- Layout: Equal flex-width, minimum 90px each.

### Inputs / Fields

- **Style:** Panel background (#181c24), Trace border (1px), 6px radius, Signal text.
- **Focus:** Border shifts to Static (#6e7286), no glow. The border color change is enough — no box-shadow focus ring on dark surfaces.
- **Placeholder:** Static color (#6e7286).

### Navigation / Header

- **Background:** Console (#12141b).
- **Bottom border:** Trace (1px) — structural, not decorative.
- **App title:** Headline weight (700, 15px). No logo, no icon.
- **Header actions (Stats link, Settings):** Ghost button style. Icon-only at small breakpoints.

### Maturity Bar (Domain Tiles)

- 3px height (not 4px). No gap between segments. Colors: Static (new) → Caution (learning) → Nominal (review) → Deep (mastered).
- This is a data visualization, not a decoration. Keep it tight and factual.

### Heatmap

- Cell size: 12px × 12px, 2px gap, 2px radius.
- Empty cell: Console (#12141b) with Trace border.
- Levels: 4 steps from Nominal at 20% to Nominal at 100% opacity — no custom green hex values. Let the semantic color carry the meaning.

## 6. Do's and Don'ts

### Do:
- **Do** use tonal steps (Void → Console → Panel) as the only depth mechanism. A card on a dark background needs no border and no shadow.
- **Do** use Platinum (#eceef8) exclusively for primary interactive elements — buttons, active states, focused inputs. One voice, one purpose.
- **Do** keep semantic colors (Critical, Caution, Nominal, Deep) strictly tied to SRS rating feedback. They are a functional vocabulary, not a palette.
- **Do** use uppercase Label style (11px, 0.07em) for section headings, badges, and keyboard hints only — never at 12px or above.
- **Do** use 6px radius on buttons and inputs, 10px on cards and modals, 14px on full-page overlays.
- **Do** include keyboard shortcut hints (Key Hints in Label style) next to every primary action — this is a keyboard-first tool.
- **Do** design the study card as the primary hero of the app. Every other screen supports it.

### Don't:
- **Don't** use border-left stripes of any width as colored accents on cards, list items, or alerts. This is prohibited regardless of color. Use dot indicators, background tints, or nothing.
- **Don't** use the GitHub UI color palette: no #0d1117 background, no #58a6ff cornflower-blue accent, no #161b22 surface. The entire palette is replaced.
- **Don't** use gradient text (background-clip: text). Never. Not as an accent, not on the app title, nowhere.
- **Don't** use glassmorphism: no backdrop-filter blur used decoratively on panels or cards.
- **Don't** design for gamified engagement: no confetti animations, no streak counters as the hero metric, no mascots, no "You're on a roll!" copy.
- **Don't** use Generic SaaS aesthetics: no teal-and-white color pairs, no rounded-pill buttons (6px radius is the maximum), no hero-metric dashboards with big numbers and gradient accents.
- **Don't** add shadows to cards or domain tiles at rest. Flat by default — tonal contrast is sufficient.
- **Don't** use 500 weight anywhere. The jump is 400 → 600 → 700. Nothing in between.
- **Don't** use colored accent borders (e.g. border-color: nominal on a "success" card). Tonal backgrounds or semantic text color achieves the same signal without a border stripe.
