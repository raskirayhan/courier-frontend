"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MapPin,
  PlusCircle,
  Phone,
  Building2,
  Truck,
  CheckCircle2,
  Trash2,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function AdminHubsPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState("Dhaka North");
  const [contactNo, setContactNo] = useState("");

  // Fetch hubs
  const { data: hubsData, isLoading } = useQuery({
    queryKey: ["admin-hubs-management"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/hubs");
        return res.data?.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const hubs = hubsData || [];

  // Create Hub Form Submit
  const handleCreateHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !contactNo.trim()) {
      toast.error("Please fill all required hub fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.post("/hubs", {
        name: name.trim(),
        address: address.trim(),
        zone: zone.trim(),
        contactNo: contactNo.trim(),
      });

      if (res.data?.success) {
        toast.success(`Sorting Hub "${name}" successfully registered!`);
        queryClient.invalidateQueries({ queryKey: ["admin-hubs-management"] });
        queryClient.invalidateQueries({ queryKey: ["admin-overview-hubs"] });
        setIsAddModalOpen(false);
        setName("");
        setAddress("");
        setContactNo("");
      } else {
        toast.error(res.data?.message || "Failed to create hub");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Hub creation error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Regional Sorting Hubs & Linehaul Centers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Manage regional intake depots, cross-dock transit points, and coverage sectors.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" /> Add Sorting Hub
        </Button>
      </div>

      {/* Hubs Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-purple-600" /> Loading hub directory...
        </div>
      ) : hubs.length === 0 ? (
        <Card className="p-12 text-center border-slate-200">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-base">No hubs registered yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Click &quot;Add Sorting Hub&quot; above to create your first regional distribution node.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hubs.map((hub: any) => (
            <Card key={hub.id} className="border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-950">{hub.name}</CardTitle>
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-mono mt-0.5">
                        {hub.zone || "National Transit"}
                      </Badge>
                    </div>
                  </div>

                  <Badge variant="success" className="text-[10px] font-bold">
                    ACTIVE
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    Physical Address
                  </span>
                  <p className="text-slate-900 font-medium flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    {hub.address}
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    Direct Dispatch Hotline
                  </span>
                  <p className="text-slate-900 font-mono font-bold flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {hub.contactNo}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Linehaul Status: Operational</span>
                  <span className="text-emerald-600 font-bold">SLA: 99.8%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Hub Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="text-center space-y-1.5">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                Register New Regional Hub
              </h3>
              <p className="text-xs text-slate-600">
                Add a new distribution point to expand coverage across Bangladesh.
              </p>
            </div>

            <form onSubmit={handleCreateHub} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="hub-name" className="text-xs">Hub Name</Label>
                <Input
                  id="hub-name"
                  placeholder="e.g. Rajshahi Divisional Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="hub-zone" className="text-xs">Operating Zone</Label>
                <select
                  id="hub-zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Dhaka North">Dhaka North</option>
                  <option value="Dhaka South">Dhaka South</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="hub-addr" className="text-xs">Street Address</Label>
                <Input
                  id="hub-addr"
                  placeholder="e.g. Shaheb Bazar, Ghoramara, Rajshahi-6100"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="hub-contact" className="text-xs">Direct Hotline / Contact Phone</Label>
                <Input
                  id="hub-contact"
                  placeholder="e.g. +880 1711-223344"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 font-bold text-xs"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-1.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Hub...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Save Hub
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
