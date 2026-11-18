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
  ShieldCheck,
  PhoneCall,
  User,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tracking link copied to clipboard!");
    }
  };

  const isDelivered = trackingNumber.endsWith("0") || trackingNumber.endsWith("2") || trackingNumber.includes("100234");
  const isOutForDelivery = trackingNumber.endsWith("1") || trackingNumber.endsWith("3") || trackingNumber.includes("904821");

  const steps = [
    {
      title: "Booking Created & Volumetric Audit",
      desc: "Consignment registered with exact IATA dimensional pricing and verified dimensions.",
      time: "Nov 17, 2026 • 10:30 AM",
      completed: true,
      operator: "Central API Dispatch Engine",
      icon: Package,
    },
    {
      title: "Rider Pickup Completed",
      desc: "Collected from merchant premise by SwiftTrack rider (Unit #409).",
      time: "Nov 17, 2026 • 02:15 PM",
      completed: true,
      operator: "Rider Rafiqul Islam (Motorcycle)",
      icon: Truck,
    },
    {
      title: "Linehaul Sorting & Regional Transit",
      desc: "Scanned and palletized at Dhaka Central Sorting Hub (Tejgaon I/A) for outbound highway linehaul.",
      time: "Nov 17, 2026 • 06:40 PM",
      completed: true,
      operator: "Hub Dispatch Supervisor #12",
      icon: MapPin,
    },
    {
      title: "Out for Doorstep Delivery",
      desc: "Assigned to destination delivery runner. Courier heading to recipient address.",
      time: "Nov 18, 2026 • 08:30 AM",
      completed: isOutForDelivery || isDelivered,
      operator: "Destination Hub Runner Unit #18",
      icon: Clock,
    },
    {
      title: "Customer 6-Digit OTP Verified Handover",
      desc: "Doorstep delivery completed upon successful verification of secret 6-digit confirmation OTP.",
      time: isDelivered ? "Nov 18, 2026 • 11:45 AM" : "Estimated Today, 04:30 PM",
      completed: isDelivered,
      operator: isDelivered ? "Verified by Recipient OTP" : "Pending Handshake",
      icon: CheckCircle2,
    },
  ];

  const currentProgressPercent = isDelivered ? 100 : isOutForDelivery ? 80 : 55;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Bar with Navigation & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Home Overview
        </Link>

        <form onSubmit={handleSearchAgain} className="flex gap-2">
          <Input
            placeholder="Track another tracking code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-9 text-xs w-60 font-mono"
          />
          <Button type="submit" size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
            <Search className="h-3.5 w-3.5" /> Track
          </Button>
        </form>
      </div>

      {/* Main Tracking Card */}
      <Card className="border-slate-200/90 shadow-xl overflow-hidden rounded-3xl bg-white">
        {/* Sleek Top Banner */}
        <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-300 font-bold font-mono">
                  Consignment ID
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-300 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded-md"
                >
                  <Share2 className="h-3 w-3" /> Share
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
                  {trackingNumber}
                </h1>
                <Badge
                  className={
                    isDelivered
                      ? "bg-emerald-500 text-white font-bold font-mono text-xs px-3 py-1"
                      : isOutForDelivery
                      ? "bg-amber-500 text-slate-950 font-bold font-mono text-xs px-3 py-1 animate-pulse"
                      : "bg-blue-600 text-white font-bold font-mono text-xs px-3 py-1"
                  }
                >
                  {isDelivered ? "DELIVERED & VERIFIED" : isOutForDelivery ? "OUT FOR DELIVERY" : "IN LINEHAUL TRANSIT"}
                </Badge>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-slate-300 block font-medium">Estimated Arrival</span>
              <p className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono">
                {isDelivered ? "Handover Complete" : "Today, 04:30 PM (Guaranteed)"}
              </p>
            </div>
          </div>

          {/* Animated Horizontal Progress Bar with Moving Truck */}
          <div className="mt-8 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2 font-mono">
              <span>Dhaka Hub (Origin)</span>
              <span>Regional Transit</span>
              <span>Doorstep (Destination)</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 relative">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${currentProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
              <span>Stage 1 of 5</span>
              <span className="text-emerald-400 font-bold">{currentProgressPercent}% Journey Completed</span>
              <span>Stage 5 of 5</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Information Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs">
            <div className="space-y-1">
              <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                Origin Sorting Hub
              </p>
              <p className="font-bold text-slate-950 text-sm">Dhaka Central Hub</p>
              <p className="text-slate-600 font-medium">Plot 42, Tejgaon I/A, Dhaka-1208</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                Destination Delivery Hub
              </p>
              <p className="font-bold text-slate-950 text-sm">Chittagong Metro Hub</p>
              <p className="text-slate-600 font-medium">Agrabad C/A, Chittagong-4100</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                Payment & Verification
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <Badge variant="success" className="text-[11px] font-mono">
                  Stripe Paid
                </Badge>
                <Badge variant="info" className="text-[11px] font-mono">
                  6-Digit OTP Protected
                </Badge>
              </div>
            </div>
          </div>

          {/* Stepper Audit Timeline */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-950 tracking-tight">
                Live Audit Logs & Security Milestones
              </h3>
              <Badge variant="outline" className="text-[11px] text-slate-700 bg-white border-slate-300">
                Immutable Ledger
              </Badge>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors shadow-2xs ${
                        step.completed
                          ? "bg-blue-600 text-white ring-4 ring-blue-50"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <div className="flex-1 -mt-0.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4
                          className={`text-sm font-bold ${
                            step.completed ? "text-slate-950" : "text-slate-500"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono font-medium">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                      <p className="text-[11px] text-blue-700 font-mono font-semibold pt-0.5">
                        Handled by: {step.operator}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer OTP Security Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-start gap-3.5 text-xs text-blue-950 shadow-2xs">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <KeyRound className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm text-blue-950">Security OTP Handover Guarantee</p>
              <p className="text-blue-800 leading-relaxed">
                To guarantee zero stolen or misplaced parcels, our rider will request the 6-digit confirmation code sent to the recipient&apos;s phone before releasing the parcel.
              </p>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 font-medium">
              Are you the merchant or sender? Log in to view detailed customer invoices.
            </span>
            <div className="flex gap-2">
              <Link href="/login">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1 text-xs">
                  Sign In to Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TrackDetailPage({ params }: TrackPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNavbar />
      <main className="flex-1 py-10">
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-600 font-medium">
              Loading real-time tracking data...
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
