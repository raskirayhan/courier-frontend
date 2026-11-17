import Link from "next/link";
import { Truck, Mail, Phone, MapPin, ShieldCheck, Clock, Globe } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Truck className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Swift<span className="text-blue-500">Track</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bangladesh&apos;s leading tech-first logistics and nationwide courier delivery network. Express parcel, corporate freight, and e-commerce fulfillment.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> ISO Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-400" /> 24/7 Operations
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home & Live Tracking
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Network
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Logistics Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Rates & Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Support & Branch Offices
                </Link>
              </li>
            </ul>
          </div>

          {/* Logistics Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Solutions
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Intra-City Same-Day Express</li>
              <li>Nationwide 64-District Hub Transit</li>
              <li>Volumetric Cargo & Bulk Freight</li>
              <li>Stripe Automated Payment Escrow</li>
              <li>OTP Secure Delivery Verification</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Hub Support HQ
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Central Logistics Hub, Tejgaon I/A, Dhaka-1208, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <span>+880 9612-445566 (Hotline)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <span>support@swifttrack.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Coverage: 64 Districts Across BD</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 SwiftTrack Courier & Logistics Platform. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
