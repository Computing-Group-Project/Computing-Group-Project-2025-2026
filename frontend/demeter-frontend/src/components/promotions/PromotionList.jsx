import React, { useState, useEffect } from 'react';
import PromotionForm from './PromotionForm';

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchPromotions();
  }, [filter]);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        filter === 'ACTIVE'
          ? 'http://localhost:8080/api/promotions/active/list'
          : 'http://localhost:8080/api/promotions';

      const response = await fetch(endpoint);
      const data = await response.json();
      setPromotions(data);
    } catch (err) {
      setError('Failed to load promotions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await fetch(`http://localhost:8080/api/promotions/${id}`, {
          method: 'DELETE',
        });
        fetchPromotions();
      } catch (err) {
        console.error('Error deleting promotion:', err);
      }
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/promotions/${id}/deactivate`, {
        method: 'PUT',
      });
      fetchPromotions();
    } catch (err) {
      console.error('Error deactivating promotion:', err);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedPromotion(null);
    fetchPromotions();
  };

  if (showForm) {
    return (
      <PromotionForm
        promotionId={selectedPromotion?.promotionId}
        onSave={handleFormSave}
        onCancel={() => {
          setShowForm(false);
          setSelectedPromotion(null);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Promotions</h2>
        <button
          onClick={() => {
            setSelectedPromotion(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          + New Promotion
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded text-sm ${
            filter === 'ALL'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-3 py-1 rounded text-sm ${
            filter === 'ACTIVE'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Active
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-10 w-10 text-blue-500 mx-auto">⟳</div>
        </div>
      ) : promotions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No promotions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Value</th>
                <th className="text-left px-4 py-3">Min Amount</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Usage</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.promotionId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{promo.name}</td>
                  <td className="px-4 py-3">{promo.discountType}</td>
                  <td className="px-4 py-3">
                    {promo.discountType === 'PERCENTAGE'
                      ? `${promo.discountValue}%`
                      : `Rs. ${promo.discountValue}`}
                  </td>
                  <td className="px-4 py-3">
                    {promo.minOrderAmount
                      ? `Rs. ${promo.minOrderAmount}`
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        promo.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {promo.currentUsageCount}/{promo.maxUsageCount || '∞'}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedPromotion(promo);
                        setShowForm(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    {promo.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleDeactivate(promo.promotionId)}
                        className="text-orange-500 hover:text-orange-700 text-sm"
                      >
                        Deactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(promo.promotionId)}
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

export default PromotionList;
