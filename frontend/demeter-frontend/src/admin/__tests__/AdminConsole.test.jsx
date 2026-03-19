import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdminConsole from "../AdminConsole.jsx";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock api
vi.mock("../../utils/api.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock child components
vi.mock("../../components/admin/StaffCard", () => ({
  default: ({ staff }) => <div data-testid="staff-card">{staff.name}</div>,
}));

vi.mock("../../components/admin/WalletTable", () => ({
  default: () => <div data-testid="wallet-table">Wallet Table</div>,
}));

// Mock ToastContext
vi.mock("../../contexts/ToastContext.jsx", () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

// Mock contexts
let mockUser = { username: "admin_user", userId: 3, role: "ADMIN", token: "tok" };
const mockLogout = vi.fn();

vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
    isAuthenticated: true,
  }),
}));

import api from "../../utils/api.js";

describe("AdminConsole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { username: "admin_user", userId: 3, role: "ADMIN", token: "tok" };
  });

  it("renders admin console header and tabs", async () => {
    api.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(<AdminConsole />);

    await waitFor(() => {
      expect(screen.getByText("Admin Console")).toBeInTheDocument();
      expect(screen.getByText("Staff Management")).toBeInTheDocument();
      expect(screen.getByText("Student Wallets")).toBeInTheDocument();
      expect(screen.getByText("Audit Log")).toBeInTheDocument();
    });
  });

  it("renders staff list from API", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: 1, username: "swain" },
          { id: 2, username: "chef_mike" },
        ],
      },
    });

    render(<AdminConsole />);

    await waitFor(() => {
      expect(screen.getByText("Swain")).toBeInTheDocument();
      expect(screen.getByText("Chef_mike")).toBeInTheDocument();
    });
  });

  it("renders audit log tab", async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<AdminConsole />);

    await waitFor(() => {
      expect(screen.getByText("Audit Log")).toBeInTheDocument();
    });
  });
});
