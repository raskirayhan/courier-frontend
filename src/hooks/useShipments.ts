import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Shipment, ShipmentStatus } from "@/lib/types";
import { toast } from "sonner";

export interface UseShipmentsOptions {
  status?: string;
  searchTerm?: string;
  limit?: number;
}

export function useShipments(options?: UseShipmentsOptions) {
  const queryClient = useQueryClient();
  const { status = "ALL", searchTerm = "", limit = 50 } = options || {};

  const queryKey = ["shipments", status, searchTerm, limit];

  const query = useQuery<Shipment[]>({
    queryKey,
    queryFn: async () => {
      try {
        let url = `/shipments?limit=${limit}`;
        if (status && status !== "ALL") url += `&status=${status}`;
        if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
        const res = await apiClient.get(url);
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: ShipmentStatus }) => {
      const res = await apiClient.patch(`/shipments/${id}/status`, { status: newStatus });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Shipment advanced to ${variables.newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update shipment status");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/shipments/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipment successfully cancelled");
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Cancellation failed");
    },
  });

  return {
    ...query,
    shipments: query.data || [],
    updateStatus: updateStatusMutation.mutate,
    cancelShipment: cancelMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
