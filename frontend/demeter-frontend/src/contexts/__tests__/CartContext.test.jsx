import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "../CartContext.jsx";

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
      <button onClick={() => addToCart({ title: "Burger", total: 45 })}>Add</button>
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

  it("throws when useCart is used outside CartProvider", () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<CartConsumer />)).toThrow(
      "useCart must be used within a CartProvider"
    );
    spy.mockRestore();
  });
});
