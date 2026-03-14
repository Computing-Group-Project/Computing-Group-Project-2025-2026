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
  },
}));

// Mock websocket
vi.mock("../../utils/websocket.js", () => ({
  connectWebSocket: vi.fn(() => ({})),
  subscribe: vi.fn(),
  disconnectWebSocket: vi.fn(),
}));

// Mock StudentLayout
vi.mock("../../layouts/StudentLayout.jsx", () => ({
  default: ({ children }) => <div data-testid="student-layout">{children}</div>,
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
    api.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            orderId: 101,
            status: "PLACED",
            totalAmount: 90,
            cafeteriaId: 1,
            items: [
              { name: "Neuro-Burger", quantity: 2, unitPrice: 45, subtotal: 90 },
            ],
          },
        ],
      },
    });

    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText("Order Tracking")).toBeInTheDocument();
      expect(screen.getByText("Order #101")).toBeInTheDocument();
      expect(screen.getByText("Total Paid")).toBeInTheDocument();
    });
  });

  it("displays order items with correct quantities", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            orderId: 55,
            status: "PREPARING",
            totalAmount: 128,
            cafeteriaId: 2,
            items: [
              { name: "Pasta", quantity: 2, unitPrice: 40, subtotal: 80 },
              { name: "Smoothie", quantity: 1, unitPrice: 48, subtotal: 48 },
            ],
          },
        ],
      },
    });

    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText(/2x Pasta/)).toBeInTheDocument();
      expect(screen.getByText(/1x Smoothie/)).toBeInTheDocument();
    });
  });
});
