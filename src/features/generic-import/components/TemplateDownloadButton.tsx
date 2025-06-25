import { useState } from 'react';
import { GenericImportService } from '../services/GenericImportService';

interface TemplateDownloadButtonProps {
  modelName: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function TemplateDownloadButton({
  modelName,
  className = '',
  variant = 'outline',
  size = 'md',
  disabled = false,
}: TemplateDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (isDownloading || disabled) return;

    setIsDownloading(true);
    setError(null);

    try {
      await GenericImportService.downloadTemplate(modelName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar la plantilla');
      console.error('Error downloading template:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Definir estilos basados en la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600';
      case 'outline':
      default:
        return 'bg-white text-blue-600 hover:bg-blue-50 border-blue-600';
    }
  };

  // Definir estilos basados en el tamaño
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseStyles = 'inline-flex items-center justify-center border font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const finalClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading || disabled}
        className={finalClassName}
        title={`Descargar plantilla CSV para ${modelName}`}
      >
        {isDownloading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
            Descargando...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Descargar Plantilla
          </>
        )}
      </button>

      {/* Mostrar error si ocurre */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          <div className="flex items-center">
            <svg
              className="h-4 w-4 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
