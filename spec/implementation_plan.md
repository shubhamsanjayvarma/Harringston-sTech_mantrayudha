# NovaMart Homepage Implementation Plan

## 1. Project Context & Objectives
- **Target Application**: NovaMart E-Commerce Website Homepage
- **Primary Source of Truth**: User-provided reference screenshot (`novamart-reference.png`)
- **Key Visual Elements**:
  - Top Announcement bar ("Fresh picks. Fast delivery." with leaf icon, subtle sage background)
  - Main Navigation Header:
    - Bold "NOVA MART" branding (NOVA in dark black, MART in rich green)
    - Interactive Location Selector: "Delivering to Indiranagar" with dropdown pin and selection modal
    - Centered Search Bar: "Search groceries, electronics and more" with live functional filtering & instant results
    - Action Icons: Account profile modal trigger & Cart icon with real-time numeric counter badge
  - Category Navigation Bar:
    - Groceries, Fresh, Electronics, Home, Personal Care, Offers with clean outline icons and subtle vertical dividers
  - Hero Section:
    - Left: Headline "Everything you need, in one place.", subtitle "Everyday essentials, delivered with care.", dark pill "Shop now ›" CTA
    - Bottom of Hero: 3-column benefits row ("Fresh daily", "Quick delivery", "Easy returns") with circular green icons and dividers
    - Right: High-resolution lifestyle hero image matching the exact reference composition (kraft paper grocery bag, fresh produce, coffee machine with latte, wireless headphones)
  - "Popular right now" Section:
    - Section header with "Popular right now" and "View all ›" link
    - 4 horizontal cards:
      1. Strawberries | 250 g | ₹99 | ⚡ 10 mins | Add
      2. Extra virgin olive oil | 500 ml | ₹499 | ⚡ 10 mins | Add
      3. Wireless headphones | Noise cancellation | ₹4,999 | ⚡ 15 mins | Add
      4. Air fryer | 4.2 L | ₹3,999 | ⚡ 15 mins | Add
  - Comprehensive Interactive Experience:
    - Cart drawer (slide-over) with item quantity adjustment, item removal, total computation, checkout trigger
    - Location selector modal (choose Indiranagar, Koramangala, HSR Layout, Whitefield, etc.)
    - Search dropdown with live product matching and empty-state messaging
    - Category filtering dynamically showing category-specific products
    - Account profile preview drawer/modal

---

## 2. Designated Skills Mapping
Per Rule 27, all implementation milestones and tasks are assigned to explicit skills:
- **Milestone 1 (UI Scaffolding & Asset Preparation)**: `frontend-ui-engineering`, `planning-and-task-breakdown`
- **Milestone 2 (Core Feature Logic & Reactive Cart/Search/Location State)**: `frontend-ui-engineering`, `api-and-interface-design`
- **Milestone 3 (Interactive Drawers, Fail-Safe Presets & Responsive Polish)**: `frontend-ui-engineering`, `shipping-and-launch`
- **Verification & Dead-Code Sweep**: `code-simplification`, `code-review-and-quality`, `browser-testing-with-devtools`

---

## 3. Milestones & Task Breakdown

### Milestone 1: UI Scaffolding & Visual Foundation (`frontend-ui-engineering`)
- **Task 1.1**: Initialize React + Vite + TypeScript + Tailwind CSS application in `frontend/`.
- **Task 1.2**: Copy high-fidelity generated assets (hero lifestyle image, 4 product images) into `frontend/public/assets/`.
- **Task 1.3**: Configure Tailwind CSS with precise typography (`Inter` / modern sans-serif), custom NovaMart green palette (`#15803d`, `#166534`, `#dcfce7`, `#eff6ee`), and subtle shadow/border tokens.
- **Task 1.4**: Build the Top Announcement Bar component matching font size, leaf icon, and subtle padding.
- **Task 1.5**: Build the Main Header component with "NOVA MART" logo, location selector, centered search bar, and action icons.
- **Task 1.6**: Build the Category Navigation bar with 6 items, icons, and vertical dividers.

### Milestone 2: Hero & Product Cards Scaffolding (`frontend-ui-engineering`)
- **Task 2.1**: Construct the Hero Section with the two-line heading ("Everything you need, \n in one place."), subtitle, dark rounded "Shop now ›" CTA button, and right-hand lifestyle image composition.
- **Task 2.2**: Integrate the Hero Benefits row with circular green icons ("Fresh daily", "Quick delivery", "Easy returns") and subtle dividers.
- **Task 2.3**: Build the "Popular right now" section heading with "View all ›" link.
- **Task 2.4**: Build the 4 Product Cards in a responsive 4-column layout with image, title, subtitle, price, green lightning delivery badge, and active "Add" button.

### Milestone 3: Reactive State & Interactive Drawers (`frontend-ui-engineering`, `api-and-interface-design`)
- **Task 3.1**: Implement Cart State Management (local storage sync, add, increment, decrement, remove, total calculation).
- **Task 3.2**: Build Slide-over Cart Drawer showing line items, delivery ETA, bill breakdown (Item Total, Delivery Fee, Taxes, Grand Total), and checkout button.
- **Task 3.3**: Implement Location Selector Modal enabling switching between Bangalore delivery zones (Indiranagar, Koramangala, HSR Layout, Whitefield, etc.).
- **Task 3.4**: Implement Search filtering with live overlay/dropdown and highlighted search results.
- **Task 3.5**: Implement Category filter toggle (clicking "Fresh", "Electronics", etc. updates the catalog view).
- **Task 3.6**: Implement Account Drawer/Modal with user profile and quick links.

### Milestone 4: Dead-Code Sweep, Verification & Polish (`code-review-and-quality`)
- **Task 4.1**: Execute Post-Code Dead-Code Sweep (remove unused imports, redundant types, debug logs).
- **Task 4.2**: Verify Compilation Gate (`npm run build`).
- **Task 4.3**: Launch local server and execute Golden-Path verification (view page in browser, verify layout at 1440px desktop, tablet, and mobile).

---

## 4. Mandatory Plan Guardrails Block (Rule 31)
1. **Harmful Command Boundaries**: Affirm zero destructive commands (`rm -rf`, format, `DROP TABLE` per Rule 32).
2. **VCS and Git Isolation**: All modifications remain strictly in the local working directory. No commits or PR operations without explicit user direction (Rule 24).
3. **Golden-Path Verification**: Verified through clean compilation (`npm run build`) and visual inspection in browser.
