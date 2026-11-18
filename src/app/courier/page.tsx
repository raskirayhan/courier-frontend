"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Phone,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function CourierDashboardOverview() {
  const { user } = useAuthStore();

  const { data: shipmentsData, isLoading } = useQuery({
    queryKey: ["courier-shipments-overview"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/shipments?limit=20");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const shipments = shipmentsData || [];

  const activeDeliveries = shipments.filter(
    (s: any) => s.status !== "DELIVERED" && s.status !== "CANCELLED"
  );
  const completedDeliveries = shipments.filter((s: any) => s.status === "DELIVERED");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge className="bg-white/20 text-white border-none text-[11px] mb-1">
            Delivery Runner
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || "Rider"} 🛵
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
            Your live delivery manifest. Advance parcel transit stages and verify 6-digit Customer OTPs upon arrival.
          </p>
        </div>

        <Link href="/courier/deliveries">
          <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-md gap-2">
            <Navigation className="h-4 w-4" /> Go to Active Runs
          </Button>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Runs
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Navigation className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {activeDeliveries.length}
            </div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">To be delivered today</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed Today
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {completedDeliveries.length}
            </div>
            <p className="text-xs text-blue-600 mt-1 font-medium">100% Customer OTP verified</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Zone Assigned
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <MapPin className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-slate-900">Dhaka North Metro</div>
            <p className="text-xs text-slate-500 mt-1">Tejgaon Central Hub Linehaul</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Active Deliveries Section */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between p-6">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Assigned Delivery Runs
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Parcels requiring pickup, transit advance, or OTP confirmation
            </CardDescription>
          </div>
          <Link href="/courier/deliveries">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 font-medium">
              Manage All Runs <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Loading active runs...
            </div>
          ) : activeDeliveries.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">All clear! No pending runs right now.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Central dispatch will assign new incoming paid consignments to your queue.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDeliveries.slice(0, 3).map((s: any) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {s.trackingNumber}
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700">
                        {s.status}
                      </Badge>
                      {s.isFragile && (
                        <Badge variant="warning" className="text-[10px]">
                          Fragile
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-700">
                      <strong>To:</strong> {s.receiverName} • {s.receiverAddress}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {s.receiverPhone}
                    </p>
                  </div>

                  <Link href="/courier/deliveries">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
                      Action <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
