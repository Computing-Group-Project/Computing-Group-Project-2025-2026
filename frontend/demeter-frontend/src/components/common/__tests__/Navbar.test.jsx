import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar.jsx";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock("../../../contexts/CartContext.jsx", () => ({
  useCart: () => ({
    cart: [{ title: "Burger", total: 45 }],
  }),
}));

vi.mock("../../../contexts/WalletContext.jsx", () => ({
  useWallet: () => ({
    balance: 250.5,
  }),
}));

vi.mock("../../../contexts/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { username: "john_doe", userId: 1, role: "STUDENT" },
  }),
}));

describe("Navbar", () => {
  it("renders the title and logo", () => {
    render(<Navbar />);
    expect(screen.getByText("Demeter")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("displays the wallet balance", () => {
    render(<Navbar />);
    expect(screen.getByText("250.50 GK")).toBeInTheDocument();
  });

  it("displays user initials from username", () => {
    render(<Navbar />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("shows cart item count badge", () => {
    render(<Navbar />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
