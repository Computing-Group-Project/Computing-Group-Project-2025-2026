# Demeter Backend — Spring Boot REST API

The backend service for the Demeter Smart Cafeteria System. Provides a REST API for managing cafeteria operations at Bastion University: authentication, menu browsing, order placement with real-time WebSocket updates, Gold Krakens wallet payments, reviews with AI sentiment analysis, staff order management, admin analytics, and audit logging.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Directory Structure](#directory-structure)
3. [How to Run](#how-to-run)
4. [Configuration](#configuration)
5. [Database](#database)
6. [API Endpoints](#api-endpoints)
7. [Authentication and Authorization](#authentication-and-authorization)
8. [Key Patterns](#key-patterns)
9. [WebSocket](#websocket)
10. [Image Upload](#image-upload)
11. [Testing](#testing)
12. [Docker](#docker)
13. [Known Gotchas](#known-gotchas)

---

## Tech Stack

| Component | Version | Purpose |
|---|---|---|
| Java | 17 | Language runtime |
| Spring Boot | 3.5.10 | Application framework |
| Maven | 3.9+ | Build and dependency management |
| MySQL | 8.0 | Production database |
| H2 | (test scope) | In-memory database for tests |
| Spring Security | 6.x | Authentication, authorization, CORS, rate limiting |
| Spring WebSocket | — | SockJS + STOMP for real-time updates |
| SpringDoc OpenAPI | — | Swagger UI at `/swagger-ui.html` |
| Lombok | — | Boilerplate reduction (`@Getter`, `@Setter`, `@Data`, `@Builder`) |
| ModelMapper | — | Entity-to-DTO conversion |
| spring-boot-starter-validation | — | `@Valid`, `@NotBlank`, `@Size` input validation |

---

## Directory Structure

Each domain module follows a layered pattern: `controller/` -> `service/` -> `repository/` -> `model/` with `dto/` for request/response objects.

```
backend/
├── src/main/java/com/demeter/backend/
│   ├── DemeterBackendApplication.java          # Spring Boot entry point
│   │
│   ├── ai/                                     # AI service integration
│   │   ├── client/                             # REST client for the Python AI service
│   │   ├── config/                             # AI service connection config
│   │   ├── controller/                         # AI-related endpoints (discounts, recommendations)
│   │   ├── dto/                                # AI request/response DTOs
│   │   │   ├── Discount/                       # Discount generation DTOs
│   │   │   ├── Recommendation/                 # Recommendation DTOs
│   │   │   └── Review/                         # Review analysis DTOs
│   │   ├── enums/                              # AI-specific enums
│   │   ├── exception/                          # AI service exceptions
│   │   └── Service/impl/                       # AI service orchestration logic
│   │
│   ├── analytics/                              # Admin analytics and reporting
│   │   ├── controller/                         # Dashboard, revenue, CSV export endpoints
│   │   ├── dto/                                # Analytics response DTOs
│   │   └── service/                            # Data aggregation logic
│   │
│   ├── audit/                                  # Audit logging (AOP-based)
│   │   ├── controller/                         # GET /api/admin/audit endpoint
│   │   ├── model/                              # AuditLog entity
│   │   └── repo/                               # AuditLog repository
│   │
│   ├── auth/                                   # Authentication and registration
│   │   ├── controller/                         # Login, register endpoints
│   │   ├── dto/
│   │   │   ├── request/                        # LoginRequest, RegisterRequest
│   │   │   └── response/                       # LoginResponseDTO
│   │   └── service/                            # AuthService (password validation, JWT issuing)
│   │
│   ├── cafeteria/                              # Cafeteria management
│   │   ├── controller/                         # GET cafeterias
│   │   ├── model/                              # Cafeteria entity
│   │   ├── repo/                               # CafeteriaRepository
│   │   └── service/                            # CafeteriaService
│   │
│   ├── config/                                 # Cross-cutting configuration
│   │   ├── security/                           # SecurityConfig, JwtUtil, JwtAuthFilter, RateLimitingFilter
│   │   └── swagger/                            # SpringDoc/OpenAPI configuration
│   │
│   ├── image/                                  # Image upload and storage
│   │   ├── config/                             # AppProperties (uploads-dir, max-file-bytes, base-url)
│   │   ├── controller/                         # POST /api/images/upload
│   │   ├── dto/
│   │   │   ├── request/                        # ImageUploadRequest
│   │   │   └── response/                       # ImageUploadResponse
│   │   ├── exception/                          # InvalidFileException, StorageException
│   │   ├── service/                            # ImageService, ImageStorageService (+ impls)
│   │   └── util/                               # FileValidationUtil (magic bytes), ImageUrlBuilder
│   │
│   ├── menu/                                   # Menu item management
│   │   ├── controller/                         # CRUD endpoints for menu items + categories
│   │   ├── dto/                                # Menu DTOs
│   │   ├── model/                              # Menu, Category, MenuItemCustomization, MenuItemTag entities
│   │   ├── repo/                               # Menu, Category repositories
│   │   └── service/                            # MenuService (CRUD, availability toggle)
│   │
│   ├── orders/                                 # Order lifecycle management
│   │   ├── controller/                         # Place order, update status, list orders
│   │   ├── dto/                                # OrderRequest, OrderResponse DTOs
│   │   ├── model/                              # Order, OrderItem, OrderCustomization entities
│   │   ├── repo/                               # Order, OrderItem repositories
│   │   └── service/                            # OrderService (state machine, wallet debit/refund, WebSocket)
│   │
│   ├── payments/                               # Payment records
│   │   ├── model/                              # Payment entity
│   │   └── repo/                               # PaymentRepository
│   │
│   ├── promotions/                             # Discount/promotion management
│   │   ├── controller/                         # CRUD + approve/reject/deactivate endpoints
│   │   ├── dto/                                # Discount DTOs
│   │   ├── model/                              # Discount entity
│   │   ├── repo/                               # DiscountRepository
│   │   └── service/                            # DiscountService (create, approve, reject, deactivate)
│   │
│   ├── recommendations/                        # Recommendation persistence
│   │   ├── model/                              # Recommendation entity (User <-> MenuItem M:N)
│   │   └── repo/                               # RecommendationRepository
│   │
│   ├── reviews/                                # Review and rating system
│   │   ├── controller/                         # Submit/list reviews
│   │   ├── dto/                                # ReviewRequestDTO (1-5 stars, max 200 chars)
│   │   ├── model/                              # Review entity
│   │   ├── repo/                               # ReviewRepository
│   │   └── service/                            # ReviewService (1-hour window, duplicate check, 5 GK reward)
│   │
│   ├── shared/                                 # Cross-module shared code
│   │   ├── constants/                          # Application-wide constants
│   │   ├── dto/response/                       # ApiResponse<T>, ErrorResponse
│   │   ├── enums/                              # OrderStatus, ErrorCode, DiscountType
│   │   ├── exception/                          # AppException, GlobalExceptionHandler
│   │   └── util/                               # AuditLogAspect (@LogActivity AOP), shared utilities
│   │
│   ├── transactions/                           # Wallet transaction history
│   │   ├── model/                              # TransactionHistory entity
│   │   └── repo/                               # TransactionHistoryRepository
│   │
│   ├── users/                                  # User management
│   │   ├── controller/                         # Admin user CRUD, staff creation
│   │   ├── dto/response/                       # User response DTOs
│   │   ├── model/                              # User entity (with Student/Staff subtypes)
│   │   ├── repo/                               # UserRepository, StudentRepository
│   │   └── service/                            # UserService (admin operations)
│   │
│   ├── wallet/                                 # Gold Krakens wallet system
│   │   ├── controller/                         # Balance, transactions, top-up, topup-request endpoints
│   │   ├── dto/                                # PendingTopUp (in-memory DTO, not a JPA entity)
│   │   │   ├── request/                        # TopUpRequest, StudentTopUpRequest
│   │   │   └── response/                       # WalletResponse, TransactionResponse
│   │   └── service/                            # KrakensWalletService (debit, credit, pessimistic lock), TopUpRequestService (ConcurrentHashMap, approve/reject)
│   │
│   └── ws/                                     # WebSocket configuration
│       └── WebSocketConfig.java                # SockJS + STOMP broker, JWT auth on CONNECT
│
├── src/main/resources/
│   └── application.yml                         # All configuration (DB, JWT, AI, uploads, Swagger)
│
├── src/test/java/com/demeter/backend/          # Test classes (H2, 67 tests)
├── src/test/resources/
│   └── application.properties                  # H2 config for tests
│
├── Dockerfile                                  # Multi-stage build
└── pom.xml                                     # Maven dependencies
```

---

## How to Run

### Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8.0 running on `localhost:3306` with a database named `demeter_db`
- Schema and seed data loaded (see [Database](#database))

### Build

```bash
cd backend
mvn clean install        # Compile, run tests, package JAR
```

### Run (dev profile)

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The server starts on **port 8080**. Swagger UI is available at `http://localhost:8080/swagger-ui.html`.

### Run tests

```bash
mvn test                           # All 67 tests (uses H2, no MySQL needed)
mvn test -Dtest=AuthServiceTest    # Single test class
mvn test -Dtest=AuthServiceTest#testLogin  # Single test method
```

---

## Configuration

All configuration lives in `src/main/resources/application.yml`. Most values are overridable via environment variables.

| Environment Variable | Default | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/demeter_db` | JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | `root` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | *(none)* | Database password |
| `JWT_SECRET` | *(required)* | JWT signing key, must be 32+ characters |
| `DEMETER_AI_BASE_URL` | `http://localhost:8001` | Python AI service base URL |
| `DEMETER_AI_API_KEY` | *(required)* | API key for AI service authentication |
| `SPRINGDOC_API_DOCS_ENABLED` | `true` | Enable/disable Swagger UI (set `false` in production) |

The following are configured directly in `application.yml` (not environment-overridden):

| Property | Value | Description |
|---|---|---|
| `jwt.expiration-ms` | `7200000` | JWT token expiry (2 hours) |
| `app.uploads-dir` | `uploads` | Directory for uploaded images |
| `app.max-file-bytes` | `5242880` | Max upload file size (5 MB) |
| `app.base-url` | `http://localhost:8080` | Base URL for constructing image URLs |
| `wallet.micro.max-amount` | `500` | Maximum amount for student self-service top-up |
| `spring.servlet.multipart.max-file-size` | `5MB` | Spring multipart upload limit |
| `spring.servlet.multipart.max-request-size` | `5MB` | Spring multipart request limit |

---

## Database

### Production: MySQL 8.0

The schema and seed data are managed via SQL files in the `database/` directory at the project root:

```bash
# Load schema first, then seed data
mysql -u root -p demeter_db < database/schema.sql
mysql -u root -p demeter_db < database/data.sql
```

Hibernate is configured with `ddl-auto: none` -- the schema is managed entirely by SQL files, not auto-generated. The naming strategy is `PhysicalNamingStrategyStandardImpl`, meaning Hibernate uses entity field names as-is (see [Known Gotchas](#known-gotchas)).

### Seed data credentials

All seed users share the password `pass` (bcrypt hash with `$2b$` prefix).

| Role | Usernames | Notes |
|---|---|---|
| STUDENT | `garen`, `lux`, `fiora`, etc. | University IDs: `BU-10001`, `BU-10002`, ... Can log in with username OR university ID |
| STAFF | `swain` (The Last Drop), `jayce`/`heimerdinger` (Hex Core), `viktor` (Skyline Sips) | Each assigned to a cafeteria |
| ADMIN | `admin_user` | Full system access |

### Tests: H2 In-Memory

Tests use H2 with `ddl-auto: create-drop` (configured in `src/test/resources/application.properties`). No external database is needed to run the test suite.

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
```

---

## API Endpoints

All endpoints are prefixed with `/api/`. Responses use the standard `ApiResponse<T>` wrapper:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses use `ErrorResponse`:

```json
{
  "errorCode": "ORDER_NOT_FOUND",
  "message": "Order not found",
  "status": 404,
  "timestamp": "2026-03-19T10:30:00"
}
```

### Public Endpoints (no auth required)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new student account |
| `POST` | `/api/auth/login` | Login, returns JWT token + user details |
| `GET` | `/api/cafeterias` | List all cafeterias |
| `GET` | `/api/cafeterias/{id}` | Get cafeteria by ID |
| `GET` | `/api/menus/cafeteria/{cafeteriaId}` | List menu items for a cafeteria |
| `GET` | `/api/menus/{id}` | Get a single menu item |
| `GET` | `/api/categories` | List all menu categories |
| `GET` | `/api/health` | Health check |

### Authenticated Endpoints (any role)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/recommendations` | AI-powered menu recommendations. Query params: `cafeteriaId`, `context`, `limit` |
| `POST` | `/api/reviews` | Submit a review (1-5 stars, optional text, 1-hour window after order completion) |
| `GET` | `/api/reviews/cafeteria/{id}` | List reviews for a cafeteria |
| `GET` | `/api/reviews/user/{userId}` | List reviews by a user |
| `GET` | `/api/wallet/balance` | Get current Gold Krakens balance |
| `GET` | `/api/wallet/transactions` | Get transaction history |
| `POST` | `/api/images/upload` | Upload an image (JPEG/PNG, max 5 MB). Query params: `folder`, `oldPath` |

### Student Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/orders` | Place a new order (debits wallet) |
| `GET` | `/api/orders/user/{userId}` | List orders for a user |
| `POST` | `/api/wallet/student-topup` | Submit a wallet top-up request (max 500 GK, creates pending request — no instant credit) |

### Staff/Admin Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/orders/cafeteria/{id}` | List orders for a cafeteria. Query param: `activeOnly=true` |
| `GET` | `/api/orders` | List all orders |
| `PUT` | `/api/orders/{id}/status` | Update order status. Query param: `status=CONFIRMED\|PREPARING\|READY\|COMPLETED\|CANCELLED` |
| `POST` | `/api/menus/{categoryId}` | Create a menu item |
| `PUT` | `/api/menus/{id}` | Update a menu item |
| `PUT` | `/api/menus/{id}/availability` | Toggle menu item availability |
| `DELETE` | `/api/menus/{id}` | Delete a menu item |
| `POST` | `/api/ai/discounts/generate/{cafeteriaId}` | Generate AI discount suggestions |

### Discount Management (staff/admin)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/discounts` | List all discounts |
| `GET` | `/api/discounts/active` | List active discounts |
| `GET` | `/api/discounts/pending` | List pending (unapproved) discounts |
| `POST` | `/api/discounts` | Create a discount |
| `PUT` | `/api/discounts/{id}` | Update a discount |
| `DELETE` | `/api/discounts/{id}` | Delete a discount |
| `PUT` | `/api/discounts/{id}/approve` | Approve a pending discount |
| `PUT` | `/api/discounts/{id}/reject` | Reject a pending discount |
| `PUT` | `/api/discounts/{id}/deactivate` | Deactivate an active discount |

### Admin-Only Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List users. Query param: `role=STAFF\|STUDENT` |
| `POST` | `/api/admin/staff` | Create a staff account |
| `DELETE` | `/api/admin/users/{id}` | Delete a user |
| `GET` | `/api/admin/analytics/dashboard` | Dashboard analytics. Query params: `period`, `startDate`, `endDate` |
| `GET` | `/api/admin/analytics/revenue` | Revenue analytics. Query params: `period`, `startDate`, `endDate` |
| `GET` | `/api/admin/analytics/export` | Export analytics as CSV. Query param: `period` |
| `GET` | `/api/admin/audit` | View audit log entries |
| `POST` | `/api/wallet/topup` | Admin direct wallet top-up for any user (instant credit) |
| `GET` | `/api/wallet/topup-requests` | List all pending student top-up requests |
| `PUT` | `/api/wallet/topup-requests/{id}/approve` | Approve a pending top-up request (credits wallet, notifies student) |
| `PUT` | `/api/wallet/topup-requests/{id}/reject` | Reject a pending top-up request |

---

## Authentication and Authorization

### JWT Flow

1. Client sends `POST /api/auth/login` with `{ username, password }` (students can also use their university ID as the username).
2. Backend validates credentials, returns `ApiResponse<LoginResponseDTO>` containing:
   - `token` -- JWT string
   - `userId`, `username`, `role`, `assignedCafeteriaId`
3. Client stores the token and includes it in subsequent requests via the `Authorization: Bearer <token>` header.
4. `JwtAuthFilter` extracts and validates the token on every request, setting the Spring Security context.
5. Tokens expire after **2 hours** (7,200,000 ms).

### JWT secret

The `JWT_SECRET` environment variable is **required** and must be at least 32 characters. There is no default -- the application will fail to start without it.

### Role-Based Access

Three roles: `STUDENT`, `STAFF`, `ADMIN`. Access control is enforced via `@PreAuthorize` annotations on controllers:

```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/api/admin/users")
public ApiResponse<List<UserDTO>> listUsers(...) { ... }

@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
@PutMapping("/api/orders/{id}/status")
public ApiResponse<OrderDTO> updateStatus(...) { ... }
```

### Rate Limiting

`RateLimitingFilter` enforces **60 requests per minute per IP** using a sliding window implemented with `ConcurrentHashMap`. When exceeded, the filter returns HTTP 429 with an `ErrorResponse` containing `ErrorCode.RATE_LIMITED`.

### CORS

Allowed origins (configured in `SecurityConfig`):
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Docker frontend)
- `https://localhost`, `http://localhost`
- `https://localhost:3443` (Docker HTTPS frontend)

Pattern `/**` is used to support WebSocket endpoints alongside REST.

---

## Key Patterns

### Response Wrappers

All successful responses are wrapped in `ApiResponse<T>`:

```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
```

All error responses use `ErrorResponse`:

```java
public class ErrorResponse {
    private String errorCode;
    private String message;
    private int status;
    private LocalDateTime timestamp;
}
```

### Structured Error Handling

All services throw `AppException` with an `ErrorCode` enum value (never raw `RuntimeException`). The `GlobalExceptionHandler` (`@RestControllerAdvice`) catches:

- `AppException` -- maps `ErrorCode` to HTTP status and message
- `MethodArgumentNotValidException` -- extracts `@Valid` field errors
- `Exception` -- generic 500 fallback

Available error codes:

| ErrorCode | HTTP Status | Description |
|---|---|---|
| `ORDER_NOT_FOUND` | 404 | Order does not exist |
| `MENU_NOT_FOUND` | 404 | Menu item does not exist |
| `CATEGORY_NOT_FOUND` | 404 | Category does not exist |
| `USER_NOT_FOUND` | 404 | User does not exist |
| `DISCOUNT_NOT_FOUND` | 404 | Discount does not exist |
| `REVIEW_NOT_FOUND` | 404 | Review does not exist |
| `CAFETERIA_NOT_FOUND` | 404 | Cafeteria does not exist |
| `INVALID_CREDENTIALS` | 401 | Wrong username or password |
| `UNAUTHORIZED_ACCESS` | 403 | Role-based access denied |
| `WEAK_PASSWORD` | 400 | Registration password too weak (8+ chars, letters + numbers) |
| `BAD_REQUEST` | 400 | Generic bad request |
| `VALIDATION_FAILED` | 400 | `@Valid` constraint violation |
| `INSUFFICIENT_BALANCE` | 400 | Not enough Gold Krakens |
| `REVIEW_ALREADY_EXISTS` | 409 | Duplicate review for same order |
| `REVIEW_WINDOW_EXPIRED` | 400 | Past the 1-hour review window |
| `ORDER_CANNOT_BE_CANCELLED` | 400 | Order past the cancellable state |
| `INVALID_ORDER_TRANSITION` | 400 | Invalid state machine transition |
| `TOPUP_REQUEST_NOT_FOUND` | 404 | Top-up request not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `AI_SERVICE_UNAVAILABLE` | 503 | AI service unreachable |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### AOP Audit Logging (`@LogActivity`)

A custom `@LogActivity` annotation combined with `AuditLogAspect` provides automatic audit logging. The aspect extracts the `userId` from the JWT token (or from `LoginResponseDTO` for login events) and writes an `AuditLog` entry with action type, target table, old/new values, IP address, and status.

**22 annotated methods across 8 services:**

| Service | Annotated Methods | Count |
|---|---|---|
| `DiscountService` | create, update, delete, approve, reject, deactivate, (+ 1 more) | 7 |
| `MenuService` | create, update, delete, toggleAvailability | 4 |
| `AuthService` | register, login | 2 |
| `OrderService` | placeOrder, updateStatus | 2 |
| `UserService` | createStaff, deleteUser | 2 |
| `KrakensWalletService` | debit, credit | 2 |
| `TopUpRequestService` | approveRequest, rejectRequest | 2 |
| `ReviewService` | submitReview | 1 |

### Order State Machine

`OrderStatus` is an enum with a static `isValidTransition(from, to)` method enforcing these transitions:

```
PLACED ──────> CONFIRMED ──────> PREPARING ──────> READY ──────> COMPLETED
  │               │
  └──> CANCELLED <─┘
```

- `PLACED` -> `CONFIRMED` or `CANCELLED`
- `CONFIRMED` -> `PREPARING` or `CANCELLED`
- `PREPARING` -> `READY`
- `READY` -> `COMPLETED`
- `COMPLETED` and `CANCELLED` are terminal (no outbound transitions)

When an order is cancelled, `OrderService` automatically issues a wallet refund via `KrakensWalletService.credit()` and creates a `REFUND` Payment record.

### Pessimistic Locking on Wallet

Wallet operations (`debit`, `credit`) use `@Lock(LockModeType.PESSIMISTIC_WRITE)` on the repository query to prevent race conditions when concurrent requests modify the same user's balance.

### ModelMapper

Entity-to-DTO conversion uses ModelMapper throughout. Configured as a Spring Bean and injected where needed.

### Lombok

All entity classes use Lombok annotations (`@Getter`, `@Setter`, `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`). Do not write manual getters/setters.

---

## WebSocket

Real-time order updates use **SockJS + STOMP** over WebSocket.

### Configuration (`WebSocketConfig.java`)

- **STOMP endpoint:** `/ws` (with SockJS fallback)
- **Message broker prefixes:** `/topic` (broadcast), `/queue` (user-specific)
- **Application destination prefix:** `/app`
- **User destination prefix:** `/user`
- **Allowed origins:** `http://localhost:5173`, `http://localhost:3000`

### JWT Authentication

The WebSocket CONNECT frame is authenticated via a `ChannelInterceptor` that extracts the JWT from the `Authorization` header, validates it, and sets the `StompHeaderAccessor.user` principal. This enables `sendToUser()` for user-specific notifications.

### Topics

| Destination | Type | Purpose |
|---|---|---|
| `/topic/staff` | Broadcast | New order placed -- notifies staff dashboard |
| `/topic/orders` | Broadcast | Order status changed -- notifies all subscribers |
| `/topic/admin` | Broadcast | Admin-relevant events (e.g., new top-up requests) |
| `/user/{username}/queue/notifications` | User-specific | Targeted notification (order status changes, top-up approval/rejection via `sendToUser()`) |

### Frontend Integration

The frontend connects via `SockJS` client and subscribes to relevant topics. The `NotificationBell` component in the student Navbar provides a persistent notification center with unread count badge and dropdown history.

---

## Image Upload

### Endpoint

`POST /api/images/upload` (authenticated, any role)

Query parameters:
- `folder` -- subdirectory within the uploads directory (sanitized to `[a-z0-9_-]` only)
- `oldPath` -- relative path of a previous image to replace (optional)

### Validation Pipeline (`FileValidationUtil`)

1. **Size check** -- rejects files larger than 5 MB (`app.max-file-bytes`)
2. **Content-Type check** -- allows only `image/jpeg` and `image/png`
3. **Magic bytes check** -- verifies the file header matches the declared content type:
   - JPEG: first 3 bytes must be `FF D8 FF`
   - PNG: first 8 bytes must be `89 50 4E 47 0D 0A 1A 0A`

### Security

- **Path traversal protection** -- folder names are sanitized (only `[a-z0-9_-]` allowed), and resolved paths are checked against the uploads root via `Path.startsWith()`
- **UUID filenames** -- uploaded files are saved with `UUID.randomUUID()` + detected extension, preventing filename-based attacks
- **Delete protection** -- the `deleteByRelativePath` method also validates the resolved path stays within the uploads root

### Response

```json
{
  "relativePath": "menus/550e8400-e29b-41d4-a716-446655440000.jpg",
  "url": "http://localhost:8080/uploads/menus/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

---

## Testing

67 tests across 9 test classes. All tests use H2 in-memory database -- no MySQL required.

### Test Classes

| Class | Count | What It Covers |
|---|---|---|
| `auth/AuthServiceTest` | 9 | Registration validation, password strength enforcement, login flows (username + university ID), duplicate username rejection |
| `orders/OrderServiceTest` | 11 | Place order with wallet debit, status updates through full lifecycle, cancellation with auto-refund, invalid state transition rejection |
| `menu/MenuServiceTest` | 6 | CRUD operations, category validation, availability toggle |
| `promotions/DiscountServiceTest` | 13 | Create, approve, reject, deactivate, activate discounts, validation edge cases |
| `wallet/KrakensWalletServiceTest` | 6 | Balance check, debit, credit, insufficient balance rejection, transaction history recording |
| `wallet/TopUpRequestServiceTest` | 7 | Submit top-up request, approve (credits wallet + sends notification), reject, list pending, not-found handling |
| `config/security/JwtUtilTest` | 7 | Token generation, username/role extraction, expiry validation |
| `config/security/SecurityConfigTest` | 7 | Endpoint access control (public vs protected), input validation via MockMvc, weak password rejection on register |
| `DemeterBackendApplicationTests` | 1 | Spring context loads successfully |

### Running Tests

```bash
cd backend
mvn test                                    # All tests
mvn test -Dtest=OrderServiceTest            # One class
mvn test -Dtest=JwtUtilTest#testTokenGen    # One method
```

### Test Configuration

`src/test/resources/application.properties` overrides the main config:
- H2 in-memory database with `create-drop`
- Swagger disabled
- Fixed JWT secret for deterministic tests
- 1-hour token expiry

---

## Docker

The backend uses a **multi-stage Dockerfile**:

### Stage 1: Build

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B     # Cache dependencies
COPY src ./src
RUN mvn package -DskipTests -B       # Build JAR (tests skipped -- run in CI)
```

### Stage 2: Run

```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

The dependency-caching step (`mvn dependency:go-offline`) means rebuilds only re-download dependencies when `pom.xml` changes.

### Docker Compose

In the project-root `docker-compose.yml`, the backend service:
- Depends on MySQL (waits for health check) and the AI service
- Receives environment variables for DB credentials, JWT secret, and AI service connection
- Exposes port 8080 (HTTP only -- TLS is terminated at the Nginx frontend proxy)

---

## Known Gotchas

### PhysicalNamingStrategyStandardImpl

Hibernate is configured with `PhysicalNamingStrategyStandardImpl`, which means it does **NOT** auto-convert camelCase field names to snake_case column names. Every entity field that maps to a snake_case database column **must** have an explicit `@Column(name = "...")` annotation:

```java
// CORRECT
@Column(name = "krakens_balance")
private BigDecimal krakensBalance;

// WRONG -- Hibernate will look for a column literally named "krakensBalance"
private BigDecimal krakensBalance;
```

### Reserved Words in Table Names

`User` and `Order` are MySQL reserved words. Their `@Table` annotations escape the names with backticks:

```java
@Table(name = "`User`")
public class User { ... }

@Table(name = "`Order`")
public class Order { ... }
```

### `$2b$` BCrypt Prefix

Seed data passwords use the `$2b$` prefix (Python bcrypt convention) instead of the Java-standard `$2a$`. Spring's `BCryptPasswordEncoder` handles both prefixes correctly -- no special handling needed.

### Password Validation on Registration Only

The `validatePasswordStrength` check (8+ chars, mix of letters and numbers) only runs during registration (`AuthService.register()`). Login accepts any stored password, which is why seed users can log in with the 4-character password `pass`.

### `@JsonIgnore` Locations

To prevent circular JSON serialization, `@JsonIgnore` is applied on:
- `OrderItem.order` -- breaks Order -> OrderItem -> Order cycle
- `MenuItemCustomization.menu` -- breaks Menu -> Customization -> Menu cycle
- `MenuItemTag.menu` -- breaks Menu -> Tag -> Menu cycle
- `OrderCustomization.orderItem` -- breaks OrderItem -> Customization -> OrderItem cycle
- `Category.menus` -- prevents loading all menus when serializing a category

### Swagger Disabled in Tests

`springdoc.api-docs.enabled=false` is set in the test `application.properties` to avoid startup conflicts with the H2 test context.
