import { Card, Button } from '@/components/ui';
import { useTemplates } from '../hooks';

interface TemplateDownloadProps {
  dataType: 'accounts' | 'journal_entries';
  className?: string;
}

export function TemplateDownload({ dataType, className = '' }: TemplateDownloadProps) {
  const { downloadTemplate, downloadAllTemplatesForType, isDownloading } = useTemplates();

  const getDataTypeLabel = (type: string) => {
    return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
  };

  const handleDownload = async (format: 'csv' | 'xlsx' | 'json') => {
    try {
      await downloadTemplate({ data_type: dataType, format });
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  const handleDownloadAll = async () => {
    try {
      await downloadAllTemplatesForType(dataType);
    } catch (error) {
      console.error('Error downloading all templates:', error);
    }
  };

  const templates = [
    {
      format: 'csv' as const,
      title: 'CSV',
      description: 'Formato simple compatible con Excel y herramientas de texto',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      format: 'xlsx' as const,
      title: 'Excel',
      description: 'Formato Excel con validaciones y documentación incluida',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      format: 'json' as const,
      title: 'JSON',
      description: 'Formato estructurado ideal para datos jerárquicos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Plantillas de Ejemplo - {getDataTypeLabel(dataType)}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Descarga plantillas con ejemplos para facilitar la preparación de tus datos
          </p>
        </div>
        
        <Button
          onClick={handleDownloadAll}
          disabled={isDownloading}
          variant="secondary"
          className="shrink-0"
        >
          {isDownloading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              Descargando...
            </div>
          ) : (
            'Descargar Todas'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.format}
            className={`relative border rounded-lg p-4 ${template.borderColor} ${template.bgColor} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start">
              <div className={`${template.color} mr-3 mt-1`}>
                {template.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${template.color}`}>
                  {template.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {template.description}
                </p>
                
                <Button
                  onClick={() => handleDownload(template.format)}
                  disabled={isDownloading}
                  variant="secondary"
                  size="sm"
                  className="mt-3 w-full"
                >
                  {isDownloading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                      Descargando...
                    </div>
                  ) : (
                    `Descargar ${template.title}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              💡 Consejos para usar las plantillas:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Las plantillas incluyen ejemplos de datos reales</li>
              <li>• Mantén la estructura de columnas tal como aparece</li>
              <li>• Los campos obligatorios están claramente marcados</li>
              <li>• Puedes eliminar las filas de ejemplo y agregar tus datos</li>
              {dataType === 'journal_entries' && (
                <li>• Los asientos deben estar balanceados (débitos = créditos)</li>
              )}
              {dataType === 'accounts' && (
                <li>• Los códigos de cuenta deben ser únicos</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
