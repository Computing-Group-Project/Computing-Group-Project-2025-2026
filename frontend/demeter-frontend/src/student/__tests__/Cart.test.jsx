import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cart from "../Cart.jsx";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock api - use inline fn to avoid hoisting issue
vi.mock("../../utils/api.js", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
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

// Mock contexts
const mockRemoveFromCart = vi.fn();
const mockClearCart = vi.fn();
const mockRefreshBalance = vi.fn().mockResolvedValue(undefined);

let mockCart = [];

vi.mock("../../contexts/CartContext.jsx", () => ({
  useCart: () => ({
    cart: mockCart,
    removeFromCart: mockRemoveFromCart,
    clearCart: mockClearCart,
  }),
}));

vi.mock("../../contexts/WalletContext.jsx", () => ({
  useWallet: () => ({
    balance: 500,
    refreshBalance: mockRefreshBalance,
  }),
}));

vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { userId: 1, username: "student1", role: "STUDENT" },
  }),
}));

import api from "../../utils/api.js";

describe("Cart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCart = [];
  });

  it("shows empty cart message when cart is empty", () => {
    mockCart = [];
    render(<Cart />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Browse Cafeterias")).toBeInTheDocument();
  });

  it("displays cart items with title, quantity, and total", () => {
    mockCart = [
      { id: 1, menuItemId: 1, title: "Neuro-Burger", qty: 2, total: 90, price: 45, image: "burger.svg", cafeteriaId: 1 },
      { id: 2, menuItemId: 2, title: "Quantum Quinoa", qty: 1, total: 38, price: 38, image: "quinoa.svg", cafeteriaId: 1 },
    ];

    render(<Cart />);
    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    expect(screen.getByText("Neuro-Burger")).toBeInTheDocument();
    expect(screen.getByText("Quantum Quinoa")).toBeInTheDocument();
    expect(screen.getByText("Qty: 2")).toBeInTheDocument();
  });

  it("calls API and navigates to orders on successful checkout", async () => {
    const user = userEvent.setup();
    mockCart = [
      { id: 1, menuItemId: 1, title: "Burger", qty: 1, total: 45, price: 45, image: "burger.svg", cafeteriaId: 1 },
    ];
    api.post.mockResolvedValueOnce({
      data: { data: { orderId: 101 } },
    });

    render(<Cart />);
    await user.click(screen.getByText("Pay with Gold Krakens"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/orders", expect.objectContaining({
        userId: 1,
        cafeteriaId: 1,
        totalAmount: 45,
      }));
      expect(mockClearCart).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/orders", expect.any(Object));
    });
  });
});
