# Demeter Database Module

MySQL 8 database for the Demeter Smart Cafeteria System. The schema is fully managed via SQL files — Hibernate is configured with `ddl-auto: none`, meaning the application never auto-generates or modifies tables. All DDL lives in `schema.sql` and all seed data in `data.sql`.

---

## Table of Contents

1. [Files](#files)
2. [How to Load](#how-to-load)
3. [Entity-Relationship Diagram](#entity-relationship-diagram)
4. [Table Details](#table-details)
5. [Key Relationships](#key-relationships)
6. [Indexes](#indexes)
7. [Seed Data](#seed-data)
8. [User Roles](#user-roles)
9. [Gold Krakens Wallet](#gold-krakens-wallet)
10. [Order Lifecycle](#order-lifecycle)
11. [Backup and Recovery](#backup-and-recovery)
12. [Known Gotchas](#known-gotchas)

---

## Files

| File | Purpose | Contents |
|---|---|---|
| `schema.sql` | DDL — table definitions and indexes | 19 `CREATE TABLE` statements + 11 performance indexes |
| `data.sql` | DML — seed data and synthetic order generation | Categories, cafeterias, users, menu items, tags, orders (via stored procedure), reviews, discounts, payments, audit log, transaction history |

**Load order matters.** `schema.sql` must be loaded before `data.sql` because the seed data references tables and foreign keys defined in the schema.

---

## How to Load

### Fresh installation

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS demeter_db;"

# Load schema (DDL)
mysql -u root -p demeter_db < database/schema.sql

# Load seed data (DML) — takes ~10 seconds due to stored procedure generating 2000 orders
mysql -u root -p demeter_db < database/data.sql
```

### Reset and reload

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS demeter_db; CREATE DATABASE demeter_db;"
mysql -u root -p demeter_db < database/schema.sql
mysql -u root -p demeter_db < database/data.sql
```

### Via Docker Compose

The `docker-compose.yml` in the project root auto-initializes the database. MySQL's Docker entrypoint runs all `.sql` files in `/docker-entrypoint-initdb.d/` alphabetically on first start. The compose file mounts `schema.sql` and `data.sql` into that directory.

---

## Entity-Relationship Diagram

The database contains **19 entities** organized into three categories:

### Strong Entities (11)

| Entity | Table Name | Description |
|---|---|---|
| **User** | `` `User` `` | Base user table with username, role (STUDENT/STAFF/ADMIN), password hash, Gold Krakens balance. Supertype with disjoint subtypes. |
| **Student** | `Student` | Subtype of User. Adds `dietary_preferences` and `university_id` (format `BU-1XXXX`). |
| **Staff** | `Staff` | Subtype of User. Adds `assigned_cafeteria_id` linking staff to their cafeteria. |
| **Admin** | `Admin` | Subtype of User. No additional attributes — exists to enforce the disjoint subtype constraint. |
| **Cafeteria** | `Cafeteria` | Campus cafeteria with name, description, operating hours, average rating, and review count. |
| **MenuItem** | `MenuItem` | Food/drink item belonging to one cafeteria and one category. Tracks price, preparation time, and availability. |
| **Category** | `Category` | Menu item classification (Healthy/Vegan, Fast Food, Breakfast, Beverages, Desserts). |
| **Tag** | `Tag` | Dietary/flavor labels (Spicy, Vegan, Gluten-Free, High-Protein, Sugar-Free) with a `tag_type` discriminator. |
| **Order** | `` `Order` `` | A student's order at a specific cafeteria. Tracks status through a 6-state lifecycle, timestamps for placement/confirmation/completion. |
| **Payment** | `Payment` | Payment record for an order. 1:1 with Order (enforced by `UNIQUE KEY` on `order_id`). Tracks transaction type, method, and status. |
| **Review** | `Review` | Student review of a cafeteria tied to a specific order. 1:1 with Order. Includes star rating (1-5), optional text, AI sentiment score, extracted keywords, and a 1-hour submission window (`expires_at`). |
| **Discount** | `Discount` | Promotional discount for a cafeteria. Can be AI-generated or manual, active or pending approval (`approved_by IS NULL`). |
| **AuditLog** | `AuditLog` | Immutable record of administrative actions — price changes, availability toggles, discount operations, login attempts. |
| **TransactionHistory** | `TransactionHistory` | Wallet transaction ledger — deposits, debits, refunds. Records balance before/after for auditability. |

### Associative Entities (3)

These resolve many-to-many relationships:

| Entity | Table Name | Resolves |
|---|---|---|
| **Recommendation** | `Recommendation` | M:N between User and MenuItem. AI-generated item suggestions with confidence scores, recommendation type, and click tracking. |
| **OrderItem** | `OrderItem` | M:N between Order and MenuItem. Each row is one line item with quantity, unit price, and subtotal. |
| **MenuItemTag** | `MenuItemTag` | M:N between MenuItem and Tag. Links dietary/flavor tags to menu items. |

### Weak Entities (2)

These depend on their parent entity for identification:

| Entity | Table Name | Owner | Description |
|---|---|---|---|
| **OrderCustomization** | `OrderCustomization` | OrderItem | Customization applied to a specific order line item (e.g., "Extra Cheese +15 GK"). Tracks price adjustment only. |
| **MenuItemCustomization** | `MenuItemCustomization` | MenuItem | Available customization option for a menu item. Defines ingredient name, modification type (ADD/REMOVE/SUBSTITUTE/MODIFICATION), price adjustment, and availability. |

---

## Table Details

### Category

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `category_id` | INT | PK, AUTO_INCREMENT | |
| `name` | VARCHAR(100) | NOT NULL | Healthy/Vegan, Fast Food, Breakfast, Beverages, Desserts |
| `description` | TEXT | | |

### Tag

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `tag_id` | INT | PK, AUTO_INCREMENT | |
| `name` | VARCHAR(100) | NOT NULL | Spicy, Vegan, Gluten-Free, High-Protein, Sugar-Free |
| `tag_type` | VARCHAR(50) | | Flavor or Dietary |

### Cafeteria

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `cafeteria_id` | INT | PK, AUTO_INCREMENT | |
| `name` | VARCHAR(100) | NOT NULL | |
| `description` | TEXT | | |
| `operating_hours` | VARCHAR(100) | | Format: `HH:MM-HH:MM` |
| `average_rating` | DECIMAL(3,2) | | Aggregated from approved reviews |
| `total_reviews` | INT | DEFAULT 0 | |
| `is_active` | BOOLEAN | DEFAULT TRUE | |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

### User

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | INT | PK, AUTO_INCREMENT | |
| `username` | VARCHAR(100) | NOT NULL, UNIQUE | |
| `role` | ENUM | NOT NULL | `STUDENT`, `STAFF`, or `ADMIN` |
| `password_hash` | VARCHAR(255) | NOT NULL | BCrypt hash with `$2b$` prefix |
| `krakens_balance` | DECIMAL(10,2) | DEFAULT 0 | Gold Krakens balance (1 GK = 10 LKR) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| `last_login` | TIMESTAMP | NULL | |

### Student

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | INT | PK, FK → User | Shared PK pattern (disjoint subtype) |
| `dietary_preferences` | VARCHAR(255) | | |
| `university_id` | VARCHAR(50) | | Format: `BU-1XXXX`. Students can log in with this or username. |

### Staff

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | INT | PK, FK → User | Shared PK pattern |
| `assigned_cafeteria_id` | INT | NOT NULL, FK → Cafeteria | Each staff member is assigned to exactly one cafeteria |

### Admin

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `user_id` | INT | PK, FK → User | Shared PK pattern. No additional columns. |

### MenuItem

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `item_id` | INT | PK, AUTO_INCREMENT | |
| `cafeteria_id` | INT | NOT NULL, FK → Cafeteria | |
| `category_id` | INT | NOT NULL, FK → Category | |
| `name` | VARCHAR(100) | NOT NULL | |
| `description` | TEXT | | |
| `base_price` | DECIMAL(10,2) | NOT NULL | In Gold Krakens |
| `image_url` | VARCHAR(255) | | |
| `preparation_time` | INT | | In minutes |
| `is_available` | BOOLEAN | DEFAULT TRUE | |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Auto-updates on modification |

### Order

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `order_id` | INT | PK, AUTO_INCREMENT | |
| `user_id` | INT | NOT NULL, FK → User | |
| `cafeteria_id` | INT | NOT NULL, FK → Cafeteria | |
| `order_status` | VARCHAR(50) | | PLACED, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED |
| `total_amount` | DECIMAL(10,2) | | Sum of OrderItem subtotals |
| `placed_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| `confirmed_at` | TIMESTAMP | NULL | Set when staff confirms |
| `completed_at` | TIMESTAMP | NULL | Set when order is completed |
| `special_instructions` | TEXT | | Free-text notes from student |

### OrderItem

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `order_item_id` | INT | PK, AUTO_INCREMENT | |
| `order_id` | INT | NOT NULL, FK → Order | |
| `item_id` | INT | NOT NULL, FK → MenuItem | |
| `quantity` | INT | NOT NULL | |
| `unit_price` | DECIMAL(10,2) | | Snapshot of MenuItem.base_price at order time |
| `subtotal` | DECIMAL(10,2) | | quantity * unit_price |

### OrderCustomization

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `order_customization_id` | INT | PK, AUTO_INCREMENT | |
| `order_item_id` | INT | NOT NULL, FK → OrderItem | |
| `price_adjustment` | DECIMAL(10,2) | | Positive for additions, 0 for removals |

### MenuItemCustomization

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `customization_id` | INT | PK, AUTO_INCREMENT | |
| `item_id` | INT | NOT NULL, FK → MenuItem | |
| `ingredient_name` | VARCHAR(100) | | e.g., "Extra Noxian Cheese", "Oat Milk" |
| `modification_type` | VARCHAR(50) | | ADD, REMOVE, SUBSTITUTE, MODIFICATION |
| `price_adjustment` | DECIMAL(10,2) | | Cost change in GK (0 for removals) |
| `is_available` | BOOLEAN | DEFAULT TRUE | |

### MenuItemTag

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `item_tag_id` | INT | PK, AUTO_INCREMENT | |
| `item_id` | INT | NOT NULL, FK → MenuItem | |
| `tag_id` | INT | NOT NULL, FK → Tag | |

### Payment

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `payment_id` | INT | PK, AUTO_INCREMENT | |
| `user_id` | INT | NOT NULL, FK → User | |
| `order_id` | INT | NOT NULL, FK → Order, UNIQUE | Enforces 1:1 with Order |
| `transaction_type` | VARCHAR(50) | | PAYMENT, REFUND |
| `amount` | DECIMAL(10,2) | | |
| `payment_method` | VARCHAR(50) | | KRAKENS, CREDIT_CARD, NFC_CHIP |
| `transaction_status` | VARCHAR(50) | | SUCCESS, FAILED |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

### Review

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `review_id` | INT | PK, AUTO_INCREMENT | |
| `user_id` | INT | NOT NULL, FK → User | |
| `cafeteria_id` | INT | NOT NULL, FK → Cafeteria | |
| `order_id` | INT | NOT NULL, FK → Order, UNIQUE | One review per order |
| `star_rating` | INT | CHECK (1-5) | |
| `review_text` | TEXT | | Optional, max 200 chars enforced at app layer |
| `is_approved` | BOOLEAN | DEFAULT FALSE | Moderation flag |
| `sentiment_score` | DECIMAL(3,2) | | AI-computed, range -1.00 to 1.00 |
| `keywords` | TEXT | | Comma-separated AI-extracted keywords |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| `expires_at` | TIMESTAMP | NULL | 1-hour submission window |

### Discount

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `discount_id` | INT | PK, AUTO_INCREMENT | |
| `cafeteria_id` | INT | NOT NULL, FK → Cafeteria | |
| `discount_type` | VARCHAR(50) | | PERCENTAGE, COMBO_FIXED_PRICE, BOGO, FIXED_AMOUNT |
| `discount_value` | DECIMAL(10,2) | | Meaning varies by type (%, fixed price, or fixed amount) |
| `applicable_items` | TEXT | | JSON array of item IDs, or `'ALL'` |
| `requirements` | TEXT | | Human-readable conditions |
| `ai_generated` | BOOLEAN | DEFAULT FALSE | TRUE if suggested by AI service |
| `approved_by` | INT | FK → User, NULL | NULL = pending approval |
| `start_date` | DATE | | |
| `end_date` | DATE | | |
| `is_active` | BOOLEAN | DEFAULT TRUE | FALSE for pending or expired |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

### Recommendation

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `recommendation_id` | INT | PK, AUTO_INCREMENT | |
| `user_id` | INT | NOT NULL, FK → User | |
| `item_id` | INT | NOT NULL, FK → MenuItem | |
| `recommendation_type` | VARCHAR(50) | | COLLABORATIVE_FILTERING, TIME_SENSITIVE, POPULARITY_TREND, ASSOCIATION_RULE, CONTENT_BASED |
| `confidence_score` | DECIMAL(3,2) | | 0.00 to 1.00 |
| `context_data` | TEXT | | Human-readable explanation |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| `shown_at` | TIMESTAMP | NULL | When the recommendation was displayed to the user |
| `clicked` | BOOLEAN | DEFAULT FALSE | Whether the user clicked on it |

### AuditLog

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `log_id` | INT | PK, AUTO_INCREMENT | |
| `user_id` | INT | NOT NULL, FK → User | Actor who performed the action |
| `action_type` | VARCHAR(50) | NOT NULL | CREATE, UPDATE, DELETE, LOGIN_ATTEMPT, etc. |
| `target_table` | VARCHAR(100) | | Table affected (MenuItem, Discount, Cafeteria, User) |
| `target_id` | INT | | PK of the affected row |
| `old_value` | TEXT | | Previous value (for updates) |
| `new_value` | TEXT | | New value (for updates) |
| `ip_address` | VARCHAR(45) | | Supports IPv4 and IPv6 |
| `status` | VARCHAR(50) | | SUCCESS or FAILURE |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

### TransactionHistory

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `transaction_id` | INT | PK, AUTO_INCREMENT | |
| `user_id` | INT | NOT NULL, FK → User | |
| `transaction_type` | VARCHAR(50) | | DEPOSIT, DEBIT, REFUND |
| `amount` | DECIMAL(10,2) | | |
| `balance_before` | DECIMAL(10,2) | | Snapshot before transaction |
| `balance_after` | DECIMAL(10,2) | | Snapshot after transaction |
| `reference_id` | INT | | Order ID or NULL for non-order transactions |
| `description` | TEXT | | Human-readable description |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

---

## Key Relationships

### One-to-Many (1:M)

| Parent | Child | FK Column | Notes |
|---|---|---|---|
| User | Order | `order_id.user_id` | A student places many orders |
| User | Payment | `payment.user_id` | |
| User | Review | `review.user_id` | |
| User | AuditLog | `audit_log.user_id` | |
| User | TransactionHistory | `transaction_history.user_id` | |
| Cafeteria | MenuItem | `menu_item.cafeteria_id` | 18 items per cafeteria in seed data |
| Cafeteria | Order | `order.cafeteria_id` | |
| Cafeteria | Review | `review.cafeteria_id` | |
| Cafeteria | Discount | `discount.cafeteria_id` | |
| Cafeteria | Staff | `staff.assigned_cafeteria_id` | |
| Category | MenuItem | `menu_item.category_id` | |
| Order | OrderItem | `order_item.order_id` | |
| OrderItem | OrderCustomization | `order_customization.order_item_id` | Weak entity |
| MenuItem | MenuItemCustomization | `menu_item_customization.item_id` | Weak entity |
| User (Staff) | Discount | `discount.approved_by` | Staff who approved the discount |

### One-to-One (1:1)

| Parent | Child | Enforced By | Notes |
|---|---|---|---|
| Order | Payment | `UNIQUE KEY (order_id)` on Payment | One payment per order |
| Order | Review | `UNIQUE KEY (order_id)` on Review | One review per order |
| User | Student | Shared PK (`user_id`) | Disjoint subtype |
| User | Staff | Shared PK (`user_id`) | Disjoint subtype |
| User | Admin | Shared PK (`user_id`) | Disjoint subtype |

### Many-to-Many (M:N) via Associative Entities

| Entity A | Entity B | Junction Table | Notes |
|---|---|---|---|
| User | MenuItem | Recommendation | AI-generated suggestions with confidence and click tracking |
| Order | MenuItem | OrderItem | Line items with quantity and price |
| MenuItem | Tag | MenuItemTag | Dietary and flavor labels |

---

## Indexes

All indexes are defined at the bottom of `schema.sql`. They optimize the most common query patterns in the application:

| Index Name | Table | Columns | Optimizes |
|---|---|---|---|
| `idx_transaction_history_user_created` | TransactionHistory | `(user_id, created_at)` | Wallet transaction history page (sorted by date, filtered by user) |
| `idx_order_status` | Order | `(order_status)` | Staff dashboard filtering active orders by status |
| `idx_order_user_id` | Order | `(user_id)` | Student order history lookup |
| `idx_order_cafeteria_id` | Order | `(cafeteria_id)` | Staff dashboard loading orders for their assigned cafeteria |
| `idx_order_placed_at` | Order | `(placed_at)` | Analytics date-range queries, order sorting |
| `idx_recommendation_user_id` | Recommendation | `(user_id)` | Loading recommendations for a specific student |
| `idx_review_cafeteria_id` | Review | `(cafeteria_id)` | Cafeteria review listing page |
| `idx_order_item_order_id` | OrderItem | `(order_id)` | Loading line items for an order |
| `idx_order_item_item_id` | OrderItem | `(item_id)` | Analytics — finding all orders containing a specific item |
| `idx_menu_item_cafeteria` | MenuItem | `(cafeteria_id)` | Menu page loading items for a cafeteria |
| `idx_discount_cafeteria_active` | Discount | `(cafeteria_id, is_active)` | Loading active discounts for a specific cafeteria |

---

## Seed Data

The `data.sql` file populates the database with realistic data for development and demonstration. Here is what it includes:

### Cafeterias (3)

| ID | Name | Operating Hours | Avg Rating |
|---|---|---|---|
| 1 | The Last Drop | 08:00-22:00 | 3.86 |
| 2 | Hex Core Cafe | 07:00-20:00 | 3.67 |
| 3 | Skyline Sips | 10:00-18:00 | 3.80 |

### Categories (5)

Healthy/Vegan, Fast Food, Breakfast, Beverages, Desserts.

### Tags (5)

Spicy (Flavor), Vegan (Dietary), Gluten-Free (Dietary), High-Protein (Dietary), Sugar-Free (Dietary).

### Users (61)

All users share the password `pass` (BCrypt hash: `$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2`).

| Cluster | User IDs | Count | Role | Starting Balance | Description |
|---|---|---|---|---|---|
| A — Healthy Eaters | 1-20 | 20 | STUDENT | 100 GK | Demacia/Ionia themed. Prefer healthy menu items. |
| B — Fast Food Eaters | 21-22, 24-40 | 18 | STUDENT | 100 GK | Noxus/Bilgewater themed. Prefer fast food + combo items. |
| C — Morning Eaters | 41-42, 44, 46-47, 49-60 | 18 | STUDENT | 100 GK | Piltover themed. Prefer breakfast items. |
| Staff | 23, 43, 45, 48 | 4 | STAFF | 0 GK | swain (Last Drop), jayce + heimerdinger (Hex Core), viktor (Skyline Sips) |
| Admin | 61 | 1 | ADMIN | 0 GK | admin_user |

All 56 students have a university ID in format `BU-1XXXX` (e.g., garen = `BU-10001`, lux = `BU-10002`). Students can log in with either their username or university ID.

### Menu Items (54)

18 items per cafeteria, organized by cluster preference:

- **Per cafeteria:** 5 Healthy items, 5 Fast Food items, 5 Breakfast items, 2 Combo items (frequently bought together), 1 Failing item (declining sales for AI discount training)
- Prices range from 10 GK (Overpriced Tap Water) to 180 GK (Council Smash Burger)
- Full item listing with IDs and prices is documented in `ai-service/AI_SERVICE_CHANGES.md` under "Menu Item Reference"

### Menu Item Customizations (32)

Customization options spread across 9 menu items (3 per cafeteria):
- **The Last Drop:** Darius Dunk Burger (4), Piltover Coffee (4), Soraka Star Salad (3), Lee Sin Fried Rice (3), Caitlyn Cupcake (2)
- **Hex Core Cafe:** Evolution Burger (4), Viktor Black Coffee (3), Zaun Street Noodles (3)
- **Skyline Sips:** Council Smash Burger (4), Skyline Espresso (3), High-Altitude Green Bowl (3)

### Synthetic Orders (~2000)

Generated by the `GenerateData` stored procedure:
- Creates ~2000 orders with COMPLETED status across the past 30 days
- Skips staff user IDs (23, 43, 45, 48)
- Cluster-aware item selection: Healthy eaters order healthy items, fast food eaters order fast food + combo pairs, morning eaters order breakfast items
- **Apriori co-purchase patterns** (85% probability): Lee Sin Fried Rice + Dragon Chilli Paste (cafeteria 1), Zaun Street Noodles + Spicy Shroom Skewer (cafeteria 2), Premium Iced Latte + Macaron Set (cafeteria 3)
- **Time decay for failing items**: Items 18, 36, 54 have decreasing order rates over time (older orders are more likely to include them)
- After generation, `Order.total_amount` is synced from actual `OrderItem` subtotals via an UPDATE query
- Final status distribution: 1-1950 COMPLETED, 1951-1960 COMPLETED (failed payment), 1961-1970 CANCELLED, 1971-1980 PLACED, 1981-1985 CONFIRMED, 1986-1992 PREPARING, 1993-2000 READY

### Payments (~1960)

- Orders 1-1950: SUCCESS payments with random method (KRAKENS, CREDIT_CARD, NFC_CHIP)
- Orders 1951-1960: FAILED payments (KRAKENS method)
- Orders 1961-2000: No payment records

### Reviews (28)

- The Last Drop: 9 reviews (7 approved, 2 pending moderation)
- Hex Core Cafe: 9 reviews (all approved)
- Skyline Sips: 10 reviews (all approved)
- Sentiment scores range from -0.94 to 0.98
- Includes positive, negative, and neutral reviews with AI-extracted keywords

### Recommendations (7)

Sample recommendations demonstrating all 5 types: COLLABORATIVE_FILTERING, TIME_SENSITIVE, POPULARITY_TREND, ASSOCIATION_RULE, CONTENT_BASED.

### Discounts (9)

- 3 AI-generated active (approved by staff)
- 3 manual active discounts
- 3 AI-generated pending (awaiting approval, `approved_by IS NULL`, `is_active = FALSE`)

### Audit Log (10)

Sample entries: price changes, operating hours updates, availability toggles, discount operations, login attempts (both success and failure).

### Transaction History

- Semester start allowance (100 GK deposit) for all 56 students
- 1 refund transaction (Order 50)
- 1 failed top-up attempt (error handling demo)

---

## User Roles

### STUDENT

- Browse cafeteria menus and view dietary tags
- Add items to cart with customizations
- Place orders using Gold Krakens balance
- View order status in real-time (WebSocket)
- Cancel orders before staff confirmation (PLACED or CONFIRMED status)
- Submit reviews (1-5 stars, optional text) within 1 hour of order completion
- Receive AI-powered menu recommendations
- View wallet balance and transaction history
- Self-service wallet top-up (max 500 GK per transaction)
- Log in with username or university ID

### STAFF

- View real-time order queue for assigned cafeteria
- Confirm, prepare, mark ready, and complete orders
- Create, update, and delete menu items for assigned cafeteria
- Toggle menu item availability
- Generate AI discount suggestions
- Approve or reject pending discounts
- Create manual discounts

### ADMIN

- All staff capabilities (across all cafeterias)
- Create and delete staff accounts
- View all student accounts
- Top up student wallet balances (no amount cap)
- Access cross-cafeteria analytics dashboard (daily/weekly/monthly/quarterly)
- Export analytics as CSV
- View audit log with search and action-type filtering

---

## Gold Krakens Wallet

The wallet system uses a **single-table approach** — there is no separate wallet table. The balance is stored directly on `User.krakens_balance`, and all transactions are recorded in `TransactionHistory`.

### How it works

1. **Balance storage:** `User.krakens_balance` (DECIMAL(10,2)) holds the current balance. 1 GK = 10 LKR.
2. **Transaction ledger:** Every balance change creates a `TransactionHistory` row with `balance_before` and `balance_after` snapshots for audit trail.
3. **Concurrency control:** The backend uses pessimistic locking (`@Lock(PESSIMISTIC_WRITE)`) on wallet operations to prevent race conditions during concurrent debits/credits.
4. **Order placement:** Debits the student's balance and creates a DEBIT transaction record.
5. **Order cancellation:** Credits the refund amount back and creates a REFUND transaction record.
6. **Top-up:** Admin can top up any amount. Students can self-top-up with a max of 500 GK per transaction.
7. **Review reward:** Students receive 5 GK credit for submitting a review.

### Seed data balances

- All students start with 100 GK ("Semester Start Allowance")
- Staff and admin accounts have 0 GK balance

---

## Order Lifecycle

Orders follow a 6-state machine with validated transitions enforced by `OrderStatus.isValidTransition()` in the backend:

```
                    +-----------+
                    | CANCELLED |
                    +-----------+
                      ^       ^
                      |       |
   +--------+    +----------+    +-----------+    +-------+    +-----------+
   | PLACED | -> | CONFIRMED| -> | PREPARING | -> | READY | -> | COMPLETED |
   +--------+    +----------+    +-----------+    +-------+    +-----------+
```

| From | Valid Transitions | Notes |
|---|---|---|
| PLACED | CONFIRMED, CANCELLED | Students can cancel. Staff can confirm or cancel. |
| CONFIRMED | PREPARING, CANCELLED | Staff begins preparation or cancels. Students can still cancel. |
| PREPARING | READY | Staff marks food as ready. Cannot be cancelled once preparing. |
| READY | COMPLETED | Staff marks as picked up / completed. |
| COMPLETED | (none) | Terminal state. |
| CANCELLED | (none) | Terminal state. Auto-refund on cancellation. |

---

## Backup and Recovery

### Docker Compose Backup Service

The `docker-compose.yml` includes a `db-backup` sidecar service (disabled by default via the `backup` profile):

```bash
# Enable the backup service
docker compose --profile backup up -d

# Backups are saved to ./backups/ as gzip-compressed SQL dumps
# Runs every 5 minutes, retains 288 backups (24 hours)
```

### Standalone Backup Script

`scripts/backup.sh` provides host-level backup with cron support:

```bash
# One-time backup
DB_PASSWORD=yourpass ./scripts/backup.sh

# Install 5-minute cron job
DB_PASSWORD=yourpass ./scripts/backup.sh --install-cron

# Remove cron job
./scripts/backup.sh --uninstall-cron
```

Environment variables: `DB_HOST` (localhost), `DB_PORT` (3306), `DB_NAME` (demeter_db), `DB_USER` (root), `DB_PASSWORD` (required), `BACKUP_DIR` (./backups), `BACKUP_RETAIN` (288).

### Restore from Backup

```bash
# Decompress and restore
gunzip < backups/demeter_20260318_120000.sql.gz | mysql -u root -p demeter_db

# Or via the backup script
./scripts/backup.sh --restore backups/demeter_20260318_120000.sql.gz
```

---

## Known Gotchas

### Reserved Words Require Backticks

`User` and `Order` are MySQL reserved words. Their table names must be escaped with backticks in all SQL:

```sql
CREATE TABLE `User` ( ... );
CREATE TABLE `Order` ( ... );
SELECT * FROM `User` WHERE user_id = 1;
```

In JPA entities, this is handled via `@Table(name = "\`User\`")` and `@Table(name = "\`Order\`")`.

### BCrypt `$2b$` Prefix

Seed data password hashes use the `$2b$` prefix (Python/bcryptjs convention) rather than the `$2a$` prefix (Java convention). Spring's `BCryptPasswordEncoder` handles both prefixes correctly — no conversion is needed.

### PhysicalNamingStrategy Requires Explicit Column Annotations

The backend uses `PhysicalNamingStrategyStandardImpl`, which means Hibernate does **not** auto-convert camelCase Java field names to snake_case column names. Every entity field that maps to a snake_case column must have an explicit `@Column(name = "snake_case")` annotation. For example:

```java
@Column(name = "cafeteria_id")
private int cafeteriaId;  // Without @Column, Hibernate would look for "cafeteriaId" column
```

### Password Validation is Registration-Only

The `validatePasswordStrength` check only runs during registration (`POST /api/auth/register`), not during login. All seed users have the 4-character password `pass`, which would fail the registration password strength check.

### Stored Procedure Generates Non-Deterministic Data

The `GenerateData` stored procedure uses `RAND()` for user selection, cafeteria assignment, and co-purchase probability. Each load of `data.sql` produces slightly different order distributions. The overall patterns (cluster preferences, combo co-purchase rates, failing item decay) remain consistent, but exact order counts per item will vary.

### Order Item IDs in OrderCustomization Are Hardcoded

The `OrderCustomization` seed data uses hardcoded `order_item_id` values (5, 8, 12, 15, 22, 33, 41, 45, 55, 67, 72, 88, 92, 99). These assume the stored procedure generates at least 99 OrderItem rows (2000 orders with 1+ items each guarantees this). The specific customization types noted in comments may not match the actual item at that `order_item_id` since order generation is random.
