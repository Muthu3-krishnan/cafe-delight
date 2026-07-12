import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Account</h3>
        <div style={{ display: "grid", gap: 10, fontSize: "0.9rem" }}>
          <div><strong>Name:</strong> {user?.name}</div>
          <div><strong>Email:</strong> {user?.email}</div>
          <div><strong>Role:</strong> {user?.role}</div>
        </div>
        <button className="btn-danger" style={{ marginTop: 18 }} onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}
