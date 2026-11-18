"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  CreditCard,
  ArrowRight,
  Package,
  RefreshCw,
  HelpCircle,
  Loader2,
} from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("shipmentId");
  const trackingNumber = searchParams.get("tracking") || "Pending Shipment";
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  const handleRetryPayment = async () => {
    if (!shipmentId) {
      router.push("/dashboard/shipments");
      return;
    }

    try {
      setIsRetrying(true);
      const res = await apiClient.post("/payments/initiate", { shipmentId });
      if (res.data?.success && res.data?.data?.url) {
        toast.success("Redirecting to Stripe Checkout...");
        window.location.href = res.data.data.url;
      } else {
        toast.error("Could not regenerate payment session. Please check your dashboard.");
        router.push("/dashboard/shipments");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to retry payment");
      router.push("/dashboard/shipments");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <Card className="border-amber-200/90 shadow-xl overflow-hidden bg-white text-center">
        {/* Amber Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8 space-y-3">
          <div className="h-16 w-16 rounded-full bg-white text-amber-600 mx-auto flex items-center justify-center shadow-md">
            <XCircle className="h-10 w-10" />
          </div>
          <Badge className="bg-white/20 text-white border-none text-xs">
            Payment Incomplete
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Checkout Was Cancelled
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-sm mx-auto">
            You exited the Stripe Checkout session before completing payment. No funds were debited from your account.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6 text-left">
          {/* Status Explanation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Booking Status:</span>
              <Badge variant="warning">PENDING PAYMENT</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Consignment:</span>
              <span className="font-mono font-bold text-slate-800">{trackingNumber}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              Your parcel booking is still saved safely in your account. Riders will be dispatched as soon as payment is confirmed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm"
              onClick={handleRetryPayment}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Preparing Checkout...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" /> Retry Payment with Stripe
                </>
              )}
            </Button>

            <Link href="/dashboard/shipments">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Package className="h-4 w-4" /> My Shipments
              </Button>
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800"
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1 text-slate-400" /> Need assistance? Contact our 24/7 billing support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNavbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-16 text-center text-slate-400">Loading cancellation state...</div>}>
          <PaymentCancelContent />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
