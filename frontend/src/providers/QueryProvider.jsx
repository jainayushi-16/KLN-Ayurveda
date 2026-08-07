"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
export default function QueryProvider({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes cache
                refetchOnWindowFocus: false,
            },
        },
    }));
    return (<QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-right" toastOptions={{
            style: {
                background: "#222123",
                color: "#ffffff",
                borderRadius: "1rem",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "bold",
            },
        }}/>
    </QueryClientProvider>);
}
