import { useState, useCallback } from 'react';
import { DataImportService } from '../services';
import type { TemplateDownload } from '../types';
import { useToast } from '@/shared/hooks';
import { downloadBlob, generateUniqueFilename, getMimeTypeForFormat } from '../utils';

interface UseTemplatesState {
  isLoading: boolean;
  availableTemplates: any;
  isDownloading: boolean;
}

const initialState: UseTemplatesState = {
  isLoading: false,
  availableTemplates: null,
  isDownloading: false,
};

export function useTemplates() {
  const [state, setState] = useState<UseTemplatesState>(initialState);
  const { success, error } = useToast();

  /**
   * Obtiene las plantillas disponibles
   */
  const getAvailableTemplates = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const templates = await DataImportService.getAvailableTemplates();
      setState(prev => ({
        ...prev,
        isLoading: false,
        availableTemplates: templates
      }));
      return templates;
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      error('Error', 'Error al cargar las plantillas disponibles');
      throw err;
    }
  }, [error]);

  /**
   * Descarga una plantilla
   */
  const downloadTemplate = useCallback(async (templateData: TemplateDownload) => {
    setState(prev => ({ ...prev, isDownloading: true }));

    try {
      const blob = await DataImportService.downloadTemplate(templateData);
      
      // Generar nombre de archivo
      const fileExtension = templateData.format === 'xlsx' ? 'xlsx' : templateData.format;
      const filename = generateUniqueFilename(
        `plantilla_${templateData.data_type}.${fileExtension}`,
        'ejemplo'
      );

      // Descargar archivo
      downloadBlob(blob, filename);

      setState(prev => ({ ...prev, isDownloading: false }));
      
      success(
        'Plantilla descargada',
        `Plantilla ${templateData.format.toUpperCase()} descargada correctamente`
      );

    } catch (err) {
      setState(prev => ({ ...prev, isDownloading: false }));
      error('Error de descarga', 'Error al descargar la plantilla');
      throw err;
    }
  }, [success, error]);

  /**
   * Obtiene información de una plantilla específica
   */
  const getTemplateInfo = useCallback(async (
    dataType: 'accounts' | 'journal_entries',
    format: 'csv' | 'xlsx' | 'json'
  ) => {
    try {
      const info = await DataImportService.getTemplateInfo(dataType, format);
      return info;
    } catch (err) {
      error('Error', 'Error al obtener información de la plantilla');
      throw err;
    }
  }, [error]);

  /**
   * Descarga todas las plantillas para un tipo de datos
   */
  const downloadAllTemplatesForType = useCallback(async (
    dataType: 'accounts' | 'journal_entries'
  ) => {
    const formats: ('csv' | 'xlsx' | 'json')[] = ['csv', 'xlsx', 'json'];
    
    setState(prev => ({ ...prev, isDownloading: true }));

    try {
      for (const format of formats) {
        await downloadTemplate({ data_type: dataType, format });
        // Pequeña pausa entre descargas
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      success(
        'Descarga completa',
        `Todas las plantillas para ${dataType} han sido descargadas`
      );

    } catch (err) {
      error('Error', 'Error al descargar algunas plantillas');
    } finally {
      setState(prev => ({ ...prev, isDownloading: false }));
    }
  }, [downloadTemplate, success, error]);

  /**
   * Genera una plantilla personalizada con datos de ejemplo
   */
  const generateCustomTemplate = useCallback((
    dataType: 'accounts' | 'journal_entries',
    format: 'csv' | 'json',
    sampleData?: any[]
  ) => {
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'csv') {
        // Generar CSV con datos de ejemplo
        const headers = getTemplateHeaders(dataType);
        const data = sampleData || getDefaultSampleData(dataType);
        content = convertToCSV(data, headers);
        filename = `plantilla_${dataType}_personalizada.csv`;
        mimeType = getMimeTypeForFormat('csv');
      } else {
        // Generar JSON con estructura completa
        const templateStructure = {
          template_info: {
            data_type: dataType,
            format: 'json',
            description: `Plantilla personalizada para ${dataType}`,
            created_at: new Date().toISOString(),
          },
          data: sampleData || getDefaultSampleData(dataType)
        };
        content = JSON.stringify(templateStructure, null, 2);
        filename = `plantilla_${dataType}_personalizada.json`;
        mimeType = getMimeTypeForFormat('json');
      }

      // Crear y descargar archivo
      const blob = new Blob([content], { type: mimeType });
      downloadBlob(blob, filename);

      success('Plantilla generada', 'Plantilla personalizada generada correctamente');

    } catch (err) {
      error('Error', 'Error al generar plantilla personalizada');
    }
  }, [success, error]);

  return {
    // Estado
    ...state,
    
    // Acciones
    getAvailableTemplates,
    downloadTemplate,
    getTemplateInfo,
    downloadAllTemplatesForType,
    generateCustomTemplate,
  };
}

// Funciones auxiliares
function getTemplateHeaders(dataType: 'accounts' | 'journal_entries'): string[] {
  if (dataType === 'accounts') {
    return [
      'code', 'name', 'account_type', 'category', 'parent_code',
      'description', 'is_active', 'allows_movements', 'requires_third_party',
      'requires_cost_center', 'notes'
    ];
  } else {
    return [
      'entry_number', 'entry_date', 'description', 'reference', 'entry_type',
      'account_code', 'line_description', 'debit_amount', 'credit_amount',
      'third_party', 'cost_center', 'line_reference'
    ];
  }
}

function getDefaultSampleData(dataType: 'accounts' | 'journal_entries'): any[] {
  if (dataType === 'accounts') {
    return [
      {
        code: '1105',
        name: 'Caja General',
        account_type: 'ACTIVO',
        category: 'ACTIVO_CORRIENTE',
        parent_code: '1100',
        description: 'Dinero en efectivo en caja principal',
        is_active: true,
        allows_movements: true,
        requires_third_party: false,
        requires_cost_center: false,
        notes: 'Cuenta para manejo de efectivo'
      }
    ];
  } else {
    return [
      {
        entry_number: 'AST-2024-001',
        entry_date: '2024-01-15',
        description: 'Compra de material de oficina',
        reference: 'FAC-001234',
        entry_type: 'MANUAL',
        account_code: '5105',
        line_description: 'Material de oficina - papelería',
        debit_amount: 150000,
        credit_amount: '',
        third_party: 'PAPELERIA ABC LTDA',
        cost_center: 'ADMIN',
        line_reference: 'FAC-001234'
      }
    ];
  }
}

function convertToCSV(data: any[], headers: string[]): string {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}
