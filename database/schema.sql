CREATE TABLE Category (
                          category_id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(100) NOT NULL,
                          description TEXT
);

CREATE TABLE Tag (
                     tag_id INT AUTO_INCREMENT PRIMARY KEY,
                     name VARCHAR(100) NOT NULL,
                     tag_type VARCHAR(50)
);

CREATE TABLE Cafeteria (
                           cafeteria_id INT AUTO_INCREMENT PRIMARY KEY,
                           name VARCHAR(100) NOT NULL,
                           description TEXT,
                           operating_hours VARCHAR(100),
                           average_rating DECIMAL(3,2),
                           total_reviews INT DEFAULT 0,
                           is_active BOOLEAN DEFAULT TRUE,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `User` (
                      user_id INT AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(100) NOT NULL UNIQUE,
                      role ENUM('STUDENT','STAFF','ADMIN') NOT NULL,
                      password_hash VARCHAR(255) NOT NULL,
                      krakens_balance DECIMAL(10,2) DEFAULT 0,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      last_login TIMESTAMP NULL
);

CREATE TABLE Student (
                         user_id INT PRIMARY KEY,
                         dietary_preferences VARCHAR(255),
                         university_id VARCHAR(50),
                         FOREIGN KEY (user_id) REFERENCES `User`(user_id)
);

CREATE TABLE Staff (
                       user_id INT PRIMARY KEY,
                       assigned_cafeteria_id INT NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES `User`(user_id),
                       FOREIGN KEY (assigned_cafeteria_id) REFERENCES Cafeteria(cafeteria_id)
);

CREATE TABLE Admin (
                       user_id INT PRIMARY KEY,
                       FOREIGN KEY (user_id) REFERENCES `User`(user_id)
);

CREATE TABLE MenuItem (
                          item_id INT AUTO_INCREMENT PRIMARY KEY,
                          cafeteria_id INT NOT NULL,
                          category_id INT NOT NULL,
                          name VARCHAR(100) NOT NULL,
                          description TEXT,
                          base_price DECIMAL(10,2) NOT NULL,
                          image_url VARCHAR(255),
                          preparation_time INT,
                          is_available BOOLEAN DEFAULT TRUE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (cafeteria_id) REFERENCES Cafeteria(cafeteria_id),
                          FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE AuditLog (
                          log_id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT NOT NULL,
                          action_type VARCHAR(50) NOT NULL,
                          target_table VARCHAR(100),
                          target_id INT,
                          old_value TEXT,
                          new_value TEXT,
                          ip_address VARCHAR(45),
                          status VARCHAR(50),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES `User`(user_id)
);

CREATE TABLE TransactionHistory (
                                    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                                    user_id INT NOT NULL,
                                    transaction_type VARCHAR(50),
                                    amount DECIMAL(10,2),
                                    balance_before DECIMAL(10,2),
                                    balance_after DECIMAL(10,2),
                                    reference_id INT,
                                    description TEXT,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    FOREIGN KEY (user_id) REFERENCES `User`(user_id)
);

CREATE TABLE `Order` (
                         order_id INT AUTO_INCREMENT PRIMARY KEY,
                         user_id INT NOT NULL,
                         cafeteria_id INT NOT NULL,
                         order_status VARCHAR(50),
                         total_amount DECIMAL(10,2),
                         placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         confirmed_at TIMESTAMP NULL,
                         completed_at TIMESTAMP NULL,
                         special_instructions TEXT,
                         FOREIGN KEY (user_id) REFERENCES `User`(user_id),
                         FOREIGN KEY (cafeteria_id) REFERENCES Cafeteria(cafeteria_id)
);

CREATE TABLE Payment (
                         payment_id INT AUTO_INCREMENT PRIMARY KEY,
                         user_id INT NOT NULL,
                         order_id INT NOT NULL,
                         transaction_type VARCHAR(50),
                         amount DECIMAL(10,2),
                         payment_method VARCHAR(50),
                         transaction_status VARCHAR(50),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         UNIQUE KEY (order_id),
                         FOREIGN KEY (user_id) REFERENCES `User`(user_id),
                         FOREIGN KEY (order_id) REFERENCES `Order`(order_id)
);

CREATE TABLE Review (
                        review_id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        cafeteria_id INT NOT NULL,
                        order_id INT NOT NULL,
                        star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
                        review_text TEXT,
                        is_approved BOOLEAN DEFAULT FALSE,
                        sentiment_score DECIMAL(3,2),
                        keywords TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        expires_at TIMESTAMP NULL,
                        UNIQUE KEY (order_id),
                        FOREIGN KEY (user_id) REFERENCES `User`(user_id),
                        FOREIGN KEY (cafeteria_id) REFERENCES Cafeteria(cafeteria_id),
                        FOREIGN KEY (order_id) REFERENCES `Order`(order_id)
);

CREATE TABLE Discount (
                          discount_id INT AUTO_INCREMENT PRIMARY KEY,
                          cafeteria_id INT NOT NULL,
                          discount_type VARCHAR(50),
                          discount_value DECIMAL(10,2),
                          applicable_items TEXT,
                          requirements TEXT,
                          ai_generated BOOLEAN DEFAULT FALSE,
                          approved_by INT,
                          start_date DATE,
                          end_date DATE,
                          is_active BOOLEAN DEFAULT TRUE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (cafeteria_id) REFERENCES Cafeteria(cafeteria_id),
                          FOREIGN KEY (approved_by) REFERENCES `User`(user_id)
);

CREATE TABLE Recommendation (
                                recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
                                user_id INT NOT NULL,
                                item_id INT NOT NULL,
                                recommendation_type VARCHAR(50),
                                confidence_score DECIMAL(3,2),
                                context_data TEXT,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                shown_at TIMESTAMP NULL,
                                clicked BOOLEAN DEFAULT FALSE,
                                FOREIGN KEY (user_id) REFERENCES `User`(user_id),
                                FOREIGN KEY (item_id) REFERENCES MenuItem(item_id)
);

CREATE TABLE OrderItem (
                           order_item_id INT AUTO_INCREMENT PRIMARY KEY,
                           order_id INT NOT NULL,
                           item_id INT NOT NULL,
                           quantity INT NOT NULL,
                           unit_price DECIMAL(10,2),
                           subtotal DECIMAL(10,2),
                           FOREIGN KEY (order_id) REFERENCES `Order`(order_id),
                           FOREIGN KEY (item_id) REFERENCES MenuItem(item_id)
);

CREATE TABLE MenuItemTag (
                             item_tag_id INT AUTO_INCREMENT PRIMARY KEY,
                             item_id INT NOT NULL,
                             tag_id INT NOT NULL,
                             FOREIGN KEY (item_id) REFERENCES MenuItem(item_id),
                             FOREIGN KEY (tag_id) REFERENCES Tag(tag_id)
);

CREATE TABLE MenuItemCustomization (
                                       customization_id INT AUTO_INCREMENT PRIMARY KEY,
                                       item_id INT NOT NULL,
                                       ingredient_name VARCHAR(100),
                                       modification_type VARCHAR(50),
                                       price_adjustment DECIMAL(10,2),
                                       is_available BOOLEAN DEFAULT TRUE,
                                       FOREIGN KEY (item_id) REFERENCES MenuItem(item_id)
);

CREATE TABLE OrderCustomization (
                                    order_customization_id INT AUTO_INCREMENT PRIMARY KEY,
                                    order_item_id INT NOT NULL,
                                    price_adjustment DECIMAL(10,2),
                                    FOREIGN KEY (order_item_id) REFERENCES OrderItem(order_item_id)
);

-- Performance indexes
CREATE INDEX idx_transaction_history_user_created ON TransactionHistory(user_id, created_at);
CREATE INDEX idx_order_status ON `Order`(order_status);
CREATE INDEX idx_order_user_id ON `Order`(user_id);
CREATE INDEX idx_order_cafeteria_id ON `Order`(cafeteria_id);
CREATE INDEX idx_order_placed_at ON `Order`(placed_at);
CREATE INDEX idx_recommendation_user_id ON Recommendation(user_id);
CREATE INDEX idx_review_cafeteria_id ON Review(cafeteria_id);
CREATE INDEX idx_order_item_order_id ON OrderItem(order_id);
CREATE INDEX idx_order_item_item_id ON OrderItem(item_id);
CREATE INDEX idx_menu_item_cafeteria ON MenuItem(cafeteria_id);
CREATE INDEX idx_discount_cafeteria_active ON Discount(cafeteria_id, is_active);
CREATE INDEX idx_review_user ON Review(user_id);
CREATE INDEX idx_audit_user ON AuditLog(user_id);
CREATE INDEX idx_payment_user ON Payment(user_id);
CREATE INDEX idx_menuitem_category ON MenuItem(category_id);
CREATE INDEX idx_menuitemtag_tag ON MenuItemTag(tag_id);