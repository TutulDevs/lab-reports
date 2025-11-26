"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;

        const res = await fetch(url, { credentials: "include" });
        // console.log("res in q fn:", res);

        if (res.status === 401) {
          await fetch("/api/auth/logout", {
            method: "POST",
          });

          window.location.href = "/login";

          // throw new Error("Unauthorized");
          toast.error("Unauthorized");

          return;
        }

        return res.json();
      },
    },
  },
});

export function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
