"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TrackingSearchBar() {
  const [trackingId, setTrackingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackingId.trim();
    if (!cleanId) {
      toast.error("Please enter a tracking number");
      return;
    }

    setIsSubmitting(true);
    router.push(`/track/${cleanId}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Enter tracking number (e.g. TRK-2026-100234)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="pl-10 h-12 text-base rounded-xl border-slate-300 shadow-md font-mono"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-12 px-6 rounded-xl font-semibold gap-2 shadow-md shadow-blue-600/20 bg-blue-600 hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        Track Parcel
      </Button>
    </form>
  );
}
