import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const STATUSES = ["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
const badgeClass = {
  PENDING: "badge-pending",
  PREPARING: "badge-preparing",
  READY: "badge-ready",
  DELIVERED: "badge-delivered",
  CANCELLED: "badge-cancelled",
};
const PAGE_SIZE = 6;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("All");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => api.get("/admin/orders").then((res) => setOrders(res.data));

  useEffect(() => { loadOrders(); }, []);

  const filtered = useMemo(
    () => (tab === "All" ? orders : orders.filter((o) => o.status === tab.toUpperCase())),
    [orders, tab]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeTab = (t) => { setTab(t); setPage(1); };

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      await loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div className="tabs">
          {["All", ...STATUSES.map((s) => s.charAt(0) + s.slice(1).toLowerCase())].map((t) => (
            <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => changeTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user?.name}</td>
                <td>{order.items.map((it) => `${it.menuItem.name} x${it.quantity}`).join(", ")}</td>
                <td>₹{order.totalAmount.toFixed(0)}</td>
                <td><span className={`badge ${badgeClass[order.status]}`}>{order.status}</span></td>
                <td>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ minWidth: 140 }}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)" }}>No orders in this category.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
          <button className="btn-outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === page ? "btn-primary" : "btn-outline"} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button className="btn-outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
        </div>
      )}
    </div>
  );
}
