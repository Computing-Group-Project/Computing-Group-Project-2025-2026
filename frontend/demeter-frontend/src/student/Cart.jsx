import { useMemo } from "react";
import StudentLayout from "../layouts/StudentLayout.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useWallet } from "../contexts/WalletContext.jsx";
import { Trash2, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const suggestionItem = {
  id: 201,
  title: "Void Latte",
  price: 15,
  image:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
};

export default function Cart() {

  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { balance, deductFunds } = useWallet();
  const navigate = useNavigate();

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.total, 0),
    [cart]
  );

  const addSuggestion = () => {
    addToCart({
      ...suggestionItem,
      qty: 1,
      total: suggestionItem.price,
    });
  };

  const handleCheckout = () => {

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (balance < subtotal) {
      alert("Not enough GK in your wallet!");
      return;
    }

    deductFunds(subtotal);

    const order = {
      id: Math.floor(Math.random() * 100000),
      items: cart,
      total: subtotal
    };

    clearCart();

    navigate("/orders", { state: order });

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

                {/* Suggestion */}
                <div className="rounded-2xl border border-teal-200 dark:border-teal-500/40 bg-teal-50 dark:bg-gradient-to-r dark:from-emerald-950/40 dark:via-cyan-950/30 dark:to-slate-900 px-6 py-5 space-y-4 shadow-lg">

                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                    <Sparkles size={18} />
                    <p className="font-semibold">
                      Pairs well with your order
                    </p>
                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <img
                        src={suggestionItem.image}
                        alt={suggestionItem.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />

                      <div>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {suggestionItem.title}
                        </p>

                        <p className="text-gray-500 dark:text-slate-400 text-sm">
                          GK {suggestionItem.price}
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={addSuggestion}
                      className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 px-6 py-2 rounded-xl text-gray-900 dark:text-white"
                    >
                      Add
                    </button>

                  </div>

                </div>

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

                <div className="border-t border-gray-200 dark:border-slate-700 my-4"></div>

                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white mb-6">
                  <span>Total</span>
                  <span className="text-yellow-400">
                    GK {subtotal}
                  </span>
                </div>

                <div className="bg-gray-100 dark:bg-slate-700/60 rounded-xl py-3 text-center text-gray-600 dark:text-slate-300 mb-6">
                  Current Balance: <b className="text-gray-900 dark:text-white">GK {balance}</b>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl"
                >
                  Pay with Gold Krakens
                </button>

              </div>

            </div>

          </>
        )}

      </div>

    </StudentLayout>
  );
}
