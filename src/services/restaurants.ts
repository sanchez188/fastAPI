// 🏪 Servicio de Restaurantes - Consultas a Supabase
import { getSupabaseClient } from "../config/database.js";

export interface Restaurant {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  google_maps_url?: string;
  opening_hours?: string;
  payment_methods?: string[];
  service_modes?: string[];
  email?: string;
  rating?: number;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RestaurantQuery {
  name?: string;
  category_name?: string;
  rating_min?: number;
  rating_max?: number;
  payment_method?: string;
  service_mode?: string;
  limit?: number;
}

export class RestaurantService {
  private supabase = getSupabaseClient();

  // Consultar todos los restaurantes con filtros opcionales
  async getRestaurants(filters: RestaurantQuery = {}): Promise<{
    content: Array<{ type: string; text: string }>;
  }> {
    try {
      let query = this.supabase.from("restaurants").select(`
          id,
          name,
          phone,
          address,
          google_maps_url,
          opening_hours,
          payment_methods,
          service_modes,
          email,
          rating,
          created_at,
          updated_at,
          categories:category_id (
            name
          )
        `);

      // Aplicar filtros
      if (filters.name) {
        query = query.ilike("name", `%${filters.name}%`);
      }

      if (filters.category_name) {
        // Filtrar por nombre de categoría
        query = query.eq("categories.name", filters.category_name);
      }

      if (filters.rating_min !== undefined) {
        query = query.gte("rating", filters.rating_min);
      }

      if (filters.rating_max !== undefined) {
        query = query.lte("rating", filters.rating_max);
      }

      if (filters.payment_method) {
        query = query.contains("payment_methods", [filters.payment_method]);
      }

      if (filters.service_mode) {
        query = query.contains("service_modes", [filters.service_mode]);
      }

      // Limitar resultados (por defecto 10)
      const limit = filters.limit || 10;
      query = query.limit(limit);

      // Ordenar por rating descendente y nombre
      query = query.order("rating", { ascending: false }).order("name");

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error consultando restaurantes: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "🔍 No se encontraron restaurantes con los criterios especificados.",
            },
          ],
        };
      }

      // Formatear resultados
      const formattedResults = data.map((restaurant: any) => {
        const rating = restaurant.rating
          ? `⭐ ${restaurant.rating}/5`
          : "⭐ Sin calificación";
        const phone = restaurant.phone ? `📞 ${restaurant.phone}` : "";
        const address = restaurant.address ? `📍 ${restaurant.address}` : "";
        const hours = restaurant.opening_hours
          ? `🕐 ${restaurant.opening_hours}`
          : "";
        const payments =
          restaurant.payment_methods && restaurant.payment_methods.length > 0
            ? `💳 ${restaurant.payment_methods.join(", ")}`
            : "";
        const services =
          restaurant.service_modes && restaurant.service_modes.length > 0
            ? `🛎️ ${restaurant.service_modes.join(", ")}`
            : "";
        const email = restaurant.email ? `📧 ${restaurant.email}` : "";
        const mapsUrl = restaurant.google_maps_url
          ? `🗺️ ${restaurant.google_maps_url}`
          : "";
        const category = restaurant.categories?.name 
          ? `🏷️ ${restaurant.categories.name}` 
          : "";

        return `
🏪 **${restaurant.name}** ${rating}
${category}
${phone}
${address}
${hours}
${payments}
${services}
${email}
${mapsUrl}
🆔 ID: ${restaurant.id}
        `.trim();
      });

      const resultText = `
📋 **Restaurantes Encontrados** (${data.length} resultado${
        data.length !== 1 ? "s" : ""
      })

${formattedResults.join("\n\n---\n\n")}

💡 *Tip: Puedes usar filtros como nombre, calificación mínima/máxima, métodos de pago o modos de servicio para refinar tu búsqueda.*
      `.trim();

      return {
        content: [
          {
            type: "text",
            text: resultText,
          },
        ],
      };
    } catch (error) {
      console.error("❌ Error en getRestaurants:", error);
      return {
        content: [
          {
            type: "text",
            text: `❌ Error consultando restaurantes: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }

  // Obtener un restaurante específico por ID
  async getRestaurantById(id: string): Promise<{
    content: Array<{ type: string; text: string }>;
  }> {
    try {
      const { data, error } = await this.supabase
        .from("restaurants")
        .select(
          `
          id,
          name,
          phone,
          address,
          google_maps_url,
          opening_hours,
          payment_methods,
          service_modes,
          email,
          rating,
          created_at,
          updated_at,
          categories:category_id (
            name
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Error consultando restaurante: ${error.message}`);
      }

      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: `🔍 No se encontró un restaurante con el ID: ${id}`,
            },
          ],
        };
      }

      const restaurant = data as any;
      const rating = restaurant.rating
        ? `⭐ ${restaurant.rating}/5`
        : "⭐ Sin calificación";
      const category = restaurant.categories?.name 
        ? `🏷️ **Categoría:** ${restaurant.categories.name}` 
        : "";
      const phone = restaurant.phone
        ? `📞 **Teléfono:** ${restaurant.phone}`
        : "";
      const address = restaurant.address
        ? `📍 **Dirección:** ${restaurant.address}`
        : "";
      const hours = restaurant.opening_hours
        ? `🕐 **Horarios:** ${restaurant.opening_hours}`
        : "";
      const payments =
        restaurant.payment_methods && restaurant.payment_methods.length > 0
          ? `💳 **Métodos de Pago:** ${restaurant.payment_methods.join(", ")}`
          : "";
      const services =
        restaurant.service_modes && restaurant.service_modes.length > 0
          ? `🛎️ **Servicios:** ${restaurant.service_modes.join(", ")}`
          : "";
      const email = restaurant.email ? `📧 **Email:** ${restaurant.email}` : "";
      const mapsUrl = restaurant.google_maps_url
        ? `🗺️ **Google Maps:** ${restaurant.google_maps_url}`
        : "";
      const created = restaurant.created_at
        ? `📅 **Creado:** ${new Date(
            restaurant.created_at
          ).toLocaleDateString()}`
        : "";

      const resultText = `
🏪 **${restaurant.name}** ${rating}

${category}
${phone}
${address}
${hours}
${payments}
${services}
${email}
${mapsUrl}
${created}

🆔 **ID:** ${restaurant.id}
      `.trim();

      return {
        content: [
          {
            type: "text",
            text: resultText,
          },
        ],
      };
    } catch (error) {
      console.error("❌ Error en getRestaurantById:", error);
      return {
        content: [
          {
            type: "text",
            text: `❌ Error consultando restaurante: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
}

export const restaurantService = new RestaurantService();
