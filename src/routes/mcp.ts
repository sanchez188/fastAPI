// 🛣️ Ruta MCP Principal - Fastify Modular
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export default async function mcpRoute(fastify: FastifyInstance) {
  fastify.all("/mcp", async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("🍣 Procesando solicitud MCP...");

    try {
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

      // Obtener el servidor MCP del plugin
      const mcpServer = (fastify as any).mcpServer;

      if (!mcpServer) {
        throw new Error("Servidor MCP no disponible");
      }

      await mcpServer.connect(transport);
      await transport.handleRequest(request.raw, reply.raw, request.body);
    } catch (error) {
      console.error("❌ Error en ruta MCP:", error);

      if (!reply.sent) {
        reply.code(500).send({
          error: "Error interno del servidor MCP",
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }
  });
}
