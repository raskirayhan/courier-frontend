"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  KeyRound,
  Loader2,
  AlertCircle,
  Package,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CourierDeliveriesPage() {
  const queryClient = useQueryClient();
  const [filterTab, setFilterTab] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");
  const [otpModalShipment, setOtpModalShipment] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Fetch shipments assigned to this courier (or all for demo evaluation)
  const { data: shipmentsData, isLoading } = useQuery({
    queryKey: ["courier-runs-list"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/shipments?limit=50");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const allShipments = shipmentsData || [];

  const activeShipments = allShipments.filter(
    (s: any) => s.status !== "DELIVERED" && s.status !== "CANCELLED"
  );
  const completedShipments = allShipments.filter(
    (s: any) => s.status === "DELIVERED"
  );

  const displayedShipments = filterTab === "ACTIVE" ? activeShipments : completedShipments;

  // General Status Advance Mutation (e.g. PICKED_UP, IN_HUB_TRANSIT, OUT_FOR_DELIVERY)
  const advanceStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiClient.patch(`/shipments/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Shipment advanced to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["courier-runs-list"] });
      queryClient.invalidateQueries({ queryKey: ["courier-shipments-overview"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update shipment status");
    },
  });

  // OTP Verification Handshake for DELIVERED status
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpModalShipment) return;
    if (otpInput.length !== 6) {
      toast.error("Please enter the complete 6-digit Customer OTP");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const res = await apiClient.patch(`/shipments/${otpModalShipment.id}/status`, {
        status: "DELIVERED",
        deliveryOtp: otpInput.trim(),
      });

      if (res.data?.success) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        toast.success(`Delivery verified for ${otpModalShipment.trackingNumber}! Handover completed.`);
        queryClient.invalidateQueries({ queryKey: ["courier-runs-list"] });
        queryClient.invalidateQueries({ queryKey: ["courier-shipments-overview"] });
        setOtpModalShipment(null);
        setOtpInput("");
      } else {
        toast.error(res.data?.message || "Invalid OTP code");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP code. Please ask customer to recheck.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Delivery Run Queue & OTP Verification
        </h1>
        <p className="text-sm text-slate-500">
          Advance delivery milestones and complete verified doorstep customer handovers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterTab("ACTIVE")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterTab === "ACTIVE"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Active Deliveries ({activeShipments.length})
        </button>
        <button
          onClick={() => setFilterTab("COMPLETED")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterTab === "COMPLETED"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Completed / Delivered ({completedShipments.length})
        </button>
      </div>

      {/* Deliveries List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Loading delivery manifest...
        </div>
      ) : displayedShipments.length === 0 ? (
        <Card className="border-slate-200 text-center p-12">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No shipments in this queue</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {filterTab === "ACTIVE"
              ? "You have completed all assigned deliveries! Take a well-deserved rest."
              : "No delivered shipments yet today."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedShipments.map((s: any) => (
            <Card key={s.id} className="border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-base">
                        {s.trackingNumber}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          s.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                            : s.status === "OUT_FOR_DELIVERY"
                            ? "bg-amber-50 text-amber-800 border-amber-300 font-semibold"
                            : "bg-blue-50 text-blue-700 border-blue-300"
                        }
                      >
                        {s.status}
                      </Badge>
                      <Badge variant={s.paymentStatus === "PAID" ? "success" : "warning"}>
                        {s.paymentStatus}
                      </Badge>
                      {s.isFragile && (
                        <Badge variant="destructive" className="text-[10px]">
                          Fragile Item
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400">Recipient Name:</span>{" "}
                        <strong className="text-slate-800">{s.receiverName || s.recipientName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Phone:</span>{" "}
                        <a
                          href={`tel:${s.receiverPhone || s.recipientPhone}`}
                          className="font-mono text-emerald-700 hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <Phone className="h-3 w-3" /> {s.receiverPhone || s.recipientPhone}
                        </a>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">Destination:</span>{" "}
                        <span className="font-medium text-slate-800">
                          {s.receiverAddress || s.recipientAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0">
                    {/* Status Step Transitions */}
                    {s.status === "PICKUP_ASSIGNED" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
                        onClick={() =>
                          advanceStatusMutation.mutate({ id: s.id, status: "PICKED_UP" })
                        }
                        disabled={advanceStatusMutation.isPending}
                      >
                        <Package className="h-3.5 w-3.5" /> Mark Picked Up
                      </Button>
                    )}

                    {s.status === "PICKED_UP" && (
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                        onClick={() =>
                          advanceStatusMutation.mutate({ id: s.id, status: "IN_HUB_TRANSIT" })
                        }
                        disabled={advanceStatusMutation.isPending}
                      >
                        <Truck className="h-3.5 w-3.5" /> Depart for Hub
                      </Button>
                    )}

                    {s.status === "IN_HUB_TRANSIT" && (
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5"
                        onClick={() =>
                          advanceStatusMutation.mutate({ id: s.id, status: "OUT_FOR_DELIVERY" })
                        }
                        disabled={advanceStatusMutation.isPending}
                      >
                        <Clock className="h-3.5 w-3.5" /> Out for Delivery
                      </Button>
                    )}

                    {s.status === "OUT_FOR_DELIVERY" && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 shadow-sm animate-pulse"
                        onClick={() => {
                          setOtpModalShipment(s);
                          setOtpInput("");
                        }}
                      >
                        <KeyRound className="h-3.5 w-3.5" /> Verify OTP & Deliver
                      </Button>
                    )}

                    {s.status === "DELIVERED" && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="h-4 w-4" /> Handover Complete
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Customer 6-Digit OTP Verification Modal */}
      {otpModalShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <KeyRound className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Customer Delivery Handover
              </h3>
              <p className="text-xs text-slate-500">
                Ask recipient <strong>{otpModalShipment.receiverName}</strong> for the 6-digit verification OTP sent to their email/SMS.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Consignment:</span>
                <span className="font-mono font-bold text-slate-800">{otpModalShipment.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono text-slate-800">{otpModalShipment.receiverPhone}</span>
              </div>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Enter 6-Digit OTP
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="••••••"
                  className="text-center font-mono tracking-widest text-2xl font-extrabold h-14 rounded-xl border-emerald-300 focus:ring-emerald-500"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.trim())}
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOtpModalShipment(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                  disabled={isVerifyingOtp}
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    "Confirm Delivery"
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
