import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Coffee,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ mobileOpen, onNavigate }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const links = isAdmin
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
        { to: "/admin/orders", label: "Orders", icon: ClipboardList },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { to: "/settings", label: "Settings", icon: Settings },
      ]
    : [
        { to: "/menu", label: "Menu", icon: UtensilsCrossed },
        { to: "/my-orders", label: "My Orders", icon: ClipboardList },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { to: "/settings", label: "Settings", icon: Settings },
      ];

  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-brand">
        <Coffee size={22} color="var(--accent)" />
        <span>Cafe Delight</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-logout">
        <button
          className="sidebar-link"
          style={{ width: "100%", background: "transparent" }}
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
