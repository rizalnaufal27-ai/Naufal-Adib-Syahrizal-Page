"use client";
import React from "react";
import Image from "next/image";
import { X, Calendar, MapPin, MoreHorizontal, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
    id: string;
    order_number: number;
    customer_name: string;
    customer_email: string;
    service_type: string;
    status: string;
    gross_amount: number;
    created_at: string;
    pricing_details?: any;
    // adding more for mockup compatibility
}

interface OrderDetailPanelProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (status: string) => void;
}

export function OrderDetailPanel({ order, isOpen, onClose, onStatusChange }: OrderDetailPanelProps) {
    if (!order) return null;

    const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

    const timeline = [
        { label: "Placed", date: "Placed 17, 2026 at 3:00 PM", status: "completed" },
        { label: "Confirmed", date: "Confirmed 4/23 at 11:00 PM", status: "completed" },
        { label: "Processing", date: "Processing 5/2 at 12:30 PM", status: "current" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" 
                    />

                    {/* Panel */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-[420px] bg-[#0c0c0c] border-l border-white/5 z-[70] flex flex-col shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-white/5"
                    >
                        <div className="p-8 space-y-8">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Order Detail Panel</h2>
                                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                                        ID: #CO-{order.order_number} <span className="text-white/10">•</span> <span className="text-blue-400">Beta-test</span>
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Client Info */}
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Client Info</h3>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
                                        {order.customer_name?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white/90 truncate">{order.customer_name}</p>
                                        <p className="text-xs text-white/30 truncate">{order.customer_email || "No email"}</p>
                                    </div>
                                    <button className="p-2 text-white/20 hover:text-white transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Order Summary</h3>
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">{order.service_type}</span>
                                            <span className="text-white/90 font-mono">{fmt(order.gross_amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/40">Studio Rental</span>
                                            <span className="text-white/60 font-mono">{fmt(200000)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/40">Extra Revisions</span>
                                            <span className="text-white/60 font-mono">{fmt(20000)}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-sm font-bold text-white uppercase tracking-widest">Total</span>
                                        <span className="text-lg font-black text-white">{fmt(order.gross_amount + 220000)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Status</h3>
                                <div className="relative">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => onStatusChange(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                                    >
                                        <option value="pending" className="bg-[#0f0f0f]">Pending</option>
                                        <option value="processing" className="bg-[#0f0f0f]">Processing</option>
                                        <option value="done" className="bg-[#0f0f0f]">Done</option>
                                        <option value="cancelled" className="bg-[#0f0f0f]">Cancelled</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                                </div>
                            </div>

                            {/* Payment */}
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Payment</h3>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                                            Paid
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/40">
                                        <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                                        <span>Visa •••• 4211</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Timeline</h3>
                                <div className="space-y-6 relative ml-2">
                                    <div className="absolute left-0 top-1.5 bottom-1.5 w-px bg-white/5"></div>
                                    {timeline.map((item, i) => (
                                        <div key={i} className="flex gap-4 relative">
                                            <div className={`w-2 h-2 rounded-full mt-1 ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-white/40'} z-10 -ml-1`}></div>
                                            <div>
                                                <p className={`text-sm font-semibold ${item.status === 'completed' ? 'text-white/80' : 'text-white/40'}`}>{item.label}</p>
                                                <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tight font-mono">{item.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Notes</h3>
                                <textarea 
                                    placeholder="Add a customer note..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex gap-3">
                                <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-white text-black rounded-xl hover:bg-white/90 transition-all">
                                    Save Changes
                                </button>
                                <button className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all">
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
    )
}
