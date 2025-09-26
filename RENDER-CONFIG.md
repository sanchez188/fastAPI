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
   - **Runtime**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Branch**: `main`
   - **Root Directory**: (DEJA VACÍO - muy importante)
   - **Node Version**: 18.x o superior

### ⚠️ SOLUCIÓN AL ERROR DE RUTA:

Si ves el error "Cannot find module '/opt/render/project/src/dist/server.js'":

**CAUSA**: Render está usando `src` como Root Directory

**SOLUCIÓN**:

1. Ve a tu servicio en Render Dashboard
2. En **Settings** → **Build & Deploy**
3. En **Root Directory** asegúrate que esté **COMPLETAMENTE VACÍO**
4. Si tiene `src` o cualquier valor, bórralo y déjalo vacío
5. Guarda cambios y redespliega

**Comandos correctos**:

- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: (vacío)

**Script de diagnóstico**: Si sigues teniendo problemas, cambia temporalmente el Start Command a `npm run start:diagnose` para ver la estructura de archivos en Render.

## Endpoints disponibles:

- `/` - Health check principal
- `/health` - Health check específico
- `/mcp` - Servidor MCP

## Puerto:

El servidor escucha en el puerto configurado por la variable `PORT` (Render la asigna automáticamente) o 3000 por defecto.
