# Demeter Frontend — React SPA

The browser-facing service of the Demeter Smart Cafeteria System. A single-page application built with React 19 and Vite 7 that consumes the Spring Boot backend API over REST and WebSocket. Provides three role-based interfaces — Student, Staff, and Admin — each with their own layout, navigation, and feature set.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Directory Structure](#directory-structure)
3. [How to Run](#how-to-run)
4. [Environment Variables](#environment-variables)
5. [Routing and Auth](#routing-and-auth)
6. [Role-Based UI](#role-based-ui)
7. [Shared Navbar](#shared-navbar)
8. [State Management](#state-management)
9. [Real-Time Features](#real-time-features)
10. [Theming](#theming)
11. [Image Handling](#image-handling)
12. [Testing](#testing)
13. [Docker](#docker)

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| UI Framework | React | 19.2 | Component-based SPA |
| Build Tool | Vite | 7.2 | Dev server with HMR, production bundling |
| Styling | Tailwind CSS | 3.4 | Utility-first CSS with dark mode support |
| HTTP Client | Axios | 1.13 | REST API calls with JWT interceptor |
| WebSocket | SockJS + @stomp/stompjs | 1.6 / 7.3 | Real-time order notifications |
| Routing | React Router DOM | 7.13 | Client-side routing with role guards |
| Icons | Lucide React | 0.574 | SVG icon components |
| Icons (secondary) | React Icons | 5.6 | Additional icon sets |
| Testing | Vitest + jsdom | 4.1 | Unit and component tests |
| Testing Utils | React Testing Library | 16.3 | DOM assertions and user event simulation |
| Linting | ESLint | 9.39 | Code quality enforcement |
| CSS Processing | PostCSS + Autoprefixer | 8.5 / 10.4 | CSS transformations |

---

## Directory Structure

```
src/
├── App.jsx                           # Root component — context providers, router, routes
├── main.jsx                          # Entry point — renders App into #root
│
├── student/                          # Student page components
│   ├── StudentHome.jsx               # Landing page — cafeteria cards, AI recommendations
│   ├── CafeMenu.jsx                  # Cafeteria menu browser with search, tags, categories, deal type filters, discount badges
│   ├── Cart.jsx                      # Shopping cart — customizations, auto-applied best discount, GK checkout
│   ├── Orders.jsx                    # Order history — status tracking, reorder, review submission
│   ├── Wallet.jsx                    # Gold Krakens balance, transaction history, self-top-up
│   └── __tests__/                    # Tests for all student pages
│
├── staff/                            # Staff page components
│   ├── StaffDashboard.jsx            # Order queue, menu editor, AI discount suggestions
│   └── __tests__/
│
├── admin/                            # Admin page components
│   ├── AdminConsole.jsx              # Staff CRUD, student list, wallet top-ups, analytics, audit log
│   ├── PromotionManagementConsole.jsx # Discount/promotion management (shared with STAFF role)
│   └── __tests__/
│
├── auth/                             # Authentication pages
│   ├── Login.jsx                     # Three-portal selector (Student, Staff, Admin) with login form
│   └── __tests__/
│
├── components/
│   ├── common/                       # Shared UI components
│   │   ├── Navbar.jsx                # Role-aware navigation bar (different colors/links per role)
│   │   ├── FoodCard.jsx              # Menu item card — image, price, tags, discount badge, add-to-cart
│   │   ├── FoodModal.jsx             # Item detail modal — customizations, quantity selector, discount-aware pricing (effectivePrice, discount badge)
│   │   ├── SearchBar.jsx             # Search input with debounced filtering
│   │   ├── NotificationBell.jsx      # WebSocket-powered notification dropdown with unread badge
│   │   ├── ProfileModal.jsx          # User profile overlay
│   │   ├── ProtectedRoute.jsx        # Auth guard — redirects to /login if unauthorized
│   │   ├── CafeteriaCard.jsx         # Cafeteria summary card for homepage (flex layout for consistent alignment)
│   │   ├── LoadingSpinner.jsx        # Shared dual-ring loading animation with role-based colors (STUDENT=teal, STAFF=amber, ADMIN=red)
│   │   ├── ErrorBoundary.jsx         # React error boundary — catches render errors gracefully
│   │   ├── ThemeToggle.jsx           # Dark/light mode toggle button (floating)
│   │   ├── PaymentGatewayModal.jsx   # Payment confirmation modal for wallet top-ups — shows "Request Submitted" with amber icon after student top-up (pending approval flow)
│   │   ├── NotFound.jsx              # 404 page for unmatched routes
│   │   └── __tests__/                # Tests for Navbar, ProtectedRoute
│   │
│   ├── staff/                        # Staff-specific components
│   │   ├── QueueList.jsx             # Real-time order queue with status action buttons
│   │   ├── QueueItem.jsx             # Individual order card in the queue
│   │   ├── MenuEditor.jsx            # Menu item CRUD form (create, edit, delete, toggle availability)
│   │   ├── DiscountSuggestion.jsx    # AI-generated discount suggestion panel with menu item name resolution and pending count
│   │   ├── DiscountCard.jsx          # Individual discount card with type-coded visuals (BOGO=emerald, COMBO=blue, PERCENTAGE=amber)
│   │   ├── StatCard.jsx              # Dashboard statistic card (orders count, revenue, etc.)
│   │   └── NavBar.jsx                # Staff-specific navigation bar
│   │
│   ├── admin/                        # Admin-specific components
│   │   ├── AnalyticsDashboard.jsx    # Charts and metrics — daily/weekly/monthly/quarterly + custom ranges
│   │   ├── StaffCard.jsx             # Staff member card with edit/delete actions
│   │   ├── WalletTable.jsx           # Student wallet top-up table with pending requests section (approve/reject buttons, WebSocket auto-refresh)
│   │   └── AuditLogTable.jsx         # Audit log viewer with search and action-type filtering
│   │
│   └── promotions/                   # Promotion management components (used by Staff + Admin)
│       ├── PromotionList.jsx         # Active/pending discount list
│       ├── PromotionForm.jsx         # Create/edit discount form
│       ├── DiscountCalculator.jsx    # Discount value calculator/preview
│       └── index.js                  # Barrel exports
│
├── contexts/                         # React Context providers
│   ├── AuthContext.jsx               # JWT auth state, login/logout, role, user data
│   ├── CartContext.jsx               # Cart items, add/remove/update, cafeteria scoping
│   ├── WalletContext.jsx             # Gold Krakens balance, refresh on transactions
│   ├── ThemeContext.jsx              # Dark/light mode toggle, persists to localStorage
│   ├── ToastContext.jsx              # Toast notification queue with auto-dismiss
│   └── __tests__/                    # Tests for CartContext, WalletContext
│
├── layouts/                          # Layout wrappers
│   ├── StudentLayout.jsx             # Student pages — Navbar + auth guard
│   ├── StaffLayout.jsx               # Staff pages — staff NavBar wrapper
│   ├── AdminLayout.jsx               # Admin pages — admin-styled wrapper
│   └── __tests__/                    # Tests for StudentLayout
│
├── utils/                            # Utility modules
│   ├── api.js                        # Axios instance — base URL config, JWT Bearer interceptor, 401 redirect
│   ├── websocket.js                  # SockJS + STOMP client — connect, subscribe, disconnect helpers
│   └── foodImages.js                 # Keyword-based Unsplash fallback image resolver
│
└── test/
    └── setup.js                      # Vitest setup — jsdom globals, Testing Library matchers
```

---

## How to Run

### Prerequisites

- Node.js 20+
- npm 9+
- Backend running on port 8080 (for API calls)

### Development

```bash
cd frontend/demeter-frontend
npm install           # Install dependencies
npm run dev           # Start Vite dev server on http://localhost:5173
```

### Production Build

```bash
npm run build         # Output to dist/
npm run preview       # Preview production build locally
```

### Linting

```bash
npm run lint          # Run ESLint across all source files
```

### Testing

```bash
npm run test          # Run Vitest in watch mode
npm run test:run      # Run all tests once (CI mode)
```

---

## Environment Variables

All environment variables are prefixed with `VITE_` (Vite convention — exposed to client-side code at build time).

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend REST API base URL. Used by the Axios instance in `utils/api.js`. |
| `VITE_WS_BASE_URL` | `http://localhost:8080/ws` | Backend WebSocket endpoint. Used by `utils/websocket.js` for SockJS connections. |

In Docker, both are set to empty strings (`""`) so that relative URLs are used, and Nginx proxies `/api/` and `/ws/` to the backend container.

---

## Routing and Auth

### Route Table

| Path | Component | Allowed Roles | Layout | Description |
|------|-----------|---------------|--------|-------------|
| `/login` | `Login` | Public | None | Three-portal login selector |
| `/` | `StudentHome` | STUDENT | StudentLayout (via ProtectedRoute) | Cafeteria list + AI recommendations |
| `/cafe/:id` | `CafeMenu` | STUDENT | StudentLayout | Browse cafeteria menu |
| `/cart` | `Cart` | STUDENT | StudentLayout | Review cart, apply discounts, checkout |
| `/wallet` | `Wallet` | STUDENT | StudentLayout | GK balance + transaction history |
| `/orders` | `Orders` | STUDENT | StudentLayout | Order history + status tracking |
| `/staff` | `StaffDashboard` | STAFF, ADMIN | StaffLayout | Order queue + menu + discounts |
| `/admin` | `AdminConsole` | ADMIN | AdminLayout | Staff/student management, analytics |
| `/admin/promotions` | `PromotionManagementConsole` | ADMIN, STAFF | AdminLayout | Discount/promotion management |
| `*` | `NotFound` | Public | None | 404 catch-all |

### How Auth Works

1. **Login** — `POST /api/auth/login` returns a JWT token, userId, username, role, and assignedCafeteriaId. These are stored in `localStorage("authData")` via `AuthContext`.
2. **Axios interceptor** — `utils/api.js` attaches `Authorization: Bearer <token>` to every request. On 401 responses, it clears auth data and redirects to `/login`.
3. **ProtectedRoute** — Wraps each route. Checks `AuthContext` for a valid token and matching role. Unauthorized users are redirected to `/login`.

### Context Provider Nesting

The provider hierarchy in `App.jsx` (outermost to innermost):

```
ErrorBoundary > ThemeProvider > ToastProvider > AuthProvider > WalletProvider > CartProvider > BrowserRouter
```

This ordering ensures that inner contexts can consume outer ones (e.g., `CartContext` can use `AuthContext`).

---

## Role-Based UI

### Student Interface

| Feature | Component(s) | Backend Endpoint |
|---------|-------------|------------------|
| Browse cafeterias | `StudentHome`, `CafeteriaCard` | `GET /api/cafeterias` |
| AI recommendations | `StudentHome` (session-cached, dietary/category tags) | `GET /api/recommendations` |
| Browse menu + discounts | `CafeMenu`, `FoodCard`, `FoodModal` | `GET /api/menus/cafeteria/{id}`, `GET /api/discounts/cafeteria/{id}/active` |
| Search and filter | `SearchBar`, category tabs, tag badges, deal type filter pills (On Sale, BOGO, Combo, % Off) | Client-side filtering |
| Shopping cart | `Cart` with customizations and auto-applied best discount (no manual selection) | Client-side (CartContext) |
| Place order | `Cart` checkout | `POST /api/orders` |
| Order tracking | `Orders` with real-time status | `GET /api/orders/user/{userId}`, WebSocket |
| Reorder | `Orders` reorder button | `POST /api/orders` (prefilled) |
| Submit review | `Orders` review form (1-5 stars, 200 chars) | `POST /api/reviews` |
| Wallet | `Wallet`, `PaymentGatewayModal` | `GET /api/wallet/balance`, `POST /api/wallet/student-topup` (creates pending request, shows "Request Submitted" amber confirmation) |
| Notifications | `NotificationBell` in Navbar | WebSocket `/user/{username}/queue/notifications` |

### Staff Interface

| Feature | Component(s) | Backend Endpoint |
|---------|-------------|------------------|
| Order queue | `QueueList`, `QueueItem`, `StatCard` | `GET /api/orders/cafeteria/{id}?activeOnly=true` |
| Accept/process orders | `QueueItem` action buttons | `PUT /api/orders/{id}/status` |
| Menu CRUD | `MenuEditor` | `POST/PUT/DELETE /api/menus/{id}` |
| Toggle availability | `MenuEditor` switch | `PUT /api/menus/{id}/availability` |
| AI discount suggestions | `DiscountSuggestion`, `DiscountCard` | `POST /api/ai/discounts/generate/{cafeteriaId}` |
| Promotion management | `PromotionManagementConsole` | `GET/POST/PUT/DELETE /api/discounts/**` |
| Real-time order alerts | WebSocket subscription | `/topic/staff` |

### Admin Interface

| Feature | Component(s) | Backend Endpoint |
|---------|-------------|------------------|
| Staff management | `AdminConsole`, `StaffCard` | `GET /api/admin/users?role=STAFF`, `POST /api/admin/staff`, `DELETE /api/admin/users/{id}` |
| Student list | `AdminConsole` | `GET /api/admin/users?role=STUDENT` |
| Wallet top-ups | `WalletTable` | `POST /api/wallet/topup` (direct credit), `GET /api/wallet/topup-requests`, `PUT /api/wallet/topup-requests/{id}/approve`, `PUT /api/wallet/topup-requests/{id}/reject` |
| Analytics dashboard | `AnalyticsDashboard` | `GET /api/admin/analytics/dashboard`, `/revenue` |
| CSV export | `AnalyticsDashboard` | `GET /api/admin/analytics/export` |
| Audit log | `AuditLogTable` | `GET /api/admin/audit` |
| Discount overview | `PromotionManagementConsole` (read-only for admin) | `GET /api/discounts/**` |

---

## Shared Navbar

The `Navbar` component is role-aware. It renders different navigation links, logo accent colors, and conditional features based on the user's role from `AuthContext`.

| Feature | Student | Staff | Admin |
|---------|---------|-------|-------|
| Logo accent color | Green | Blue | Red |
| Wallet balance display | Yes | No | No |
| Active order indicator (clipboard icon with count badge) | Yes | No | No |
| Cart icon with item count | Yes | No | No |
| Notification bell | Yes | No | No |
| Profile modal | Yes | Yes | Yes |
| Theme toggle | Yes | Yes | Yes |
| Navigation links | Home, Wallet, Orders | Dashboard | Console |

---

## State Management

Five React Context providers manage global state. Each exports a provider component and a custom hook with a safety check that throws if used outside its provider.

| Context | Hook | State Managed |
|---------|------|--------------|
| `AuthContext` | `useAuth()` | JWT token, userId, username, role, assignedCafeteriaId, login/logout functions |
| `CartContext` | `useCart()` | Cart items array, add/remove/updateQuantity/clear, cafeteria scoping (items locked to one cafeteria with confirmation dialog on switch), subtotal calculation. **Cart persistence:** items are saved to `localStorage` per user (`cart_{userId}`) and restored on login/refresh; cleared on logout. |
| `WalletContext` | `useWallet()` | Gold Krakens balance, `refreshBalance()` for post-transaction updates; subscribes to `/user/{username}/queue/notifications` WebSocket topic for `TOPUP_APPROVED` events to auto-refresh balance |
| `ThemeContext` | `useTheme()` | Dark/light mode string, `toggleTheme()`, persisted to `localStorage("theme")`. Adds `html.theme-transitioning` class during theme switch to enable a global 300ms transition on all elements, then removes it after the transition completes to avoid interfering with normal interactions. |
| `ToastContext` | `useToast()` | Toast notification queue, `showToast(message, type)`, auto-dismiss with configurable duration |

---

## Real-Time Features

### WebSocket Architecture

The frontend connects to the backend via SockJS (HTTP fallback for environments that block raw WebSocket) with STOMP as the messaging protocol.

**Connection lifecycle:**
1. `utils/websocket.js` creates a SockJS client pointing to `VITE_WS_BASE_URL`
2. STOMP client wraps the SockJS connection
3. Components subscribe to topics on mount and unsubscribe on unmount

**Subscriptions:**

| Topic | Subscriber | Purpose |
|-------|-----------|---------|
| `/topic/orders` | `NotificationBell` | Broadcast order status changes (all users) |
| `/topic/staff` | `StaffDashboard` | New order alerts for staff queue |
| `/user/{username}/queue/notifications` | `NotificationBell`, `WalletContext` | User-specific notifications: order status changes (`ORDER_STATUS` type) and top-up approval (`TOPUP_APPROVED` type — triggers balance refresh) |

**SockJS global shim:** The `index.html` includes `var global = globalThis;` because `sockjs-client` references Node's `global` object, which does not exist in Vite's ESM dev mode.

### NotificationBell Component

- Bell icon with unread count badge in the Navbar
- Scrollable dropdown showing notification history (up to 50 entries)
- "Clear all" button to dismiss all notifications
- Notifications include order ID, new status, and timestamp

---

## Theming

### Dark/Light Mode

Tailwind CSS class-based dark mode (`darkMode: 'class'` in `tailwind.config.js`). The `ThemeContext` toggles a `dark` class on the document root and persists the preference to `localStorage`.

### Custom Color Palette

Defined in `tailwind.config.js` under `theme.extend.colors`:

| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| `bg` | `#1a1d23` (blue-tinted dark gray) | `#FFFFFF` | Page backgrounds |
| `card` | `#252930` (lighter blue-tinted gray) | `#FFFFFF` | Card surfaces |
| `border` | `#363c47` (gray-blue) | `#E5E7EB` | Borders and dividers |
| `text` | `#FFFFFF` | `#111827` | Primary text |
| `textMuted` | `#9CA3AF` | `#6B7280` | Secondary/subtitle text |
| `accent` | `#EF4444` (red) | `#F87171` (light red) | Admin accent, destructive actions |
| `success` | — | `#10B981` (green) | Success states |

The `ThemeToggle` component renders as a floating button accessible from all pages.

### Global CSS Fixes

- **Horizontal scrollbar prevention:** `html, body { overflow-x: hidden; }` in `index.css` prevents unwanted horizontal scrollbars caused by full-width elements or animations.
- **Theme transition sync:** When toggling dark/light mode, a `theme-transitioning` class is temporarily added to `<html>`, enabling `* { transition: background-color 300ms, color 300ms, border-color 300ms; }` globally so all elements transition smoothly in sync. The class is removed after the transition completes.

---

## Image Handling

`utils/foodImages.js` provides a keyword-based fallback image system for menu items that lack uploaded images. It works by:

1. Checking if the menu item has an `image_url` from the backend (uploaded via `/api/images/upload`)
2. If not, matching keywords in the item name (e.g., "burger", "salad", "coffee") to curated Unsplash image URLs
3. Falling back to a generic food image if no keyword matches

The Nginx CSP header explicitly allows `img-src https://images.unsplash.com` for these fallback images.

---

## Testing

55 tests across 13 test files using Vitest (jsdom environment) and React Testing Library.

### Test Inventory

| Test File | Tests | What It Covers |
|-----------|-------|----------------|
| `contexts/__tests__/CartContext.test.jsx` | 6 | Add/remove items, quantity updates, cafeteria switch confirmation dialog, clear cart, context safety |
| `contexts/__tests__/WalletContext.test.jsx` | 6 | Balance fetching, refresh, error handling, context safety |
| `auth/__tests__/Login.test.jsx` | 8 | Portal selection, form validation, login success/failure, role routing |
| `student/__tests__/StudentHome.test.jsx` | 5 | Cafeteria card rendering, AI recommendations display |
| `student/__tests__/CafeMenu.test.jsx` | 3 | Menu loading, category filtering, food card rendering |
| `student/__tests__/Cart.test.jsx` | 3 | Cart display, checkout flow, empty cart state |
| `student/__tests__/Orders.test.jsx` | 4 | Order list rendering, status display, reorder button |
| `student/__tests__/Wallet.test.jsx` | 3 | Balance display, transaction history, top-up modal |
| `components/common/__tests__/Navbar.test.jsx` | 4 | Role-based link rendering, wallet/cart visibility |
| `components/common/__tests__/ProtectedRoute.test.jsx` | 6 | Auth redirect, role matching, token validation |
| `layouts/__tests__/StudentLayout.test.jsx` | 2 | Layout wrapping, auth guard integration |
| `staff/__tests__/StaffDashboard.test.jsx` | 2 | Dashboard rendering, order queue display |
| `admin/__tests__/AdminConsole.test.jsx` | 3 | Tab navigation, staff list, student list |

### Test Configuration

- **Environment:** jsdom (configured in `vite.config.js`)
- **Setup file:** `src/test/setup.js` (imports `@testing-library/jest-dom` matchers)
- **Globals:** Vitest globals enabled (`globals: true`)

### Running Tests

```bash
npm run test:run    # Single run (CI)
npm run test        # Watch mode (development)
```

---

## Docker

### Multi-Stage Build

The `Dockerfile` uses a two-stage build:

1. **Build stage** (`node:20-alpine`) — installs dependencies with `npm ci`, runs `npm run build` to produce the `dist/` output. Sets `VITE_API_BASE_URL` and `VITE_WS_BASE_URL` to empty strings so the app uses relative URLs.

2. **Serve stage** (`nginx:alpine`) — copies the built `dist/` to Nginx's web root and applies the custom `nginx.conf`.

### Nginx Configuration

The `nginx.conf` handles:

| Concern | Configuration |
|---------|--------------|
| **HTTP to HTTPS redirect** | Port 80 returns 301 to HTTPS |
| **TLS termination** | TLS 1.2/1.3, strong cipher suite, certs from `/etc/nginx/ssl/` |
| **Security headers** | HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy |
| **Content Security Policy** | `default-src 'self'`; allows inline scripts/styles, Unsplash images, WebSocket connections |
| **SPA routing** | `try_files $uri $uri/ /index.html` for client-side routing |
| **API proxy** | `/api/` requests proxied to `http://backend:8080/api/` |
| **WebSocket proxy** | `/ws/` requests proxied with `Upgrade` and `Connection` headers |
| **Swagger proxy** | `/swagger-ui` and `/v3/api-docs` proxied to backend |
| **Static asset caching** | JS, CSS, images, fonts cached for 7 days with `immutable` |
| **Gzip compression** | Enabled for text, JSON, JS, CSS, XML, SVG |

### TLS Certificates

Requires `./ssl/cert.pem` and `./ssl/key.pem` mounted into the container. Generate self-signed certs for development:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem -subj "/CN=localhost"
```

### Docker Compose

When running via the project root `docker-compose.yml`, the frontend service maps to host ports 3000 (HTTP) and 3443 (HTTPS). The backend runs plain HTTP on 8080 behind Nginx — TLS termination happens at the reverse proxy layer.
