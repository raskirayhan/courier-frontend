import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  Zap,
  Package,
  ShieldCheck,
  Building2,
  RefreshCw,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const SERVICES = [
  {
    icon: Zap,
    color: "text-amber-600 bg-amber-50",
    title: "Same-Day Intra-City Express",
    desc: "Speed-critical delivery within major metro zones (Dhaka & Chittagong). Pickup within 60 minutes and delivered within the same business day.",
    features: ["Intra-zone base: ৳60 BDT", "Dedicated point-to-point rider", "Real-time rider tracking"],
  },
  {
    icon: Truck,
    color: "text-blue-600 bg-blue-50",
    title: "Nationwide Hub-to-Hub Transit",
    desc: "Reliable inter-city network connecting all 64 districts in Bangladesh with 24–48 hour delivery turnaround through central logistics hubs.",
    features: ["Inter-zone base: ৳120 BDT", "Night-haul linehaul transit", "SMS & email tracking alerts"],
  },
  {
    icon: ShieldCheck,
    color: "text-purple-600 bg-purple-50",
    title: "Fragile & High-Value Cargo",
    desc: "Special handling for delicate glassware, electronics, and documents with shock-absorbent packaging and manual supervisor sign-offs.",
    features: ["Specialized bubble cushioning", "Manual sorting buffer (+৳50)", "Priority doorstep delivery"],
  },
  {
    icon: Building2,
    color: "text-emerald-600 bg-emerald-50",
    title: "Corporate & B2B Bulk Freight",
    desc: "Scheduled scheduled bulk pickups, volume invoicing, and discounted volumetric pricing for commercial distributors and manufacturers.",
    features: ["Custom monthly billing", "API webhook integration", "Dedicated account manager"],
  },
  {
    icon: RefreshCw,
    color: "text-rose-600 bg-rose-50",
    title: "Reverse Logistics & Returns",
    desc: "Seamless exchange and customer return handling for e-commerce stores with automated status sync back to the merchant dashboard.",
    features: ["Customer pickup coordination", "Quality inspection on collection", "Immediate inventory notification"],
  },
  {
    icon: CreditCard,
    color: "text-indigo-600 bg-indigo-50",
    title: "Automated Stripe Payment Escrow",
    desc: "Card-based payment processing powered by Stripe Test & Live infrastructure, automatically generating customer verification OTPs.",
    features: ["Debit/Credit card support", "Zero merchant reconciliation effort", "Instant invoice receipt"],
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />

      <main className="flex-1">
        {/* Services Hero */}
        <section className="bg-slate-900 text-white py-20 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Badge className="bg-blue-600 text-white border-none text-xs">
              Service Offerings
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Enterprise Logistics Tailored to Your Scale
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-base font-normal">
              From single document couriers to scheduled container linehauls, explore our specialized freight solutions.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <Card key={idx} className="border-slate-200/90 hover:shadow-lg transition-all bg-white flex flex-col justify-between">
                    <CardContent className="p-7 space-y-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${s.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        {s.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <Link href="/login">
                <Button size="lg" className="gap-2 shadow-md">
                  Book a Shipment Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
