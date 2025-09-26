#!/bin/bash
# 🚀 Script de deployment para Sumo Sushi MCP Server

echo "🍣 Iniciando deployment de Sumo Sushi MCP Server..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Instalar Node.js 18+ primero."
    exit 1
fi

# Verificar variables de entorno
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
    echo "⚠️  Variables de entorno requeridas:"
    echo "   SUPABASE_URL"
    echo "   SUPABASE_ANON_KEY"
    echo "   PORT (opcional, default: 3000)"
    echo "   HOST (opcional, default: 0.0.0.0)"
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --only=production

# Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run build

# Verificar compilación
if [[ ! -f "dist/server.js" ]]; then
    echo "❌ Error en compilación. Archivo dist/server.js no encontrado."
    exit 1
fi

echo "✅ Deployment completado!"
echo "🚀 Iniciar con: npm start"
echo "🌐 Puerto: ${PORT:-3000}"