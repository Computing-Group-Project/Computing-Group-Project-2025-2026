import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute.jsx";

vi.mock("react-router-dom", () => ({
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
}));

let mockAuth = { isAuthenticated: true, user: { role: "STUDENT", token: "tok" } };

vi.mock("../../../contexts/AuthContext.jsx", () => ({
  useAuth: () => mockAuth,
}));

describe("ProtectedRoute", () => {
  it("renders children when authenticated with correct role", () => {
    mockAuth = { isAuthenticated: true, user: { role: "STUDENT", token: "tok" } };

    render(
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <div data-testid="protected-content">Secret</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    mockAuth = { isAuthenticated: false, user: null };

    render(
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <div>Secret</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/login");
  });

  it("redirects STUDENT away from ADMIN routes", () => {
    mockAuth = { isAuthenticated: true, user: { role: "STUDENT", token: "tok" } };

    render(
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <div>Admin Only</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/");
  });

  it("redirects ADMIN to /admin when accessing STUDENT routes", () => {
    mockAuth = { isAuthenticated: true, user: { role: "ADMIN", token: "tok" } };

    render(
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <div>Student Only</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/admin");
  });

  it("redirects STAFF to /staff when accessing STUDENT routes", () => {
    mockAuth = { isAuthenticated: true, user: { role: "STAFF", token: "tok" } };

    render(
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <div>Student Only</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/staff");
  });

  it("allows ADMIN to access STAFF routes when both roles are allowed", () => {
    mockAuth = { isAuthenticated: true, user: { role: "ADMIN", token: "tok" } };

    render(
      <ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}>
        <div data-testid="staff-content">Staff Dashboard</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("staff-content")).toBeInTheDocument();
  });
});
