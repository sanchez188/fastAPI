// 🩺 Ruta de Health Check - Fastify Modular
import { FastifyInstance } from "fastify";
import { RestaurantConfig } from "../config/restaurant.js";

export default async function healthRoute(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    return reply.type("text/html").send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${RestaurantConfig.NOMBRE_RESTAURANTE} MCP Server</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
        }
        .container { 
            background: rgba(255,255,255,0.1); 
            padding: 30px; 
            border-radius: 15px; 
            backdrop-filter: blur(10px); 
        }
        .status { color: #4ade80; font-weight: bold; }
        .endpoint { 
            background: rgba(0,0,0,0.3); 
            padding: 10px; 
            border-radius: 5px; 
            font-family: monospace; 
        }
        .tools { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .tool { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; }
        .footer { text-align: center; margin-top: 30px; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍣 ${RestaurantConfig.NOMBRE_RESTAURANTE} MCP Server</h1>
        <p class="status">✅ Estado: Servidor MCP operativo con Fastify (Modular)</p>
        
        <h2>📡 Endpoint API</h2>
        <div class="endpoint">🔗 URL: /mcp</div>
        
        <h2>🛠️ Herramientas Disponibles</h2>
        <div class="tools">
            <div class="tool">
                <h3>consulta_mesero</h3>
                <p>Consultas generales al mesero sobre el restaurante y menú.</p>
            </div>
            <div class="tool">
                <h3>buscar_menu</h3>
                <p>Búsqueda de items del menú por sección, tags o texto.</p>
            </div>
            <div class="tool">
                <h3>crear_orden</h3>
                <p>Crear una nueva orden de pedido con items del menú.</p>
            </div>
            <div class="tool">
                <h3>consultar_ordenes_por_cedula</h3>
                <p>Consultar órdenes existentes por número de cédula.</p>
            </div>
            <div class="tool">
                <h3>cancelar_por_cedula</h3>
                <p>Cancelar órdenes por cédula (última o todas las pendientes).</p>
            </div>
            <div class="tool">
                <h3>get_restaurant_info</h3>
                <p>Información básica del restaurante (horarios, ubicación, contacto).</p>
            </div>
        </div>

        <h2>📞 Contacto del Restaurante</h2>
        <p>• <strong>Teléfono:</strong> ${RestaurantConfig.TELEFONO_RESTAURANTE}</p>
        <p>• <strong>Ubicación:</strong> ${RestaurantConfig.DIRECCION_CORTA}</p>
        <p>• <strong>Horarios:</strong> ${RestaurantConfig.HORARIO}</p>
        
        <div class="footer">
            <p>Sistema de pedidos MCP para ${RestaurantConfig.NOMBRE_RESTAURANTE}</p>
            <p>Versión Fastify Modular • Powered by Model Context Protocol</p>
        </div>
    </div>
</body>
</html>
    `);
  });

  fastify.get("/health", async (request, reply) => {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "3.0.0-modular",
      restaurant: RestaurantConfig.NOMBRE_RESTAURANTE,
    };
  });
}
