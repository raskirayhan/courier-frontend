import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageX, Home, Search, Truck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-inner">
          <PackageX className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
            HTTP 404 • ROUTE UNREACHABLE
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Consignment Route Not Found
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            The page or tracking waypoint you are looking for does not exist in our regional linehaul manifest.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 text-xs">
              <Home className="h-4 w-4" /> Go to Home
            </Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button variant="outline" className="w-full font-bold text-slate-800 text-xs gap-2">
              <Truck className="h-4 w-4" /> Portal Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
