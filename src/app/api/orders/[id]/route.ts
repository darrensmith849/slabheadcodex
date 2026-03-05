import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/orders/store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const store = getOrderStore();
  const order = await store.getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    currency: order.currency,
    total: order.total,
    subtotal: order.subtotal,
    items: order.items,
    customer: {
      fullName: order.customer.fullName,
      email: order.customer.email,
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  });
}
