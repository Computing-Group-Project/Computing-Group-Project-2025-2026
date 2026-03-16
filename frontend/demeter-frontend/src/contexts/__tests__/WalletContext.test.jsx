import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WalletProvider, useWallet } from "../WalletContext.jsx";

// Mock the api module
vi.mock("../../utils/api.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock WebSocket utilities (WalletContext subscribes to /topic/orders)
vi.mock("../../utils/websocket.js", () => ({
  connectWebSocket: vi.fn(),
  subscribe: vi.fn(),
  disconnectWebSocket: vi.fn(),
}));

import api from "../../utils/api.js";

// Helper component to interact with wallet context
function WalletConsumer() {
  const { balance, addFunds, deductFunds, loading } = useWallet();
  return (
    <div>
      <span data-testid="balance">{balance}</span>
      <span data-testid="loading">{loading.toString()}</span>
      <button onClick={() => addFunds(100)}>Add 100</button>
      <button onClick={() => deductFunds(30)}>Deduct 30</button>
    </div>
  );
}

describe("WalletContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("fetches balance on mount for STUDENT role", async () => {
    localStorage.setItem(
      "authData",
      JSON.stringify({ role: "STUDENT", token: "test-token" })
    );
    api.get.mockResolvedValueOnce({
      data: { data: { balance: 250.5 } },
    });

    render(
      <WalletProvider>
        <WalletConsumer />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("balance").textContent).toBe("250.5");
    });
    expect(api.get).toHaveBeenCalledWith("/api/wallet/balance");
  });

  it("does not fetch balance for non-STUDENT roles", async () => {
    localStorage.setItem(
      "authData",
      JSON.stringify({ role: "ADMIN", token: "test-token" })
    );

    render(
      <WalletProvider>
        <WalletConsumer />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(api.get).not.toHaveBeenCalled();
    expect(screen.getByTestId("balance").textContent).toBe("0");
  });

  it("adds and deducts funds locally", async () => {
    const user = userEvent.setup();
    // No authData means no fetch
    render(
      <WalletProvider>
        <WalletConsumer />
      </WalletProvider>
    );

    await user.click(screen.getByText("Add 100"));
    expect(screen.getByTestId("balance").textContent).toBe("100");

    await user.click(screen.getByText("Deduct 30"));
    expect(screen.getByTestId("balance").textContent).toBe("70");
  });

  it("subscribes to WebSocket for real-time updates when STUDENT", async () => {
    const { connectWebSocket, subscribe } = await import("../../utils/websocket.js");

    localStorage.setItem(
      "authData",
      JSON.stringify({ role: "STUDENT", token: "test-token" })
    );
    api.get.mockResolvedValue({
      data: { data: { balance: 100 } },
    });

    // Make connectWebSocket invoke its callback with a mock client
    const mockClient = {};
    connectWebSocket.mockImplementation((cb) => cb(mockClient));

    render(
      <WalletProvider>
        <WalletConsumer />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(connectWebSocket).toHaveBeenCalled();
      expect(subscribe).toHaveBeenCalledWith(mockClient, "/topic/orders", expect.any(Function));
    });
  });

  it("does not subscribe to WebSocket for non-STUDENT roles", async () => {
    const { connectWebSocket } = await import("../../utils/websocket.js");

    localStorage.setItem(
      "authData",
      JSON.stringify({ role: "STAFF", token: "test-token" })
    );

    render(
      <WalletProvider>
        <WalletConsumer />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(connectWebSocket).not.toHaveBeenCalled();
  });

  it("throws when useWallet is used outside WalletProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<WalletConsumer />)).toThrow(
      "useWallet must be used within a WalletProvider"
    );
    spy.mockRestore();
  });
});
