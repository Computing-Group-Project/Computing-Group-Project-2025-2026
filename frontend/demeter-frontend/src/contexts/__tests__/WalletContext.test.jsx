import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WalletProvider, useWallet } from "../WalletContext.jsx";
import { AuthContext } from "../AuthContext.jsx";

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

// Wrapper that provides both AuthContext and WalletProvider
function Wrapper({ role = "STUDENT", isAuthenticated = true, children }) {
  const authValue = {
    user: role ? { role, token: "test-token" } : null,
    token: isAuthenticated ? "test-token" : null,
    isAuthenticated,
    login: vi.fn(),
    logout: vi.fn(),
  };
  return (
    <AuthContext.Provider value={authValue}>
      <WalletProvider>{children}</WalletProvider>
    </AuthContext.Provider>
  );
}

describe("WalletContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("fetches balance on mount for STUDENT role", async () => {
    api.get.mockResolvedValueOnce({
      data: { data: { balance: 250.5 } },
    });

    render(
      <Wrapper role="STUDENT">
        <WalletConsumer />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("balance").textContent).toBe("250.5");
    });
    expect(api.get).toHaveBeenCalledWith("/api/wallet/balance");
  });

  it("does not fetch balance for non-STUDENT roles", async () => {
    render(
      <Wrapper role="ADMIN">
        <WalletConsumer />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(api.get).not.toHaveBeenCalled();
    expect(screen.getByTestId("balance").textContent).toBe("0");
  });

  it("adds and deducts funds locally", async () => {
    const user = userEvent.setup();

    render(
      <Wrapper isAuthenticated={false} role={null}>
        <WalletConsumer />
      </Wrapper>
    );

    await user.click(screen.getByText("Add 100"));
    expect(screen.getByTestId("balance").textContent).toBe("100");

    await user.click(screen.getByText("Deduct 30"));
    expect(screen.getByTestId("balance").textContent).toBe("70");
  });

  it("subscribes to WebSocket for real-time updates when STUDENT", async () => {
    const { connectWebSocket, subscribe } = await import("../../utils/websocket.js");

    api.get.mockResolvedValue({
      data: { data: { balance: 100 } },
    });

    const mockClient = {};
    connectWebSocket.mockImplementation((cb) => cb(mockClient));

    render(
      <Wrapper role="STUDENT">
        <WalletConsumer />
      </Wrapper>
    );

    await waitFor(() => {
      expect(connectWebSocket).toHaveBeenCalled();
      expect(subscribe).toHaveBeenCalledWith(mockClient, "/topic/orders", expect.any(Function));
    });
  });

  it("does not subscribe to WebSocket for non-STUDENT roles", async () => {
    const { connectWebSocket } = await import("../../utils/websocket.js");

    render(
      <Wrapper role="STAFF">
        <WalletConsumer />
      </Wrapper>
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
