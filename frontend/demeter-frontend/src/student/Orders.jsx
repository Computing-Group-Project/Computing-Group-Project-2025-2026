import StudentLayout from "../layouts/StudentLayout.jsx";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaClock, FaCheckCircle, FaUtensils, FaBox, FaCheck, FaStar } from "react-icons/fa";

export default function Orders() {

  const location = useLocation();
  const order = location.state || null;

  const steps = [
    { label: "Order Placed", icon: <FaClock /> },
    { label: "Confirmed", icon: <FaCheckCircle /> },
    { label: "Preparing", icon: <FaUtensils /> },
    { label: "Ready for Pickup", icon: <FaBox /> },
    { label: "Completed", icon: <FaCheck /> }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentStep(prev => {

        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return steps.length - 1;
        }

        return prev + 1;

      });

    }, 2500);

    return () => clearInterval(interval);

  }, []);

  if (!order) {
    return (
      <StudentLayout>
        <div className="text-white text-center mt-20">
          No order found. Please place an order first.
        </div>
      </StudentLayout>
    );
  }

  return (

    <StudentLayout>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-center text-white">
          Order Tracking
        </h1>

        <p className="text-center text-gray-400 mt-1">
          ID: #{order.id}
        </p>

        {/* PROGRESS CARD */}
        <div className="mt-8 bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-lg">

          <div className="flex justify-between">

            {steps.map((step, index) => {

              const completed = index < currentStep;
              const active = index === currentStep;
              const isLast = currentStep === steps.length - 1;

              return (

                <div key={index} className="flex flex-col items-center flex-1">

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center
                    ${
                      completed || (isLast && index === steps.length - 1)
                        ? "bg-yellow-400 text-black"
                        : active
                        ? "bg-yellow-400 text-black animate-pulse"
                        : "bg-slate-700 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>

                  <p className="text-sm text-white mt-2 text-center">
                    {step.label}
                  </p>

                  {active && !isLast && (
                    <p className="text-yellow-400 text-xs mt-1">
                      In Progress...
                    </p>
                  )}

                </div>

              );

            })}

          </div>

        </div>

        {/* RATE BUTTON */}
        {currentStep === steps.length - 1 && !showReview && (

          <button
            onClick={() => setShowReview(true)}
            className="mt-8 w-full py-4 rounded-xl bg-yellow-400 text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90"
          >
            <FaStar />
            Rate Your Order
          </button>

        )}

        {/* REVIEW CARD */}
        {showReview && !reviewSubmitted && (

          <div className="mt-8 bg-slate-800 border border-yellow-400/40 rounded-xl p-6 text-center">

            <h2 className="text-white text-lg font-semibold mb-2">
              How was your meal?
            </h2>

            <p className="text-gray-400 text-sm mb-4">
              Review within 10m to earn rewards!
            </p>

            <div className="flex justify-center gap-2 mb-4">

              {[1,2,3,4,5].map((star) => (

                <FaStar
                  key={star}
                  size={28}
                  className={`cursor-pointer transition
                  ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-500"}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />

              ))}

            </div>

            <textarea
              placeholder="Leave a review (optional, max 200 chars)"
              className="w-full bg-slate-700 text-white p-3 rounded-lg mb-4"
            />

            <div className="flex justify-between">

              <button
                onClick={() => setShowReview(false)}
                className="text-gray-400"
              >
                Skip
              </button>

              <button
                onClick={() => setReviewSubmitted(true)}
                className="bg-teal-500 px-6 py-2 rounded-lg text-black font-semibold"
              >
                Submit Review
              </button>

            </div>

          </div>

        )}

        {/* THANK YOU MESSAGE */}
        {reviewSubmitted && (

          <div className="mt-8 bg-green-900/40 border border-green-400 rounded-2xl p-8 text-center">

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-green-400 text-green-400 text-xl">
                <FaCheck />
              </div>
            </div>

            <h2 className="text-green-400 text-lg font-semibold">
              Thanks for your feedback!
            </h2>

            <p className="text-green-300 text-sm mt-1">
              +5 GK Reward added to your wallet.
            </p>

          </div>

        )}

        {/* ORDER DETAILS */}
        <div className="mt-8 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">

          <h2 className="text-white font-semibold mb-4">
            Order Details
          </h2>

          {order.items?.map((item, index) => {

            const title = item.title || item.name || "Food Item";
            const qty = item.qty || item.quantity || 1;
            const price = item.total || (item.price * qty) || 0;

            return (

              <div key={index} className="flex items-center justify-between text-gray-200 mb-4">

                <div className="flex items-center gap-3">

                  <img
                    src={item.image || "/placeholder.png"}
                    alt={title}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                  />

                  <div className="flex flex-col">

                    <span className="text-white text-sm font-medium">
                      {qty}x {title}
                    </span>

                    {item.extras?.length > 0 && (
                      <span className="text-xs text-slate-400">
                        {item.extras.map(e => e.name).join(", ")}
                      </span>
                    )}

                  </div>

                </div>

                <span className="text-yellow-400 font-semibold">
                  GK {price}
                </span>

              </div>

            );

          })}

          <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-semibold">

            <span>Total Paid</span>
            <span>GK {order.total}</span>

          </div>

        </div>

      </div>

    </StudentLayout>

  );

}
