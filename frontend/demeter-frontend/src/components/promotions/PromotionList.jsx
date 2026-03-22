import React, { useState, useEffect } from 'react';
import PromotionForm from './PromotionForm';
import { useAuth } from '../../contexts/AuthContext.jsx';
import api from '../../utils/api.js';

const PromotionList = () => {
  const { user } = useAuth();
  const isStaff = user?.role === 'STAFF';
  const cafeteriaId = user?.assignedCafeteriaId;
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [menuMap, setMenuMap] = useState({});

  useEffect(() => {
    if (!cafeteriaId) return;
    api.get(`/api/menus/cafeteria/${cafeteriaId}`)
      .then(res => {
        const map = {};
        (res.data.data || []).forEach(item => { map[item.menuId] = item.name; });
        setMenuMap(map);
      })
      .catch(() => {});
  }, [cafeteriaId]);

  useEffect(() => {
    if (cafeteriaId) fetchDiscounts();
  }, [filter, cafeteriaId]);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        filter === 'ACTIVE'
          ? `/api/discounts/cafeteria/${cafeteriaId}/active`
          : filter === 'PENDING'
          ? `/api/discounts/cafeteria/${cafeteriaId}/pending`
          : `/api/discounts/cafeteria/${cafeteriaId}`;

      const res = await api.get(endpoint);
      setDiscounts(res.data);
    } catch (err) {
      setError('Failed to load discounts');
      if (import.meta.env.DEV) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await api.delete(`/api/discounts/${id}`);
        fetchDiscounts();
      } catch (err) {
        if (import.meta.env.DEV) console.error('Error deleting discount:', err);
      }
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await api.put(`/api/discounts/${id}/deactivate`);
      fetchDiscounts();
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error deactivating discount:', err);
    }
  };

  const handleActivate = async (id) => {
    try {
      await api.put(`/api/discounts/${id}/activate`);
      fetchDiscounts();
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error activating discount:', err);
    }
  };

  const handleApprove = async (id, staffUserId) => {
    try {
      await api.put(`/api/discounts/${id}/approve?staffUserId=${staffUserId}`);
      fetchDiscounts();
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error approving discount:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/discounts/${id}/reject`);
      fetchDiscounts();
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error rejecting discount:', err);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedDiscount(null);
    fetchDiscounts();
  };

  const resolveItemNames = (applicableItems) => {
    if (!applicableItems) return null;
    try {
      const ids = typeof applicableItems === 'string' ? JSON.parse(applicableItems) : applicableItems;
      if (!Array.isArray(ids) || ids.length === 0) return applicableItems;
      const uniqueNames = [...new Set(ids.map(id => menuMap[id] || `Item #${id}`))];
      return uniqueNames.join(' + ');
    } catch {
      return applicableItems;
    }
  };

  const getStatusLabel = (discount) => {
    if (!discount.approvedBy && discount.aiGenerated) return 'PENDING';
    if (discount.isActive) return 'ACTIVE';
    return 'INACTIVE';
  };

  const getStatusStyle = (discount) => {
    const status = getStatusLabel(discount);
    if (status === 'ACTIVE') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400';
  };

  const formatValue = (discount) => {
    if (discount.discountType === 'PERCENTAGE') return `${discount.discountValue}%`;
    if (discount.discountType === 'BOGO') return 'BOGO';
    if (discount.discountType === 'COMBO_FIXED_PRICE') return `${discount.discountValue} GK combo`;
    return `${discount.discountValue} GK`;
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
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Discounts ({discounts.length})
        </h2>
        {isStaff && (
          <button
            onClick={() => {
              setSelectedDiscount(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-amber-400 text-gray-900 hover:bg-amber-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Discount
          </button>
        )}
      </div>

      {/* Filter buttons — matches StaffDashboard tab style */}
      <div className="flex gap-2 mb-6">
        {['ALL', 'ACTIVE', 'PENDING'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-amber-400 text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            {f === 'ALL' ? 'All' : f === 'ACTIVE' ? 'Active' : 'Pending'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : discounts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
          <p className="text-gray-500 dark:text-gray-400">No discounts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {discounts.map((discount) => {
            const status = getStatusLabel(discount);
            return (
              <div
                key={discount.discountId}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Card top */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                          {discount.discountType.replace(/_/g, ' ')}
                        </h3>
                        {discount.aiGenerated && (
                          <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            AI
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(discount)}`}>
                        {status}
                      </span>
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        {formatValue(discount)}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    {discount.applicableItems && (
                      <span>Items: {resolveItemNames(discount.applicableItems)}</span>
                    )}
                    {discount.requirements && (
                      <span>Req: {discount.requirements}</span>
                    )}
                    {discount.endDate && (
                      <span>Expires: {new Date(discount.endDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Card bottom — action buttons (staff only) */}
                {isStaff && (
                  <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700">
                    {status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(discount.discountId, user?.userId || 0)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(discount.discountId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {status === 'ACTIVE' && (
                      <button
                        onClick={() => handleDeactivate(discount.discountId)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors"
                      >
                        Deactivate
                      </button>
                    )}
                    {status === 'INACTIVE' && (
                      <button
                        onClick={() => handleActivate(discount.discountId)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDiscount(discount);
                        setShowForm(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Edit
                    </button>

                    <div className="flex-1" />
                    <button
                      onClick={() => handleDelete(discount.discountId)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PromotionList;
