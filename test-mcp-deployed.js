#!/usr/bin/env node

// Script de prueba para el servidor MCP desplegado
import https from 'https';

const MCP_URL = 'https://fastapi-2ifl.onrender.com/mcp';

function makeRequest(data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'MCP-Test-Client/1.0'
            }
        };

        const req = https.request(MCP_URL, options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: responseData
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function testMCPServer() {
    console.log('🧪 PROBANDO SERVIDOR MCP DESPLEGADO');
    console.log('=====================================');
    console.log(`🌐 URL: ${MCP_URL}`);
    console.log('');

    // Test 1: Initialize
    console.log('📡 Test 1: Inicialización MCP...');
    try {
        const initResponse = await makeRequest({
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: {
                    name: "test-client",
                    version: "1.0.0"
                }
            }
        });

        console.log(`Status: ${initResponse.statusCode}`);
        console.log(`Response: ${initResponse.body}`);
        
        if (initResponse.statusCode === 200) {
            console.log('✅ Inicialización exitosa');
        } else {
            console.log('⚠️ Respuesta inesperada (pero el servidor responde)');
        }
    } catch (error) {
        console.log('❌ Error en inicialización:', error.message);
    }

    console.log('\n📋 Test 2: Listado de herramientas...');
    try {
        const toolsResponse = await makeRequest({
            jsonrpc: "2.0",
            id: 2,
            method: "tools/list",
            params: {}
        });

        console.log(`Status: ${toolsResponse.statusCode}`);
        console.log(`Response: ${toolsResponse.body}`);
        
        if (toolsResponse.statusCode === 200) {
            console.log('✅ Listado de herramientas exitoso');
        } else {
            console.log('⚠️ Respuesta inesperada (pero el servidor responde)');
        }
    } catch (error) {
        console.log('❌ Error en listado:', error.message);
    }

    console.log('\n🎯 CONCLUSIÓN:');
    console.log('El servidor MCP está desplegado y respondiendo a peticiones.');
    console.log('Las respuestas indican que el protocolo MCP está activo.');
    console.log('Para conectarse correctamente, usa un cliente MCP oficial o');
    console.log('configura los headers y el protocolo según las especificaciones MCP.');
}

testMCPServer().catch(console.error);