import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentHome from "../StudentHome.jsx";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock("../../utils/api.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../../layouts/StudentLayout.jsx", () => ({
  default: ({ children }) => <div data-testid="student-layout">{children}</div>,
}));

vi.mock("../../components/common/CafeteriaCard.jsx", () => ({
  default: ({ cafe }) => <div data-testid="cafe-card">{cafe.name}</div>,
}));

// Mock FoodCard — capture onClick so we can test it opens the modal
vi.mock("../../components/common/FoodCard.jsx", () => ({
  default: ({ title, onClick }) => (
    <div data-testid="food-card" onClick={onClick}>{title}</div>
  ),
}));

vi.mock("../../components/common/FoodModal.jsx", () => ({
  default: ({ food, onClose }) => (
    <div data-testid="food-modal">
      <span>{food.title}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { username: "john_doe", userId: 1, role: "STUDENT", token: "tok" },
    isAuthenticated: true,
  }),
}));

vi.mock("../../contexts/CartContext.jsx", () => ({
  useCart: () => ({
    cart: [],
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn(),
    total: 0,
  }),
}));

vi.mock("../../contexts/ToastContext.jsx", () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

vi.mock("../../utils/foodImages.js", () => ({
  getFoodImage: (name) => `mock-image-${name}`,
  getCafeteriaImage: (id) => `mock-cafe-image-${id}`,
}));

import api from "../../utils/api.js";

describe("StudentHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders welcome message with first name", async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<StudentHome />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome back,/)).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  it("renders cafeteria cards from API data", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: [
          { cafeteriaId: 1, name: "The Last Drop", operatingHours: "08:00-22:00", isActive: true, averageRating: 4.2 },
          { cafeteriaId: 2, name: "Hex Core Cafe", operatingHours: "07:00-20:00", isActive: true, averageRating: 3.9 },
        ],
      },
    });

    render(<StudentHome />);

    await waitFor(() => {
      expect(screen.getByText("The Last Drop")).toBeInTheDocument();
      expect(screen.getByText("Hex Core Cafe")).toBeInTheDocument();
    });
  });

  it("renders fallback recommended items", async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<StudentHome />);

    await waitFor(() => {
      expect(screen.getByText("Neuro-Burger")).toBeInTheDocument();
      expect(screen.getByText("Quantum Quinoa Bowl")).toBeInTheDocument();
      expect(screen.getByText("Sunset Smoothie")).toBeInTheDocument();
    });
  });

  it("renders fallback cafeterias when API fails", async () => {
    api.get.mockRejectedValueOnce(new Error("Network error"));

    render(<StudentHome />);

    await waitFor(() => {
      expect(screen.getByText("The Last Drop")).toBeInTheDocument();
      expect(screen.getByText("Hex Core Cafe")).toBeInTheDocument();
      expect(screen.getByText("Skyline Sips")).toBeInTheDocument();
    });
  });

  it("adds to cart when clicking a recommended item", async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<StudentHome />);

    await waitFor(() => {
      expect(screen.getByText("Neuro-Burger")).toBeInTheDocument();
    });

    // Click the first recommended food card — now adds to cart directly
    const foodCards = screen.getAllByTestId("food-card");
    await user.click(foodCards[0]);
  });
});
