"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Sparkles, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

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

export function FareCalculatorWidget() {
  const [pickupZone, setPickupZone] = useState("Dhaka North");
  const [deliveryZone, setDeliveryZone] = useState("Chittagong");
  const [actualWeight, setActualWeight] = useState<number>(2);
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(15);
  const [isFragile, setIsFragile] = useState(false);

  // Volumetric formula
  const volumetricWeight = Number(((length * width * height) / 5000).toFixed(2));
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);

  // Rate calculation
  const isIntraZone =
    pickupZone.split(" ")[0] === deliveryZone.split(" ")[0];
  const baseFare = isIntraZone ? 60 : 120;
  const weightSurcharge = Math.max(0, Math.ceil(chargeableWeight - 1)) * 20;
  const fragileSurcharge = isFragile ? 50 : 0;
  const totalFare = baseFare + weightSurcharge + fragileSurcharge;

  return (
    <Card className="border-slate-200/90 shadow-xl shadow-blue-500/5 overflow-hidden">
      <CardHeader className="bg-slate-900 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">
                Live Volumetric Fare Estimator
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Accurate instant rates matching our official logistics engine
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-blue-600/80 text-white text-[10px] hidden sm:inline-flex">
            (L×W×H) / 5000 Formula
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Pickup Zone</Label>
            <select
              value={pickupZone}
              onChange={(e) => setPickupZone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Delivery Zone</Label>
            <select
              value={deliveryZone}
              onChange={(e) => setDeliveryZone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Weight & Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-600">Weight (KG)</Label>
            <Input
              type="number"
              min={0.5}
              step={0.5}
              value={actualWeight}
              onChange={(e) => setActualWeight(Math.max(0.1, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-600">Length (CM)</Label>
            <Input
              type="number"
              min={1}
              value={length}
              onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-600">Width (CM)</Label>
            <Input
              type="number"
              min={1}
              value={width}
              onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-600">Height (CM)</Label>
            <Input
              type="number"
              min={1}
              value={height}
              onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        {/* Fragile Item Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Fragile or Delicate Goods</p>
              <p className="text-[11px] text-slate-500">Adds bubble-wrap & specialized handling (+৳50)</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isFragile}
            onChange={(e) => setIsFragile(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Results Box */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Volumetric Weight:</span>
            <span className="font-mono font-bold text-slate-800">{volumetricWeight} kg</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Chargeable Weight:</span>
            <span className="font-mono font-bold text-blue-700">
              {chargeableWeight} kg ({chargeableWeight === volumetricWeight ? "Volumetric" : "Actual"})
            </span>
          </div>
          <div className="border-t border-blue-200 pt-3 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Estimated Total Fare</span>
              <p className="text-2xl font-extrabold text-slate-900">৳ {totalFare} <span className="text-xs font-normal text-slate-500">BDT</span></p>
            </div>
            <Link href="/login">
              <Button size="sm" className="gap-1.5 shadow-md shadow-blue-500/20">
                Book Shipment <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
