# Project Structure - Discount & Promotion Module

## Backend Structure

```
backend/src/main/java/com/demeter/backend/
├── promotions/                          (NEW MODULE)
│   ├── model/
│   │   ├── Promotion.java               ✅ Core promotion entity
│   │   ├── PromoCode.java               ✅ Promo code entity
│   │   └── DiscountRule.java            ✅ Discount rule entity
│   │
│   ├── dto/
│   │   ├── PromotionDTO.java            ✅ DTO for Promotion
│   │   ├── PromoCodeDTO.java            ✅ DTO for PromoCode
│   │   ├── DiscountRuleDTO.java         ✅ DTO for DiscountRule
│   │   └── DiscountCalculationResponse.java ✅ Response DTO
│   │
│   ├── repo/
│   │   ├── PromotionRepository.java     ✅ Promotion queries
│   │   ├── PromoCodeRepository.java     ✅ PromoCode queries
│   │   └── DiscountRuleRepository.java  ✅ DiscountRule queries
│   │
│   ├── service/
│   │   ├── PromotionService.java        ✅ Promotion business logic
│   │   ├── PromoCodeService.java        ✅ PromoCode business logic
│   │   ├── DiscountRuleService.java     ✅ DiscountRule business logic
│   │   └── PromotionEngineService.java  ✅ Discount calculation engine
│   │
│   └── controller/
│       ├── PromotionController.java     ✅ Promotion REST endpoints
│       ├── PromoCodeController.java     ✅ PromoCode REST endpoints
│       ├── DiscountRuleController.java  ✅ DiscountRule REST endpoints
│       └── PromotionEngineController.java ✅ Calculation endpoints
│
├── shared/enums/                        (UPDATED)
│   ├── DiscountType.java                ✅ NEW enum
│   └── PromotionStatus.java             ✅ NEW enum
│
└── orders/model/
    └── Order.java                       ✅ UPDATED with discount fields
```

## Frontend Structure

```
frontend/demeter-frontend/src/
├── components/
│   └── promotions/                      (NEW DIRECTORY)
│       ├── PromoCodeInput.jsx           ✅ Promo code validator
│       ├── DiscountCalculator.jsx       ✅ Discount preview
│       ├── PromotionForm.jsx            ✅ Promotion CRUD form
│       ├── PromotionList.jsx            ✅ Promotions management
│       ├── PromoCodeList.jsx            ✅ Promo codes management
│       └── index.js                     ✅ Component exports
│
└── admin/
    └── PromotionManagementConsole.jsx   ✅ NEW admin interface
```

## Documentation Structure

```
Computing-Group-Project-2025-2026/
├── DISCOUNT_PROMOTION_MODULE.md         ✅ Complete module guide
├── INTEGRATION_GUIDE.md                 ✅ Integration instructions
├── QUICK_START_GUIDE.md                 ✅ Quick reference
├── IMPLEMENTATION_SUMMARY.md            ✅ What was delivered
├── PROJECT_STRUCTURE.md                 ✅ This file
└── README.md                            (already exists)
```

## API Endpoint Structure

```
/api/
├── promotions/
│   ├── POST     /                       Create promotion
│   ├── GET      /                       Get all promotions
│   ├── GET      /{id}                   Get promotion by ID
│   ├── GET      /active/list            Get active promotions
│   ├── GET      /cafeteria/{id}         Get by cafeteria
│   ├── GET      /cafeteria/{id}/active  Get active by cafeteria
│   ├── PUT      /{id}                   Update promotion
│   ├── PUT      /{id}/deactivate        Deactivate promotion
│   ├── DELETE   /{id}                   Delete promotion
│   │
│   └── engine/
│       ├── POST /calculate-with-promo   Calculate with promo code
│       ├── POST /calculate-with-rules   Calculate with rules
│       └── POST /calculate-best         Calculate best discount
│
├── promo-codes/
│   ├── POST     /                       Create promo code
│   ├── GET      /                       Get all codes
│   ├── GET      /{id}                   Get code by ID
│   ├── GET      /code/{code}            Get by code string
│   ├── GET      /code/{code}/validate   Validate code
│   ├── GET      /active/list            Get active codes
│   ├── GET      /promotion/{id}         Get by promotion
│   ├── PUT      /{id}                   Update code
│   ├── PUT      /{id}/deactivate        Deactivate code
│   └── DELETE   /{id}                   Delete code
│
└── discount-rules/
    ├── POST     /                       Create rule
    ├── GET      /                       Get all rules
    ├── GET      /{id}                   Get rule by ID
    ├── GET      /active/list            Get active rules
    ├── GET      /applicable             Get applicable rules
    ├── GET      /promotion/{id}         Get by promotion
    ├── PUT      /{id}                   Update rule
    ├── PUT      /{id}/deactivate        Deactivate rule
    └── DELETE   /{id}                   Delete rule
```

## Database Schema

```
Database: (Your configured MySQL DB)
│
├── promotions Table
│   ├── promotionId (PK)
│   ├── name
│   ├── description
│   ├── discountType (PERCENTAGE|FIXED_AMOUNT)
│   ├── discountValue
│   ├── minOrderAmount
│   ├── maxUsageCount
│   ├── currentUsageCount
│   ├── status (ACTIVE|INACTIVE|EXPIRED)
│   ├── startDate
│   ├── endDate
│   ├── cafeteriaId (FK)
│   ├── createdAt
│   └── updatedAt
│
├── promo_codes Table
│   ├── promoCodeId (PK)
│   ├── code (UNIQUE)
│   ├── description
│   ├── promotionId (FK → promotions)
│   ├── status (ACTIVE|INACTIVE|EXPIRED)
│   ├── maxUsageCount
│   ├── currentUsageCount
│   ├── validFrom
│   ├── validUntil
│   ├── createdAt
│   └── updatedAt
│
├── discount_rules Table
│   ├── ruleId (PK)
│   ├── ruleName
│   ├── ruleDescription
│   ├── promotionId (FK → promotions)
│   ├── ruleType (PERCENTAGE|FIXED_AMOUNT)
│   ├── ruleValue
│   ├── minOrderAmount
│   ├── maxOrderAmount
│   ├── minItemCount
│   ├── maxItemCount
│   ├── eligibleItemCategories
│   ├── eligibleUserRoles
│   ├── status (ACTIVE|INACTIVE|EXPIRED)
│   ├── isStackable
│   ├── effectiveFrom
│   ├── effectiveUntil
│   ├── createdAt
│   └── updatedAt
│
└── orders Table (UPDATED)
    ├── ... (existing fields)
    ├── appliedPromoCode (NEW)
    ├── discountAmount (NEW)
    └── finalAmount (NEW)
```

## File Statistics

```
Backend Files:     19 files
├── Models:        3 files (Promotion, PromoCode, DiscountRule)
├── DTOs:          4 files
├── Repositories:  3 files
├── Services:      4 files
├── Controllers:   4 files
├── Enums:         2 files (DiscountType, PromotionStatus)
└── Updated:       1 file (Order.java)

Frontend Files:    7 files
├── Components:    6 files
└── Admin Console: 1 file

Documentation:    5 files
├── Quick Start:          1 file
├── Module Guide:         1 file
├── Integration Guide:    1 file
├── Summary:              1 file
└── Structure:            1 file (this file)

Total:            31 new/updated files
```

## Component Dependencies

```
PromoCodeInput
    ↓ (validates)
    ↓ (calls) /api/promo-codes/code/{code}/validate

DiscountCalculator
    ↓ (calculates)
    ↓ (calls) /api/promotions/engine/calculate-*

PromotionList + PromotionForm
    ↓ (CRUD)
    ↓ (calls) /api/promotions/*

PromoCodeList
    ↓ (CRUD)
    ↓ (calls) /api/promo-codes/*

PromotionManagementConsole
    ├─→ PromotionList
    ├─→ PromoCodeList
    └─→ DiscountCalculator
```

## Service Dependencies

```
PromotionEngineService
    ├─→ uses PromoCodeService
    ├─→ uses PromotionService
    └─→ uses DiscountRuleService

PromoCodeService
    ├─→ uses PromoCodeRepository
    ├─→ uses PromotionService
    └─→ calls incrementUsageCount()

PromotionService
    └─→ uses PromotionRepository

DiscountRuleService
    └─→ uses DiscountRuleRepository
```

## Enum Mappings

### DiscountType
```
PERCENTAGE      →  "Percentage Discount" (0-100%)
FIXED_AMOUNT    →  "Fixed Amount Discount" (Rs.)
```

### PromotionStatus
```
ACTIVE          →  Promotion is currently active
INACTIVE        →  Promotion is manually deactivated
EXPIRED         →  Promotion validity period has ended
```

## Data Flow - Order with Discount

```
User Checkout
    ↓
PromoCodeInput (validates code) 
    ↓ (calls)
/api/promo-codes/code/{code}/validate
    ↓
PromoCodeService.validatePromoCode()
    ↓
DiscountCalculator (shows preview)
    ↓ (calls)
/api/promotions/engine/calculate-best
    ↓
PromotionEngineService.calculateBestDiscount()
    ├─→ PromotionService.getActivePromotions()
    ├─→ PromoCodeService.applyPromoCode()
    └─→ DiscountRuleService.getApplicableRules()
    ↓
Returns DiscountCalculationResponse
    ↓
Order Creation
    ├─→ appliedPromoCode
    ├─→ discountAmount
    └─→ finalAmount
    ↓
OrderService.placeOrder()
    ↓
Saved to Database with discount details
```

## Request/Response Flow

### Promo Code Validation
```
Browser Request:
GET /api/promo-codes/code/SUMMER20/validate

Backend Processing:
PromoCodeController → PromoCodeService → PromoCodeRepository

Database Query:
SELECT * FROM promo_codes WHERE code = 'SUMMER20'

Response:
true/false (JSON boolean)
```

### Discount Calculation
```
Browser Request:
POST /api/promotions/engine/calculate-best
?promoCode=SUMMER20
&orderAmount=1000
&itemCount=3
&userRole=STUDENT

Backend Processing:
PromotionEngineController
    → PromotionEngineService.calculateBestDiscount()
        → PromoCodeService.applyPromoCode()
        → DiscountRuleService.getApplicableRules()

Database Queries:
- SELECT FROM promo_codes WHERE code = 'SUMMER20'
- SELECT FROM promotions WHERE id = ?
- SELECT FROM discount_rules WHERE status = 'ACTIVE'

Response:
{
    "originalAmount": 1000.0,
    "discountAmount": 200.0,
    "finalAmount": 800.0,
    "appliedPromoCode": "SUMMER20",
    "discountDescription": "Promo code applied"
}
```

## Configuration Points

```
application.yaml
├── spring.jpa.hibernate.ddl-auto: validate
├── spring.jpa.show-sql: true
├── spring.aop.auto: true
└── spring.aop.proxy-target-class: true

ModelMapperConfig.java
└── @Bean ModelMapper modelMapper()
```

## Security Boundaries

```
Public Endpoints (No Auth Required)
├── GET /api/promotions/active/list
├── GET /api/promo-codes/code/{code}/validate
└── POST /api/promotions/engine/calculate-*

Admin Endpoints (Requires Auth)
├── POST /api/promotions
├── PUT /api/promotions/{id}
├── DELETE /api/promotions/{id}
├── POST /api/promo-codes
└── ... (all admin CRUD operations)
```

## Performance Considerations

```
High Volume Queries:
- /api/promotions/active/list
- /api/promo-codes/code/{code}/validate
- /api/promotions/engine/calculate-*

Optimization Strategies:
1. Add indexes on: code, status, startDate, endDate
2. Implement caching for active promotions
3. Use pagination for list endpoints
4. Batch promo code validation

Cache Strategy:
- Cache: Active promotions (TTL: 5-10 min)
- Cache: Valid promo codes (TTL: 1-5 min)
- Invalidate: On promotion/code update
```

---

This structure is modular, scalable, and follows Spring Boot best practices!
