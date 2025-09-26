// 🛒 Herramientas MCP para Órdenes - Fastify Modular
import { orderService } from "../services/orders.js";
import { menuService } from "../services/menu.js";
import { RestaurantConfig } from "../config/restaurant.js";

export class OrderTools {
  static async crearOrden(args: any) {
    try {
      const { order, total, itemsDetail } = await orderService.crearOrden(args);

      return {
        content: [
          {
            type: "text",
            text: `✅ ¡Perfecto! Tu orden ha sido creada exitosamente:

**📋 Orden #${order.id.slice(0, 8)}**
👤 **Cliente:** ${args.nombre_cliente || "No especificado"} 
📞 **Teléfono:** ${args.telefono}
🪪 **Cédula:** ${args.cedula}

**🍣 Items pedidos:**
${itemsDetail.join("\n")}

**💰 Total:** ₡${total.toLocaleString()}
**💳 Método de pago:** ${args.metodo_pago || "Efectivo"}
${args.notas ? `**📝 Notas:** ${args.notas}` : ""}

¡Gracias por tu pedido! Estamos preparándolo con mucho cariño. ¿Necesitas algo más? 😊`,
          },
        ],
      };
    } catch (error) {
      console.error("Error creando orden:", error);
      return {
        content: [
          {
            type: "text",
            text: `❌ Lo siento, hubo un problema al crear tu orden. Por favor intenta de nuevo o contacta directamente al ${RestaurantConfig.TELEFONO_RESTAURANTE}`,
          },
        ],
      };
    }
  }

  static async consultarOrdenesPorCedula(args: any) {
    try {
      const ordenes = await orderService.consultarOrdenesPorCedula(args.cedula);

      if (!ordenes || ordenes.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `🔍 No encontré órdenes para la cédula ${args.cedula}. ¿Te gustaría hacer un nuevo pedido? 😊`,
            },
          ],
        };
      }

      let respuesta = `📋 **Órdenes encontradas para cédula ${args.cedula}:**\n\n`;

      for (const orden of ordenes) {
        const items = JSON.parse(orden.items);
        const fecha = new Date(orden.created_at).toLocaleDateString("es-CR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        respuesta += `**🍱 Orden #${orden.id.slice(0, 8)}**
📅 **Fecha:** ${fecha}
👤 **Cliente:** ${orden.nombre_cliente || "No especificado"}
📞 **Teléfono:** ${orden.telefono}
🚦 **Estado:** ${orden.estado.toUpperCase()}
💳 **Pago:** ${orden.metodo_pago}

**Items:**
`;

        let total = 0;
        for (const item of items) {
          const menuItem = await menuService.obtenerItemPorId(item.id_item);
          if (menuItem) {
            const subtotal = menuItem.precio * item.qty;
            total += subtotal;
            respuesta += `• ${item.qty}x ${
              menuItem.nombre
            } - ₡${subtotal.toLocaleString()}\n`;
          }
        }

        respuesta += `💰 **Total:** ₡${total.toLocaleString()}`;
        if (orden.notas) {
          respuesta += `\n📝 **Notas:** ${orden.notas}`;
        }
        respuesta += `\n\n---\n\n`;
      }

      respuesta += `¿Necesitas ayuda con alguna de estas órdenes? 😊`;

      return {
        content: [
          {
            type: "text",
            text: respuesta,
          },
        ],
      };
    } catch (error) {
      console.error("Error consultando órdenes:", error);
      return {
        content: [
          {
            type: "text",
            text: "❌ Hubo un problema al consultar las órdenes. Inténtalo de nuevo.",
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

      if (cancelled === 0) {
        return {
          content: [
            {
              type: "text",
              text: `🔍 No encontré órdenes pendientes para la cédula ${args.cedula} que se puedan cancelar.`,
            },
          ],
        };
      }

      if (scope === "ultima") {
        return {
          content: [
            {
              type: "text",
              text: `✅ La orden #${orders[0].id.slice(
                0,
                8
              )} ha sido cancelada exitosamente.
              
${args.motivo ? `**Motivo:** ${args.motivo}` : ""}

¿Hay algo más en lo que te pueda ayudar? 😊`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `✅ Se han cancelado ${cancelled} orden(es) para la cédula ${
                args.cedula
              }.

${args.motivo ? `**Motivo:** ${args.motivo}` : ""}

¿Te gustaría hacer una nueva orden? 😊`,
            },
          ],
        };
      }
    } catch (error) {
      console.error("Error cancelando órdenes:", error);
      return {
        content: [
          {
            type: "text",
            text: "❌ Hubo un problema al cancelar las órdenes. Inténtalo de nuevo.",
          },
        ],
      };
    }
  }
}

export const orderTools = OrderTools;
