import React, { useState, useEffect } from 'react';

const PromoCodeInput = ({ onPromoCodeChange, onValidate }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);

  const validatePromoCode = async (code) => {
    if (!code.trim()) {
      setIsValid(null);
      onPromoCodeChange(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/promo-codes/code/${code}/validate`
      );
      const valid = await response.json();
      setIsValid(valid);
      onPromoCodeChange(valid ? code : null);
      onValidate?.(valid);
    } catch (error) {
      console.error('Error validating promo code:', error);
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const code = e.target.value.toUpperCase();
    setPromoCode(code);
    validatePromoCode(code);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Promo Code (Optional)
      </label>
      <div className="relative">
        <input
          type="text"
          value={promoCode}
          onChange={handleChange}
          placeholder="Enter promo code"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isValid === null
              ? 'border-gray-300 focus:ring-blue-500'
              : isValid
              ? 'border-green-500 focus:ring-green-500'
              : 'border-red-500 focus:ring-red-500'
          }`}
          disabled={loading}
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 text-blue-500">⟳</div>
          </div>
        )}
        {isValid === true && (
          <div className="absolute right-3 top-2.5 text-green-500 font-bold">✓</div>
        )}
        {isValid === false && (
          <div className="absolute right-3 top-2.5 text-red-500 font-bold">✗</div>
        )}
      </div>
      {isValid === false && (
        <p className="text-red-500 text-sm mt-1">Invalid or expired promo code</p>
      )}
      {isValid === true && (
        <p className="text-green-500 text-sm mt-1">Promo code applied!</p>
      )}
    </div>
  );
};

export default PromoCodeInput;
