// Test para probar la funcionalidad de exportación
import { ExportService } from '../../shared/services/exportService';

// Función de prueba para exportar cuentas
export const testAccountExport = async () => {
  try {
    console.log('🧪 Iniciando prueba de exportación...');
    
    // Datos de prueba - reemplaza estos IDs con IDs reales de tu base de datos
    const testRequest = {
      table: 'accounts',
      format: 'csv' as const,
      ids: ['1', '2', '3'] // Reemplaza con IDs reales
    };

    console.log('📤 Enviando solicitud:', testRequest);
    
    const blob = await ExportService.exportByIds(testRequest);
    
    console.log('✅ Exportación exitosa!');
    console.log('📊 Tamaño del archivo:', blob.size, 'bytes');
    console.log('🎯 Tipo de contenido:', blob.type);
    
    // Descargar el archivo automáticamente
    const fileName = ExportService.generateFileName('cuentas_test', 'csv');
    ExportService.downloadBlob(blob, fileName);
    
    return true;
  } catch (error) {
    console.error('❌ Error en la exportación:', error);
    
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
    }
      // Si es un error de respuesta del servidor
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as any;
      console.error('Status:', responseError.response?.status);
      console.error('Data:', responseError.response?.data);
    }
    
    return false;
  }
};

// Función para probar el esquema de exportación
export const testExportSchema = async () => {
  try {
    console.log('🧪 Probando esquema de exportación...');    
    const schema = await ExportService.getTableSchema('accounts');
    
    console.log('✅ Esquema obtenido exitosamente!');
    console.log('📋 Tabla:', schema.table_name);
    console.log('📊 Total de registros:', schema.total_records);
    console.log('🏷️ Columnas disponibles:', schema.columns.length);
    console.log('📝 Columnas:', schema.columns.map((col: any) => col.name).join(', '));
    
    return schema;
  } catch (error) {
    console.error('❌ Error al obtener esquema:', error);
    return null;
  }
};

// Función para probar tablas disponibles
export const testAvailableTables = async () => {
  try {
    console.log('🧪 Probando tablas disponibles...');
    
    const result = await ExportService.getAvailableTables();
    
    console.log('✅ Tablas obtenidas exitosamente!');
    console.log('📊 Total de tablas:', result.total_tables);
    console.log('📋 Tablas disponibles:');
    
    result.tables.forEach(table => {
      console.log(`  - ${table.table_name}: ${table.display_name} (${table.total_records} registros)`);
    });
    
    return result;
  } catch (error) {
    console.error('❌ Error al obtener tablas:', error);
    return null;
  }
};

// Exportar todas las funciones de prueba
export const exportTests = {
  testAccountExport,
  testExportSchema,
  testAvailableTables
};

// Para usar en la consola del navegador:
// Importa este archivo en tu componente o página y ejecuta:
// exportTests.testAvailableTables();
// exportTests.testExportSchema();
// exportTests.testAccountExport(); // Solo si tienes IDs de cuentas válidos
