"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  LayoutDashboard,
  Truck,
  MapPin,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { name: "Executive Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Master Dispatch Queue", href: "/admin/shipments", icon: Truck },
  { name: "Hubs & Linehaul", href: "/admin/hubs", icon: MapPin },
  { name: "User Access Control", href: "/admin/users", icon: Users },
];

function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1.5 px-3 py-4">
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all",
              isActive
                ? "bg-purple-600 text-white shadow-sm shadow-purple-500/20"
                : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
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

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login?redirect=/admin");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-semibold text-sm">
        Authenticating administrative session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200/90 shrink-0">
        <div className="h-16 border-b border-slate-200/90 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-lg text-slate-950">SwiftTrack</span>
          </Link>
          <Badge className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
            ADMIN
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-4 text-xs text-slate-500 font-medium">Loading nav...</div>}>
            <AdminNavLinks />
          </Suspense>
        </div>

        {/* Sidebar Admin Footer */}
        <div className="p-4 border-t border-slate-200/90 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-slate-950 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-600 h-8 w-8 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/90 bg-white sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-50 text-purple-800 border-purple-200 text-xs font-bold gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                Operations Command Center
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/shipments">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-1.5 shadow-sm">
                <Truck className="h-3.5 w-3.5" /> Dispatch Queue
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 font-semibold text-xs hidden sm:inline-flex gap-1"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white p-4 space-y-2 shadow-lg">
            <Suspense fallback={null}>
              <AdminNavLinks onNavigate={() => setMobileMenuOpen(false)} />
            </Suspense>
          </div>
        )}

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
