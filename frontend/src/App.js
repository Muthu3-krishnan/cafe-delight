import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import AdminMenu from "./pages/AdminMenu";
import AdminOrders from "./pages/AdminOrders";

function Shell({ title, children, requireRole }) {
  return (
    <ProtectedRoute requireRole={requireRole}>
      <AppShell title={title}>{children}</AppShell>
    </ProtectedRoute>
  );
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "ADMIN" ? "/dashboard" : "/menu"} replace />;
}

function AppRoutes() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer routes */}
        <Route path="/menu" element={<Shell title="Menu"><Menu cart={cart} setCart={setCart} /></Shell>} />
        <Route path="/cart" element={<Shell title="Your Order"><Cart cart={cart} setCart={setCart} /></Shell>} />
        <Route path="/order-success" element={<Shell title="Order Confirmed"><OrderSuccess /></Shell>} />
        <Route path="/my-orders" element={<Shell title="My Orders"><MyOrders /></Shell>} />

        {/* Shared routes */}
        <Route path="/notifications" element={<Shell title="Notifications"><Notifications /></Shell>} />
        <Route path="/settings" element={<Shell title="Settings"><Settings /></Shell>} />

        {/* Admin-only routes */}
        <Route path="/dashboard" element={<Shell title="Dashboard" requireRole="ADMIN"><Dashboard /></Shell>} />
        <Route path="/admin/menu" element={<Shell title="Menu" requireRole="ADMIN"><AdminMenu /></Shell>} />
        <Route path="/admin/orders" element={<Shell title="Orders" requireRole="ADMIN"><AdminOrders /></Shell>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
