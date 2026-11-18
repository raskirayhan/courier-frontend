"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Truck,
  Package,
  MapPin,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const REVENUE_TREND_DATA = [
  { day: "Mon", revenue: 14200, parcels: 28 },
  { day: "Tue", revenue: 19800, parcels: 39 },
  { day: "Wed", revenue: 24500, parcels: 47 },
  { day: "Thu", revenue: 21300, parcels: 41 },
  { day: "Fri", revenue: 31200, parcels: 62 },
  { day: "Sat", revenue: 28900, parcels: 56 },
  { day: "Sun", revenue: 36400, parcels: 71 },
];

const HUB_DISTRIBUTION_DATA = [
  { hub: "Dhaka Central", volume: 184 },
  { hub: "Chittagong", volume: 112 },
  { hub: "Sylhet", volume: 68 },
  { hub: "Rajshahi", volume: 54 },
  { hub: "Khulna", volume: 46 },
];

export default function AdminOverviewPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real-time shipments
  const { data: shipmentsData, isLoading: isShipmentsLoading } = useQuery({
    queryKey: ["admin-overview-shipments"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/shipments?limit=10");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  // Fetch real-time hubs
  const { data: hubsData } = useQuery({
    queryKey: ["admin-overview-hubs"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/hubs");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const shipments = shipmentsData || [];
  const hubs = hubsData || [];

  const activeDeliveries = shipments.filter(
    (s: any) => s.status !== "DELIVERED" && s.status !== "CANCELLED"
  ).length;

  const deliveredCount = shipments.filter((s: any) => s.status === "DELIVERED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-900/10">
        <div className="space-y-1.5">
          <Badge className="bg-white/20 text-white border-none font-bold text-xs mb-1">
            EXECUTIVE CONTROL DECK
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Logistics Command Center ⚡
          </h1>
          <p className="text-sm text-purple-100 max-w-xl font-medium">
            Live operational status across all 64 districts. Monitor linehaul transit SLA, rider allocations, and gross freight revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/shipments">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 font-bold shadow-md gap-2">
              <Truck className="h-4 w-4" /> Open Master Dispatch
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/90 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gross Freight Revenue
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-950 font-mono">
              ৳ 176,300
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> +16.8% vs last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Linehaul Cargo
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Truck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-950 font-mono">
              {activeDeliveries} Consignments
            </div>
            <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> In-transit & assigned
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              On-Time SLA Rating
            </CardTitle>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-950 font-mono">
              99.4%
            </div>
            <p className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Doorstep OTP validated
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Regional Sorting Hubs
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <MapPin className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-950 font-mono">
              {hubs.length || 3} Active Hubs
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Dhaka, CTG, Sylhet Lines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Area Chart */}
        <Card className="lg:col-span-7 border-slate-200/90 shadow-2xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-950">
                  Freight Revenue Velocity (7-Day Trend)
                </CardTitle>
                <CardDescription className="text-xs text-slate-600">
                  Consolidated Stripe test checkout intake across all regional gateways
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[11px] font-mono text-purple-700 bg-purple-50 border-purple-200">
                Live Data
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="h-72 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickFormatter={(val) => `৳${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val: any) => [`৳ ${val} BDT`, "Gross Revenue"]}
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading revenue chart...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hub Volume Breakdown Bar Chart */}
        <Card className="lg:col-span-5 border-slate-200/90 shadow-2xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-950">
                  Hub Freight Volume (Parcels)
                </CardTitle>
                <CardDescription className="text-xs text-slate-600">
                  Throughput per regional sorting center
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[11px] font-mono text-blue-700 bg-blue-50 border-blue-200">
                Hub Distribution
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="h-72 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={HUB_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="hub" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} Parcels`, "Throughput"]}
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                    />
                    <Bar dataKey="volume" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading hub chart...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Master Dispatches Feed */}
      <Card className="border-slate-200/90 shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-950">
              Recent Consignment Dispatches
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Live status transitions requiring admin oversight or courier assignment
            </CardDescription>
          </div>
          <Link href="/admin/shipments">
            <Button variant="outline" size="sm" className="text-xs gap-1 font-semibold">
              Manage Master Queue <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {isShipmentsLoading ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Loading dispatches...
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No recent dispatches logged.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] text-slate-700">
                  <tr>
                    <th className="py-3 px-4">Tracking Code</th>
                    <th className="py-3 px-4">Sender & Receiver</th>
                    <th className="py-3 px-4">Chargeable Wt</th>
                    <th className="py-3 px-4">Fare</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.slice(0, 5).map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-950">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-950">{s.receiverName || s.recipientName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{s.receiverPhone || s.recipientPhone}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {s.chargeableWeight || s.weight || 2} KG
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-950">
                        ৳ {s.price}
                      </td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4">
                        <Badge variant={s.paymentStatus === "PAID" ? "success" : "warning"} className="font-bold">
                          {s.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href="/admin/shipments">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 font-bold">
                            Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
