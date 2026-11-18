"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  LayoutDashboard,
  Navigation,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COURIER_NAV = [
  { name: "Overview", href: "/courier", icon: LayoutDashboard },
  { name: "Active Deliveries", href: "/courier/deliveries", icon: Navigation },
  { name: "Rider Profile", href: "/courier/profile", icon: User },
];

function CourierNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1.5 px-3 py-4">
      {COURIER_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-4 py-2 flex items-center justify-around shadow-lg">
      {COURIER_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors",
              isActive
                ? "text-emerald-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function CourierDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/courier");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        Authenticating rider session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex pb-16 lg:pb-0">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Truck className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg text-slate-900">SwiftTrack</span>
          </Link>
          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
            Rider
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading nav...</div>}>
            <CourierNavLinks />
          </Suspense>
        </div>

        {/* User Mini Profile in Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-600 h-8 w-8"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-semibold bg-emerald-50 text-emerald-800 border-emerald-200 gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active on Duty
              </Badge>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Courier Mobile Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/courier/deliveries">
              <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs">
                <Navigation className="h-3.5 w-3.5" /> View Runs
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 text-xs hidden sm:inline-flex gap-1"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Bottom Bar */}
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </div>
  );
}
