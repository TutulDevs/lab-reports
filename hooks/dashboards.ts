import {
  DashboardKpi,
  DashboardReportOverallResult,
  DashboardReportsOvertime,
  DashboardReportsPerBuyer,
} from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

type FromTo = {
  from?: string;
  to?: string;
};

export const useDashboardKpi = ({ from, to }: FromTo) => {
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

export const useDashboardReportsOvertime = ({ from, to }: FromTo) => {
  return useQuery<DashboardReportsOvertime[], Error>({
    queryKey: ["dashboardReportsOvertime", { from, to }],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (from) query.append("from", from);
      if (to) query.append("to", to);

      const res = await fetch(
        `/api/dashboard/reports-overtime?${query.toString()}`,
      );
      if (res?.status == 401) window.location.href = "/login";
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
  });
};

export const useDashboardReportsPerBuyer = ({ from, to }: FromTo) => {
  return useQuery<DashboardReportsPerBuyer[], Error>({
    queryKey: ["dashboardReportsPerBuyer", { from, to }],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (from) query.append("from", from);
      if (to) query.append("to", to);

      const res = await fetch(
        `/api/dashboard/reports-per-buyer?${query.toString()}`,
      );
      if (res?.status == 401) window.location.href = "/login";
      if (!res.ok) throw new Error("Failed to fetch reports per buyer");
      return res.json();
    },
  });
};

export const useDashboardReportOverallResult = ({ from, to }: FromTo) => {
  return useQuery<DashboardReportOverallResult[], Error>({
    queryKey: ["dashboardReportOverallResult", { from, to }],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (from) query.append("from", from);
      if (to) query.append("to", to);

      const res = await fetch(
        `/api/dashboard/reports-overall-result?${query.toString()}`,
      );
      if (res?.status == 401) window.location.href = "/login";
      if (!res.ok) throw new Error("Failed to fetch reports overall result");
      return res.json();
    },
  });
};
