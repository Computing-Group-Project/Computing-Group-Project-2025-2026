-- 1. Insert Categories
INSERT INTO Category (name, description) VALUES
                                             ('Healthy/Vegan', 'Plant-based options'),
                                             ('Fast Food', 'Burgers and Fries'),
                                             ('Breakfast', 'Morning staples'),
                                             ('Beverages', 'Drinks'),
                                             ('Desserts', 'Sweets');

-- 2. Insert Cafeterias
INSERT INTO Cafeteria (name, operating_hours, average_rating) VALUES
                                                                  ('The Golden Spatula', '08:00-22:00', 4.8),
                                                                  ('Bilgewater Brews', '10:00-02:00', 4.2);

-- 3. Insert Users (Top 60 defined for Clusters, 40 generic)
-- Cluster A (Healthy): IDs 1-20 (Demacia/Ionia)
INSERT INTO User (username, role, password_hash, krakens_balance) VALUES
                                                                      ('garen', 'STUDENT', 'pass', 500), ('lux', 'STUDENT', 'pass', 500), ('fiora', 'STUDENT', 'pass', 500), ('sona', 'STUDENT', 'pass', 500), ('vayne', 'STUDENT', 'pass', 500),
                                                                      ('irelia', 'STUDENT', 'pass', 500), ('karma', 'STUDENT', 'pass', 500), ('soraka', 'STUDENT', 'pass', 500), ('shen', 'STUDENT', 'pass', 500), ('akali', 'STUDENT', 'pass', 500),
                                                                      ('jarvan', 'STUDENT', 'pass', 500), ('galio', 'STUDENT', 'pass', 500), ('shyvana', 'STUDENT', 'pass', 500), ('xin_zhao', 'STUDENT', 'pass', 500), ('quinn', 'STUDENT', 'pass', 500),
                                                                      ('kayle', 'STUDENT', 'pass', 500), ('morgana', 'STUDENT', 'pass', 500), ('poppy', 'STUDENT', 'pass', 500), ('taric', 'STUDENT', 'pass', 500), ('kennen', 'STUDENT', 'pass', 500);

-- Cluster B (Fast Food): IDs 21-40 (Noxus/Bilgewater)
INSERT INTO User (username, role, password_hash, krakens_balance) VALUES
                                                                      ('darius', 'STUDENT', 'pass', 500), ('draven', 'STUDENT', 'pass', 500), ('swain', 'STUDENT', 'pass', 500), ('katarina', 'STUDENT', 'pass', 500), ('sion', 'STUDENT', 'pass', 500),
                                                                      ('miss_fortune', 'STUDENT', 'pass', 500), ('gangplank', 'STUDENT', 'pass', 500), ('graves', 'STUDENT', 'pass', 500), ('pyke', 'STUDENT', 'pass', 500), ('nautilus', 'STUDENT', 'pass', 500),
                                                                      ('talon', 'STUDENT', 'pass', 500), ('riven', 'STUDENT', 'pass', 500), ('vladimir', 'STUDENT', 'pass', 500), ('kled', 'STUDENT', 'pass', 500), ('samira', 'STUDENT', 'pass', 500),
                                                                      ('twisted_fate', 'STUDENT', 'pass', 500), ('fizz', 'STUDENT', 'pass', 500), ('tahm_kench', 'STUDENT', 'pass', 500), ('illaoi', 'STUDENT', 'pass', 500), ('rengar', 'STUDENT', 'pass', 500);

-- Cluster C (Morning): IDs 41-60 (Piltover)
INSERT INTO User (username, role, password_hash, krakens_balance) VALUES
                                                                      ('caitlyn', 'STUDENT', 'pass', 500), ('vi', 'STUDENT', 'pass', 500), ('jayce', 'STUDENT', 'pass', 500), ('ezreal', 'STUDENT', 'pass', 500), ('heimerdinger', 'STUDENT', 'pass', 500),
                                                                      ('ekko', 'STUDENT', 'pass', 500), ('jinx', 'STUDENT', 'pass', 500), ('viktor', 'STUDENT', 'pass', 500), ('camille', 'STUDENT', 'pass', 500), ('blitzcrank', 'STUDENT', 'pass', 500),
                                                                      ('seraphine', 'STUDENT', 'pass', 500), ('orianna', 'STUDENT', 'pass', 500), ('ziggs', 'STUDENT', 'pass', 500), ('corki', 'STUDENT', 'pass', 500), ('rumble', 'STUDENT', 'pass', 500),
                                                                      ('tristana', 'STUDENT', 'pass', 500), ('lulu', 'STUDENT', 'pass', 500), ('teemo', 'STUDENT', 'pass', 500), ('veigar', 'STUDENT', 'pass', 500), ('gnar', 'STUDENT', 'pass', 500);

-- 4. Insert Menu Items (Strict IDs for AI Logic)
-- CLUSTER A ITEMS (Healthy) [IDs 1-5]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 1, 'Soraka Star Salad', 1200.00),
                                                                       (1, 1, 'Ionian Spirit Juice', 450.00),
                                                                       (1, 1, 'Xayah Feather Wrap', 850.00),
                                                                       (1, 1, 'Karma Green Bowl', 1100.00),
                                                                       (1, 1, 'Irelia Blade Greens', 950.00);

-- CLUSTER B ITEMS (Fast Food) [IDs 6-10]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 2, 'Darius Dunk Burger', 1500.00),
                                                                       (1, 4, 'Noxian Coke', 300.00),
                                                                       (1, 2, 'Draven Spinning Fries', 600.00),
                                                                       (1, 2, 'Kled Spicy Tacos', 1300.00),
                                                                       (1, 2, 'Sion Smash Burger', 1600.00);

-- CLUSTER C ITEMS (Breakfast) [IDs 11-15]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 3, 'Piltover Coffee', 400.00),
                                                                       (1, 3, 'Caitlyn Cupcake', 550.00),
                                                                       (1, 3, 'Jayce Hammer Sandwich', 900.00),
                                                                       (1, 3, 'Yordle Buns', 450.00),
                                                                       (1, 3, 'Progress Day Toast', 600.00);

-- COMBO ITEMS (Fried Rice + Paste) [IDs 16-17]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
                                                                       (1, 2, 'Lee Sin Fried Rice', 1100.00),
                                                                       (1, 2, 'Dragon Chilli Paste', 150.00);

-- FAILING ITEM (Declining Sales) [ID 18]
INSERT INTO MenuItem (cafeteria_id, category_id, name, base_price) VALUES
    (1, 2, 'Teemo Veggie Burger', 1250.00);

----------------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS GenerateData;

DELIMITER $$

CREATE PROCEDURE GenerateData()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE rand_user INT;
    DECLARE rand_item INT;
    DECLARE new_order_id INT;
    DECLARE order_date TIMESTAMP;
    DECLARE days_ago INT;

    WHILE i <= 1000 DO
        -- 1. Pick a User (1-60 are clustered, 61+ are hypothetical randoms)
        SET rand_user = FLOOR(1 + (RAND() * 60));

        -- 2. Determine Date (Spread over last 30 days)
        SET days_ago = FLOOR(RAND() * 30);
        SET order_date = DATE_SUB(NOW(), INTERVAL days_ago DAY);

        -- 3. Create Order Header
INSERT INTO `Order` (user_id, cafeteria_id, order_status, placed_at)
VALUES (rand_user, 1, 'COMPLETED', order_date);

SET new_order_id = LAST_INSERT_ID();

        -- 4. INSERT ITEMS BASED ON AI PATTERNS

        -- CLUSTER A: Healthy Eaters (User IDs 1-20) -> Buy Items 1-5
        IF rand_user <= 20 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, FLOOR(1 + (RAND() * 5)), 1, 500, 500);

        -- CLUSTER B: Fast Food (User IDs 21-40) -> Buy Items 6-10
        ELSEIF rand_user <= 40 THEN
            -- Add Main Item (Burger/Fries)
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, FLOOR(6 + (RAND() * 5)), 1, 500, 500);

            -- APRIORI TRICK: If they bought Item 6 (Burger), 80% chance to add Item 7 (Coke)
            -- (Note: Since we are inserting random 6-10, we simply force Coke 50% of time for this cluster for simplicity)
            IF RAND() < 0.8 THEN
                 INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
                 VALUES (new_order_id, 7, 1, 300, 300);
END IF;

        -- CLUSTER C: Morning (User IDs 41-60) -> Buy Items 11-15
        ELSEIF rand_user <= 60 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, FLOOR(11 + (RAND() * 5)), 1, 500, 500);
END IF;

        -- 5. TREND TRICK (Declining Sales for Item 18)
        -- If the order is OLD (>20 days ago), 30% chance to buy Veggie Burger
        -- If the order is NEW (<7 days ago), 0% chance to buy Veggie Burger
        IF days_ago > 20 AND RAND() < 0.3 THEN
            INSERT INTO OrderItem (order_id, item_id, quantity, unit_price, subtotal)
            VALUES (new_order_id, 18, 1, 1250, 1250);
END IF;

        SET i = i + 1;
END WHILE;
END$$

DELIMITER ;

-- Run the generator
CALL GenerateData();

--------------------------------------------------------------------------------------------------

-- 1. Rename "The Golden Spatula" to "The Last Drop" (Preserves ID 1 and its Menu Items)
UPDATE Cafeteria
SET name = 'The Last Drop',
    description = 'The undercitys finest. Watch out for Shimmer.',
    operating_hours = '18:00-06:00'
WHERE name = 'The Golden Spatula';

-- 2. Rename "Bilgewater Brews" to "Hex Core Cafe" (Preserves ID 2)
UPDATE Cafeteria
SET name = 'Hex Core Cafe',
    description = 'Powered by glorious evolution.',
    operating_hours = '08:00-20:00'
WHERE name = 'Bilgewater Brews';

-- 3. Add the new "Skyline Sips"
INSERT INTO Cafeteria (name, description, operating_hours, average_rating)
VALUES ('Skyline Sips', 'High-end drinks with a view of the Progress Gate.', '07:00-19:00', 4.9);


---------------------------------------------------------------------------------------------------------

-- 1. Price Hikes in "The Last Drop" (Silco/Swain raising prices)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (23, 'UPDATE', 'MenuItem', 6, '1500.00', '1650.00', '192.168.1.101', 'SUCCESS'), -- Swain raising Darius Burger price
                                                                                                                   (23, 'UPDATE', 'MenuItem', 18, '1250.00', '1100.00', '192.168.1.101', 'SUCCESS'); -- Swain lowering Veggie Burger (failing item)

-- 2. Operating Hours Change for "Hex Core Cafe" (Viktor/Jayce optimizing efficiency)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (48, 'UPDATE', 'Cafeteria', 2, '08:00-20:00', '07:30-22:00', '10.0.0.55', 'SUCCESS'), -- Viktor extending hours
                                                                                                                   (43, 'UPDATE', 'MenuItem', 13, '900.00', '950.00', '10.0.0.42', 'SUCCESS'); -- Jayce adjusting Hammer Sandwich price

-- 3. Menu Item Availability Toggles (Running out of stock)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (1, 'UPDATE', 'MenuItem', 12, 'TRUE', 'FALSE', '172.16.0.1', 'SUCCESS'), -- Garen marking Cupcakes out of stock
                                                                                                                   (46, 'UPDATE', 'MenuItem', 12, 'FALSE', 'TRUE', '172.16.0.2', 'SUCCESS'); -- Ekko restocking Cupcakes (Rewind?)

-- 4. Discount Approvals (Heimerdinger approving Student Budget deals)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (45, 'CREATE', 'Discount', 101, 'NULL', '15% OFF', '192.168.0.99', 'SUCCESS'), -- Heimerdinger approving discount
                                                                                                                   (45, 'DELETE', 'Discount', 99, '10% OFF', 'NULL', '192.168.0.99', 'SUCCESS'); -- Heimerdinger removing old promo

-- 5. Suspicious Login Attempt (Failed Admin Access)
INSERT INTO AuditLog (user_id, action_type, target_table, target_id, old_value, new_value, ip_address, status) VALUES
                                                                                                                   (36, 'LOGIN_ATTEMPT', 'User', 36, 'NULL', 'NULL', '45.33.22.11', 'FAILURE'), -- Twisted Fate failing to hack admin
                                                                                                                   (36, 'LOGIN_ATTEMPT', 'User', 36, 'NULL', 'NULL', '45.33.22.11', 'FAILURE'),
                                                                                                                   (10, 'LOGIN_ATTEMPT', 'User', 10, 'NULL', 'NULL', '192.168.1.5', 'SUCCESS'); -- Akali logging in successfully


---------------------------------------------------------------------------------------------------------------------
-- 1. AI-Detected "Failing Item" Rescue (Teemo Veggie Burger)
-- Logic: The AI noticed sales dropped for Item 18, so it auto-suggested a 20% discount.
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (1, 'PERCENTAGE', 20.00, '[18]', 'Min Order Value: 0', TRUE, 23, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), TRUE);

-- 2. AI-Detected "Combo Deal" (Fried Rice + Chilli Paste)
-- Logic: Apriori algorithm found these items are bought together often.
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (1, 'COMBO_FIXED_PRICE', 1150.00, '[16, 17]', 'Must buy both items', TRUE, 23, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), TRUE);

-- 3. Hex Core "Morning Rush" (Manual Promo by Jayce)
-- Logic: A standard Buy-One-Get-One for Coffee to boost morning traffic.
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (2, 'BOGO', 100.00, '[11]', 'Buy 1 Get 1 Free on Piltover Coffee', FALSE, 43, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), TRUE);

-- 4. "Progress Day" Special (Expired)
-- Logic: Shows your system can handle old, inactive discounts in the history log.
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (2, 'PERCENTAGE', 50.00, '[11, 12, 13]', 'Progress Day Celebration', FALSE, 45, '2025-11-01', '2025-11-02', FALSE);

-- 5. The Last Drop "Happy Hour"
-- Logic: A flat discount on beverages.
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (1, 'FIXED_AMOUNT', 200.00, '[7, 2]', 'Order total > 1000', FALSE, 23, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY), TRUE);

-- 6. Skyline Sips "High Roller" Exclusive
-- Logic: A very small discount for high-end users, manually added.
INSERT INTO Discount (cafeteria_id, discount_type, discount_value, applicable_items, requirements, ai_generated, approved_by, start_date, end_date, is_active)
VALUES (3, 'PERCENTAGE', 5.00, 'ALL', 'For Gold Tier Users only', FALSE, 48, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), TRUE);

------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Burger Customizations (For Item ID 6: Darius Dunk Burger)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (6, 'Extra Noxian Cheese', 'ADD', 150.00, TRUE),
                                                                                                                    (6, 'Double Meat Patty', 'ADD', 500.00, TRUE),
                                                                                                                    (6, 'Remove Onions', 'REMOVE', 0.00, TRUE),
                                                                                                                    (6, 'Gluten-Free Bun', 'SUBSTITUTE', 100.00, TRUE);

-- 2. Coffee Customizations (For Item ID 11: Piltover Coffee)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (11, 'Oat Milk', 'SUBSTITUTE', 50.00, TRUE),
                                                                                                                    (11, 'Extra Espresso Shot', 'ADD', 150.00, TRUE),
                                                                                                                    (11, 'Sugar-Free Vanilla Syrup', 'ADD', 30.00, TRUE),
                                                                                                                    (11, 'Iced (Cold Brew)', 'SUBSTITUTE', 20.00, TRUE);

-- 3. Salad Customizations (For Item ID 1: Soraka Star Salad)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (1, 'Add Grilled Chicken', 'ADD', 250.00, TRUE),
                                                                                                                    (1, 'Add Tofu', 'ADD', 200.00, TRUE),
                                                                                                                    (1, 'Extra Dressing', 'ADD', 0.00, TRUE);

-- 4. Fried Rice Customizations (For Item ID 16: Lee Sin Fried Rice)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (16, 'Extra Fried Egg', 'ADD', 60.00, TRUE),
                                                                                                                    (16, 'Make it Spicy', 'MODIFICATION', 0.00, TRUE),
                                                                                                                    (16, 'No Green Onions', 'REMOVE', 0.00, TRUE);

-- 5. Cupcake Customizations (For Item ID 12: Caitlyn Cupcake)
INSERT INTO MenuItemCustomization (item_id, ingredient_name, modification_type, price_adjustment, is_available) VALUES
                                                                                                                    (12, 'Extra Sprinkles', 'ADD', 10.00, TRUE),
                                                                                                                    (12, 'Gift Box Packaging', 'ADD', 50.00, TRUE);

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Safety First: Turn off checks to clear old data
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Clear the tables so we start fresh and IDs align perfectly
TRUNCATE TABLE MenuItemTag;
TRUNCATE TABLE Tag;

-- 3. Turn checks back on
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Create the Tags (This ensures ID 1 = Spicy, ID 2 = Vegan, etc.)
INSERT INTO Tag (name, tag_type) VALUES
                                     ('Spicy', 'Flavor'),        -- ID 1
                                     ('Vegan', 'Dietary'),       -- ID 2
                                     ('Gluten-Free', 'Dietary'), -- ID 3
                                     ('High-Protein', 'Dietary'),-- ID 4
                                     ('Sugar-Free', 'Dietary');  -- ID 5

-- 5. Now insert the Links (This will work now that the Tags exist)
-- Tagging the Healthy Cluster
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (1, 2), (1, 3); -- Soraka Salad (Vegan, GF)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (2, 2), (2, 5); -- Spirit Juice (Vegan, Sugar-Free)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (3, 4);         -- Xayah Wrap (High-Protein)

-- Tagging the Fast Food Cluster
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (6, 4);         -- Darius Burger (High-Protein)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (9, 1), (9, 4); -- Kled Tacos (Spicy, High-Protein)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (8, 2);         -- Draven Fries (Vegan)

-- Tagging the Breakfast Cluster
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (11, 5), (11, 2); -- Coffee (Sugar-Free, Vegan)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (13, 4);          -- Hammer Sandwich (High-Protein)

-- Tagging the Special Items
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (17, 1), (17, 2); -- Chilli Paste (Spicy, Vegan)
INSERT INTO MenuItemTag (item_id, tag_id) VALUES (18, 2), (18, 4); -- Veggie Burger (Vegan, High-Protein)

------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Adding customizations to specific Order Items
-- These simulate users clicking "Add Extra Cheese" or "No Ice"

-- 1. High Value Add-ons (e.g., Extra Meat, Extra Shot)
INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     (5, 500.00),  -- OrderItem 5: Added Double Meat (+500)
                                                                     (12, 150.00), -- OrderItem 12: Added Extra Espresso Shot (+150)
                                                                     (22, 250.00), -- OrderItem 22: Added Grilled Chicken to Salad (+250)
                                                                     (45, 150.00), -- OrderItem 45: Extra Cheese (+150)
                                                                     (88, 60.00);  -- OrderItem 88: Extra Fried Egg (+60)

-- 2. Small Upcharges (e.g., Oat Milk, Takeaway Box)
INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     (15, 50.00),  -- Oat Milk Substitute (+50)
                                                                     (33, 50.00),  -- Gift Box Packaging (+50)
                                                                     (67, 30.00),  -- Sugar-Free Syrup (+30)
                                                                     (92, 20.00);  -- Iced Coffee Upgrade (+20)

-- 3. Free Modifications (e.g., "No Onions", "Extra Spicy")
-- These are important to show your system handles 0.00 cost changes
INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES
                                                                     (8, 0.00),    -- Remove Onions
                                                                     (41, 0.00),   -- Make it Spicy
                                                                     (55, 0.00),   -- No Green Onions
                                                                     (72, 0.00),   -- Extra Dressing (Free)
                                                                     (99, 0.00);   -- Gluten-Free Bun (No extra charge in this cafe)

-- 4. Negative Adjustments (Rare, but good for testing refunds/removals if supported)
-- (Only add if your logic supports it, otherwise treat as 0)
-- INSERT INTO OrderCustomization (order_item_id, price_adjustment) VALUES (105, -50.00);

-------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Generate Successful Payments for the first 800 Orders
-- We calculate the sum of items (oi.subtotal) to get the correct amount.
INSERT INTO Payment (user_id, order_id, transaction_type, amount, payment_method, transaction_status, created_at)
SELECT
    o.user_id,
    o.order_id,
    'PAYMENT',
    SUM(oi.subtotal), -- Calculates the actual total price of items in the order
    ELT(FLOOR(1 + (RAND() * 3)), 'KRAKENS', 'CREDIT_CARD', 'NFC_CHIP'), -- Randomly picks a method
    'SUCCESS',
    o.placed_at -- Matches the payment timestamp to the order timestamp
FROM `Order` o
         JOIN OrderItem oi ON o.order_id = oi.order_id
WHERE o.order_id <= 800 -- We leave some orders unpaid for testing "Pending" status
GROUP BY o.order_id;

-- 2. Create some "Failed" Transactions (Good for demoing error handling)
-- These are for Orders 801-810
INSERT INTO Payment (user_id, order_id, transaction_type, amount, payment_method, transaction_status, created_at)
SELECT
    o.user_id,
    o.order_id,
    'PAYMENT',
    SUM(oi.subtotal),
    'KRAKENS',
    'FAILED', -- Payment rejected
    o.placed_at
FROM `Order` o
         JOIN OrderItem oi ON o.order_id = oi.order_id
WHERE o.order_id BETWEEN 801 AND 810
GROUP BY o.order_id;

-- 3. Create a "Refund" example (Good for Admin demo)
-- Refund for Order 50
INSERT INTO Payment (user_id, order_id, transaction_type, amount, payment_method, transaction_status, created_at)
SELECT
    user_id,
    order_id,
    'REFUND',
    500.00, -- Partial refund
    'KRAKENS',
    'COMPLETED',
    DATE_ADD(placed_at, INTERVAL 1 HOUR) -- Refund happened 1 hour later
FROM `Order`
WHERE order_id = 50;

-- 4. BONUS: Update the 'Order' table totals
-- Since we calculated the totals for payments, we should ensure the Order table matches.
UPDATE `Order` o
    JOIN (
    SELECT order_id, SUM(subtotal) as total_val
    FROM OrderItem
    GROUP BY order_id
    ) vals ON o.order_id = vals.order_id
    SET o.total_amount = vals.total_val;

----------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Successful AI Matches (High Confidence, User Clicked)
-- Cluster A (Healthy): User 1 (Garen) recommended Item 4 (Karma Green Bowl)
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (1, 4, 'COLLABORATIVE_FILTERING', 0.95, 'Similar users (Lux, Fiora) bought this', TRUE, NOW());

-- Cluster B (Fast Food): User 21 (Darius) recommended Item 9 (Kled Spicy Tacos)
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (21, 9, 'COLLABORATIVE_FILTERING', 0.92, 'Based on your love for Spicy items', TRUE, NOW());

-- Cluster C (Morning): User 41 (Caitlyn) recommended Item 11 (Piltover Coffee)
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (41, 11, 'TIME_SENSITIVE', 0.98, 'It is morning time!', TRUE, NOW());

-- 2. "Trending Now" Recommendations (Generic for Random Users)
-- User 75 (Random) recommended Item 12 (Cupcake)
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (75, 12, 'POPULARITY_TREND', 0.75, 'Top selling dessert this week', FALSE, NOW());

-- User 88 (Random) recommended Item 6 (Darius Burger)
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (88, 6, 'POPULARITY_TREND', 0.88, 'Most popular item in Hex Core Cafe', TRUE, NOW());

-- 3. Cross-Selling (The "Combo" Logic)
-- User 22 (Draven) bought Burger, recommending Coke
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (22, 7, 'ASSOCIATION_RULE', 0.85, 'Frequently bought with Darius Dunk Burger', TRUE, NOW());

-- 4. Missed Opportunities (Low Confidence or Ignored)
-- AI tried to recommend a Salad to a Fast Food eater (Swain)
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (23, 1, 'EXPLORATORY', 0.45, 'Try something new?', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 5. Context-Aware Recommendations
-- User 5 (Vayne) recommended "Spicy" because they usually eat "Healthy" but might want variety
INSERT INTO Recommendation (user_id, item_id, recommendation_type, confidence_score, context_data, clicked, shown_at)
VALUES (5, 17, 'CONTENT_BASED', 0.60, 'You like Vegan items, try this Spicy Vegan paste', FALSE, NOW());

-----------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Cluster A (Healthy) - Glowing Reviews for Salads
-- User 1 (Garen) reviewing Order 5 (Assumed Order ID)
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (1, 1, 5, 5, 'The Soraka Salad was incredibly fresh! Demacia approves.', TRUE, 0.95, 'fresh, healthy, delicious', NOW());

-- User 4 (Sona) - Silent but happy (High rating, short text)
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (4, 1, 12, 5, '...', TRUE, 0.80, 'good, quiet', NOW());

-- 2. Cluster B (Fast Food) - Reviews for Burgers
-- User 21 (Darius) reviewing Order 25
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (21, 1, 25, 4, 'Solid burger. Needs more meat though.', TRUE, 0.75, 'meaty, solid, filling', NOW());

-- User 22 (Draven) - Egotistical Review
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (22, 1, 28, 5, 'Not as good as me, but the Fries were acceptable.', TRUE, 0.85, 'fries, acceptable', NOW());

-- 3. Cluster C (Morning) - Coffee Reviews
-- User 41 (Caitlyn) reviewing Order 45
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (41, 1, 45, 5, 'The Piltover Coffee is the only thing keeping me awake on patrol.', TRUE, 0.98, 'awake, caffeine, essential', NOW());

-- 4. The "Failing Item" Complaints (Teemo Veggie Burger)
-- This justifies why the sales dropped!
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (75, 1, 102, 2, 'The Veggie Burger tasted like straight mushrooms. Not for me.', TRUE, 0.30, 'mushrooms, bad taste, soggy', DATE_SUB(NOW(), INTERVAL 5 DAY));

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (88, 1, 115, 1, 'Cold and dry. Never ordering item 18 again.', TRUE, 0.15, 'cold, dry, worst', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- 5. Moderation Queue (Unapproved / Toxic Reviews)
-- Good for showing Admin capabilities
INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (36, 1, 200, 1, 'SCAM! I DID NOT ORDER THIS! REFUND ME NOW!', FALSE, 0.05, 'scam, refund, angry', NOW());

INSERT INTO Review (user_id, cafeteria_id, order_id, star_rating, review_text, is_approved, sentiment_score, keywords, created_at)
VALUES (17, 1, 205, 3, 'Food was okay but the delivery yordle was rude.', FALSE, 0.40, 'rude, delivery', NOW());

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- 1. Initial "Top Up" for all Users (Giving them money to start)
-- Logic: Everyone gets 5000 Krakens to start the semester.
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
SELECT
    user_id,
    'DEPOSIT',
    5000.00,
    0.00,
    5000.00,
    NULL,
    'Semester Start Allowance',
    DATE_SUB(NOW(), INTERVAL 30 DAY) -- Happened 30 days ago
FROM User;

-- 2. Spending History (Linking to your Orders)
-- Logic: We take all SUCCESSFUL payments and create a 'DEBIT' record.
-- We approximate the balance logic for the demo (Start - Amount).
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
SELECT
    p.user_id,
    'PURCHASE',
    p.amount,
    5000.00, -- Assuming they started with 5000
    5000.00 - p.amount, -- New Balance
    p.order_id, -- Linking to the Order
    CONCAT('Payment for Order #', p.order_id),
    p.created_at
FROM Payment p
WHERE p.transaction_status = 'SUCCESS'
    LIMIT 100; -- Just doing first 100 for cleaner demo data

-- 3. The Refund Transaction (Matching the Refund in Payment Table)
-- Logic: User gets money BACK.
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
SELECT
    p.user_id,
    'REFUND',
    p.amount,
    4500.00, -- Arbitrary balance at that moment
    4500.00 + p.amount, -- Balance increases
    p.order_id,
    'Refund approved by Admin',
    p.created_at
FROM Payment p
WHERE p.transaction_type = 'REFUND';

-- 4. A "Failed" Top-Up (Good for error handling demo)
INSERT INTO TransactionHistory (user_id, transaction_type, amount, balance_before, balance_after, reference_id, description, created_at)
VALUES
    (22, 'DEPOSIT', 1000000.00, 500.00, 500.00, NULL, 'Bank Declined: Insufficient Funds', NOW());