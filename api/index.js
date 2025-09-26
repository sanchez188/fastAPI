// Vercel Serverless Function Entry Point - Health Check y otras rutas
import Fastify from "fastify";
import { config } from "dotenv";

// Configurar variables de entorno
config();

// Crear instancia de Fastify para Vercel
const fastify = Fastify({
  logger: false, // Desactivar logger en producción para Vercel
});

// Configurar Fastify
async function setupServer() {
  // Registrar plugins básicos
  await fastify.register(import("@fastify/cors"), {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await fastify.register(import("@fastify/helmet"));

  // Ruta de health check
  fastify.get("/", async (request, reply) => {
    return {
      status: "ok",
      service: "Sumo Sushi MCP Server",
      version: "3.0.0",
      timestamp: new Date().toISOString(),
      endpoints: {
        mcp: "/mcp",
        health: "/health"
      }
    };
  });

  // Ruta de health específica
  fastify.get("/health", async (request, reply) => {
    return {
      status: "healthy",
      service: "Sumo Sushi MCP Server",
      version: "3.0.0",
      timestamp: new Date().toISOString(),
    };
  });

  return fastify;
}

// Handler para Vercel
export default async function handler(req, res) {
  const server = await setupServer();
  await server.ready();
  server.server.emit('request', req, res);
}