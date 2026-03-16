import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "../CartContext.jsx";

// Mock ToastContext
const mockShowToast = vi.fn();
vi.mock("../ToastContext.jsx", () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Helper component to interact with cart context
function CartConsumer() {
  const { cart, addToCart, removeFromCart, clearCart, total } = useCart();
  return (
    <div>
      <span data-testid="count">{cart.length}</span>
      <span data-testid="total">{total}</span>
      {cart.map((item, i) => (
        <span key={i} data-testid={`item-${i}`}>{item.title}</span>
      ))}
      <button onClick={() => addToCart({ title: "Burger", total: 45, cafeteriaId: 1 })}>Add</button>
      <button onClick={() => addToCart({ title: "Smoothie", total: 20, cafeteriaId: 2 })}>Add Other Cafe</button>
      <button onClick={() => removeFromCart(0)}>Remove</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}

describe("CartContext", () => {
  it("starts with an empty cart", () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    );
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("total").textContent).toBe("0");
  });

  it("adds items to the cart", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText("Add"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("total").textContent).toBe("45");
    expect(screen.getByTestId("item-0").textContent).toBe("Burger");
  });

  it("removes items from the cart by index", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText("Add"));
    await user.click(screen.getByText("Add"));
    expect(screen.getByTestId("count").textContent).toBe("2");

    await user.click(screen.getByText("Remove"));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("clears the entire cart", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    );

    await user.click(screen.getByText("Add"));
    await user.click(screen.getByText("Add"));
    expect(screen.getByTestId("count").textContent).toBe("2");

    await user.click(screen.getByText("Clear"));
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("total").textContent).toBe("0");
  });

  it("auto-clears cart and shows toast when adding from a different cafeteria", async () => {
    const user = userEvent.setup();
    mockShowToast.mockClear();

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    );

    // Add item from cafeteria 1
    await user.click(screen.getByText("Add"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("item-0").textContent).toBe("Burger");

    // Add from cafeteria 2 — auto-clears and replaces
    await user.click(screen.getByText("Add Other Cafe"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("item-0").textContent).toBe("Smoothie");
    expect(mockShowToast).toHaveBeenCalledWith(
      "Cart cleared — switched to a different cafeteria.",
      "info"
    );
  });

  it("throws when useCart is used outside CartProvider", () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<CartConsumer />)).toThrow(
      "useCart must be used within a CartProvider"
    );
    spy.mockRestore();
  });
});
