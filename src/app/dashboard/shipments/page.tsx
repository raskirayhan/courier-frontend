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
  Package,
  Search,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  MapPin,
  ExternalLink,
  Loader2,
  AlertCircle,
  Eye,
  KeyRound,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUS_TABS = [
  { label: "All Shipments", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "In Transit", value: "IN_HUB_TRANSIT" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function ShipmentsTableContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const currentStatus = searchParams.get("status") || "ALL";
  const searchKeyword = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchKeyword);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  // Sync search state with URL
  const updateFilters = (newStatus: string, newSearch: string) => {
    const params = new URLSearchParams();
    if (newStatus && newStatus !== "ALL") params.set("status", newStatus);
    if (newSearch) params.set("search", newSearch);
    router.push(`/dashboard/shipments?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(currentStatus, searchInput.trim());
  };

  // Fetch shipments
  const { data: shipmentsData, isLoading } = useQuery({
    queryKey: ["customer-shipments-table", currentStatus, searchKeyword],
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

  const shipments = shipmentsData || [];

  // Cancel shipment mutation
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/shipments/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Shipment cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["customer-shipments-table"] });
      queryClient.invalidateQueries({ queryKey: ["customer-shipments-recent"] });
      setSelectedShipment(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to cancel shipment");
    },
  });

  // Pay Now with Stripe
  const handlePayNow = async (shipmentId: string) => {
    try {
      const res = await apiClient.post("/payments/initiate", { shipmentId });
      if (res.data?.success && res.data?.data?.url) {
        window.location.href = res.data.data.url;
      } else {
        toast.error("Could not initiate payment");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment initiation failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Consignments & Shipments
          </h1>
          <p className="text-sm text-slate-500">
            Real-time tracking, customer OTP proofs, and cancellation management.
          </p>
        </div>
        <Link href="/dashboard/book">
          <Button className="gap-2 shadow-sm bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="h-4 w-4" /> Book New Parcel
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 space-y-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
            {STATUS_TABS.map((tab) => {
              const active = currentStatus === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => updateFilters(tab.value, searchInput)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
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
                placeholder="Search by Tracking Code, Receiver Name, or Phone..."
                className="pl-9 h-9 text-xs font-mono"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm" variant="outline" className="gap-1 text-xs">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            {searchKeyword && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-xs text-red-600"
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

      {/* Shipments Table */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> Loading consignments...
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Package className="h-12 w-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">No shipments found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No parcels matching your current status filter or search query.
              </p>
              <Button
                size="sm"
                variant="outline"
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
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Tracking Code</th>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Destination Hub</th>
                    <th className="py-3.5 px-4">Chargeable Weight</th>
                    <th className="py-3.5 px-4">Fare</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{s.receiverName || s.recipientName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{s.receiverPhone || s.recipientPhone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="flex items-center gap-1 font-medium text-slate-800">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          {s.destinationHub?.name || s.destinationZone || "Chittagong"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {s.chargeableWeight || s.weight || 2} KG
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ৳ {s.price}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className={
                            s.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : s.status === "CANCELLED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={s.paymentStatus === "PAID" ? "success" : "warning"}>
                          {s.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {s.paymentStatus === "PENDING" && s.status !== "CANCELLED" && (
                          <Button
                            size="sm"
                            className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handlePayNow(s.id)}
                          >
                            <CreditCard className="h-3 w-3 mr-1" /> Pay
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-[11px] text-blue-600 gap-1"
                          onClick={() => setSelectedShipment(s)}
                        >
                          <Eye className="h-3 w-3" /> View
                        </Button>

                        {(s.status === "PENDING" || s.status === "PICKUP_ASSIGNED") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-[11px] text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (confirm(`Cancel shipment ${s.trackingNumber}?`)) {
                                cancelMutation.mutate(s.id);
                              }
                            }}
                          >
                            Cancel
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

      {/* Shipment Details & Timeline Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-mono">Consignment Details</span>
                <h3 className="text-lg font-bold font-mono text-slate-900">
                  {selectedShipment.trackingNumber}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedShipment(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Recipient:</span>
                  <p className="font-semibold text-slate-800">{selectedShipment.receiverName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedShipment.receiverPhone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Total Price:</span>
                  <p className="font-bold text-slate-900 font-mono text-sm">৳ {selectedShipment.price} BDT</p>
                  <Badge variant={selectedShipment.paymentStatus === "PAID" ? "success" : "warning"}>
                    {selectedShipment.paymentStatus}
                  </Badge>
                </div>
              </div>

              {selectedShipment.deliveryOtp && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-bold text-blue-900">Customer Delivery OTP</p>
                      <p className="text-[11px] text-blue-700">Share with rider upon delivery</p>
                    </div>
                  </div>
                  <span className="font-mono text-lg font-extrabold text-blue-700 tracking-widest bg-white px-2.5 py-1 rounded-md border border-blue-200">
                    {selectedShipment.deliveryOtp}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-400">Delivery Address:</span>
                <p className="font-medium text-slate-700 mt-0.5">{selectedShipment.receiverAddress}</p>
              </div>

              <div>
                <span className="text-slate-400">Booked On:</span>
                <p className="font-medium text-slate-700 mt-0.5">{formatDate(selectedShipment.createdAt)}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-2">
              <Link href={`/track/${selectedShipment.trackingNumber}`} target="_blank">
                <Button size="sm" variant="outline" className="gap-1 text-xs">
                  Full Public Timeline <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
              <Button size="sm" onClick={() => setSelectedShipment(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShipmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading shipments...</div>}>
      <ShipmentsTableContent />
    </Suspense>
  );
}
