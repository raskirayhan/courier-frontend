"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, LogOut, Truck, Users, MapPin, DollarSign, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">SwiftTrack</span>
            </Link>
            <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50">
              Admin Command Center
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900">{user?.name || "Super Admin"}</p>
              <p className="text-[11px] text-slate-500 font-mono">{user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 gap-1.5">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Operations Command Center ⚡
          </h1>
          <p className="text-sm text-slate-500">
            System overview: Master parcel dispatch, hub management, courier assignment, and revenue analytics.
          </p>
        </div>

        {/* Admin KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">৳ 128,450</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +14.2% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Shipments</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">42 Parcels</div>
              <p className="text-xs text-slate-500 mt-1">Across all zones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Couriers</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">12 Riders</div>
              <p className="text-xs text-slate-500 mt-1">On delivery runs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Logistics Hubs</CardTitle>
              <MapPin className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">3 Hubs</div>
              <p className="text-xs text-slate-500 mt-1">Dhaka, CTG, Sylhet</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Notice */}
        <Card className="border-purple-100 bg-purple-50/40 p-6 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Admin Command Center Activated</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            You are logged in as <strong>SUPER ADMIN</strong>. In Part 7, the interactive Recharts analytics graphs, the master shipment dispatch board with courier assignment modal, and hub CRUD controls will load here!
          </p>
        </Card>
      </main>
    </div>
  );
}
