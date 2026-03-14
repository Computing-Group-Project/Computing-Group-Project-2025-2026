import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login.jsx";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockLogin = vi.fn();
vi.mock("../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form with username and password fields", () => {
    render(<Login />);
    expect(screen.getByText("Demeter")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows an error when submitting with empty fields", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByText("Login"));
    expect(screen.getByText("Please enter username and password")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("navigates to / for STUDENT role after login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: "STUDENT", token: "tok", username: "student1" });

    render(<Login />);
    await user.type(screen.getByPlaceholderText("Enter your username"), "student1");
    await user.type(screen.getByPlaceholderText("Enter your password"), "password123");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("student1", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("navigates to /admin for ADMIN role after login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: "ADMIN", token: "tok", username: "admin_user" });

    render(<Login />);
    await user.type(screen.getByPlaceholderText("Enter your username"), "admin_user");
    await user.type(screen.getByPlaceholderText("Enter your password"), "password123");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  it("displays error message on login failure", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<Login />);
    await user.type(screen.getByPlaceholderText("Enter your username"), "bad_user");
    await user.type(screen.getByPlaceholderText("Enter your password"), "wrong");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
