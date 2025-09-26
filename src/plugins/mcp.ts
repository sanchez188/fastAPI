// 🔌 Plugin MCP para Fastify - Verdadera Modularidad
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
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
      "Consulta general al mesero - Responde solo temas del restaurante y menú",
    inputSchema: {
      type: "object",
      properties: {
        pregunta: {
          type: "string",
          description:
            "Pregunta o consulta sobre los restaurantes, menú, pedidos o información general",
        },
      },
      required: ["pregunta"],
    },
  },
  {
    name: "buscar_menu",
    description:
      "Buscar items del menú por sección, tags o texto, siempre muestre descripcion, precio y no muestre etiquetas ni ids, con solo dos bullet points",
    inputSchema: {
      type: "object",
      properties: {
        seccion: { type: "string", description: "Categoría del menú" },
        filtro_tags: {
          type: "string",
          description: "Tags separados por comas (ej: vegetariano,picante)",
        },
        texto: {
          type: "string",
          description: "Buscar por nombre o descripción",
        },
        restaurant_name: {
          type: "string",
          description:
            "Nombre exacto del restaurante para filtrar menú por restaurante",
        },
      },
    },
  },
  {
    name: "crear_orden",
    description: "Crear una nueva orden de pedido",
    inputSchema: {
      type: "object",
      properties: {
        cedula: {
          type: "string",
          description: "Cédula del cliente (formato: 1-1234-5678)",
        },
        telefono: { type: "string", description: "Teléfono del cliente" },
        nombre_cliente: {
          type: "string",
          description: "Nombre completo del cliente",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id_item: { type: "string" },
              qty: { type: "integer" },
              nombre: { type: "string" },
            },
            required: ["id_item", "qty"],
          },
        },
        metodo_pago: { type: "string", description: "Efectivo o Tarjeta" },
        notas: { type: "string", description: "Notas adicionales" },
      },
      required: ["cedula", "telefono", "items"],
    },
  },
  {
    name: "consultar_ordenes_por_cedula",
    description: "Consultar órdenes existentes por cédula",
    inputSchema: {
      type: "object",
      properties: {
        cedula: { type: "string", description: "Cédula del cliente" },
      },
      required: ["cedula"],
    },
  },
  {
    name: "cancelar_por_cedula",
    description: "Cancelar órdenes por cédula",
    inputSchema: {
      type: "object",
      properties: {
        cedula: { type: "string" },
        scope: { type: "string", enum: ["ultima", "todas"], default: "ultima" },
        motivo: { type: "string", description: "Motivo de cancelación" },
      },
      required: ["cedula"],
    },
  },
  {
    name: "search",
    description:
      "Buscar contenido en la base de datos del servidor. Devuelve una lista de resultados relevantes",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Término de búsqueda para encontrar contenido relevante",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "fetch",
    description:
      "Obtener el contenido completo de un documento o item específico usando su ID único",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "ID único del documento o item a obtener",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "consultar_restaurantes",
    description:
      "Consultar restaurantes en la base de datos con filtros opcionales como nombre, calificación, métodos de pago, etc.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Buscar por nombre del restaurante (búsqueda parcial)",
        },
        category_name: {
          type: "string",
          description: "Filtrar por nombre de categoría específica",
        },
        rating_min: {
          type: "number",
          description: "Calificación mínima (0-5)",
        },
        rating_max: {
          type: "number",
          description: "Calificación máxima (0-5)",
        },
        payment_method: {
          type: "string",
          description: "Filtrar por método de pago específico",
        },
        service_mode: {
          type: "string",
          description: "Filtrar por modo de servicio específico",
        },
        restaurant_id: {
          type: "string",
          description: "Obtener un restaurante específico por su ID único",
        },
        limit: {
          type: "number",
          description: "Límite de resultados a devolver (por defecto 10)",
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
