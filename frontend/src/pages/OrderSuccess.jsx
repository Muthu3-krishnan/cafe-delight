import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div>
        <p>No recent order found.</p>
        <Link to="/menu"><button className="btn-primary">Back to menu</button></Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <div className="card">
        <CheckCircle2 size={48} color="var(--status-ready-fg)" style={{ marginBottom: 8 }} />
        <h2>Order placed successfully!</h2>
        <p style={{ color: "var(--text-muted)" }}>{state.message}</p>
        <p style={{ fontWeight: 600 }}>Order #{state.orderId} · ₹{state.total?.toFixed(0)}</p>
        <p className="badge badge-pending">{state.status}</p>
        <p style={{ marginTop: 16, fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Check your inbox for the confirmation email.
        </p>
        <Link to="/menu"><button className="btn-primary" style={{ marginTop: 12 }}>Order more</button></Link>
      </div>
    </div>
  );
}
