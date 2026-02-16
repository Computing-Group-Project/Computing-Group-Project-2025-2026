import React, { useState, useEffect } from 'react';

const PromoCodeList = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState({
    code: '',
    description: '',
    promotionId: null,
    maxUsageCount: null,
    validFrom: '',
    validUntil: '',
  });
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetchPromoCodes();
    fetchPromotions();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/promo-codes');
      const data = await response.json();
      setPromoCodes(data);
    } catch (err) {
      setError('Failed to load promo codes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/promotions');
      const data = await response.json();
      setPromotions(data);
    } catch (err) {
      console.error('Error fetching promotions:', err);
    }
  };

  const handleAddCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCode),
      });

      if (!response.ok) {
        throw new Error('Failed to create promo code');
      }

      fetchPromoCodes();
      setNewCode({
        code: '',
        description: '',
        promotionId: null,
        maxUsageCount: null,
        validFrom: '',
        validUntil: '',
      });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        await fetch(`http://localhost:8080/api/promo-codes/${id}`, {
          method: 'DELETE',
        });
        fetchPromoCodes();
      } catch (err) {
        console.error('Error deleting promo code:', err);
      }
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/promo-codes/${id}/deactivate`, {
        method: 'PUT',
      });
      fetchPromoCodes();
    } catch (err) {
      console.error('Error deactivating promo code:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Promo Codes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : '+ New Code'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCode} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                value={newCode.code}
                onChange={(e) =>
                  setNewCode({ ...newCode, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g., SAVE20"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion *
              </label>
              <select
                value={newCode.promotionId || ''}
                onChange={(e) =>
                  setNewCode({
                    ...newCode,
                    promotionId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a promotion</option>
                {promotions.map((promo) => (
                  <option key={promo.promotionId} value={promo.promotionId}>
                    {promo.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newCode.description}
              onChange={(e) =>
                setNewCode({ ...newCode, description: e.target.value })
              }
              placeholder="Code description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid From
              </label>
              <input
                type="datetime-local"
                value={newCode.validFrom}
                onChange={(e) =>
                  setNewCode({ ...newCode, validFrom: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid Until
              </label>
              <input
                type="datetime-local"
                value={newCode.validUntil}
                onChange={(e) =>
                  setNewCode({ ...newCode, validUntil: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Usage Count
              </label>
              <input
                type="number"
                value={newCode.maxUsageCount || ''}
                onChange={(e) =>
                  setNewCode({
                    ...newCode,
                    maxUsageCount: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Unlimited"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Create Code
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-10 w-10 text-blue-500 mx-auto">⟳</div>
        </div>
      ) : promoCodes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No promo codes found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3">Code</th>
                <th className="text-left px-4 py-3">Promotion</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Valid Until</th>
                <th className="text-left px-4 py-3">Usage</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((code) => (
                <tr key={code.promoCodeId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{code.code}</td>
                  <td className="px-4 py-3">{code.promotionId}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        code.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {code.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {code.validUntil
                      ? new Date(code.validUntil).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {code.currentUsageCount}/{code.maxUsageCount || '∞'}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {code.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleDeactivate(code.promoCodeId)}
                        className="text-orange-500 hover:text-orange-700 text-sm"
                      >
                        Deactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(code.promoCodeId)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromoCodeList;
