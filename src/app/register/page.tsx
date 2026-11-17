"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Must contain at least 1 number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least 1 special character"),
  phone: z.string().min(10, "Please enter a valid phone number").optional().or(z.literal("")),
  defaultAddress: z.string().min(5, "Address must be at least 5 characters").optional().or(z.literal("")),
  district: z.string().min(2, "District is required").optional().or(z.literal("")),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      defaultAddress: "",
      district: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const payload: any = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      if (values.phone) payload.phone = values.phone;
      if (values.defaultAddress) payload.defaultAddress = values.defaultAddress;
      if (values.district) payload.district = values.district;

      const response = await apiClient.post("/auth/register", payload);

      if (response.data?.success) {
        setIsSuccess(true);
        toast.success("Account created successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(response.data?.message || "Registration failed");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          "Registration failed. Email might already exist."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Truck className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            Swift<span className="text-blue-600">Track</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create customer account
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Join thousands of merchants sending parcels nationwide
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-slate-900">Registration Complete!</h3>
              <p className="text-sm text-slate-600">
                Your customer account has been created. Redirecting to login...
              </p>
              <Link href="/login">
                <Button className="mt-4">Go to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Raski Rayhan"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Phone & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="017xxxxxxxx"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="district">District / City</Label>
                  <Input
                    id="district"
                    placeholder="e.g. Dhaka"
                    {...register("district")}
                  />
                  {errors.district && (
                    <p className="text-xs text-red-600">{errors.district.message}</p>
                  )}
                </div>
              </div>

              {/* Default Address */}
              <div className="space-y-1">
                <Label htmlFor="defaultAddress">Pickup / Default Address</Label>
                <Input
                  id="defaultAddress"
                  placeholder="House, Road, Area, Ward"
                  {...register("defaultAddress")}
                />
                {errors.defaultAddress && (
                  <p className="text-xs text-red-600">{errors.defaultAddress.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating Account...
                  </>
                ) : (
                  "Create Customer Account"
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
