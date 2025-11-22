import { DashboardKpi } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useDashboardKpi = (from?: string, to?: string) => {
  return useQuery<DashboardKpi, Error>({
    queryKey: ["dashboardKpi", { from, to }],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (from) query.append("from", from);
      if (to) query.append("to", to);

      const res = await fetch(`/api/dashboard/kpi?${query.toString()}`);
      if (res?.status == 401) window.location.href = "/login";
      if (!res.ok) throw new Error("Failed to fetch dashboard KPI");
      return res.json();
    },
  });
};
