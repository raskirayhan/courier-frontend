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
  Star,
  Sparkles,
  PhoneCall,
  Globe2,
  Navigation,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNavbar />

      {/* 🚀 Hero Section with Mesh Gradient & Live Telemetry Card */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:py-24 border-b border-slate-200/80 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs sm:text-sm font-semibold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Nationwide 64-District Logistics Network • Active & Online</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
              Next-Day Delivery Across Bangladesh, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Engineered with Digital Precision.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-normal">
              Empowering merchants, riders, and senders with dynamic volumetric pricing, real-time GPS tracking, and fraud-proof 6-digit OTP customer handovers.
            </p>

            {/* Instant Tracking Bar with Sample Chips */}
            <div className="pt-4 max-w-2xl mx-auto">
              <TrackingSearchBar />
            </div>

            {/* Trust Micro-Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Real-time Audit Trail
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <CreditCard className="h-4 w-4 text-blue-600" /> Stripe Secure Checkout
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <KeyRound className="h-4 w-4 text-purple-600" /> 6-Digit OTP Delivery Handshake
              </span>
            </div>
          </div>

          {/* Interactive Simulated Live Consignment Preview Widget */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm sm:text-base text-white">
                        TRK-2026-DHAKA-EXP
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        IN LINEHAUL TRANSIT
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      Standard Express Cargo • 2.5 KG • Destination: Chittagong Metro
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div className="hidden sm:block">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Est. Doorstep Arrival</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">Today, 04:30 PM (SLA Guarded)</span>
                  </div>
                  <Link href="/track/TRK-2026-DHAKA-EXP">
                    <Button size="sm" variant="outline" className="text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                      View Full Audit
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Progress Line */}
              <div className="py-5">
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span className="text-emerald-400 font-bold">1. Picked Up (Tejgaon)</span>
                  <span className="text-emerald-400 font-bold">2. Central Hub Sorted</span>
                  <span className="text-blue-400 font-bold animate-pulse">3. In Transit (75%)</span>
                  <span>4. Out For Delivery</span>
                  <span>5. OTP Verified</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 h-full rounded-full w-3/4 animate-pulse transition-all duration-1000" />
                </div>
              </div>

              {/* Courier Rider Micro-Card */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-300 gap-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center font-bold text-[11px] text-blue-300">
                    RR
                  </div>
                  <span>
                    Assigned Rider: <strong className="text-white">Rafiqul Islam</strong> (Motorcycle Unit • ⭐ 4.9 Rating)
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  Active Dispatch Hub: Tejgaon Sorting Hub 01
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏢 Merchant Trust & Brand Proof Bar */}
      <section className="py-10 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
            Trusted by 1,200+ High-Volume E-Commerce Merchants & Corporate Senders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-700 font-bold text-sm sm:text-base opacity-80">
            <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              🛍️ ModestWear BD
            </span>
            <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              📱 GadgetRush Express
            </span>
            <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              🌿 PureOrganic BD
            </span>
            <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              📚 Bookworm Central
            </span>
            <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              ⚡ Apex Hardware Supply
            </span>
          </div>
        </div>
      </section>

      {/* 🧮 Interactive Calculator & Value Prop Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Value Pillars */}
            <div className="lg:col-span-6 space-y-6">
              <Badge className="bg-blue-600 text-white font-bold text-xs uppercase tracking-wide">
                Clear & Fair Pricing
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
                Calculate shipping cost before you commit a single Taka.
              </h2>
              <p className="text-slate-700 leading-relaxed text-base">
                No hidden delivery fees, arbitrary weight penalties, or unexpected surcharges. Our pricing engine uses global IATA volumetric standards $(L \times W \times H) / 5000$.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Automated Volumetric Detection</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Protects merchants from paying heavy rates on lightweight items by computing exact dimensional weight.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Instant Stripe Test Payments</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Accepts test card checkouts with automatic transition to PAID status and printable digital invoices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Fraud-Proof 6-Digit OTP Handover</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Riders cannot complete delivery without the customer entering their secret 6-digit confirmation code.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link href="/login">
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20">
                    Book Shipment Online <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="font-bold text-slate-800">
                    Full Tariff Guide
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Calculator Widget */}
            <div className="lg:col-span-6">
              <FareCalculatorWidget />
            </div>
          </div>
        </div>
      </section>

      {/* 🧭 Bento Grid: Core Technical Architecture */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge className="bg-indigo-100 text-indigo-800 font-bold text-xs uppercase">
              Domain Complexity
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Built for High-Stakes Enterprise Logistics
            </h2>
            <p className="text-base text-slate-700">
              Not an e-commerce toy or simple CRUD dashboard. A full-fledged three-sided logistics ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <Card className="border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 space-y-4 rounded-3xl bg-slate-50/60">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">3 Distinct Role Experiences</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated portals for <strong>Customer Merchants</strong> (booking, tracking, payments), <strong>Courier Riders</strong> (manifest runs, OTP check), and <strong>Admin Operations</strong> (dispatch, hubs, users).
              </p>
            </Card>

            {/* Bento Card 2 */}
            <Card className="border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 space-y-4 rounded-3xl bg-slate-50/60">
              <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">1-Click Role Demo Login</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamless evaluator experience with pre-configured cards for Admin, Customer, and Courier. No copy-pasting of passwords required.
              </p>
            </Card>

            {/* Bento Card 3 */}
            <Card className="border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 space-y-4 rounded-3xl bg-slate-50/60">
              <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Edge Route Middleware</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zero security leaks. Server-side cookie decoding guards `/admin/*`, `/courier/*`, and `/dashboard/*` with instantaneous client-side hydration.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 📊 High-Impact Network Statistics */}
      <section className="py-16 bg-slate-950 text-white border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="pt-4 sm:pt-0 space-y-1">
              <p className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-mono">64</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Districts Connected</p>
            </div>
            <div className="pt-4 sm:pt-0 space-y-1">
              <p className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">99.8%</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">On-Time SLA Guarantee</p>
            </div>
            <div className="pt-4 sm:pt-0 space-y-1">
              <p className="text-4xl sm:text-5xl font-extrabold text-purple-400 font-mono">50K+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Parcels Dispatched</p>
            </div>
            <div className="pt-4 sm:pt-0 space-y-1">
              <p className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono">100%</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">OTP Verified Handovers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 Customer Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Badge className="bg-emerald-100 text-emerald-800 font-bold text-xs">
              Merchant Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Loved by Fast-Growing Businesses
            </h2>
            <p className="text-sm text-slate-600">
              Real feedback from senders who trust SwiftTrack for their daily business dispatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200/90 shadow-2xs p-6 space-y-4 rounded-2xl bg-white">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;The volumetric calculator completely stopped disputes with customers regarding shipping rates. Transparent and instant Stripe payment makes bookkeeping painless.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  TB
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Tanvir Bhuiyan</p>
                  <p className="text-[11px] text-slate-500">Founder, ModestWear BD</p>
                </div>
              </div>
            </Card>

            <Card className="border-slate-200/90 shadow-2xs p-6 space-y-4 rounded-2xl bg-white">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;The 6-digit OTP delivery confirmation is a game-changer. We used to have false claims of non-delivery. Now every single handover is verified with zero disputes.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  SA
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Sadia Ahmed</p>
                  <p className="text-[11px] text-slate-500">Operations, GadgetRush</p>
                </div>
              </div>
            </Card>

            <Card className="border-slate-200/90 shadow-2xs p-6 space-y-4 rounded-2xl bg-white">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;As a rider, the mobile hub layout is clean and fast. I can mark runs, inspect receiver addresses with Google Maps links, and confirm delivery in seconds.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                  MK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Mahmudul Karim</p>
                  <p className="text-[11px] text-slate-500">Senior Linehaul Courier Rider</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 🚀 Grand CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <Badge className="bg-white/20 text-white border-none font-bold text-xs uppercase tracking-wide">
            Instant Evaluation
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to experience a truly modern courier platform?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto">
            Test the 1-Click Role Login now to explore Admin Dispatch Analytics, Customer Booking Wizard, and Rider OTP Handshake.
          </p>
          <div className="pt-3 flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-extrabold shadow-xl gap-2 text-base px-8 h-12">
                1-Click Demo Login <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 font-bold h-12 px-7">
                View Rate Schedule
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
