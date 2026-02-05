import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertScan } from "@shared/routes";

// GET /api/scans
export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scan history");
      return api.scans.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/scans
export function useCreateScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScan) => {
      const res = await fetch(api.scans.create.path, {
        method: api.scans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message);
        }
        throw new Error("Failed to save scan result");
      }
      
      return api.scans.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
    },
  });
}
