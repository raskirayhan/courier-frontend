"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { decodeUserFromToken } from "@/lib/auth-helpers";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, ShieldCheck, UserCheck, Lock, Mail, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const login = useAuthStore((state) => state.login);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSuccess = (token: string) => {
    const user = decodeUserFromToken(token);
    if (!user) {
      toast.error("Failed to parse user session");
      return;
    }

    login(user, token);
    toast.success(`Welcome back, ${user.name}!`);

    if (redirectUrl) {
      router.push(redirectUrl);
      return;
    }

    // Role-based automatic redirect
    if (user.role === "ADMIN") {
      router.push("/admin");
    } else if (user.role === "COURIER") {
      router.push("/courier");
    } else {
      router.push("/dashboard");
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await apiClient.post("/auth/login", values);
      if (response.data?.success && response.data?.data?.accessToken) {
        handleLoginSuccess(response.data.data.accessToken);
      } else {
        toast.error(response.data?.message || "Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to login. Please check credentials.");
    }
  };

  // One-Click Demo Login Handler
  const handleDemoLogin = async (email: string, password: string, roleName: string) => {
    try {
      setLoadingRole(roleName);
      const response = await apiClient.post("/auth/login", { email, password });
      if (response.data?.success && response.data?.data?.accessToken) {
        handleLoginSuccess(response.data.data.accessToken);
      } else {
        toast.error("Demo login failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Demo login failed");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10 space-y-6">
      {/* Email / Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-9"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full gap-2 font-medium"
          disabled={isSubmitting || !!loadingRole}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
            </>
          ) : (
            "Sign In with Password"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-500 font-semibold tracking-wider">
            🚀 One-Click Role Demo Login (Mandatory)
          </span>
        </div>
      </div>

      {/* One-Click Role Demo Login Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Admin Demo */}
        <Card className="border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition-colors shadow-none">
          <CardContent className="p-3.5 flex flex-col justify-between h-full space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-md bg-purple-100 text-purple-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="border-purple-300 text-purple-700 text-[10px]">
                Admin
              </Badge>
            </div>
            <div>
              <p className="font-semibold text-xs text-slate-900">Operations Head</p>
              <p className="text-[11px] text-slate-500 font-mono truncate">admin@courier.com</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs border-purple-300 text-purple-700 hover:bg-purple-600 hover:text-white"
              disabled={!!loadingRole || isSubmitting}
              onClick={() => handleDemoLogin("admin@courier.com", "Admin@123456", "admin")}
            >
              {loadingRole === "admin" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Admin Demo"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Customer Demo */}
        <Card className="border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition-colors shadow-none">
          <CardContent className="p-3.5 flex flex-col justify-between h-full space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-md bg-blue-100 text-blue-700">
                <UserCheck className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700 text-[10px]">
                Customer
              </Badge>
            </div>
            <div>
              <p className="font-semibold text-xs text-slate-900">Merchant / Sender</p>
              <p className="text-[11px] text-slate-500 font-mono truncate">customer@demo.com</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
              disabled={!!loadingRole || isSubmitting}
              onClick={() => handleDemoLogin("customer@demo.com", "Password@123!", "customer")}
            >
              {loadingRole === "customer" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Customer Demo"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Courier Demo */}
        <Card className="border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 transition-colors shadow-none">
          <CardContent className="p-3.5 flex flex-col justify-between h-full space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                <Truck className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-[10px]">
                Courier
              </Badge>
            </div>
            <div>
              <p className="font-semibold text-xs text-slate-900">Delivery Rider</p>
              <p className="text-[11px] text-slate-500 font-mono truncate">courier@demo.com</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-600 hover:text-white"
              disabled={!!loadingRole || isSubmitting}
              onClick={() => handleDemoLogin("courier@demo.com", "Password@123!", "courier")}
            >
              {loadingRole === "courier" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Courier Demo"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs text-slate-500 pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:underline">
          Register as Customer
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
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
          Sign in to your account
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter your credentials or use the 1-Click Demo buttons below
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
