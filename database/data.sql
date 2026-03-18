-- =========================================================================
-- 1. INSERT CATEGORIES
-- =========================================================================
INSERT INTO Category (name, description) VALUES
                                             ('Healthy/Vegan', 'Plant-based options'),
                                             ('Fast Food',     'Burgers and Fries'),
                                             ('Breakfast',     'Morning staples'),
                                             ('Beverages',     'Drinks'),
                                             ('Desserts',      'Sweets');

-- =========================================================================
-- 2. INSERT CAFETERIAS
-- Descriptions and hours match the live UI screenshots (report p.25).
-- =========================================================================
INSERT INTO Cafeteria (name, description, operating_hours, average_rating, total_reviews) VALUES
                                                                               ('The Last Drop', 'Cozy atmosphere for deep study sessions and artisanal brews.',                  '08:00-22:00', 3.86, 7),   -- ID 1
                                                                               ('Hex Core Cafe', 'Industrial chic meets molecular gastronomy. Fast, efficient, and futuristic.',  '07:00-20:00', 3.67, 9),   -- ID 2
                                                                               ('Skyline Sips',  'Rooftop dining with the best view of the campus.',                             '10:00-18:00', 3.80, 10);  -- ID 3

-- =========================================================================
-- 3. INSERT USERS
-- Students start with 100 GK (Semester Start Allowance). 1 GK = 10 LKR.
-- Staff and Admin carry no personal balance.
-- Users who perform staff actions (audit log, discounts) are inserted
-- directly with role = 'STAFF' — no UPDATE statements needed.
-- =========================================================================

-- Cluster A (Healthy Eaters): IDs 1-20 (Demacia/Ionia) — STUDENT
INSERT INTO `User` (username, role, password_hash, krakens_balance) VALUES
                                                                      ('garen',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('lux',      'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('fiora',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('sona',     'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('vayne',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('irelia',   'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('karma',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('soraka',   'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('shen',     'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('akali',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('jarvan',   'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('galio',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('shyvana',  'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('xin_zhao', 'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('quinn',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('kayle',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('morgana',  'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('poppy',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('taric',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100), ('kennen',   'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100);

-- Cluster B (Fast Food Eaters): IDs 21-40 (Noxus/Bilgewater)
-- darius(21), draven(22)      — STUDENT
-- swain(23)                   — STAFF at The Last Drop (ID 1): performs price changes
-- katarina(24) to sion(25)    — STUDENT
-- IDs 26-35                   — STUDENT
-- twisted_fate(36) to rengar(40) — STUDENT
INSERT INTO `User` (username, role, password_hash, krakens_balance) VALUES
                                                                      ('darius',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('draven',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('swain',         'STAFF',   '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2',  0),   -- ID 23: STAFF, The Last Drop
                                                                      ('katarina',      'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('sion',          'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('miss_fortune',  'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('gangplank',     'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('graves',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('pyke',          'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('nautilus',      'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('talon',         'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('riven',         'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('vladimir',      'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('kled',          'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('samira',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('twisted_fate',  'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('fizz',          'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('tahm_kench',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('illaoi',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('rengar',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100);

-- Cluster C (Morning Eaters): IDs 41-60 (Piltover)
-- caitlyn(41), vi(42)         — STUDENT
-- jayce(43)                   — STAFF at Hex Core Cafe (ID 2): adjusts menu prices
-- ezreal(44)                  — STUDENT
-- heimerdinger(45)            — STAFF at Hex Core Cafe (ID 2): approves discounts
-- ekko(46) to gnar(60)        — STUDENT
-- viktor(48)                  — STAFF at Skyline Sips (ID 3): manages operations
INSERT INTO `User` (username, role, password_hash, krakens_balance) VALUES
                                                                      ('caitlyn',      'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('vi',           'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('jayce',        'STAFF',   '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2',  0),   -- ID 43: STAFF, Hex Core Cafe
                                                                      ('ezreal',       'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('heimerdinger', 'STAFF',   '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2',  0),   -- ID 45: STAFF, Hex Core Cafe
                                                                      ('ekko',         'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('jinx',         'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('viktor',       'STAFF',   '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2',  0),   -- ID 48: STAFF, Skyline Sips
                                                                      ('camille',      'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('blitzcrank',   'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('seraphine',    'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('orianna',      'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('ziggs',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('corki',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('rumble',       'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('tristana',     'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('lulu',         'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('teemo',        'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('veigar',       'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100),
                                                                      ('gnar',         'STUDENT', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 100);

-- Admin user (ID 61)
INSERT INTO `User` (username, role, password_hash, krakens_balance) VALUES
    ('admin_user', 'ADMIN', '$2b$12$6Yrg35Rp8rQ92WLygPMfzOBzgaEnXzmFZvp7mC9T2NLliQGCRzUH2', 0);   -- ID 61

-- =========================================================================
-- 3a. INSERT STUDENT SUBCLASS ROWS
-- Each student gets a unique university_id in format BU-XXXXX
-- =========================================================================

INSERT INTO Student (user_id, university_id) VALUES
    (1,  'BU-10001'), (2,  'BU-10002'), (3,  'BU-10003'), (4,  'BU-10004'), (5,  'BU-10005'),
    (6,  'BU-10006'), (7,  'BU-10007'), (8,  'BU-10008'), (9,  'BU-10009'), (10, 'BU-10010'),
    (11, 'BU-10011'), (12, 'BU-10012'), (13, 'BU-10013'), (14, 'BU-10014'), (15, 'BU-10015'),
    (16, 'BU-10016'), (17, 'BU-10017'), (18, 'BU-10018'), (19, 'BU-10019'), (20, 'BU-10020'),
    (21, 'BU-10021'), (22, 'BU-10022'), (24, 'BU-10024'), (25, 'BU-10025'), (26, 'BU-10026'),
    (27, 'BU-10027'), (28, 'BU-10028'), (29, 'BU-10029'), (30, 'BU-10030'), (31, 'BU-10031'),
    (32, 'BU-10032'), (33, 'BU-10033'), (34, 'BU-10034'), (35, 'BU-10035'), (36, 'BU-10036'),
    (37, 'BU-10037'), (38, 'BU-10038'), (39, 'BU-10039'), (40, 'BU-10040'), (41, 'BU-10041'),
    (42, 'BU-10042'), (44, 'BU-10044'), (46, 'BU-10046'), (47, 'BU-10047'), (49, 'BU-10049'),
    (50, 'BU-10050'), (51, 'BU-10051'), (52, 'BU-10052'), (53, 'BU-10053'), (54, 'BU-10054'),
    (55, 'BU-10055'), (56, 'BU-10056'), (57, 'BU-10057'), (58, 'BU-10058'), (59, 'BU-10059'),
    (60, 'BU-10060');

-- =========================================================================
-- 3b. INSERT STAFF SUBCLASS ROWS
-- Links each STAFF user to their assigned cafeteria
-- =========================================================================

INSERT INTO Staff (user_id, assigned_cafeteria_id) VALUES
    (23, 1),   -- swain → The Last Drop
    (43, 2),   -- jayce → Hex Core Cafe
    (45, 2),   -- heimerdinger → Hex Core Cafe
    (48, 3);   -- viktor → Skyline Sips

INSERT INTO Admin (user_id) VALUES
    (61);  -- admin_user

-- =========================================================================
-- 4. INSERT MENU ITEMS
-- =========================================================================

-- -------------------------------------------------------------------------
-- CANTEEN 1: The Last Drop (cafeteria_id = 1)
-- -------------------------------------------------------------------------

-- Cluster A - Healthy [IDs 1-5]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 1, 'Soraka Star Salad',    120.00),
                                                                       (1, 1, 'Ionian Spirit Juice',   45.00),
                                                                       (1, 1, 'Xayah Feather Wrap',    85.00),
                                                                       (1, 1, 'Karma Green Bowl',     110.00),
                                                                       (1, 1, 'Irelia Blade Greens',   95.00);

-- Cluster B - Fast Food [IDs 6-10]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 2, 'Darius Dunk Burger',   150.00),
                                                                       (1, 4, 'Noxian Coke',           30.00),
                                                                       (1, 2, 'Draven Spinning Fries', 60.00),
                                                                       (1, 2, 'Kled Spicy Tacos',     130.00),
                                                                       (1, 2, 'Sion Smash Burger',    160.00);

-- Cluster C - Breakfast [IDs 11-15]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 3, 'Piltover Coffee',        40.00),
                                                                       (1, 5, 'Caitlyn Cupcake',        55.00),
                                                                       (1, 3, 'Jayce Hammer Sandwich',  90.00),
                                                                       (1, 3, 'Yordle Buns',            45.00),
                                                                       (1, 3, 'Progress Day Toast',     60.00);

-- Combo Items [IDs 16-17]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 2, 'Lee Sin Fried Rice',  110.00),
                                                                       (1, 2, 'Dragon Chilli Paste',  15.00);

-- Failing Item [ID 18]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
    (1, 2, 'Teemo Veggie Burger', 125.00);

-- -------------------------------------------------------------------------
-- CANTEEN 2: Hex Core Cafe (cafeteria_id = 2)
-- -------------------------------------------------------------------------

-- Cluster A - Healthy [IDs 19-23]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (2, 1, 'Hex Core Salad',         105.00),
                                                                       (2, 1, 'Zaunite Purified Water',  40.00),
                                                                       (2, 1, 'Ekko Time-Wrap',          90.00),
                                                                       (2, 1, 'Chem-Baron Veggie Bowl', 115.00),
                                                                       (2, 1, 'Janna Breezy Greens',     95.00);

-- Cluster B - Fast Food [IDs 24-28]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (2, 2, 'Evolution Burger',    140.00),
                                                                       (2, 4, 'Shimmer Cola',         35.00),
                                                                       (2, 2, 'Vi Punching Fries',    65.00),
                                                                       (2, 2, 'Jinx Rocket Tacos',   135.00),
                                                                       (2, 2, 'Urgot Grind Burger',  170.00);

-- Cluster C - Breakfast [IDs 29-33]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (2, 3, 'Viktor Black Coffee',         35.00),
                                                                       (2, 3, 'Heimerdinger Sweet Roll',     50.00),
                                                                       (2, 3, 'Academy Breakfast Sandwich',  95.00),
                                                                       (2, 3, 'Gearbox Buns',               45.00),
                                                                       (2, 3, 'Inventor Toast',             60.00);

-- Combo Items [IDs 34-35]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (2, 2, 'Zaun Street Noodles', 105.00),
                                                                       (2, 2, 'Spicy Shroom Skewer',  20.00);

-- Failing Item [ID 36]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
    (2, 5, 'Stale Trench Cake',   110.00);

-- -------------------------------------------------------------------------
-- CANTEEN 3: Skyline Sips (cafeteria_id = 3)
-- -------------------------------------------------------------------------

-- Cluster A - Healthy [IDs 37-41]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (3, 1, 'High-Altitude Green Bowl', 130.00),
                                                                       (3, 1, 'Cloud Piercer Juice',       50.00),
                                                                       (3, 1, 'Zephyr Wrap',               85.00),
                                                                       (3, 1, 'Skyline Vegan Platter',    140.00),
                                                                       (3, 1, 'Aero Salad',               100.00);

-- Cluster B - Fast Food [IDs 42-46]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (3, 2, 'Progress Gate Slider',  120.00),
                                                                       (3, 4, 'Hex-Energy Drink',       45.00),
                                                                       (3, 2, 'Gilded Fries',           70.00),
                                                                       (3, 2, 'Piltovan Fried Chicken',150.00),
                                                                       (3, 2, 'Council Smash Burger',  180.00);

-- Cluster C - Breakfast [IDs 47-51]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (3, 3, 'Skyline Espresso',      45.00),
                                                                       (3, 3, 'Golden Muffin',         60.00),
                                                                       (3, 3, 'Aristocrat Croissant',  75.00),
                                                                       (3, 3, 'Sun-Gate Buns',         50.00),
                                                                       (3, 3, 'Elite Morning Toast',   65.00);

-- Combo Items [IDs 52-53]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (3, 3, 'Premium Iced Latte', 80.00),
                                                                       (3, 5, 'Macaron Set',        40.00);

-- Failing Item [ID 54]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
    (3, 4, 'Overpriced Tap Water', 10.00);

-- =========================================================================
-- 5. GENERATE SYNTHETIC ORDER DATA
-- Unit prices and subtotals look up actual base_price from MenuItem.
-- =========================================================================
DROP PROCEDURE IF EXISTS GenerateData;

DELIMITER $$

CREATE PROCEDURE GenerateData()
BEGIN
    DECLARE i              INT DEFAULT 1;
    DECLARE rand_user      INT;
    DECLARE rand_cafeteria INT;
    DECLARE new_order_id   INT;
    DECLARE order_date     TIMESTAMP;
    DECLARE days_ago       INT;
    DECLARE v_item_id      INT;
    DECLARE v_price        DECIMAL(10,2);

    WHILE i <= 2000 DO
        SET rand_user      = FLOOR(1 + (RAND() * 60));
        SET rand_cafeteria = FLOOR(1 + (RAND() * 3));
        SET days_ago       = FLOOR(RAND() * 30);
        SET order_date     = DATE_SUB(NOW(), INTERVAL days_ago DAY);

        -- Skip staff users (23=swain, 43=jayce, 45=heimerdinger, 48=viktor)
        IF rand_user NOT IN (23, 43, 45, 48) THEN

INSERT INTO `Order` (user_id, cafeteria_id, order_status, placed_at)
VALUES (rand_user, rand_cafeteria, 'COMPLETED', order_date);
SET new_order_id = LAST_INSERT_ID();

        -- ==========================================
        -- CLUSTER A: Healthy Eaters (User IDs 1-20)
        -- ==========================================
        IF rand_user <= 20 THEN
            IF rand_cafeteria = 1 THEN
                SET v_item_id = FLOOR(1 + (RAND() * 5));
            ELSEIF rand_cafeteria = 2 THEN
                SET v_item_id = FLOOR(19 + (RAND() * 5));
ELSE
                SET v_item_id = FLOOR(37 + (RAND() * 5));
END IF;
SELECT base_price INTO v_price FROM MenuItem WHERE item_id = v_item_id;
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, v_item_id, 1, v_price, v_price);

-- ==========================================
-- CLUSTER B: Fast Food Eaters (User IDs 21-40)
-- ==========================================
ELSEIF rand_user <= 40 THEN
            IF rand_cafeteria = 1 THEN
                SET v_item_id = FLOOR(6 + (RAND() * 5));
SELECT base_price INTO v_price FROM MenuItem WHERE item_id = v_item_id;
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, v_item_id, 1, v_price, v_price);
-- APRIORI: Fried Rice + Chilli Paste (85% co-purchase rate)
IF RAND() < 0.85 THEN
                    INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
                    VALUES (new_order_id, 16, 1, 110.00, 110.00);
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, 17, 1, 15.00, 15.00);
END IF;
            ELSEIF rand_cafeteria = 2 THEN
                SET v_item_id = FLOOR(24 + (RAND() * 5));
SELECT base_price INTO v_price FROM MenuItem WHERE item_id = v_item_id;
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, v_item_id, 1, v_price, v_price);
-- APRIORI: Noodles + Skewer (85% co-purchase rate)
IF RAND() < 0.85 THEN
                    INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
                    VALUES (new_order_id, 34, 1, 105.00, 105.00);
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, 35, 1, 20.00, 20.00);
END IF;
ELSE
                SET v_item_id = FLOOR(42 + (RAND() * 5));
SELECT base_price INTO v_price FROM MenuItem WHERE item_id = v_item_id;
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, v_item_id, 1, v_price, v_price);
END IF;

        -- ==========================================
        -- CLUSTER C: Morning Eaters (User IDs 41-60)
        -- ==========================================
        ELSEIF rand_user <= 60 THEN
            IF rand_cafeteria = 1 THEN
                SET v_item_id = FLOOR(11 + (RAND() * 5));
            ELSEIF rand_cafeteria = 2 THEN
                SET v_item_id = FLOOR(29 + (RAND() * 5));
ELSE
                SET v_item_id = FLOOR(47 + (RAND() * 5));
END IF;
SELECT base_price INTO v_price FROM MenuItem WHERE item_id = v_item_id;
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, v_item_id, 1, v_price, v_price);
-- APRIORI: Latte + Macaron at Canteen 3 (85% co-purchase rate)
IF rand_cafeteria = 3 AND RAND() < 0.85 THEN
                INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
                VALUES (new_order_id, 52, 1, 80.00, 80.00);
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, 53, 1, 40.00, 40.00);
END IF;
END IF;

        -- ==========================================
        -- TIME DECAY: Failing items lose sales over time
        -- ==========================================
        IF rand_cafeteria = 1 AND days_ago > 20 AND RAND() < 0.3 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, 18, 1, 125.00, 125.00);
END IF;

        IF rand_cafeteria = 2 AND days_ago > 15 AND RAND() < 0.4 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, 36, 1, 110.00, 110.00);
END IF;

        IF rand_cafeteria = 3 AND days_ago > 10 AND RAND() < 0.5 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, 54, 1, 10.00, 10.00);
END IF;

        END IF; -- end staff exclusion check
        SET i = i + 1;
END WHILE;
END$$

DELIMITER ;

CALL GenerateData();

-- Sync Order.total_amount from actual OrderItem subtotals
UPDATE `Order` o
    JOIN (
    SELECT order_id, SUM(subtotal) AS total_val
    FROM OrderItem
    GROUP BY order_id
    ) vals ON o.order_id = vals.order_id
    SET o.total_amount = vals.total_val;

-- =========================================================================
-- 6. AUDIT LOG
-- All user_ids here reference STAFF users inserted directly above.
-- =========================================================================

-- Price changes in The Last Drop (swain = ID 23, STAFF)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (23, 'UPDATE', 'MenuItem',  6, '150.00', '165.00', '192.168.1.101', 'SUCCESS'),
                                                                                                                   (23, 'UPDATE', 'MenuItem', 18, '125.00', '110.00', '192.168.1.101', 'SUCCESS');

-- Operating hours change in Skyline Sips (viktor = 48, STAFF)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (48, 'UPDATE', 'Cafeteria',  3, '10:00-18:00', '09:00-20:00', '10.0.0.55', 'SUCCESS');

-- Price change in Hex Core Cafe (jayce = 43, STAFF)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (43, 'UPDATE', 'MenuItem',  13, '90.00',       '95.00',      '10.0.0.42', 'SUCCESS');

-- Stock availability toggles (swain = 23, jayce = 43, STAFF)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (23, 'UPDATE', 'MenuItem', 12, 'TRUE',  'FALSE', '172.16.0.1', 'SUCCESS'),
                                                                                                                   (43, 'UPDATE', 'MenuItem', 12, 'FALSE', 'TRUE',  '172.16.0.2', 'SUCCESS');

-- Discount approvals (heimerdinger = 45, STAFF)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (45, 'CREATE', 'Discount', 1, 'NULL',    '15% OFF', '192.168.0.99', 'SUCCESS'),
                                                                                                                   (45, 'DELETE', 'Discount', 2, '10% OFF', 'NULL',    '192.168.0.99', 'SUCCESS');

-- Suspicious login attempts (twisted_fate = 36, STUDENT) and successful login (akali = 10)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (36, 'LOGIN_ATTEMPT', 'User', 36, 'NULL', 'NULL', '45.33.22.11', 'FAILURE'),
                                                                                                                   (36, 'LOGIN_ATTEMPT', 'User', 36, 'NULL', 'NULL', '45.33.22.11', 'FAILURE'),
                                                                                                                   (10, 'LOGIN_ATTEMPT', 'User', 10, 'NULL', 'NULL', '192.168.1.5', 'SUCCESS');

-- =========================================================================
-- 7. DISCOUNTS
-- approved_by references STAFF user IDs only (23, 43, 45, 48).
-- =========================================================================

-- AI: Rescue discount for Teemo Veggie Burger (declining sales)
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (1, 'PERCENTAGE', 20.00, '[18]', 'Min Order Value: 0', TRUE, 23, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), TRUE);

-- AI: Combo deal — Lee Sin Fried Rice + Dragon Chilli Paste (Apriori-detected)
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (1, 'COMBO_FIXED_PRICE', 115.00, '[16, 17]', 'Must buy both items', TRUE, 23, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), TRUE);

-- Manual: Hex Core Morning Rush BOGO (jayce = 43) — Viktor Black Coffee (ID 29)
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (2, 'BOGO', 10.00, '[29]', 'Buy 1 Get 1 Free on Viktor Black Coffee', FALSE, 43, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), TRUE);

-- Manual: Progress Day Special — Expired (for inactive discount history demo)
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (2, 'PERCENTAGE', 50.00, '[29, 30, 31]', 'Progress Day Celebration', FALSE, 45, '2025-11-01', '2025-11-02', FALSE);

-- Manual: The Last Drop Happy Hour flat discount on beverages
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (1, 'FIXED_AMOUNT', 20.00, '[7, 2]', 'Order total > 100', FALSE, 23, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY), TRUE);

-- Manual: Skyline Sips High Roller exclusive (viktor = 48)
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (3, 'PERCENTAGE', 5.00, 'ALL', 'For Gold Tier Users only', FALSE, 48, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), TRUE);

-- AI-generated pending discounts (approved_by IS NULL = awaiting staff approval, is_active = FALSE)
-- AI suggestion: Hex Core slow-seller promotion
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (2, 'PERCENTAGE', 15.00, '[26, 28]', 'Min Order Value: 50 GK', TRUE, NULL, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), FALSE);

-- AI suggestion: Skyline Sips combo deal
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (3, 'COMBO_FIXED_PRICE', 90.00, '[47, 37]', 'Must buy both items', TRUE, NULL, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), FALSE);

-- AI suggestion: The Last Drop loyalty BOGO
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (1, 'BOGO', 0.00, '[11]', 'Buy 1 Get 1 Free on Piltover Coffee - returning customers', TRUE, NULL, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY), FALSE);

-- =========================================================================
-- 8. MENU ITEM CUSTOMIZATIONS
-- =========================================================================

-- Darius Dunk Burger (Item ID 6)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (6, 'Extra Noxian Cheese', 'ADD',        15.00, TRUE),
                                                                                                                    (6, 'Double Meat Patty',   'ADD',        50.00, TRUE),
                                                                                                                    (6, 'Remove Onions',       'REMOVE',      0.00, TRUE),
                                                                                                                    (6, 'Gluten-Free Bun',     'SUBSTITUTE', 10.00, TRUE);

-- Piltover Coffee (Item ID 11)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (11, 'Oat Milk',                 'SUBSTITUTE',  5.00, TRUE),
                                                                                                                    (11, 'Extra Espresso Shot',      'ADD',         15.00, TRUE),
                                                                                                                    (11, 'Sugar-Free Vanilla Syrup', 'ADD',          3.00, TRUE),
                                                                                                                    (11, 'Iced (Cold Brew)',         'SUBSTITUTE',   2.00, TRUE);

-- Soraka Star Salad (Item ID 1)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (1, 'Add Grilled Chicken', 'ADD', 25.00, TRUE),
                                                                                                                    (1, 'Add Tofu',            'ADD', 20.00, TRUE),
                                                                                                                    (1, 'Extra Dressing',      'ADD',   0.00, TRUE);

-- Lee Sin Fried Rice (Item ID 16)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (16, 'Extra Fried Egg',  'ADD',           6.00, TRUE),
                                                                                                                    (16, 'Make it Spicy',    'MODIFICATION',   0.00, TRUE),
                                                                                                                    (16, 'No Green Onions',  'REMOVE',         0.00, TRUE);

-- Caitlyn Cupcake (Item ID 12)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (12, 'Extra Sprinkles',    'ADD', 1.00, TRUE),
                                                                                                                    (12, 'Gift Box Packaging', 'ADD', 5.00, TRUE);

-- -------------------------------------------------------------------------
-- Hex Core Cafe (cafeteria_id = 2) Customizations
-- -------------------------------------------------------------------------

-- Evolution Burger (Item ID 24)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (24, 'Extra Shimmer Sauce',  'ADD',        10.00, TRUE),
                                                                                                                    (24, 'Double Patty',         'ADD',        50.00, TRUE),
                                                                                                                    (24, 'Remove Pickles',       'REMOVE',      0.00, TRUE),
                                                                                                                    (24, 'Lettuce Wrap Bun',     'SUBSTITUTE',  5.00, TRUE);

-- Viktor Black Coffee (Item ID 29)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (29, 'Soy Milk',              'SUBSTITUTE',  5.00, TRUE),
                                                                                                                    (29, 'Extra Shot',            'ADD',        12.00, TRUE),
                                                                                                                    (29, 'Hazelnut Syrup',        'ADD',         4.00, TRUE);

-- Zaun Street Noodles (Item ID 34)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (34, 'Extra Chilli Oil',     'ADD',          3.00, TRUE),
                                                                                                                    (34, 'Add Soft Egg',         'ADD',          5.00, TRUE),
                                                                                                                    (34, 'No Coriander',         'REMOVE',       0.00, TRUE);

-- -------------------------------------------------------------------------
-- Skyline Sips (cafeteria_id = 3) Customizations
-- -------------------------------------------------------------------------

-- Council Smash Burger (Item ID 46)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (46, 'Truffle Aioli',        'ADD',        12.00, TRUE),
                                                                                                                    (46, 'Extra Patty',          'ADD',        55.00, TRUE),
                                                                                                                    (46, 'No Tomato',            'REMOVE',      0.00, TRUE),
                                                                                                                    (46, 'Brioche Bun Upgrade',  'SUBSTITUTE',  8.00, TRUE);

-- Skyline Espresso (Item ID 47)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (47, 'Almond Milk',          'SUBSTITUTE',  6.00, TRUE),
                                                                                                                    (47, 'Double Shot',          'ADD',        15.00, TRUE),
                                                                                                                    (47, 'Caramel Drizzle',      'ADD',         4.00, TRUE);

-- High-Altitude Green Bowl (Item ID 37)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (37, 'Add Grilled Salmon',   'ADD',        30.00, TRUE),
                                                                                                                    (37, 'Add Avocado',          'ADD',        15.00, TRUE),
                                                                                                                    (37, 'No Onions',            'REMOVE',      0.00, TRUE);

-- =========================================================================
-- 9. TAGS
-- =========================================================================
INSERT INTO Tag (name, tag_type) VALUES
                                     ('Spicy',        'Flavor'),   -- ID 1
                                     ('Vegan',        'Dietary'),  -- ID 2
                                     ('Gluten-Free',  'Dietary'),  -- ID 3
                                     ('High-Protein', 'Dietary'),  -- ID 4
                                     ('Sugar-Free',   'Dietary');  -- ID 5

-- Healthy Cluster (Canteen 1)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (1, 2), (1, 3);   -- Soraka Salad: Vegan, GF
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (2, 2), (2, 5);   -- Spirit Juice: Vegan, Sugar-Free
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (3, 4);           -- Xayah Wrap: High-Protein

-- Fast Food Cluster (Canteen 1)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (6, 4);           -- Darius Burger: High-Protein
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (9, 1), (9, 4);   -- Kled Tacos: Spicy, High-Protein
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (8, 2);           -- Draven Fries: Vegan

-- Breakfast Cluster (Canteen 1)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (11, 5), (11, 2); -- Piltover Coffee: Sugar-Free, Vegan
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (13, 4);          -- Hammer Sandwich: High-Protein

-- Combo & Special Items (Canteen 1)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (17, 1), (17, 2); -- Chilli Paste: Spicy, Vegan
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (18, 2), (18, 4); -- Veggie Burger: Vegan, High-Protein

-- Healthy Cluster (Canteen 2 — Hex Core Cafe)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (19, 2), (19, 3); -- Hex Core Salad: Vegan, GF
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (20, 2), (20, 5); -- Zaunite Purified Water: Vegan, Sugar-Free
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (21, 4);          -- Ekko Time-Wrap: High-Protein
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (22, 2);          -- Chem-Baron Veggie Bowl: Vegan
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (23, 2), (23, 3); -- Janna Breezy Greens: Vegan, GF

-- Fast Food Cluster (Canteen 2)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (24, 4);          -- Evolution Burger: High-Protein
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (26, 2);          -- Vi Punching Fries: Vegan
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (27, 1), (27, 4); -- Jinx Rocket Tacos: Spicy, High-Protein
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (28, 4);          -- Urgot Grind Burger: High-Protein

-- Breakfast Cluster (Canteen 2)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (29, 5), (29, 2); -- Viktor Black Coffee: Sugar-Free, Vegan
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (31, 4);          -- Academy Breakfast Sandwich: High-Protein

-- Combo & Special Items (Canteen 2)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (34, 1);          -- Zaun Street Noodles: Spicy
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (35, 1), (35, 2); -- Spicy Shroom Skewer: Spicy, Vegan

-- Healthy Cluster (Canteen 3 — Skyline Sips)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (37, 2), (37, 3); -- High-Altitude Green Bowl: Vegan, GF
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (38, 2), (38, 5); -- Cloud Piercer Juice: Vegan, Sugar-Free
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (39, 4);          -- Zephyr Wrap: High-Protein
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (40, 2);          -- Skyline Vegan Platter: Vegan
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (41, 2), (41, 3); -- Aero Salad: Vegan, GF

-- Fast Food Cluster (Canteen 3)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (42, 4);          -- Progress Gate Slider: High-Protein
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (43, 5);          -- Hex-Energy Drink: Sugar-Free
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (44, 2);          -- Gilded Fries: Vegan
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (45, 4);          -- Piltovan Fried Chicken: High-Protein
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (46, 4);          -- Council Smash Burger: High-Protein

-- Breakfast Cluster (Canteen 3)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (47, 5), (47, 2); -- Skyline Espresso: Sugar-Free, Vegan

-- =========================================================================
-- 10. ORDER CUSTOMIZATIONS
-- NOTE: order_item_id values are hardcoded and assume the procedural
-- generation above produces at least 99 OrderItem rows (2000 orders
-- with 1+ items each guarantees this). The specific customization
-- types noted in comments may not match the actual item at that ID.
-- =========================================================================

INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     ( 5, 50.00),    -- Double Meat Patty
                                                                     (12, 15.00),    -- Extra Espresso Shot
                                                                     (22, 25.00),    -- Grilled Chicken on Salad
                                                                     (45, 15.00),    -- Extra Cheese
                                                                     (88,  6.00);    -- Extra Fried Egg

INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     (15, 5.00),     -- Oat Milk
                                                                     (33, 5.00),     -- Gift Box Packaging
                                                                     (67, 3.00),     -- Sugar-Free Syrup
                                                                     (92, 2.00);     -- Iced Coffee Upgrade

INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     ( 8, 0.00),     -- Remove Onions
                                                                     (41, 0.00),     -- Make it Spicy
                                                                     (55, 0.00),     -- No Green Onions
                                                                     (72, 0.00),     -- Extra Dressing
                                                                     (99, 0.00);     -- Gluten-Free Bun

-- =========================================================================
-- 11. PAYMENTS
-- =========================================================================

-- Successful payments for Orders 1-1950
INSERT INTO Payment (user_id, order_id, transaction_type, amount, payment_method, transaction_status, created_at)
SELECT
    o.user_id,
    o.order_id,
    'PAYMENT',
    SUM(oi.subtotal),
    ELT(FLOOR(1 + (RAND() * 3)), 'KRAKENS', 'CREDIT_CARD', 'NFC_CHIP'),
    'SUCCESS',
    o.placed_at
FROM `Order` o
         JOIN OrderItem oi ON o.order_id = oi.order_id
WHERE o.order_id <= 1950
GROUP BY o.order_id, o.user_id, o.placed_at;

-- Failed transactions for Orders 1951-1960
INSERT INTO Payment (user_id, order_id, transaction_type, amount, payment_method, transaction_status, created_at)
SELECT
    o.user_id,
    o.order_id,
    'PAYMENT',
    SUM(oi.subtotal),
    'KRAKENS',
    'FAILED',
    o.placed_at
FROM `Order` o
         JOIN OrderItem oi ON o.order_id = oi.order_id
WHERE o.order_id BETWEEN 1951 AND 1960
GROUP BY o.order_id, o.user_id, o.placed_at;

-- Mark cancelled orders (no payment)
UPDATE `Order` SET order_status = 'CANCELLED' WHERE order_id BETWEEN 1961 AND 1970;

-- Orders in various active states (simulates live system snapshot)
UPDATE `Order` SET order_status = 'PLACED' WHERE order_id BETWEEN 1971 AND 1980;
UPDATE `Order` SET order_status = 'CONFIRMED' WHERE order_id BETWEEN 1981 AND 1985;
UPDATE `Order` SET order_status = 'PREPARING' WHERE order_id BETWEEN 1986 AND 1992;
UPDATE `Order` SET order_status = 'READY' WHERE order_id BETWEEN 1993 AND 2000;

-- Refund for Order 50 is tracked in TransactionHistory (section 14), not here,
-- because Payment enforces a 1:1 relationship with Order.

-- =========================================================================
-- 12. RECOMMENDATIONS
-- =========================================================================

INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (1,  4,  'COLLABORATIVE_FILTERING', 0.95, 'Similar users (Lux, Fiora) bought this',    TRUE,  NOW());
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (21, 9,  'COLLABORATIVE_FILTERING', 0.92, 'Based on your preference for Spicy items',  TRUE,  NOW());
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (41, 11, 'TIME_SENSITIVE',          0.98, 'Morning recommendation: Piltover Coffee',   TRUE,  NOW());

INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (15, 12, 'POPULARITY_TREND', 0.75, 'Top selling dessert this week',      FALSE, NOW());
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (10,  6, 'POPULARITY_TREND', 0.88, 'Most popular item at The Last Drop', TRUE,  NOW());

INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (22, 7, 'ASSOCIATION_RULE', 0.85, 'Frequently bought with Darius Dunk Burger', TRUE, NOW());

INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES ( 5, 17, 'CONTENT_BASED', 0.60, 'Matches your Vegan dietary preference',               FALSE, NOW());

-- =========================================================================
-- 13. REVIEWS
-- expires_at = created_at + 1 HOUR (one-hour submission window, report 3.1)
-- =========================================================================

-- -------------------------------------------------------------------------
-- The Last Drop (cafeteria_id = 1) Reviews
-- Each review uses a subquery to pick a valid order_id for that user+cafeteria.
-- -------------------------------------------------------------------------
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 1, 1, order_id, 5, 'The Soraka Salad was incredibly fresh! Highly recommend.',
        TRUE, 0.95, 'fresh, healthy, delicious', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 1 AND cafeteria_id = 1 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 4, 1, order_id, 5, '...',
        TRUE, 0.80, 'good, quiet', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 4 AND cafeteria_id = 1 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 21, 1, order_id, 4, 'Solid burger. Needs more meat though.',
        TRUE, 0.75, 'meaty, solid, filling', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 21 AND cafeteria_id = 1 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 22, 1, order_id, 5, 'Not as good as me, but the Fries were acceptable.',
        TRUE, 0.85, 'fries, acceptable', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 22 AND cafeteria_id = 1 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 41, 1, order_id, 5, 'The Piltover Coffee is the only thing keeping me awake on patrol.',
        TRUE, 0.98, 'awake, caffeine, essential', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 41 AND cafeteria_id = 1 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 15, 1, order_id, 2, 'The Veggie Burger tasted like straight mushrooms. Not for me.',
        TRUE, -0.65, 'mushrooms, bad taste, soggy',
        DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 1 HOUR
FROM `Order` WHERE user_id = 15 AND cafeteria_id = 1 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 10, 1, order_id, 1, 'Cold and dry. Never ordering this again.',
        TRUE, -0.85, 'cold, dry, worst',
        DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 1 HOUR
FROM `Order` WHERE user_id = 10 AND cafeteria_id = 1 LIMIT 1;

-- Unapproved reviews — pending admin moderation
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 36, 1, order_id, 1, 'SCAM! I DID NOT ORDER THIS! REFUND ME NOW!',
        FALSE, -0.92, 'scam, refund, angry', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 36 AND cafeteria_id = 1 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 17, 1, order_id, 3, 'Food was okay but the delivery was rude.',
        FALSE, -0.34, 'rude, delivery', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 17 AND cafeteria_id = 1 LIMIT 1;

-- -------------------------------------------------------------------------
-- Hex Core Cafe (cafeteria_id = 2) Reviews
-- -------------------------------------------------------------------------
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 6, 2, order_id, 5, 'The Hex Core Salad was divine. Will of the Blades approved.',
        TRUE, 0.92, 'divine, fresh, healthy', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 6 AND cafeteria_id = 2 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 46, 2, order_id, 4, 'Viktor Black Coffee hits different when you are rewinding time.',
        TRUE, 0.82, 'coffee, strong, good', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 46 AND cafeteria_id = 2 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 24, 2, order_id, 3, 'Evolution Burger was decent. I have had better kills... I mean meals.',
        TRUE, 0.10, 'decent, average', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 24 AND cafeteria_id = 2 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 47, 2, order_id, 5, 'Pow-pow loved the Jinx Rocket Tacos! Spicy and explosive!',
        TRUE, 0.96, 'spicy, explosive, amazing', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 47 AND cafeteria_id = 2 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 42, 2, order_id, 4, 'Vi Punching Fries. Solid crunch. Would punch again.',
        TRUE, 0.78, 'crunchy, solid, good', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 42 AND cafeteria_id = 2 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 50, 2, order_id, 2, 'Gearbox Buns were stale. My gears are not happy.',
        TRUE, -0.60, 'stale, disappointing',
        DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 1 HOUR
FROM `Order` WHERE user_id = 50 AND cafeteria_id = 2 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 3, 2, order_id, 5, 'The Chem-Baron Veggie Bowl was a worthy opponent for my appetite.',
        TRUE, 0.90, 'hearty, filling, delicious', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 3 AND cafeteria_id = 2 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 25, 2, order_id, 1, 'Stale Trench Cake lives up to its name. Absolutely terrible.',
        TRUE, -0.89, 'stale, terrible, inedible',
        DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 1 HOUR
FROM `Order` WHERE user_id = 25 AND cafeteria_id = 2 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 44, 2, order_id, 4, 'Academy Breakfast Sandwich fueled my morning adventure. Tasty!',
        TRUE, 0.80, 'tasty, filling, breakfast', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 44 AND cafeteria_id = 2 LIMIT 1;

-- -------------------------------------------------------------------------
-- Skyline Sips (cafeteria_id = 3) Reviews
-- -------------------------------------------------------------------------
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 2, 3, order_id, 5, 'The view from Skyline Sips is almost as radiant as me. Aero Salad was perfect.',
        TRUE, 0.94, 'perfect, view, fresh', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 2 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 21, 3, order_id, 4, 'Council Smash Burger. Big. Heavy. Like my axe. Approved.',
        TRUE, 0.80, 'big, heavy, satisfying', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 21 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 41, 3, order_id, 5, 'Skyline Espresso with a rooftop view. This is how you start a stakeout.',
        TRUE, 0.95, 'espresso, view, perfect', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 41 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 7, 3, order_id, 4, 'The balance of flavours in the High-Altitude Green Bowl was harmonious.',
        TRUE, 0.85, 'balanced, harmonious, healthy', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 7 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 26, 3, order_id, 3, 'Gilded Fries were alright. Nothing to write home to Bilgewater about.',
        TRUE, 0.05, 'average, okay', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 26 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 49, 3, order_id, 5, 'Aristocrat Croissant. Precision baking at its finest.',
        TRUE, 0.93, 'precision, flaky, excellent', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 49 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 27, 3, order_id, 2, 'Overpriced Tap Water. Ten krakens for water? Still a ripoff.',
        TRUE, -0.70, 'overpriced, water, ripoff',
        DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 1 HOUR
FROM `Order` WHERE user_id = 27 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 52, 3, order_id, 4, 'Premium Iced Latte and Macaron Set. The perfect combo for a melody.',
        TRUE, 0.84, 'latte, macaron, combo', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 52 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 30, 3, order_id, 1, 'Piltovan Fried Chicken was raw inside. Unacceptable.',
        TRUE, -0.94, 'raw, unacceptable, dangerous',
        DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY) + INTERVAL 1 HOUR
FROM `Order` WHERE user_id = 30 AND cafeteria_id = 3 LIMIT 1;

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
SELECT 55, 3, order_id, 5, 'Elite Morning Toast with a sunrise view. What more could you want?',
        TRUE, 0.91, 'toast, sunrise, elite', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)
FROM `Order` WHERE user_id = 55 AND cafeteria_id = 3 LIMIT 1;

-- =========================================================================
-- 14. TRANSACTION HISTORY
-- Starting allowance = 100 GK per student, consistent with krakens_balance
-- inserted in section 3. Only STUDENT accounts receive the allowance.
-- =========================================================================

-- Semester start allowance for all students (balance_before = 0 → 100 GK)
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
SELECT
    user_id,
    'DEPOSIT',
    100.00,
    0.00,
    100.00,
    NULL,
    'Semester Start Allowance',
    DATE_SUB(NOW(), INTERVAL 30 DAY)
FROM `User`
WHERE role = 'STUDENT';

-- Refund transaction for Order 50 (tracked here instead of Payment to preserve 1:1)
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
SELECT
    user_id,
    'REFUND',
    total_amount,
    0.00,
    total_amount,
    order_id,
    'Refund approved by Admin',
    DATE_ADD(placed_at, INTERVAL 1 HOUR)
FROM `Order`
WHERE order_id = 50;

-- Failed top-up attempt (error handling demo)
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
VALUES (22, 'DEPOSIT', 1000000.00, 100.00, 100.00, NULL, 'Bank Declined: Insufficient Funds', NOW());