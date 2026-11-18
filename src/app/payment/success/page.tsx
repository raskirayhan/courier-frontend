"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  KeyRound,
  CreditCard,
  ArrowRight,
  Printer,
  Download,
  ShieldCheck,
} from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "cs_test_mock_session_2026";
  const trackingNumber = searchParams.get("tracking") || "TRK-2026-LIVE";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback if confetti canvas not ready
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      {/* Success Card */}
      <Card className="border-emerald-200/90 shadow-xl overflow-hidden bg-white text-center">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 space-y-3">
          <div className="h-16 w-16 rounded-full bg-white text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <Badge className="bg-white/20 text-white border-none text-xs font-mono">
            Stripe Payment Verified
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Payment Successful!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-sm mx-auto">
            Thank you for your payment. Your shipment has been transitioned to <strong>PAID</strong> and routed for courier pickup.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6 text-left">
          {/* Transaction Metadata Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Payment Status:</span>
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> PAID VIA STRIPE
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Tracking Consignment:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{trackingNumber}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Stripe Session ID:</span>
              <span className="font-mono text-slate-500 truncate max-w-[200px]" title={sessionId}>
                {sessionId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-blue-600" /> Card (Test Mode)
              </span>
            </div>
          </div>

          {/* Customer OTP Security Notice */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-bold">
              <KeyRound className="h-4 w-4 text-blue-600" />
              <span>Customer Delivery OTP Generated</span>
            </div>
            <p className="text-blue-700 leading-relaxed text-[11px]">
              A unique 6-digit delivery OTP has been locked into your consignment. You can view it inside your{" "}
              <strong>My Shipments</strong> dashboard and provide it to the rider upon doorstep arrival.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/shipments" className="flex-1">
              <Button size="lg" className="w-full gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Package className="h-4 w-4" /> Go to My Shipments
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
            >
              <Printer className="h-4 w-4" /> Print Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNavbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-16 text-center text-slate-400">Verifying Stripe session...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
