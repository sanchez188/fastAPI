// 🍽️ Herramientas MCP para Menú - Fastify Modular
import { menuService } from "../services/menu.js";
import { RestaurantConfig } from "../config/restaurant.js";

export class MenuTools {
  static async buscarMenu(args: any) {
    try {
      let items;
      // Si se envía restaurant_name, buscar el restaurante y filtrar por su id
      if (args.restaurant_name) {
        // Buscar restaurante por nombre exacto
        const supabase = require("../config/database.js").getSupabaseClient();
        const { data: restaurantes, error: errorRest } = await supabase
          .from("restaurants")
          .select("id")
          .eq("name", args.restaurant_name)
          .limit(1);
        if (errorRest) throw errorRest;
        if (!restaurantes || restaurantes.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify([]),
              },
            ],
          };
        }
        const restaurant_id = restaurantes[0].id;
        // Buscar platillos ligados a ese restaurante
        items = await menuService.buscarItems({ ...args, restaurant_id });
      } else {
        items = await menuService.buscarItems(args);
      }
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
