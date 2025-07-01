export interface ExportParams {
  format: 'csv' | 'xlsx' | 'json';
  filters?: Record<string, any>;
  scope?: 'all' | 'selected';
  selectedIds?: string[];
  includeFilters?: boolean;
  [key: string]: any;
}

export interface ExportResponse {
  success: boolean;
  message?: string;
  downloadUrl?: string;
  filename?: string;
  data?: any; // Para JSON directo
}

export class ExportService {

  private static async downloadJson(data: any, filename: string) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  }

  /**
   * Exportar datos genérico
   */
  static async exportData(
    endpoint: string,
    params: ExportParams,
    entityName: string = 'datos'
  ): Promise<void> {
    try {
      // Para productos, usar GET con query parameters (compatibilidad backend)
      const isProductsEndpoint = endpoint.includes('/products/export');
      
      if (isProductsEndpoint) {
        // Preparar parámetros de consulta para productos
        const queryParams = new URLSearchParams();
        queryParams.append('format', params.format);
        
        // Agregar IDs seleccionados si es necesario
        if (params.scope === 'selected' && params.selectedIds && params.selectedIds.length > 0) {
          queryParams.append('ids', params.selectedIds.join(','));
        }
        
        // Agregar nombre de archivo si está especificado
        if (params.file_name) {
          queryParams.append('file_name', params.file_name);
        }

        const url = `${endpoint}?${queryParams.toString()}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': params.format === 'csv' ? 'text/csv' : 
                     params.format === 'json' ? 'application/json' :
                     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al exportar: ${response.statusText}`);
        }

        if (params.format === 'json') {
          const data = await response.json();
          const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
          const filename = `${entityName}_${timestamp}.json`;
          await this.downloadJson(data, filename);
        } else {
          // Para CSV y XLSX, descargar directamente el archivo
          const contentDisposition = response.headers.get('content-disposition');
          let filename = `${entityName}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${params.format}`;
          
          if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
          }

          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          window.URL.revokeObjectURL(downloadUrl);
        }
        return;
      }

      // Para otros endpoints, usar POST (método original)
      // Preparar parámetros de consulta para el formato
      const queryParams = new URLSearchParams();
      queryParams.append('format', params.format);
      
      // Preparar el cuerpo de la petición
      const body: any = {};
      
      // Agregar filtros si están incluidos
      if (params.includeFilters && params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            body[key] = value;
          }
        });
      }
      
      // Agregar IDs seleccionados si es necesario
      if (params.scope === 'selected' && params.selectedIds && params.selectedIds.length > 0) {
        body.ids = params.selectedIds;
      }
      
      // Agregar otros parámetros
      Object.entries(params).forEach(([key, value]) => {
        if (!['format', 'filters', 'scope', 'selectedIds', 'includeFilters'].includes(key)) {
          if (value !== undefined && value !== null && value !== '') {
            body[key] = value;
          }
        }
      });

      const url = `${endpoint}?${queryParams.toString()}`;
      
      if (params.format === 'json') {
        // Para JSON, obtener los datos y descargar como archivo
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          throw new Error(`Error al exportar: ${response.statusText}`);
        }
        
        const data = await response.json();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `${entityName}_${timestamp}.json`;
        await this.downloadJson(data, filename);
      } else {
        // Para CSV y XLSX, descargar directamente el archivo
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': params.format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`Error al exportar: ${response.statusText}`);
        }

        // Obtener nombre del archivo desde el header o generar uno
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `${entityName}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${params.format}`;
        
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(downloadUrl);
      }

    } catch (error) {
      console.error('Error en exportación:', error);
      throw new Error(`Error al exportar ${entityName}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exportar productos usando el sistema genérico de exportación
   */
  static async exportProducts(params: ExportParams): Promise<void> {
    // Usar el endpoint genérico de exportación con tabla 'products'
    const body = {
      table: 'products',
      format: params.format,
      ids: params.selectedIds || [],
      file_name: params.file_name
    };

    try {
      const response = await fetch('/api/v1/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': params.format === 'csv' ? 'text/csv' : 
                   params.format === 'json' ? 'application/json' :
                   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Error al exportar: ${response.statusText}`);
      }

      if (params.format === 'json') {
        const data = await response.json();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `productos_${timestamp}.json`;
        await this.downloadJson(data, filename);
      } else {
        // Para CSV y XLSX, descargar directamente el archivo
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `productos_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${params.format}`;
        
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error al exportar productos:', error);
      throw new Error(`Error al exportar productos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exportar terceros
   */
  static async exportThirdParties(params: ExportParams): Promise<void> {
    // Usar el endpoint genérico de exportación con tabla 'third_parties'
    const body = {
      table: 'third_parties',
      format: params.format,
      ids: params.selectedIds || [],
      file_name: params.file_name
    };

    try {
      const response = await fetch('/api/v1/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': params.format === 'csv' ? 'text/csv' : 
                   params.format === 'json' ? 'application/json' :
                   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Error al exportar: ${response.statusText}`);
      }

      if (params.format === 'json') {
        const data = await response.json();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `terceros_${timestamp}.json`;
        await this.downloadJson(data, filename);
      } else {
        // Para CSV y XLSX, descargar directamente el archivo
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `terceros_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${params.format}`;
        
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error al exportar terceros:', error);
      throw new Error(`Error al exportar terceros: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exportar cuentas
   */
  static async exportAccounts(params: ExportParams): Promise<void> {
    // Usar el endpoint genérico de exportación con tabla 'accounts'
    const body = {
      table: 'accounts',
      format: params.format,
      ids: params.selectedIds || [],
      file_name: params.file_name
    };

    try {
      const response = await fetch('/api/v1/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': params.format === 'csv' ? 'text/csv' : 
                   params.format === 'json' ? 'application/json' :
                   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Error al exportar: ${response.statusText}`);
      }

      if (params.format === 'json') {
        const data = await response.json();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `cuentas_${timestamp}.json`;
        await this.downloadJson(data, filename);
      } else {
        // Para CSV y XLSX, descargar directamente el archivo
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `cuentas_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${params.format}`;
        
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error al exportar cuentas:', error);
      throw new Error(`Error al exportar cuentas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exportar centros de costo
   */
  static async exportCostCenters(params: ExportParams): Promise<void> {
    // Usar el endpoint genérico de exportación con tabla 'cost_centers'
    const body = {
      table: 'cost_centers',
      format: params.format,
      ids: params.selectedIds || [],
      file_name: params.file_name
    };

    try {
      const response = await fetch('/api/v1/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': params.format === 'csv' ? 'text/csv' : 
                   params.format === 'json' ? 'application/json' :
                   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Error al exportar: ${response.statusText}`);
      }

      if (params.format === 'json') {
        const data = await response.json();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `centros_de_costo_${timestamp}.json`;
        await this.downloadJson(data, filename);
      } else {
        // Para CSV y XLSX, descargar directamente el archivo
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `centros_de_costo_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${params.format}`;
        
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Error al exportar centros de costo:', error);
      throw new Error(`Error al exportar centros_de_costo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exportar asientos contables
   */
  static async exportJournalEntries(params: ExportParams): Promise<void> {
    return ExportService.exportData('/api/v1/export/journal-entries/export', params, 'asientos_contables');
  }

  /**
   * Exportar facturas
   */
  static async exportInvoices(params: ExportParams): Promise<void> {
    return ExportService.exportData('/api/invoices/export', params, 'facturas');
  }

  /**
   * Exportar diarios
   */
  static async exportJournals(params: ExportParams): Promise<void> {
    return ExportService.exportData('/api/v1/journals/export', params, 'diarios');
  }
}
