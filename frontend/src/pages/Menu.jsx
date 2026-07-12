import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import api from "../api/axios";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80";

export default function Menu({ cart, setCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/menu")
      .then((res) => setItems(res.data))
      .catch(() => setError("Could not load the menu. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["All Categories", ...new Set(items.map((i) => i.category))], [items]);

  const filtered = items.filter((i) => {
    const matchesCategory = category === "All Categories" || i.category === category;
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const qtyFor = (id) => cart.find((i) => i.id === id)?.qty || 0;

  const setQty = (item, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((i) => i.id !== item.id);
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, qty } : i));
      return [...prev, { ...item, qty }];
    });
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (loading) return <p>Loading menu…</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            style={{ paddingLeft: 36 }}
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 220 }}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="menu-grid">
        {filtered.map((item) => {
          const qty = qtyFor(item.id);
          return (
            <div key={item.id} className="menu-card" style={{ opacity: item.available ? 1 : 0.55 }}>
              <img
                className="menu-card-img"
                src={item.imageUrl || FALLBACK_IMG}
                alt={item.name}
                onError={(e) => { e.target.src = FALLBACK_IMG; }}
              />
              <div className="menu-card-body">
                <strong>{item.name}</strong>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.category}</span>
                <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1.05rem" }}>₹{item.price.toFixed(0)}</span>

                {qty === 0 ? (
                  <button
                    className="btn-primary"
                    style={{ width: "100%", marginTop: 10 }}
                    disabled={!item.available}
                    onClick={() => setQty(item, 1)}
                  >
                    {item.available ? "Add to Order" : "Unavailable"}
                  </button>
                ) : (
                  <>
                    <div className="qty-stepper">
                      <button onClick={() => setQty(item, qty - 1)}>−</button>
                      <span>{qty}</span>
                      <button onClick={() => setQty(item, qty + 1)}>+</button>
                    </div>
                    <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={() => setQty(item, qty + 1)}>
                      Add to Order
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p style={{ color: "var(--text-muted)" }}>No items match your search.</p>}
      </div>

      {cartCount > 0 && (
        <div className="sticky-cart-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart size={18} color="var(--accent)" />
            <strong>Cart ({cartCount} Items)</strong>
            <span style={{ color: "var(--text-muted)" }}>Subtotal : ₹{subtotal.toFixed(0)}</span>
          </div>
          <button className="btn-primary" onClick={() => navigate("/cart")}>Place Order</button>
        </div>
      )}
    </div>
  );
}
