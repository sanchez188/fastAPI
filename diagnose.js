#!/usr/bin/env node

// Script de diagnóstico para Render.com
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 DIAGNÓSTICO DE FAST API EN RENDER');
console.log('=====================================');
console.log(`📁 Directorio actual: ${process.cwd()}`);
console.log(`📁 __dirname: ${__dirname}`);
console.log(`📄 __filename: ${__filename}`);

// Verificar estructura de archivos
console.log('\n📂 Estructura de archivos:');
try {
    const files = readdirSync('.', { withFileTypes: true });
    files.forEach(file => {
        const icon = file.isDirectory() ? '📁' : '📄';
        console.log(`  ${icon} ${file.name}`);
    });
} catch (error) {
    console.error('❌ Error leyendo directorio:', error.message);
}

// Verificar dist/
console.log('\n📂 Contenido de dist/:');
const distPath = join(process.cwd(), 'dist');
if (existsSync(distPath)) {
    try {
        const distFiles = readdirSync(distPath, { withFileTypes: true });
        distFiles.forEach(file => {
            const icon = file.isDirectory() ? '📁' : '📄';
            console.log(`  ${icon} ${file.name}`);
        });
    } catch (error) {
        console.error('❌ Error leyendo dist/:', error.message);
    }
} else {
    console.error('❌ Directorio dist/ no existe');
}

// Verificar server.js
const serverPath = join(process.cwd(), 'dist', 'server.js');
console.log(`\n🔍 Verificando: ${serverPath}`);
if (existsSync(serverPath)) {
    console.log('✅ dist/server.js encontrado');
    
    // Intentar importar el servidor
    try {
        console.log('🚀 Importando servidor...');
        // Usar URL correcta para import dinámico
        const fileUrl = `file://${serverPath.replace(/\\/g, '/')}`;
        console.log(`📄 URL: ${fileUrl}`);
        await import(fileUrl);
    } catch (error) {
        console.error('❌ Error importando servidor:', error.message);
        console.error('Stack trace:', error.stack);
    }
} else {
    console.error('❌ dist/server.js NO encontrado');
    
    // Buscar archivos .js en dist/
    try {
        const jsFiles = readdirSync(distPath).filter(f => f.endsWith('.js'));
        if (jsFiles.length > 0) {
            console.log('📄 Archivos .js encontrados en dist/:');
            jsFiles.forEach(file => console.log(`  - ${file}`));
        }
    } catch (error) {
        console.log('No se pudieron listar archivos en dist/');
    }
}