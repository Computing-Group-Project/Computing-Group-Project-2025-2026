import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { connectWebSocket, subscribe, disconnectWebSocket } from "../../utils/websocket.js";

const NotificationBell = ({ className = "" }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((msg) => {
    const notification = {
      id: Date.now() + Math.random(),
      title: msg.title || "Order Update",
      message: msg.message || `Order #${msg.orderId} status: ${msg.status}`,
      orderId: msg.orderId,
      status: msg.status,
      time: new Date(),
      read: false,
    };
    setNotifications(prev => [notification, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    if (!user?.username) return;

    connectWebSocket((stompClient) => {
      subscribe(stompClient, `/user/${user.username}/queue/notifications`, (msg) => {
        addNotification(msg);
      });
      subscribe(stompClient, "/topic/orders", (msg) => {
        if (msg.orderId) {
          addNotification(msg);
        }
      });
    });

    return () => disconnectWebSocket();
  }, [user?.username, addNotification]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead(); }}
        aria-label="Notifications"
        className="relative w-6 h-6 flex items-center justify-center"
      >
        <Bell
          size={20}
          className="text-gray-500 dark:text-slate-300 hover:text-gray-700 dark:hover:text-white transition"
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-semibold rounded-full w-4 h-4 flex items-center justify-center border border-white dark:border-slate-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-8 z-50 w-80 max-h-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
                  No notifications yet
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors ${
                      !n.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {n.message}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap mt-0.5">
                        {formatTime(n.time)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
