import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaClock, FaCheckCircle, FaUtensils, FaBox, FaCheck } from "react-icons/fa";

export default function Orders() {

  const location = useLocation();
  const order = location.state;

  const steps = [
    { label: "Order Placed", icon: <FaClock /> },
    { label: "Confirmed", icon: <FaCheckCircle /> },
    { label: "Preparing", icon: <FaUtensils /> },
    { label: "Ready for Pickup", icon: <FaBox /> },
    { label: "Completed", icon: <FaCheck /> }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {

    let step = 0;

    const interval = setInterval(() => {

      step++;
      setCurrentStep(step);

      if (step === steps.length) {
        clearInterval(interval);
      }

    }, 2500);

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="w-full flex justify-center py-10">

      <div className="w-full max-w-4xl px-8">

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-white">
          Order Tracking
        </h1>

        <p className="text-center text-sm mt-1 text-gray-400">
          ID: #{order?.id || "unknown"}
        </p>

        {/* Progress Card */}
        <div className="mt-8 bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-lg">

          <div className="flex items-center justify-between">

            {steps.map((step, index) => {

              const completed = index < currentStep;
              const active = index === currentStep;

              return (

                <div key={index} className="flex flex-col items-center flex-1">

                  {/* Circle */}
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-lg transition-all duration-500
                    ${
                      completed
                        ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/40"
                        : active
                        ? "bg-yellow-400 text-black animate-pulse shadow-md shadow-yellow-400/50"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Label */}
                  <p className="mt-2 text-sm text-center text-gray-400">
                    {step.label}
                  </p>

                  {/* Status */}
                  {active && (
                    <p className="text-yellow-400 text-xs mt-1">
                      In Progress...
                    </p>
                  )}

                  {completed && (
                    <p className="text-green-500 text-xs mt-1">
                      Completed
                    </p>
                  )}

                </div>

              );

            })}

          </div>

        </div>

        {/* Rate Button */}
        <button className="mt-8 w-full py-3 rounded-lg bg-yellow-400 hover:opacity-90 transition text-black font-semibold">
          ⭐ Rate Your Order
        </button>

        {/* Order Details */}
        <div className="mt-8 bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">

          <h2 className="text-lg font-semibold mb-4 text-white">
            Order Details
          </h2>

          {order?.items?.map((item, index) => (

            <div key={index} className="flex justify-between mb-3 text-gray-200">

              <span>{item.quantity}x {item.name}</span>
              <span>GK {item.price}</span>

            </div>

          ))}

          <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold text-white">

            <span>Total Paid</span>
            <span>GK {order?.total}</span>

          </div>

        </div>

      </div>

    </div>

  );
}