# Load Testing — Demeter Smart Cafeteria System

Validates NFR-Performance targets using [k6](https://k6.io/).

## NFR Targets

| Metric | Target | Threshold |
|--------|--------|-----------|
| Concurrent users | 35,000 | Scale `target` VUs in scenarios |
| Orders/min at peak | 100 | Measured via `orders_placed` counter |
| Menu response | < 2s (p95) | `menu_response_time p(95)<2000` |
| Order commit | < 3s (p95) | `order_response_time p(95)<3000` |
| WebSocket connect | < 1s (p95) | `ws_connection_time p(95)<1000` |
| AI recommendations | < 2s (p95) | `ai_recommendation_time p(95)<2000` |
| Error rate | < 5% | `http_req_failed rate<0.05` |

## Prerequisites

```bash
# Install k6 (macOS)
brew install k6

# Or download from https://k6.io/docs/get-started/installation/
```

## Running Tests

```bash
# Default profile (scaled-down: 200 browse + 50 order + 30 WS VUs)
k6 run load-testing/k6-load-test.js

# Against a different host
k6 run load-testing/k6-load-test.js --env BASE_URL=http://your-server:8080

# Full NFR validation (adjust VU targets in the script first)
# Edit k6-load-test.js scenarios to set target VUs to 24500/7000/3500
k6 run load-testing/k6-load-test.js

# Quick smoke test (10 VUs, 30 seconds)
k6 run load-testing/k6-load-test.js --vus 10 --duration 30s
```

## Test Scenarios

1. **Browse Menu (70% of load)** — Login, fetch cafeterias, browse menus, get recommendations, check discounts
2. **Place Orders (20% of load)** — Login, check wallet, browse menu, place order, verify order status
3. **WebSocket Connections (10% of load)** — Login, connect WebSocket, subscribe to `/topic/orders`, hold connection

## Results

Results are saved to `load-testing/results.json` after each run with:
- p95 response times for each endpoint category
- Error rate and total request count
- Orders placed count
- Threshold pass/fail status

## Scaling to Full NFR

To validate the full 35,000 concurrent user target, use k6 Cloud or a distributed setup:

```bash
# Distributed k6 with multiple load generators
k6 run --out cloud load-testing/k6-load-test.js
```

Adjust the scenario `target` values proportionally:
- browse_menu: 24,500 VUs (70%)
- place_orders: 7,000 VUs (20%)
- websocket_connections: 3,500 VUs (10%)
