# API Reference & Test Suite Documentation — Demeter Smart Cafeteria System

This document covers every API endpoint and every test across all three services. Use it as the single source of truth for integration work, testing, and onboarding.

---

## Table of Contents

1. [Overview](#1-overview)
2. [API Conventions](#2-api-conventions)
3. [Backend API Reference](#3-backend-api-reference)
4. [AI Service API Reference](#4-ai-service-api-reference)
5. [WebSocket API](#5-websocket-api)
6. [Backend Test Suite](#6-backend-test-suite)
7. [Frontend Test Suite](#7-frontend-test-suite)
8. [AI Service Test Suite](#8-ai-service-test-suite)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [How to Run Tests](#10-how-to-run-tests)
11. [Swagger / OpenAPI](#11-swagger--openapi)

---

## 1. Overview

Demeter has **three independently running services**, each with its own test suite:

| Service | Tech Stack | Port | Tests |
|---------|-----------|------|-------|
| **Backend** | Java 17, Spring Boot 3.5.10, Maven | 8080 | 67 |
| **Frontend** | React 19, Vite 7, Tailwind CSS 3 | 5173 | 55 |
| **AI Service** | Python 3.11, FastAPI | 8001 | 49 |
| **Total** | | | **171** |

All 171 tests run automatically in CI (GitHub Actions) on every push and pull request to `main`. No external database or running server is required — the backend uses H2 in-memory, the frontend uses jsdom, and the AI service uses FastAPI TestClient.

---

## 2. API Conventions

### Base Path

All backend endpoints live under `/api/`. The AI service uses `/api/v1/`.

### Content Type

All requests and responses use `application/json` unless otherwise noted (image upload uses `multipart/form-data`, analytics export returns `text/csv`).

### Authentication

Backend endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

The AI service requires an API key in the `X-API-Key` header:

```
X-API-Key: <api-key>
```

### Standard Response Wrapper

All backend endpoints (except discounts and audit, which use `ResponseEntity` directly) return:

```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
```

Example success response:

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": { ... }
}
```

### Error Response

Errors return:

```java
public class ErrorResponse {
    private String errorCode;
    private String message;
    private int status;
    private LocalDateTime timestamp;
}
```

Example error response:

```json
{
  "errorCode": "ORDER_NOT_FOUND",
  "message": "Order not found",
  "status": 404,
  "timestamp": "2026-03-19T14:30:00"
}
```

### Error Code Reference

| Error Code | HTTP Status | Message |
|-----------|-------------|---------|
| `ORDER_NOT_FOUND` | 404 | Order not found |
| `MENU_NOT_FOUND` | 404 | Menu item not found |
| `CATEGORY_NOT_FOUND` | 404 | Category not found |
| `USER_NOT_FOUND` | 404 | User not found |
| `INVALID_CREDENTIALS` | 401 | Invalid username or password |
| `DISCOUNT_NOT_FOUND` | 404 | Discount not found |
| `WEAK_PASSWORD` | 400 | Password must be at least 8 characters with a mix of letters and numbers |
| `UNAUTHORIZED_ACCESS` | 403 | You are not authorized to access this resource |
| `BAD_REQUEST` | 400 | Invalid request |
| `VALIDATION_FAILED` | 400 | Validation failed |
| `INSUFFICIENT_BALANCE` | 400 | Insufficient Gold Krakens balance |
| `REVIEW_NOT_FOUND` | 404 | Review not found |
| `REVIEW_ALREADY_EXISTS` | 409 | Review already submitted for this order |
| `REVIEW_WINDOW_EXPIRED` | 400 | Review window has expired (1 hour after completion) |
| `CAFETERIA_NOT_FOUND` | 404 | Cafeteria not found |
| `RATE_LIMITED` | 429 | Too many requests. Please try again later. |
| `AI_SERVICE_UNAVAILABLE` | 503 | AI service is temporarily unavailable |
| `ORDER_CANNOT_BE_CANCELLED` | 400 | Order can only be cancelled before staff confirmation |
| `INVALID_ORDER_TRANSITION` | 400 | Invalid order status transition |
| `TOPUP_REQUEST_NOT_FOUND` | 404 | Top-up request not found |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Rate Limiting

- **Backend:** 60 requests per minute per IP address. Exceeding returns HTTP 429.
- **AI Service:** Per-endpoint limits — 10/min for recommendations, 5/min for discounts, 10/min for reviews.

---

## 3. Backend API Reference

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | Public | Returns service health status |

**Response:** `ApiResponse<String>` with `data: "UP"`

---

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |

**POST /api/auth/register**

Request body:

```json
{
  "username": "new_student",
  "password": "secure123",
  "role": "STUDENT"
}
```

- `username`: required, non-blank
- `password`: required, min 8 chars, must contain at least one letter and one digit
- `role`: required, one of `STUDENT`, `STAFF`, `ADMIN`

Response: `ApiResponse<UserResponseDTO>` with `{ userId, username, role }`

**POST /api/auth/login**

Request body:

```json
{
  "username": "garen",
  "password": "pass"
}
```

- Students can log in with either `username` or `university_id` (e.g., `BU-10001`).

Response: `ApiResponse<LoginResponseDTO>` with `{ token, userId, username, role, assignedCafeteriaId }`

---

### Cafeterias

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/cafeterias` | Public | List all active cafeterias |
| `GET` | `/api/cafeterias/{id}` | Public | Get cafeteria by ID |

Response: `ApiResponse<List<Cafeteria>>` or `ApiResponse<Cafeteria>`

---

### Menus

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/menus` | Public | List all menu items |
| `GET` | `/api/menus/{id}` | Public | Get menu item by ID |
| `GET` | `/api/menus/cafeteria/{cafeteriaId}` | Public | List menu items for a cafeteria |
| `POST` | `/api/menus/{categoryId}` | STAFF, ADMIN | Create a new menu item in a category |
| `PUT` | `/api/menus/{id}` | STAFF, ADMIN | Update a menu item |
| `PUT` | `/api/menus/{id}/availability` | STAFF, ADMIN | Toggle availability |
| `DELETE` | `/api/menus/{id}` | STAFF, ADMIN | Delete a menu item |

**POST /api/menus/{categoryId}** — Request body:

```json
{
  "name": "New Burger",
  "description": "A tasty burger",
  "basePrice": 150.00,
  "imageUrl": "/images/burger.png",
  "preparationTime": 15,
  "available": true,
  "cafeteriaId": 1
}
```

Response: `ApiResponse<Menu>`

### Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/categories` | Public | List all menu categories |

Response: `ApiResponse<List<Category>>`

---

### Orders

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/orders` | Authenticated | Place a new order (debits wallet) |
| `GET` | `/api/orders/user/{userId}` | Authenticated (own) or STAFF/ADMIN | Get orders by user ID |
| `GET` | `/api/orders/cafeteria/{cafeteriaId}?activeOnly=false` | STAFF, ADMIN | Get orders by cafeteria |
| `GET` | `/api/orders` | STAFF, ADMIN | Get all orders |
| `PUT` | `/api/orders/{id}/status?status=CONFIRMED` | STAFF, ADMIN | Update order status |

**POST /api/orders** — Request body:

```json
{
  "userId": 1,
  "cafeteriaId": 1,
  "totalAmount": 195.00,
  "specialInstructions": "No onions",
  "appliedDiscountId": null,
  "items": [
    {
      "menuItemId": 6,
      "quantity": 1,
      "unitPrice": 150.00,
      "subtotal": 150.00
    },
    {
      "menuItemId": 12,
      "quantity": 1,
      "unitPrice": 45.00,
      "subtotal": 45.00
    }
  ]
}
```

**PUT /api/orders/{id}/status** — Valid `status` values: `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`

Order state machine:

```
PLACED -> CONFIRMED -> PREPARING -> READY -> COMPLETED
  |           |
  +-> CANCELLED <-+
```

- Cancellation is only allowed from `PLACED` or `CONFIRMED` states. Cancelling triggers an automatic wallet refund via `TransactionHistory` (REFUND type). Note: no separate REFUND Payment record is created — the original PURCHASE Payment remains as the sole payment record for the order.

---

### Wallet

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/wallet/balance` | Authenticated | Get current user's Gold Krakens balance |
| `GET` | `/api/wallet/transactions` | Authenticated | Get current user's transaction history |
| `POST` | `/api/wallet/topup` | ADMIN | Direct wallet top-up for any user (instant credit) |
| `POST` | `/api/wallet/student-topup` | STUDENT | Submit a top-up request (max 500 GK) — creates a `PendingTopUp` entry, no instant credit |
| `GET` | `/api/wallet/topup-requests` | ADMIN | List all pending student top-up requests |
| `PUT` | `/api/wallet/topup-requests/{id}/approve` | ADMIN | Approve a pending request, credit the student's wallet, notify via WebSocket |
| `PUT` | `/api/wallet/topup-requests/{id}/reject` | ADMIN | Reject a pending request (no wallet change) |

**POST /api/wallet/topup** — Request body:

```json
{
  "userId": 5,
  "amount": 500.00
}
```

**POST /api/wallet/student-topup** — Request body:

```json
{
  "amount": 200.00
}
```

Response: `ApiResponse<PendingTopUp>` with `{ requestId, userId, username, amount, requestedAt }` confirming the request was submitted (no balance data returned — credit is deferred until admin approval).

**GET /api/wallet/topup-requests** — Response: `ApiResponse<List<PendingTopUp>>` with each entry containing `{ requestId, userId, username, amount, requestedAt }`

**PUT /api/wallet/topup-requests/{id}/approve** — On approval: credits the student's wallet via `KrakensWalletService.credit()` and sends a `TOPUP_APPROVED` WebSocket message to `/user/{username}/queue/notifications`.

Transactions response: `ApiResponse<List<TransactionResponse>>` with each entry containing `{ transactionId, transactionType, amount, balanceBefore, balanceAfter, description, referenceId, createdAt }`

---

### Reviews

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/reviews` | Authenticated | Submit a review for a completed order |
| `GET` | `/api/reviews/cafeteria/{cafeteriaId}` | Authenticated | Get reviews for a cafeteria |
| `GET` | `/api/reviews/user/{userId}` | Authenticated | Get reviews by a user |

**POST /api/reviews** — Request body:

```json
{
  "orderId": 5,
  "cafeteriaId": 1,
  "starRating": 5,
  "reviewText": "Great food and fast service"
}
```

- `starRating`: 1-5 (required)
- `reviewText`: max 200 characters (optional)
- Review must be submitted within 1 hour of order completion
- One review per order (duplicate submission returns `REVIEW_ALREADY_EXISTS`)
- Submitting a review awards 5 Gold Krakens

Response: `ApiResponse<Review>`

---

### Discounts

All write operations are STAFF-only. Read operations are STAFF or ADMIN.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/discounts` | STAFF | Create a discount |
| `GET` | `/api/discounts` | STAFF, ADMIN | List all discounts |
| `GET` | `/api/discounts/{id}` | STAFF, ADMIN | Get discount by ID |
| `GET` | `/api/discounts/active` | STAFF, ADMIN | List active discounts |
| `GET` | `/api/discounts/cafeteria/{cafeteriaId}` | STAFF, ADMIN | List discounts by cafeteria |
| `GET` | `/api/discounts/cafeteria/{cafeteriaId}/active` | STUDENT, STAFF, ADMIN | List active discounts by cafeteria (students use this for menu discount display) |
| `GET` | `/api/discounts/pending` | STAFF, ADMIN | List pending AI-generated discounts |
| `GET` | `/api/discounts/cafeteria/{cafeteriaId}/pending` | STAFF, ADMIN | List pending AI discounts by cafeteria |
| `PUT` | `/api/discounts/{id}` | STAFF | Update a discount |
| `PUT` | `/api/discounts/{id}/approve?staffUserId=42` | STAFF | Approve a discount |
| `PUT` | `/api/discounts/{id}/reject` | STAFF | Reject a discount |
| `PUT` | `/api/discounts/{id}/activate` | STAFF | Activate a discount |
| `PUT` | `/api/discounts/{id}/deactivate` | STAFF | Deactivate a discount |
| `DELETE` | `/api/discounts/{id}` | STAFF | Delete a discount |

**Note:** Discount endpoints return `ResponseEntity<DiscountDTO>` directly (not wrapped in `ApiResponse`).

---

### AI Integration

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/ai/discounts/generate/{cafeteriaId}` | STAFF | Generate AI discount suggestions for a cafeteria |
| `GET` | `/api/recommendations?cafeteriaId=&context=&limit=` | Authenticated | Get AI-powered food recommendations |

**GET /api/recommendations** — Query parameters:

- `cafeteriaId` (optional): filter by cafeteria (required when `context=cart`)
- `context` (default: `homepage`): `homepage` or `cart`
- `limit` (default: `3`): max number of recommendations

Response: `ApiResponse<RecommendationResponse>`

**POST /api/ai/discounts/generate/{cafeteriaId}**

Response: `ApiResponse<List<DiscountDTO>>` — AI-generated discount suggestions saved as pending discounts awaiting staff approval.

If the AI service is unavailable, returns HTTP 503 with `"AI service is currently unavailable. Please try again later."`

---

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/admin/users?role=STAFF` | ADMIN | List users by role |
| `POST` | `/api/admin/staff` | ADMIN | Create a new staff user |
| `DELETE` | `/api/admin/users/{id}` | ADMIN | Delete a user |
| `GET` | `/api/admin/analytics/dashboard?period=monthly&startDate=&endDate=` | ADMIN | Dashboard analytics |
| `GET` | `/api/admin/analytics/revenue?period=monthly&startDate=&endDate=` | ADMIN | Revenue breakdown |
| `GET` | `/api/admin/analytics/export?period=monthly` | ADMIN | Export analytics as CSV file |
| `GET` | `/api/admin/audit` | ADMIN | Get all audit log entries |

**POST /api/admin/staff** — Request body:

```json
{
  "username": "new_staff",
  "password": "secure123",
  "cafeteriaId": 1
}
```

**GET /api/admin/analytics/dashboard** — Query parameters:

- `period` (default: `monthly`): `daily`, `weekly`, `monthly`, `quarterly`
- `startDate` (optional): ISO date, e.g., `2026-03-01`
- `endDate` (optional): ISO date, e.g., `2026-03-19`

**GET /api/admin/analytics/export** — Returns a CSV file download with `Content-Disposition: attachment` header.

**GET /api/admin/audit** — Returns `ResponseEntity<List<AuditLog>>` directly (not wrapped in `ApiResponse`).

---

### Images

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/images/upload` | Authenticated | Upload an image file |

**POST /api/images/upload** — `multipart/form-data` with:

- `file` (required): the image file (max 5MB)
- `folder` (default: `general`): subdirectory for the upload
- `oldPath` (optional): path of previous image to replace

Response: `ResponseEntity<ImageUploadResponse>`

---

## 4. AI Service API Reference

The AI service runs on port 8001. All data endpoints require an API key via `X-API-Key` header. Health endpoints are public.

### GET / — Service Info

No authentication required.

```json
// Response
{
  "service": "Demeter AI Service",
  "status": "running",
  "version": "2.0"
}
```

### GET /health — Health Check

No authentication required.

```json
// Response
{
  "status": "healthy",
  "timestamp": "2026-03-19T14:30:00"
}
```

### POST /api/v1/recommendations — Get Recommendations

Rate limit: 10 requests/minute.

```json
// Request
{
  "user_id": 1,
  "current_time": "2026-03-19T12:00:00",
  "context": "homepage",
  "cafeteria_id": null,
  "limit": 3
}
```

- `user_id` (required): integer
- `current_time` (required): ISO datetime string
- `context` (required): `"homepage"` or `"cart"`
- `cafeteria_id` (optional): required when `context` is `"cart"`, must be a positive integer
- `limit` (required): 1-10

```json
// Response
{
  "user_id": 1,
  "recommendations": [
    {
      "item_id": 6,
      "recommendation_type": "PERSONALIZED",
      "confidence_score": 0.85,
      "reason": "Based on your purchase history",
      "context_data": {
        "filtered_for_canteen": false
      }
    },
    {
      "item_id": 11,
      "recommendation_type": "CONTEXTUAL",
      "confidence_score": 0.72,
      "reason": "Popular during Lunch hours",
      "context_data": {
        "filtered_for_canteen": false
      }
    }
  ],
  "model_version": "v2.0-knn-production",
  "generated_at": "2026-03-19T14:30:00"
}
```

- Known users (present in training data) get `PERSONALIZED` recommendations via KNN collaborative filtering.
- Unknown users get `CONTEXTUAL` recommendations based on time bucket (Morning/Lunch/Evening).
- Confidence scores are returned in descending order.

### POST /api/v1/discounts — Generate Discount Suggestions

Rate limit: 5 requests/minute.

```json
// Request
{
  "cafeteria_id": 1,
  "limit": 5
}
```

- `cafeteria_id` (required): positive integer (1, 2, or 3)
- `limit` (required): max number of discount suggestions

```json
// Response
{
  "cafeteria_id": 1,
  "proposed_discounts": [
    {
      "discount_type": "BOGO",
      "target_item_id": 18,
      "associated_item_id": 6,
      "suggested_value": 100.0,
      "reason": "Cross-sell: Buy popular Darius Dunk Burger, get slow-moving Teemo Veggie Burger free",
      "priority": 1
    },
    {
      "discount_type": "COMBO",
      "target_item_id": 16,
      "associated_item_id": 17,
      "suggested_value": 7.5,
      "reason": "Frequently bought together with confidence 0.85",
      "priority": 2
    },
    {
      "discount_type": "PERCENTAGE",
      "target_item_id": 18,
      "associated_item_id": null,
      "suggested_value": 8.0,
      "reason": "Low sales volume - severity score 0.8",
      "priority": 3
    }
  ],
  "generated_at": "2026-03-19T14:30:00"
}
```

- Discounts are returned in priority order: BOGO first, then COMBO, then PERCENTAGE.
- No duplicate `target_item_id` values across all discounts.
- PERCENTAGE and COMBO values are capped at 10%.
- BOGO discounts always have `suggested_value: 100.0` and a non-null `associated_item_id`.

### POST /api/v1/reviews/analyze — Analyze Review Sentiment

Rate limit: 10 requests/minute.

```json
// Request
{
  "review_id": 1,
  "review_text": "Amazing food and excellent service, loved it",
  "star_rating": 5
}
```

- `review_id` (required): integer
- `review_text` (required): string
- `star_rating` (required): 1-5

```json
// Response
{
  "review_id": 1,
  "sentiment_type": "POSITIVE",
  "sentiment_score": 0.82,
  "confidence": 0.91,
  "keywords": ["amazing", "food", "excellent", "service"],
  "is_approved": true,
  "analysis_notes": "Valid English Ratio: 1.00. Star-sentiment alignment: consistent."
}
```

- `sentiment_type`: `POSITIVE`, `NEGATIVE`, or `NEUTRAL`
- `sentiment_score`: -1.0 to 1.0 (VADER compound score)
- `confidence`: 0.0 to 1.0 (boosted when stars and sentiment align)
- `is_approved`: `false` for nonsense/gibberish text or contradictory star-sentiment combinations
- `keywords`: extracted meaningful words (stopwords excluded)
- `analysis_notes`: includes valid English ratio and alignment info

---

## 5. WebSocket API

### Connection

The WebSocket endpoint uses SockJS + STOMP over HTTP:

```
ws://localhost:8080/ws
```

**Authentication:** Pass a JWT token in the STOMP `CONNECT` frame headers:

```
Authorization: Bearer <jwt-token>
```

The server validates the JWT on connection and assigns the user principal for user-targeted messaging.

### STOMP Configuration

- **Broker prefixes:** `/topic`, `/queue`
- **Application destination prefix:** `/app`
- **User destination prefix:** `/user`

### Subscription Topics

| Topic | Subscribers | When Messages Are Sent |
|-------|-----------|----------------------|
| `/topic/staff` | Staff dashboards | New order placed |
| `/topic/orders` | Student order tracking | Order status updated |
| `/topic/admin` | Admin dashboards | Admin-relevant events |
| `/user/{username}/queue/notifications` | Specific user | Personal notifications (order status changes, top-up approval/rejection) |

### Message Format

All WebSocket messages use the `NotificationMessage` schema:

```json
{
  "type": "ORDER_STATUS",
  "title": "Order Updated",
  "message": "Your order #5 is now being prepared",
  "orderId": "5",
  "status": "PREPARING",
  "time": "2026-03-19T14:30:00"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | Message type: `NEW_ORDER`, `ORDER_STATUS`, `TOPUP_REQUEST`, `TOPUP_APPROVED`, `TOPUP_REJECTED`, `TEST` |
| `title` | String | Short notification title |
| `message` | String | Full notification text |
| `orderId` | String | Associated order ID (optional) |
| `status` | String | Order status value (optional) |
| `time` | LocalDateTime | Server timestamp |

### Allowed Origins

WebSocket connections are restricted to:
- `http://localhost:5173` (dev)
- `http://localhost:3000` (Docker HTTP)
- `https://localhost` (Docker HTTPS)
- `https://localhost:3443` (Docker HTTPS)

**Important:** `SecurityConfig` CORS origins and `WebSocketConfig.setAllowedOriginPatterns()` are independent configs that must be kept in sync. If a new origin is added, update BOTH or WebSocket connections will get 403.

---

## 6. Backend Test Suite

**67 tests** across 9 test classes. All tests use JUnit 5 with Mockito or Spring Boot Test.

### Test Infrastructure

- **Database:** H2 in-memory (`jdbc:h2:mem:testdb`) with `ddl-auto: create-drop`
- **JWT:** Test secret key and 1-hour expiry configured in `src/test/resources/application.properties`
- **Swagger:** Disabled during tests (`springdoc.api-docs.enabled=false`)
- **Test styles:** Unit tests use `@ExtendWith(MockitoExtension.class)` with mocked repositories. Integration tests use `@SpringBootTest` with `@AutoConfigureMockMvc`.

### AuthServiceTest (9 tests)

`@ExtendWith(MockitoExtension.class)` — Unit tests for `AuthService`.

| Test Method | What It Verifies |
|-------------|-----------------|
| `register_withValidUser_shouldEncodePasswordAndSave` | Valid registration encodes password with BCrypt and saves to repository |
| `register_withWeakPassword_tooShort_shouldThrow` | Password under 8 characters throws `WEAK_PASSWORD` |
| `register_withWeakPassword_noDigits_shouldThrow` | Password without digits throws `WEAK_PASSWORD` |
| `register_withWeakPassword_noLetters_shouldThrow` | Password without letters throws `WEAK_PASSWORD` |
| `register_withNullPassword_shouldThrow` | Null password throws `WEAK_PASSWORD` |
| `login_withValidCredentials_shouldReturnLoginResponseDTO` | Successful login returns JWT token, userId, username, and role |
| `login_withNonExistentUsername_shouldThrow` | Unknown username (checked against both username and university ID) throws `INVALID_CREDENTIALS` |
| `login_withWrongPassword_shouldThrow` | Incorrect password throws `INVALID_CREDENTIALS` |
| `login_withUniversityId_shouldSucceed` | Student can log in using university ID instead of username |

### OrderServiceTest (11 tests)

`@ExtendWith(MockitoExtension.class)` — Unit tests for `OrderService`.

| Test Method | What It Verifies |
|-------------|-----------------|
| `placeOrder_shouldSetStatusToPlacedAndSave` | New order status is set to PLACED, wallet is debited, staff is notified |
| `updateStatus_withValidId_shouldUpdateAndSave` | Valid transition (PLACED to CONFIRMED) updates status and sends notification |
| `updateStatus_withInvalidId_shouldThrowAppException` | Non-existent order ID throws `ORDER_NOT_FOUND` |
| `cancelOrder_fromPlacedState_shouldRefundAndCancel` | Cancelling a PLACED order refunds the actual charged amount to wallet |
| `cancelOrder_fromConfirmedState_shouldRefundAndCancel` | Cancelling a CONFIRMED order refunds the charged amount to wallet |
| `cancelOrder_fromPreparingState_shouldThrow` | Cancelling a PREPARING order throws `ORDER_CANNOT_BE_CANCELLED` |
| `cancelOrder_refundsFallbackToTotalAmount_whenNoTransactionFound` | When no debit transaction found, refund falls back to order total amount |
| `getOrdersByUser_shouldReturnUserOrders` | Returns all orders for a given user ID |
| `getAllOrders_shouldReturnAll` | Returns all orders in the system |
| `updateStatus_invalidTransition_shouldThrow` | Invalid transition (PLACED to READY) throws `INVALID_ORDER_TRANSITION` |
| `updateStatus_fullLifecycle_succeeds` | Full lifecycle PLACED -> CONFIRMED -> PREPARING -> READY -> COMPLETED succeeds |

### MenuServiceTest (6 tests)

`@ExtendWith(MockitoExtension.class)` — Unit tests for `MenuService`.

| Test Method | What It Verifies |
|-------------|-----------------|
| `createMenu_withValidCategory_shouldSave` | Creating a menu item with a valid category ID saves and returns it |
| `createMenu_withInvalidCategory_shouldThrow` | Non-existent category ID throws `CATEGORY_NOT_FOUND` |
| `getMenuById_withValidId_shouldReturn` | Valid menu ID returns the menu item |
| `getMenuById_withInvalidId_shouldThrow` | Non-existent menu ID throws `MENU_NOT_FOUND` |
| `getAllMenus_shouldReturnAll` | Returns all menu items |
| `deleteMenu_withValidId_shouldDelete` | Valid menu ID deletes the item from the repository |

### DiscountServiceTest (13 tests)

`@ExtendWith(MockitoExtension.class)` — Unit tests for `DiscountService`.

| Test Method | What It Verifies |
|-------------|-----------------|
| `createDiscount_shouldSaveAndReturn` | Creating a discount saves it and returns with an ID |
| `getActiveDiscounts_shouldReturnOnlyActive` | Only returns discounts where `isActive` is true |
| `getDiscountsByCafeteria_shouldFilterByCafeteriaId` | Filters discounts by cafeteria ID |
| `getPendingAIDiscounts_shouldReturnUnapprovedAIDiscounts` | Returns AI-generated discounts that have no `approvedBy` value |
| `approveDiscount_shouldSetApprovedByAndActivate` | Approving sets the `approvedBy` field and activates the discount |
| `rejectDiscount_shouldDeactivate` | Rejecting deactivates the discount |
| `deactivateDiscount_shouldSetInactive` | Deactivating sets `isActive` to false |
| `approveDiscount_withInvalidId_shouldThrowAppException` | Non-existent discount ID throws `DISCOUNT_NOT_FOUND` |
| `rejectDiscount_withInvalidId_shouldThrowAppException` | Non-existent discount ID throws `DISCOUNT_NOT_FOUND` |
| `updateDiscount_withInvalidId_shouldThrowAppException` | Non-existent discount ID throws `DISCOUNT_NOT_FOUND` |
| `deactivateDiscount_withInvalidId_shouldThrowAppException` | Non-existent discount ID throws `DISCOUNT_NOT_FOUND` |
| `activateDiscount_shouldSetIsActiveTrue` | Activating sets `isActive` to true |
| `activateDiscount_withInvalidId_shouldThrowAppException` | Non-existent discount ID throws `DISCOUNT_NOT_FOUND` |

### KrakensWalletServiceTest (6 tests)

`@ExtendWith(MockitoExtension.class)` — Unit tests for `KrakensWalletService`.

| Test Method | What It Verifies |
|-------------|-----------------|
| `getBalance_shouldReturnUserBalance` | Returns the user's current Gold Krakens balance |
| `getBalance_userNotFound_shouldThrow` | Non-existent user ID throws `AppException` |
| `debit_shouldSubtractAndRecordTransaction` | Debiting subtracts from balance and records a transaction |
| `debit_insufficientBalance_shouldThrow` | Debiting more than available balance throws `AppException` |
| `credit_shouldAddAndRecordTransaction` | Crediting adds to balance and records a transaction |
| `getTransactionHistory_shouldReturnTransactions` | Returns transaction history ordered by creation date descending |

### TopUpRequestServiceTest (7 tests)

`@ExtendWith(MockitoExtension.class)` — Unit tests for `TopUpRequestService`.

| Test Method | What It Verifies |
|-------------|-----------------|
| `createRequest_shouldStoreAndNotifyAdmin` | Creating a top-up request stores a `PendingTopUp` with correct fields and notifies admin via WebSocket |
| `createRequest_shouldIncrementIds` | Successive requests get incrementing request IDs |
| `getPendingRequests_shouldReturnAll` | Returns all pending requests from the in-memory store |
| `approveRequest_shouldCreditAndNotifyStudent` | Approving credits the student's wallet via `KrakensWalletService.credit()`, sends a `TOPUP_APPROVED` WebSocket notification, and removes from pending |
| `approveRequest_notFound_shouldThrow` | Non-existent request ID throws `AppException` |
| `rejectRequest_shouldRemoveAndNotifyStudent` | Rejecting removes from pending, notifies student, and does not touch the wallet |
| `rejectRequest_notFound_shouldThrow` | Non-existent request ID throws `AppException` |

### JwtUtilTest (7 tests)

Plain JUnit 5 — Unit tests for `JwtUtil`.

| Test Method | What It Verifies |
|-------------|-----------------|
| `generateToken_shouldReturnNonNullToken` | Token generation returns a non-null, non-empty string |
| `extractUsername_shouldReturnCorrectUsername` | Extracting username from token returns the original username |
| `extractRole_shouldReturnCorrectRole` | Extracting role from token returns the original role |
| `extractUserId_shouldReturnCorrectUserId` | Extracting userId from token returns the original user ID |
| `extractUsername_withDifferentRoles_shouldWork` | Token generation and extraction works for STUDENT, STAFF, and ADMIN roles |
| `extractUsername_withInvalidToken_shouldThrow` | Invalid token string throws an exception |
| `extractUsername_withExpiredToken_shouldThrow` | Token with 0ms expiry is immediately expired and throws |

### SecurityConfigTest (7 tests)

`@SpringBootTest` + `@AutoConfigureMockMvc` — Integration tests for endpoint security.

| Test Method | What It Verifies |
|-------------|-----------------|
| `authEndpoints_shouldBeAccessibleWithoutToken` | Auth endpoints are reachable without JWT (returns 401 for bad credentials, not 403) |
| `protectedEndpoints_shouldReturn403WithoutToken` | Protected endpoints return 403 without any token |
| `protectedEndpoints_shouldReturn403WithInvalidToken` | Protected endpoints return 403 with an invalid token |
| `authRegister_shouldRejectBlankUsername` | Registration with blank username returns 400 |
| `authRegister_shouldRejectBlankPassword` | Registration with blank password returns 400 |
| `authRegister_shouldRejectInvalidRole` | Registration with invalid role (e.g., "HACKER") returns 400 |
| `authRegister_shouldRejectWeakPassword` | Registration with weak password returns 400 |

### DemeterBackendApplicationTests (1 test)

`@SpringBootTest` — Smoke test.

| Test Method | What It Verifies |
|-------------|-----------------|
| `contextLoads` | Spring application context loads successfully with all beans wired |

---

## 7. Frontend Test Suite

**55 tests** across 13 test files. All tests use Vitest with jsdom and React Testing Library.

### Test Infrastructure

- **Test runner:** Vitest (configured in `vite.config.js`)
- **DOM environment:** jsdom
- **Assertions:** `@testing-library/jest-dom` (custom matchers like `toBeInTheDocument`)
- **Setup file:** `src/test/setup.js` — imports jest-dom matchers and mocks `IntersectionObserver` (not available in jsdom)
- **API mocking:** Tests mock Axios calls and context providers
- **WebSocket mocking:** Tests mock the WebSocket client

### Context Tests

| File | Tests | What It Covers |
|------|-------|---------------|
| `contexts/__tests__/CartContext.test.jsx` | 6 | Empty cart state, adding items, removing items by index, clearing cart, auto-clear when switching cafeterias with toast notification, error when `useCart` is used outside `CartProvider` |
| `contexts/__tests__/WalletContext.test.jsx` | 6 | Fetches balance on mount for STUDENT role, skips fetch for non-STUDENT roles, local fund add/deduct, WebSocket subscription for real-time updates (STUDENT only), no WebSocket for non-STUDENT, error when `useWallet` is used outside `WalletProvider` |

### Page Tests

| File | Tests | What It Covers |
|------|-------|---------------|
| `auth/__tests__/Login.test.jsx` | 8 | Portal selector with three role options, login form after portal selection, back navigation, empty field validation, STUDENT/STAFF/ADMIN role routing after login, error message display on failure |
| `student/__tests__/StudentHome.test.jsx` | 5 | Welcome message with first name, cafeteria cards from API, fallback recommended items, fallback cafeterias on API failure, add-to-cart from recommended items |
| `student/__tests__/CafeMenu.test.jsx` | 3 | Menu items rendered from API, "Cafe not found" on API failure, cafe name in banner |
| `student/__tests__/Cart.test.jsx` | 3 | Empty cart message, cart items with title/quantity/total, API checkout and navigation to orders |
| `student/__tests__/Orders.test.jsx` | 4 | Empty state with no orders, order tracking with details, order items with resolved names and quantities, cancel button for PLACED orders |
| `student/__tests__/Wallet.test.jsx` | 3 | Current balance display, transaction history table with correct sign, empty message when no transactions |

### Component Tests

| File | Tests | What It Covers |
|------|-------|---------------|
| `components/common/__tests__/Navbar.test.jsx` | 4 | Title and logo rendering, wallet balance display, user initials from username, cart item count badge |
| `components/common/__tests__/ProtectedRoute.test.jsx` | 6 | Renders children when authenticated with correct role, redirects to /login when not authenticated, STUDENT blocked from ADMIN routes, ADMIN redirected from STUDENT routes, STAFF redirected from STUDENT routes, ADMIN allowed on STAFF routes when both roles permitted |
| `layouts/__tests__/StudentLayout.test.jsx` | 2 | Renders children and navbar when authenticated, correct navbar structure |
| `staff/__tests__/StaffDashboard.test.jsx` | 2 | Dashboard header and stat cards, queue list and discount suggestion components |
| `admin/__tests__/AdminConsole.test.jsx` | 3 | Admin console header and tabs, staff list from API, promotions tab navigation |

---

## 8. AI Service Test Suite

**49 tests** across 6 test classes. All tests use pytest with FastAPI's `TestClient` (httpx under the hood).

### Test Infrastructure

- **Test runner:** pytest
- **Client:** `fastapi.testclient.TestClient` — tests run against the app in-process, no running server needed
- **Rate limiting:** Disabled during tests (`limiter.enabled = False`)
- **API key:** Hardcoded test key `demeter-ai-service-key-2024`
- **Fixture:** Module-scoped `client` fixture creates a single `TestClient` for all tests

### TestHealthEndpoints (2 tests)

| Test Method | What It Verifies |
|-------------|-----------------|
| `test_root_returns_service_info` | `GET /` returns service name, status "running", and version |
| `test_health_check` | `GET /health` returns status "healthy" with a timestamp |

### TestAuthentication (4 tests)

| Test Method | What It Verifies |
|-------------|-----------------|
| `test_missing_api_key_returns_422` | Request without `X-API-Key` header returns 422 |
| `test_invalid_api_key_returns_401` | Wrong API key on recommendations returns 401 with "Invalid API Key" |
| `test_invalid_api_key_on_discounts` | Wrong API key on discounts returns 401 |
| `test_invalid_api_key_on_reviews` | Wrong API key on reviews returns 401 |

### TestRecommendations (12 tests)

| Test Method | What It Verifies |
|-------------|-----------------|
| `test_homepage_recommendations_for_known_user` | Known user gets up to `limit` recommendations with valid fields and model version |
| `test_homepage_recommendations_for_unknown_user` | Unknown user gets `CONTEXTUAL` (time-based) fallback recommendations |
| `test_cart_recommendations_filter_by_cafeteria` | Cart context filters recommendations to the specified cafeteria |
| `test_cart_without_cafeteria_id_returns_400` | Cart context without `cafeteria_id` returns 400 |
| `test_cart_with_invalid_cafeteria_id_returns_400` | Negative `cafeteria_id` returns 400 with "Invalid cafeteria_id" |
| `test_morning_time_bucket` | 8 AM request uses Morning time bucket in recommendation reasons |
| `test_lunch_time_bucket` | 12 PM request uses Lunch time bucket |
| `test_evening_time_bucket` | 7 PM request uses Evening time bucket |
| `test_limit_respected` | Response contains at most `limit` recommendations |
| `test_confidence_scores_are_descending` | Confidence scores are sorted in descending order |
| `test_known_user_gets_personalized_recommendations` | Known user receives at least one `PERSONALIZED` recommendation |
| `test_response_contains_generated_at` | Response includes a `generated_at` timestamp |

### TestDiscounts (13 tests)

| Test Method | What It Verifies |
|-------------|-----------------|
| `test_generate_discounts_cafeteria_1` | Cafeteria 1 returns discounts within limit with `generated_at` |
| `test_generate_discounts_cafeteria_2` | Cafeteria 2 returns discounts |
| `test_generate_discounts_cafeteria_3` | Cafeteria 3 returns discounts |
| `test_discount_types_are_valid` | All discount types are one of BOGO, COMBO, PERCENTAGE, FIXED_AMOUNT |
| `test_bogo_discounts_have_associated_item` | BOGO discounts have non-null `associated_item_id` and `suggested_value` of 100.0 |
| `test_combo_discounts_have_associated_item` | COMBO discounts have non-null `associated_item_id` |
| `test_percentage_discounts_no_associated_item` | PERCENTAGE discounts have null `associated_item_id` |
| `test_invalid_cafeteria_id_returns_400` | Negative cafeteria ID returns 400 |
| `test_limit_respected` | Response contains at most `limit` discounts |
| `test_no_duplicate_target_items_in_discounts` | No two discounts share the same `target_item_id` |
| `test_discount_priority_order` | Discounts are ordered by priority: BOGO < COMBO < PERCENTAGE |
| `test_no_discount_exceeds_10_percent` | PERCENTAGE and COMBO values are capped at 10% across all cafeterias |
| `test_cafeteria_0_returns_400` | Cafeteria ID of 0 returns 400 |

### TestReviewAnalysis (11 tests)

| Test Method | What It Verifies |
|-------------|-----------------|
| `test_positive_review` | Positive text with 5 stars returns POSITIVE sentiment, positive score, approved, high confidence, and keywords |
| `test_negative_review` | Negative text with 1 star returns NEGATIVE sentiment with negative score |
| `test_neutral_review` | Bland factual text returns near-zero sentiment score (-0.3 to 0.3) |
| `test_nonsense_review_flagged` | Gibberish text is not approved, has low confidence, and notes mention gibberish/nonsense |
| `test_star_sentiment_consistency_boosts_confidence` | Matching stars and sentiment produce higher confidence than mismatched |
| `test_negative_sentiment_with_high_stars_not_approved` | Contradictory review (negative text + 5 stars) is not auto-approved |
| `test_keywords_are_meaningful` | Extracted keywords do not include common stopwords |
| `test_sentiment_score_range` | Sentiment score is within -1.0 to 1.0 |
| `test_confidence_range` | Confidence is within 0.0 to 1.0 |
| `test_analysis_notes_contain_valid_ratio` | Analysis notes include "Valid English Ratio" |
| `test_negative_review_with_matching_low_stars_approved` | Consistent negative review (1 star + negative text) is still approved |

### TestRequestValidation (7 tests)

| Test Method | What It Verifies |
|-------------|-----------------|
| `test_recommendation_missing_user_id` | Missing `user_id` returns 422 |
| `test_recommendation_invalid_limit` | Limit of 0 returns 422 |
| `test_recommendation_limit_exceeds_max` | Limit of 11 (exceeds max 10) returns 422 |
| `test_discount_missing_cafeteria_id` | Missing `cafeteria_id` returns 422 |
| `test_review_missing_review_text` | Missing `review_text` returns 422 |
| `test_review_star_rating_out_of_range` | Star rating of 6 returns 422 |
| `test_review_star_rating_below_minimum` | Star rating of 0 returns 422 |

---

## 9. CI/CD Pipeline

GitHub Actions runs on every push and pull request to `main`. The workflow is defined in `.github/workflows/ci.yml`.

### Pipeline Structure

Three independent jobs run in parallel:

```
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│   backend    │  │   frontend   │  │  ai-service   │
│              │  │              │  │               │
│ Java 17     │  │ Node 20      │  │ Python 3.11   │
│ Maven cache │  │ npm cache    │  │ pip cache     │
│ mvn verify  │  │ lint + test  │  │ pytest        │
│ (67 tests)  │  │ + build      │  │ (49 tests)    │
│             │  │ (55 tests)   │  │               │
└─────────────┘  └──────────────┘  └──────────────┘
```

### Backend Job

1. Checkout code
2. Set up Java 17 (Eclipse Temurin) with Maven cache
3. `cd backend && mvn clean verify` — compiles, runs 67 tests with H2 in-memory database, packages

No external database required. Tests use H2 configured in `src/test/resources/application.properties`.

### Frontend Job

1. Checkout code
2. Set up Node 20 with npm cache
3. `npm ci` — clean install from lockfile
4. `npm run lint` — ESLint check
5. `npx vitest run` — runs 55 tests with jsdom
6. `npm run build` — production build (verifies no build errors)

### AI Service Job

1. Checkout code
2. Set up Python 3.11 with pip cache
3. `pip install -r requirements.txt`
4. Download NLTK data (vader_lexicon, punkt, punkt_tab, stopwords, words)
5. `python -m pytest tests/test_endpoints.py -v` — runs 49 tests

---

## 10. How to Run Tests

### Backend

```bash
cd backend

# Run all 67 tests
mvn test

# Run a single test class
mvn test -Dtest=AuthServiceTest

# Run a single test method
mvn test -Dtest=AuthServiceTest#login_withValidCredentials_shouldReturnLoginResponseDTO

# Run with verbose output
mvn test -Dsurefire.useFile=false
```

### Frontend

```bash
cd frontend/demeter-frontend

# Run all 55 tests
npx vitest run

# Run with verbose output
npx vitest run --reporter=verbose

# Run a specific test file
npx vitest run src/auth/__tests__/Login.test.jsx

# Run in watch mode (re-runs on file changes)
npx vitest
```

### AI Service

```bash
cd ai-service
source venv/bin/activate

# Run all 49 tests
python -m pytest tests/ -v

# Run a specific test class
python -m pytest tests/test_endpoints.py::TestRecommendations -v

# Run a specific test
python -m pytest tests/test_endpoints.py::TestRecommendations::test_homepage_recommendations_for_known_user -v
```

### All Together

CI runs all three automatically on every push/PR. To run everything locally:

```bash
# Terminal 1 — Backend
cd backend && mvn test

# Terminal 2 — Frontend
cd frontend/demeter-frontend && npx vitest run

# Terminal 3 — AI Service
cd ai-service && source venv/bin/activate && python -m pytest tests/ -v
```

---

## 11. Swagger / OpenAPI

Interactive API documentation is available via SpringDoc OpenAPI.

### Accessing Swagger UI

With the backend running:

```
http://localhost:8080/swagger-ui.html
```

This provides:
- Full list of all endpoints with request/response schemas
- Interactive "Try it out" functionality for testing endpoints
- JWT authentication support (click "Authorize" and enter `Bearer <token>`)

### Configuration

Swagger is enabled by default. Controlled by the environment variable:

```bash
# Enable (default)
SPRINGDOC_API_DOCS_ENABLED=true

# Disable for production
SPRINGDOC_API_DOCS_ENABLED=false
```

During tests, Swagger is disabled via `springdoc.api-docs.enabled=false` in `src/test/resources/application.properties` to avoid startup conflicts.
