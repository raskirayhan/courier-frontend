import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { TrackingSearchBar } from "@/components/home/tracking-search-bar";
import { FareCalculatorWidget } from "@/components/home/fare-calculator-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  ArrowRight,
  Package,
  CreditCard,
  KeyRound,
  CheckCircle2,
  Users,
  Building2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:py-24 bg-radial from-blue-50 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-xs sm:text-sm gap-2 border-blue-200 bg-blue-50/80 text-blue-700 shadow-xs"
            >
              <Zap className="h-4 w-4" /> Next-Generation Courier & Freight Network
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Nationwide Delivery, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Guaranteed Precision
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Book parcels online in seconds with dynamic volumetric pricing, track packages in real-time, and verify deliveries with secure OTP validation.
            </p>

            {/* Instant Tracking Bar */}
            <div className="pt-2">
              <TrackingSearchBar />
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Real-time Audit Timeline
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Stripe Secure Checkout
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 6-Digit OTP Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator & Value Prop Grid */}
      <section className="py-16 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Value Prop */}
            <div className="lg:col-span-6 space-y-6">
              <Badge className="bg-blue-100 text-blue-800 border-none font-semibold text-xs">
                Transparent Logistics
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Calculate shipping cost before you book
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                No hidden costs. Our smart engine computes exact chargeable weights based on standard IATA volumetric formulas. Intra-city delivery starts from only <strong>৳60 BDT</strong>.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Automated Volumetric Weight</h4>
                    <p className="text-xs text-slate-500">
                      Calculates $(L \times W \times H) / 5000$ to ensure fair pricing for large, lightweight cargo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Stripe Automated Payment Escrow</h4>
                    <p className="text-xs text-slate-500">
                      Pay instantly online with debit/credit cards. Funds are securely tracked and logged.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">6-Digit Customer OTP Handshake</h4>
                    <p className="text-xs text-slate-500">
                      Riders cannot mark parcels as delivered without customer secret OTP verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/login">
                  <Button size="lg" className="gap-2">
                    Start Shipping Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Calculator Widget */}
            <div className="lg:col-span-6">
              <FareCalculatorWidget />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 4 Steps */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              How SwiftTrack Works
            </h2>
            <p className="text-sm text-slate-600">
              A streamlined, modern 4-step delivery pipeline engineered for speed and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-slate-200/80 hover:shadow-md transition-shadow relative">
              <CardContent className="p-6 space-y-3">
                <div className="text-3xl font-extrabold text-blue-200 font-mono">01</div>
                <h3 className="font-bold text-base text-slate-900">Book Shipment</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter sender & receiver addresses, parcel dimensions, and select delivery zone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 hover:shadow-md transition-shadow relative">
              <CardContent className="p-6 space-y-3">
                <div className="text-3xl font-extrabold text-blue-200 font-mono">02</div>
                <h3 className="font-bold text-base text-slate-900">Instant Stripe Pay</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pay with test cards on Stripe Checkout. Immediate confirmation and OTP generation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 hover:shadow-md transition-shadow relative">
              <CardContent className="p-6 space-y-3">
                <div className="text-3xl font-extrabold text-blue-200 font-mono">03</div>
                <h3 className="font-bold text-base text-slate-900">Rider Pickup & Transit</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Central dispatcher assigns the parcel to available rider. Moves through regional hubs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 hover:shadow-md transition-shadow relative">
              <CardContent className="p-6 space-y-3">
                <div className="text-3xl font-extrabold text-blue-200 font-mono">04</div>
                <h3 className="font-bold text-base text-slate-900">OTP Handover</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receiver shares their 6-digit OTP with the rider at doorstep to finalize delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Network Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-4xl font-extrabold text-blue-400 font-mono">64</p>
              <p className="text-xs uppercase tracking-wider text-slate-400">Districts Covered</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-extrabold text-blue-400 font-mono">99.4%</p>
              <p className="text-xs uppercase tracking-wider text-slate-400">On-Time SLA</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-extrabold text-blue-400 font-mono">25,000+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400">Parcels Handled</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-extrabold text-blue-400 font-mono">&lt; 24 Hrs</p>
              <p className="text-xs uppercase tracking-wider text-slate-400">Express Turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to experience reliable logistics?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto">
            Try out our 1-Click Role Login for instant evaluation as Admin, Customer, or Courier Rider.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg">
                1-Click Demo Login <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Rate Card
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
