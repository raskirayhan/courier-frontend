"use client";

import { use, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Package,
  ArrowRight,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

interface TrackPageProps {
  params: Promise<{ trackingId: string }>;
}

function TrackContent({ params }: TrackPageProps) {
  const resolvedParams = use(params);
  const trackingNumber = decodeURIComponent(resolvedParams.trackingId);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleSearchAgain = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/track/${searchInput.trim()}`);
    }
  };

  const isDelivered = trackingNumber.endsWith("0") || trackingNumber.endsWith("2");
  const isOutForDelivery = trackingNumber.endsWith("1") || trackingNumber.endsWith("3");

  const steps = [
    {
      title: "Booking Created",
      desc: "Parcel registered with volumetric pricing",
      time: "Nov 17, 2026 • 10:30 AM",
      completed: true,
      icon: Package,
    },
    {
      title: "Pickup Completed",
      desc: "Collected from sender by SwiftTrack rider",
      time: "Nov 17, 2026 • 02:15 PM",
      completed: true,
      icon: Truck,
    },
    {
      title: "Hub Transit",
      desc: "Sorted at Dhaka Central Hub (Tejgaon I/A)",
      time: "Nov 17, 2026 • 06:40 PM",
      completed: true,
      icon: MapPin,
    },
    {
      title: "Out for Delivery",
      desc: "Rider dispatched with customer delivery run",
      time: "Nov 18, 2026 • 08:30 AM",
      completed: isOutForDelivery || isDelivered,
      icon: Clock,
    },
    {
      title: "Delivered & Verified",
      desc: "Handover completed with 6-digit Customer OTP",
      time: isDelivered ? "Nov 18, 2026 • 11:45 AM" : "Estimated Today",
      completed: isDelivered,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Bar with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Home
        </Link>

        <form onSubmit={handleSearchAgain} className="flex gap-2">
          <Input
            placeholder="Track another parcel..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-9 text-xs w-56 font-mono"
          />
          <Button type="submit" size="sm" variant="outline" className="gap-1">
            <Search className="h-3.5 w-3.5" /> Track
          </Button>
        </form>
      </div>

      {/* Shipment Summary Header */}
      <Card className="border-slate-200/90 shadow-md">
        <CardHeader className="bg-slate-900 text-white p-6 rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Consignment Number
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
                  {trackingNumber}
                </h1>
                <Badge
                  className={
                    isDelivered
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 text-white"
                  }
                >
                  {isDelivered ? "DELIVERED" : isOutForDelivery ? "OUT FOR DELIVERY" : "IN TRANSIT"}
                </Badge>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">Estimated Delivery</span>
              <p className="text-base font-bold text-white">
                {isDelivered ? "Delivered on Time" : "Today by 06:00 PM"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-slate-100 pb-6 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">Origin Hub</p>
              <p className="font-semibold text-slate-800 mt-0.5">Dhaka Central Hub</p>
              <p className="text-xs text-slate-500">Tejgaon Industrial Area</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Destination Zone</p>
              <p className="font-semibold text-slate-800 mt-0.5">Chittagong Metro</p>
              <p className="text-xs text-slate-500">Port Regional Hub</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Payment & Verification</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px]">
                  Stripe Paid
                </Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 text-[10px]">
                  OTP Required
                </Badge>
              </div>
            </div>
          </div>

          {/* Vertical Audit Stepper */}
          <div className="pt-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6">
              Live Delivery Progress & Audit Logs
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                        step.completed
                          ? "bg-blue-600 text-white ring-4 ring-blue-50"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold ${
                            step.completed ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security OTP Notice */}
          <div className="mt-8 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
            <KeyRound className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Doorstep Handover Verification Policy</p>
              <p className="text-blue-700 mt-0.5">
                For your parcel security, our rider must verify your 6-digit confidential OTP upon delivery before completing handover.
              </p>
            </div>
          </div>

          {/* Login CTA for Merchant Actions */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>Sender or Receiver? Log in to download invoice and view detailed contacts.</span>
            <Link href="/login">
              <Button size="sm" variant="outline" className="gap-1.5 font-medium">
                Sign In to Manage <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TrackDetailPage({ params }: TrackPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1 bg-slate-50 py-12">
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
              Loading tracking information...
            </div>
          }
        >
          <TrackContent params={params} />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
