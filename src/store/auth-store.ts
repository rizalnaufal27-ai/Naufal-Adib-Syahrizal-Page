import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    role: "client" | "admin" | null;
    isLoading: boolean;
    initialize: () => void;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isLoading: true,

    initialize: () => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", session.user.id)
                    .single();
                set({ user: session.user, role: (data?.role as "client" | "admin") || "client", isLoading: false });
            } else {
                set({ user: null, role: null, isLoading: false });
            }
        });

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", session.user.id)
                    .single();
                set({ user: session.user, role: (data?.role as "client" | "admin") || "client", isLoading: false });
            } else {
                set({ user: null, role: null, isLoading: false });
            }
        });
    },

    signIn: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    },

    signUp: async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (error) throw error;
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, role: null });
    },
}));
