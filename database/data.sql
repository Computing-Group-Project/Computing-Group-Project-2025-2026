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
INSERT INTO Cafeteria (name, description, operating_hours, average_rating) VALUES
                                                                               ('The Last Drop', 'Cozy atmosphere for deep study sessions and artisanal brews.',                  '08:00-22:00', 4.5),  -- ID 1
                                                                               ('Hex Core Cafe', 'Industrial chic meets molecular gastronomy. Fast, efficient, and futuristic.',  '07:00-20:00', 4.2),  -- ID 2
                                                                               ('Skyline Sips',  'Rooftop dining with the best view of the campus.',                             '10:00-18:00', 4.7);  -- ID 3

-- =========================================================================
-- 3. INSERT USERS
-- Students start with 50 GK (Semester Start Allowance).
-- Staff and Admin carry no personal balance.
-- Users who perform staff actions (audit log, discounts) are inserted
-- directly with role = 'STAFF' — no UPDATE statements needed.
-- =========================================================================

-- Cluster A (Healthy Eaters): IDs 1-20 (Demacia/Ionia) — STUDENT
INSERT INTO User (username, role, password_hash, krakens_balance) VALUES
                                                                      ('garen',    'STUDENT', 'pass', 50), ('lux',      'STUDENT', 'pass', 50),
                                                                      ('fiora',    'STUDENT', 'pass', 50), ('sona',     'STUDENT', 'pass', 50),
                                                                      ('vayne',    'STUDENT', 'pass', 50), ('irelia',   'STUDENT', 'pass', 50),
                                                                      ('karma',    'STUDENT', 'pass', 50), ('soraka',   'STUDENT', 'pass', 50),
                                                                      ('shen',     'STUDENT', 'pass', 50), ('akali',    'STUDENT', 'pass', 50),
                                                                      ('jarvan',   'STUDENT', 'pass', 50), ('galio',    'STUDENT', 'pass', 50),
                                                                      ('shyvana',  'STUDENT', 'pass', 50), ('xin_zhao', 'STUDENT', 'pass', 50),
                                                                      ('quinn',    'STUDENT', 'pass', 50), ('kayle',    'STUDENT', 'pass', 50),
                                                                      ('morgana',  'STUDENT', 'pass', 50), ('poppy',    'STUDENT', 'pass', 50),
                                                                      ('taric',    'STUDENT', 'pass', 50), ('kennen',   'STUDENT', 'pass', 50);

-- Cluster B (Fast Food Eaters): IDs 21-40 (Noxus/Bilgewater)
-- darius(21), draven(22)      — STUDENT
-- swain(23)                   — STAFF at The Last Drop (ID 1): performs price changes
-- katarina(24) to sion(25)    — STUDENT
-- IDs 26-35                   — STUDENT
-- twisted_fate(36) to rengar(40) — STUDENT
INSERT INTO User (username, role, password_hash, krakens_balance) VALUES
                                                                      ('darius',        'STUDENT', 'pass', 50),
                                                                      ('draven',        'STUDENT', 'pass', 50),
                                                                      ('swain',         'STAFF',   'pass',  0),   -- ID 23: STAFF, The Last Drop
                                                                      ('katarina',      'STUDENT', 'pass', 50),
                                                                      ('sion',          'STUDENT', 'pass', 50),
                                                                      ('miss_fortune',  'STUDENT', 'pass', 50),
                                                                      ('gangplank',     'STUDENT', 'pass', 50),
                                                                      ('graves',        'STUDENT', 'pass', 50),
                                                                      ('pyke',          'STUDENT', 'pass', 50),
                                                                      ('nautilus',      'STUDENT', 'pass', 50),
                                                                      ('talon',         'STUDENT', 'pass', 50),
                                                                      ('riven',         'STUDENT', 'pass', 50),
                                                                      ('vladimir',      'STUDENT', 'pass', 50),
                                                                      ('kled',          'STUDENT', 'pass', 50),
                                                                      ('samira',        'STUDENT', 'pass', 50),
                                                                      ('twisted_fate',  'STUDENT', 'pass', 50),
                                                                      ('fizz',          'STUDENT', 'pass', 50),
                                                                      ('tahm_kench',    'STUDENT', 'pass', 50),
                                                                      ('illaoi',        'STUDENT', 'pass', 50),
                                                                      ('rengar',        'STUDENT', 'pass', 50);

-- Cluster C (Morning Eaters): IDs 41-60 (Piltover)
-- caitlyn(41), vi(42)         — STUDENT
-- jayce(43)                   — STAFF at Hex Core Cafe (ID 2): adjusts menu prices
-- ezreal(44)                  — STUDENT
-- heimerdinger(45)            — STAFF at Hex Core Cafe (ID 2): approves discounts
-- ekko(46) to gnar(60)        — STUDENT
-- viktor(48)                  — STAFF at Hex Core Cafe (ID 2): extends operating hours
INSERT INTO User (username, role, password_hash, krakens_balance) VALUES
                                                                      ('caitlyn',      'STUDENT', 'pass', 50),
                                                                      ('vi',           'STUDENT', 'pass', 50),
                                                                      ('jayce',        'STAFF',   'pass',  0),   -- ID 43: STAFF, Hex Core Cafe
                                                                      ('ezreal',       'STUDENT', 'pass', 50),
                                                                      ('heimerdinger', 'STAFF',   'pass',  0),   -- ID 45: STAFF, Hex Core Cafe
                                                                      ('ekko',         'STUDENT', 'pass', 50),
                                                                      ('jinx',         'STUDENT', 'pass', 50),
                                                                      ('viktor',       'STAFF',   'pass',  0),   -- ID 48: STAFF, Hex Core Cafe
                                                                      ('camille',      'STUDENT', 'pass', 50),
                                                                      ('blitzcrank',   'STUDENT', 'pass', 50),
                                                                      ('seraphine',    'STUDENT', 'pass', 50),
                                                                      ('orianna',      'STUDENT', 'pass', 50),
                                                                      ('ziggs',        'STUDENT', 'pass', 50),
                                                                      ('corki',        'STUDENT', 'pass', 50),
                                                                      ('rumble',       'STUDENT', 'pass', 50),
                                                                      ('tristana',     'STUDENT', 'pass', 50),
                                                                      ('lulu',         'STUDENT', 'pass', 50),
                                                                      ('teemo',        'STUDENT', 'pass', 50),
                                                                      ('veigar',       'STUDENT', 'pass', 50),
                                                                      ('gnar',         'STUDENT', 'pass', 50);

-- Admin user (ID 61)
INSERT INTO User (username, role, password_hash, krakens_balance) VALUES
    ('admin_user', 'ADMIN', 'pass', 0);   -- ID 61

-- =========================================================================
-- 4. INSERT MENU ITEMS
-- =========================================================================

-- -------------------------------------------------------------------------
-- CANTEEN 1: The Last Drop (cafeteria_id = 1)
-- -------------------------------------------------------------------------

-- Cluster A - Healthy [IDs 1-5]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 1, 'Soraka Star Salad',    1200.00),
                                                                       (1, 1, 'Ionian Spirit Juice',   450.00),
                                                                       (1, 1, 'Xayah Feather Wrap',    850.00),
                                                                       (1, 1, 'Karma Green Bowl',     1100.00),
                                                                       (1, 1, 'Irelia Blade Greens',   950.00);

-- Cluster B - Fast Food [IDs 6-10]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 2, 'Darius Dunk Burger',   1500.00),
                                                                       (1, 4, 'Noxian Coke',           300.00),
                                                                       (1, 2, 'Draven Spinning Fries', 600.00),
                                                                       (1, 2, 'Kled Spicy Tacos',     1300.00),
                                                                       (1, 2, 'Sion Smash Burger',    1600.00);

-- Cluster C - Breakfast [IDs 11-15]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 3, 'Piltover Coffee',        400.00),
                                                                       (1, 3, 'Caitlyn Cupcake',        550.00),
                                                                       (1, 3, 'Jayce Hammer Sandwich',  900.00),
                                                                       (1, 3, 'Yordle Buns',            450.00),
                                                                       (1, 3, 'Progress Day Toast',     600.00);

-- Combo Items [IDs 16-17]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 2, 'Lee Sin Fried Rice',  1100.00),
                                                                       (1, 2, 'Dragon Chilli Paste',  150.00);

-- Failing Item [ID 18]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
    (1, 2, 'Teemo Veggie Burger', 1250.00);

-- -------------------------------------------------------------------------
-- CANTEEN 2: Hex Core Cafe (cafeteria_id = 2)
-- -------------------------------------------------------------------------

-- Cluster A - Healthy [IDs 19-23]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (2, 1, 'Hex Core Salad',         1050.00),
                                                                       (2, 1, 'Zaunite Purified Water',  400.00),
                                                                       (2, 1, 'Ekko Time-Wrap',          900.00),
                                                                       (2, 1, 'Chem-Baron Veggie Bowl', 1150.00),
                                                                       (2, 1, 'Janna Breezy Greens',     950.00);

-- Cluster B - Fast Food [IDs 24-28]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (2, 2, 'Evolution Burger',    1400.00),
                                                                       (2, 4, 'Shimmer Cola',         350.00),
                                                                       (2, 2, 'Vi Punching Fries',    650.00),
                                                                       (2, 2, 'Jinx Rocket Tacos',   1350.00),
                                                                       (2, 2, 'Urgot Grind Burger',  1700.00);

-- Cluster C - Breakfast [IDs 29-33]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (2, 3, 'Viktor Black Coffee',         350.00),
                                                                       (2, 3, 'Heimerdinger Sweet Roll',     500.00),
                                                                       (2, 3, 'Academy Breakfast Sandwich',  950.00),
                                                                       (2, 3, 'Gearbox Buns',               450.00),
                                                                       (2, 3, 'Inventor Toast',             600.00);

-- Combo Items [IDs 34-35]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (2, 2, 'Zaun Street Noodles', 1050.00),
                                                                       (2, 2, 'Spicy Shroom Skewer',  200.00);

-- Failing Item [ID 36]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
    (2, 5, 'Stale Trench Cake',   1100.00);

-- -------------------------------------------------------------------------
-- CANTEEN 3: Skyline Sips (cafeteria_id = 3)
-- -------------------------------------------------------------------------

-- Cluster A - Healthy [IDs 37-41]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (3, 1, 'High-Altitude Green Bowl', 1300.00),
                                                                       (3, 1, 'Cloud Piercer Juice',       500.00),
                                                                       (3, 1, 'Zephyr Wrap',               850.00),
                                                                       (3, 1, 'Skyline Vegan Platter',    1400.00),
                                                                       (3, 1, 'Aero Salad',               1000.00);

-- Cluster B - Fast Food [IDs 42-46]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (3, 2, 'Progress Gate Slider',  1200.00),
                                                                       (3, 4, 'Hex-Energy Drink',       450.00),
                                                                       (3, 2, 'Gilded Fries',           700.00),
                                                                       (3, 2, 'Piltovan Fried Chicken',1500.00),
                                                                       (3, 2, 'Council Smash Burger',  1800.00);

-- Cluster C - Breakfast [IDs 47-51]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (3, 3, 'Skyline Espresso',      450.00),
                                                                       (3, 3, 'Golden Muffin',         600.00),
                                                                       (3, 3, 'Aristocrat Croissant',  750.00),
                                                                       (3, 3, 'Sun-Gate Buns',         500.00),
                                                                       (3, 3, 'Elite Morning Toast',   650.00);

-- Combo Items [IDs 52-53]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (3, 3, 'Premium Iced Latte', 800.00),
                                                                       (3, 5, 'Macaron Set',        400.00);

-- Failing Item [ID 54]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
    (3, 4, 'Overpriced Tap Water', 600.00);

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
                    VALUES (new_order_id, 16, 1, 1100.00, 1100.00);
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, 17, 1, 150.00, 150.00);
END IF;
            ELSEIF rand_cafeteria = 2 THEN
                SET v_item_id = FLOOR(24 + (RAND() * 5));
SELECT base_price INTO v_price FROM MenuItem WHERE item_id = v_item_id;
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, v_item_id, 1, v_price, v_price);
-- APRIORI: Noodles + Skewer (85% co-purchase rate)
IF RAND() < 0.85 THEN
                    INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
                    VALUES (new_order_id, 34, 1, 1050.00, 1050.00);
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, 35, 1, 200.00, 200.00);
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
                VALUES (new_order_id, 52, 1, 800.00, 800.00);
INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
VALUES (new_order_id, 53, 1, 400.00, 400.00);
END IF;
END IF;

        -- ==========================================
        -- TIME DECAY: Failing items lose sales over time
        -- ==========================================
        IF rand_cafeteria = 1 AND days_ago > 20 AND RAND() < 0.3 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, 18, 1, 1250.00, 1250.00);
END IF;

        IF rand_cafeteria = 2 AND days_ago > 15 AND RAND() < 0.4 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, 36, 1, 1100.00, 1100.00);
END IF;

        IF rand_cafeteria = 3 AND days_ago > 10 AND RAND() < 0.5 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, 54, 1, 600.00, 600.00);
END IF;

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
                                                                                                                   (23, 'UPDATE', 'MenuItem',  6, '1500.00', '1650.00', '192.168.1.101', 'SUCCESS'),
                                                                                                                   (23, 'UPDATE', 'MenuItem', 18, '1250.00', '1100.00', '192.168.1.101', 'SUCCESS');

-- Operating hours & price changes in Hex Core Cafe (viktor = 48, jayce = 43, STAFF)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (48, 'UPDATE', 'Cafeteria',  2, '07:00-20:00', '07:30-22:00', '10.0.0.55', 'SUCCESS'),
                                                                                                                   (43, 'UPDATE', 'MenuItem',  13, '900.00',       '950.00',      '10.0.0.42', 'SUCCESS');

-- Stock availability toggles (garen = 1, ekko = 46, STUDENT — self-service stock flags)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   ( 1, 'UPDATE', 'MenuItem', 12, 'TRUE',  'FALSE', '172.16.0.1', 'SUCCESS'),
                                                                                                                   (46, 'UPDATE', 'MenuItem', 12, 'FALSE', 'TRUE',  '172.16.0.2', 'SUCCESS');

-- Discount approvals (heimerdinger = 45, STAFF)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (45, 'CREATE', 'Discount', 101, 'NULL',    '15% OFF', '192.168.0.99', 'SUCCESS'),
                                                                                                                   (45, 'DELETE', 'Discount',  99, '10% OFF', 'NULL',    '192.168.0.99', 'SUCCESS');

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
VALUES (1, 'COMBO_FIXED_PRICE', 1150.00, '[16, 17]', 'Must buy both items', TRUE, 23, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), TRUE);

-- Manual: Hex Core Morning Rush BOGO (jayce = 43) — Viktor Black Coffee (ID 29)
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (2, 'BOGO', 100.00, '[29]', 'Buy 1 Get 1 Free on Viktor Black Coffee', FALSE, 43, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), TRUE);

-- Manual: Progress Day Special — Expired (for inactive discount history demo)
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (2, 'PERCENTAGE', 50.00, '[29, 30, 31]', 'Progress Day Celebration', FALSE, 45, '2025-11-01', '2025-11-02', FALSE);

-- Manual: The Last Drop Happy Hour flat discount on beverages
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (1, 'FIXED_AMOUNT', 200.00, '[7, 2]', 'Order total > 1000', FALSE, 23, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY), TRUE);

-- Manual: Skyline Sips High Roller exclusive (viktor = 48)
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (3, 'PERCENTAGE', 5.00, 'ALL', 'For Gold Tier Users only', FALSE, 48, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), TRUE);

-- =========================================================================
-- 8. MENU ITEM CUSTOMIZATIONS
-- =========================================================================

-- Darius Dunk Burger (Item ID 6)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (6, 'Extra Noxian Cheese', 'ADD',        150.00, TRUE),
                                                                                                                    (6, 'Double Meat Patty',   'ADD',        500.00, TRUE),
                                                                                                                    (6, 'Remove Onions',       'REMOVE',       0.00, TRUE),
                                                                                                                    (6, 'Gluten-Free Bun',     'SUBSTITUTE', 100.00, TRUE);

-- Piltover Coffee (Item ID 11)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (11, 'Oat Milk',                 'SUBSTITUTE',  50.00, TRUE),
                                                                                                                    (11, 'Extra Espresso Shot',      'ADD',         150.00, TRUE),
                                                                                                                    (11, 'Sugar-Free Vanilla Syrup', 'ADD',          30.00, TRUE),
                                                                                                                    (11, 'Iced (Cold Brew)',         'SUBSTITUTE',   20.00, TRUE);

-- Soraka Star Salad (Item ID 1)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (1, 'Add Grilled Chicken', 'ADD', 250.00, TRUE),
                                                                                                                    (1, 'Add Tofu',            'ADD', 200.00, TRUE),
                                                                                                                    (1, 'Extra Dressing',      'ADD',   0.00, TRUE);

-- Lee Sin Fried Rice (Item ID 16)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (16, 'Extra Fried Egg',  'ADD',           60.00, TRUE),
                                                                                                                    (16, 'Make it Spicy',    'MODIFICATION',   0.00, TRUE),
                                                                                                                    (16, 'No Green Onions',  'REMOVE',         0.00, TRUE);

-- Caitlyn Cupcake (Item ID 12)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (12, 'Extra Sprinkles',    'ADD', 10.00, TRUE),
                                                                                                                    (12, 'Gift Box Packaging', 'ADD', 50.00, TRUE);

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

-- =========================================================================
-- 10. ORDER CUSTOMIZATIONS
-- =========================================================================

INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     ( 5, 500.00),   -- Double Meat Patty
                                                                     (12, 150.00),   -- Extra Espresso Shot
                                                                     (22, 250.00),   -- Grilled Chicken on Salad
                                                                     (45, 150.00),   -- Extra Cheese
                                                                     (88,  60.00);   -- Extra Fried Egg

INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     (15, 50.00),    -- Oat Milk
                                                                     (33, 50.00),    -- Gift Box Packaging
                                                                     (67, 30.00),    -- Sugar-Free Syrup
                                                                     (92, 20.00);    -- Iced Coffee Upgrade

INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     ( 8, 0.00),     -- Remove Onions
                                                                     (41, 0.00),     -- Make it Spicy
                                                                     (55, 0.00),     -- No Green Onions
                                                                     (72, 0.00),     -- Extra Dressing
                                                                     (99, 0.00);     -- Gluten-Free Bun

-- =========================================================================
-- 11. PAYMENTS
-- =========================================================================

-- Successful payments for Orders 1-800
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
WHERE o.order_id <= 800
GROUP BY o.order_id, o.user_id, o.placed_at;

-- Failed transactions for Orders 801-810
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
WHERE o.order_id BETWEEN 801 AND 810
GROUP BY o.order_id, o.user_id, o.placed_at;

-- Refund for Order 50
INSERT INTO Payment (user_id, order_id, transaction_type, amount, payment_method, transaction_status, created_at)
SELECT
    user_id,
    order_id,
    'REFUND',
    total_amount,
    'KRAKENS',
    'COMPLETED',
    DATE_ADD(placed_at, INTERVAL 1 HOUR)
FROM `Order`
WHERE order_id = 50;

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
VALUES (75, 12, 'POPULARITY_TREND', 0.75, 'Top selling dessert this week',      FALSE, NOW());
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (88,  6, 'POPULARITY_TREND', 0.88, 'Most popular item at The Last Drop', TRUE,  NOW());

INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (22, 7, 'ASSOCIATION_RULE', 0.85, 'Frequently bought with Darius Dunk Burger', TRUE, NOW());

INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (23, 1,  'EXPLORATORY',   0.45, 'Try something new?',                                  FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY));
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES ( 5, 17, 'CONTENT_BASED', 0.60, 'Matches your Vegan dietary preference',               FALSE, NOW());

-- =========================================================================
-- 13. REVIEWS
-- expires_at = created_at + 1 HOUR (one-hour submission window, report 3.1)
-- =========================================================================

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (1, 1, 5, 5, 'The Soraka Salad was incredibly fresh! Highly recommend.',
        TRUE, 0.95, 'fresh, healthy, delicious', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR));
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (4, 1, 12, 5, '...', TRUE, 0.80, 'good, quiet', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR));

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (21, 1, 25, 4, 'Solid burger. Needs more meat though.',
        TRUE, 0.75, 'meaty, solid, filling', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR));
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (22, 1, 28, 5, 'Not as good as me, but the Fries were acceptable.',
        TRUE, 0.85, 'fries, acceptable', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR));

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (41, 1, 45, 5, 'The Piltover Coffee is the only thing keeping me awake on patrol.',
        TRUE, 0.98, 'awake, caffeine, essential', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR));

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (75, 1, 102, 2, 'The Veggie Burger tasted like straight mushrooms. Not for me.',
        TRUE, 0.30, 'mushrooms, bad taste, soggy',
        DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 1 HOUR);
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (88, 1, 115, 1, 'Cold and dry. Never ordering this again.',
        TRUE, 0.15, 'cold, dry, worst',
        DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 1 HOUR);

-- Unapproved reviews — pending admin moderation
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (36, 1, 200, 1, 'SCAM! I DID NOT ORDER THIS! REFUND ME NOW!',
        FALSE, 0.05, 'scam, refund, angry', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR));
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at, expires_at)
VALUES (17, 1, 205, 3, 'Food was okay but the delivery was rude.',
        FALSE, 0.40, 'rude, delivery', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR));

-- =========================================================================
-- 14. TRANSACTION HISTORY
-- Starting allowance = 50 GK per student, consistent with krakens_balance
-- inserted in section 3. Only STUDENT accounts receive the allowance.
-- =========================================================================

-- Semester start allowance for all students (balance_before = 0 → 50 GK)
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
SELECT
    user_id,
    'DEPOSIT',
    50.00,
    0.00,
    50.00,
    NULL,
    'Semester Start Allowance',
    DATE_SUB(NOW(), INTERVAL 30 DAY)
FROM User
WHERE role = 'STUDENT';

-- Spending history: GK deducted for first 100 successful KRAKENS payments
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
SELECT
    p.user_id,
    'PURCHASE',
    p.amount,
    50.00,
    50.00 - p.amount,
    p.order_id,
    CONCAT('Payment for Order #', p.order_id),
    p.created_at
FROM Payment p
WHERE p.transaction_status = 'SUCCESS'
  AND p.payment_method = 'KRAKENS'
    LIMIT 100;

-- Refund transaction (linked to the refund payment record above)
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
SELECT
    p.user_id,
    'REFUND',
    p.amount,
    0.00,
    p.amount,
    p.order_id,
    'Refund approved by Admin',
    p.created_at
FROM Payment p
WHERE p.transaction_type = 'REFUND';

-- Failed top-up attempt (error handling demo)
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
VALUES (22, 'DEPOSIT', 1000000.00, 50.00, 50.00, NULL, 'Bank Declined: Insufficient Funds', NOW());