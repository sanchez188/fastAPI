# 🌍 API de Geolocalización - Restaurantes Cercanos

## Descripción

Nueva funcionalidad que permite buscar restaurantes cercanos a una ubicación específica usando coordenadas geográficas (latitud/longitud) y cálculo de distancia con la fórmula de Haversine.

## 🚀 Funcionalidad Dual

### 1. 🔧 Herramienta MCP: `restaurantes_cercanos`

**Para uso con clientes MCP (Model Context Protocol)**

```json
{
  "method": "tools/call",
  "params": {
    "name": "restaurantes_cercanos",
    "arguments": {
      "latitude": 9.9281,
      "longitude": -84.0907,
      "radius_km": 15,
      "limit": 10
    }
  }
}
```

**Parámetros:**

- `latitude` (requerido): Latitud entre -90 y 90 grados
- `longitude` (requerido): Longitud entre -180 y 180 grados
- `radius_km` (opcional): Radio en kilómetros (0.1-100, por defecto 10)
- `limit` (opcional): Máximo restaurantes (1-50, por defecto 20)

### 2. 🌐 Endpoint REST: `GET /api/restaurants/nearby`

**Para llamadas HTTP directas**

```bash
curl "https://fastapi-2ifl.onrender.com/api/restaurants/nearby?latitude=9.9281&longitude=-84.0907&radius_km=15&limit=10"
```

**Query Parameters:**

- `latitude` (requerido): Latitud de la ubicación
- `longitude` (requerido): Longitud de la ubicación
- `radius_km` (opcional): Radio de búsqueda en km
- `limit` (opcional): Número máximo de resultados

## 📊 Respuesta

Ambas opciones devuelven la misma estructura de datos:

```json
{
  "success": true,
  "data": {
    "total_encontrados": 3,
    "radio_busqueda_km": 15,
    "ubicacion_usuario": {
      "latitude": 9.9281,
      "longitude": -84.0907
    },
    "restaurantes": [
      {
        "id": "rest_123",
        "nombre": "Pizza Palace",
        "categoria": "Italiana",
        "descripcion": "Auténtica pizza italiana",
        "direccion": "Calle Central 123",
        "telefono": "+506 2234-5678",
        "distance_km": 2.45,
        "calificacion": 4.5,
        "latitude": 9.9301,
        "longitude": -84.085,
        "horario_atencion": "11:00-22:00",
        "metodos_pago": ["efectivo", "tarjeta"],
        "modos_servicio": ["para llevar", "a domicilio"]
      }
    ]
  }
}
```

## 🛠️ Otros Endpoints de Restaurantes

### Listar Restaurantes

```bash
GET /api/restaurants
GET /api/restaurants?category_name=Mexicano&rating_min=4.0
```

### Obtener Restaurante por ID

```bash
GET /api/restaurants/{id}
```

## 🧮 Cálculo de Distancia

Utiliza la **fórmula de Haversine** para calcular distancia precisa entre coordenadas:

```typescript
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
}
```

## 🎯 Casos de Uso

### Para Apps Móviles

```javascript
// Obtener ubicación del usuario
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;

  const response = await fetch(
    `https://fastapi-2ifl.onrender.com/api/restaurants/nearby?latitude=${latitude}&longitude=${longitude}&radius_km=5`
  );
  const data = await response.json();

  // Mostrar restaurantes cercanos
  displayNearbyRestaurants(data.data.restaurantes);
});
```

### Para Clientes MCP

```json
{
  "tool": "restaurantes_cercanos",
  "args": {
    "latitude": 9.9281,
    "longitude": -84.0907,
    "radius_km": 5
  }
}
```

## 🔍 Validaciones

- **Coordenadas válidas**: Latitud [-90, 90], Longitud [-180, 180]
- **Radio apropiado**: Entre 0.1km y 100km
- **Límite razonable**: Entre 1 y 50 restaurantes
- **Solo restaurantes activos**: Con coordenadas válidas en la BD

## 🌟 Características

- ✅ **Doble interfaz**: MCP + REST
- ✅ **Cálculo preciso**: Fórmula de Haversine
- ✅ **Filtros inteligentes**: Por distancia, límite de resultados
- ✅ **Ordenamiento**: Por proximidad (más cercano primero)
- ✅ **Validación robusta**: Parámetros y coordenadas
- ✅ **Respuesta estándar**: JSON estructurado
- ✅ **Información completa**: Distancia, categoría, contacto

## 🔧 URL Base

**Producción**: `https://fastapi-2ifl.onrender.com`
**MCP Server**: Disponible en el plugin MCP integrado
