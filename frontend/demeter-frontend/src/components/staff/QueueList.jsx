import React, { useState, useEffect, useCallback } from 'react';
import QueueItem from './QueueItem';
import api from '../../utils/api.js';
import { connectWebSocket, subscribe, disconnectWebSocket } from '../../utils/websocket.js';

const QueueList = ({ cafeteriaId = 1 }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get(`/api/orders/cafeteria/${cafeteriaId}?activeOnly=true`);
      const data = res.data.data || [];
      setOrders(data.map(o => ({
        id: o.orderId,
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString() : "N/A",
        items: (o.items || []).map(i => `Item #${i.menuItemId}`),
        status: o.status === 'PLACED' ? 'Pending' :
                o.status === 'CONFIRMED' || o.status === 'PREPARING' ? 'Preparing' :
                o.status === 'READY' ? 'Ready' : o.status,
        rawStatus: o.status,
      })));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [cafeteriaId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // WebSocket for real-time updates
  useEffect(() => {
    connectWebSocket((stompClient) => {
      subscribe(stompClient, "/topic/staff", () => {
        fetchOrders();
      });
      subscribe(stompClient, "/topic/orders", () => {
        fetchOrders();
      });
    });

    return () => disconnectWebSocket();
  }, [fetchOrders]);

  const handleCancel = async (id) => {
    try {
      await api.put(`/api/orders/${id}/status?status=CANCELLED`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.put(`/api/orders/${id}/status?status=CONFIRMED`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to accept order:", err);
    }
  };

  const handleMarkReady = async (id) => {
    try {
      await api.put(`/api/orders/${id}/status?status=READY`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to mark ready:", err);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await api.put(`/api/orders/${id}/status?status=COMPLETED`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to mark completed:", err);
    }
  };

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
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-teal-400 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No orders in queue</p>
          ) : (
            orders.map((order) => (
              <QueueItem
                key={order.id}
                order={order}
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
