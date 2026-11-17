"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, PlusCircle, LogOut, Truck, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboardPage() {
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
              <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Truck className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">SwiftTrack</span>
            </Link>
            <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
              Customer Portal
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900">{user?.name || "Customer"}</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome, {user?.name || "Valued Merchant"} 👋
            </h1>
            <p className="text-sm text-slate-500">
              Manage your parcel shipments, bookings, and live deliveries across Bangladesh.
            </p>
          </div>
          <Link href="/dashboard/book">
            <Button className="gap-2 shadow-md shadow-blue-600/20">
              <PlusCircle className="h-4 w-4" /> Book New Parcel
            </Button>
          </Link>
        </div>

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active In-Transit</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">3 Parcels</div>
              <p className="text-xs text-slate-500 mt-1">Live updates in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Successfully Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">18 Parcels</div>
              <p className="text-xs text-slate-500 mt-1">100% OTP verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Spent</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">৳ 2,450 BDT</div>
              <p className="text-xs text-slate-500 mt-1">Processed via Stripe</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Notice */}
        <Card className="border-blue-100 bg-blue-50/40 p-6 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Customer Portal Activated</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            You are logged in as a <strong>CUSTOMER</strong>. In Part 4, full 4-step booking, volumetric calculator, and Stripe checkout will load here!
          </p>
        </Card>
      </main>
    </div>
  );
}
