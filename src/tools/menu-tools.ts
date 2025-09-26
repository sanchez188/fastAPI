// 🍽️ Herramientas MCP para Menú - Fastify Modular
import { menuService } from "../services/menu.js";
import { RestaurantConfig } from "../config/restaurant.js";

export class MenuTools {
  static formatearMenuParaMesero(items: any[]): string {
    const categorias = new Map<string, any[]>();

    items.forEach((item) => {
      if (!categorias.has(item.categoria)) {
        categorias.set(item.categoria, []);
      }
      categorias.get(item.categoria)!.push(item);
    });

    let respuesta = `¡Claro! 😊 Aquí tienes nuestro menú:\n\n`;

    categorias.forEach((platillos, categoria) => {
      const emoji = MenuTools.obtenerEmojiCategoria(categoria);
      respuesta += `${emoji} **${categoria.toUpperCase()}**\n\n`;

      platillos.forEach((platillo) => {
        const tags = MenuTools.formatearTags(platillo.etiquetas);
        respuesta += MenuTools.formatearPlatillo(platillo, tags);
      });

      respuesta += `\n`;
    });

    respuesta += `¿Te gustaría hacer un pedido o necesitas más información sobre algún platillo? ¡Estoy aquí para ayudarte! 🍱`;
    return respuesta;
  }

  static formatearPlatillo(item: any, tags: string): string {
    return `**${item.nombre}** - ₡${item.precio.toLocaleString()} ${tags}
• ${item.descripcion}
• Perfecto para compartir y disfrutar

`;
  }

  static formatearTags(etiquetas?: string): string {
    if (!etiquetas) return "";

    const tagMap: Record<string, string> = {
      vegetariano: "🌱",
      picante: "🌶️",
      popular: "⭐",
      nuevo: "🆕",
      especial: "👨‍🍳",
      caliente: "🔥",
      frio: "❄️",
    };

    return etiquetas
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .map((tag) => tagMap[tag] || "")
      .filter(Boolean)
      .join(" ");
  }

  static obtenerEmojiCategoria(categoria: string): string {
    const lowerCategoria = categoria.toLowerCase();
    if (
      lowerCategoria.includes("entrada") ||
      lowerCategoria.includes("aperitivo")
    )
      return "🥢";
    if (lowerCategoria.includes("roll") || lowerCategoria.includes("maki"))
      return "🍣";
    if (lowerCategoria.includes("nigiri") || lowerCategoria.includes("sashimi"))
      return "🍱";
    if (lowerCategoria.includes("bebida") || lowerCategoria.includes("drink"))
      return "🥤";
    if (lowerCategoria.includes("postre")) return "🍮";
    return "🍽️";
  }

  static async buscarMenu(args: any) {
    try {
      const items = await menuService.buscarItems(args);

      // Devolver datos JSON sin formateo
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(items),
          },
        ],
      };
    } catch (error) {
      console.error("Error en MenuTools.buscarMenu:", error);
      return {
        content: [
          {
            type: "text",
            text: "❌ Lo siento, hubo un problema al consultar el menú. ¡Inténtalo de nuevo en un momento!",
          },
        ],
      };
    }
  }

  static esConsultaValidaRestaurante(pregunta: string): boolean {
    const preguntaLower = pregunta.toLowerCase();
    return RestaurantConfig.PALABRAS_CLAVE_RESTAURANTE.some((palabra) =>
      preguntaLower.includes(palabra.toLowerCase())
    );
  }
}

export const menuTools = MenuTools;
