import { randomUUID } from "node:crypto";
import type { Order } from "@/lib/orders/types";

type NewOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt"> & { id?: string };

export type OrderStore = {
  createOrder: (order: NewOrderInput) => Promise<Order>;
  getOrder: (id: string) => Promise<Order | null>;
  markPaid: (id: string, providerRef: string) => Promise<Order | null>;
  markCancelled: (id: string) => Promise<Order | null>;
};

export class InMemoryOrderStore implements OrderStore {
  private readonly orders = new Map<string, Order>();

  async createOrder(order: NewOrderInput): Promise<Order> {
    const now = new Date().toISOString();
    const id = order.id ?? randomUUID();
    const created: Order = {
      ...order,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, created);
    return created;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }

  async markPaid(id: string, providerRef: string): Promise<Order | null> {
    const current = this.orders.get(id);
    if (!current) return null;
    if (current.status === "PAID") return current;

    const updated: Order = {
      ...current,
      status: "PAID",
      providerRef,
      providerName: "payfast",
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, updated);
    return updated;
  }

  async markCancelled(id: string): Promise<Order | null> {
    const current = this.orders.get(id);
    if (!current) return null;
    if (current.status === "CANCELLED") return current;

    const updated: Order = {
      ...current,
      status: "CANCELLED",
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, updated);
    return updated;
  }
}

class PostgresOrderStore implements OrderStore {
  private schemaReady = false;
  private poolPromise: Promise<import("pg").Pool> | null = null;

  private async getPool() {
    if (!this.poolPromise) {
      this.poolPromise = import("pg").then(({ Pool }) => new Pool({ connectionString: process.env.DATABASE_URL }));
    }
    return this.poolPromise;
  }

  private async ensureSchema(pool: Awaited<ReturnType<PostgresOrderStore["getPool"]>>) {
    if (this.schemaReady) return;

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        currency TEXT NOT NULL,
        items JSONB NOT NULL,
        subtotal NUMERIC NOT NULL,
        total NUMERIC NOT NULL,
        customer JSONB NOT NULL,
        shipping_address JSONB NOT NULL,
        provider_ref TEXT,
        provider_name TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.schemaReady = true;
  }

  private mapRow(row: Record<string, unknown>): Order {
    return {
      id: String(row.id),
      status: String(row.status) as Order["status"],
      currency: String(row.currency) as Order["currency"],
      items: row.items as Order["items"],
      subtotal: Number(row.subtotal),
      total: Number(row.total),
      customer: row.customer as Order["customer"],
      shippingAddress: row.shipping_address as Order["shippingAddress"],
      providerRef: row.provider_ref ? String(row.provider_ref) : undefined,
      providerName: row.provider_name ? (String(row.provider_name) as Order["providerName"]) : undefined,
      createdAt: new Date(String(row.created_at)).toISOString(),
      updatedAt: new Date(String(row.updated_at)).toISOString(),
    };
  }

  async createOrder(order: NewOrderInput): Promise<Order> {
    const pool = await this.getPool();
    await this.ensureSchema(pool);

    const id = order.id ?? randomUUID();
    const result = await pool.query(
      `
      INSERT INTO orders (
        id, status, currency, items, subtotal, total, customer, shipping_address, provider_ref, provider_name
      ) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7::jsonb,$8::jsonb,$9,$10)
      RETURNING *
      `,
      [
        id,
        order.status,
        order.currency,
        JSON.stringify(order.items),
        order.subtotal,
        order.total,
        JSON.stringify(order.customer),
        JSON.stringify(order.shippingAddress),
        order.providerRef ?? null,
        order.providerName ?? null,
      ],
    );

    return this.mapRow(result.rows[0] as Record<string, unknown>);
  }

  async getOrder(id: string): Promise<Order | null> {
    const pool = await this.getPool();
    await this.ensureSchema(pool);

    const result = await pool.query(`SELECT * FROM orders WHERE id = $1`, [id]);
    if (result.rowCount === 0) return null;
    return this.mapRow(result.rows[0] as Record<string, unknown>);
  }

  async markPaid(id: string, providerRef: string): Promise<Order | null> {
    const pool = await this.getPool();
    await this.ensureSchema(pool);

    const result = await pool.query(
      `
      UPDATE orders
      SET status = CASE WHEN status = 'PAID' THEN status ELSE 'PAID' END,
          provider_ref = CASE WHEN provider_ref IS NULL THEN $2 ELSE provider_ref END,
          provider_name = CASE WHEN provider_name IS NULL THEN 'payfast' ELSE provider_name END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id, providerRef],
    );

    if (result.rowCount === 0) return null;
    return this.mapRow(result.rows[0] as Record<string, unknown>);
  }

  async markCancelled(id: string): Promise<Order | null> {
    const pool = await this.getPool();
    await this.ensureSchema(pool);

    const result = await pool.query(
      `
      UPDATE orders
      SET status = CASE WHEN status = 'PAID' THEN status ELSE 'CANCELLED' END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rowCount === 0) return null;
    return this.mapRow(result.rows[0] as Record<string, unknown>);
  }
}

const globalForOrders = globalThis as typeof globalThis & {
  __slabheadOrderStore?: OrderStore;
  __slabheadOrderStoreLogged?: boolean;
};

function createOrderStore(): OrderStore {
  if (process.env.DATABASE_URL) {
    return new PostgresOrderStore();
  }

  if (!globalForOrders.__slabheadOrderStoreLogged) {
    console.warn("[orders] DATABASE_URL not set. Falling back to InMemoryOrderStore (not for production).");
    globalForOrders.__slabheadOrderStoreLogged = true;
  }
  return new InMemoryOrderStore();
}

export function getOrderStore(): OrderStore {
  if (!globalForOrders.__slabheadOrderStore) {
    globalForOrders.__slabheadOrderStore = createOrderStore();
  }

  return globalForOrders.__slabheadOrderStore;
}
