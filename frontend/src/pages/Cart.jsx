import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const placeOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const res = await api.post("/orders", {
        items: cart.map((i) => ({ menuItemId: i.id, quantity: i.qty })),
      });
      setCart([]);
      navigate("/order-success", { state: res.data });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place the order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div>
        <h2>Your cart is empty</h2>
        <p style={{ color: "var(--text-muted)" }}>Browse the menu and add something delicious.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h2>Your Order</h2>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {cart.map((item) => (
          <div key={item.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{item.name}</strong>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>₹{item.price.toFixed(0)} each</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="btn-outline" onClick={() => updateQty(item.id, -1)}>−</button>
              <span>{item.qty}</span>
              <button className="btn-outline" onClick={() => updateQty(item.id, 1)}>+</button>
              <span style={{ minWidth: 60, textAlign: "right", fontWeight: 600 }}>₹{(item.price * item.qty).toFixed(0)}</span>
              <button className="btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Total: ₹{total.toFixed(0)}</span>
        <button className="btn-primary" onClick={placeOrder} disabled={placing}>
          {placing ? "Placing order…" : "Place order"}
        </button>
      </div>

      {error && <p className="error-text" style={{ marginTop: 10 }}>{error}</p>}
    </div>
  );
}
