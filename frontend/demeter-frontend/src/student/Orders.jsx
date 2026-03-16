import StudentLayout from "../layouts/StudentLayout.jsx";
import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaClock, FaCheckCircle, FaUtensils, FaBox, FaCheck, FaStar } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import api from "../utils/api.js";
import { connectWebSocket, subscribe, disconnectWebSocket } from "../utils/websocket.js";

const statusToStep = {
  PLACED: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY: 3,
  COMPLETED: 4,
  CANCELLED: -1,
};

export default function Orders() {
  const location = useLocation();
  const passedState = location.state || null;
  const { user } = useAuth();
  const { showToast } = useToast();

  const steps = [
    { label: "Order Placed", icon: <FaClock /> },
    { label: "Confirmed", icon: <FaCheckCircle /> },
    { label: "Preparing", icon: <FaUtensils /> },
    { label: "Ready for Pickup", icon: <FaBox /> },
    { label: "Completed", icon: <FaCheck /> }
  ];

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [menuNames, setMenuNames] = useState({});

  const fetchOrders = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const res = await api.get(`/api/orders/user/${user.userId}`);
      const data = res.data.data || [];
      // Sort by most recent
      data.sort((a, b) => (b.orderId || 0) - (a.orderId || 0));
      setOrders(data);

      // Auto-select the passed order or the most recent
      if (passedState?.orderId) {
        const found = data.find(o => o.orderId === passedState.orderId);
        if (found) setSelectedOrder(found);
        else if (data.length > 0) setSelectedOrder(data[0]);
      } else if (data.length > 0 && !selectedOrder) {
        setSelectedOrder(data[0]);
      }
    } catch {
      // If API fails and we have passed state, use that
      if (passedState) {
        setSelectedOrder({ orderId: passedState.orderId, status: "PLACED", items: passedState.items, totalAmount: passedState.total });
      }
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch menu item names for all cafeterias referenced by orders
  useEffect(() => {
    if (orders.length === 0) return;
    const cafeteriaIds = [...new Set(orders.map(o => o.cafeteriaId).filter(Boolean))];
    const fetchMenuNames = async () => {
      const map = { ...menuNames };
      for (const cId of cafeteriaIds) {
        try {
          const res = await api.get(`/api/menus/cafeteria/${cId}`);
          (res.data.data || []).forEach(item => {
            map[item.menuId] = item.name;
          });
        } catch {
          // skip
        }
      }
      setMenuNames(map);
    };
    fetchMenuNames();
  }, [orders]);

  // WebSocket for real-time updates
  useEffect(() => {
    connectWebSocket((stompClient) => {
      subscribe(stompClient, "/topic/orders", () => {
        // Refresh orders when an update comes in
        fetchOrders();
      });
    });

    return () => disconnectWebSocket();
  }, [fetchOrders]);

  const handleSubmitReview = async () => {
    if (!selectedOrder || rating === 0) return;
    setReviewError(null);
    try {
      await api.post("/api/reviews", {
        orderId: selectedOrder.orderId,
        cafeteriaId: selectedOrder.cafeteriaId,
        starRating: rating,
        reviewText: reviewText || null,
      });
      setReviewSubmitted(true);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review. You may have already reviewed this order or the review window has expired.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/api/orders/${orderId}/status?status=CANCELLED`);
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel order", "error");
    }
  };

  const currentStep = selectedOrder ? (statusToStep[selectedOrder.status] ?? 0) : 0;

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-10 w-10 border-4 border-teal-400 border-t-transparent rounded-full"></div>
        </div>
      </StudentLayout>
    );
  }

  if (orders.length === 0 && !passedState) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p className="text-gray-900 dark:text-white text-lg mb-4">
            No orders found. Place an order first.
          </p>
          <Link to="/" className="bg-teal-400 hover:bg-teal-500 text-slate-900 font-semibold px-6 py-3 rounded-xl">
            Browse Cafeterias
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">

        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white">
          Order Tracking
        </h1>

        {/* Order selector */}
        {orders.length > 1 && (
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            {orders.slice(0, 5).map(o => (
              <button
                key={o.orderId}
                onClick={() => { setSelectedOrder(o); setShowReview(false); setReviewSubmitted(false); setReviewError(null); setRating(0); }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedOrder?.orderId === o.orderId
                    ? "bg-teal-400 text-black"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white"
                }`}
              >
                #{o.orderId}
              </button>
            ))}
          </div>
        )}

        {selectedOrder && (
          <>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
              Order #{selectedOrder.orderId}
              {selectedOrder.placedAt && (
                <span className="ml-2 text-sm">
                  — {new Date(selectedOrder.placedAt).toLocaleDateString()} at {new Date(selectedOrder.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>

            {/* Cancel button for PLACED orders */}
            {selectedOrder.status === "PLACED" && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => handleCancelOrder(selectedOrder.orderId)}
                  className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {/* PROGRESS CARD */}
            {selectedOrder.status !== "CANCELLED" && (
              <div className="mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 rounded-xl shadow-lg">
                <div className="flex justify-between overflow-x-auto gap-2">
                  {steps.map((step, index) => {
                    const completed = index < currentStep;
                    const active = index === currentStep;
                    const isLast = currentStep === steps.length - 1;

                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center
                          ${completed || (isLast && index === steps.length - 1)
                            ? "bg-yellow-400 text-black"
                            : active
                            ? "bg-yellow-400 text-black animate-pulse"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-400"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white mt-2 text-center">{step.label}</p>
                        {active && !isLast && (
                          <p className="text-yellow-400 text-xs mt-1">In Progress...</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedOrder.status === "CANCELLED" && (
              <div className="mt-8 bg-red-900/40 border border-red-400 rounded-2xl p-8 text-center">
                <h2 className="text-red-400 text-lg font-semibold">Order Cancelled</h2>
                <p className="text-red-300 text-sm mt-1">This order has been cancelled and refunded.</p>
              </div>
            )}

            {/* RATE BUTTON */}
            {currentStep === steps.length - 1 && !showReview && !reviewSubmitted && (
              <button
                onClick={() => setShowReview(true)}
                className="mt-8 w-full py-4 rounded-xl bg-yellow-400 text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90"
              >
                <FaStar /> Rate Your Order
              </button>
            )}

            {/* REVIEW CARD */}
            {showReview && !reviewSubmitted && (
              <div className="mt-8 bg-white dark:bg-slate-800 border border-yellow-300 dark:border-yellow-400/40 rounded-xl p-6 text-center">
                <h2 className="text-gray-900 dark:text-white text-lg font-semibold mb-2">How was your meal?</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Review within 1 hour to earn rewards!</p>
                <div className="flex justify-center gap-2 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <FaStar
                      key={star}
                      size={28}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      role="button"
                      className={`cursor-pointer transition ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-500"}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    />
                  ))}
                </div>
                <textarea
                  placeholder="Leave a review (optional, max 200 chars)"
                  maxLength={200}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white p-3 rounded-lg mb-1"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 text-right mb-4">
                  {reviewText.length}/200
                </p>
                {reviewError && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
                    {reviewError}
                  </div>
                )}
                <div className="flex justify-between">
                  <button type="button" onClick={() => setShowReview(false)} className="text-gray-400">Skip</button>
                  <button type="button" onClick={handleSubmitReview} className="bg-teal-500 px-6 py-2 rounded-lg text-black font-semibold">
                    Submit Review
                  </button>
                </div>
              </div>
            )}

            {/* THANK YOU */}
            {reviewSubmitted && (
              <div className="mt-8 bg-green-900/40 border border-green-400 rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-green-400 text-green-400 text-xl">
                    <FaCheck />
                  </div>
                </div>
                <h2 className="text-green-400 text-lg font-semibold">Thanks for your feedback!</h2>
                <p className="text-green-300 text-sm mt-1">+5 GK Reward added to your wallet.</p>
              </div>
            )}

            {/* ORDER DETAILS */}
            <div className="mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-lg">
              <h2 className="text-gray-900 dark:text-white font-semibold mb-4">Order Details</h2>

              {(selectedOrder.items || passedState?.items || []).map((item, index) => {
                const title = item.title || item.name || menuNames[item.menuItemId] || "Food Item";
                const qty = item.qty || item.quantity || 1;
                const price = item.total || item.subtotal || (item.unitPrice * qty) || 0;

                return (
                  <div key={index} className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white text-sm font-medium">
                          {qty}x {title}
                        </span>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-semibold">GK {price}</span>
                  </div>
                );
              })}

              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 flex justify-between text-gray-900 dark:text-white font-semibold">
                <span>Total Paid</span>
                <span>GK {selectedOrder.totalAmount || passedState?.total || 0}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
}
