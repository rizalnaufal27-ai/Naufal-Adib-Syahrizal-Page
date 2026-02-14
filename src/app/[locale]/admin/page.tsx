"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    created_at: string;
}

// Simple admin panel with password protection
export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Data state
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        order_number: "",
        service_type: "Video Editing",
        status: "pending",
        progress: 0,
    });

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (authenticated) {
            fetchOrders();
        }
    }, [authenticated]);

    const handleLogin = () => {
        // Simple client-side password (replace with proper auth in production)
        if (password === "naufal-admin-2026") {
            setAuthenticated(true);
            setError("");
        } else {
            setError("Invalid password");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            order_number: parseInt(formData.order_number),
            service_type: formData.service_type,
            status: formData.status,
            progress: formData.progress
        };

        if (editingOrder) {
            // Update existing
            const { error } = await supabase
                .from("orders")
                .update(orderData)
                .eq("id", editingOrder.id);

            if (!error) {
                setEditingOrder(null);
                setFormData({ order_number: "", service_type: "Video Editing", status: "pending", progress: 0 });
                fetchOrders();
            }
        } else {
            // Create new
            const { error } = await supabase
                .from("orders")
                .insert([orderData]);

            if (!error) {
                setFormData({ order_number: "", service_type: "Video Editing", status: "pending", progress: 0 });
                fetchOrders();
            }
        }
        setLoading(false);
    };

    const handleEdit = (order: Order) => {
        setEditingOrder(order);
        setFormData({
            order_number: order.order_number.toString(),
            service_type: order.service_type,
            status: order.status,
            progress: order.progress
        });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this order?")) {
            setLoading(true);
            await supabase.from("orders").delete().eq("id", id);
            fetchOrders();
            setLoading(false);
        }
    };

    if (!authenticated) {
        return (
            <div style={{ background: "#050505", minHeight: "100vh" }} className="flex items-center justify-center">
                <div className="noise-overlay" />
                <div className="glass-card p-8 w-full max-w-sm relative z-10">
                    <h1 className="text-xl font-bold mb-6 text-center gradient-text" style={{ fontFamily: "var(--font-heading)" }}>
                        Admin Access
                    </h1>
                    <div className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            placeholder="Enter admin password"
                            className="w-full px-4 py-3 rounded-xl text-sm"
                            style={{
                                background: "var(--color-bg-glass)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-text)",
                                outline: "none",
                            }}
                        />
                        {error && <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>}
                        <button onClick={handleLogin} className="btn-primary w-full">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#050505", minHeight: "100vh" }}>
            <div className="noise-overlay" />
            <div className="section-container py-12 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-heading)" }}>
                            Admin Dashboard
                        </h1>
                        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                            Manage orders and update progress
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a href="/" className="btn-outline text-xs py-2 px-4">
                            ← Home
                        </a>
                        <button
                            onClick={() => setAuthenticated(false)}
                            className="text-xs py-2 px-4 rounded-xl transition-colors"
                            style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-8">
                            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text)" }}>
                                {editingOrder ? "Edit Order" : "Add New Order"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Order Number</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.order_number}
                                        onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                                        placeholder="e.g. 882"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Service Type</label>
                                    <select
                                        value={formData.service_type}
                                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                                    >
                                        <option value="Video Editing" className="bg-gray-900">Video Editing</option>
                                        <option value="Graphic Design" className="bg-gray-900">Graphic Design</option>
                                        <option value="Illustration" className="bg-gray-900">Illustration</option>
                                        <option value="Photography" className="bg-gray-900">Photography</option>
                                        <option value="Web Development" className="bg-gray-900">Web Development</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none"
                                    >
                                        <option value="pending" className="bg-gray-900">Pending</option>
                                        <option value="processing" className="bg-gray-900">Processing</option>
                                        <option value="done" className="bg-gray-900">Done</option>
                                        <option value="cancelled" className="bg-gray-900">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs block mb-1 flex justify-between" style={{ color: "var(--color-text-muted)" }}>
                                        <span>Progress</span>
                                        <span>{formData.progress}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.progress}
                                        onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                                        className="w-full accent-blue-500"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {editingOrder && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingOrder(null);
                                                setFormData({ order_number: "", service_type: "Video Editing", status: "pending", progress: 0 });
                                            }}
                                            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors bg-white/5 hover:bg-white/10 text-white"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-primary py-2 rounded-lg text-sm"
                                    >
                                        {loading ? "Saving..." : (editingOrder ? "Update" : "Add Order")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                            <th className="text-left px-6 py-3 text-xs font-medium uppercase text-white/50">ID</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium uppercase text-white/50">Service</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium uppercase text-white/50">Status</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium uppercase text-white/50">Progress</th>
                                            <th className="text-right px-6 py-3 text-xs font-medium uppercase text-white/50">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-sm font-mono font-bold text-white">#{order.order_number}</td>
                                                <td className="px-6 py-4 text-sm text-white/70">{order.service_type}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`status-badge status-${order.status} text-xs px-2 py-1 rounded capitalize`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 rounded-full bg-white/10">
                                                            <div
                                                                className="h-full rounded-full bg-blue-500"
                                                                style={{ width: `${order.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-white/50">{order.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(order)}
                                                            className="p-1.5 rounded hover:bg-blue-500/20 text-blue-400"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(order.id)}
                                                            className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-white/30 text-sm">
                                                    No orders found. Add one to get started.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
