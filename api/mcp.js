// MCP Endpoint específico para Vercel
import Fastify from "fastify";
import { config } from "dotenv";

// Configurar variables de entorno
config();

// Importar plugins modulares
import mcpPlugin from "../src/plugins/mcp.js";

// Crear instancia de Fastify específica para MCP
const fastify = Fastify({
  logger: false, // Desactivar logger en producción para Vercel
});

// Configurar solo el plugin MCP y el endpoint específico
async function setupMCPServer() {
  // Registrar CORS para MCP
  await fastify.register(import("@fastify/cors"), {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await fastify.register(import("@fastify/helmet"));

  // Registrar plugin MCP personalizado
  await fastify.register(mcpPlugin);

  // Registrar solo la ruta MCP en la raíz para este endpoint
  fastify.all("/", async (request, reply) => {
    // Redirigir a la lógica del MCP
    const mcpServer = fastify.mcpServer;
    
    if (!mcpServer) {
      throw new Error("Servidor MCP no disponible");
    }

    const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
    
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    // Configurar limpieza cuando la conexión se cierre
    reply.raw.on("close", () => {
      try {
        transport.close();
      } catch (e) {
        // Ignorar errores de limpieza
      }
    });

    try {
      await mcpServer.connect(transport);
      await transport.handleRequest(request.raw, reply.raw, request.body);
    } catch (error) {
      console.error("❌ Error en endpoint MCP:", error);
      
      if (!reply.sent) {
        reply.code(500).send({
          error: "Error interno del servidor MCP",
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }
  });

  return fastify;
}

// Handler para Vercel - endpoint /mcp
export default async function handler(req, res) {
  const server = await setupMCPServer();
  await server.ready();
  server.server.emit('request', req, res);
}