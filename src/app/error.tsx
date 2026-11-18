"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home, Truck } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global route runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-inner">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Unexpected System Disruption
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our logistics dispatcher encountered an unexpected error processing this view. You can reload the route or return home.
          </p>
          {error.message && (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-mono text-red-700 text-left overflow-x-auto max-h-24">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 text-xs"
          >
            <RotateCcw className="h-4 w-4" /> Try Again
          </Button>

          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full font-bold text-slate-800 text-xs gap-2"
            >
              <Home className="h-4 w-4" /> Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
