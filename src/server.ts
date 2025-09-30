// 🚀 Servidor Principal Fastify - Verdadera Modularidad
import Fastify from "fastify";
import { config } from "dotenv";

// Configurar variables de entorno
config();

// Importar plugins modulares
import mcpPlugin from "./plugins/mcp.js";

// Importar rutas modulares
import mcpRoute from "./routes/mcp.js";
import healthRoute from "./routes/health.js";
import restaurantRoutes from "./routes/restaurants.js";

const fastify = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  },
});

async function startServer() {
  try {
    // Registrar plugins
    await fastify.register(import("@fastify/cors"), {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });

    await fastify.register(import("@fastify/helmet"));

    // Registrar plugin MCP personalizado
    await fastify.register(mcpPlugin);

    // Registrar rutas modulares
    await fastify.register(healthRoute);
    await fastify.register(mcpRoute);
    await fastify.register(restaurantRoutes, { prefix: "/api/restaurants" });

    // Configurar puerto
    const port = parseInt(process.env.PORT || "3000");
    const host = process.env.HOST || "0.0.0.0";

    // Iniciar servidor
    await fastify.listen({ port, host });

    console.log(`
🎉 ¡Fast API Server iniciado exitosamente!

🌐 URL: http://localhost:${port}
📡 Endpoint MCP: http://localhost:${port}/mcp
🩺 Health Check: http://localhost:${port}/health

⚡ Fast API v3.0.0 - Powered by Fastify!
    `);
  } catch (err) {
    console.error("❌ Error iniciando servidor:", err);
    process.exit(1);
  }
}

// Manejo de señales de cierre
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n🛑 Recibida señal ${signal}, cerrando servidor...`);
    try {
      await fastify.close();
      console.log("✅ Servidor cerrado correctamente");
      process.exit(0);
    } catch (err) {
      console.error("❌ Error cerrando servidor:", err);
      process.exit(1);
    }
  });
});

// Iniciar servidor si es el archivo principal
if (process.argv[1] && process.argv[1].includes("server.js")) {
  startServer();
}

export default fastify;
