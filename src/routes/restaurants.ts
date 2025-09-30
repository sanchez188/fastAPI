// 🍽️ Rutas de Restaurantes - Endpoints REST para gestión de restaurantes
import { FastifyInstance } from "fastify";
import { geolocationService } from "../services/geolocation.js";
import { restaurantService } from "../services/restaurants.js";

export default async function restaurantRoutes(fastify: FastifyInstance) {
  
  // 🌍 GET /api/restaurants/nearby - Buscar restaurantes cercanos
  fastify.get("/nearby", {
    schema: {
      description: "Busca restaurantes cercanos a una ubicación específica",
      tags: ["Restaurantes"],
      querystring: {
        type: "object",
        properties: {
          latitude: {
            type: "number",
            minimum: -90,
            maximum: 90,
            description: "Latitud de la ubicación (ej: 9.9281)",
          },
          longitude: {
            type: "number",
            minimum: -180,
            maximum: 180,
            description: "Longitud de la ubicación (ej: -84.0907)",
          },
          radius_km: {
            type: "number",
            minimum: 0.1,
            maximum: 100,
            default: 10,
            description: "Radio de búsqueda en kilómetros",
          },
          limit: {
            type: "number",
            minimum: 1,
            maximum: 50,
            default: 20,
            description: "Número máximo de restaurantes a devolver",
          },
        },
        required: ["latitude", "longitude"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "object",
              properties: {
                total_encontrados: { type: "number" },
                radio_busqueda_km: { type: "number" },
                ubicacion_usuario: {
                  type: "object",
                  properties: {
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                  },
                },
                restaurantes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      nombre: { type: "string" },
                      categoria: { type: "string" },
                      descripcion: { type: "string" },
                      direccion: { type: "string" },
                      telefono: { type: "string" },
                      distance_km: { type: "number" },
                      calificacion: { type: "number" },
                      latitude: { type: "number" },
                      longitude: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { latitude, longitude, radius_km = 10, limit = 20 } = request.query as {
        latitude: number;
        longitude: number;
        radius_km?: number;
        limit?: number;
      };

      const restaurants = await geolocationService.getNearbyRestaurants({
        latitude,
        longitude,
        radius_km,
        limit,
      });

      return reply.send({
        success: true,
        data: {
          total_encontrados: restaurants.length,
          radio_busqueda_km: radius_km,
          ubicacion_usuario: {
            latitude,
            longitude,
          },
          restaurantes: restaurants,
        },
      });
    } catch (error) {
      console.error("Error en endpoint nearby:", error);
      return reply.status(400).send({
        success: false,
        error: "GEOLOCATION_ERROR",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  });

  // 📋 GET /api/restaurants - Listar restaurantes con filtros
  fastify.get("/", {
    schema: {
      description: "Lista restaurantes con filtros opcionales",
      tags: ["Restaurantes"],
      querystring: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nombre parcial del restaurante" },
          category_name: { type: "string", description: "Nombre de la categoría" },
          rating_min: { type: "number", description: "Calificación mínima" },
          rating_max: { type: "number", description: "Calificación máxima" },
          payment_method: { type: "string", description: "Método de pago" },
          service_mode: { type: "string", description: "Modo de servicio" },
          limit: { type: "number", description: "Límite de resultados" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array" },
          },
        },
        500: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const filters = request.query as any;
      const result = await restaurantService.getRestaurants(filters);
      
      // Parsear el resultado si viene como JSON string
      let restaurants = result.content?.[0]?.text;
      if (typeof restaurants === "string") {
        restaurants = JSON.parse(restaurants);
      }

      return reply.send({
        success: true,
        data: restaurants || [],
      });
    } catch (error) {
      console.error("Error en endpoint restaurants:", error);
      return reply.status(500).send({
        success: false,
        error: "DATABASE_ERROR",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  });

  // 🔍 GET /api/restaurants/:id - Obtener restaurante por ID
  fastify.get("/:id", {
    schema: {
      description: "Obtiene un restaurante específico por su ID",
      tags: ["Restaurantes"],
      params: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID del restaurante" },
        },
        required: ["id"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "object" },
          },
        },
        404: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
            message: { type: "string" },
          },
        },
        500: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await restaurantService.getRestaurantById(id);
      
      // Parsear el resultado si viene como JSON string
      let restaurant = result.content?.[0]?.text;
      if (typeof restaurant === "string") {
        restaurant = JSON.parse(restaurant);
      }

      if (!restaurant) {
        return reply.status(404).send({
          success: false,
          error: "RESTAURANT_NOT_FOUND",
          message: `No se encontró el restaurante con ID: ${id}`,
        });
      }

      return reply.send({
        success: true,
        data: restaurant,
      });
    } catch (error) {
      console.error("Error en endpoint restaurant by id:", error);
      return reply.status(500).send({
        success: false,
        error: "DATABASE_ERROR",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  });
}