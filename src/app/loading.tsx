import { Loader2, Truck } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 animate-pulse">
          <Truck className="h-8 w-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
          Loading SwiftTrack Logistics...
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Synchronizing linehaul manifest and session state
        </p>
      </div>
    </div>
  );
}
