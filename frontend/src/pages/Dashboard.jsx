import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, IndianRupee, Clock, UtensilsCrossed } from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [menuCount, setMenuCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/orders"), api.get("/menu")])
      .then(([ordersRes, menuRes]) => {
        setOrders(ordersRes.data);
        setMenuCount(menuRes.data.length);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard…</p>;

  const today = new Date().toDateString();
  const todaysOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING" || o.status === "PREPARING").length;

  const stats = [
    { label: "Orders Today", value: todaysOrders.length, icon: ClipboardList, color: "var(--status-preparing-fg)" },
    { label: "Total Revenue", value: `₹${revenue.toFixed(0)}`, icon: IndianRupee, color: "var(--status-ready-fg)" },
    { label: "Pending / Preparing", value: pendingCount, icon: Clock, color: "var(--status-pending-fg)" },
    { label: "Menu Items", value: menuCount, icon: UtensilsCrossed, color: "var(--accent)" },
  ];

  return (
    <div>
      <div className="stat-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card stat-card">
            <Icon size={22} color={color} />
            <span style={{ fontSize: "1.7rem", fontWeight: 700 }}>{value}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Recent Orders</h3>
          <Link to="/admin/orders" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>View all →</Link>
        </div>
        {orders.slice(0, 5).map((o) => (
          <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
            <span>#{o.id} — {o.user?.name}</span>
            <span style={{ color: "var(--text-muted)" }}>₹{o.totalAmount.toFixed(0)}</span>
          </div>
        ))}
        {orders.length === 0 && <p style={{ color: "var(--text-muted)" }}>No orders yet.</p>}
      </div>
    </div>
  );
}
