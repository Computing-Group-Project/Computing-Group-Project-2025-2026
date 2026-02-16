# Discount & Promotion Management Module

## Overview

The Discount & Promotion Management Module is a comprehensive system for managing discounts, promotions, and promo codes in the Demeter Smart Cafeteria System. It enables administrators to create and manage promotional campaigns while allowing students to apply promo codes during order checkout.

## Features

### 1. **Promotion Management**
- Create, read, update, and delete promotions
- Support for percentage-based and fixed-amount discounts
- Set minimum order amounts for promotion eligibility
- Configure usage limits (max number of times a promotion can be used)
- Set promotion validity periods (start and end dates)
- Cafeteria-specific promotions
- Status management (Active, Inactive, Expired)

### 2. **Promo Code Management**
- Generate unique promo codes linked to promotions
- Set validity periods for each promo code
- Track usage counts per promo code
- Validate promo codes in real-time
- Support for both unlimited and limited-use codes
- Automatic validation based on time and usage limits

### 3. **Discount Rules**
- Define complex discount eligibility criteria
- Minimum and maximum order amount conditions
- Item count conditions
- Category-based discounts
- Role-based discount eligibility (student, staff, admin)
- Stackable discounts support
- Time-based rule activation

### 4. **Promotion Engine**
- Intelligent discount calculation
- Automatic selection of the best available discount
- Support for combining multiple discount sources
- Discount application during order processing
- Real-time discount preview

## Backend Architecture

### Models

#### 1. **Promotion.java**
Core promotion entity with:
- Discount type (Percentage/Fixed Amount)
- Discount value
- Minimum order amount requirement
- Usage tracking
- Date range validation
- Validity checking methods

#### 2. **PromoCode.java**
Promo code entity with:
- Unique code string
- Link to promotion
- Validity period
- Usage tracking
- Validation logic

#### 3. **DiscountRule.java**
Complex discount rule entity with:
- Multiple eligibility criteria
- Order amount and item count conditions
- Category and role-based eligibility
- Stackable flag
- Period-based activation

#### 4. **Order.java (Updated)**
Enhanced order entity with:
- `appliedPromoCode`: Applied promo code (if any)
- `discountAmount`: Total discount applied
- `finalAmount`: Final order amount after discount

### Services

#### **PromotionService**
```java
- createPromotion(Promotion): Promotion
- updatePromotion(Long, Promotion): Promotion
- getPromotionById(Long): Optional<Promotion>
- getAllPromotions(): List<Promotion>
- getActivePromotions(): List<Promotion>
- getPromotionsByCafeteria(Long): List<Promotion>
- deactivatePromotion(Long): Promotion
- deletePromotion(Long): void
- incrementUsageCount(Long): void
```

#### **PromoCodeService**
```java
- createPromoCode(PromoCode): PromoCode
- validatePromoCode(String): boolean
- getPromoCodeByCode(String): Optional<PromoCode>
- applyPromoCode(String, Double): Double
- getActivePromoCodes(): List<PromoCode>
- deactivatePromoCode(Long): PromoCode
```

#### **DiscountRuleService**
```java
- createDiscountRule(DiscountRule): DiscountRule
- getApplicableRules(Double, Integer, String): List<DiscountRule>
- calculateTotalDiscount(Double, Integer, String): Double
- userQualifiesForRule(Long, Double, Integer, String): boolean
```

#### **PromotionEngineService**
```java
- calculateDiscountWithPromoCode(String, Double): DiscountCalculationResponse
- calculateDiscountWithRules(Double, Integer, String): DiscountCalculationResponse
- calculateBestDiscount(String, Double, Integer, String): DiscountCalculationResponse
```

### API Endpoints

#### **Promotions** (`/api/promotions`)
- `POST /` - Create promotion
- `GET /` - Get all promotions
- `GET /{id}` - Get promotion by ID
- `GET /active/list` - Get active promotions
- `GET /cafeteria/{cafeteriaId}` - Get cafeteria promotions
- `GET /cafeteria/{cafeteriaId}/active` - Get active cafeteria promotions
- `PUT /{id}` - Update promotion
- `PUT /{id}/deactivate` - Deactivate promotion
- `DELETE /{id}` - Delete promotion

#### **Promo Codes** (`/api/promo-codes`)
- `POST /` - Create promo code
- `GET /` - Get all promo codes
- `GET /{id}` - Get promo code by ID
- `GET /code/{code}` - Get by code string
- `GET /code/{code}/validate` - Validate promo code
- `GET /active/list` - Get active promo codes
- `GET /promotion/{promotionId}` - Get codes for promotion
- `PUT /{id}` - Update promo code
- `PUT /{id}/deactivate` - Deactivate promo code
- `DELETE /{id}` - Delete promo code

#### **Discount Rules** (`/api/discount-rules`)
- `POST /` - Create discount rule
- `GET /` - Get all rules
- `GET /{id}` - Get rule by ID
- `GET /active/list` - Get active rules
- `GET /applicable` - Get applicable rules (with params: orderAmount, itemCount, userRole)
- `GET /promotion/{promotionId}` - Get rules for promotion
- `PUT /{id}` - Update rule
- `PUT /{id}/deactivate` - Deactivate rule
- `DELETE /{id}` - Delete rule

#### **Promotion Engine** (`/api/promotions/engine`)
- `POST /calculate-with-promo` - Calculate discount using promo code
- `POST /calculate-with-rules` - Calculate discount using rules
- `POST /calculate-best` - Calculate best available discount

## Frontend Components

### 1. **PromoCodeInput**
Real-time promo code validation component
- Live validation of promo codes
- Visual feedback (✓/✗)
- Loading state indicator
- Integration with discount calculation

### 2. **DiscountCalculator**
Interactive discount calculation tool
- Support for multiple calculation methods
- Tab-based interface (Best/Promo/Rules)
- Real-time calculation
- Clear display of discount breakdown

### 3. **PromotionForm**
Form for creating and editing promotions
- All promotion fields
- Date/time pickers
- Status selection
- Validation feedback

### 4. **PromotionList**
Comprehensive promotion management interface
- Sortable list with filters
- Quick actions (Edit, Deactivate, Delete)
- Status indicators
- Usage tracking display

### 5. **PromoCodeList**
Promo code management interface
- List of all promo codes
- Quick code creation
- Status management
- Usage tracking

## Database Schema

### Tables

#### promotions
- promotionId (PK)
- name (VARCHAR)
- description (TEXT)
- discountType (ENUM: PERCENTAGE, FIXED_AMOUNT)
- discountValue (DOUBLE)
- minOrderAmount (DOUBLE)
- maxUsageCount (INT)
- currentUsageCount (INT)
- status (ENUM: ACTIVE, INACTIVE, EXPIRED)
- startDate (DATETIME)
- endDate (DATETIME)
- cafeteriaId (LONG, FK)
- createdAt (DATETIME)
- updatedAt (DATETIME)

#### promo_codes
- promoCodeId (PK)
- code (VARCHAR, UNIQUE)
- description (TEXT)
- promotionId (LONG, FK)
- status (ENUM: ACTIVE, INACTIVE, EXPIRED)
- maxUsageCount (INT)
- currentUsageCount (INT)
- validFrom (DATETIME)
- validUntil (DATETIME)
- createdAt (DATETIME)
- updatedAt (DATETIME)

#### discount_rules
- ruleId (PK)
- ruleName (VARCHAR)
- ruleDescription (TEXT)
- promotionId (LONG, FK)
- ruleType (ENUM: PERCENTAGE, FIXED_AMOUNT)
- ruleValue (DOUBLE)
- minOrderAmount (DOUBLE)
- maxOrderAmount (DOUBLE)
- minItemCount (INT)
- maxItemCount (INT)
- eligibleItemCategories (VARCHAR)
- eligibleUserRoles (VARCHAR)
- status (ENUM: ACTIVE, INACTIVE, EXPIRED)
- isStackable (BOOLEAN)
- effectiveFrom (DATETIME)
- effectiveUntil (DATETIME)
- createdAt (DATETIME)
- updatedAt (DATETIME)

#### orders (Updated)
- appliedPromoCode (VARCHAR)
- discountAmount (DOUBLE)
- finalAmount (DOUBLE)

## Usage Examples

### Creating a Promotion
```json
POST /api/promotions
{
  "name": "Summer Sale",
  "description": "20% off on all orders",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "minOrderAmount": 500,
  "maxUsageCount": 100,
  "status": "ACTIVE",
  "startDate": "2025-06-01T00:00:00",
  "endDate": "2025-08-31T23:59:59"
}
```

### Creating a Promo Code
```json
POST /api/promo-codes
{
  "code": "SUMMER20",
  "description": "Summer sale code",
  "promotionId": 1,
  "status": "ACTIVE",
  "validFrom": "2025-06-01T00:00:00",
  "validUntil": "2025-08-31T23:59:59"
}
```

### Calculating Discount with Promo Code
```
POST /api/promotions/engine/calculate-with-promo?promoCode=SUMMER20&orderAmount=600
```

### Calculating Best Discount
```
POST /api/promotions/engine/calculate-best?promoCode=SUMMER20&orderAmount=600&itemCount=3&userRole=STUDENT
```

## Integration with Order Processing

When an order is placed:
1. Promo code is validated (if provided)
2. Best applicable discount is calculated
3. Discount amount is applied to the order
4. Final amount is calculated
5. Usage counts are incremented
6. Order is saved with discount details

## Enums

### DiscountType
- `PERCENTAGE`: Discount as a percentage (0-100)
- `FIXED_AMOUNT`: Discount as a fixed amount

### PromotionStatus
- `ACTIVE`: Promotion is currently active
- `INACTIVE`: Promotion is inactive
- `EXPIRED`: Promotion has expired

## Error Handling

The module includes comprehensive error handling:
- Invalid promo code validation
- Expired promotion/code handling
- Usage limit validation
- Date range validation
- Eligibility criteria checking

## Best Practices

1. **Promotion Management**
   - Always set meaningful start and end dates
   - Use appropriate minimum order amounts
   - Monitor usage limits to avoid overuse

2. **Promo Code Management**
   - Create unique, memorable codes
   - Set expiration dates for limited campaigns
   - Track usage to ensure promotional goals

3. **Discount Rules**
   - Define clear eligibility criteria
   - Use stackable rules carefully to avoid excessive discounts
   - Regularly review and update rules

4. **Testing**
   - Validate promo codes before using
   - Test discount calculations with various order amounts
   - Verify eligibility criteria work as expected

## Future Enhancements

- Analytics dashboard for promotion performance
- Automated promotion scheduling
- A/B testing for promotional campaigns
- Machine learning-based recommendation engine
- Integration with inventory management
- Loyalty program integration
- Campaign analytics and reporting

## Support

For issues or questions about the Discount & Promotion Management Module, please contact the development team.
