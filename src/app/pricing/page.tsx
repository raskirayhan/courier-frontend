import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { FareCalculatorWidget } from "@/components/home/fare-calculator-widget";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />

      <main className="flex-1 bg-slate-50">
        {/* Pricing Header */}
        <section className="bg-slate-900 text-white py-20 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Badge className="bg-blue-600 text-white border-none text-xs">
              Simple & Transparent
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Honest, Predictable Delivery Rates
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-base font-normal">
              No hidden fees or unexpected surcharges. Powered by industry-standard IATA volumetric weight metrics.
            </p>
          </div>
        </section>

        {/* Pricing Table & Calculator Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Rate Cards on Left */}
              <div className="lg:col-span-6 space-y-6">
                <Card className="border-slate-200">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-slate-900">Intra-City Delivery</CardTitle>
                      <Badge className="bg-blue-100 text-blue-700">Same Zone</Badge>
                    </div>
                    <p className="text-xs text-slate-500">Deliveries within the same district or metropolitan hub</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-slate-900 font-mono">৳60</span>
                      <span className="text-xs text-slate-500">Base fare (First 1 KG)</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Additional weight: <strong>৳20 BDT</strong> per subsequent kilogram</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Pickup within 60 minutes for priority orders</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Real-time GPS rider tracking on live map</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-slate-900">Inter-City Nationwide</CardTitle>
                      <Badge className="bg-emerald-100 text-emerald-700">Cross Zone</Badge>
                    </div>
                    <p className="text-xs text-slate-500">Linehaul transit between regional hubs across 64 districts</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-slate-900 font-mono">৳120</span>
                      <span className="text-xs text-slate-500">Base fare (First 1 KG)</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Additional weight: <strong>৳20 BDT</strong> per subsequent kilogram</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Hub-to-hub linehaul express movement</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>24 to 48 hours guaranteed delivery window</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Surcharge Note */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-amber-600" /> Fragile Handling Surcharge
                  </p>
                  <p className="text-amber-700">
                    Fragile cargo is charged a flat <strong>+৳50 BDT</strong> fee to cover shock-resistant bubble packaging and separated van transport.
                  </p>
                </div>
              </div>

              {/* Live Calculator Widget on Right */}
              <div className="lg:col-span-6">
                <FareCalculatorWidget />
              </div>
            </div>
          </div>
        </section>

        {/* Volumetric Weight Explanation */}
        <section className="py-14 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <h3 className="text-2xl font-bold text-slate-900">How is Volumetric Weight Calculated?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If an item is lightweight but bulky (like a stuffed toy or empty cooler), it takes up significant vehicle space. We use the certified IATA standard formula:
            </p>
            <div className="inline-block p-4 rounded-xl bg-slate-100 border border-slate-200 font-mono text-sm font-bold text-slate-800">
              Volumetric Weight (KG) = (Length in cm × Width in cm × Height in cm) / 5000
            </div>
            <p className="text-xs text-slate-500">
              The chargeable weight will always be whichever is greater: the <strong>Actual Scale Weight</strong> or the <strong>Volumetric Weight</strong>.
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
