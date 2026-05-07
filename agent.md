# VANGUARD IDENTITY ENGINE PROTOCOL (v2: Simplified Baseline)

## 1. MISSION
Implement a Zero-Flash, Single-Mode (English, Fixed-Mode) system with structural layout switching (Strategy Pattern) across Next.js and Express.

## 2. IDENTITY MAPPING
- **executive:** Serif headings, generous whitespace, minimal borders. Traditional Navbar.
- **streetwear:** Bold grotesque fonts, heavy borders, high-contrast badges. Offset/Side headers.
- **earth:** Rounded corners, organic muted tones, soft shadows. Split-screen headers.
- **luxury:** High-contrast defaults, gold accents, elegant tracking. Minimal fixed header.
- **cyber:** Neon glow effects, geometric grids, translucent glass surfaces. HUD-style interface.

## 3. CORE ARCHITECTURE
- **State Source:** HTTP Cookie (`vanguard-theme`).
- **Styling:** CSS Variable Scoping (Tailwind v4 compatible).
- **Logic:** Strategy Pattern for Component Structure via `LayoutResolver`.
- **Backend:** Header-based context propagation and content filtering.

## 4. SIMPLIFICATION RULES
- **No Dark Mode:** The system uses a single unified color mode per identity.
- **No Multi-Language:** English ('en') is the sole supported language.
- **Inheritance Pattern:** Components must use CSS variables (e.g., `rounded-theme`) to stay agnostic.
- **No Duplication:** Use the `LayoutResolver` to avoid structural `if/else` in page files.

## 5. MIGRATION MAP (REBUILDING 1-BY-1)
Currently in **Standard Baseline** phase. Ready to re-implement identities systematically.
