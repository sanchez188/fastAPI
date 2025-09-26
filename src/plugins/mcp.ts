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

// 🎯 Definiciones de herramientas MCP
const TOOLS_DEFINITIONS = [
  {
    name: "consulta_mesero",
    description:
      "Consulta general al asistente de Fast API - Responde temas del servidor y API",
    inputSchema: {
      type: "object",
      properties: {
        pregunta: {
          type: "string",
          description:
            "Pregunta o consulta sobre el servidor, API, endpoints o información general de Fast API",
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
    name: "get_restaurant_info",
    description:
      "Obtener información del restaurante (horarios, ubicación, etc.)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
] as const;

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

          case "get_restaurant_info":
            return meseroTools.getRestaurantInfo();

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
