# Security & Network Architecture — Demeter Smart Cafeteria System (v2)

> **Purpose:** This document explains how Demeter protects user data and how the different parts of the system talk to each other. Written for team members who need to understand and explain these topics — no deep security background required.

---

## Table of Contents

1. [How the System is Connected](#1-how-the-system-is-connected)
2. [How Users Log In and Stay Secure](#2-how-users-log-in-and-stay-secure)
3. [How Data is Protected](#3-how-data-is-protected)
4. [Security Settings We Have in Place](#4-security-settings-we-have-in-place)
5. [Remaining Risks & Design Decisions](#5-remaining-risks--design-decisions)
6. [What Was Fixed](#6-what-was-fixed)
7. [Plain-English Summary](#7-plain-english-summary)

---

## 1. How the System is Connected

Demeter has **three separate services** that work together:

```
                    ┌───────────────────────┐
                    │  Frontend (React)      │  ← What users see in their browser
                    │  Runs on port 5173     │
                    │  (or 3000/3443 Docker) │
                    └───────────┬───────────┘
                                │
                      Encrypted (HTTPS)
                                │
                    ┌───────────▼───────────┐
                    │  Backend (Spring Boot) │  ← Handles all the business logic
                    │  Runs on port 8080     │
                    └─────┬───────────┬─────┘
                          │           │
                   API Key│           │ Password
                          ▼           ▼
              ┌──────────────┐  ┌──────────────┐
              │  AI Service  │  │  MySQL 8.0   │  ← Stores all data
              │  (Python)    │  │  Database     │
              │  Port 8001   │  │  Port 3306   │
              └──────────────┘  └──────────────┘
```

**Key points:**
- The **frontend** is the only part visible to the outside world. Everything else is hidden inside the Docker network.
- Browser → Backend communication is encrypted with **HTTPS (TLS 1.2+)**. If someone tries plain HTTP, they get automatically redirected to HTTPS.
- Backend → AI Service and Backend → Database talk over the **internal Docker network** — not exposed to the internet.
- The system has **no external dependencies** at runtime. No emails, no payment gateways, no cloud APIs. Everything runs locally.

### How Docker Runs It

Docker Compose starts four containers in order:

1. **MySQL** (database) starts first
2. **AI Service** starts after the database is ready
3. **Backend** starts after both MySQL and AI Service are healthy
4. **Frontend (Nginx)** starts last, once the backend is ready

Each service has a **health check** so Docker knows when it's ready before starting the next one.

### Real-Time Updates (WebSocket)

When a student places an order or staff updates its status, the other side gets notified instantly through **WebSocket** — a persistent connection between the browser and the backend.

- Students receive updates on `/topic/orders` and personal notifications on `/user/queue/notifications`
- Staff receive updates on `/topic/staff`
- The connection requires a valid login token (JWT) — you can't eavesdrop without being logged in
- If the connection drops, the browser automatically retries (up to 10 times, waiting longer each time)

---

## 2. How Users Log In and Stay Secure

### Login Flow

1. User enters username (or university ID for students) + password on the login page
2. Backend checks the password against a stored **hash** (a one-way fingerprint — the real password is never stored)
3. If correct, the backend creates a **JWT token** — a digitally signed pass containing the user's ID, username, and role
4. The token is valid for **2 hours**, then the user must log in again
5. The browser stores this token and automatically sends it with every request

### What's Inside the Token

| Field | What It Contains |
|---|---|
| Username | The user's login name |
| Role | `STUDENT`, `STAFF`, or `ADMIN` |
| User ID | The user's database ID |
| Expiry | When the token stops working (2 hours after login) |

The backend **signs** this token with a secret key. If anyone tampers with it, the signature won't match and the backend will reject it.

### Startup Safety Check

The app **refuses to start** if the JWT secret key is:
- Missing or blank
- Shorter than 32 characters
- Set to a known placeholder like `changeme`

This prevents accidental deployment with a weak secret.

### Password Security

- Passwords are hashed using **BCrypt with 12 salt rounds** — an industry-standard algorithm that makes it extremely slow to crack passwords by guessing
- New accounts must have passwords that are at least 8 characters with at least one letter and one digit
- The seed/demo users all share the password `pass` — this is intentional for development and testing only

### Who Can Access What (Role-Based Access)

| Role | Can Access |
|---|---|
| **Anyone** (not logged in) | View cafeterias, menus, and reviews |
| **Student** | Place orders, manage wallet, submit reviews |
| **Staff** | Manage orders and menu for their assigned cafeteria |
| **Admin** | Manage users, top up wallets, view analytics, view audit logs |

The backend enforces these rules on **every request**. The frontend also hides buttons/pages based on role, but the real security is on the backend — even if someone bypasses the frontend, the backend will reject unauthorized requests.

### How the Backend Talks to the AI Service

The backend sends a **secret API key** in every request to the AI service. The AI service checks this key using a timing-safe comparison method (prevents attackers from guessing the key one character at a time). Health check endpoints (`/health`) don't require the key since they don't expose sensitive data.

---

## 3. How Data is Protected

### Passwords & Secrets

All sensitive values (database password, JWT secret, AI API key) are loaded from **environment variables** — they are **not** hardcoded in the code. A `.env.example` file shows what variables need to be set, and `.gitignore` ensures `.env` files are never committed to Git.

### Encryption

| What | How It's Protected |
|---|---|
| Browser ↔ Server traffic | Encrypted with **TLS 1.2+** (HTTPS). HTTP is redirected to HTTPS. |
| Internal Docker traffic | Not encrypted, but isolated inside the Docker network (not reachable from outside) |
| Passwords in the database | **Hashed** with BCrypt — not reversible, not readable |
| Database files on disk | Not encrypted (standard for development environments) |

### Preventing Bad Input

The system validates all incoming data at multiple levels to prevent common attacks:

- **SQL injection** (tricking the database): Prevented because the backend uses JPA parameterized queries — user input is never directly placed into SQL
- **XSS** (injecting malicious scripts): Prevented because React automatically escapes all text, and the Content-Security-Policy header blocks unauthorized scripts
- **Invalid data**: The backend validates all request fields (e.g., star rating must be 1-5, review text max 200 characters, username can't be blank)
- **Large uploads**: File uploads are capped at 5MB

---

## 4. Security Settings We Have in Place

### Browser Security Headers

Nginx sends these headers with every response to tell browsers how to behave securely:

| Header | What It Does (Simple) |
|---|---|
| **HSTS** | Tells browsers to always use HTTPS, even if someone types `http://` |
| **Content-Security-Policy** | Only allows scripts/styles from our own server — blocks injected malicious code |
| **X-Frame-Options** | Prevents our site from being embedded in someone else's page (clickjacking protection) |
| **X-Content-Type-Options** | Stops browsers from guessing file types incorrectly |
| **Permissions-Policy** | Disables camera, microphone, geolocation, and payment APIs that we don't need |
| **Referrer-Policy** | Limits what URL information is shared when clicking links to other sites |

### Rate Limiting (Flood Protection)

To prevent abuse (like bots sending thousands of requests):

- **Backend**: Each IP address can make at most **20 requests per minute**. After that, they get a "Too Many Requests" error.
- **AI Service**: Each endpoint has its own limit (e.g., 10 recommendations per minute, 5 discount generations per minute)

### CORS (Cross-Origin Requests)

CORS controls which websites can talk to our backend. Only these are allowed:
- `http://localhost:5173` (development server)
- `http://localhost:3000` (Docker HTTP)
- `https://localhost` and `https://localhost:3443` (Docker HTTPS)
- `http://localhost` (Docker HTTP direct)

Any other website trying to send requests to our API will be blocked by the browser. For production, these need to be updated to the real domain name.

### Swagger/API Documentation

Swagger UI (interactive API documentation) is available for development. In production, it can be turned off by setting the environment variable `SPRINGDOC_API_DOCS_ENABLED=false`.

### Audit Logging

Every important action is recorded in an audit log via `@LogActivity` annotations (19 methods covered across 7 services: auth, menu, orders, discounts, users, wallet, reviews). Each entry records:
- Who did it (user ID)
- What they did
- When they did it
- Their IP address
- Whether it succeeded or failed

If the audit logging itself fails, the error is written to the server log so it doesn't go unnoticed.

---

## 5. Remaining Risks & Design Decisions

### One Remaining Issue

| Issue | What It Means | When to Fix |
|---|---|---|
| **Rate limiter resets on restart** | The request counter is stored in memory, so it resets if the server restarts. In a multi-server setup, each server tracks limits separately. | If deploying multiple backend instances, switch to a Redis-backed rate limiter. |

### Intentional Design Decisions

These are things we're aware of and have chosen to keep as-is:

| Decision | Why |
|---|---|
| **JWT token stored in browser's localStorage** | This is simpler than cookie-based auth and works well with our API-first architecture. The Content-Security-Policy header reduces the risk of token theft via XSS. |
| **No token blacklist** | Tokens expire after 2 hours, which is a short enough window. Adding a blacklist would add complexity with little benefit for our use case. |
| **No refresh token** | Users re-login after 2 hours. This matches the FR1 requirement for a 2-hour session timeout. A refresh token would keep users logged in longer than intended. |

---

## 6. What Was Fixed

These security issues were identified during a comprehensive audit and have all been resolved:

### Critical Fixes
| What Was Wrong | What We Did |
|---|---|
| Passwords and secrets were hardcoded in the source code | Moved all secrets to environment variables. Created `.env.example` template. No defaults in code. |
| JWT secret could be left as a placeholder | App now refuses to start if the secret is missing, too short, or a known placeholder |
| No HTTPS — all data travelled unencrypted | Added TLS 1.2+ at Nginx with automatic HTTP → HTTPS redirect |
| WebSocket had no login check — anyone could listen to order updates | Added JWT validation on WebSocket connection |

### High-Priority Fixes
| What Was Wrong | What We Did |
|---|---|
| SQL queries were printed to logs (including sensitive data) | Turned off SQL logging |
| Audit logging failures were silently ignored | Added proper error logging so failures are noticed |
| AI service auto-reloaded code on file changes (security risk) | Disabled auto-reload |
| AI service Docker container ran as root user | Added a non-root user (`appuser`) |
| AI service error messages exposed internal details to users | Replaced detailed errors with generic messages; details logged server-side only |
| Audit log never recorded the user's IP address | Now captures IP from request headers |

### Medium-Priority Fixes
| What Was Wrong | What We Did |
|---|---|
| CORS accepted any request header | Restricted to only the headers we actually use |
| AI API key comparison was vulnerable to timing attacks | Switched to constant-time comparison (`hmac.compare_digest`) |
| Unhandled errors weren't logged server-side | Added server-side logging for all unhandled exceptions |
| Swagger API docs were always publicly visible | Made it toggleable via environment variable |
| Python dependencies weren't pinned to specific versions | Pinned all versions for reproducible builds |

### Low-Priority Fixes
| What Was Wrong | What We Did |
|---|---|
| Dev data seeder had plaintext passwords without warning | Added clear documentation that it's dev-only |
| Expired tokens detected up to 60 seconds late | Reduced check interval from 60s to 10s |
| Password field lacked autocomplete hint | Added `autoComplete="current-password"` for better browser behaviour |
| AI health endpoint listed all API routes | Removed endpoint listing from the response |
| Missing HSTS, CSP, and Permissions-Policy headers | Added all three to Nginx configuration |

---

## 7. Plain-English Summary

### What Demeter Is

A cafeteria ordering system for Bastion University. Students browse menus, place orders, and pay with virtual Gold Krakens. Staff manage orders in real time. An AI service recommends food and suggests discounts.

### How We Keep It Secure

1. **All communication is encrypted.** Browsers connect over HTTPS. Even if someone intercepts the traffic, they can't read it.

2. **Passwords are never stored in readable form.** They're converted into a one-way hash that can't be reversed. We use BCrypt with 12 rounds — an industry standard.

3. **Every user gets a 2-hour digital pass (JWT).** This pass contains their name and role. It's signed by the server so it can't be forged. After 2 hours, they must log in again.

4. **The server checks permissions on every request.** Even if someone tries to access admin features directly (e.g., by typing the URL), the server will reject them if they don't have the right role.

5. **Flood protection is in place.** Each IP address is limited to 20 requests per minute, preventing bots and abuse.

6. **No secrets are stored in the code.** Database passwords, signing keys, and API keys are all loaded from environment variables that are never committed to Git.

7. **Everything important is logged.** 19 audited operations across 7 services — order placements, status changes, user management, wallet transactions, reviews, discounts — all recorded with who, what, when, and from where (IP address).

8. **The AI service is locked down.** It only accepts requests from the backend (via API key), runs as a non-root user, and never exposes internal error details to users.

### Things to Remember for Deployment

| What | Action Needed |
|---|---|
| **SSL certificates** | Place real certificates (e.g., from Let's Encrypt) in the `./ssl/` folder |
| **Environment variables** | Copy `.env.example` to `.env` and fill in strong, random values for all secrets |
| **CORS origins** | Update `localhost` URLs to the real production domain in `SecurityConfig.java` and `WebSocketConfig.java` |
| **Swagger** | Set `SPRINGDOC_API_DOCS_ENABLED=false` to hide API documentation |
