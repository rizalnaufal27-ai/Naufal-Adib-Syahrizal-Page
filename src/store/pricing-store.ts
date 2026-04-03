import { create } from "zustand";

export type ServiceType = "brand_identity" | "digital_presence" | "startup_mvp";

interface PricingState {
    service: ServiceType | null;
    setService: (s: ServiceType | null) => void;

    // Base Modifiers
    expressDelivery: boolean;
    setExpressDelivery: (b: boolean) => void;

    // Brand Identity
    brandAddons: string[];
    toggleBrandAddon: (item: string) => void;

    // Digital Presence
    webPages: number;
    setWebPages: (n: number) => void;
    webCMS: boolean;
    setWebCMS: (b: boolean) => void;

    // Startup MVP
    appFlows: number;
    setAppFlows: (n: number) => void;
    appAI: boolean;
    setAppAI: (b: boolean) => void;

    // Currency
    currency: "USD" | "IDR";
    rate: number;
    setCurrency: (c: "USD" | "IDR") => void;

    // Computed
    getTotalUSD: () => number;
    getEstimatedDays: () => number;
    formatPrice: (usd: number) => string;
    getServiceLabel: () => string;
    reset: () => void;
}

export const usePricingStore = create<PricingState>((set, get) => ({
    service: null,
    setService: (s) => set({ service: s }),

    expressDelivery: false,
    setExpressDelivery: (b) => set({ expressDelivery: b }),

    brandAddons: [],
    toggleBrandAddon: (item) => set((s) => ({
        brandAddons: s.brandAddons.includes(item) ? s.brandAddons.filter((i) => i !== item) : [...s.brandAddons, item]
    })),

    webPages: 3,
    setWebPages: (n) => set({ webPages: n }),
    webCMS: false,
    setWebCMS: (b) => set({ webCMS: b }),

    appFlows: 5,
    setAppFlows: (n) => set({ appFlows: n }),
    appAI: false,
    setAppAI: (b) => set({ appAI: b }),

    currency: "USD",
    rate: 1,
    setCurrency: (c) => set({ currency: c, rate: c === "IDR" ? 15500 : 1 }),

    getTotalUSD: () => {
        const s = get();
        let total = 0;
        switch (s.service) {
            case "brand_identity":
                total = 200; // Base: Logo + Guidelines
                if (s.brandAddons.includes("social")) total += 50;
                if (s.brandAddons.includes("stationery")) total += 30;
                if (s.brandAddons.includes("3d")) total += 100;
                break;
            case "digital_presence":
                total = 400; // Base Web
                total += Math.max(0, s.webPages - 3) * 50;
                if (s.webCMS) total += 200;
                break;
            case "startup_mvp":
                total = 800; // Base App
                total += Math.max(0, s.appFlows - 5) * 80;
                if (s.appAI) total += 500;
                break;
            default:
                return 0;
        }
        
        // Rush Fee (50% Markup)
        if (s.expressDelivery) {
            total = Math.round(total * 1.5);
        }
        return total;
    },

    getEstimatedDays: () => {
        const s = get();
        let days = 0;
        switch (s.service) {
            case "brand_identity":
                days = 7;
                if (s.brandAddons.includes("3d")) days += 4;
                break;
            case "digital_presence":
                days = 14;
                days += Math.max(0, s.webPages - 3) * 1;
                if (s.webCMS) days += 5;
                break;
            case "startup_mvp":
                days = 30;
                days += Math.max(0, s.appFlows - 5) * 2;
                if (s.appAI) days += 10;
                break;
            default:
                return 0;
        }

        // Express halves the days
        if (s.expressDelivery) {
            days = Math.max(3, Math.ceil(days / 2));
        }

        return days;
    },

    formatPrice: (usd: number) => {
        const s = get();
        if (s.currency === "IDR") return `Rp ${(usd * s.rate).toLocaleString("id-ID")}`;
        return `$${usd}`;
    },

    getServiceLabel: () => {
        const labels: Record<ServiceType, string> = {
            brand_identity: "Brand Identity",
            digital_presence: "Digital Web Presence",
            startup_mvp: "Startup MVP Builder",
        };
        return labels[get().service || "brand_identity"];
    },

    reset: () => set({
        service: null,
        expressDelivery: false,
        brandAddons: [],
        webPages: 3,
        webCMS: false,
        appFlows: 5,
        appAI: false,
    })
}));
