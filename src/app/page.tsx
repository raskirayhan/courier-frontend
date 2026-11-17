import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ShieldCheck, Zap, ArrowRight, Package } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Swift<span className="text-blue-600">Track</span>
              </span>
              <Badge variant="secondary" className="ml-2 text-[10px]">
                v1.0
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="font-medium shadow-md shadow-blue-500/20">
                1-Click Demo Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section Preview */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-20 text-center bg-radial from-blue-50 via-slate-50 to-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <Badge variant="outline" className="px-4 py-1.5 text-sm gap-2 border-blue-200 bg-blue-50/50 text-blue-700">
            <Zap className="h-4 w-4" /> Nationwide Courier & Freight Logistics
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Fast, Intelligent & <span className="text-blue-600">Reliable Logistics</span> for Modern Business
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Book shipments in seconds, track deliveries in real-time with visual timelines, and manage operations with our enterprise dispatch platform.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2 shadow-lg shadow-blue-600/25">
                Launch Platform <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Role Preview Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left px-4">
          <Card className="hover:shadow-md transition-shadow border-slate-200/80">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Customer Portal</h3>
              <p className="text-sm text-slate-600">
                Book parcels with 4-step wizard, volumetric rate calculations, and instant Stripe checkout.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-slate-200/80">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Courier Rider Hub</h3>
              <p className="text-sm text-slate-600">
                Mobile-first delivery app with live transit updates and customer 6-digit OTP verification.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-slate-200/80">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Admin Command Center</h3>
              <p className="text-sm text-slate-600">
                Hub management, dispatch queues, workload-balanced courier assignments, and revenue charts.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        &copy; 2026 SwiftTrack Logistics Platform. All rights reserved.
      </footer>
    </div>
  );
}
