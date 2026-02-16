# Quick Start Guide: Discount & Promotion Module

## Setup Instructions

### Step 1: Verify Backend Configuration
The module is automatically configured since it follows Spring Boot conventions. Verify:
- ✅ All service classes are annotated with `@Service`
- ✅ All controller classes are annotated with `@RestController`
- ✅ All repository interfaces extend `JpaRepository`
- ✅ ModelMapper bean is configured in `ModelMapperConfig.java`

### Step 2: Start Backend Server
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Server starts on http://localhost:8080
```

### Step 3: Verify Backend Endpoints
Test a promotional endpoint:
```bash
curl http://localhost:8080/api/promotions
# Should return empty array []
```

### Step 4: Start Frontend Server
```bash
cd frontend/demeter-frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## Using the Module

### For Administrators

#### 1. Access Promotion Management Console
Navigate to: `http://localhost:5173/admin/promotions`

#### 2. Create a Promotion
- Click "+ New Promotion"
- Enter:
  - Name: "Summer Sale"
  - Discount Type: "PERCENTAGE"
  - Discount Value: "20"
  - Min Order Amount: "500"
  - Validity dates
- Click "Save"

#### 3. Create Promo Codes
- Go to "Promo Codes" tab
- Click "+ New Code"
- Enter:
  - Code: "SUMMER20"
  - Select Promotion: "Summer Sale"
  - Validity dates
- Click "Create Code"

#### 4. View Promotion Analytics
- See usage counts and current status
- Deactivate or delete as needed

### For Students

#### 1. During Checkout
- Go to cart
- Enter promo code: "SUMMER20"
- System validates in real-time
- Discount is applied automatically

#### 2. View Discount Preview
- See original amount
- See discount amount
- See final amount before paying

## API Quick Reference

### Get All Active Promotions
```bash
curl http://localhost:8080/api/promotions/active/list
```

### Validate Promo Code
```bash
curl http://localhost:8080/api/promo-codes/code/SUMMER20/validate
```

### Calculate Discount
```bash
curl -X POST "http://localhost:8080/api/promotions/engine/calculate-best?promoCode=SUMMER20&orderAmount=1000&itemCount=3&userRole=STUDENT"
```

### Create Promotion (Admin)
```bash
curl -X POST http://localhost:8080/api/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Flash Sale",
    "discountType": "PERCENTAGE",
    "discountValue": 15,
    "minOrderAmount": 300
  }'
```

## Common Scenarios

### Scenario 1: Time-Limited Flash Sale
```json
{
  "name": "Flash Sale - 24 Hours",
  "description": "50% off for next 24 hours",
  "discountType": "PERCENTAGE",
  "discountValue": 50,
  "minOrderAmount": 0,
  "maxUsageCount": 1000,
  "startDate": "2025-02-17T00:00:00",
  "endDate": "2025-02-18T00:00:00"
}
```

### Scenario 2: Minimum Order Amount Sale
```json
{
  "name": "Spend Rs. 1000, Get Rs. 200 Off",
  "discountType": "FIXED_AMOUNT",
  "discountValue": 200,
  "minOrderAmount": 1000
}
```

### Scenario 3: Limited Promo Code
```json
{
  "code": "EXCLUSIVE50",
  "promotionId": 1,
  "maxUsageCount": 100,
  "validUntil": "2025-03-17T23:59:59"
}
```

## Troubleshooting

### Problem: Gets 404 on endpoints
- Verify backend server is running on port 8080
- Check endpoint URL matches exactly
- Ensure promotional module classes are in classpath

### Problem: Promo code not working
- Verify code is active: check status = "ACTIVE"
- Check if code is within valid date range
- Check if maximum usage count is not exceeded
- Check if linked promotion is active

### Problem: Discount not showing in frontend
- Open browser console (F12) to check for errors
- Verify API endpoints are responding correctly
- Check network requests in Network tab
- Clear browser cache and refresh

### Problem: Database errors
- Ensure MySQL is running
- Check database connection in application.yaml
- Verify tables are created automatically by Hibernate

## Performance Tips

1. **Cache Active Promotions**
   - Implement Redis caching at service layer
   - Invalidate cache on promotion updates

2. **Index Frequently Searched Columns**
   ```sql
   CREATE INDEX idx_promo_code ON promo_codes(code);
   CREATE INDEX idx_promo_status ON promotions(status);
   ```

3. **Batch Operations**
   - Use batch insert for multiple promo codes
   - Consider bulk discount rule application

## Security Checklist

- [ ] Validate all user inputs on backend
- [ ] Implement rate limiting on validation endpoints
- [ ] Log and audit all discount-related transactions
- [ ] Set maximum discount limits
- [ ] Implement access control for admin endpoints
- [ ] Sanitize error messages (don't expose sensitive info)

## Testing Checklist

- [ ] Test promo code validation
- [ ] Test discount calculation with various amounts
- [ ] Test expiration date validation
- [ ] Test usage limit enforcement
- [ ] Test discount application in orders
- [ ] Test edge cases (0 discount, 100% discount)
- [ ] Test concurrent requests
- [ ] Test database consistency

## Next Steps

1. **Integrate with Order Service** (See INTEGRATION_GUIDE.md)
2. **Add Analytics Dashboard** for promotion performance
3. **Create Email Notifications** for promo code distribution
4. **Implement A/B Testing** for promotions
5. **Add Coupon Code Generation** for campaigns
6. **Create Loyalty Program** integration
7. **Set up Automated Reports** for promotional metrics

## Support Resources

- **Module Documentation**: See `DISCOUNT_PROMOTION_MODULE.md`
- **Integration Guide**: See `INTEGRATION_GUIDE.md`
- **API Documentation**: Available at `http://localhost:8080/swagger-ui.html`
- **Backend Code**: Located in `backend/src/main/java/com/demeter/backend/promotions/`
- **Frontend Code**: Located in `frontend/demeter-frontend/src/components/promotions/`

## Example Test Data

### Create Sample Promotion (via API)
```json
POST http://localhost:8080/api/promotions
{
  "name": "Test Promotion",
  "description": "20% off test promotion",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "minOrderAmount": 500,
  "maxUsageCount": 100,
  "status": "ACTIVE",
  "startDate": "2025-02-17T00:00:00",
  "endDate": "2025-02-24T23:59:59"
}
```

### Create Sample Promo Code
```json
POST http://localhost:8080/api/promo-codes
{
  "code": "TEST20",
  "description": "Test promo code",
  "promotionId": 1,
  "status": "ACTIVE",
  "validFrom": "2025-02-17T00:00:00",
  "validUntil": "2025-02-24T23:59:59"
}
```

## Key Features Review

✅ Percentage and fixed-amount discounts
✅ Time-based promotion validity
✅ Usage limit tracking
✅ Promo code validation
✅ Role-based discount rules
✅ Minimum order amount requirements
✅ Real-time discount calculation
✅ Order discount tracking
✅ Admin management interface
✅ RESTful API endpoints

Happy promoting! 🎉
