"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Mail, KeyRound, Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
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
        toast.success(`6-Digit OTP sent to ${email}`);
        setStep(2);
      } else {
        toast.error(res.data?.message || "Failed to send OTP");
      }
    } catch (err: any) {
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
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(res.data?.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
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
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            Swift<span className="text-blue-600">Track</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Reset your password
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {step === 1
            ? "Enter your email to receive a 6-digit verification code"
            : `Enter the 6-digit OTP sent to ${email}`}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900">Password Changed!</h3>
              <p className="text-sm text-slate-600">
                You can now log in with your new credentials.
              </p>
              <Link href="/login">
                <Button className="w-full">Proceed to Sign In</Button>
              </Link>
            </div>
          ) : step === 1 ? (
            /* Step 1: Request OTP Form */
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Registered Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending OTP...
                  </>
                ) : (
                  "Send 6-Digit OTP"
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
          ) : (
            /* Step 2: Enter OTP & New Password Form */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="otp">6-Digit Verification OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="pl-9 font-mono tracking-widest text-lg font-bold text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim())}
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500">Check your Gmail inbox or spam folder.</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Min 8 characters"
                    className="pl-9"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat new password"
                    className="pl-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Resetting Password...
                  </>
                ) : (
                  "Update Password & Sign In"
                )}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Change email or re-send OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
