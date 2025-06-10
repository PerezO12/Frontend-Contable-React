import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui';
import { useDataImport } from '../hooks';
import type { ImportFileUpload } from '../types';
import { formatFileSize, validateFileFormat } from '../utils';

interface FileUploadProps {
  onFileUploaded: (file: File, previewData: any) => void;
  dataType: 'accounts' | 'journal_entries';
  validationLevel?: 'strict' | 'tolerant' | 'preview';
  className?: string;
}

export function FileUpload({
  onFileUploaded,
  dataType,
  validationLevel = 'preview',
  className = ''
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadAndPreview, isLoading, errors } = useDataImport();

  const allowedFormats = ['csv', 'xlsx', 'json'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileUpload = useCallback(async (file: File) => {
    // Validar formato y tamaño
    const formatErrors = validateFileFormat(file, allowedFormats);
    if (formatErrors.length > 0) {
      alert(formatErrors.map(e => e.message).join('\n'));
      return;
    }

    if (file.size > maxFileSize) {
      alert(`El archivo es demasiado grande. Tamaño máximo: ${formatFileSize(maxFileSize)}`);
      return;
    }

    try {
      setUploadProgress(0);
      
      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);      const uploadData: ImportFileUpload = {
        file,
        data_type: dataType,
        validation_level: validationLevel,
        preview_rows: 10,
      };      
      console.log('Upload data:', uploadData);
      console.log('Data type:', dataType);
      console.log('Validation level:', validationLevel);

      const previewData = await uploadAndPreview(uploadData);
      
      console.log('Preview data received:', previewData);
      console.log('Preview data type:', typeof previewData);
      console.log('Preview data keys:', previewData ? Object.keys(previewData) : 'null/undefined');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
        // Limpiar progreso después de un momento
      setTimeout(() => setUploadProgress(0), 1000);
      
      onFileUploaded(file, previewData);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
      
      setUploadProgress(0);
    }
  }, [uploadAndPreview, onFileUploaded, dataType, validationLevel, allowedFormats, maxFileSize]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  }, [handleFileUpload]);

  const getDataTypeLabel = (type: string) => {
    return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Cargar Archivo de {getDataTypeLabel(dataType)}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Seleccione o arrastre un archivo para importar datos
        </p>
      </div>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Procesando archivo...</p>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              Arrastra tu archivo aquí o{' '}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                selecciona un archivo
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileInput}
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">
              Formatos soportados: {allowedFormats.map(f => f.toUpperCase()).join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Tamaño máximo: {formatFileSize(maxFileSize)}
            </p>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Errores de validación encontrados:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.slice(0, 5).map((error, index) => (
              <li key={index}>
                • Fila {error.row_number}: {error.message}
              </li>
            ))}
            {errors.length > 5 && (
              <li className="text-red-600 font-medium">
                ... y {errors.length - 5} errores más
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          💡 Consejos para una importación exitosa:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Descarga y usa las plantillas de ejemplo proporcionadas</li>
          <li>• Verifica que todos los campos obligatorios estén completos</li>
          <li>• Asegúrate de que los códigos de cuenta sean únicos</li>
          {dataType === 'journal_entries' && (
            <li>• Los asientos deben estar balanceados (débitos = créditos)</li>
          )}
        </ul>
      </div>
    </Card>
  );
}
