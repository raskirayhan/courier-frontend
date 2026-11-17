"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  PlusCircle,
  Truck,
  Clock,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomerDashboardOverview() {
  const { user } = useAuthStore();

  // Fetch recent shipments from live API
  const { data: shipmentsData, isLoading } = useQuery({
    queryKey: ["customer-shipments-recent"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/shipments?limit=5");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const shipments = shipmentsData || [];

  const inTransitCount = shipments.filter(
    (s: any) => s.status !== "DELIVERED" && s.status !== "CANCELLED"
  ).length;

  const deliveredCount = shipments.filter(
    (s: any) => s.status === "DELIVERED"
  ).length;

  const totalSpent = shipments.reduce(
    (acc: number, curr: any) => acc + (curr.price || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/10">
        <div className="space-y-1">
          <Badge className="bg-white/20 text-white border-none text-[11px] mb-1">
            Merchant Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-sm text-blue-100 max-w-lg">
            Manage your nationwide parcel dispatches, track linehaul runs, and view delivery proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/book">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-md gap-2">
              <PlusCircle className="h-5 w-5" /> Book Parcel
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Bookings
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {shipments.length}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-500" /> All-time consignments
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active In-Transit
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {inTransitCount}
            </div>
            <p className="text-xs text-amber-600 mt-1 font-medium">
              Moving through hubs
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Delivered & Verified
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {deliveredCount}
            </div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">
              100% OTP validated
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Spend
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              ৳ {totalSpent}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Processed via Stripe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments Section */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between p-6">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Recent Consignments
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Your latest parcel bookings and delivery progress
            </CardDescription>
          </div>
          <Link href="/dashboard/shipments">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 font-medium">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Loading recent consignments...
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No shipments booked yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to ship your first parcel? Click the button below to book a parcel with our 4-step wizard.
              </p>
              <Link href="/dashboard/book">
                <Button size="sm" className="mt-2">
                  <PlusCircle className="h-4 w-4 mr-1.5" /> Book Your First Parcel
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Tracking Code</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Delivery Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{s.receiverName || s.recipientName || "Valued Customer"}</p>
                        <p className="text-[11px] text-slate-400">{s.receiverPhone || s.recipientPhone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {s.deliveryZone || s.destinationZone || "Chittagong"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
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
                        <Badge
                          variant={s.paymentStatus === "PAID" ? "success" : "warning"}
                        >
                          {s.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/track/${s.trackingNumber}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-blue-600">
                            Track <ExternalLink className="h-3 w-3" />
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
