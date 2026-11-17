import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ShieldCheck, Globe, Users, Target, Award, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />

      <main className="flex-1">
        {/* About Hero */}
        <section className="bg-slate-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <Badge className="bg-blue-600 text-white border-none text-xs">
              About SwiftTrack
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Pioneering Bangladesh&apos;s Modern Logistics Network
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Connecting commerce and communities through intelligent routing, real-time tracking, and verified deliveries.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-slate-200">
                <CardContent className="p-8 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    To eliminate delivery friction for e-commerce merchants and individual senders by providing transparent volumetric pricing, instant Stripe payment integration, and immutable delivery audit trails.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-8 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    To build Bangladesh&apos;s most dependable zero-loss parcel delivery ecosystem, leveraging automated dispatching and cryptographically verified OTP handshakes for every doorstep handover.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Our Core Principles</h2>
              <p className="text-sm text-slate-500">Every parcel in our care moves with purpose and accountability.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-slate-200">
                <CardContent className="p-6 space-y-2">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-base">OTP Verified Security</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zero misplacement. Parcels can only be marked delivered with the customer&apos;s 6-digit confirmation code.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6 space-y-2">
                  <Award className="h-8 w-8 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-base">Fair Volumetric Rates</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transparent rates calculated by certified dimensional formulas: $(L \times W \times H) / 5000$.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6 space-y-2">
                  <Users className="h-8 w-8 text-purple-600" />
                  <h4 className="font-bold text-slate-900 text-base">Balanced Rider Welfare</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our central dispatcher distributes workloads dynamically across couriers to prevent burnout and ensure fast turnaround.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Regional Hub Infrastructure */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <Badge className="bg-slate-100 text-slate-800 border-slate-200">Physical Infrastructure</Badge>
              <h2 className="text-3xl font-bold text-slate-900">Our Central Logistics Hubs</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-blue-100 bg-blue-50/20">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                    <MapPin className="h-4 w-4" /> Dhaka Central Hub
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Tejgaon Industrial Area</h4>
                  <p className="text-xs text-slate-500">Zone: Dhaka Metro • Capacity: 25,000 parcels/day</p>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 bg-emerald-50/20">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                    <MapPin className="h-4 w-4" /> Port Logistics Hub
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Agrabad, Chittagong</h4>
                  <p className="text-xs text-slate-500">Zone: Chittagong Metro • Capacity: 15,000 parcels/day</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 bg-purple-50/20">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
                    <MapPin className="h-4 w-4" /> Sylhet Regional Hub
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Subidbazar, Sylhet</h4>
                  <p className="text-xs text-slate-500">Zone: Sylhet Division • Capacity: 8,000 parcels/day</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
