// 🌍 Servicio de Geolocalización - Cálculo de distancias con Haversine
import { getSupabaseClient } from "../config/database.js";

interface RestaurantWithDistance {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  horario_atencion?: string;
  metodos_pago?: string[];
  modos_servicio?: string[];
  calificacion?: number;
  activo: boolean;
  latitude: number;
  longitude: number;
  distance_km: number;
}

interface NearbyRestaurantsParams {
  latitude: number;
  longitude: number;
  radius_km?: number;
  limit?: number;
}

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 * @param lat1 Latitud del punto 1
 * @param lon1 Longitud del punto 1
 * @param lat2 Latitud del punto 2
 * @param lon2 Longitud del punto 2
 * @returns Distancia en kilómetros
 */
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Redondear a 2 decimales
}

/**
 * Busca restaurantes cercanos a una ubicación específica
 */
async function getNearbyRestaurants({
  latitude,
  longitude,
  radius_km = 10,
  limit = 20,
}: NearbyRestaurantsParams): Promise<RestaurantWithDistance[]> {
  try {
    // Validar coordenadas
    if (latitude < -90 || latitude > 90) {
      throw new Error("Latitud debe estar entre -90 y 90 grados");
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error("Longitud debe estar entre -180 y 180 grados");
    }
    if (radius_km < 0.1 || radius_km > 100) {
      throw new Error("Radio debe estar entre 0.1 y 100 kilómetros");
    }
    if (limit < 1 || limit > 50) {
      throw new Error("Límite debe estar entre 1 y 50 restaurantes");
    }

    // Obtener todos los restaurantes activos con coordenadas
    const supabase = getSupabaseClient();
    const { data: restaurants, error } = await supabase
      .from("restaurants")
      .select(
        `
        id,
        nombre,
        descripcion,
        direccion,
        telefono,
        horario_atencion,
        metodos_pago,
        modos_servicio,
        calificacion,
        activo,
        latitude,
        longitude,
        categories!inner(nombre)
      `
      )
      .eq("activo", true)
      .not("latitude", "is", null)
      .not("longitude", "is", null);

    if (error) {
      throw new Error(`Error consultando restaurantes: ${error.message}`);
    }

    if (!restaurants || restaurants.length === 0) {
      return [];
    }

    // Calcular distancias y filtrar por radio
    const restaurantsWithDistance: RestaurantWithDistance[] = restaurants
      .map((restaurant: any) => {
        const distance = calculateHaversineDistance(
          latitude,
          longitude,
          restaurant.latitude,
          restaurant.longitude
        );

        return {
          id: restaurant.id,
          nombre: restaurant.nombre,
          categoria: restaurant.categories?.nombre || "Sin categoría",
          descripcion: restaurant.descripcion,
          direccion: restaurant.direccion,
          telefono: restaurant.telefono,
          horario_atencion: restaurant.horario_atencion,
          metodos_pago: restaurant.metodos_pago || [],
          modos_servicio: restaurant.modos_servicio || [],
          calificacion: restaurant.calificacion,
          activo: restaurant.activo,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          distance_km: distance,
        };
      })
      .filter(
        (restaurant: RestaurantWithDistance) =>
          restaurant.distance_km <= radius_km
      )
      .sort(
        (a: RestaurantWithDistance, b: RestaurantWithDistance) =>
          a.distance_km - b.distance_km
      )
      .slice(0, limit);

    return restaurantsWithDistance;
  } catch (error) {
    console.error("Error en getNearbyRestaurants:", error);
    throw error;
  }
}

/**
 * Busca restaurantes cercanos y retorna el resultado en formato JSON string
 * (Para compatibilidad con herramientas MCP)
 */
async function getNearbyRestaurantsForMCP(
  params: NearbyRestaurantsParams
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const restaurants = await getNearbyRestaurants(params);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            total_encontrados: restaurants.length,
            radio_busqueda_km: params.radius_km || 10,
            ubicacion_usuario: {
              latitude: params.latitude,
              longitude: params.longitude,
            },
            restaurantes: restaurants,
          }),
        },
      ],
    };
  } catch (error) {
    throw new Error(
      `Error buscando restaurantes cercanos: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export const geolocationService = {
  getNearbyRestaurants,
  getNearbyRestaurantsForMCP,
  calculateHaversineDistance,
};
