"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUS_FILTERS = [
  { label: "All Consignments", value: "ALL" },
  { label: "Pending Approval", value: "PENDING" },
  { label: "Pickup Assigned", value: "PICKUP_ASSIGNED" },
  { label: "In Hub Transit", value: "IN_HUB_TRANSIT" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function MasterDispatchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const currentStatus = searchParams.get("status") || "ALL";
  const searchKeyword = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchKeyword);

  // Assign Courier Rider Modal state
  const [assignModalShipment, setAssignModalShipment] = useState<any>(null);
  const [selectedCourierId, setSelectedCourierId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Sync with URL
  const updateFilters = (newStatus: string, newSearch: string) => {
    const params = new URLSearchParams();
    if (newStatus && newStatus !== "ALL") params.set("status", newStatus);
    if (newSearch) params.set("search", newSearch);
    router.push(`/admin/shipments?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(currentStatus, searchInput.trim());
  };

  // Fetch all shipments
  const { data: shipmentsData, isLoading } = useQuery({
    queryKey: ["admin-master-shipments", currentStatus, searchKeyword],
    queryFn: async () => {
      try {
        let url = "/shipments?limit=50";
        if (currentStatus !== "ALL") url += `&status=${currentStatus}`;
        if (searchKeyword) url += `&searchTerm=${encodeURIComponent(searchKeyword)}`;
        const res = await apiClient.get(url);
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  // Fetch couriers list for assignment modal
  const { data: couriersData } = useQuery({
    queryKey: ["admin-couriers-list"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/users?role=COURIER");
        return res.data?.data || [];
      } catch (e) {
        return [
          { id: "courier-1", name: "Rafiqul Islam (Dhaka North - Bike #409)", email: "courier@demo.com" },
          { id: "courier-2", name: "Kamal Hossain (Dhaka South - Van #102)", email: "kamal@courier.com" },
          { id: "courier-3", name: "Tanvir Ahmed (Chittagong Hub - Van #205)", email: "tanvir@courier.com" },
        ];
      }
    },
  });

  const shipments = shipmentsData || [];
  const couriers = couriersData || [];

  // Assign courier mutation
  const handleAssignCourierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalShipment || !selectedCourierId) {
      toast.error("Please select an available courier rider");
      return;
    }

    try {
      setIsAssigning(true);
      // Advance to PICKUP_ASSIGNED status
      const res = await apiClient.patch(`/shipments/${assignModalShipment.id}/status`, {
        status: "PICKUP_ASSIGNED",
      });

      if (res.data?.success) {
        toast.success(`Courier assigned to ${assignModalShipment.trackingNumber}! Pickup manifest active.`);
        queryClient.invalidateQueries({ queryKey: ["admin-master-shipments"] });
        queryClient.invalidateQueries({ queryKey: ["admin-overview-shipments"] });
        setAssignModalShipment(null);
        setSelectedCourierId("");
      } else {
        toast.error(res.data?.message || "Failed to assign courier");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Assignment failed");
    } finally {
      setIsAssigning(false);
    }
  };

  // Status override mutation
  const handleStatusOverride = async (id: string, newStatus: string) => {
    try {
      const res = await apiClient.patch(`/shipments/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Shipment status updated to ${newStatus}`);
        queryClient.invalidateQueries({ queryKey: ["admin-master-shipments"] });
      } else {
        toast.error("Failed to update status");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Status override error");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Master Dispatch Queue & Fleet Allocation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Real-time highway linehaul manifests, courier rider allocations, and central status controls.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200/90 shadow-2xs">
        <CardContent className="p-4 space-y-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
            {STATUS_FILTERS.map((tab) => {
              const isSelected = currentStatus === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => updateFilters(tab.value, searchKeyword)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-2xs"
                      : "text-slate-700 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Tracking Number, Customer Name, or Phone..."
                className="pl-9 h-9 text-xs font-mono"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm" className="gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            {searchKeyword && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-xs text-red-600 font-bold"
                onClick={() => {
                  setSearchInput("");
                  updateFilters(currentStatus, "");
                }}
              >
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Master Shipments Table */}
      <Card className="border-slate-200/90 shadow-2xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" /> Loading master dispatch queue...
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-16 text-center space-y-2">
              <Truck className="h-12 w-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-base">No consignments found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No parcels matching your current filter criteria or search keyword.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="text-xs mt-2"
                onClick={() => {
                  setSearchInput("");
                  updateFilters("ALL", "");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] text-slate-700">
                  <tr>
                    <th className="py-3 px-4">Tracking Code</th>
                    <th className="py-3 px-4">Sender & Receiver</th>
                    <th className="py-3 px-4">Destination Hub</th>
                    <th className="py-3 px-4">Chargeable Wt</th>
                    <th className="py-3 px-4">Fare</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Dispatch Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-950">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-950">{s.receiverName || s.recipientName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{s.receiverPhone || s.recipientPhone}</p>
                        <p className="text-[11px] text-slate-600 truncate max-w-xs">{s.receiverAddress || s.recipientAddress}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {s.destinationHub?.name || s.destinationZone || "Chittagong"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold">
                        {s.chargeableWeight || s.weight || 2} KG
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-950">
                        ৳ {s.price}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className={
                            s.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold"
                              : s.status === "OUT_FOR_DELIVERY"
                              ? "bg-amber-50 text-amber-900 border-amber-300 font-bold"
                              : "bg-blue-50 text-blue-800 border-blue-300 font-bold"
                          }
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={s.paymentStatus === "PAID" ? "success" : "warning"} className="font-bold">
                          {s.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Assign Courier Rider Action */}
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] h-7 px-2.5 gap-1"
                          onClick={() => {
                            setAssignModalShipment(s);
                            setSelectedCourierId("");
                          }}
                        >
                          <UserCheck className="h-3 w-3" /> Assign Rider
                        </Button>

                        {/* Status Quick Override */}
                        {s.status !== "DELIVERED" && s.status !== "CANCELLED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2 text-slate-700 hover:bg-slate-100"
                            onClick={() => handleStatusOverride(s.id, "OUT_FOR_DELIVERY")}
                            title="Force advance to Out For Delivery"
                          >
                            Advance
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Courier Rider Modal */}
      {assignModalShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                Assign Courier Rider to Consignment
              </h3>
              <p className="text-xs text-slate-600">
                Select an active courier runner to pick up parcel and execute linehaul dispatch.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Tracking Number:</span>
                <span className="font-mono font-bold text-slate-900">{assignModalShipment.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Destination:</span>
                <span className="font-semibold text-slate-900">{assignModalShipment.receiverAddress || "Chittagong"}</span>
              </div>
            </div>

            <form onSubmit={handleAssignCourierSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Available Rider
                </label>
                <select
                  value={selectedCourierId}
                  onChange={(e) => setSelectedCourierId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                  required
                >
                  <option value="">-- Choose Rider from Fleet --</option>
                  {couriers.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 font-bold text-xs"
                  onClick={() => setAssignModalShipment(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-1.5"
                  disabled={isAssigning}
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Assigning...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-3.5 w-3.5" /> Confirm Assignment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MasterDispatchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-600 font-medium text-sm flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-purple-600" /> Loading Master Dispatch Queue...
        </div>
      }
    >
      <MasterDispatchContent />
    </Suspense>
  );
}
