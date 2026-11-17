export type Role = "ADMIN" | "CUSTOMER" | "COURIER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type ShipmentStatus =
  | "PENDING"
  | "PICKUP_ASSIGNED"
  | "PICKED_UP"
  | "IN_HUB_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  phone?: string | null;
  avatarUrl?: string | null;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  customer?: CustomerProfile | null;
  courierProfile?: CourierProfile | null;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  defaultAddress?: string | null;
  city?: string | null;
  district?: string | null;
  postalCode?: string | null;
  alternatePhone?: string | null;
}

export interface CourierProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  vehicleType: string;
  licenseNumber: string;
  zone: string;
  activeDeliveries: number;
  maxCapacity: number;
  isAvailable: boolean;
  rating?: number | null;
  contactNumber: string;
}

export interface Hub {
  id: string;
  name: string;
  address: string;
  zone: string;
  contactNo: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShipmentLog {
  id: string;
  shipmentId: string;
  performedByUserId: string;
  fromStatus: string;
  toStatus: string;
  note?: string | null;
  createdAt: string;
  performedBy?: {
    name: string;
    email: string;
    role: Role;
  };
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderId: string;
  courierId?: string | null;
  hubId: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  destinationZone: string;
  weight: number;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  volumetricWeight?: number | null;
  chargeableWeight: number;
  price: number;
  isFragile: boolean;
  status: ShipmentStatus;
  paymentStatus: PaymentStatus;
  deliveryOtp?: string | null;
  estimatedDeliveryDate?: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  courier?: User | null;
  hub?: Hub;
  logs?: ShipmentLog[];
}

export interface Payment {
  id: string;
  shipmentId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  createdAt: string;
  updatedAt: string;
  shipment?: Shipment;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
}

export interface PriceCalculationResult {
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  baseFare: number;
  weightSurcharge: number;
  fragileSurcharge: number;
  totalPrice: number;
}
