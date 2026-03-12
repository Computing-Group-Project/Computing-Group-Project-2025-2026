import { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext.jsx";


export default function FoodModal({ food, onClose }) {

  const [qty, setQty] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [show, setShow] = useState(false);
  const { addToCart } = useCart();
  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  if (!food) return null;

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) => {
      if (prev.find((e) => e.name === extra.name)) {
        return prev.filter((e) => e.name !== extra.name);
      }
      return [...prev, extra];
    });
  };

  const extrasTotal = selectedExtras.reduce(
    (sum, extra) => sum + extra.price,
    0
  );

  const total = (food.price + extrasTotal) * qty;

  // Smooth closing animation
  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 250);
  };


  const handleAdd = () => {
  addToCart({
    title: food.title,
    image: food.image,
    price: food.price,
    extras: selectedExtras,
    qty: qty,
    total: total
  });

  handleClose();
};
  return (

    /* BACKGROUND */
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
    >

      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
        w-full max-w-lg
        bg-slate-800
        rounded-t-3xl
        shadow-2xl
        border border-slate-700
        transform transition-transform duration-300 ease-out
        ${show ? "translate-y-0" : "translate-y-full"}
        flex flex-col
        max-h-[90vh]
        `}
      >

        {/* IMAGE */}
        <div className="relative">
          <img
            src={food.image}
            alt={food.title}
            className="w-full h-[230px] object-cover rounded-t-3xl"
          />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* TITLE */}
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-white">
              {food.title}
            </h2>

            <div className="text-right">
              <p className="text-yellow-400 font-semibold text-lg">
                GK {food.price}
              </p>

              {food.kcal && (
                <p className="text-xs text-slate-400">
                  {food.kcal} kcal
                </p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-slate-400 mt-2 text-sm">
            {food.description}
          </p>

          {/* EXTRAS */}
          {food.extras?.length > 0 && (
            <>
              <h3 className="mt-6 mb-3 font-semibold text-white">
                Customize
              </h3>

              <div className="space-y-3">

                {food.extras.map((extra) => {

                  const active = selectedExtras.find(
                    (e) => e.name === extra.name
                  );

                  return (
                    <div
                      key={extra.name}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition
                      ${
                        active
                          ? "border-cyan-400 bg-slate-700/50"
                          : "border-slate-600 bg-slate-700/30 hover:border-cyan-400"
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center
                          ${
                            active
                              ? "bg-cyan-400 border-cyan-400"
                              : "border-slate-400"
                          }`}
                        >
                          {active && (
                            <div className="w-2 h-2 bg-slate-900 rounded-sm"></div>
                          )}
                        </div>

                        <span className="text-white text-sm">
                          {extra.name}
                        </span>

                      </div>

                      <span className="text-slate-300 text-sm">
                        +GK {extra.price}
                      </span>

                    </div>
                  );
                })}

              </div>
            </>
          )}

          {/* QUANTITY + TOTAL */}
          <div className="mt-6 bg-slate-700/40 rounded-xl p-4 flex justify-between items-center">

            <div className="flex items-center gap-4">

              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
              >
                −
              </button>

              <span className="text-lg font-semibold text-white">
                {qty}
              </span>

              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
              >
                +
              </button>

            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Total</p>
              <p className="text-lg font-semibold text-white">
                GK {total}
              </p>
            </div>

          </div>

        </div>

        {/* ADD BUTTON */}
        <div className="p-4 border-t border-slate-700">
          <button
  onClick={handleAdd}
  className="w-full py-3 rounded-xl bg-teal-400 hover:bg-cyan-500 hover:scale-[1.02] transition text-slate-900 font-semibold"
>
  Add to Order
</button>
        </div>

      </div>

    </div>
  );
}
