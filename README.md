# 🚀 Fast API - MCP Server with Fastify

Sistema MCP (Model Context Protocol) construido con **arquitectura verdaderamente modular** usando Fastify.

## ✨ Características

- 🏗️ **Arquitectura Modular Real** - Código separado por responsabilidades
- ⚡ **Fastify** - Servidor HTTP de alto rendimiento
- 📡 **API Completa** - Endpoints y funcionalidades del servidor
- 🔌 **Plugins Modulares** - Sistema extensible de funcionalidades
- 🛡️ **TypeScript** - Tipado fuerte y desarrollo seguro
- 🗄️ **Supabase** - Base de datos moderna y escalable

## 🏗️ Estructura del Proyecto.

```
src/
├── 📁 config/           # Configuraciones
│   ├── database.ts      # Configuración Supabase
│   └── restaurant.ts    # Datos del restaurante
├── 📁 services/         # Lógica de negocio
│   ├── menu.ts          # Servicio de menú
│   ├── orders.ts        # Servicio de órdenes
│   ├── restaurants.ts   # Servicio de restaurantes
│   └── geolocation.ts   # Servicio de geolocalización
├── 📁 tools/            # Herramientas MCP
│   ├── menu-tools.ts    # Herramientas de menú
│   ├── order-tools.ts   # Herramientas de órdenes
│   └── mesero-tools.ts  # Consultas del mesero
├── 📁 plugins/          # Plugins Fastify
│   └── mcp.ts           # Plugin MCP
├── 📁 routes/           # Rutas HTTP
│   ├── health.ts        # Health check
│   ├── mcp.ts           # Rutas MCP
│   └── restaurants.ts   # API REST de restaurantes
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

### Principales
- `GET /` - Homepage con información del restaurante
- `GET /health` - Health check del servidor
- `POST /mcp` - Endpoint principal MCP

### 🌍 API REST de Restaurantes
- `GET /api/restaurants/nearby` - **🆕 Buscar restaurantes cercanos por geolocalización**
- `GET /api/restaurants` - Listar restaurantes con filtros
- `GET /api/restaurants/:id` - Obtener restaurante específico

#### Ejemplo: Restaurantes Cercanos
```bash
curl "https://fastapi-2ifl.onrender.com/api/restaurants/nearby?latitude=9.9281&longitude=-84.0907&radius_km=10&limit=20"
```

## 🍣 Herramientas MCP Disponibles

### 🔧 Consultas y Gestión
1. **consulta_mesero** - Consultas generales sobre el restaurante
2. **buscar_menu** - Búsqueda de items del menú con filtros
3. **consultar_restaurantes** - Listar restaurantes con filtros múltiples

### 📦 Gestión de Órdenes
4. **crear_orden** - Crear nuevos pedidos
5. **consultar_ordenes_por_cedula** - Consultar órdenes existentes  
6. **cancelar_por_cedula** - Cancelar órdenes
7. **cotizar_orden** - Calcular total antes de crear orden
8. **disponibilidad_items** - Verificar stock de platillos

### 🌍 Geolocalización (NUEVO)
9. **restaurantes_cercanos** - **🆕 Buscar restaurantes por ubicación GPS**

### 🔍 Estándar MCP
10. **search** - Búsqueda general en el sistema
11. **fetch** - Obtener contenido específico por ID

#### 🌟 Funcionalidad Dual: MCP + REST
La herramienta `restaurantes_cercanos` también está disponible como endpoint REST en `/api/restaurants/nearby` para uso directo desde apps web/móviles.

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

**⚡ Fast API v3.0.0 - Arquitectura Modular Real** 🚀
