"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Menu, X, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "text-blue-600 bg-blue-50/80 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={cn(
            "block px-3 py-2 rounded-lg text-base font-medium",
            pathname === link.href
              ? "bg-blue-50 text-blue-600 font-bold"
              : "text-slate-700 hover:bg-slate-100"
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}

export function PublicNavbar() {
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "COURIER") return "/courier";
    return "/dashboard";
  };

  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Truck className="h-5 w-5" />
          </div>
          <div className="flex items-center">
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Swift<span className="text-blue-600">Track</span>
            </span>
            <Badge variant="secondary" className="ml-2 text-[10px] hidden sm:inline-flex bg-slate-100 text-slate-700">
              Logistics
            </Badge>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <Suspense
          fallback={
            <nav className="hidden md:flex items-center gap-1 text-sm text-slate-400">
              {NAV_LINKS.map((l) => (
                <span key={l.href} className="px-3.5 py-1.5">{l.name}</span>
              ))}
            </nav>
          }
        >
          <NavLinks />
        </Suspense>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href={getDashboardLink()}>
              <Button className="gap-2 shadow-sm font-medium">
                <User className="h-4 w-4" /> Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-medium text-slate-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="font-medium gap-1.5 shadow-md shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">
                  1-Click Demo <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <Suspense fallback={null}>
            <MobileNavLinks onNavigate={() => setMobileMenuOpen(false)} />
          </Suspense>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-blue-600">1-Click Demo Login</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
