/**
 * Modal para importar pagos desde archivo o datos manuales
 */
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usePaymentStore } from '../stores/paymentStore';
import { useToast } from '@/shared/contexts/ToastContext';
import type { PaymentFlowImportRequest, FileImportRequest } from '../types';

interface PaymentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentImportModal({ isOpen, onClose, onSuccess }: PaymentImportModalProps) {
  const { showToast } = useToast();
  const { importBankStatement, importFromFile, importProgress, loading } = usePaymentStore();
  
  const [importType, setImportType] = useState<'manual' | 'file'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [extractReference, setExtractReference] = useState('');
  const [manualData, setManualData] = useState({
    reference: '',
    lines: [
      {
        transaction_date: '',
        amount: 0,
        description: '',
        reference: '',
        partner_name: ''
      }
    ]
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-generar referencia basada en el nombre del archivo
      const timestamp = new Date().toISOString().slice(0, 10);
      setExtractReference(`${selectedFile.name.split('.')[0]}_${timestamp}`);
    }
  };

  const handleManualImport = async () => {
    if (!manualData.reference.trim()) {
      showToast('Debe ingresar una referencia para el extracto', 'error');
      return;
    }

    if (manualData.lines.some(line => !line.transaction_date || line.amount === 0)) {
      showToast('Todos los campos de las líneas son obligatorios', 'error');
      return;
    }

    try {
      const importRequest: PaymentFlowImportRequest = {
        bank_extract: {
          reference: manualData.reference,
          lines: manualData.lines.map(line => ({
            ...line,
            amount: Number(line.amount)
          }))
        }
      };

      const result = await importBankStatement(importRequest);
      
      showToast(
        `Importación exitosa: ${result.payments_created} pagos creados, ${result.auto_matched_lines} líneas auto-vinculadas`,
        'success'
      );
      
      onSuccess();
    } catch (error: any) {
      showToast(error.message || 'Error al importar extracto', 'error');
    }
  };

  const handleFileImport = async () => {
    if (!file) {
      showToast('Debe seleccionar un archivo', 'error');
      return;
    }

    if (!extractReference.trim()) {
      showToast('Debe ingresar una referencia para el extracto', 'error');
      return;
    }

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const format = fileExtension === 'xlsx' || fileExtension === 'xls' ? 'excel' : 'csv';

      const importRequest: FileImportRequest = {
        file,
        format,
        extract_reference: extractReference
      };

      const result = await importFromFile(importRequest);
      
      showToast(
        `Archivo importado exitosamente: ${result.payments_created} pagos creados, ${result.auto_matched_lines} líneas auto-vinculadas`,
        'success'
      );
      
      onSuccess();
    } catch (error: any) {
      showToast(error.message || 'Error al importar archivo', 'error');
    }
  };

  const addManualLine = () => {
    setManualData(prev => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          transaction_date: '',
          amount: 0,
          description: '',
          reference: '',
          partner_name: ''
        }
      ]
    }));
  };

  const removeManualLine = (index: number) => {
    if (manualData.lines.length > 1) {
      setManualData(prev => ({
        ...prev,
        lines: prev.lines.filter((_, i) => i !== index)
      }));
    }
  };

  const updateManualLine = (index: number, field: string, value: string | number) => {
    setManualData(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form
      setFile(null);
      setExtractReference('');
      setManualData({
        reference: '',
        lines: [
          {
            transaction_date: '',
            amount: 0,
            description: '',
            reference: '',
            partner_name: ''
          }
        ]
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importar Pagos">
      <div className="space-y-6">
        {/* Selector de tipo de importación */}
        <div className="flex space-x-4">
          <button
            onClick={() => setImportType('file')}
            className={`px-4 py-2 rounded-lg border ${
              importType === 'file'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-300 text-gray-700'
            }`}
          >
            Importar desde Archivo
          </button>
          <button
            onClick={() => setImportType('manual')}
            className={`px-4 py-2 rounded-lg border ${
              importType === 'manual'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-300 text-gray-700'
            }`}
          >
            Ingreso Manual
          </button>
        </div>

        {/* Progreso de importación */}
        {importProgress && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <LoadingSpinner />
              <div>
                <div className="text-sm font-medium text-blue-900">
                  {importProgress.message}
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Importación desde archivo */}
        {importType === 'file' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo de extracto bancario
              </label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={loading}
              />
              <div className="text-xs text-gray-500 mt-1">
                Formatos soportados: CSV, Excel (.xlsx, .xls)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia del extracto
              </label>
              <Input
                value={extractReference}
                onChange={(e) => setExtractReference(e.target.value)}
                placeholder="Ej: Extracto_Banco_2024_01"
                disabled={loading}
              />
              <div className="text-xs text-gray-500 mt-1">
                Identificador único para este extracto bancario
              </div>
            </div>

            <Button
              onClick={handleFileImport}
              disabled={!file || !extractReference.trim() || loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner />
                  <span>Importando...</span>
                </div>
              ) : (
                'Importar Archivo'
              )}
            </Button>
          </div>
        )}

        {/* Ingreso manual */}
        {importType === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia del extracto
              </label>
              <Input
                value={manualData.reference}
                onChange={(e) => setManualData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="Ej: Extracto_Manual_2024_01"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Líneas del extracto
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addManualLine}
                  disabled={loading}
                >
                  Agregar Línea
                </Button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {manualData.lines.map((line, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Línea {index + 1}</span>
                      {manualData.lines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeManualLine(index)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="date"
                          value={line.transaction_date}
                          onChange={(e) => updateManualLine(index, 'transaction_date', e.target.value)}
                          placeholder="Fecha"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          step="0.01"
                          value={line.amount}
                          onChange={(e) => updateManualLine(index, 'amount', Number(e.target.value))}
                          placeholder="Monto"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Input
                          value={line.partner_name}
                          onChange={(e) => updateManualLine(index, 'partner_name', e.target.value)}
                          placeholder="Partner/Cliente"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Input
                          value={line.reference}
                          onChange={(e) => updateManualLine(index, 'reference', e.target.value)}
                          placeholder="Referencia"
                          disabled={loading}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={line.description}
                          onChange={(e) => updateManualLine(index, 'description', e.target.value)}
                          placeholder="Descripción"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleManualImport}
              disabled={!manualData.reference.trim() || loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner />
                  <span>Importando...</span>
                </div>
              ) : (
                'Importar Datos'
              )}
            </Button>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">ℹ️ Información</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Los pagos se crearán en estado BORRADOR</li>
            <li>• El sistema intentará auto-vincular con facturas existentes</li>
            <li>• Puede confirmar los pagos después de revisar las vinculaciones</li>
            <li>• Las referencias duplicadas serán rechazadas</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
