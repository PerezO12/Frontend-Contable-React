import { useState, useEffect } from 'react';
import { GenericImportService } from '../services/GenericImportService';
import { TemplateDownloadButton } from './TemplateDownloadButton';

interface TemplateInfoCardProps {
  modelName: string;
  className?: string;
}

const MODEL_INFO = {
  third_party: {
    title: 'Terceros',
    description: 'Clientes, proveedores, empleados y otros terceros',
    fields: ['Código', 'Nombre Completo', 'Documento', 'Email', 'Teléfono', 'Dirección'],
    examples: 'Empresas, personas naturales, bancos, empleados',
    icon: '👥',
  },
  product: {
    title: 'Productos',
    description: 'Inventario de productos y servicios',
    fields: ['Código', 'Nombre', 'Descripción', 'Precios', 'Stock', 'Categorías'],
    examples: 'Productos físicos, servicios, productos mixtos',
    icon: '📦',
  },
  account: {
    title: 'Cuentas Contables',
    description: 'Plan de cuentas contables',
    fields: ['Código', 'Nombre', 'Tipo de Cuenta', 'Nivel', 'Configuración'],
    examples: 'Activos, pasivos, ingresos, gastos, patrimonio',
    icon: '💰',
  },
  invoice: {
    title: 'Facturas',
    description: 'Facturas de venta y compra con líneas de detalle',
    fields: ['Número', 'Tipo', 'Tercero', 'Fecha', 'Líneas de Producto'],
    examples: 'Facturas de venta, compra, notas de crédito/débito',
    icon: '🧾',
  },
} as const;

export function TemplateInfoCard({ modelName, className = '' }: TemplateInfoCardProps) {
  const [isTemplateAvailable, setIsTemplateAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);

  const modelInfo = MODEL_INFO[modelName as keyof typeof MODEL_INFO];

  useEffect(() => {
    const checkTemplateAvailability = async () => {
      setIsCheckingAvailability(true);
      try {
        const available = await GenericImportService.isTemplateAvailable(modelName);
        setIsTemplateAvailable(available);
      } catch {
        setIsTemplateAvailable(false);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    checkTemplateAvailability();
  }, [modelName]);

  if (!modelInfo) {
    return null;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="text-2xl">{modelInfo.icon}</div>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            💡 ¿No sabes cómo estructurar tu archivo?
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            Descarga nuestra <strong>plantilla de ejemplo</strong> con datos válidos que puedes importar directamente.
          </p>
          
          <div className="space-y-2 mb-4">
            <div>
              <span className="text-xs font-medium text-blue-800">Incluye campos:</span>
              <p className="text-xs text-blue-600">
                {modelInfo.fields.join(' • ')}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-blue-800">Ejemplos incluidos:</span>
              <p className="text-xs text-blue-600">
                {modelInfo.examples}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isCheckingAvailability ? (
              <div className="flex items-center text-xs text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border border-blue-400 border-t-transparent mr-2"></div>
                Verificando disponibilidad...
              </div>
            ) : isTemplateAvailable ? (
              <TemplateDownloadButton
                modelName={modelName}
                variant="primary"
                size="sm"
              />
            ) : (
              <div className="text-xs text-gray-500">
                Plantilla no disponible
              </div>
            )}
            
            <div className="text-xs text-blue-600">
              <span className="font-medium">✅ Garantía:</span> Los datos de ejemplo se importan sin errores
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
