// Diagnóstico para probar diferentes endpoints de exportación
import { apiClient } from '../../shared/api/client';

export const diagnoseExportEndpoints = async () => {
  console.log('🔍 Iniciando diagnóstico de endpoints de exportación...\n');
  
  const testData = {
    table: 'accounts',
    format: 'csv',
    ids: ['test']
  };

  const endpointsToTest = [
    '/api/v1/export',
    '/api/v1/export/',
    '/api/v1/export/export',
    '/export',
    '/export/',
    'export',
    'export/'
  ];

  for (const endpoint of endpointsToTest) {
    try {
      console.log(`📡 Probando endpoint: ${endpoint}`);
      
      const response = await apiClient.post(endpoint, testData, {
        timeout: 5000,
        validateStatus: () => true // Aceptar cualquier status para diagnóstico
      });
      
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      if (response.data) {
        console.log(`📄 Tipo de respuesta: ${typeof response.data}`);
        if (response.headers['content-type']) {
          console.log(`🏷️ Content-Type: ${response.headers['content-type']}`);
        }
      }
      
    } catch (error: any) {
      if (error.response) {
        console.log(`❌ ${endpoint} - Status: ${error.response.status} - ${error.response.statusText}`);
        if (error.response.data && typeof error.response.data === 'object') {
          console.log(`📝 Error data:`, error.response.data);
        }
      } else if (error.request) {
        console.log(`🔌 ${endpoint} - No response (network error)`);
      } else {
        console.log(`⚠️ ${endpoint} - ${error.message}`);
      }
    }
    
    console.log(''); // Línea en blanco para separar
  }
  
  console.log('🏁 Diagnóstico completado');
};

export const testCurrentConfiguration = async () => {
  console.log('🧪 Probando configuración actual...\n');
  
  try {
    // Probar obtener tablas disponibles primero
    console.log('📋 Probando /api/v1/export/tables...');
    const tablesResponse = await apiClient.get('/api/v1/export/tables', {
      timeout: 5000,
      validateStatus: () => true
    });
    
    console.log(`Status: ${tablesResponse.status}`);
    if (tablesResponse.status === 200) {
      console.log('✅ Endpoint de tablas funciona correctamente');
      console.log('📊 Respuesta:', JSON.stringify(tablesResponse.data, null, 2));
    } else {
      console.log('❌ Endpoint de tablas falló');
      console.log('📝 Respuesta:', tablesResponse.data);
    }
    
  } catch (error: any) {
    console.error('❌ Error al probar endpoint de tablas:', error.message);
    if (error.response) {
      console.log('📝 Status:', error.response.status);
      console.log('📝 Data:', error.response.data);
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  try {
    // Probar exportación simple
    console.log('📤 Probando /api/v1/export (exportación simple)...');
    const exportResponse = await apiClient.post('/api/v1/export', {
      table: 'accounts',
      format: 'csv',
      ids: []
    }, {
      timeout: 5000,
      validateStatus: () => true
    });
    
    console.log(`Status: ${exportResponse.status}`);
    if (exportResponse.status === 200 || exportResponse.status === 400) {
      console.log('✅ Endpoint de exportación responde');
      if (exportResponse.headers['content-type']) {
        console.log('🏷️ Content-Type:', exportResponse.headers['content-type']);
      }
    } else {
      console.log('❌ Endpoint de exportación falló');
    }
    
    if (exportResponse.data && typeof exportResponse.data === 'object') {
      console.log('📝 Respuesta:', JSON.stringify(exportResponse.data, null, 2));
    }
    
  } catch (error: any) {
    console.error('❌ Error al probar endpoint de exportación:', error.message);
    if (error.response) {
      console.log('📝 Status:', error.response.status);
      console.log('📝 Data:', error.response.data);
    }
  }
};

// Para usar en la consola del navegador:
// import { diagnoseExportEndpoints, testCurrentConfiguration } from './features/accounts/diagnose-export';
// diagnoseExportEndpoints();
// testCurrentConfiguration();
