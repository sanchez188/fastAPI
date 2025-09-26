# 🚀 Guía de Despliegue - Sumo Sushi MCP Server

## Problema Solucionado

El despliegue en Vercel fallaba por los siguientes motivos:

1. **Archivos TypeScript sin compilar**: Los archivos en `api/` importaban desde `src/` (TypeScript) pero Vercel necesita JavaScript compilado.
2. **Estructura de imports incorrecta**: Importaba `.js` cuando los archivos eran `.ts`.
3. **Configuración de build incompleta**: El proceso de build no estaba adaptado para Vercel.

## Cambios Realizados

### 1. Estructura de Archivos para Vercel

- ✅ Creado `src/vercel-index.ts` - Handler principal
- ✅ Creado `src/vercel-mcp.ts` - Handler MCP
- ✅ Eliminada carpeta `api/` obsoleta

### 2. Configuración de Build

- ✅ Actualizado `package.json` con script `vercel-build`
- ✅ Configurado `vercel.json` para usar archivos compilados de `dist/`
- ✅ Actualizado `.vercelignore` para incluir archivos compilados

### 3. Proceso de Compilación

```bash
npm run build  # Compila TypeScript a JavaScript en dist/
```

## Instrucciones de Despliegue

### Opción 1: Despliegue Automático (Git)

```bash
git add .
git commit -m "Fix: Configuración correcta para Vercel"
git push origin main
```

### Opción 2: Despliegue Manual (CLI)

```bash
# 1. Compilar proyecto
npm run build

# 2. Desplegar a Vercel
vercel --prod
```

## Variables de Entorno en Vercel

Asegúrate de configurar estas variables en tu dashboard de Vercel:

```bash
SUPABASE_URL=https://gnyuewqrwxnhkxlbhqyv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXVld3Fyd3huaGt4bGJocXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODExNTYsImV4cCI6MjA3NDE1NzE1Nn0.Y9n8VVs8R8Pjxxc_NaQetCo9EcydQmWEOrIMFz-ZHZ8
NODE_ENV=production
```

## Endpoints Disponibles

Después del despliegue, estarán disponibles:

- **Health Check**: `https://fast-api-omega-nine.vercel.app/`
- **Health Específico**: `https://fast-api-omega-nine.vercel.app/health`
- **MCP Server**: `https://fast-api-omega-nine.vercel.app/mcp`

## Pruebas Locales

Para probar localmente antes del despliegue:

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar
npm run build

# 3. Probar con Vercel Dev
vercel dev
```

## Estructura Final del Proyecto

```
├── dist/                     # ✅ Archivos JS compilados (para Vercel)
│   ├── vercel-index.js      # Handler principal
│   ├── vercel-mcp.js        # Handler MCP
│   └── ...otros archivos...
├── src/                     # ❌ Código fuente TypeScript (ignorado por Vercel)
├── package.json             # ✅ Configurado para Vercel
├── vercel.json              # ✅ Configuración de routing
├── tsconfig.json            # Configuración TypeScript
└── .vercelignore            # ✅ Optimizado para Vercel
```

---

## 🎯 Próximos Pasos

1. Haz commit y push de los cambios
2. Vercel detectará automáticamente los cambios y re-desplegará
3. Los endpoints deberían funcionar correctamente
