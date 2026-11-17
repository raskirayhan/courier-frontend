"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2, Clock, AlertCircle, ArrowUpRight, Loader2, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CustomerPaymentsPage() {
  const { data: shipmentsData, isLoading } = useQuery({
    queryKey: ["customer-payments-list"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/shipments?limit=50");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const shipments = shipmentsData || [];

  const paidShipments = shipments.filter((s: any) => s.paymentStatus === "PAID");
  const pendingShipments = shipments.filter(
    (s: any) => s.paymentStatus === "PENDING" && s.status !== "CANCELLED"
  );

  const totalPaidAmount = paidShipments.reduce((acc: number, s: any) => acc + (s.price || 0), 0);
  const totalPendingAmount = pendingShipments.reduce((acc: number, s: any) => acc + (s.price || 0), 0);

  const handlePayNow = async (shipmentId: string) => {
    try {
      const res = await apiClient.post("/payments/initiate", { shipmentId });
      if (res.data?.success && res.data?.data?.url) {
        window.location.href = res.data.data.url;
      }
    } catch (e: any) {
      alert("Payment redirect failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Billing, Invoices & Stripe Payments
        </h1>
        <p className="text-sm text-slate-500">
          View your paid transactions, download digital receipts, and clear pending balances.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Paid
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              ৳ {totalPaidAmount} BDT
            </div>
            <p className="text-xs text-slate-500 mt-1">{paidShipments.length} Completed transactions</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Invoices
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-amber-600 font-mono">
              ৳ {totalPendingAmount} BDT
            </div>
            <p className="text-xs text-slate-500 mt-1">{pendingShipments.length} Unpaid bookings</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Payment Gateway
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-slate-900">Stripe Escrow</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> PCI-DSS Compliant Test Mode
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-6">
          <CardTitle className="text-base font-bold text-slate-900">
            Payment Transaction History
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            All card payments processed through Stripe Checkout
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-blue-600" />
              Loading payment history...
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No payment transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Invoice / Parcel</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Gateway</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {s.trackingNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{s.receiverName || s.recipientName}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        ৳ {s.price} BDT
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        Stripe Checkout
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={s.paymentStatus === "PAID" ? "success" : "warning"}>
                          {s.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {s.paymentStatus === "PENDING" && s.status !== "CANCELLED" ? (
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handlePayNow(s.id)}
                          >
                            Pay ৳{s.price}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-slate-600 gap-1"
                            onClick={() => window.print()}
                          >
                            <Download className="h-3 w-3" /> Receipt
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
