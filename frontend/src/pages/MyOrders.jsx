import React, { useEffect, useState } from "react";
import api from "../api/axios";

const badgeClass = {
  PENDING: "badge-pending",
  PREPARING: "badge-preparing",
  READY: "badge-ready",
  DELIVERED: "badge-delivered",
  CANCELLED: "badge-cancelled",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading your orders…</p>;

  return (
    <div>
      {orders.length === 0 && <p style={{ color: "var(--text-muted)" }}>You haven't placed any orders yet.</p>}

      <div style={{ display: "grid", gap: 14 }}>
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Order #{order.id}</strong>
              <span className={`badge ${badgeClass[order.status]}`}>{order.status}</span>
            </div>
            <ul style={{ paddingLeft: 18, margin: "10px 0" }}>
              {order.items.map((it) => (
                <li key={it.id} style={{ fontSize: "0.9rem" }}>
                  {it.menuItem.name} × {it.quantity} — ₹{(it.priceAtOrderTime * it.quantity).toFixed(0)}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
              <strong style={{ color: "var(--text)" }}>Total: ₹{order.totalAmount.toFixed(0)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
