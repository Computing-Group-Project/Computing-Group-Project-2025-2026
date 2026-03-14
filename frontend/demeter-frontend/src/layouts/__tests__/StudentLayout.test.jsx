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

let mockIsAuthenticated = true;
const mockLogout = vi.fn();

vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: mockIsAuthenticated ? { username: "student1", userId: 1, role: "STUDENT", token: "tok" } : null,
    logout: mockLogout,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

describe("StudentLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = true;
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

  it("redirects to /login when not authenticated", () => {
    mockIsAuthenticated = false;
    render(
      <StudentLayout>
        <div>Protected Content</div>
      </StudentLayout>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
