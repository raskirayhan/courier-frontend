"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, ShieldCheck, Loader2, Save } from "lucide-react";

export default function CustomerProfilePage() {
  const { user, login, token } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "01711000000",
      defaultAddress: user?.customer?.defaultAddress || "House 12, Road 4, Banani, Dhaka",
      district: user?.customer?.district || "Dhaka",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      const res = await apiClient.patch("/users/me", values);
      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        if (token && user) {
          login({ ...user, name: values.name, phone: values.phone }, token);
        }
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Profile & Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your contact credentials and default pickup preferences.
        </p>
      </div>

      {/* Account Info Badge */}
      <Card className="border-slate-200">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{user?.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              Role: {user?.role}
            </Badge>
            <Badge variant="success">Active Account</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-bold text-slate-900">
            Contact & Address Information
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            This information will pre-fill your future parcel booking forms
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input className="pl-9" {...register("name", { required: true })} />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Email Address (Read-only)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input className="pl-9 bg-slate-50 text-slate-500" value={user?.email || ""} disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input className="pl-9" {...register("phone")} />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">District / Division</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input className="pl-9" {...register("district")} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Default Pickup Address</Label>
              <Input {...register("defaultAddress")} />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="gap-2" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
