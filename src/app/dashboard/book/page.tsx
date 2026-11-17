"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MapPin,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const bookingSchema = z.object({
  originHubId: z.string().min(1, "Origin hub is required"),
  destinationHubId: z.string().min(1, "Destination hub is required"),
  senderName: z.string().min(2, "Sender name must be at least 2 characters"),
  senderPhone: z.string().min(6, "Sender phone is required"),
  senderAddress: z.string().min(3, "Sender address is required"),
  receiverName: z.string().min(2, "Receiver name must be at least 2 characters"),
  receiverPhone: z.string().min(6, "Receiver phone is required"),
  receiverAddress: z.string().min(3, "Receiver address is required"),
  weightKg: z.number().min(0.1, "Weight must be greater than 0"),
  lengthCm: z.number().min(1, "Length must be at least 1 cm"),
  widthCm: z.number().min(1, "Width must be at least 1 cm"),
  heightCm: z.number().min(1, "Height must be at least 1 cm"),
  isFragile: z.boolean(),
  deliveryNotes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const STEPS = [
  { step: 1, title: "Address & Hubs" },
  { step: 2, title: "Dimensions & Specs" },
  { step: 3, title: "Price Review" },
  { step: 4, title: "Payment & Confirmation" },
];

export default function BookShipmentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdShipment, setCreatedShipment] = useState<any>(null);

  // Fetch available hubs from Neon DB
  const { data: hubsData } = useQuery({
    queryKey: ["hubs-list"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/hubs");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const hubs =
    hubsData && hubsData.length > 0
      ? hubsData
      : [
          { id: "11111111-1111-1111-1111-111111111111", name: "Dhaka Central Hub", zone: "Dhaka North" },
          { id: "22222222-2222-2222-2222-222222222222", name: "Chittagong Port Hub", zone: "Chittagong" },
          { id: "33333333-3333-3333-3333-333333333333", name: "Sylhet Regional Hub", zone: "Sylhet" },
        ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      originHubId: hubs[0]?.id || "",
      destinationHubId: hubs[1]?.id || hubs[0]?.id || "",
      senderName: user?.name || "Merchant Sender",
      senderPhone: user?.phone || "01711000000",
      senderAddress: "House 12, Road 4, Banani, Dhaka",
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      weightKg: 2,
      lengthCm: 25,
      widthCm: 20,
      heightCm: 15,
      isFragile: false,
      deliveryNotes: "",
    },
  });

  const formValues = watch();

  // Dynamic price calculation
  const volumetricWeight = Number(
    ((formValues.lengthCm * formValues.widthCm * formValues.heightCm) / 5000).toFixed(2)
  );
  const chargeableWeight = Math.max(formValues.weightKg || 1, volumetricWeight);
  const isIntraZone = formValues.originHubId === formValues.destinationHubId;
  const baseFare = isIntraZone ? 60 : 120;
  const weightSurcharge = Math.max(0, Math.ceil(chargeableWeight - 1)) * 20;
  const fragileSurcharge = formValues.isFragile ? 50 : 0;
  const totalFare = baseFare + weightSurcharge + fragileSurcharge;

  // Step Navigation Handlers
  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger([
        "originHubId",
        "destinationHubId",
        "senderName",
        "senderPhone",
        "senderAddress",
        "receiverName",
        "receiverPhone",
        "receiverAddress",
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger(["weightKg", "lengthCm", "widthCm", "heightCm"]);
    } else {
      isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Submit and create parcel
  const onSubmitBooking = async (data: BookingFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await apiClient.post("/shipments", data);
      if (res.data?.success) {
        const shipment = res.data.data;
        setCreatedShipment(shipment);
        toast.success(`Shipment ${shipment.trackingNumber} booked successfully!`);
        setCurrentStep(4);
      } else {
        toast.error(res.data?.message || "Failed to create shipment");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          "Failed to create shipment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Stripe Payment Checkout Session
  const handleInitiateStripePayment = async () => {
    if (!createdShipment?.id) return;
    try {
      setIsSubmitting(true);
      const res = await apiClient.post("/payments/initiate", {
        shipmentId: createdShipment.id,
      });

      if (res.data?.success && res.data?.data?.url) {
        toast.success("Redirecting to Stripe Checkout...");
        window.location.href = res.data.data.url;
      } else {
        toast.error("Could not generate Stripe checkout session");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment initiation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Book New Parcel Shipment
        </h1>
        <p className="text-sm text-slate-500">
          Enter sender and receiver details with certified volumetric calculations.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className={`p-3 rounded-xl border text-center transition-all ${
              currentStep === s.step
                ? "border-blue-600 bg-blue-50/80 text-blue-700 font-bold shadow-xs"
                : currentStep > s.step
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 font-medium"
                : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs">
              {currentStep > s.step ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <span className="font-mono">0{s.step}.</span>
              )}
              <span>{s.title}</span>
            </div>
          </div>
        ))}
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmitBooking)}>
            {/* STEP 1: Address & Hubs */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" /> Step 1: Logistics Hubs & Contact
                  </h3>
                  <p className="text-xs text-slate-500">Select routing hubs and addresses</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Origin Logistics Hub *</Label>
                    <select
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500"
                      {...register("originHubId")}
                    >
                      {hubs.map((h: any) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Destination Logistics Hub *</Label>
                    <select
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-500"
                      {...register("destinationHubId")}
                    >
                      {hubs.map((h: any) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.zone})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sender Details */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Sender Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Sender Name *</Label>
                      <Input placeholder="Your Name" {...register("senderName")} />
                      {errors.senderName && <p className="text-xs text-red-600">{errors.senderName.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Sender Phone *</Label>
                      <Input placeholder="017xxxxxxxx" {...register("senderPhone")} />
                      {errors.senderPhone && <p className="text-xs text-red-600">{errors.senderPhone.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Sender Full Address *</Label>
                    <Input placeholder="Pickup Address" {...register("senderAddress")} />
                    {errors.senderAddress && <p className="text-xs text-red-600">{errors.senderAddress.message}</p>}
                  </div>
                </div>

                {/* Receiver Details */}
                <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Recipient Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Recipient Name *</Label>
                      <Input placeholder="Customer Name" {...register("receiverName")} />
                      {errors.receiverName && <p className="text-xs text-red-600">{errors.receiverName.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Recipient Phone *</Label>
                      <Input placeholder="018xxxxxxxx" {...register("receiverPhone")} />
                      {errors.receiverPhone && <p className="text-xs text-red-600">{errors.receiverPhone.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Recipient Delivery Address *</Label>
                    <Input placeholder="Destination Full Address" {...register("receiverAddress")} />
                    {errors.receiverAddress && <p className="text-xs text-red-600">{errors.receiverAddress.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Dimensions & Specs */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" /> Step 2: Parcel Dimensions & Volumetric Specs
                  </h3>
                  <p className="text-xs text-slate-500">Provide accurate weight and size measurements</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Scale Weight (KG) *</Label>
                    <Input
                      type="number"
                      step={0.1}
                      min={0.1}
                      {...register("weightKg", { valueAsNumber: true })}
                    />
                    {errors.weightKg && <p className="text-xs text-red-600">{errors.weightKg.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Length (CM) *</Label>
                    <Input
                      type="number"
                      min={1}
                      {...register("lengthCm", { valueAsNumber: true })}
                    />
                    {errors.lengthCm && <p className="text-xs text-red-600">{errors.lengthCm.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Width (CM) *</Label>
                    <Input
                      type="number"
                      min={1}
                      {...register("widthCm", { valueAsNumber: true })}
                    />
                    {errors.widthCm && <p className="text-xs text-red-600">{errors.widthCm.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Height (CM) *</Label>
                    <Input
                      type="number"
                      min={1}
                      {...register("heightCm", { valueAsNumber: true })}
                    />
                    {errors.heightCm && <p className="text-xs text-red-600">{errors.heightCm.message}</p>}
                  </div>
                </div>

                {/* Fragile Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Fragile or Glass Cargo</p>
                      <p className="text-xs text-slate-500">Requires protective bubble wrap and manual care (+৳50)</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded cursor-pointer"
                    {...register("isFragile")}
                  />
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Special Delivery Instructions (Optional)</Label>
                  <Input
                    placeholder="e.g. Call before delivery, ring bell twice"
                    {...register("deliveryNotes")}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Price Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" /> Step 3: Itemized Price Calculation
                  </h3>
                  <p className="text-xs text-slate-500">Verified volumetric rates before booking creation</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-slate-800">Weight Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Actual Weight:</span>
                        <span className="font-mono font-bold text-slate-800">{formValues.weightKg} KG</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Volumetric Weight:</span>
                        <span className="font-mono font-bold text-slate-800">{volumetricWeight} KG</span>
                      </div>
                      <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold text-blue-700">
                        <span>Chargeable Weight:</span>
                        <span className="font-mono">{chargeableWeight} KG</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-slate-800">Routing Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Route Type:</span>
                        <Badge variant="outline" className={isIntraZone ? "text-blue-700" : "text-emerald-700"}>
                          {isIntraZone ? "Intra-City Zone" : "Inter-City Nationwide"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Base Fare:</span>
                        <span className="font-mono font-bold text-slate-800">৳ {baseFare} BDT</span>
                      </div>
                      <div className="border-t border-slate-100 pt-2 flex justify-between">
                        <span className="text-slate-500">Weight Extra:</span>
                        <span className="font-mono font-bold text-slate-800">৳ {weightSurcharge} BDT</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Total Summary Banner */}
                <div className="p-6 rounded-2xl bg-blue-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md shadow-blue-500/20">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                      Total Calculated Price
                    </span>
                    <p className="text-3xl font-extrabold font-mono">৳ {totalFare} BDT</p>
                    {formValues.isFragile && (
                      <p className="text-xs text-blue-100 mt-1">Includes ৳50 Fragile Handling Surcharge</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Booking Shipment...
                      </>
                    ) : (
                      "Confirm & Book Shipment"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment & Confirmation */}
            {currentStep === 4 && (
              <div className="py-6 text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                  <Check className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Shipment Successfully Booked!</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Consignment Tracking Number:{" "}
                    <span className="font-mono font-bold text-slate-900">
                      {createdShipment?.trackingNumber || "TRK-2026-PENDING"}
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recipient:</span>
                    <span className="font-semibold text-slate-800">{formValues.receiverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Fee:</span>
                    <span className="font-mono font-bold text-slate-900">৳ {createdShipment?.price || totalFare} BDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Status:</span>
                    <Badge variant="warning">PENDING STRIPE PAYMENT</Badge>
                  </div>
                </div>

                {/* Instant Stripe Checkout Action */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    type="button"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-md"
                    onClick={handleInitiateStripePayment}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    Pay via Stripe Checkout Now
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/dashboard/shipments")}
                  >
                    View My Shipments
                  </Button>
                </div>
              </div>
            )}

            {/* Step Control Buttons (Step 1 to 3) */}
            {currentStep < 4 && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" size="sm" onClick={handlePrevStep} className="gap-1">
                    <ArrowLeft className="h-4 w-4" /> Previous Step
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 && (
                  <Button type="button" size="sm" onClick={handleNextStep} className="gap-1">
                    Next Step <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
