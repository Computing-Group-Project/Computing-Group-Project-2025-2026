import React, { useState, useEffect } from 'react';
import PromotionForm from './PromotionForm';

const PromotionList = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchDiscounts();
  }, [filter]);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        filter === 'ACTIVE'
          ? 'http://localhost:8080/api/discounts/active'
          : filter === 'PENDING'
          ? 'http://localhost:8080/api/discounts/pending'
          : 'http://localhost:8080/api/discounts';

      const response = await fetch(endpoint);
      const data = await response.json();
      setDiscounts(data);
    } catch (err) {
      setError('Failed to load discounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await fetch(`http://localhost:8080/api/discounts/${id}`, {
          method: 'DELETE',
        });
        fetchDiscounts();
      } catch (err) {
        console.error('Error deleting discount:', err);
      }
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/discounts/${id}/deactivate`, {
        method: 'PUT',
      });
      fetchDiscounts();
    } catch (err) {
      console.error('Error deactivating discount:', err);
    }
  };

  const handleApprove = async (id, staffUserId) => {
    try {
      await fetch(`http://localhost:8080/api/discounts/${id}/approve?staffUserId=${staffUserId}`, {
        method: 'PUT',
      });
      fetchDiscounts();
    } catch (err) {
      console.error('Error approving discount:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/discounts/${id}/reject`, {
        method: 'PUT',
      });
      fetchDiscounts();
    } catch (err) {
      console.error('Error rejecting discount:', err);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedDiscount(null);
    fetchDiscounts();
  };

  const getStatusLabel = (discount) => {
    if (!discount.approvedBy && discount.aiGenerated) return 'PENDING';
    if (discount.isActive) return 'ACTIVE';
    return 'INACTIVE';
  };

  const getStatusStyle = (discount) => {
    const status = getStatusLabel(discount);
    if (status === 'ACTIVE') return 'bg-green-100 text-green-800';
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (showForm) {
    return (
      <PromotionForm
        discountId={selectedDiscount?.discountId}
        onSave={handleFormSave}
        onCancel={() => {
          setShowForm(false);
          setSelectedDiscount(null);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Discounts</h2>
        <button
          onClick={() => {
            setSelectedDiscount(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          + New Discount
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {['ALL', 'ACTIVE', 'PENDING'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f
                ? f === 'ACTIVE'
                  ? 'bg-green-500 text-white'
                  : f === 'PENDING'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {f === 'ALL' ? 'All' : f === 'ACTIVE' ? 'Active' : 'Pending Approval'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-10 w-10 text-blue-500 mx-auto">&#x27F3;</div>
        </div>
      ) : discounts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No discounts found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Value</th>
                <th className="text-left px-4 py-3">Items</th>
                <th className="text-left px-4 py-3">Requirements</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">AI</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.discountId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{discount.discountType}</td>
                  <td className="px-4 py-3">
                    {discount.discountType === 'PERCENTAGE'
                      ? `${discount.discountValue}%`
                      : `${discount.discountValue} GK`}
                  </td>
                  <td className="px-4 py-3">{discount.applicableItems || '-'}</td>
                  <td className="px-4 py-3">{discount.requirements || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(discount)}`}>
                      {getStatusLabel(discount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {discount.aiGenerated ? (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        AI
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {getStatusLabel(discount) === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(discount.discountId, 23)}
                          className="text-green-500 hover:text-green-700 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(discount.discountId)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {discount.isActive && (
                      <button
                        onClick={() => handleDeactivate(discount.discountId)}
                        className="text-orange-500 hover:text-orange-700 text-sm"
                      >
                        Deactivate
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDiscount(discount);
                        setShowForm(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(discount.discountId)}
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
