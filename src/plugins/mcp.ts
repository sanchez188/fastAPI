// 🔌 Plugin MCP para Fastify - Verdadera Modularidad
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";

import { menuTools } from "../tools/menu-tools.js";
import { orderTools } from "../tools/order-tools.js";
import { meseroTools } from "../tools/mesero-tools.js";
import { restaurantService } from "../services/restaurants.js";

// 🎯 Definiciones de herramientas MCP
const TOOLS_DEFINITIONS = [
  {
    name: "consulta_mesero",
    description:
      "Realiza una consulta conversacional al asistente del restaurante. Envía una pregunta sobre horarios, ubicación, menú, pedidos o cualquier información general del restaurante. La respuesta será un texto informativo, útil para interacción natural con el usuario. Úsalo para obtener datos generales o resolver dudas frecuentes.",
    inputSchema: {
      type: "object",
      properties: {
        pregunta: {
          type: "string",
          description:
            "Pregunta en lenguaje natural sobre el restaurante, menú, pedidos, horarios, ubicación, contacto, etc. Ejemplo: '¿Cuál es el horario de atención?'",
        },
      },
      required: ["pregunta"],
    },
  },
  {
    name: "buscar_menu",
    description:
      "Busca platillos en el menú del restaurante. Permite filtrar por categoría (seccion), etiquetas (filtro_tags), texto libre (nombre o descripción) y por restaurante específico (restaurant_name). Si se envía restaurant_name, primero busca el restaurante por nombre exacto y luego devuelve solo los platillos asociados a ese restaurante. La respuesta es un array JSON de platillos, cada uno con nombre, descripción, precio, categoría y etiquetas. Úsalo para mostrar el menú filtrado en la app.",
    inputSchema: {
      type: "object",
      properties: {
        seccion: {
          type: "string",
          description:
            "Nombre de la categoría del menú para filtrar platillos (ej: 'Entrantes', 'Bebidas').",
        },
        filtro_tags: {
          type: "string",
          description:
            "Lista de etiquetas separadas por coma para filtrar platillos (ej: 'vegetariano,picante').",
        },
        texto: {
          type: "string",
          description:
            "Texto libre para buscar en nombre o descripción del platillo.",
        },
        restaurant_name: {
          type: "string",
          description:
            "Nombre exacto del restaurante para mostrar solo su menú. Si se envía, se ignoran platillos de otros restaurantes.",
        },
      },
    },
  },
  {
    name: "crear_orden",
    description:
      "Crea una nueva orden de pedido en el restaurante. Debes enviar la cédula, teléfono, nombre del cliente, lista de items (cada uno con id_item y cantidad), método de pago y notas opcionales. La respuesta es un JSON con la orden creada, el total y el detalle de los items. Úsalo para registrar pedidos y mostrar confirmación al usuario.",
    inputSchema: {
      type: "object",
      properties: {
        cedula: {
          type: "string",
          description:
            "Cédula del cliente (formato: 1-1234-5678) para asociar la orden.",
        },
        telefono: {
          type: "string",
          description: "Teléfono de contacto del cliente.",
        },
        nombre_cliente: {
          type: "string",
          description: "Nombre completo del cliente que realiza el pedido.",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id_item: {
                type: "string",
                description: "ID del platillo en el menú.",
              },
              qty: {
                type: "integer",
                description: "Cantidad solicitada de ese platillo.",
              },
              nombre: {
                type: "string",
                description:
                  "Nombre del platillo (opcional, solo informativo).",
              },
            },
            required: ["id_item", "qty"],
          },
        },
        metodo_pago: {
          type: "string",
          description: "Método de pago: 'Efectivo' o 'Tarjeta'.",
        },
        notas: {
          type: "string",
          description: "Notas adicionales para la orden (opcional).",
        },
      },
      required: ["cedula", "telefono", "items"],
    },
  },
  {
    name: "consultar_ordenes_por_cedula",
    description:
      "Consulta todas las órdenes asociadas a una cédula de cliente. Envía la cédula en formato 1-1234-5678. La respuesta es un array JSON con las órdenes encontradas, cada una con su estado, items, fecha y datos del cliente. Úsalo para mostrar historial de pedidos o verificar órdenes previas.",
    inputSchema: {
      type: "object",
      properties: {
        cedula: {
          type: "string",
          description: "Cédula del cliente para buscar sus órdenes.",
        },
      },
      required: ["cedula"],
    },
  },
  {
    name: "cancelar_por_cedula",
    description:
      "Cancela una o todas las órdenes asociadas a una cédula de cliente. Envía la cédula, el alcance ('ultima' para la más reciente, 'todas' para todas) y el motivo de cancelación. La respuesta es un JSON con el número de órdenes canceladas y el detalle de las órdenes afectadas. Úsalo para gestionar cancelaciones y mostrar confirmación al usuario.",
    inputSchema: {
      type: "object",
      properties: {
        cedula: {
          type: "string",
          description: "Cédula del cliente cuyas órdenes se desean cancelar.",
        },
        scope: {
          type: "string",
          enum: ["ultima", "todas"],
          default: "ultima",
          description:
            "Alcance de la cancelación: 'ultima' para la más reciente, 'todas' para todas las órdenes.",
        },
        motivo: {
          type: "string",
          description: "Motivo de la cancelación (opcional, informativo).",
        },
      },
      required: ["cedula"],
    },
  },
  {
    name: "search",
    description:
      "Realiza una búsqueda general en el servidor. Envía un término de búsqueda (query) y recibe una lista de resultados relevantes en formato JSON, que pueden incluir platillos, órdenes, información del restaurante, etc. Úsalo para encontrar cualquier contenido relacionado con el restaurante según el texto ingresado por el usuario.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Texto de búsqueda para encontrar cualquier contenido relevante en el sistema (menú, órdenes, info, etc.).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "fetch",
    description:
      "Obtiene el contenido completo de un documento, platillo, orden o cualquier item específico usando su ID único. Envía el parámetro 'id' y recibe el objeto JSON correspondiente. Úsalo para mostrar detalles completos de un elemento seleccionado por el usuario.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description:
            "ID único del documento, platillo, orden o item que se desea obtener en detalle.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "consultar_restaurantes",
    description:
      "Consulta restaurantes en la base de datos con múltiples filtros opcionales: nombre parcial, nombre de categoría, rango de calificación, método de pago, modo de servicio, ID específico y límite de resultados. La respuesta es un array JSON de restaurantes con todos sus datos relevantes. Úsalo para mostrar listados, buscar restaurantes por criterios o ver detalles de uno específico.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Nombre parcial del restaurante para búsqueda (ej: 'Pizza', 'Sushi').",
        },
        category_name: {
          type: "string",
          description:
            "Nombre de la categoría para filtrar restaurantes (ej: 'Mexicano', 'Italiano').",
        },
        rating_min: {
          type: "number",
          description: "Calificación mínima (0-5) para filtrar restaurantes.",
        },
        rating_max: {
          type: "number",
          description: "Calificación máxima (0-5) para filtrar restaurantes.",
        },
        payment_method: {
          type: "string",
          description:
            "Método de pago aceptado por el restaurante (ej: 'tarjeta', 'efectivo').",
        },
        service_mode: {
          type: "string",
          description:
            "Modo de servicio ofrecido (ej: 'para llevar', 'a domicilio').",
        },
        restaurant_id: {
          type: "string",
          description:
            "ID único del restaurante para obtener solo ese restaurante.",
        },
        limit: {
          type: "number",
          description:
            "Cantidad máxima de restaurantes a devolver (por defecto 10).",
        },
      },
    },
  },
] as const;

// Función para manejar búsquedas
async function handleSearch(query: string) {
  try {
    // Simular búsqueda en diferentes categorías
    const results = [];

    // Buscar en el menú
    const menuResults = await menuTools.buscarMenu({ texto: query });
    if (menuResults.content && menuResults.content[0]?.text) {
      results.push({
        id: `menu_search_${Date.now()}`,
        title: `Resultados de menú para: "${query}"`,
        url: "/menu/search",
        type: "menu",
      });
    }

    // Buscar información del restaurante
    if (
      query.toLowerCase().includes("restaurante") ||
      query.toLowerCase().includes("horario") ||
      query.toLowerCase().includes("ubicacion") ||
      query.toLowerCase().includes("telefono")
    ) {
      results.push({
        id: `restaurant_info_${Date.now()}`,
        title: "Información del Restaurante",
        url: "/restaurant/info",
        type: "info",
      });
    }

    // Buscar órdenes si la query parece una cédula
    if (query.match(/\d{1}-\d{4}-\d{4}/)) {
      results.push({
        id: `orders_${query.replace(/-/g, "")}`,
        title: `Órdenes para cédula: ${query}`,
        url: `/orders/${query}`,
        type: "orders",
      });
    }

    // Si no hay resultados específicos, hacer una búsqueda general
    if (results.length === 0) {
      results.push({
        id: `general_${Date.now()}`,
        title: `Búsqueda general: "${query}"`,
        url: `/search?q=${encodeURIComponent(query)}`,
        type: "general",
      });
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            results: results.map((r) => ({
              id: r.id,
              title: r.title,
              url: r.url,
            })),
          }),
        },
      ],
    };
  } catch (error) {
    throw new Error(
      `Error en búsqueda: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// Función para obtener contenido específico
async function handleFetch(id: string) {
  try {
    let content = "";
    let title = "";
    let url = "";
    let metadata = {};

    if (id.startsWith("menu_")) {
      // Obtener información completa del menú
      const menuData = await menuTools.buscarMenu({});
      content = menuData.content?.[0]?.text || "Menú no disponible";
      title = "Menú Completo del Restaurante";
      url = "/menu";
      metadata = {
        type: "menu",
        sections: ["entrantes", "principales", "postres", "bebidas"],
      };
    } else if (id.startsWith("restaurant_info")) {
      // Obtener información del restaurante
      const restaurantData = meseroTools.getRestaurantInfo();
      content =
        restaurantData.content?.[0]?.text || "Información no disponible";
      title = "Información del Restaurante";
      url = "/restaurant/info";
      metadata = {
        type: "restaurant_info",
        contact: true,
        hours: true,
        location: true,
      };
    } else if (id.startsWith("orders_")) {
      // Extraer cédula del ID
      const cedula = id
        .replace("orders_", "")
        .replace(/(\d{1})(\d{4})(\d{4})/, "$1-$2-$3");
      try {
        const orderData = await orderTools.consultarOrdenesPorCedula({
          cedula,
        });
        content =
          orderData.content?.[0]?.text ||
          `No se encontraron órdenes para ${cedula}`;
        title = `Órdenes de ${cedula}`;
        url = `/orders/${cedula}`;
        metadata = { type: "orders", cedula, searchable: true };
      } catch (error) {
        content = `Error al consultar órdenes: ${
          error instanceof Error ? error.message : String(error)
        }`;
        title = `Error - Órdenes de ${cedula}`;
        url = `/orders/${cedula}`;
        metadata = { type: "orders", cedula, error: true };
      }
    } else {
      // Documento genérico
      content = `Contenido del documento con ID: ${id}`;
      title = `Documento ${id}`;
      url = `/document/${id}`;
      metadata = { type: "document", id };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            id,
            title,
            text: content,
            url,
            metadata,
          }),
        },
      ],
    };
  } catch (error) {
    throw new Error(
      `Error al obtener documento: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

async function mcpPlugin(fastify: FastifyInstance) {
  // Crear servidor MCP
  const server = new Server(
    {
      name: "fast-api-assistant-fastify",
      version: "3.0.0-modular",
    },
    {
      capabilities: { tools: {} },
    }
  );

  // Configurar handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: TOOLS_DEFINITIONS,
    };
  });

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "consulta_mesero":
            if (!args) throw new Error("Se requiere una pregunta");
            return await meseroTools.consultaMesero(args);

          case "buscar_menu":
            return await menuTools.buscarMenu(args || {});

          case "crear_orden":
            if (!args)
              throw new Error("Argumentos requeridos para crear orden");
            return await orderTools.crearOrden(args);

          case "consultar_ordenes_por_cedula":
            if (!args)
              throw new Error("Argumentos requeridos para consultar órdenes");
            return await orderTools.consultarOrdenesPorCedula(args);

          case "cancelar_por_cedula":
            if (!args)
              throw new Error("Argumentos requeridos para cancelar órdenes");
            return await orderTools.cancelarPorCedula(args);

          case "search":
            if (!args || !(args as any).query)
              throw new Error("Se requiere un término de búsqueda");
            return await handleSearch((args as any).query);

          case "fetch":
            if (!args || !(args as any).id)
              throw new Error("Se requiere un ID de documento");
            return await handleFetch((args as any).id);

          case "consultar_restaurantes":
            const restaurantArgs = args as any;
            // Si se proporciona restaurant_id, obtener restaurante específico
            if (restaurantArgs?.restaurant_id) {
              return await restaurantService.getRestaurantById(
                restaurantArgs.restaurant_id
              );
            }
            // Sino, hacer búsqueda con filtros
            return await restaurantService.getRestaurants(restaurantArgs || {});

          default:
            throw new Error(`Herramienta desconocida: ${name}`);
        }
      } catch (error) {
        console.error(`❌ Error en herramienta ${name}:`, error);
        return {
          content: [
            {
              type: "text",
              text: `❌ Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  // Registrar el servidor MCP en fastify
  fastify.decorate("mcpServer", server);

  console.log("✅ Plugin MCP registrado correctamente");
}

export default fp(mcpPlugin, {
  name: "mcp-plugin",
});
