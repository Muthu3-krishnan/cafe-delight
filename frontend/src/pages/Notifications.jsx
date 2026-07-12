import React, { useEffect, useState } from "react";
import { ShoppingCart, ChefHat, CheckCircle2, Mail, XCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CONFIG = {
  PENDING: { icon: ShoppingCart, bg: "var(--status-pending-bg)", fg: "var(--status-pending-fg)", label: "New Order Placed" },
  PREPARING: { icon: ChefHat, bg: "var(--status-preparing-bg)", fg: "var(--status-preparing-fg)", label: "Order Preparing" },
  READY: { icon: CheckCircle2, bg: "var(--status-ready-bg)", fg: "var(--status-ready-fg)", label: "Order Ready" },
  DELIVERED: { icon: Mail, bg: "var(--status-delivered-bg)", fg: "var(--status-delivered-fg)", label: "Order Delivered" },
  CANCELLED: { icon: XCircle, bg: "var(--status-cancelled-bg)", fg: "var(--status-cancelled-fg)", label: "Order Cancelled" },
};

export default function Notifications() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const endpoint = isAdmin ? "/admin/orders" : "/orders/my";
    api.get(endpoint).then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, [isAdmin]);

  if (loading) return <p>Loading notifications…</p>;

  if (orders.length === 0) {
    return <p style={{ color: "var(--text-muted)" }}>No notifications yet.</p>;
  }

  return (
    <div className="card" style={{ padding: 8 }}>
      {orders.map((order) => {
        const cfg = CONFIG[order.status] || CONFIG.PENDING;
        const Icon = cfg.icon;
        const who = isAdmin ? ` by ${order.user?.name}` : "";
        return (
          <div key={order.id} className="notif-item">
            <div className="notif-icon" style={{ background: cfg.bg, color: cfg.fg }}>
              <Icon size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <strong>{cfg.label}</strong>
              <p style={{ margin: "2px 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Order #{order.id}{who} is now {order.status.toLowerCase()}.
              </p>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
