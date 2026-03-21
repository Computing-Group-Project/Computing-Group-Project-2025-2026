import React, { useState, useEffect, useCallback, useRef } from 'react';
import QueueItem from './QueueItem';
import { useToast } from '../../contexts/ToastContext.jsx';
import api from '../../utils/api.js';
import { connectWebSocket, subscribe, disconnectWebSocket } from '../../utils/websocket.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const QueueList = ({ cafeteriaId = 1 }) => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState({});
  const fetchTimeoutRef = useRef(null);

  // Fetch menu items for this cafeteria to resolve names
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get(`/api/menus/cafeteria/${cafeteriaId}`);
        const items = res.data.data || [];
        const map = {};
        items.forEach(item => { map[item.menuId] = item.name; });
        setMenuItems(map);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
      }
    };
    fetchMenu();
  }, [cafeteriaId]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get(`/api/orders/cafeteria/${cafeteriaId}?activeOnly=true`);
      const data = res.data.data || [];
      setOrders(data.map(o => ({
        id: o.orderId,
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString() : "N/A",
        rawItems: o.items || [],
        status: o.status === 'PLACED' ? 'Pending' :
                o.status === 'CONFIRMED' || o.status === 'PREPARING' ? 'Preparing' :
                o.status === 'READY' ? 'Ready' : o.status,
        rawStatus: o.status,
      })));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [cafeteriaId]);

  const debouncedFetch = useCallback(() => {
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(() => {
      fetchOrders();
    }, 500);
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // WebSocket for real-time updates
  useEffect(() => {
    connectWebSocket((stompClient) => {
      subscribe(stompClient, "/topic/staff", () => {
        debouncedFetch();
      });
      subscribe(stompClient, "/topic/orders", () => {
        debouncedFetch();
      });
    });

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      disconnectWebSocket();
    };
  }, [debouncedFetch]);

  const updateStatus = async (id, status, actionLabel) => {
    try {
      await api.put(`/api/orders/${id}/status?status=${status}`);
      fetchOrders();
    } catch (err) {
      console.error(`Failed to ${actionLabel}:`, err);
      showToast(`Failed to ${actionLabel}. ${err.response?.data?.message || "Please try again."}`, 'error');
    }
  };

  const handleCancel = (id) => updateStatus(id, "CANCELLED", "cancel order");
  const handleAccept = (id) => updateStatus(id, "CONFIRMED", "accept order");
  const handleMarkReady = (id) => updateStatus(id, "READY", "mark ready");
  const handleMarkCompleted = (id) => updateStatus(id, "COMPLETED", "mark completed");

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 h-full">

      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Live Queue
        </h2>
        {orders.length > 0 && (
          <span className="animate-pulse bg-red-300 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-200 dark:border-red-900 shadow-sm">
            {orders.length} Active
          </span>
        )}
      </div>

      {/* list */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No orders in queue</p>
          ) : (
            orders.map((order) => (
              <QueueItem
                key={order.id}
                order={{
                  ...order,
                  items: (order.rawItems || []).map(i => {
                    const name = menuItems[i.menuItemId] || `Item #${i.menuItemId}`;
                    return i.quantity > 1 ? `${i.quantity}x ${name}` : name;
                  }),
                }}
                onCancel={() => handleCancel(order.id)}
                onAccept={() => handleAccept(order.id)}
                onMarkReady={() => handleMarkReady(order.id)}
                onMarkCompleted={() => handleMarkCompleted(order.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default QueueList;
