import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Hub } from "@/lib/types";
import { toast } from "sonner";

export function useHubs() {
  const queryClient = useQueryClient();

  const query = useQuery<Hub[]>({
    queryKey: ["hubs"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/hubs");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const createHubMutation = useMutation({
    mutationFn: async (payload: { name: string; address: string; zone: string; contactNo: string }) => {
      const res = await apiClient.post("/hubs", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Sorting Hub successfully created!");
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create hub");
    },
  });

  return {
    ...query,
    hubs: query.data || [],
    createHub: createHubMutation.mutate,
    isCreatingHub: createHubMutation.isPending,
  };
}
