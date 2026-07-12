import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu as MenuIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Topbar({ title, onToggleSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const endpoint = user?.role === "ADMIN" ? "/admin/orders" : "/orders/my";
    api
      .get(endpoint)
      .then((res) => {
        const active = res.data.filter((o) => o.status === "PENDING" || o.status === "PREPARING");
        setPendingCount(active.length);
      })
      .catch(() => {});
  }, [user]);

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          className="topbar-icon-btn"
          style={{ display: "none" }}
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <MenuIcon size={18} />
        </button>
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{title}</h2>
      </div>

      <div className="topbar-actions">
        <button className="topbar-icon-btn" onClick={() => navigate("/notifications")} aria-label="Notifications">
          <Bell size={18} />
          {pendingCount > 0 && <span className="topbar-badge">{pendingCount > 9 ? "9+" : pendingCount}</span>}
        </button>

        <div className="topbar-user">
          <span className="topbar-user-avatar">{initials}</span>
          <span>{user?.name || "Guest"}</span>
        </div>
      </div>
    </header>
  );
}
