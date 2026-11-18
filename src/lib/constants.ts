export const BANGLADESH_ZONES = [
  "Dhaka North",
  "Dhaka South",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
] as const;

export const TARIFF_RATES = {
  INTRA_ZONE_BASE: 60,
  INTER_ZONE_BASE: 120,
  WEIGHT_SURCHARGE_PER_KG: 25,
  FRAGILE_SURCHARGE: 40,
  PRIORITY_EXPRESS_SURCHARGE: 80,
  VOLUMETRIC_DIVISOR: 5000,
} as const;

export const SHIPMENT_STATUS_CONFIG: Record<
  string,
  { label: string; badgeVariant: "default" | "success" | "warning" | "destructive" | "info" | "outline" }
> = {
  PENDING: { label: "Pending Approval", badgeVariant: "warning" },
  PICKUP_ASSIGNED: { label: "Pickup Assigned", badgeVariant: "info" },
  PICKED_UP: { label: "Picked Up", badgeVariant: "info" },
  IN_HUB_TRANSIT: { label: "In Hub Transit", badgeVariant: "default" },
  OUT_FOR_DELIVERY: { label: "Out For Delivery", badgeVariant: "warning" },
  DELIVERED: { label: "Delivered & Verified", badgeVariant: "success" },
  CANCELLED: { label: "Cancelled", badgeVariant: "destructive" },
};

export const FLEET_CAPACITIES = {
  MOTORCYCLE: { maxParcels: 10, label: "Motorcycle (Fast Express)" },
  VAN: { maxParcels: 35, label: "Delivery Van (Heavy Freight)" },
  TRUCK: { maxParcels: 120, label: "Highway Linehaul Truck" },
} as const;
