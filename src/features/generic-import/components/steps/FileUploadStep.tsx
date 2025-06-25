import { useRef, useState } from 'react';
import { GenericImportService } from '../../services/GenericImportService';

interface FileUploadStepProps {
  onFileUpload: (file: File) => Promise<void>;
  isLoading: boolean;
  selectedModel: string;
}

export function FileUploadStep({
  onFileUpload,
  isLoading,
  selectedModel,
}: FileUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileSelect = (file: File) => {
    const validation = GenericImportService.validateFile(file);
    
    if (validation.isValid) {
      setSelectedFile(file);
      setValidationErrors([]);
    } else {
      setSelectedFile(null);
      setValidationErrors(validation.errors);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onFileUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    return GenericImportService.formatFileSize(bytes);
  };

  const detectFileFormat = (filename: string): string => {
    const format = GenericImportService.detectFileFormat(filename);
    const formatNames = {
      csv: 'CSV',
      xlsx: 'Excel',
      json: 'JSON',
      unknown: 'Desconocido'
    };
    return formatNames[format];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Subir Archivo de Datos
        </h3>
        <p className="text-sm text-gray-600">
          Suba un archivo CSV, XLSX o JSON con los datos para importar al modelo {selectedModel}.
        </p>
      </div>

      {/* Zona de arrastre */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {dragActive
                  ? 'Suelte el archivo aquí'
                  : 'Arrastre un archivo aquí o haga clic para seleccionar'}
              </span>
            </label>
            <input
              id="file-upload"
              ref={fileInputRef}
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            CSV, XLSX o JSON hasta 10MB
          </p>
        </div>
      </div>

      {/* Errores de validación */}
      {validationErrors.length > 0 && (
        <div className="border border-red-200 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error en el archivo seleccionado
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información del archivo seleccionado */}
      {selectedFile && validationErrors.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-green-800">
                Archivo válido seleccionado
              </h3>
              <div className="mt-2 space-y-1 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Nombre:</span>
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tamaño:</span>
                  <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Formato:</span>
                  <span className="font-medium">{detectFileFormat(selectedFile.name)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de subida */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando archivo...
                </>
              ) : (
                'Subir y Analizar Archivo'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Requisitos del archivo
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• El archivo debe tener una fila de encabezados con los nombres de columnas</li>
          <li>• Los datos deben estar en formato tabular (filas y columnas)</li>
          <li>• Tamaño máximo: 10MB</li>
          <li>• Formatos soportados: CSV, XLSX, JSON</li>
          <li>• Para CSV: use UTF-8 como codificación</li>
        </ul>
      </div>
    </div>
  );
}
