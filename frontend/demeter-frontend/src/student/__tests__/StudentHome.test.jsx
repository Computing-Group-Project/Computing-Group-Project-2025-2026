import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import StudentHome from "../StudentHome.jsx";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock api
vi.mock("../../utils/api.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock StudentLayout to render children directly
vi.mock("../../layouts/StudentLayout.jsx", () => ({
  default: ({ children }) => <div data-testid="student-layout">{children}</div>,
}));

// Mock CafeteriaCard
vi.mock("../../components/common/CafeteriaCard.jsx", () => ({
  default: ({ cafe }) => <div data-testid="cafe-card">{cafe.name}</div>,
}));

// Mock FoodCard
vi.mock("../../components/common/FoodCard.jsx", () => ({
  default: ({ title }) => <div data-testid="food-card">{title}</div>,
}));

// Mock AuthContext
vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { username: "john_doe", userId: 1, role: "STUDENT", token: "tok" },
    isAuthenticated: true,
  }),
}));

// Mock SVG imports
vi.mock("../../assets/submarine.svg", () => ({ default: "submarine.svg" }));
vi.mock("../../assets/burger.svg", () => ({ default: "burger.svg" }));

import api from "../../utils/api.js";

describe("StudentHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders welcome message with first name", async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<StudentHome />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, john/)).toBeInTheDocument();
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
});
