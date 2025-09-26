# 🚀 Sumo Sushi MCP Server - Fastify Modular

Sistema MCP (Model Context Protocol) para el restaurante Sumo Sushi, construido con **arquitectura verdaderamente modular** usando Fastify.

## ✨ Características

- 🏗️ **Arquitectura Modular Real** - Código separado por responsabilidades
- ⚡ **Fastify** - Servidor HTTP de alto rendimiento
- 🍣 **Gestión Completa** - Menú, órdenes y consultas del restaurante
- 🔌 **Plugins Modulares** - Sistema extensible de funcionalidades
- 🛡️ **TypeScript** - Tipado fuerte y desarrollo seguro
- 🗄️ **Supabase** - Base de datos moderna y escalable

## 🏗️ Estructura del Proyecto

```
src/
├── 📁 config/           # Configuraciones
│   ├── database.ts      # Configuración Supabase
│   └── restaurant.ts    # Datos del restaurante
├── 📁 services/         # Lógica de negocio
│   ├── menu.ts          # Servicio de menú
│   └── orders.ts        # Servicio de órdenes
├── 📁 tools/            # Herramientas MCP
│   ├── menu-tools.ts    # Herramientas de menú
│   ├── order-tools.ts   # Herramientas de órdenes
│   └── mesero-tools.ts  # Consultas del mesero
├── 📁 plugins/          # Plugins Fastify
│   └── mcp.ts           # Plugin MCP
├── 📁 routes/           # Rutas HTTP
│   ├── mcp.ts           # Endpoint MCP
│   └── health.ts        # Health checks
└── 🚀 server.ts         # Servidor principal
```

## 🚀 Inicio Rápido

### 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

### 🔧 Instalación

1. **Clonar repositorio**
   ```bash
   git clone <repo-url>
   cd mcp-prueba-agente-v1
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales de Supabase
   ```

4. **Compilar y ejecutar**
   ```bash
   npm run build
   npm start
   ```

### 🐳 Docker

```bash
# Construir imagen
docker build -t sumo-sushi-mcp .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env sumo-sushi-mcp
```

## 🛠️ Comandos Disponibles

- `npm run build` - Compilar TypeScript
- `npm run dev` - Desarrollo con recarga automática 
- `npm start` - Iniciar servidor de producción
- `npm run clean` - Limpiar archivos compilados
- `npm run lint` - Verificar tipos TypeScript

## 📡 API Endpoints

- `GET /` - Homepage con información del restaurante
- `GET /health` - Health check del servidor
- `POST /mcp` - Endpoint principal MCP

## 🍣 Herramientas MCP Disponibles

1. **consulta_mesero** - Consultas generales sobre el restaurante
2. **buscar_menu** - Búsqueda de items del menú
3. **crear_orden** - Crear nuevos pedidos
4. **consultar_ordenes_por_cedula** - Consultar órdenes existentes
5. **cancelar_por_cedula** - Cancelar órdenes
6. **get_restaurant_info** - Información del restaurante

## 🔧 Variables de Entorno

```env
SUPABASE_URL=tu_url_supabase
SUPABASE_ANON_KEY=tu_key_supabase
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

## 📦 Deployment

### Railway
```bash
railway login
railway init
railway add
railway deploy
```

### DigitalOcean App Platform
1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

### VPS Manual
```bash
# En el servidor
git clone <repo>
cd mcp-prueba-agente-v1
npm ci --only=production
npm run build
pm2 start dist/server.js --name sumo-sushi-mcp
```

## 🔄 Desarrollo

### Agregar Nueva Funcionalidad

1. **Crear servicio** en `src/services/`
2. **Crear herramientas** en `src/tools/`  
3. **Registrar en plugin** `src/plugins/mcp.ts`
4. **Compilar y probar**

### Arquitectura Modular

La modularidad real permite:
- ✅ Separación clara de responsabilidades
- ✅ Fácil testing de componentes individuales
- ✅ Escalabilidad sin límites
- ✅ Mantenimiento sencillo

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles.

---

**🍣 Sumo Sushi MCP Server v3.0.0 - Arquitectura Modular Real** ⚡
