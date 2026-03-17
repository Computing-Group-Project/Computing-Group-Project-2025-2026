import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import ws from 'k6/ws';

// Custom metrics
const orderSuccessRate = new Rate('order_success_rate');
const menuResponseTime = new Trend('menu_response_time', true);
const orderResponseTime = new Trend('order_response_time', true);
const wsConnectionTime = new Trend('ws_connection_time', true);
const aiRecommendationTime = new Trend('ai_recommendation_time', true);
const ordersPlaced = new Counter('orders_placed');

// --- Configuration ---
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const WS_URL = __ENV.WS_URL || 'ws://localhost:8080/ws';

// Seed user credentials (password: "pass" for all)
const STUDENTS = [
  'garen', 'lux', 'fiora', 'jinx', 'caitlyn',
  'vi', 'ekko', 'ezreal', 'ahri', 'yasuo',
];

// --- Load Profiles ---
// Ramp up to target concurrency, hold, then ramp down.
// NFR target: 35,000 concurrent users, 100 orders/min at peak.
// This profile validates at scaled levels; adjust `target` for full NFR validation.
export const options = {
  scenarios: {
    // Scenario 1: Browsing users (majority of load - 70%)
    browse_menu: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },   // Ramp up
        { duration: '3m', target: 200 },   // Hold at peak
        { duration: '1m', target: 0 },     // Ramp down
      ],
      exec: 'browseMenu',
    },
    // Scenario 2: Ordering users (active load - 20%)
    place_orders: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 },
        { duration: '3m', target: 50 },
        { duration: '1m', target: 0 },
      ],
      exec: 'placeOrder',
    },
    // Scenario 3: WebSocket connections (real-time updates - 10%)
    websocket_connections: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 5 },
        { duration: '3m', target: 30 },
        { duration: '1m', target: 0 },
      ],
      exec: 'websocketConnection',
    },
  },
  thresholds: {
    // NFR Performance Targets
    'menu_response_time': ['p(95)<2000'],         // Menu responses < 2s
    'order_response_time': ['p(95)<3000'],        // Order commit < 3s
    'ai_recommendation_time': ['p(95)<2000'],     // AI recommendations < 2s
    'ws_connection_time': ['p(95)<1000'],          // WebSocket < 1s
    'http_req_duration': ['p(95)<3000'],           // Overall p95 < 3s
    'http_req_failed': ['rate<0.05'],              // Error rate < 5%
    'order_success_rate': ['rate>0.95'],           // Order success > 95%
  },
};

// --- Helper: Login and get JWT token ---
function login(username) {
  const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    username: username,
    password: 'pass',
  }), { headers: { 'Content-Type': 'application/json' } });

  if (res.status === 200) {
    const body = JSON.parse(res.body);
    return body.data;
  }
  return null;
}

// --- Helper: Get auth headers ---
function authHeaders(token) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
}

// --- Scenario 1: Browse Menu ---
export function browseMenu() {
  const student = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
  const authData = login(student);
  if (!authData) return;

  const headers = authHeaders(authData.token);

  group('Browse Cafeterias & Menus', () => {
    // GET /api/cafeterias
    const cafRes = http.get(`${BASE_URL}/api/cafeterias`, headers);
    check(cafRes, { 'cafeterias loaded': (r) => r.status === 200 });

    // GET /api/menus/cafeteria/{id} for each cafeteria
    const cafeteriaIds = [1, 2, 3];
    const cafId = cafeteriaIds[Math.floor(Math.random() * cafeteriaIds.length)];

    const menuRes = http.get(`${BASE_URL}/api/menus/cafeteria/${cafId}`, headers);
    menuResponseTime.add(menuRes.timings.duration);
    check(menuRes, {
      'menu loaded': (r) => r.status === 200,
      'menu response < 2s': (r) => r.timings.duration < 2000,
    });

    // GET /api/categories
    const catRes = http.get(`${BASE_URL}/api/categories`, headers);
    check(catRes, { 'categories loaded': (r) => r.status === 200 });

    // GET /api/recommendations
    const recRes = http.get(
      `${BASE_URL}/api/recommendations?context=homepage&limit=3`,
      headers,
    );
    aiRecommendationTime.add(recRes.timings.duration);
    check(recRes, {
      'recommendations loaded': (r) => r.status === 200,
      'recommendations < 2s': (r) => r.timings.duration < 2000,
    });

    // GET /api/discounts/cafeteria/{id}/active
    http.get(`${BASE_URL}/api/discounts/cafeteria/${cafId}/active`, headers);
  });

  sleep(Math.random() * 3 + 1); // Think time: 1-4s
}

// --- Scenario 2: Place Orders ---
export function placeOrder() {
  const student = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
  const authData = login(student);
  if (!authData) return;

  const headers = authHeaders(authData.token);

  group('Place Order Flow', () => {
    // 1. Check wallet balance
    const balRes = http.get(`${BASE_URL}/api/wallet/balance`, headers);
    check(balRes, { 'balance checked': (r) => r.status === 200 });

    // 2. Browse menu
    const cafId = Math.floor(Math.random() * 3) + 1;
    const menuRes = http.get(`${BASE_URL}/api/menus/cafeteria/${cafId}`, headers);
    if (menuRes.status !== 200) return;

    const menuData = JSON.parse(menuRes.body);
    const items = menuData.data || [];
    if (items.length === 0) return;

    // 3. Select 1-3 random items
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems = [];
    for (let i = 0; i < numItems && i < items.length; i++) {
      const item = items[Math.floor(Math.random() * items.length)];
      selectedItems.push({
        menuItemId: item.menuId,
        quantity: Math.floor(Math.random() * 2) + 1,
        unitPrice: item.basePrice,
        subtotal: item.basePrice * (Math.floor(Math.random() * 2) + 1),
      });
    }

    // 4. Place order
    const orderPayload = {
      userId: authData.userId,
      cafeteriaId: cafId,
      items: selectedItems,
      specialInstructions: 'k6 load test order',
    };

    const orderRes = http.post(
      `${BASE_URL}/api/orders`,
      JSON.stringify(orderPayload),
      headers,
    );

    orderResponseTime.add(orderRes.timings.duration);
    const success = orderRes.status === 200 || orderRes.status === 201;
    orderSuccessRate.add(success);

    check(orderRes, {
      'order placed': (r) => r.status === 200 || r.status === 201,
      'order commit < 3s': (r) => r.timings.duration < 3000,
    });

    if (success) {
      ordersPlaced.add(1);

      // 5. Check order status
      const ordersRes = http.get(
        `${BASE_URL}/api/orders/user/${authData.userId}`,
        headers,
      );
      check(ordersRes, { 'orders retrieved': (r) => r.status === 200 });
    }

    // 6. Check updated wallet balance
    http.get(`${BASE_URL}/api/wallet/balance`, headers);
  });

  sleep(Math.random() * 5 + 2); // Think time: 2-7s
}

// --- Scenario 3: WebSocket Connections ---
export function websocketConnection() {
  const student = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
  const authData = login(student);
  if (!authData) return;

  const startTime = Date.now();

  const res = ws.connect(WS_URL, {}, function (socket) {
    const connectTime = Date.now() - startTime;
    wsConnectionTime.add(connectTime);

    check(null, {
      'ws connected < 1s': () => connectTime < 1000,
    });

    // Subscribe to order updates
    socket.send(JSON.stringify({
      command: 'SUBSCRIBE',
      destination: '/topic/orders',
    }));

    // Listen for messages for a period
    socket.on('message', () => {
      // Message received — connection is alive
    });

    // Keep connection open for 10-30 seconds
    socket.setTimeout(function () {
      socket.close();
    }, Math.random() * 20000 + 10000);
  });

  sleep(1);
}

// --- Summary handler ---
export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    metrics: {
      menu_p95: data.metrics.menu_response_time?.values?.['p(95)'] || 'N/A',
      order_p95: data.metrics.order_response_time?.values?.['p(95)'] || 'N/A',
      ai_rec_p95: data.metrics.ai_recommendation_time?.values?.['p(95)'] || 'N/A',
      ws_connect_p95: data.metrics.ws_connection_time?.values?.['p(95)'] || 'N/A',
      http_req_p95: data.metrics.http_req_duration?.values?.['p(95)'] || 'N/A',
      error_rate: data.metrics.http_req_failed?.values?.rate || 'N/A',
      total_requests: data.metrics.http_reqs?.values?.count || 0,
      orders_placed: data.metrics.orders_placed?.values?.count || 0,
      order_success: data.metrics.order_success_rate?.values?.rate || 'N/A',
    },
    thresholds: {},
  };

  // Map threshold pass/fail
  for (const [key, val] of Object.entries(data.metrics)) {
    if (val.thresholds) {
      for (const [tKey, tVal] of Object.entries(val.thresholds)) {
        summary.thresholds[`${key}: ${tKey}`] = tVal.ok ? 'PASS' : 'FAIL';
      }
    }
  }

  return {
    'load-testing/results.json': JSON.stringify(summary, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
