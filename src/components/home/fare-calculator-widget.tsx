"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Check,
} from "lucide-react";

const ZONES = [
  "Dhaka North",
  "Dhaka South",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
];

const WEIGHT_PRESETS = [
  { label: "Doc / Flyer", weight: 0.5, l: 30, w: 22, h: 2 },
  { label: "Small Box", weight: 2, l: 25, w: 20, h: 15 },
  { label: "Medium Cargo", weight: 5, l: 40, w: 30, h: 25 },
  { label: "Heavy Freight", weight: 12, l: 55, w: 45, h: 35 },
];

export function FareCalculatorWidget() {
  const [pickupZone, setPickupZone] = useState("Dhaka North");
  const [deliveryZone, setDeliveryZone] = useState("Chittagong");
  const [actualWeight, setActualWeight] = useState<number>(2);
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(15);
  const [isFragile, setIsFragile] = useState(false);
  const [isPriority, setIsPriority] = useState(false);

  // Volumetric formula: (L x W x H) / 5000
  const volumetricWeight = Number(((length * width * height) / 5000).toFixed(2));
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);

  // Rate rules
  const isIntraZone = pickupZone.split(" ")[0] === deliveryZone.split(" ")[0];
  const baseFare = isIntraZone ? 60 : 120;
  const weightSurcharge = Math.max(0, Math.ceil(chargeableWeight - 1)) * 25;
  const fragileSurcharge = isFragile ? 40 : 0;
  const prioritySurcharge = isPriority ? 80 : 0;
  const totalFare = baseFare + weightSurcharge + fragileSurcharge + prioritySurcharge;

  const handleApplyPreset = (preset: typeof WEIGHT_PRESETS[0]) => {
    setActualWeight(preset.weight);
    setLength(preset.l);
    setWidth(preset.w);
    setHeight(preset.h);
  };

  return (
    <Card className="border-slate-200/90 shadow-2xl shadow-blue-500/10 overflow-hidden rounded-3xl bg-white transition-all hover:border-blue-300">
      {/* Top Gradient Header */}
      <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Smart Volumetric Fare Engine
              </CardTitle>
              <CardDescription className="text-slate-300 text-xs font-medium">
                Instant IATA-standard $(L \times W \times H) / 5000$ rate computation
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[10px] hidden sm:inline-flex font-mono">
            LIVE TARIFF 2026
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-7 space-y-6">
        {/* Quick Presets */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Quick Package Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WEIGHT_PRESETS.map((p) => {
              const isSelected =
                actualWeight === p.weight && length === p.l && width === p.w && height === p.h;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/80 text-blue-800 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-bold">{p.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{p.weight} kg • {p.l}x{p.w}cm</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Route Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Pickup Origin Zone</Label>
            <select
              value={pickupZone}
              onChange={(e) => setPickupZone(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Delivery Destination Zone</Label>
            <select
              value={deliveryZone}
              onChange={(e) => setDeliveryZone(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dimension & Weight Sliders / Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-[11px] font-bold text-slate-600">Actual Wt (kg)</Label>
            <Input
              type="number"
              min={0.1}
              step={0.5}
              value={actualWeight}
              onChange={(e) => setActualWeight(Math.max(0.1, Number(e.target.value)))}
              className="font-mono text-sm h-10"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-bold text-slate-600">Length (cm)</Label>
            <Input
              type="number"
              min={1}
              value={length}
              onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
              className="font-mono text-sm h-10"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-bold text-slate-600">Width (cm)</Label>
            <Input
              type="number"
              min={1}
              value={width}
              onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
              className="font-mono text-sm h-10"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-bold text-slate-600">Height (cm)</Label>
            <Input
              type="number"
              min={1}
              value={height}
              onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
              className="font-mono text-sm h-10"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isFragile}
              onChange={(e) => setIsFragile(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div className="text-xs">
              <p className="font-bold text-slate-900">Fragile Parcel (+৳40)</p>
              <p className="text-slate-500 text-[11px]">Extra bubble wrap & priority handling</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isPriority}
              onChange={(e) => setIsPriority(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div className="text-xs">
              <p className="font-bold text-slate-900">Rocket Priority Express (+৳80)</p>
              <p className="text-slate-500 text-[11px]">Same-day courier dispatch guarantee</p>
            </div>
          </label>
        </div>

        {/* Live Calculation Output Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white space-y-4 shadow-lg shadow-blue-900/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-300">Chargeable Metrics</span>
            </div>
            <Badge className="bg-emerald-500 text-white font-mono font-bold text-xs">
              Chargeable: {chargeableWeight} KG
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Actual Weight</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{actualWeight} KG</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Volumetric Wt</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{volumetricWeight} KG</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Transit Tariff</span>
              <span className="font-semibold text-emerald-400 text-sm">
                {isIntraZone ? "Intra-Zone (৳60)" : "Inter-District (৳120)"}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block">Total Estimated Shipping Cost</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-white font-mono">৳ {totalFare}</span>
                <span className="text-xs text-slate-400">BDT (Inclusive of VAT)</span>
              </div>
            </div>

            <Link href="/dashboard/book">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 shadow-md shadow-blue-600/30">
                Book This Consignment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
