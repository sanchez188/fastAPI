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

### 🔍 Herramientas Estándar MCP:

6. `search` - Búsqueda general en el servidor
7. `fetch` - Obtener contenido completo por ID

### 🏪 Herramientas de Base de Datos:

8. `consultar_restaurantes` - Consultar restaurantes con filtros avanzados

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

### 6. `search`

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

### 7. `fetch`

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

### 8. `consultar_restaurantes`

**Descripción**: Consultar restaurantes en la base de datos con filtros opcionales como nombre, calificación, métodos de pago, etc.

**Parámetros para búsqueda general**:

```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "method": "tools/call",
  "params": {
    "name": "consultar_restaurantes",
    "arguments": {
      "name": "pizza",
      "rating_min": 4,
      "payment_method": "tarjeta",
      "limit": 5
    }
  }
}
```

**Parámetros para restaurante específico**:

```json
{
  "jsonrpc": "2.0",
  "id": 12,
  "method": "tools/call",
  "params": {
    "name": "consultar_restaurantes",
    "arguments": {
      "restaurant_id": "123e4567-e89b-12d3-a456-426614174000"
    }
  }
}
```

**Parámetros opcionales**:

- `name` (string): Buscar por nombre del restaurante (búsqueda parcial)
- `category_name` (string): Filtrar por nombre de categoría específica (ej: "Pizza", "Mexicano", etc.)
- `rating_min` (number): Calificación mínima (0-5)
- `rating_max` (number): Calificación máxima (0-5)
- `payment_method` (string): Filtrar por método de pago específico
- `service_mode` (string): Filtrar por modo de servicio específico
- `restaurant_id` (string): Obtener un restaurante específico por su ID único
- `limit` (number): Límite de resultados a devolver (por defecto 10)

**Respuesta para búsqueda general**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "📋 **Restaurantes Encontrados** (3 resultados)\n\n🏪 **Pizza Palace** ⭐ 4.5/5\n📞 2479-1234\n📍 Centro de San José...\n\n---\n\n🏪 **Italian Corner** ⭐ 4.2/5..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 11
}
```

**Respuesta para restaurante específico**:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "🏪 **Pizza Palace** ⭐ 4.5/5\n\n📞 **Teléfono:** 2479-1234\n📍 **Dirección:** Centro de San José\n🕐 **Horarios:** Lun-Dom: 11:00-22:00\n💳 **Métodos de Pago:** Efectivo, Tarjeta..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 12
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
