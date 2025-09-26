# 📡 Fast API - Documentación del Servidor MCP

## Información General

- **Servidor**: `fast-api-assistant-fastify`
- **Versión**: `3.0.0-modular`
- **Protocolo**: JSON-RPC 2.0
- **URL**: `https://fastapi-2ifl.onrender.com/mcp`
- **Headers requeridos**:
  - `Content-Type: application/json`
  - `Accept: application/json, text/event-stream`

---

## � Resumen de Herramientas

Tu servidor MCP incluye **8 herramientas** divididas en estas categorías:

### 🎯 Herramientas Base del Protocolo MCP:

1. `initialize` - Inicialización del servidor
2. `tools/list` - Lista todas las herramientas

### 🛠️ Herramientas Específicas del Negocio:

3. `consulta_mesero` - Asistente general
4. `buscar_menu` - Búsqueda en menú
5. `crear_orden` - Crear órdenes
6. `consultar_ordenes_por_cedula` - Consultar órdenes
7. `cancelar_por_cedula` - Cancelar órdenes
8. `get_restaurant_info` - Info del restaurante

### 🔍 Herramientas Estándar MCP:

9. `search` - Búsqueda general en el servidor
10. `fetch` - Obtener contenido completo por ID

---

## �🛠️ Métodos Disponibles

### 1. `initialize`

**Descripción**: Inicializa la conexión con el servidor MCP.

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "client-name",
      "version": "1.0.0"
    }
  }
}
```

**Respuesta**:

```json
{
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {}
    },
    "serverInfo": {
      "name": "fast-api-assistant-fastify",
      "version": "3.0.0-modular"
    }
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

---

### 2. `tools/list`

**Descripción**: Obtiene la lista de herramientas disponibles en el servidor.

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

**Respuesta**:

```json
{
  "result": {
    "tools": [
      {
        "name": "consulta_mesero",
        "description": "Consulta general al asistente de Fast API - Responde temas del servidor y API",
        "inputSchema": {...}
      },
      {
        "name": "buscar_menu",
        "description": "Buscar items del menú por sección, tags o texto...",
        "inputSchema": {...}
      }
      // ... más herramientas
    ]
  },
  "jsonrpc": "2.0",
  "id": 2
}
```

---

## 🔧 Herramientas (Tools)

### 1. `consulta_mesero`

**Descripción**: Consulta general al asistente de Fast API - Responde temas del servidor y API.

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "consulta_mesero",
    "arguments": {
      "pregunta": "¿Cuáles son los endpoints disponibles en la API?"
    }
  }
}
```

**Parámetros requeridos**:

- `pregunta` (string): Pregunta o consulta sobre el servidor, API, endpoints o información general de Fast API

**Respuesta**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Respuesta del asistente sobre la consulta realizada..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 3
}
```

---

### 2. `buscar_menu`

**Descripción**: Buscar items del menú por sección, tags o texto. Siempre muestra descripción, precio y no muestra etiquetas ni IDs, con solo dos bullet points.

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "buscar_menu",
    "arguments": {
      "seccion": "entrantes",
      "filtro_tags": "vegetariano,picante",
      "texto": "aguacate"
    }
  }
}
```

**Parámetros opcionales**:

- `seccion` (string): Categoría del menú
- `filtro_tags` (string): Tags separados por comas (ej: "vegetariano,picante")
- `texto` (string): Buscar por nombre o descripción

**Respuesta**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Lista de items del menú encontrados con descripción y precios..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 4
}
```

---

### 3. `crear_orden`

**Descripción**: Crear una nueva orden de pedido.

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "crear_orden",
    "arguments": {
      "cedula": "1-1234-5678",
      "telefono": "2479-1234",
      "nombre_cliente": "Juan Pérez",
      "items": [
        {
          "id_item": "item_001",
          "qty": 2,
          "nombre": "California Roll"
        }
      ],
      "metodo_pago": "Efectivo",
      "notas": "Sin wasabi por favor"
    }
  }
}
```

**Parámetros requeridos**:

- `cedula` (string): Cédula del cliente (formato: 1-1234-5678)
- `telefono` (string): Teléfono del cliente
- `items` (array): Lista de items del pedido
  - `id_item` (string): ID del item
  - `qty` (integer): Cantidad
  - `nombre` (string, opcional): Nombre del item

**Parámetros opcionales**:

- `nombre_cliente` (string): Nombre completo del cliente
- `metodo_pago` (string): "Efectivo" o "Tarjeta"
- `notas` (string): Notas adicionales

**Respuesta**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "✅ Orden creada exitosamente. ID de orden: #12345..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 5
}
```

---

### 4. `consultar_ordenes_por_cedula`

**Descripción**: Consultar órdenes existentes por número de cédula.

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/call",
  "params": {
    "name": "consultar_ordenes_por_cedula",
    "arguments": {
      "cedula": "1-1234-5678"
    }
  }
}
```

**Parámetros requeridos**:

- `cedula` (string): Cédula del cliente

**Respuesta**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "📋 Órdenes encontradas para la cédula 1-1234-5678:\n\n🆔 Orden #12345..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 6
}
```

---

### 5. `cancelar_por_cedula`

**Descripción**: Cancelar órdenes por cédula (última orden o todas las pendientes).

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "cancelar_por_cedula",
    "arguments": {
      "cedula": "1-1234-5678",
      "scope": "ultima",
      "motivo": "Cliente canceló por cambio de planes"
    }
  }
}
```

**Parámetros requeridos**:

- `cedula` (string): Cédula del cliente

**Parámetros opcionales**:

- `scope` (string): "ultima" (por defecto) o "todas"
- `motivo` (string): Motivo de la cancelación

**Respuesta**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "✅ Orden(es) cancelada(s) exitosamente..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 7
}
```

---

### 6. `get_restaurant_info`

**Descripción**: Obtener información del restaurante (horarios, ubicación, contacto).

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "method": "tools/call",
  "params": {
    "name": "get_restaurant_info",
    "arguments": {}
  }
}
```

**Parámetros**: Ninguno requerido.

**Respuesta**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "🏪 Fast API Server\n📞 Teléfono: 2479-5555\n📍 Ubicación: Centro de Heredia..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 8
}
```

---

### 7. `search`

**Descripción**: Buscar contenido en la base de datos del servidor. Devuelve una lista de resultados relevantes.

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "tools/call",
  "params": {
    "name": "search",
    "arguments": {
      "query": "sushi california roll"
    }
  }
}
```

**Parámetros requeridos**:

- `query` (string): Término de búsqueda para encontrar contenido relevante

**Respuesta**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"results\":[{\"id\":\"menu_search_1234567\",\"title\":\"Resultados de menú para: \\\"sushi california roll\\\"\",\"url\":\"/menu/search\"}]}"
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 9
}
```

---

### 8. `fetch`

**Descripción**: Obtener el contenido completo de un documento o item específico usando su ID único.

**Parámetros**:

```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "tools/call",
  "params": {
    "name": "fetch",
    "arguments": {
      "id": "menu_search_1234567"
    }
  }
}
```

**Parámetros requeridos**:

- `id` (string): ID único del documento o item a obtener

**Respuesta**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"id\":\"menu_search_1234567\",\"title\":\"Menú Completo del Restaurante\",\"text\":\"[Contenido completo del menú...]\",\"url\":\"/menu\",\"metadata\":{\"type\":\"menu\",\"sections\":[\"entrantes\",\"principales\",\"postres\",\"bebidas\"]}}"
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 10
}
```

---

## 📝 Notas de Uso

### Headers HTTP Requeridos

```
Content-Type: application/json
Accept: application/json, text/event-stream
```

### Ejemplo de cURL

```bash
curl -X POST https://fastapi-2ifl.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test-client","version":"1.0.0"}}}'
```

### Formato de Error

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Descripción del error"
  },
  "id": null
}
```

---

## 🔗 Enlaces Útiles

- **Servidor Web**: https://fastapi-2ifl.onrender.com/
- **Health Check**: https://fastapi-2ifl.onrender.com/health
- **MCP Endpoint**: https://fastapi-2ifl.onrender.com/mcp

---

_Documentación generada para Fast API v3.0.0 - MCP Server_
