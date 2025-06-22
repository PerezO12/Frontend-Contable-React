import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { ExportService } from '../../../shared/services/exportService';
import { diagnoseExportEndpoints, testCurrentConfiguration } from '../diagnose-export';

export const ExportTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testIds, setTestIds] = useState('1,2,3');
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  
  const { success, error: showError } = useToast();

  const runDiagnostic = async () => {
    setIsLoading(true);
    setTestResults('');
    
    // Capturar console.log
    const originalLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    try {
      await diagnoseExportEndpoints();
      await testCurrentConfiguration();
    } catch (error) {
      logs.push(`Error durante diagnóstico: ${error}`);
    } finally {
      console.log = originalLog;
      setTestResults(logs.join('\n'));
      setIsLoading(false);
    }
  };

  const testSimpleExport = async () => {
    setIsLoading(true);
    
    try {
      const ids = testIds.split(',').map(id => id.trim()).filter(id => id);
      
      if (ids.length === 0) {
        showError('Ingresa al menos un ID de cuenta');
        return;
      }

      const blob = await ExportService.exportByIds({
        table: 'accounts',
        format: selectedFormat,
        ids
      });

      const fileName = ExportService.generateFileName('test_cuentas', selectedFormat);
      ExportService.downloadBlob(blob, fileName);
      
      success(`Exportación exitosa: ${fileName}`);
      
    } catch (error) {
      console.error('Error en exportación de prueba:', error);
      showError(`Error en exportación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetTables = async () => {
    setIsLoading(true);
    
    try {
      const tables = await ExportService.getAvailableTables();
      
      const info = `Tablas disponibles (${tables.total_tables}):
${tables.tables.map(t => `- ${t.table_name}: ${t.display_name} (${t.total_records} registros)`).join('\n')}`;
      
      setTestResults(info);
      success('Información de tablas cargada exitosamente');
      
    } catch (error) {
      console.error('Error al obtener tablas:', error);
      showError(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetSchema = async () => {
    setIsLoading(true);
      try {
      const schema = await ExportService.getTableSchema('accounts');
      
      const info = `Esquema de tabla 'accounts':
Nombre: ${schema.display_name}
Descripción: ${schema.description || 'No disponible'}
Total de registros: ${schema.total_records}
Columnas disponibles (${schema.columns.length}):
${schema.columns.map((col: any) => `- ${col.name} (${col.data_type})`).join('\n')}`;
      
      setTestResults(info);
      success('Esquema cargado exitosamente');
      
    } catch (error) {
      console.error('Error al obtener esquema:', error);
      showError(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            🧪 Pruebas de Exportación de Cuentas
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Componente de prueba para verificar la funcionalidad de exportación
          </p>
        </div>

        <div className="card-body space-y-6">
          {/* Diagnóstico General */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Diagnóstico General</h3>
            <div className="flex space-x-3">
              <Button
                onClick={runDiagnostic}
                disabled={isLoading}
                variant="secondary"
              >
                {isLoading ? <Spinner size="sm" /> : '🔍'} Ejecutar Diagnóstico
              </Button>
              <Button
                onClick={testGetTables}
                disabled={isLoading}
                variant="secondary"
              >
                📋 Obtener Tablas
              </Button>
              <Button
                onClick={testGetSchema}
                disabled={isLoading}
                variant="secondary"
              >
                📊 Obtener Esquema
              </Button>
            </div>
          </div>

          {/* Prueba de Exportación Simple */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Exportación Simple</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IDs de Cuentas (separados por coma)
                </label>
                <Input
                  type="text"
                  value={testIds}
                  onChange={(e) => setTestIds(e.target.value)}
                  placeholder="1,2,3"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa IDs reales de cuentas existentes en tu base de datos
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formato
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  disabled={isLoading}
                  className="form-select w-full"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="xlsx">XLSX</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={testSimpleExport}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? <Spinner size="sm" /> : '📤'} Exportar
                </Button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {testResults && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Resultados</h3>
              <div className="bg-gray-50 border rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {testResults}
                </pre>
              </div>
            </div>
          )}

          {/* Información de Estado */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">ℹ️ Información</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Este componente es solo para pruebas y diagnóstico</li>
              <li>• Los endpoints se prueban contra: <code className="bg-blue-100 px-1 rounded">http://localhost:8000/api/v1/export</code></li>
              <li>• Asegúrate de que el backend esté ejecutándose</li>
              <li>• Los errores 401 indican problemas de autenticación</li>
              <li>• Los errores 404 indican que el endpoint no existe</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
