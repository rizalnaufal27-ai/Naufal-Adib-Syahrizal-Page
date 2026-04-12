"use client";
import React from "react";
import Link from "next/link";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Calendar, 
    Users, 
    CreditCard, 
    BarChart3, 
    Settings, 
    Megaphone,
    LogOut,
    Home
} from "lucide-react";

interface SidebarProps {
    activeView: string;
    onViewChange: (view: any) => void;
    onLogout: () => void;
}

export function AdminSidebar({ activeView, onViewChange, onLogout }: SidebarProps) {
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "orders", label: "Client Orders", icon: ShoppingBag },
        { id: "appointments", label: "Appointments", icon: Calendar },
        { id: "staff", label: "Staff", icon: Users },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "marketing", label: "Marketing", icon: Megaphone },
        { id: "reports", label: "Reports", icon: BarChart3 },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col h-full shrink-0">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold text-lg">
                    S
                </div>
                <span className="ml-3 text-sm font-bold tracking-tight text-white/90">Studio Admin</span>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = activeView === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                                isActive 
                                ? "bg-white/5 text-white" 
                                : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
                            }`}
                        >
                            <Icon className={`w-4.5 h-4.5 mr-3 ${isActive ? "text-white" : "text-white/30 group-hover:text-white/50"}`} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/5 space-y-1">
                <Link
                    href="/"
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.02] transition-all"
                >
                    <Home className="w-4.5 h-4.5 mr-3 text-white/20" />
                    Back to Site
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all"
                >
                    <LogOut className="w-4.5 h-4.5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
