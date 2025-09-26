// 🛒 Servicio de Órdenes - Fastify Modular
import { getSupabaseClient } from "../config/database.js";
import { menuService } from "./menu.js";
import { randomUUID } from "node:crypto";

export interface OrderItem {
  id_item: string;
  qty: number;
  nombre?: string;
}

export interface Order {
  id: string;
  cedula: string;
  telefono: string;
  nombre_cliente?: string | null;
  items: string; // JSON string in DB
  metodo_pago?: string;
  notas?: string | null;
  estado: string;
  created_at: string;
}

export class OrderService {
  private supabase: ReturnType<typeof getSupabaseClient> | null = null;

  private getSupabase() {
    if (!this.supabase) {
      this.supabase = getSupabaseClient();
    }
    return this.supabase;
  }

  async crearOrden(orderData: {
    cedula: string;
    telefono: string;
    nombre_cliente?: string;
    items: OrderItem[];
    metodo_pago?: string;
    notas?: string;
  }): Promise<{ order: Order; total: number; itemsDetail: string[] }> {
    const ordenId = randomUUID();

    const ordenRecord = {
      id: ordenId,
      cedula: orderData.cedula,
      telefono: orderData.telefono,
      nombre_cliente: orderData.nombre_cliente || null,
      items: JSON.stringify(orderData.items),
      metodo_pago: orderData.metodo_pago || "Efectivo",
      notas: orderData.notas || null,
      estado: "pendiente",
    };

    const { error } = await this.getSupabase()
      .from("ordenes")
      .insert(ordenRecord);

    if (error) {
      console.error("Error creando orden:", error);
      throw error;
    }

    // Calcular detalles y total
    let total = 0;
    const itemsDetail = [];

    for (const item of orderData.items) {
      const menuItem = await menuService.obtenerItemPorId(item.id_item);
      if (menuItem) {
        const subtotal = menuItem.precio * item.qty;
        total += subtotal;
        itemsDetail.push(
          `• ${item.qty}x ${menuItem.nombre} - ₡${subtotal.toLocaleString()}`
        );
      }
    }

    return {
      order: { ...ordenRecord, created_at: new Date().toISOString() },
      total,
      itemsDetail,
    };
  }

  async consultarOrdenesPorCedula(cedula: string): Promise<Order[]> {
    const { data: ordenes, error } = await this.getSupabase()
      .from("ordenes")
      .select("*")
      .eq("cedula", cedula)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error consultando órdenes:", error);
      throw error;
    }

    return ordenes || [];
  }

  async cancelarPorCedula(
    cedula: string,
    scope: "ultima" | "todas" = "ultima",
    motivo?: string
  ): Promise<{ cancelled: number; orders: Order[] }> {
    if (scope === "ultima") {
      const { data: ultimaOrden, error: errorUltima } = await this.getSupabase()
        .from("ordenes")
        .select("*")
        .eq("cedula", cedula)
        .eq("estado", "pendiente")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (errorUltima || !ultimaOrden) {
        return { cancelled: 0, orders: [] };
      }

      const motivoText = motivo ? ` | CANCELADO: ${motivo}` : " | CANCELADO";
      const nuevasNotas = (ultimaOrden.notas || "") + motivoText;

      const { error } = await this.getSupabase()
        .from("ordenes")
        .update({
          estado: "cancelado",
          notas: nuevasNotas,
        })
        .eq("id", ultimaOrden.id);

      if (error) throw error;

      return { cancelled: 1, orders: [ultimaOrden] };
    } else {
      const { data: ordenes, error: errorConsulta } = await this.getSupabase()
        .from("ordenes")
        .select("*")
        .eq("cedula", cedula)
        .eq("estado", "pendiente");

      if (errorConsulta || !ordenes || ordenes.length === 0) {
        return { cancelled: 0, orders: [] };
      }

      const { error } = await this.getSupabase()
        .from("ordenes")
        .update({
          estado: "cancelado",
          notas: motivo ? `CANCELADO: ${motivo}` : "CANCELADO",
        })
        .eq("cedula", cedula)
        .eq("estado", "pendiente");

      if (error) throw error;

      return { cancelled: ordenes.length, orders: ordenes };
    }
  }
}

export const orderService = new OrderService();
