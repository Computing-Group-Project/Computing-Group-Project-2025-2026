import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Orders from "../Orders.jsx";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: null }),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock api
vi.mock("../../utils/api.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock websocket
vi.mock("../../utils/websocket.js", () => ({
  connectWebSocket: vi.fn(),
  subscribe: vi.fn(),
  disconnectWebSocket: vi.fn(),
}));

// Mock StudentLayout
vi.mock("../../layouts/StudentLayout.jsx", () => ({
  default: ({ children }) => <div data-testid="student-layout">{children}</div>,
}));

// Mock ToastContext
vi.mock("../../contexts/ToastContext.jsx", () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

// Mock AuthContext
vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { userId: 1, username: "student1", role: "STUDENT" },
  }),
}));

import api from "../../utils/api.js";

describe("Orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state when no orders exist", async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText(/No orders found/)).toBeInTheDocument();
      expect(screen.getByText("Browse Cafeterias")).toBeInTheDocument();
    });
  });

  it("renders order tracking with order details", async () => {
    // First call: fetch orders
    api.get.mockImplementation((url) => {
      if (url.includes("/api/orders/user/")) {
        return Promise.resolve({
          data: {
            data: [
              {
                orderId: 101,
                status: "PLACED",
                totalAmount: 90,
                cafeteriaId: 1,
                items: [
                  { menuItemId: 1, name: "Neuro-Burger", quantity: 2, unitPrice: 45, subtotal: 90 },
                ],
              },
            ],
          },
        });
      }
      // Menu fetch for name resolution
      if (url.includes("/api/menus/cafeteria/")) {
        return Promise.resolve({
          data: {
            data: [
              { menuId: 1, name: "Neuro-Burger" },
            ],
          },
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText("Order Tracking")).toBeInTheDocument();
      expect(screen.getByText("Order #101")).toBeInTheDocument();
      expect(screen.getByText("Total Paid")).toBeInTheDocument();
    });
  });

  it("displays order items with resolved names and quantities", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/api/orders/user/")) {
        return Promise.resolve({
          data: {
            data: [
              {
                orderId: 55,
                status: "PREPARING",
                totalAmount: 128,
                cafeteriaId: 2,
                items: [
                  { menuItemId: 10, quantity: 2, unitPrice: 40, subtotal: 80 },
                  { menuItemId: 11, quantity: 1, unitPrice: 48, subtotal: 48 },
                ],
              },
            ],
          },
        });
      }
      if (url.includes("/api/menus/cafeteria/2")) {
        return Promise.resolve({
          data: {
            data: [
              { menuId: 10, name: "Pasta" },
              { menuId: 11, name: "Smoothie" },
            ],
          },
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText(/2x Pasta/)).toBeInTheDocument();
      expect(screen.getByText(/1x Smoothie/)).toBeInTheDocument();
    });
  });

  it("shows cancel button for PLACED orders", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/api/orders/user/")) {
        return Promise.resolve({
          data: {
            data: [
              {
                orderId: 200,
                status: "PLACED",
                totalAmount: 50,
                cafeteriaId: 1,
                items: [{ menuItemId: 1, quantity: 1, unitPrice: 50, subtotal: 50 }],
              },
            ],
          },
        });
      }
      if (url.includes("/api/menus/cafeteria/")) {
        return Promise.resolve({ data: { data: [{ menuId: 1, name: "Burger" }] } });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText("Cancel Order")).toBeInTheDocument();
    });
  });
});
