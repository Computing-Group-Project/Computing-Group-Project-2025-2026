# Integration Guide: Discount & Promotion Module

## Overview
This guide explains how to integrate the Discount & Promotion Management Module with existing application components.

## Backend Integration

### 1. Order Service Integration

Update `OrderService` to apply discounts during order placement:

```java
@Service
public class OrderService {
    private final OrderRepository repo;
    private final PromotionEngineService promotionEngineService;

    public OrderService(OrderRepository repo, PromotionEngineService promotionEngineService) {
        this.repo = repo;
        this.promotionEngineService = promotionEngineService;
    }

    @LogActivity(action = "PLACE_ORDER", targetTable = "ORDER")
    public Order placeOrder(Order order, String promoCode) {
        order.setStatus(OrderStatus.PLACED);

        // Calculate discount
        DiscountCalculationResponse discount = promotionEngineService
            .calculateBestDiscount(promoCode, order.getTotalAmount(), 
                                   order.getItems().size(), "STUDENT");

        // Apply discount
        order.setAppliedPromoCode(discount.getAppliedPromoCode());
        order.setDiscountAmount(discount.getDiscountAmount());
        order.setFinalAmount(discount.getFinalAmount());

        return repo.save(order);
    }

    // ... existing methods
}
```

### 2. Checkout Controller Integration

Update `CheckoutController` to accept promo codes:

```java
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    private final OrderService orderService;

    @PostMapping("/place-order")
    public ResponseEntity<Order> placeOrder(
            @RequestBody CheckoutRequest request,
            @RequestParam(required = false) String promoCode) {
        
        Order order = buildOrder(request);
        Order placedOrder = orderService.placeOrder(order, promoCode);
        
        return ResponseEntity.ok(placedOrder);
    }
}
```

### 3. Payment Service Integration

Consider discount amount in payment processing:

```java
@Service
public class PaymentService {
    
    public Payment processPayment(Order order, PaymentRequest request) {
        Double amountToPay = order.getFinalAmount();  // Use discounted amount
        
        // Process payment for final amount
        return processPaymentGateway(amountToPay, request);
    }
}
```

## Frontend Integration

### 1. Checkout Component Integration

Update `Checkout.jsx` to include promo code input:

```jsx
import React, { useState } from 'react';
import PromoCodeInput from '../components/promotions/PromoCodeInput';
import DiscountCalculator from '../components/promotions/DiscountCalculator';

export default function Checkout() {
  const [promoCode, setPromoCode] = useState(null);
  const [orderAmount, setOrderAmount] = useState(0);
  const [items, setItems] = useState([]);

  const handlePromoCodeChange = (code) => {
    setPromoCode(code);
  };

  const handlePlaceOrder = async () => {
    // Place order with promo code
    await fetch('/api/checkout/place-order?promoCode=' + promoCode, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // order data
      })
    });
  };

  return (
    <div className="space-y-6">
      {/* Cart summary */}
      <PromoCodeInput 
        onPromoCodeChange={handlePromoCodeChange}
        onValidate={(isValid) => console.log('Code valid:', isValid)}
      />
      
      <DiscountCalculator 
        orderAmount={orderAmount}
        itemCount={items.length}
        userRole="STUDENT"
      />

      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}
```

### 2. Order Page Integration

Display applied discount in order history:

```jsx
// In Orders.jsx
function OrderCard({ order }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p>Original Amount: Rs. {order.totalAmount}</p>
      {order.discountAmount > 0 && (
        <>
          <p className="text-green-600">
            Discount: -Rs. {order.discountAmount}
          </p>
          {order.appliedPromoCode && (
            <p className="text-sm text-gray-600">
              Code: {order.appliedPromoCode}
            </p>
          )}
        </>
      )}
      <p className="font-bold">Final: Rs. {order.finalAmount}</p>
    </div>
  );
}
```

### 3. Admin Console Integration

Add promotion management to admin panel:

```jsx
// In AdminConsole.jsx
import React, { useState } from 'react';
import PromotionManagementConsole from './PromotionManagementConsole';

export default function AdminConsole() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="admin-layout">
      <nav>
        <button onClick={() => setActiveSection('promotions')}>
          Promotion Management
        </button>
      </nav>

      {activeSection === 'promotions' && <PromotionManagementConsole />}
    </div>
  );
}
```

## Database Setup

No additional database setup is required as Hibernate will create the necessary tables based on entity annotations.

However, if you want to manually create tables:

```sql
CREATE TABLE promotions (
    promotion_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50),
    discount_value DOUBLE,
    min_order_amount DOUBLE,
    max_usage_count INT,
    current_usage_count INT DEFAULT 0,
    status VARCHAR(50),
    start_date DATETIME,
    end_date DATETIME,
    cafeteria_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE promo_codes (
    promo_code_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    promotion_id BIGINT NOT NULL,
    status VARCHAR(50),
    max_usage_count INT,
    current_usage_count INT DEFAULT 0,
    valid_from DATETIME,
    valid_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id)
);

CREATE TABLE discount_rules (
    rule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rule_name VARCHAR(255),
    rule_description TEXT,
    promotion_id BIGINT,
    rule_type VARCHAR(50),
    rule_value DOUBLE,
    min_order_amount DOUBLE,
    max_order_amount DOUBLE,
    min_item_count INT,
    max_item_count INT,
    eligible_item_categories VARCHAR(500),
    eligible_user_roles VARCHAR(500),
    status VARCHAR(50),
    is_stackable BOOLEAN DEFAULT FALSE,
    effective_from DATETIME,
    effective_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id)
);

ALTER TABLE orders ADD COLUMN applied_promo_code VARCHAR(255);
ALTER TABLE orders ADD COLUMN discount_amount DOUBLE DEFAULT 0;
ALTER TABLE orders ADD COLUMN final_amount DOUBLE;
```

## Configuration

### Environment Variables (if needed)
```properties
PROMOTION_MODULE_ENABLED=true
PROMOTION_MAX_DISCOUNT_PERCENTAGE=95
PROMOTION_MAX_DISCOUNT_AMOUNT=10000
```

## Testing

### Backend Testing

```java
@SpringBootTest
public class PromotionEngineServiceTest {
    
    @Autowired
    private PromotionEngineService promotionEngineService;
    
    @Test
    public void testPromoCodeCalculation() {
        DiscountCalculationResponse response = 
            promotionEngineService.calculateDiscountWithPromoCode("SAVE20", 1000.0);
        
        assertEquals(200.0, response.getDiscountAmount());
        assertEquals(800.0, response.getFinalAmount());
    }
}
```

### Frontend Testing

```jsx
// Test PromoCodeInput component
import { render, screen, fireEvent } from '@testing-library/react';
import PromoCodeInput from '../PromoCodeInput';

test('validates promo code on input', async () => {
  const { getByPlaceholderText } = render(<PromoCodeInput />);
  const input = getByPlaceholderText('Enter promo code');
  
  fireEvent.change(input, { target: { value: 'SAVE20' } });
  
  // Check validation happens
});
```

## Common Use Cases

### 1. End-of-Season Promotion
```json
{
  "name": "End of Season Sale",
  "discountType": "PERCENTAGE",
  "discountValue": 30,
  "minOrderAmount": 300,
  "startDate": "2025-05-01",
  "endDate": "2025-05-31"
}
```

### 2. Student Discount
Create a discount rule instead:
```json
{
  "ruleName": "Student Discount",
  "ruleType": "PERCENTAGE",
  "ruleValue": 10,
  "eligibleUserRoles": "STUDENT",
  "minOrderAmount": 0
}
```

### 3. Bulk Order Discount
```json
{
  "ruleName": "Bulk Order Discount",
  "ruleType": "FIXED_AMOUNT",
  "ruleValue": 200,
  "minOrderAmount": 2000,
  "minItemCount": 10
}
```

## Troubleshooting

### Issue: Promo code not validating
- Check if promotion linked to code is active
- Verify date range is correct
- Check if usage limit is exceeded

### Issue: Discount not applied
- Verify promotion status is ACTIVE
- Check if order amount meets minimum requirement
- Ensure discount rule eligibility criteria are met

### Issue: Database errors
- Ensure all tables are created (check logs for errors)
- Verify foreign key relationships
- Check column data types match entity definitions

## Performance Considerations

1. **Database Indexes**: Consider adding indexes on:
   - `promo_codes.code` (frequently searched)
   - `promotions.status` (filtered queries)
   - `discount_rules.status` (filtered queries)

2. **Caching**: Consider caching active promotions in memory
   - Update cache when promotions are modified
   - Cache duration: 5-10 minutes

3. **Query Optimization**: Use appropriate query methods
   - Fetch only active promotions
   - Use pagination for large result sets
   - Avoid N+1 queries with proper joins

## Security Considerations

1. **Promo Code Exposure**: Don't expose sensitive details in API responses
2. **Discount Ceiling**: Implement maximum discount limits
3. **Rate Limiting**: Limit promo code validation requests
4. **Audit Trail**: Log all promotion changes and usage

## Future Enhancements

- Batch import/export of promotions
- Scheduled promotion activation
- Integration with email marketing
- Advanced analytics dashboard
- Dynamic pricing based on demand
- Referral program integration
