# UI/UX Design System — Demeter Smart Cafeteria System

> **Purpose:** This document describes the frontend design system and user experience of the Demeter Smart Cafeteria System. It covers the color palette, component library, page layouts, interaction patterns, and accessibility considerations. Written for developers and designers who need to understand or extend the UI.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Design System](#2-design-system)
3. [Theming — Dark/Light Mode](#3-theming--darklight-mode)
4. [Shared Components](#4-shared-components)
5. [Page Layouts Per Role](#5-page-layouts-per-role)
6. [Login Experience](#6-login-experience)
7. [Navigation Patterns](#7-navigation-patterns)
8. [Interactive Patterns](#8-interactive-patterns)
9. [Responsive Design](#9-responsive-design)
10. [Real-Time UI](#10-real-time-ui)
11. [Image System](#11-image-system)
12. [Accessibility](#12-accessibility)
13. [Animation & Transitions](#13-animation--transitions)

---

## 1. Overview

Demeter's frontend is a React 19 single-page application built with Vite 7, Tailwind CSS 3, and Lucide/React Icons for iconography. The design philosophy centers on three principles:

1. **Clean and modern** — Rounded cards (`rounded-2xl`), generous whitespace, frosted-glass navbar, and subtle shadows create a polished cafeteria ordering experience.
2. **Three distinct role experiences** — Students, staff, and admins each have their own layout, accent color, and feature set, while sharing a unified component library (Navbar, ProfileModal, ThemeToggle, ToastContext).
3. **Dark mode first-class** — Every component has explicit `dark:` variants. The ThemeToggle persists preference to `localStorage` and applies a `dark` class to `<html>`.

### Role Summary

| Role | Accent Color | Max Width | Key Features |
|---|---|---|---|
| **Student** | Teal/Cyan (`teal-400`, `cyan-500`) | `max-w-6xl` | Wallet balance, cart, notifications, AI recommendations |
| **Staff** | Amber (`amber-400`) | `max-w-7xl` | Order queue, menu editor, discount suggestions |
| **Admin** | Red (`red-500`) | `max-w-7xl` | Staff/wallet management, analytics, audit log, promotions |

---

## 2. Design System

### 2.1 Color Palette

Colors are defined in `tailwind.config.js` under `theme.extend.colors` plus standard Tailwind utilities used throughout components.

#### Custom Theme Tokens

These custom tokens are used primarily in admin components that reference `dark-bg`, `dark-card`, etc. directly:

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `light-bg` | `#FFFFFF` | — | Admin page background |
| `light-card` | `#FFFFFF` | — | Admin card background |
| `light-border` | `#E5E7EB` | — | Admin card/input borders |
| `light-text` | `#111827` | — | Admin primary text |
| `light-textMuted` | `#6B7280` | — | Admin secondary/muted text |
| `light-accent` | `#F87171` | — | Admin accent buttons |
| `light-success` | `#10B981` | — | Success indicators |
| `dark-bg` | — | `#1a1d23` | Admin dark background |
| `dark-card` | — | `#252930` | Admin dark card surface |
| `dark-border` | — | `#363c47` | Admin dark borders |
| `dark-text` | — | `#FFFFFF` | Admin dark primary text |
| `dark-textMuted` | — | `#9CA3AF` | Admin dark muted text |
| `dark-accent` | — | `#EF4444` | Admin dark accent |

#### Role-Specific Accent Colors

| Role | Primary Accent | Hover | Background Tint | Text Accent |
|---|---|---|---|---|
| **Student** | `teal-400` (`#2DD4BF`) | `cyan-500` (`#06B6D4`) | `teal-400/10` | `text-teal-400` |
| **Staff** | `amber-400` (`#FBBF24`) | `amber-300` (`#FCD34D`) | `amber-400/10` | `text-amber-400` |
| **Admin** | `red-500` (`#EF4444`) | `red-400` (`#F87171`) | `red-500/10` | `text-red-400` |

#### Commonly Used Tailwind Colors

| Color | Hex | Usage |
|---|---|---|
| `gray-100` | `#F3F4F6` | Input backgrounds (light), button backgrounds |
| `gray-200` | `#E5E7EB` | Borders (light), separator lines |
| `gray-500` | `#6B7280` | Muted text, icons |
| `gray-900` | `#111827` | Primary text (light mode) |
| `slate-700` | `#334155` | Input backgrounds (dark), borders (dark) |
| `slate-800` | `#1E293B` | Card backgrounds (dark), navbar dark |
| `slate-900` | `#0F172A` | Deep dark backgrounds |
| `yellow-400` | `#FACC15` | Gold Krakens currency, prices, order progress |
| `red-400` / `red-500` | `#F87171` / `#EF4444` | Destructive actions, errors, logout |
| `green-400` / `green-500` | `#4ADE80` / `#22C55E` | Success states, credit transactions |
| `blue-50` | `#EFF6FF` | Unread notification background |

### 2.2 Typography

The application uses Tailwind's default font stack (`font-sans` — Inter, system-ui, etc.). No custom fonts are loaded.

| Element | Classes | Example |
|---|---|---|
| Page title | `text-3xl font-bold` | "Welcome back, Garen" |
| Section heading | `text-xl font-semibold` | "Recommended for You" |
| Card title | `text-lg font-semibold` (home) / `text-base font-semibold` (menu) | "Darius Dunk Burger" |
| Body text | `text-sm` | Card descriptions, modal content |
| Muted/secondary | `text-xs text-gray-500 dark:text-slate-400` | Preparation time, subtitles |
| Badge/tag text | `text-[10px]` or `text-[9px]` | Category tags, cart count |
| Price display | `text-yellow-400 font-semibold` | "GK 150" |
| Large display | `text-4xl font-bold` | Wallet balance |

### 2.3 Spacing & Layout

| Pattern | Value | Where Used |
|---|---|---|
| Page max-width (student) | `max-w-6xl` | StudentLayout `<main>` |
| Page max-width (staff/admin) | `max-w-7xl` | StaffLayout and AdminLayout `<main>` |
| Page padding | `px-4 py-6 md:px-8` (student) / `px-8 py-8` (admin) | Layout `<main>` tags |
| Section spacing | `mb-10`, `mb-14` | Between homepage sections |
| Card grid gap | `gap-6` (standard) / `gap-8` (menu grid) | Grid containers |
| Card padding | `p-5` (home cards) / `p-4` (menu cards) / `p-6` (modals, summaries) | Card content areas |
| Navbar height | `h-[70px]` | Navbar component default |

### 2.4 Border Radius

| Radius | Class | Usage |
|---|---|---|
| Extra large | `rounded-2xl` | Cards, modals, banners |
| Top extra large | `rounded-t-3xl` | FoodModal bottom sheet |
| Large | `rounded-xl` | Buttons, inputs, notification dropdown, extras rows |
| Full | `rounded-full` | Pills, badges, avatar circles, tab switchers, search bar, wallet chip |
| Standard | `rounded-lg` | Logo mark, admin form inputs, smaller buttons |

### 2.5 Shadows

| Class | Usage |
|---|---|
| `shadow-md` | Default card shadow (FoodCard, CafeteriaCard) |
| `shadow-xl` | Hover state cards, profile modal, notification dropdown |
| `shadow-2xl` | Login card, FoodModal |
| `shadow-lg` | Floating navigation pill (CafeMenu), cart item cards, order progress card |
| `shadow-lg shadow-black/10` | CafeMenu floating pill with subtle dark tint |

---

## 3. Theming — Dark/Light Mode

### 3.1 How ThemeContext Works

The theme system uses Tailwind's **class-based dark mode** (`darkMode: 'class'` in `tailwind.config.js`):

1. `ThemeProvider` initializes state from `localStorage.getItem('theme')`, defaulting to `'light'`.
2. On every theme change, a `useEffect` adds or removes the `dark` class on `document.documentElement` (`<html>`).
3. The theme value is persisted to `localStorage` immediately on change.
4. All components use Tailwind's `dark:` prefix to declare dark mode styles inline.
5. A safety check (`useTheme` throws if used outside `ThemeProvider`) prevents silent failures.

### 3.2 ThemeToggle Component

The ThemeToggle is a **fixed-position** button (`fixed bottom-5 right-5 z-[9999]`) that floats above all content on every page:

- Renders a toggle track (`w-12 h-6 rounded-full`) with a sliding thumb
- Light mode: yellow thumb (`bg-yellow-400`) with sun icon, positioned left
- Dark mode: indigo thumb (`bg-indigo-500`) with moon icon, positioned right
- Includes a text label ("Light" / "Dark") next to the track
- Bordered pill shape with shadow (`shadow-lg`, `hover:shadow-xl`)

### 3.3 Color Mapping Between Modes

| Element | Light Mode | Dark Mode |
|---|---|---|
| Page background | `bg-white` / `bg-gray-100` | `bg-gray-900` / `bg-gray-950` |
| Card surface | `bg-white` | `bg-slate-800` / `bg-slate-800/90` |
| Navbar | `bg-white/80` (frosted) | `bg-gray-900/60` (frosted) |
| Primary text | `text-gray-900` | `text-white` |
| Secondary text | `text-gray-500` | `text-slate-400` / `text-gray-400` |
| Borders | `border-gray-200` | `border-slate-700` / `border-white/10` |
| Input backgrounds | `bg-gray-100` / `bg-gray-50` | `bg-slate-700` / `bg-[#0f172a]` |
| Hover backgrounds | `hover:bg-gray-50` | `hover:bg-slate-700/40` |

### 3.4 Admin Custom Dark Tokens

Admin components (`AdminConsole`, `PromotionList`, `PromotionForm`) use the custom `dark-*` and `light-*` tokens from `tailwind.config.js` instead of standard Tailwind gray/slate. This gives admin pages a subtly different dark palette with blue-tinted grays (`#1a1d23`, `#252930`, `#363c47`) versus the slate used in student/staff pages.

---

## 4. Shared Components

### 4.1 Navbar

**File:** `src/components/common/Navbar.jsx`

A sticky, frosted-glass navigation bar (`sticky top-0 z-40`, `bg-white/80 dark:bg-gray-900/60`, `backdrop-blur-md`) shared across all roles with conditional features.

#### Role-Aware Logo

| Role | Logo Style | Classes |
|---|---|---|
| Student | Gradient lime-to-cyan | `bg-gradient-to-br from-lime-400 to-cyan-400 text-slate-900` |
| Staff | Gradient yellow-to-amber | `bg-gradient-to-br from-yellow-300 to-amber-500 text-slate-900` |
| Admin | Gradient red-to-rose | `bg-gradient-to-br from-red-400 to-rose-600 text-white` |

The logo is a `w-9 h-9 rounded-lg` square showing the letter "D" by default, linking to the role's home route.

#### Conditional Features

| Feature | Student | Staff | Admin |
|---|---|---|---|
| Wallet balance chip | Yes | No | No |
| Cart icon with badge | Yes | No | No |
| Notification bell | Yes | Yes | No |
| Profile avatar | Yes | Yes | Yes |
| Logout button | Yes | Yes | Yes |

The wallet chip is a pill-shaped element (`rounded-full`) showing the balance in Gold Krakens with a teal "+" button that links to `/wallet`.

### 4.2 FoodCard

**File:** `src/components/common/FoodCard.jsx`

A `React.memo`-wrapped card component with two variants:

| Property | `variant="home"` | `variant="menu"` |
|---|---|---|
| Image height | `h-[220px]` | `h-[180px]` |
| Content padding | `p-5` | `p-4` |
| Title size | `text-lg` | `text-base` |
| Price position | Bottom row with "Order Now" button | Top-right next to title |
| Badge display | Single badge pill (top-right overlay) | Array of tags below description |
| Preparation time | Not shown | Shown with clock emoji |
| Button style | Text link with arrow (`→`) | Full-width `rounded-lg` button |
| Click behavior | Button only | Entire card clickable |

**Hover effects:** Card lifts (`hover:-translate-y-1`), shadow deepens (`hover:shadow-xl`), image zooms (`group-hover:scale-110`), content background shifts (`group-hover:bg-gray-50`), arrow translates right (`group-hover:translate-x-1`).

### 4.3 FoodModal

**File:** `src/components/common/FoodModal.jsx`

A bottom-sheet modal for food customization:

- **Backdrop:** Fixed overlay (`fixed inset-0 z-50`) with `bg-black/60 backdrop-blur-sm` and `animate-fade-in`
- **Sheet:** Slides up from bottom (`translate-y-full` to `translate-y-0`), `rounded-t-3xl`, `max-w-lg`, `max-h-[90vh]`
- **Hero image:** `h-[230px]` with close button (circular `w-10 h-10 rounded-full`)
- **Extras selection:** Toggleable rows with checkbox indicators, `border-cyan-400` when active, `bg-cyan-400` checkbox fill
- **Quantity picker:** Circular increment/decrement buttons (`w-10 h-10 rounded-full`) in a `rounded-xl` container
- **Add to Order button:** Full-width `rounded-xl bg-teal-400 hover:bg-cyan-500` with scale effect (`hover:scale-[1.02]`)
- **Close animation:** Sets `show` to false, waits 250ms, then calls `onClose`

### 4.4 CafeteriaCard

**File:** `src/components/common/CafeteriaCard.jsx`

A large hero-image card for cafeteria display:

- **Image:** `h-60 w-full` with dark overlay (`bg-black/35`, darkens to `bg-black/45` on hover)
- **Title overlay:** Positioned `absolute bottom-4 left-4` with `text-3xl font-extrabold text-white drop-shadow`
- **Status indicator:** Operating hours + open/closed badge (`text-teal-400` for open, `text-orange-400` for closed)
- **Star rating:** Custom `Stars` component using gold (`#C89B3C`) and muted (`#A9C2C1/40`) star characters
- **Popular items:** Name/price list with Gold Kraken values
- **View Menu button:** Full-width `rounded-xl` that transitions to `bg-cyan-500 text-white` on hover

### 4.5 NotificationBell

**File:** `src/components/common/NotificationBell.jsx`

WebSocket-powered notification center:

- **Bell icon:** Lucide `Bell` component (`size={20}`) with standard icon styling
- **Unread badge:** Red circle (`bg-red-500`, `w-4 h-4`, `text-[9px]`) positioned `absolute -top-1 -right-1`, shows count up to "9+"
- **Dropdown:** `w-80 max-h-96` panel with `rounded-xl shadow-xl` and `animate-fade-in-scale` entry animation
- **Notification items:** Each row shows title, message, and relative time ("just now", "5m ago", "2h ago")
- **Unread highlight:** `bg-blue-50/50 dark:bg-blue-900/10` background tint
- **History limit:** Keeps up to 50 notifications in state (newest first)
- **Actions:** "Clear all" button in header, auto-mark-as-read on dropdown open
- **Click-away dismiss:** Invisible full-screen overlay behind dropdown

### 4.6 SearchBar

**File:** `src/components/common/SearchBar.jsx`

A pill-shaped search input:

- `rounded-xl` input with `py-3` padding
- Search icon (Lucide `Search`) absolutely positioned left (`left-4`)
- Border: `border-slate-600`, focus: `focus:border-teal-400`
- Background: `bg-gray-100 dark:bg-slate-700`
- Max width: `max-w-[1000px]` centered with `my-5` vertical margin

### 4.7 ProfileModal

**File:** `src/components/common/ProfileModal.jsx`

A slide-in panel for viewing user profile:

- Positioned top-right (`sm:justify-end sm:pr-6`), `w-[90vw] max-w-[360px]`
- Entry animation: `animate-slide-in-right`
- Role-aware title: "Student Profile" / "Staff Profile" / "Admin Profile"
- Avatar: `w-24 h-24 rounded-full` with initials fallback or uploaded photo
- Photo upload: Hidden file input triggered by "Change Photo" link (`text-teal-600`)
- Photo remove: Red circular button (`bg-red-500`, `w-6 h-6`) positioned top-right of avatar
- Info fields: Name, User ID, Role, and Cafeteria (staff only) in key-value pairs
- Close button: Circular `w-8 h-8 rounded-full` with Lucide `X` icon

### 4.8 PaymentGatewayModal

**File:** `src/components/common/PaymentGatewayModal.jsx`

A multi-step simulated payment flow rendered via `createPortal`:

| Step | UI |
|---|---|
| **Form** | Amount input with LKR conversion, quick-select pills (50/100/250/500 GK), card number (formatted with spaces), expiry (MM/YY), CVV, cardholder name. Inline validation errors in `text-red-500`. |
| **Processing** | Spinning circle (`animate-spin border-teal-400`), "Processing payment..." message |
| **Success** | Green checkmark in circle, amount added, new balance in yellow, "Done" button |
| **Error** | Red X in circle, error message, "Try Again" / "Cancel" buttons |

- Locks body scroll when open (`document.body.style.overflow = "hidden"`)
- Active amount pill highlighted with `bg-teal-400 text-white border-teal-400`
- Max top-up enforced at 500 GK per transaction
- "Demo mode" disclaimer at bottom of form

### 4.9 ToastContext

**File:** `src/contexts/ToastContext.jsx`

Toast notification system with four types:

| Type | Light Background | Dark Background | Border |
|---|---|---|---|
| `success` | `bg-green-50` | `bg-green-900/80` | `border-green-200` / `border-green-700` |
| `error` | `bg-red-50` | `bg-red-900/80` | `border-red-200` / `border-red-700` |
| `warning` | `bg-yellow-50` | `bg-yellow-900/80` | `border-yellow-200` / `border-yellow-700` |
| `info` | `bg-blue-50` | `bg-blue-900/80` | `border-blue-200` / `border-blue-700` |

- Position: `fixed top-4 right-4 z-[100]`
- Animation: `animate-slide-in` on enter, `animate-slide-out` on exit
- Auto-dismiss: 3.7 seconds display + 0.3 seconds exit animation = 4 seconds total
- Manual dismiss: `x` button on each toast
- Shape: `rounded-xl shadow-lg border backdrop-blur-sm max-w-sm`

### 4.10 ErrorBoundary

**File:** `src/components/common/ErrorBoundary.jsx`

A React class component wrapping the entire application:

- Catches render errors via `getDerivedStateFromError`
- Displays a centered fallback: red warning icon in a circle, "Something went wrong" heading, explanatory text, and a "Refresh Page" button (`bg-teal-400 rounded-xl`)
- Background: `bg-gray-50 dark:bg-gray-950` for full-screen coverage

---

## 5. Page Layouts Per Role

### 5.1 Student Pages

**Layout:** `StudentLayout` wraps all student pages with:
- Navbar showing wallet balance, cart, notifications, profile, and logout
- Content area: `max-w-6xl mx-auto px-4 py-6 md:px-8`
- Background: `bg-white dark:bg-gray-900`

#### StudentHome (`/`)

- **Welcome section:** Centered personalized greeting (`text-5xl`/`text-6xl`, `font-extrabold`) with first name highlighted in teal (`text-teal-400`) and subtitle, vertical padding (`py-16`)
- **Recommended for You:** Grid of 3 FoodCard (home variant) powered by AI recommendations. Items cached in `sessionStorage` (one fetch per browser session, invalidates stale cache without `tags` field). Fallback to hardcoded items if API unavailable. Each card shows dietary/category tags and "Add to Cart" button for 3-click ordering. AI recommendation type badge removed (internal label, not useful to students).
- **Campus Cafeterias:** Grid of CafeteriaCard components showing all 3 cafeterias with hero images, ratings, and "View Menu" buttons
- **Loading state:** Teal spinning circle (`border-teal-400 border-t-transparent`)

#### CafeMenu (`/cafe/:id`)

- **Floating navigation pill:** Portal-rendered fixed pill (`z-[60]`) at top center that morphs between "Back to Dashboard" and the cafeteria name as user scrolls. Uses a scroll event listener with `getBoundingClientRect()` to detect when the banner scrolls past the navbar (70px). Text swaps via dual overlapping spans with callback refs (`useCallback`) for width measurement, crossfade opacity + Y-translate animation over 500ms.
- **Discount badges:** Menu items with active discounts show a green "X% off" or "GK X off" badge on the image and a strikethrough original price next to the discounted price.
- **Hero banner:** `h-[180px] sm:h-[260px] rounded-2xl` with dark overlay and centered cafeteria name
- **Search + category filters:** SearchBar alongside pill-shaped filter buttons (`rounded-full`). Active filter: `bg-teal-400 text-black`. Inactive: bordered outline.
- **Menu grid:** `md:grid-cols-2 lg:grid-cols-3 gap-8` of FoodCard (menu variant)
- **Food customization:** FoodModal opens via `createPortal` on card click

#### Cart (`/cart`)

- **Empty state:** Centered icon (`Sparkles` in gray circle), heading, subtext, and "Browse Cafeterias" teal button
- **Cart items:** Left column with horizontal card layout (image + details + quantity controls + price + delete icon). Quantity editing via +/− buttons; minus at qty=1 shows trash icon and removes item. Shows "GK X each" subtitle when qty > 1.
- **Order summary:** Right column sticky card with subtotal, available discounts (radio buttons), discount amount, total, current balance display, and "Pay with Gold Krakens" button (`bg-yellow-400`)
- **Recommendations:** "You might also like" section below cart with mini cards from AI (same-cafeteria, not-in-cart filtering)
- **Layout:** `lg:grid-cols-[1.65fr_1fr]` — items get more space than summary

#### Orders (`/orders`)

- **Order selector:** Pill buttons for recent orders (up to 5), active order highlighted `bg-teal-400`
- **Progress tracker:** 5-step horizontal stepper (Placed, Confirmed, Preparing, Ready, Completed). Active step: `bg-yellow-400 animate-pulse`. Completed: solid `bg-yellow-400`. Inactive: `bg-gray-200 dark:bg-slate-700`.
- **Cancel button:** Red button for PLACED orders. **Reorder button:** Teal button for COMPLETED orders (2-click reorder).
- **Cancelled state:** Red-tinted card (`bg-red-900/40 border-red-400`) with cancellation message
- **Review flow:** "Rate Your Order" yellow button appears for completed orders. Star rating (1-5) with hover preview, optional 200-char textarea with character counter, skip/submit buttons. Success: green card with "+5 GK Reward" message.
- **Order details:** Item list with quantities and Gold Kraken prices

#### Wallet (`/wallet`)

- **Balance card:** Large display (`text-4xl font-bold`) with GK suffix in yellow, LKR conversion note, and "Add Funds" yellow button
- **Transaction history:** Full-width table with Date, Description, Type (color-coded badge: green for credit/refund, red for debit), Reference ID (monospace), Amount (signed, color-coded), Balance After
- **Top-up:** Opens PaymentGatewayModal via portal

### 5.2 Staff Pages

**Layout:** `StaffLayout` wraps staff pages with:
- Navbar without wallet or cart (shows notifications, profile, logout)
- Content area: `max-w-7xl mx-auto`
- Background: `bg-gray-50 dark:bg-gray-900`

#### StaffDashboard (`/staff`)

- **Header:** Staff name (capitalized) and cafeteria name
- **Tab system:** Three buttons — Orders (active by default), Menu, and Promotions (navigates to `/admin/promotions`). Active tab: `bg-teal-400 text-gray-900`. Inactive: bordered white/gray.
- **Orders tab:**
  - Stat cards row: Pending Orders (highlighted), Completed Today (emerald), Today's Revenue (yellow with GK prefix). Grid: `md:grid-cols-3`.
  - Two-column layout (`lg:grid-cols-2`): QueueList (live order queue) + DiscountSuggestion (AI-generated discount proposals)
- **Menu tab:** MenuEditor component for CRUD operations on menu items

### 5.3 Admin Pages

**Layout:** `AdminLayout` wraps admin pages with:
- Navbar without wallet, cart, or notifications (shows profile and logout)
- Content area: `max-w-7xl mx-auto px-8 py-8`
- Background: `bg-light-bg dark:bg-dark-bg` (custom admin tokens)

#### AdminConsole (`/admin`)

- **Header:** "Admin Console" title with management subtitle
- **Pill tab navigation:** Inline-flex container with `rounded-full bg-gray-200 dark:bg-dark-card p-1`. Active tab: `bg-white text-gray-900 shadow-sm`. Inactive: transparent with muted text. Tabs: Staff Management, Student Wallets, Analytics, Audit Log, Promotions (navigates away).
- **Staff Management:** Staff count header + "Add New Staff" red button. Staff cards in `sm:grid-cols-2` grid. Add modal with username, password, and cafeteria dropdown (dynamically loaded).
- **Student Wallets:** WalletTable component showing student balances with admin top-up capability
- **Analytics:** AnalyticsDashboard with period selection (daily/weekly/monthly/quarterly), custom date ranges, and CSV export
- **Audit Log:** AuditLogTable with search and action-type filtering

---

## 6. Login Experience

**File:** `src/auth/Login.jsx`

The login flow has two stages:

### 6.1 Portal Selector

A full-screen centered layout with three portal cards in a `sm:grid-cols-3` grid:

| Portal | Icon | Color | Description |
|---|---|---|---|
| Student | `GraduationCap` | Teal | "Order food, track deliveries, manage your wallet" |
| Staff | `ChefHat` | Amber | "Manage orders, update menus, handle your cafeteria" |
| Admin | `Shield` | Red | "System management, analytics, user administration" |

Each card is a `rounded-2xl border-2` button with a `w-16 h-16 rounded-2xl` icon container in the role's tint color. Hover: border color changes to role accent, card lifts (`hover:-translate-y-1`), shadow appears.

Background: `bg-gray-100` (light) / gradient `dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#1e293b]` (dark).

### 6.2 Login Form

After selecting a portal, the form card appears with role-specific theming:

- **Accent top bar:** 3px colored strip at the top of the card (`bg-teal-400` / `bg-amber-400` / `bg-red-500`)
- **Role icon:** Centered circular icon in role's tint color
- **Portal label:** "Student Portal" / "Staff Portal" / "Admin Portal"
- **Username field:** Students see "Username or University ID" label; staff/admin see "Username"
- **Focus ring:** Input border changes to role accent on focus (`focus:border-teal-400` / `focus:border-amber-400` / `focus:border-red-500`)
- **Login button:** Full-width, role-colored (`bg-teal-400` / `bg-amber-400` / `bg-red-500`)
- **Error banner:** Red-tinted alert with `rounded-lg` when credentials fail
- **Back button:** Arrow + "Back" text to return to portal selector
- **Keyboard support:** Enter key on password field triggers login (`onKeyDown`)

---

## 7. Navigation Patterns

### 7.1 Student Navigation

- **Navbar links:** Home (logo click), Wallet (balance chip click), Cart (bag icon)
- **In-page:** CafeteriaCard "View Menu" button navigates to `/cafe/:id`
- **CafeMenu floating pill:** Portal-rendered `rounded-full` pill (`z-[60]`) at top of viewport. Shows "Back to Dashboard" when banner is visible; morphs to cafeteria name when user scrolls past banner (detected via scroll listener + `getBoundingClientRect`). Left arrow always navigates to `/`. Text crossfade via dual spans with callback refs for width measurement, opacity + Y-translate over 500ms.
- **Cart to Orders:** Successful checkout navigates to `/orders` with order state passed via `location.state`
- **Wallet back button:** Standard bordered button "Back to Dashboard" at top of wallet page

### 7.2 Staff Navigation

- **Tab-based:** Orders / Menu / Promotions tabs in the dashboard header
- **Promotions tab:** Navigates to `/admin/promotions` (shared promotion management page)

### 7.3 Admin Navigation

- **Pill tab switcher:** Inline rounded-full container with 5 tabs (Staff, Wallets, Analytics, Audit, Promotions)
- **Promotions:** Navigates away to `/admin/promotions`
- **No deep navigation:** All admin content renders within the single AdminConsole page via tab switching

---

## 8. Interactive Patterns

### 8.1 Hover Effects

| Element | Effect | Classes |
|---|---|---|
| Cards (Food, Cafeteria) | Lift upward | `hover:-translate-y-1` |
| Cards | Shadow deepens | `hover:shadow-xl` |
| Card images | Zoom in | `group-hover:scale-110` (via `transition-transform duration-500`) |
| Card content area | Background shift | `group-hover:bg-gray-50 dark:group-hover:bg-slate-700/40` |
| FoodCard arrow | Slide right | `group-hover:translate-x-1` |
| Buttons | Color transition | `transition` / `transition-colors` (typically 150ms default) |
| CafeteriaCard overlay | Darken | `group-hover:bg-black/45` (from `bg-black/35`) |
| Login portal cards | Border color + lift | `hover:border-{accent}` + `hover:-translate-y-1` + `hover:shadow-lg` |

### 8.2 Loading States

A shared `LoadingSpinner` component (`src/components/common/LoadingSpinner.jsx`) provides a dual-ring animation with role-based colors:

| Role | Ring Color | Inner Ring | Background |
|---|---|---|---|
| **Student** | `#14b8a6` (teal) | `rgba(20,184,166,0.4)` | `rgba(20,184,166,0.08)` |
| **Staff** | `#f59e0b` (amber) | `rgba(245,158,11,0.4)` | `rgba(245,158,11,0.08)` |
| **Admin** | `#ef4444` (red) | `rgba(239,68,68,0.4)` | `rgba(239,68,68,0.08)` |

The spinner reads the user's role from `localStorage('authData')` (not `useAuth()`) to avoid context dependency issues in tests. Fixed 48px size. Used across all pages (AdminConsole, AnalyticsDashboard, StaffDashboard, CafeMenu, Cart, Orders, Wallet, etc.).

### 8.3 Empty States

Centered layouts with:
- Icon in a muted circle (`w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800`)
- Heading text (`text-2xl font-semibold`)
- Descriptive subtext (`text-gray-500`)
- Action button (typically teal, linking to browse cafeterias)

Used in: Cart (Sparkles icon), Orders (text-only), Wallet transactions ("No transactions yet"), Promotions (ticket icon).

### 8.4 Confirmation Dialogs

Destructive actions use the native browser `window.confirm()` dialog:
- Staff deletion: "Delete this staff member?"
- Discount deletion: "Are you sure you want to delete this discount?"

**Cart cafeteria switch:** When adding items from a different cafeteria, `CartContext` renders a custom confirmation dialog (not `window.confirm()`) with "Switch & Add" and "Keep Current Cart" buttons. The dialog is styled with an amber warning icon, explains the action, and shows the new item name. Confirming clears the existing cart and adds the new item.

### 8.5 Form Validation

- **Inline field errors:** `text-xs text-red-500 mt-1` below each invalid field (PaymentGatewayModal, Login)
- **Error banners:** Full-width red-tinted container with border (`bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700`) for general form errors
- **Character counters:** `text-xs text-gray-400 text-right` for textarea limits (review: 0/200)

### 8.6 Modal Overlay

All modals share a common overlay pattern:
- `fixed inset-0 z-50` positioning
- `bg-black/60 backdrop-blur-sm` dark backdrop
- `animate-fade-in` entry animation
- Click-on-backdrop dismissal (with `e.stopPropagation()` on modal content)
- Body scroll lock where appropriate (PaymentGatewayModal)

---

## 9. Responsive Design

### 9.1 Tailwind Breakpoints

The application uses Tailwind's default breakpoints in a mobile-first approach:

| Breakpoint | Min Width | Usage |
|---|---|---|
| `sm` | 640px | Login grid columns, banner height, wallet card flex direction |
| `md` | 768px | 2-column grids, navbar padding increase, stat cards row |
| `lg` | 1024px | 3-column grids, staff dashboard 2-column layout, cart 2-column layout |
| `xl` | 1280px | 3-column homepage grids |

### 9.2 Grid Patterns

| Pattern | Classes |
|---|---|
| Standard card grid | `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6` |
| Menu grid | `grid md:grid-cols-2 lg:grid-cols-3 gap-8` |
| Staff stat cards | `grid grid-cols-1 md:grid-cols-3 gap-6` |
| Staff cards (admin) | `grid grid-cols-1 sm:grid-cols-2 gap-4` |
| Cart layout | `grid lg:grid-cols-[1.65fr_1fr] gap-10` |
| Cart recommendations | `grid grid-cols-1 md:grid-cols-3 gap-4` |
| Staff dashboard | `grid grid-cols-1 lg:grid-cols-2 gap-8` |
| Login portal selector | `grid grid-cols-1 sm:grid-cols-3 gap-5` |

### 9.3 Mobile Considerations

- Navbar padding: `pl-3 pr-6 md:pl-4 md:pr-10` (tighter on mobile)
- Wallet balance text: `text-sm md:text-base`
- CafeMenu banner: `h-[180px] sm:h-[260px]`
- FoodModal: `max-w-lg mx-4` with `max-h-[90vh]` and scrollable content
- Login form: `max-w-[430px]` with `p-6 sm:p-10` padding
- Order progress: `overflow-x-auto` for horizontal scrolling on narrow screens
- Category filters: `flex-wrap` for pill overflow
- Profile modal: `w-[90vw] max-w-[360px]` responsive width

---

## 10. Real-Time UI

### 10.1 NotificationBell WebSocket Subscriptions

The NotificationBell component connects to WebSocket on mount and subscribes to:
- `/user/{username}/queue/notifications` — user-specific order status notifications
- `/topic/orders` — broadcast order updates (filtered by `msg.orderId` presence)

Each incoming message creates a notification object with title, message, order ID, status, timestamp, and read flag.

### 10.2 QueueList Live Order Updates

The staff QueueList component subscribes to `/topic/staff` for real-time order queue changes. New orders appear immediately without page refresh.

### 10.3 WalletContext Balance Refresh

`WalletContext` provides a `refreshBalance()` function called after:
- Successful order placement (Cart checkout)
- Order cancellation (auto-refund)
- Review submission (+5 GK reward)
- Wallet top-up (PaymentGatewayModal success)

### 10.4 Reconnection Strategy

The WebSocket utility (`src/utils/websocket.js`) implements exponential backoff reconnection:

| Attempt | Delay |
|---|---|
| 1 | 1 second |
| 2 | 2 seconds |
| 3 | 4 seconds |
| 4 | 8 seconds |
| 5 | 16 seconds |
| 6-10 | 30 seconds (capped at `MAX_RECONNECT_DELAY`) |

- Maximum 10 reconnection attempts before giving up
- Intentional disconnects (logout, page leave) set `reconnectAttempts` to max to prevent unwanted reconnection
- Uses SockJS as WebSocket transport with STOMP protocol

---

## 11. Image System

### 11.1 Food Image Mapping

**File:** `src/utils/foodImages.js`

The `getFoodImage(itemName, existingUrl)` function provides Unsplash-based food images:

1. If the item has an `imageUrl` from the database, return that directly
2. Otherwise, match the item name (case-insensitive) against a keyword table
3. Use a deterministic hash of the item name to pick a consistent image from the matched category
4. Fall back to generic food images if no keyword matches

#### Keyword Categories (16 food + 4 generic)

| Category | Keywords | Image Count |
|---|---|---|
| Salads & greens | salad, greens | 3 |
| Bowls | bowl, platter | 3 |
| Wraps | wrap | 2 |
| Juice & smoothie | juice, smoothie | 2 |
| Burgers & sliders | burger, slider | 3 |
| Fries | fries | 2 |
| Tacos | taco | 2 |
| Fried chicken | fried chicken, chicken | 2 |
| Water | water | 1 |
| Rice | rice | 1 |
| Noodles | noodle | 2 |
| Skewers | skewer | 1 |
| Sandwiches | sandwich | 2 |
| Coffee & espresso | coffee, espresso, latte | 3 |
| Toast | toast | 2 |
| Croissant | croissant | 1 |
| Buns & rolls | bun, roll | 2 |
| Cupcake | cupcake | 1 |
| Muffin | muffin | 1 |
| Macaron | macaron | 1 |
| Cake | cake | 1 |
| Cola & soda | coke, cola, soda | 1 |
| Energy drink | energy, drink | 1 |
| Chilli / sauce | chilli, paste, sauce | 1 |
| **Generic fallback** | (no match) | 4 |

**Note:** "Water" is checked before "rice" because "Overpriced Tap Water" contains "rice" as a substring of "Overp**rice**d".

### 11.2 Cafeteria Images

`getCafeteriaImage(cafeteriaId)` returns a themed hero image per cafeteria:

| Cafeteria ID | Name | Theme |
|---|---|---|
| 1 | The Last Drop | Cozy, warm coffee shop atmosphere |
| 2 | Hex Core Cafe | Modern, industrial cafe interior |
| 3 | Skyline Sips | Rooftop terrace with panoramic view |

All cafeteria images use `1600x900` resolution for hero display.

### 11.3 Name Hash

The `nameHash(name)` function produces a deterministic integer from a string using a simple polynomial hash (`hash * 31 + charCode`). This ensures the same item always gets the same image, even across sessions.

### 11.4 CSP and Backend Upload

- Unsplash images require `images.unsplash.com` in the Content-Security-Policy `img-src` directive
- Staff can upload images via `POST /api/images/upload` (JPEG/PNG, 5MB max, UUID filenames)
- Uploaded images take precedence over Unsplash fallbacks via the `existingUrl` parameter

---

## 12. Accessibility

### 12.1 ARIA Labels

Icon-only buttons have explicit `aria-label` attributes:

| Element | aria-label |
|---|---|
| Cart icon (Navbar) | "Shopping cart" |
| Notification bell | "Notifications" |
| Profile avatar | "User profile" |
| Logout icon | "Logout" |
| Theme toggle | "Toggle dark mode" |
| FoodCard button (home) | "Order {title}" |
| FoodCard button (menu) | "Add {title} to cart" |
| Toast dismiss | "Dismiss notification" |
| Star rating | "Rate {n} star(s)" |

### 12.2 Role Attributes

- Profile avatar div: `role="button"` on clickable `<div>`
- Logout icon: `role="button"` on Lucide icon component
- Star rating icons: `role="button"` on each `FaStar`

### 12.3 Semantic HTML

- `<nav>` element for the Navbar
- `<main>` wrapping content in each layout
- `<button>` for interactive elements (not divs, where possible)
- `<form>` with `onSubmit` for login and payment forms
- `<label>` elements for form inputs
- `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` for data tables (Wallet, Audit Log)

### 12.4 Color Contrast

- Primary text on light: `gray-900` (#111827) on white — exceeds WCAG AA
- Primary text on dark: white (#FFFFFF) on `slate-800`/`gray-900` — exceeds WCAG AA
- Gold Krakens price text: `yellow-400` on dark backgrounds (adequate for decorative/non-critical text)
- Muted text: `gray-500` on white and `slate-400` on dark — meets AA for large text

### 12.5 Keyboard Navigation

- Login: `onKeyDown` handler on password field — pressing Enter submits the form
- All buttons and links are focusable by default (native HTML focus handling)
- Focus rings: `focus:border-{accent}` / `focus:ring-2 focus:ring-{accent}` on inputs
- `autoComplete="current-password"` on password fields for browser autofill

---

## 13. Animation & Transitions

### 13.1 CSS Keyframe Animations

Defined in `src/index.css`:

| Animation | Class | Duration | Effect |
|---|---|---|---|
| `slide-in` | `animate-slide-in` | 0.3s ease-out | Slides in from right (`translateX(100%)` to `translateX(0)`) with fade |
| `slide-out` | `animate-slide-out` | 0.3s ease-in | Slides out to right with fade (uses `forwards` fill) |
| `fade-in` | `animate-fade-in` | 0.2s ease-out | Simple opacity fade (0 to 1) |
| `fade-in-scale` | `animate-fade-in-scale` | 0.2s ease-out | Scale up from 95% + slight upward translate + fade |
| `fade-in-up` | `animate-fade-in-up` | 0.25s ease-out | Slides up 8px with fade |
| `slide-in-right` | `animate-slide-in-right` | 0.25s ease-out | Slides in from right 16px with fade |

#### Where Each Animation is Used

| Animation | Components |
|---|---|
| `animate-slide-in` | Toast notifications (entry) |
| `animate-slide-out` | Toast notifications (exit) |
| `animate-fade-in` | Modal backdrops, notification dropdown backdrop, admin modals, login portal selector |
| `animate-fade-in-scale` | Notification dropdown panel |
| `animate-fade-in-up` | PaymentGatewayModal content, admin modal content |
| `animate-slide-in-right` | ProfileModal panel |

### 13.2 Tailwind Transition Utilities

| Pattern | Classes | Usage |
|---|---|---|
| General transition | `transition-all duration-300` | Card hover effects, theme switching |
| Color transition | `transition-colors` | Button hovers, navbar links |
| Transform transition | `transition-transform duration-500` | Image zoom on hover |
| Shadow transition | `transition-shadow duration-300` | Floating pill hover |
| Combined | `transition` (shorthand) | Most button and link interactions |

### 13.3 Group Hover Effects

Using Tailwind's `group` / `group-hover:` pattern on card components:

- `group-hover:scale-110` — image zoom inside FoodCard and CafeteriaCard
- `group-hover:translate-x-1` — arrow slide on FoodCard "Order Now" button
- `group-hover:bg-gray-50 dark:group-hover:bg-slate-700/40` — content area background shift
- `group-hover:bg-black/45` — overlay darkening on CafeteriaCard

### 13.4 Special Animations

- **FoodModal slide-up:** CSS `transform transition-transform duration-300 ease-out` with state-driven `translate-y-full` / `translate-y-0`
- **CafeMenu floating pill text morph:** Dual overlapping `<span>` elements with callback ref width measurement, opacity crossfade + Y-translate (`translateY(-100%)` / `translateY(100%)`) toggled by scroll state, container width animates via `transition: width 500ms ease-in-out`, `duration-500 ease-in-out`
- **Order progress pulse:** Active step icon uses `animate-pulse` for attention
- **ThemeToggle thumb:** `transition-all duration-300` on thumb position (`left-0.5` to `left-[1.625rem]`)
- **FoodModal close:** Programmatic 250ms delay between hiding (state change) and unmounting (onClose callback)
