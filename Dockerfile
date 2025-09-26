# 🐳 Dockerfile para Sumo Sushi MCP Server - Fastify Modular
FROM node:20-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache dumb-init

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY src ./src
COPY tsconfig.json ./

# Compilar TypeScript
RUN npm run build

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sumo -u 1001

# Cambiar propietario de archivos
RUN chown -R sumo:nodejs /app
USER sumo

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Comando de inicio con dumb-init
CMD ["dumb-init", "node", "dist/server.js"]