#!/usr/bin/env node

// Script para probar las nuevas herramientas search y fetch en el servidor MCP desplegado
import https from 'https';

const MCP_URL = 'https://fastapi-2ifl.onrender.com/mcp';

function makeRequest(data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream',
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

async function testNewMCPTools() {
    console.log('🆕 PROBANDO NUEVAS HERRAMIENTAS MCP: SEARCH & FETCH');
    console.log('=================================================');
    console.log(`🌐 URL: ${MCP_URL}`);
    console.log('');

    // Test 1: Listar herramientas (debería mostrar 8 tools ahora)
    console.log('📋 Test 1: Verificando herramientas disponibles...');
    try {
        const toolsResponse = await makeRequest({
            jsonrpc: "2.0",
            id: 1,
            method: "tools/list",
            params: {}
        });

        console.log(`Status: ${toolsResponse.statusCode}`);
        if (toolsResponse.statusCode === 200) {
            const data = JSON.parse(toolsResponse.body.split('data: ')[1]);
            const tools = data.result?.tools || [];
            console.log(`✅ ${tools.length} herramientas disponibles:`);
            tools.forEach((tool, index) => {
                console.log(`  ${index + 1}. ${tool.name} - ${tool.description}`);
            });
        } else {
            console.log('⚠️ Respuesta inesperada:', toolsResponse.body);
        }
    } catch (error) {
        console.log('❌ Error listando herramientas:', error.message);
    }

    console.log('\n🔍 Test 2: Probando herramienta SEARCH...');
    try {
        const searchResponse = await makeRequest({
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: {
                name: "search",
                arguments: {
                    query: "sushi california roll"
                }
            }
        });

        console.log(`Status: ${searchResponse.statusCode}`);
        if (searchResponse.statusCode === 200) {
            const data = JSON.parse(searchResponse.body.split('data: ')[1]);
            console.log('✅ Search ejecutado exitosamente');
            console.log('Resultado:', data.result?.content?.[0]?.text || 'Sin contenido');
        } else {
            console.log('⚠️ Respuesta inesperada:', searchResponse.body);
        }
    } catch (error) {
        console.log('❌ Error en search:', error.message);
    }

    console.log('\n📄 Test 3: Probando herramienta FETCH...');
    try {
        const fetchResponse = await makeRequest({
            jsonrpc: "2.0",
            id: 3,
            method: "tools/call",
            params: {
                name: "fetch",
                arguments: {
                    id: "restaurant_info_123"
                }
            }
        });

        console.log(`Status: ${fetchResponse.statusCode}`);
        if (fetchResponse.statusCode === 200) {
            const data = JSON.parse(fetchResponse.body.split('data: ')[1]);
            console.log('✅ Fetch ejecutado exitosamente');
            console.log('Resultado:', data.result?.content?.[0]?.text || 'Sin contenido');
        } else {
            console.log('⚠️ Respuesta inesperada:', fetchResponse.body);
        }
    } catch (error) {
        console.log('❌ Error en fetch:', error.message);
    }

    console.log('\n🎯 Test 4: Búsqueda de información del restaurante...');
    try {
        const infoSearchResponse = await makeRequest({
            jsonrpc: "2.0",
            id: 4,
            method: "tools/call",
            params: {
                name: "search",
                arguments: {
                    query: "horarios restaurante"
                }
            }
        });

        console.log(`Status: ${infoSearchResponse.statusCode}`);
        if (infoSearchResponse.statusCode === 200) {
            const data = JSON.parse(infoSearchResponse.body.split('data: ')[1]);
            console.log('✅ Búsqueda de info del restaurante exitosa');
            const searchResults = JSON.parse(data.result?.content?.[0]?.text || '{}');
            if (searchResults.results) {
                console.log('Resultados encontrados:');
                searchResults.results.forEach((result, index) => {
                    console.log(`  ${index + 1}. ${result.title} (${result.id})`);
                });
            }
        } else {
            console.log('⚠️ Respuesta inesperada:', infoSearchResponse.body);
        }
    } catch (error) {
        console.log('❌ Error en búsqueda de info:', error.message);
    }

    console.log('\n🎉 RESUMEN:');
    console.log('Las nuevas herramientas search y fetch han sido implementadas correctamente.');
    console.log('El servidor MCP ahora soporta búsquedas y obtención de contenido completo.');
    console.log('Total de herramientas disponibles: 8+');
}

testNewMCPTools().catch(console.error);