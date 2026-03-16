import { useMemo, useState, useEffect } from "react";
import StudentLayout from "../layouts/StudentLayout.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useWallet } from "../contexts/WalletContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { Trash2, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api.js";

export default function Cart() {

  const { cart, removeFromCart, clearCart } = useCart();
  const { balance, refreshBalance } = useWallet();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.total, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!selectedDiscount) return 0;
    const d = selectedDiscount;
    if (d.discountType === 'PERCENTAGE') {
      return subtotal * (Number(d.discountValue) / 100);
    } else if (d.discountType === 'FIXED_AMOUNT') {
      return Math.min(Number(d.discountValue), subtotal);
    }
    return 0;
  }, [selectedDiscount, subtotal]);

  const total = subtotal - discountAmount;

  useEffect(() => {
    if (cart.length > 0) {
      const cafeteriaId = cart[0].cafeteriaId;
      api.get(`/api/discounts/cafeteria/${cafeteriaId}/active`)
        .then(res => setDiscounts(res.data || []))
        .catch(() => setDiscounts([]));
    } else {
      setDiscounts([]);
      setSelectedDiscount(null);
    }
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast("Your cart is empty!", "warning");
      return;
    }

    if (balance < total) {
      showToast("Not enough GK in your wallet!", "error");
      return;
    }

    setCheckingOut(true);

    try {
      // All items are guaranteed to be from the same cafeteria (enforced by CartContext)
      const cafeteriaId = cart[0].cafeteriaId;

      const orderData = {
        userId: user.userId,
        cafeteriaId: cafeteriaId,
        totalAmount: total,
        appliedDiscountId: selectedDiscount?.discountId || null,
        items: cart.map(item => ({
          menuItemId: item.menuItemId || item.id,
          quantity: item.qty,
          unitPrice: item.price,
          subtotal: item.total,
        })),
      };

      const res = await api.post("/api/orders", orderData);
      const savedOrder = res.data.data;

      clearCart();
      await refreshBalance();

      navigate("/orders", { state: { orderId: savedOrder.orderId, items: cart, total: total } });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to place order. Please try again.", "error");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <StudentLayout>

      <div className="w-screen relative left-1/2 -translate-x-1/2 px-6">

        {cart.length === 0 ? (

          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">

            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <Sparkles size={32} className="text-gray-400 dark:text-slate-400" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mb-6">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/"
              className="bg-teal-400 hover:bg-teal-500 text-slate-900 font-semibold px-6 py-3 rounded-xl"
            >
              Browse Cafeterias
            </Link>

          </div>

        ) : (

          <>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 tracking-tight">
              Shopping Cart
            </h1>

            <div className="grid lg:grid-cols-[1.65fr_1fr] gap-10">

              {/* LEFT SIDE */}
              <div className="space-y-6">

                {cart.map((item, index) => (

                  <div
                    key={index}
                    className="
                    flex items-stretch
                    bg-white dark:bg-slate-800/90
                    border border-gray-200 dark:border-slate-700
                    rounded-2xl
                    overflow-hidden
                    shadow-lg
                    "
                  >

                    <div className="w-24">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 items-center justify-between px-6 py-5">

                      <div className="space-y-1">

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h2>

                        {item.extras?.length > 0 && (
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            + {item.extras.length} extras
                          </p>
                        )}

                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Qty: {item.qty}
                        </p>

                      </div>

                      <div className="flex items-center gap-6">

                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          GK {item.total}
                        </p>

                        <Trash2
                          onClick={() => removeFromCart(index)}
                          size={18}
                          className="text-red-400 hover:text-red-500 cursor-pointer"
                        />

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* RIGHT SIDE */}
              <div className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl h-fit">

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="flex justify-between text-gray-500 dark:text-slate-400 mb-4">
                  <span>Subtotal</span>
                  <span>GK {subtotal}</span>
                </div>

                {discounts.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Available Discounts</p>
                    <div className="space-y-2">
                      {discounts.map(d => (
                        <label key={d.discountId} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-slate-400">
                          <input
                            type="radio"
                            name="discount"
                            checked={selectedDiscount?.discountId === d.discountId}
                            onChange={() => setSelectedDiscount(d)}
                            className="accent-teal-400"
                          />
                          {d.discountType === 'PERCENTAGE' ? `${d.discountValue}% off` : `GK ${d.discountValue} off`}
                        </label>
                      ))}
                      {selectedDiscount && (
                        <button onClick={() => setSelectedDiscount(null)} className="text-xs text-red-400 hover:text-red-500">
                          Remove discount
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {selectedDiscount && (
                  <div className="flex justify-between text-green-500 mb-4">
                    <span>Discount</span>
                    <span>-GK {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-slate-700 my-4"></div>

                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white mb-6">
                  <span>Total</span>
                  <span className="text-yellow-400">
                    GK {total.toFixed(2)}
                  </span>
                </div>

                <div className="bg-gray-100 dark:bg-slate-700/60 rounded-xl py-3 text-center text-gray-600 dark:text-slate-300 mb-6">
                  Current Balance: <b className="text-gray-900 dark:text-white">GK {Number(balance).toFixed(2)}</b>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl disabled:opacity-50"
                >
                  {checkingOut ? "Processing..." : "Pay with Gold Krakens"}
                </button>

              </div>

            </div>

          </>
        )}

      </div>

    </StudentLayout>
  );
}
