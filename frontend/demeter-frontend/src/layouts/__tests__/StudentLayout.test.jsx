import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import StudentLayout from "../StudentLayout.jsx";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock Navbar
vi.mock("../../components/common/Navbar.jsx", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

// Mock ProfileModal
vi.mock("../../components/common/ProfileModal.jsx", () => ({
  default: () => null,
}));

// Mock contexts
const mockClearCart = vi.fn();
vi.mock("../../contexts/CartContext.jsx", () => ({
  useCart: () => ({
    cart: [],
    clearCart: mockClearCart,
  }),
}));

const mockLogout = vi.fn();

vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { username: "student1", userId: 1, role: "STUDENT", token: "tok" },
    logout: mockLogout,
    isAuthenticated: true,
  }),
}));

describe("StudentLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children and navbar when authenticated", () => {
    render(
      <StudentLayout>
        <div data-testid="child-content">Hello</div>
      </StudentLayout>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders navbar with correct structure", () => {
    render(
      <StudentLayout>
        <div>Content</div>
      </StudentLayout>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });
});
