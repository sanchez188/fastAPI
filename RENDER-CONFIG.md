# Fast API - Render.com Configuration

Este proyecto Fast API está configurado para desplegarse en Render.com

## Variables de Entorno Requeridas:

- `SUPABASE_URL`: https://gnyuewqrwxnhkxlbhqyv.supabase.co
- `SUPABASE_ANON_KEY`: [Tu clave anónima de Supabase]
- `NODE_ENV`: production
- `PORT`: (Render lo asigna automáticamente)

## Configuración en Render.com:

1. **Crear un nuevo Web Service con esta configuración:**
   - **Name**: `fast-api-server`
2. **Runtime**: Node
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Rama**: main
6. **Root Directory**: (vacío - usa la raíz)

## Endpoints disponibles:

- `/` - Health check principal
- `/health` - Health check específico
- `/mcp` - Servidor MCP

## Puerto:

El servidor escucha en el puerto configurado por la variable `PORT` (Render la asigna automáticamente) o 3000 por defecto.
