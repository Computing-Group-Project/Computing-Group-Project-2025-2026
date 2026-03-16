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

  it("renders the portal selector with three role options", () => {
    render(<Login />);
    expect(screen.getByText("Demeter")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("shows login form after selecting a portal", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByText("Student"));

    expect(screen.getByPlaceholderText("Enter your username or university ID")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Student Portal")).toBeInTheDocument();
  });

  it("can go back to portal selector", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByText("Staff"));
    expect(screen.getByText("Staff Portal")).toBeInTheDocument();

    await user.click(screen.getByText("Back"));
    expect(screen.getByText("Student")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("shows an error when submitting with empty fields", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByText("Student"));
    await user.click(screen.getByText("Login"));
    expect(screen.getByText("Please enter username and password")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("navigates to / for STUDENT role after login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: "STUDENT", token: "tok", username: "student1" });

    render(<Login />);
    await user.click(screen.getByText("Student"));
    await user.type(screen.getByPlaceholderText("Enter your username or university ID"), "student1");
    await user.type(screen.getByPlaceholderText("Enter your password"), "password123");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("student1", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("navigates to /staff for STAFF role after login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: "STAFF", token: "tok", username: "swain" });

    render(<Login />);
    await user.click(screen.getByText("Staff"));
    await user.type(screen.getByPlaceholderText("Enter your username"), "swain");
    await user.type(screen.getByPlaceholderText("Enter your password"), "pass");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("swain", "pass");
      expect(mockNavigate).toHaveBeenCalledWith("/staff");
    });
  });

  it("navigates to /admin for ADMIN role after login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ role: "ADMIN", token: "tok", username: "admin_user" });

    render(<Login />);
    await user.click(screen.getByText("Admin"));
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
    await user.click(screen.getByText("Student"));
    await user.type(screen.getByPlaceholderText("Enter your username or university ID"), "bad_user");
    await user.type(screen.getByPlaceholderText("Enter your password"), "wrong");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
