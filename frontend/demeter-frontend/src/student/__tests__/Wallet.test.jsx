import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Wallet from "../Wallet.jsx";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

// Mock api
vi.mock("../../utils/api.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock StudentLayout
vi.mock("../../layouts/StudentLayout.jsx", () => ({
  default: ({ children }) => <div data-testid="student-layout">{children}</div>,
}));

// Mock WalletContext
vi.mock("../../contexts/WalletContext.jsx", () => ({
  useWallet: () => ({
    balance: 150.75,
    refreshBalance: vi.fn(),
  }),
}));

import api from "../../utils/api.js";

describe("Wallet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays the current balance", async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<Wallet />);

    await waitFor(() => {
      expect(screen.getByText("150.75")).toBeInTheDocument();
      expect(screen.getByText("GK")).toBeInTheDocument();
      expect(screen.getByText("Current Balance")).toBeInTheDocument();
    });
  });

  it("shows transaction history table", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            transactionId: 1,
            description: "Order Payment",
            type: "DEBIT",
            amount: 45,
            balanceAfter: 105.75,
            referenceId: "ORD-101",
            createdAt: "2026-03-14T10:30:00",
          },
          {
            transactionId: 2,
            description: "Wallet Top-Up",
            type: "CREDIT",
            amount: 200,
            balanceAfter: 350.75,
            referenceId: "TOP-001",
            createdAt: "2026-03-13T09:00:00",
          },
        ],
      },
    });

    render(<Wallet />);

    await waitFor(() => {
      expect(screen.getByText("Transaction History")).toBeInTheDocument();
      expect(screen.getByText("Order Payment")).toBeInTheDocument();
      expect(screen.getByText("Wallet Top-Up")).toBeInTheDocument();
      expect(screen.getByText("DEBIT")).toBeInTheDocument();
      expect(screen.getByText("CREDIT")).toBeInTheDocument();
    });
  });

  it("shows empty message when no transactions exist", async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<Wallet />);

    await waitFor(() => {
      expect(screen.getByText("No transactions yet")).toBeInTheDocument();
    });
  });
});
