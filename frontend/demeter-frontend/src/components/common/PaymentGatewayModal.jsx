import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../../utils/api.js";

const PRESET_AMOUNTS = [50, 100, 250, 500];

const PaymentGatewayModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setStep("form");
    setAmount("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardName("");
    setErrors({});
    setErrorMessage("");
  };

  const handleClose = () => {
    if (step === "success") {
      onSuccess?.();
    }
    resetForm();
    onClose();
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  };

  const validate = () => {
    const errs = {};
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      errs.amount = "Enter a valid amount";
    } else if (amt > 500) {
      errs.amount = "Maximum 500 GK per top-up";
    }

    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length !== 16) {
      errs.cardNumber = "Card number must be 16 digits";
    }

    const expiryDigits = expiry.replace("/", "");
    if (expiryDigits.length !== 4) {
      errs.expiry = "Enter MM/YY";
    } else {
      const month = parseInt(expiryDigits.slice(0, 2), 10);
      if (month < 1 || month > 12) {
        errs.expiry = "Invalid month";
      }
    }

    if (!/^\d{3}$/.test(cvv)) {
      errs.cvv = "CVV must be 3 digits";
    }

    if (!cardName.trim()) {
      errs.cardName = "Name is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStep("processing");

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      await api.post("/api/wallet/student-topup", {
        amount: parseFloat(amount),
      });
      setStep("success");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Payment failed. Please try again."
      );
      setStep("error");
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl w-full max-w-md p-6 max-h-[calc(100vh-3rem)] overflow-y-auto animate-fade-in-up">

        {step === "form" && (
          <>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Add Funds
            </h3>

            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (GK)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 rounded-lg"
                />
                {amount && !errors.amount && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    = {(parseFloat(amount) * 10).toLocaleString()} LKR
                  </p>
                )}
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                )}
              </div>

              <div className="flex gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors
                      ${String(amount) === String(preset)
                        ? "bg-teal-400 text-white border-teal-400"
                        : "border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 rounded-lg font-mono"
                />
                {errors.cardNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 rounded-lg"
                  />
                  {errors.expiry && (
                    <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    className="w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 rounded-lg"
                  />
                  {errors.cvv && (
                    <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 rounded-lg"
                />
                {errors.cardName && (
                  <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-400 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-500 transition-colors"
                >
                  {amount && parseFloat(amount) > 0
                    ? `Pay ${(parseFloat(amount) * 10).toLocaleString()} LKR (${amount} GK)`
                    : "Pay"}
                </button>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Demo mode — no real charge
              </p>
            </form>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center py-8 animate-fade-in-up">
            <div className="animate-spin h-12 w-12 border-4 border-teal-400 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Processing payment...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please do not close this window
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center py-8 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Request Submitted
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
              Your request for {parseFloat(amount).toFixed(2)} GK has been submitted for admin approval
            </p>
            <button
              onClick={handleClose}
              className="bg-teal-400 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-teal-500 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center py-8 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Payment Failed
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {errorMessage}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("form")}
                className="bg-teal-400 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-500 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};

export default PaymentGatewayModal;
