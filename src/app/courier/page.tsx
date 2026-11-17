"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, LogOut, Navigation, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function CourierDashboardPage() {
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
              <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Truck className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">SwiftTrack</span>
            </Link>
            <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50">
              Courier Hub
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900">{user?.name || "Rider"}</p>
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
            Welcome, {user?.name || "Rider"} 🛵
          </h1>
          <p className="text-sm text-slate-500">
            Delivery Runner Dashboard: Active pickup assignments and OTP delivery verification.
          </p>
        </div>

        {/* Courier Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Runs</CardTitle>
              <Navigation className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">2 Deliveries</div>
              <p className="text-xs text-slate-500 mt-1">Ready for pickup & transit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">7 Delivered</div>
              <p className="text-xs text-slate-500 mt-1">Verified with Customer OTP</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pending Pickups</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">1 Pickup</div>
              <p className="text-xs text-slate-500 mt-1">Assigned by Central Hub</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Notice */}
        <Card className="border-emerald-100 bg-emerald-50/40 p-6 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Courier Mobile Portal Activated</h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            You are logged in as a <strong>COURIER</strong>. In Part 6, the mobile-first delivery run queue and the 6-digit Customer OTP verification modal will load here!
          </p>
        </Card>
      </main>
    </div>
  );
}
