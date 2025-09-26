// 🛒 Herramientas MCP para Órdenes - Fastify Modular
import { orderService } from "../services/orders.js";
import { menuService } from "../services/menu.js";
import { RestaurantConfig } from "../config/restaurant.js";

export class OrderTools {
  static async crearOrden(args: any) {
    try {
      const { order, total, itemsDetail } = await orderService.crearOrden(args);

      // Devolver datos JSON sin formateo
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ order, total, itemsDetail }),
          },
        ],
      };
    } catch (error) {
      console.error("Error creando orden:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  }

  static async consultarOrdenesPorCedula(args: any) {
    try {
      const ordenes = await orderService.consultarOrdenesPorCedula(args.cedula);

      // Devolver datos JSON sin formateo
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(ordenes),
          },
        ],
      };
    } catch (error) {
      console.error("Error consultando órdenes:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  }

  static async cancelarPorCedula(args: any) {
    try {
      const scope = args.scope || "ultima";
      const { cancelled, orders } = await orderService.cancelarPorCedula(
        args.cedula,
        scope,
        args.motivo
      );

      // Devolver datos JSON sin formateo
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              cancelled,
              orders,
              scope,
              motivo: args.motivo,
            }),
          },
        ],
      };
    } catch (error) {
      console.error("Error cancelando órdenes:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  }
}

export const orderTools = OrderTools;
