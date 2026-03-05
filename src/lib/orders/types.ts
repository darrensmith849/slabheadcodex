export type OrderStatus = "CREATED" | "PAYMENT_PENDING" | "PAID" | "CANCELLED" | "FAILED";

export type OrderItem = {
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
};

export type CustomerDetails = {
  fullName: string;
  email: string;
  phone?: string;
};

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  currency: "ZAR";
  items: OrderItem[];
  subtotal: number;
  total: number;
  customer: CustomerDetails;
  shippingAddress: ShippingAddress;
  providerRef?: string;
  providerName?: "payfast";
  createdAt: string;
  updatedAt: string;
};
