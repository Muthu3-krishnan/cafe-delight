import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import api from "../api/axios";

const emptyForm = { name: "", description: "", price: "", category: "", available: true, imageUrl: "" };
const FALLBACK_IMG = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80";

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const loadMenu = () => api.get("/menu").then((res) => setItems(res.data));

  useEffect(() => { loadMenu(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, price: parseFloat(form.price) };
    try {
      if (editingId) {
        await api.put(`/admin/menu/${editingId}`, payload);
      } else {
        await api.post("/admin/menu", payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadMenu();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the menu item.");
    }
  };

  const editItem = (item) => {
    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      available: item.available,
      imageUrl: item.imageUrl || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    await api.delete(`/admin/menu/${id}`);
    loadMenu();
  };

  const categories = ["All Categories", ...new Set(items.map((i) => i.category))];
  const filtered = items.filter((i) => {
    const matchesCategory = category === "All Categories" || i.category === category;
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input style={{ paddingLeft: 36 }} placeholder="Search food..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 220 }}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitForm} className="card" style={{ display: "grid", gap: 12, marginBottom: 24, maxWidth: 480 }}>
          <h3 style={{ margin: 0 }}>{editingId ? "Edit item" : "Add new item"}</h3>
          <input name="name" placeholder="Name" required value={form.name} onChange={handleChange} />
          <textarea name="description" placeholder="Description" rows={3} value={form.description} onChange={handleChange} />
          <input name="price" type="number" step="0.01" placeholder="Price (₹)" required value={form.price} onChange={handleChange} />
          <input name="category" placeholder="Category (e.g. Burger, Pizza, Coffee)" required value={form.category} onChange={handleChange} />
          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem" }}>
            <input type="checkbox" name="available" style={{ width: "auto" }} checked={form.available} onChange={handleChange} />
            Available
          </label>
          {error && <p className="error-text">{error}</p>}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" type="submit">{editingId ? "Update" : "Add item"}</button>
            <button type="button" className="btn-outline" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(false); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="menu-grid">
        {filtered.map((item) => (
          <div key={item.id} className="menu-card" style={{ opacity: item.available ? 1 : 0.55 }}>
            <img className="menu-card-img" src={item.imageUrl || FALLBACK_IMG} alt={item.name}
              onError={(e) => { e.target.src = FALLBACK_IMG; }} />
            <div className="menu-card-body">
              <strong>{item.name}</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.category}</span>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>₹{item.price.toFixed(0)}</span>
              {!item.available && <span className="badge badge-cancelled" style={{ width: "fit-content" }}>Unavailable</span>}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => editItem(item)}>Edit</button>
                <button className="btn-danger" style={{ flex: 1 }} onClick={() => deleteItem(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
