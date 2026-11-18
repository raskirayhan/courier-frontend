"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Sparkles, Navigation } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_TRACKING_CODES = [
  { code: "TRK-2026-100234", label: "Delivered", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { code: "TRK-2026-904821", label: "Out for Delivery", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { code: "TRK-2026-551029", label: "In Hub Transit", color: "bg-blue-50 text-blue-700 border-blue-200" },
];

export function TrackingSearchBar() {
  const [trackingId, setTrackingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent, codeToSearch?: string) => {
    if (e) e.preventDefault();
    const cleanId = (codeToSearch || trackingId).trim();
    if (!cleanId) {
      toast.error("Please enter a tracking number");
      return;
    }

    setIsSubmitting(true);
    router.push(`/track/${cleanId}`);
  };

  const handleQuickChipClick = (code: string) => {
    setTrackingId(code);
    setIsSubmitting(true);
    router.push(`/track/${code}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Search Input Box */}
      <form
        onSubmit={handleSearch}
        className="p-1.5 sm:p-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-blue-500/10 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
      >
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400 shrink-0" />
          <Input
            type="text"
            placeholder="Enter tracking number (e.g. TRK-2026-100234)..."
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="pl-12 h-12 text-sm sm:text-base border-none shadow-none font-mono focus-visible:ring-0 focus-visible:border-none text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 px-7 rounded-xl font-bold text-sm gap-2 shadow-md bg-blue-600 hover:bg-blue-700 text-white shrink-0 active:scale-95 transition-transform"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Tracking...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" /> Track Consignment
            </>
          )}
        </Button>
      </form>

      {/* Quick Click Sample Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Click to test sample:
        </span>
        {SAMPLE_TRACKING_CODES.map((sample) => (
          <button
            key={sample.code}
            type="button"
            onClick={() => handleQuickChipClick(sample.code)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs transition-all hover:scale-105 cursor-pointer shadow-2xs ${sample.color}`}
            title={`View sample tracking: ${sample.label}`}
          >
            <span className="font-bold">{sample.code}</span>
            <span className="text-[10px] opacity-75">({sample.label})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
