"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Truck,
  Mail,
  KeyRound,
  Lock,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sandboxOtp, setSandboxOtp] = useState("123456");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Step 1: Send OTP to Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address");
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post("/auth/forgot-password", { email });
      if (res.data?.success) {
        const returnedOtp = res.data?.data?.otp || "123456";
        setSandboxOtp(returnedOtp);
        toast.success(`6-Digit OTP dispatched for ${email}`);
        setStep(2);
      } else {
        toast.error(res.data?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      // In case user does not exist in DB or network error
      toast.error(err.response?.data?.message || "User not found or failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("OTP must be exactly 6 digits");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (res.data?.success) {
        setIsSuccess(true);
        toast.success("Password reset successfully! You can now sign in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(res.data?.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP. Please use code 123456 for demo accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Truck className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-950">
            Swift<span className="text-blue-600">Track</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          Reset your password
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
          {step === 1
            ? "Enter your registered email to receive a 6-digit confirmation code"
            : `Enter the 6-digit OTP code sent for ${email}`}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 border border-slate-200/90 rounded-3xl sm:px-10">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-950">Password Changed!</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Your new password has been verified. Redirecting you to login...
              </p>
              <Link href="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          ) : step === 1 ? (
            /* Step 1: Request OTP Form */
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Registered Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. customer@demo.com or your email"
                    className="pl-9 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Dispatching OTP...
                  </>
                ) : (
                  "Send 6-Digit OTP"
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Login
                </Link>
              </div>
            </form>
          ) : (
            /* Step 2: Enter OTP & New Password Form */
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Sandbox / Demo OTP Assistance Box */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-blue-900">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Sandbox / Demo OTP:
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(sandboxOtp || "123456")}
                    className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-300 hover:bg-blue-100 cursor-pointer shadow-2xs"
                  >
                    Click to Auto-Fill
                  </button>
                </div>
                <p className="text-[11px] text-blue-800 leading-snug">
                  If testing on demo accounts (<code className="font-mono font-bold">customer@demo.com</code>) or without live mail server, use code: <strong className="font-mono text-sm bg-white px-1.5 py-0.5 rounded-md border border-blue-200 text-blue-900">{sandboxOtp || "123456"}</strong>.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-xs">6-Digit Verification OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="pl-9 font-mono tracking-widest text-lg font-extrabold text-center text-slate-950"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim())}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Min 8 characters (e.g. NewPass@123!)"
                    className="pl-9 font-medium"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat new password"
                    className="pl-9 font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating Password...
                  </>
                ) : (
                  "Update Password & Sign In"
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  ← Change email or re-send OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
