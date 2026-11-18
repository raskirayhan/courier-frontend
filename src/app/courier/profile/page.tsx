"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bike,
  Truck,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Gauge,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Loader2,
} from "lucide-react";

export default function CourierProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+880 1712-345678");
  const [vehicleType, setVehicleType] = useState<"MOTORCYCLE" | "VAN">("MOTORCYCLE");
  const [licenseNumber, setLicenseNumber] = useState("DL-DHK-99281");
  const [plateNumber, setPlateNumber] = useState("DHAKA METRO HA-44-1298");

  // Simulated live capacity
  const currentParcelCount = 3;
  const maxCapacity = vehicleType === "MOTORCYCLE" ? 10 : 35;
  const capacityPercent = Math.round((currentParcelCount / maxCapacity) * 100);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const res = await apiClient.patch("/users/me", {
        name,
        phone,
      });

      if (res.data?.success) {
        updateUser({ name, phone });
        toast.success("Rider profile details updated successfully!");
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Profile update error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Courier Rider Profile & Fleet Vehicle
        </h1>
        <p className="text-sm text-slate-500">
          Manage your delivery vehicle telemetry, dispatch zone assignment, and rider verification.
        </p>
      </div>

      {/* Top Banner Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            {vehicleType === "MOTORCYCLE" ? (
              <Bike className="h-8 w-8" />
            ) : (
              <Truck className="h-8 w-8" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{user?.name || "Rider"}</h2>
              <Badge className="bg-emerald-500 text-white text-[10px] border-none">
                VERIFIED COURIER
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-emerald-400 font-mono mt-1">ID: RIDER-DHK-409</p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Duty Status
          </span>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE & ASSIGNED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Live Vehicle Capacity & Zone */}
        <div className="space-y-6 md:col-span-1">
          {/* Capacity Gauge */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-emerald-600" />
                Live Vehicle Capacity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono">
                    {currentParcelCount} / {maxCapacity}
                  </div>
                  <p className="text-xs text-slate-500">Parcels onboard</p>
                </div>
                <Badge
                  variant={capacityPercent > 80 ? "destructive" : "success"}
                  className="text-xs font-mono font-bold"
                >
                  {capacityPercent}% LOAD
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    capacityPercent > 80 ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Central dispatch automatically throttles assignment when your payload reaches 90%
                to ensure rider safety and speed.
              </p>
            </CardContent>
          </Card>

          {/* Assigned Operating Hub */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Zone & Hub Linehaul
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="font-semibold text-slate-900">Tejgaon Central Sorting Hub</p>
                <p className="text-slate-500 text-[11px]">Plot 42, Tejgaon I/A, Dhaka-1208</p>
              </div>
              <div className="flex justify-between items-center text-slate-600 pt-1">
                <span>Coverage Sector:</span>
                <strong className="text-slate-900">Gulshan - Banani - Mohakhali</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Dispatch Shift:</span>
                <span className="font-mono text-slate-900 font-medium">08:00 AM - 05:00 PM</span>
              </div>
            </CardContent>
          </Card>

          {/* SOS Emergency Help */}
          <Card className="border-amber-200 bg-amber-50/40">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-amber-900">Rider Incident Hotline</p>
                <p className="text-amber-700 leading-snug">
                  If involved in a road incident or delayed by transit breakdown:
                </p>
                <a
                  href="tel:+8809612000000"
                  className="font-mono font-bold text-amber-900 hover:underline block pt-1"
                >
                  📞 +880 9612-000000 (Dispatch SOS)
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Profile Edit & Vehicle Specs */}
        <div className="space-y-6 md:col-span-2">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">
                Rider Information & Vehicle Credentials
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Official records matched with your National ID and Driving Authority license
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="rider-name">Full Name</Label>
                    <div className="relative">
                      <User className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                      <Input
                        id="rider-name"
                        type="text"
                        className="pl-9"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="rider-phone">Contact Phone</Label>
                    <div className="relative">
                      <Phone className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                      <Input
                        id="rider-phone"
                        type="text"
                        className="pl-9 font-mono"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="rider-email">Registered Email Address (Locked)</Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                    <Input
                      id="rider-email"
                      type="email"
                      className="pl-9 bg-slate-50 text-slate-500 font-mono"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Primary email is tied to central identity and cannot be modified.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Assigned Fleet Unit Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="vehicle-type">Vehicle Class</Label>
                      <select
                        id="vehicle-type"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value as any)}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="MOTORCYCLE">Motorcycle (Fast Express - 10 Parcels Max)</option>
                        <option value="VAN">Delivery Van (Heavy Freight - 35 Parcels Max)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="plate-no">License Plate Number</Label>
                      <Input
                        id="plate-no"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                        className="font-mono uppercase text-xs"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="license-no">BRTA Driver License Number</Label>
                      <div className="relative">
                        <FileText className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        <Input
                          id="license-no"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          className="pl-9 font-mono uppercase text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Update Rider Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
