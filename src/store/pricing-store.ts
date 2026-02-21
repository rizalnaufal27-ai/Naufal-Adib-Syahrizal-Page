import { create } from "zustand";

export type ServiceType = "design" | "illustration" | "photo" | "video" | "web" | "app";

interface PricingState {
    service: ServiceType | null;
    setService: (s: ServiceType | null) => void;

    // Graphic Design
    designItems: string[];
    toggleDesignItem: (item: string) => void;

    // Illustration
    illusType: "half" | "full" | "render";
    setIllusType: (t: "half" | "full" | "render") => void;
    charCount: number;
    setCharCount: (n: number) => void;

    // Photography
    photoMode: "package" | "edit";
    setPhotoMode: (m: "package" | "edit") => void;
    location: string;
    setLocation: (l: string) => void;
    isJabodetabek: boolean | null;
    editComplexity: number;
    setEditComplexity: (n: number) => void;
    addRaw: boolean;
    setAddRaw: (b: boolean) => void;

    // Video
    videoDuration: number;
    setVideoDuration: (n: number) => void;
    videoComplexity: "low" | "med" | "high";
    setVideoComplexity: (c: "low" | "med" | "high") => void;

    // Web Design
    webPages: number;
    setWebPages: (n: number) => void;
    webResponsive: "basic" | "full";
    setWebResponsive: (r: "basic" | "full") => void;
    webInteractivity: "static" | "dynamic" | "cms";
    setWebInteractivity: (i: "static" | "dynamic" | "cms") => void;

    // App Design
    appFlows: number;
    setAppFlows: (n: number) => void;
    appPrototype: "lofi" | "hifi";
    setAppPrototype: (p: "lofi" | "hifi") => void;
    appLogic: "simple" | "moderate" | "complex";
    setAppLogic: (l: "simple" | "moderate" | "complex") => void;

    // Currency
    currency: "USD" | "IDR";
    rate: number;
    setCurrency: (c: "USD" | "IDR") => void;

    // Computed
    getTotalUSD: () => number;
    formatPrice: (usd: number) => string;
    getServiceLabel: () => string;
    reset: () => void;
}

const JABODETABEK = ["jakarta", "bogor", "depok", "tangerang", "bekasi", "jabodetabek"];

export const usePricingStore = create<PricingState>((set, get) => ({
    service: null,
    setService: (s) => set({ service: s }),

    designItems: [],
    toggleDesignItem: (item) =>
        set((state) => ({
            designItems: state.designItems.includes(item)
                ? state.designItems.filter((i) => i !== item)
                : [...state.designItems, item],
        })),

    illusType: "half",
    setIllusType: (t) => set({ illusType: t }),
    charCount: 1,
    setCharCount: (n) => set({ charCount: n }),

    photoMode: "package",
    setPhotoMode: (m) => set({ photoMode: m }),
    location: "",
    setLocation: (l) => {
        const lower = l.toLowerCase();
        set({ location: l, isJabodetabek: l.length > 2 ? JABODETABEK.some((a) => lower.includes(a)) : null });
    },
    isJabodetabek: null,
    editComplexity: 3,
    setEditComplexity: (n) => set({ editComplexity: n }),
    addRaw: false,
    setAddRaw: (b) => set({ addRaw: b }),

    videoDuration: 5,
    setVideoDuration: (n) => set({ videoDuration: n }),
    videoComplexity: "low",
    setVideoComplexity: (c) => set({ videoComplexity: c }),

    webPages: 3,
    setWebPages: (n) => set({ webPages: n }),
    webResponsive: "basic",
    setWebResponsive: (r) => set({ webResponsive: r }),
    webInteractivity: "static",
    setWebInteractivity: (i) => set({ webInteractivity: i }),

    appFlows: 3,
    setAppFlows: (n) => set({ appFlows: n }),
    appPrototype: "lofi",
    setAppPrototype: (p) => set({ appPrototype: p }),
    appLogic: "simple",
    setAppLogic: (l) => set({ appLogic: l }),

    currency: "USD",
    rate: 1,
    setCurrency: (c) => set({ currency: c, rate: c === "IDR" ? 15500 : 1 }),

    getTotalUSD: () => {
        if (process.env.NEXT_PUBLIC_APP_MODE === "test") return 0;
        const s = get();
        switch (s.service) {
            case "design": {
                let total = 0;
                if (s.designItems.includes("logo")) total += 5;
                if (s.designItems.includes("banner")) total += 5;
                if (s.designItems.includes("poster")) total += 5;
                if (s.designItems.includes("brand")) total += 20;
                return total;
            }
            case "illustration": {
                const prices = { half: 5, full: 8, render: 12 };
                return prices[s.illusType] * s.charCount;
            }
            case "photo": {
                if (s.photoMode === "package") {
                    return s.isJabodetabek ? 20 + (s.addRaw ? 5 : 0) : 0;
                }
                return s.editComplexity;
            }
            case "video": {
                const base = { low: 10, med: 30, high: 50 };
                const overtime = Math.max(0, s.videoDuration - 10) * 2;
                return base[s.videoComplexity] + overtime;
            }
            case "web": {
                const responsiveM = s.webResponsive === "full" ? 1.5 : 1;
                const interactM = { static: 1, dynamic: 1.8, cms: 2.5 };
                return Math.round(s.webPages * 25 * responsiveM * interactM[s.webInteractivity]);
            }
            case "app": {
                const protoM = s.appPrototype === "hifi" ? 2 : 1;
                const logicM = { simple: 1, moderate: 1.5, complex: 2.5 };
                return Math.round(s.appFlows * 30 * protoM * logicM[s.appLogic]);
            }
            default:
                return 0;
        }
    },

    formatPrice: (usd: number) => {
        const s = get();
        if (s.currency === "IDR") return `Rp ${(usd * s.rate).toLocaleString("id-ID")}`;
        return `$${usd}`;
    },

    getServiceLabel: () => {
        const labels: Record<ServiceType, string> = {
            design: "Graphic Design",
            illustration: "Illustration",
            photo: "Photography",
            video: "Video Production",
            web: "Web Design",
            app: "App Design",
        };
        return labels[get().service || "design"];
    },

    reset: () =>
        set({
            service: null,
            designItems: [],
            illusType: "half",
            charCount: 1,
            photoMode: "package",
            location: "",
            isJabodetabek: null,
            editComplexity: 3,
            addRaw: false,
            videoDuration: 5,
            videoComplexity: "low",
            webPages: 3,
            webResponsive: "basic",
            webInteractivity: "static",
            appFlows: 3,
            appPrototype: "lofi",
            appLogic: "simple",
        }),
}));
