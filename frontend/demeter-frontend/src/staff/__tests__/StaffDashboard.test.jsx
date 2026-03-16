import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import StaffDashboard from "../StaffDashboard.jsx";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock api
vi.mock("../../utils/api.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock child components
vi.mock("../../components/staff/StatCard", () => ({
  default: ({ value, title }) => (
    <div data-testid="stat-card">
      <span data-testid="stat-value">{value}</span>
      <span data-testid="stat-title">{title}</span>
    </div>
  ),
}));

vi.mock("../../components/staff/QueueList", () => ({
  default: () => <div data-testid="queue-list">Queue</div>,
}));

vi.mock("../../components/staff/DiscountSuggestion", () => ({
  default: () => <div data-testid="discount-suggestion">Discounts</div>,
}));

// Mock AuthContext
const mockLogout = vi.fn();

vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { username: "swain", userId: 2, role: "STAFF", assignedCafeteriaId: 1, token: "tok" },
    logout: mockLogout,
    isAuthenticated: true,
  }),
}));

import api from "../../utils/api.js";

describe("StaffDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard header and stat cards", async () => {
    api.get
      .mockResolvedValueOnce({ data: { data: { name: "The Last Drop" } } }) // cafeteria name
      .mockResolvedValueOnce({
        data: {
          data: [
            { orderId: 1, status: "PLACED", totalAmount: 45 },
            { orderId: 2, status: "COMPLETED", totalAmount: 90 },
            { orderId: 3, status: "PREPARING", totalAmount: 60 },
          ],
        },
      });

    render(<StaffDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Staff Dashboard")).toBeInTheDocument();
      expect(screen.getByText(/Staff: Swain/)).toBeInTheDocument();
    });

    // Stat cards render
    const statCards = screen.getAllByTestId("stat-card");
    expect(statCards.length).toBe(3);
  });

  it("renders queue list and discount suggestion components", async () => {
    api.get
      .mockResolvedValueOnce({ data: { data: { name: "The Last Drop" } } })
      .mockResolvedValueOnce({ data: { data: [] } });

    render(<StaffDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("queue-list")).toBeInTheDocument();
      expect(screen.getByTestId("discount-suggestion")).toBeInTheDocument();
    });
  });
});
