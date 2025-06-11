// ==========================================
// Utilidades para exportación desde el cliente (frontend)
// ==========================================

import type { ReportResponse, AccountReportItem } from '../types';

// ==========================================
// Tipos para exportación
// ==========================================

export interface ExportOptions {
  includeNarrative?: boolean;
  includeMetadata?: boolean;
  customFilename?: string;
}

// ==========================================
// Utilidades de formateo
// ==========================================

const formatCurrency = (amount: string): string => {
  const numAmount = parseFloat(amount.replace(/,/g, ''));
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getReportTitle = (reportType: string): string => {
  const titles = {
    'balance_general': 'Balance General',
    'p_g': 'Estado de Pérdidas y Ganancias',
    'flujo_efectivo': 'Estado de Flujo de Efectivo',
    'balance_comprobacion': 'Balance de Comprobación'
  };
  return titles[reportType as keyof typeof titles] || 'Reporte Financiero';
};

// ==========================================
// Utilidades de descarga
// ==========================================

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const generateFilename = (reportType: string, format: string, date?: string): string => {
  const dateStr = date || new Date().toISOString().split('T')[0];
  const typeNames: Record<string, string> = {
    'balance_general': 'balance-general',
    'p_g': 'perdidas-ganancias',
    'flujo_efectivo': 'flujo-efectivo',
    'balance_comprobacion': 'balance-comprobacion'
  };
  
  const typeName = typeNames[reportType] || reportType;
  return `${typeName}-${dateStr}.${format}`;
};

// ==========================================
// Exportación a CSV
// ==========================================

export const exportToCSV = (report: ReportResponse, options: ExportOptions = {}): void => {
  const lines: string[] = [];
  
  // Metadatos del reporte
  if (options.includeMetadata !== false) {
    lines.push(`"${getReportTitle(report.report_type)}"`);
    lines.push(`"Empresa: ${report.project_context}"`);
    lines.push(`"Período: ${formatDate(report.period.from_date)} - ${formatDate(report.period.to_date)}"`);
    lines.push(`"Generado: ${formatDate(report.generated_at)}"`);
    lines.push('');
  }

  // Secciones del reporte
  if (report.table && report.table.sections) {
    report.table.sections.forEach(section => {
      lines.push(`"${section.section_name}"`);
      lines.push('"Código","Cuenta","Saldo Inicial","Movimientos","Saldo Final"');
      
      const flattenedItems = flattenAccountItems(section.items || []);
      flattenedItems.forEach(item => {
        const indent = '  '.repeat(item.level || 0);
        lines.push(`"${item.account_code}","${indent}${item.account_name}","${item.opening_balance}","${item.movements}","${item.closing_balance}"`);
      });
      
      if (section.total) {
        lines.push(`"","TOTAL ${section.section_name}","","","${section.total}"`);
      }
      lines.push('');
    });
  }

  // Totales generales
  if (report.table && report.table.totals && Object.keys(report.table.totals).length > 0) {
    lines.push('"RESUMEN GENERAL"');
    Object.entries(report.table.totals).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').toUpperCase();
      lines.push(`"${label}","${value}"`);
    });
    lines.push('');
  }

  // Narrativa (opcional)
  if (options.includeNarrative && report.narrative) {
    lines.push('"ANÁLISIS DEL REPORTE"');
    lines.push('');
    
    if (report.narrative.executive_summary) {
      lines.push('"Resumen Ejecutivo"');
      lines.push(`"${report.narrative.executive_summary}"`);
      lines.push('');
    }
    
    if (report.narrative.key_insights && report.narrative.key_insights.length > 0) {
      lines.push('"Insights Clave"');
      report.narrative.key_insights.forEach(insight => {
        lines.push(`"• ${insight}"`);
      });
      lines.push('');
    }
    
    if (report.narrative.recommendations && report.narrative.recommendations.length > 0) {
      lines.push('"Recomendaciones"');
      report.narrative.recommendations.forEach(recommendation => {
        lines.push(`"→ ${recommendation}"`);
      });
      lines.push('');
    }
  }

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = options.customFilename || generateFilename(report.report_type, 'csv');
  
  downloadBlob(blob, filename);
};

// ==========================================
// Exportación a Excel (XLSX)
// ==========================================

export const exportToExcel = async (report: ReportResponse, options: ExportOptions = {}): Promise<void> => {
  // Importar dinámicamente la librería XLSX
  const XLSX = await import('xlsx');
  
  const workbook = XLSX.utils.book_new();
  
  // Hoja principal del reporte
  const worksheetData: any[][] = [];
  
  // Metadatos
  if (options.includeMetadata !== false) {
    worksheetData.push([getReportTitle(report.report_type)]);
    worksheetData.push([`Empresa: ${report.project_context}`]);
    worksheetData.push([`Período: ${formatDate(report.period.from_date)} - ${formatDate(report.period.to_date)}`]);
    worksheetData.push([`Generado: ${formatDate(report.generated_at)}`]);
    worksheetData.push([]);
  }

  // Secciones del reporte
  if (report.table && report.table.sections) {
    report.table.sections.forEach(section => {
      worksheetData.push([section.section_name]);
      worksheetData.push(['Código', 'Cuenta', 'Saldo Inicial', 'Movimientos', 'Saldo Final']);
      
      const flattenedItems = flattenAccountItems(section.items || []);
      flattenedItems.forEach(item => {
        const indent = '  '.repeat(item.level || 0);
        worksheetData.push([
          item.account_code,
          indent + item.account_name,
          parseFloat(item.opening_balance.replace(/,/g, '')) || 0,
          parseFloat(item.movements.replace(/,/g, '')) || 0,
          parseFloat(item.closing_balance.replace(/,/g, '')) || 0
        ]);
      });
      
      if (section.total) {
        worksheetData.push([
          '',
          `TOTAL ${section.section_name}`,
          '',
          '',
          parseFloat(section.total.replace(/,/g, '')) || 0
        ]);
      }
      worksheetData.push([]);
    });
  }

  // Totales generales
  if (report.table && report.table.totals && Object.keys(report.table.totals).length > 0) {
    worksheetData.push(['RESUMEN GENERAL']);
    Object.entries(report.table.totals).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').toUpperCase();
      worksheetData.push([label, parseFloat(value.replace(/,/g, '')) || 0]);
    });
    worksheetData.push([]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Configurar estilos básicos y anchos de columna
  const columnWidths = [
    { wch: 15 }, // Código
    { wch: 40 }, // Cuenta
    { wch: 15 }, // Saldo Inicial
    { wch: 15 }, // Movimientos
    { wch: 15 }  // Saldo Final
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

  // Hoja de narrativa (si se incluye)
  if (options.includeNarrative && report.narrative) {
    const narrativeData: any[][] = [];
    
    narrativeData.push(['ANÁLISIS DEL REPORTE']);
    narrativeData.push([]);
    
    if (report.narrative.executive_summary) {
      narrativeData.push(['Resumen Ejecutivo']);
      narrativeData.push([report.narrative.executive_summary]);
      narrativeData.push([]);
    }
    
    if (report.narrative.key_insights && report.narrative.key_insights.length > 0) {
      narrativeData.push(['Insights Clave']);
      report.narrative.key_insights.forEach(insight => {
        narrativeData.push([`• ${insight}`]);
      });
      narrativeData.push([]);
    }
    
    if (report.narrative.recommendations && report.narrative.recommendations.length > 0) {
      narrativeData.push(['Recomendaciones']);
      report.narrative.recommendations.forEach(recommendation => {
        narrativeData.push([`→ ${recommendation}`]);
      });
    }

    const narrativeWorksheet = XLSX.utils.aoa_to_sheet(narrativeData);
    narrativeWorksheet['!cols'] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(workbook, narrativeWorksheet, 'Análisis');
  }

  // Generar archivo y descargar
  const filename = options.customFilename || generateFilename(report.report_type, 'xlsx');
  XLSX.writeFile(workbook, filename);
};

// ==========================================
// Exportación a PDF
// ==========================================

export const exportToPDF = async (report: ReportResponse, options: ExportOptions = {}): Promise<void> => {
  try {    // Importar dinámicamente jsPDF y autotable en orden específico
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;
    
    // Intentar importar y aplicar el plugin autotable
    try {
      await import('jspdf-autotable');
    } catch (importError) {
      // Si falla la importación, usar versión simple directamente
      console.info('🔄 autoTable no disponible, usando versión simple de PDF');
      return exportToPDFSimple(report, options);
    }
    
    // Crear documento PDF
    const doc = new jsPDF();
    let yPosition = 20;

    // Verificar que autoTable esté disponible después de la importación
    if (typeof (doc as any).autoTable !== 'function') {
      console.info('🔄 autoTable no se cargó correctamente, usando versión simple de PDF');
      return exportToPDFSimple(report, options);
    }

    // Configuración de fuentes
    doc.setFont('helvetica');

    // Título del reporte
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(getReportTitle(report.report_type), 20, yPosition);
    yPosition += 15;

    // Metadatos
    if (options.includeMetadata !== false) {
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Empresa: ${report.project_context}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Período: ${formatDate(report.period.from_date)} - ${formatDate(report.period.to_date)}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Generado: ${formatDate(report.generated_at)}`, 20, yPosition);
      yPosition += 15;
    }

    // Secciones del reporte
    if (report.table && report.table.sections) {
      for (const section of report.table.sections) {
        // Verificar si necesitamos nueva página
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Título de sección
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(section.section_name, 20, yPosition);
        yPosition += 10;

        // Preparar datos de la tabla
        const tableData: string[][] = [];
        const flattenedItems = flattenAccountItems(section.items || []);
        
        flattenedItems.forEach(item => {
          const indent = '  '.repeat(item.level || 0);
          tableData.push([
            item.account_code,
            indent + item.account_name,
            formatCurrency(item.opening_balance),
            formatCurrency(item.movements),
            formatCurrency(item.closing_balance)
          ]);
        });

        // Agregar total de sección
        if (section.total) {
          tableData.push([
            '',
            `TOTAL ${section.section_name}`,
            '',
            '',
            formatCurrency(section.total)
          ]);
        }

        // Crear tabla usando autoTable con verificación
        try {
          (doc as any).autoTable({
            head: [['Código', 'Cuenta', 'Saldo Inicial', 'Movimientos', 'Saldo Final']],
            body: tableData,
            startY: yPosition,
            styles: {
              fontSize: 8,
              cellPadding: 3,
              textColor: [0, 0, 0]
            },
            headStyles: {
              fillColor: [66, 139, 202],
              textColor: [255, 255, 255],
              fontStyle: 'bold'
            },
            columnStyles: {
              0: { cellWidth: 25 },
              1: { cellWidth: 80 },
              2: { cellWidth: 25, halign: 'right' },
              3: { cellWidth: 25, halign: 'right' },
              4: { cellWidth: 25, halign: 'right' }
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245]
            }
          });

          // Actualizar posición Y después de la tabla
          yPosition = (doc as any).lastAutoTable?.finalY + 15 || yPosition + (tableData.length * 8) + 15;
        } catch (tableError) {
          console.error('Error al crear tabla:', tableError);
          // Fallback: crear tabla manual sin autoTable
          yPosition = await createManualTable(doc, tableData, yPosition);
        }
      }
    }

    // Totales generales
    if (report.table && report.table.totals && Object.keys(report.table.totals).length > 0) {
      // Verificar espacio para totales
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('RESUMEN GENERAL', 20, yPosition);
      yPosition += 10;

      const totalsData = Object.entries(report.table.totals).map(([key, value]) => [
        key.replace(/_/g, ' ').toUpperCase(),
        formatCurrency(value)
      ]);

      try {
        (doc as any).autoTable({
          body: totalsData,
          startY: yPosition,
          styles: {
            fontSize: 10,
            cellPadding: 5,
            textColor: [0, 0, 0]
          },
          columnStyles: {
            0: { cellWidth: 100, fontStyle: 'bold' },
            1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
          },
          alternateRowStyles: {
            fillColor: [240, 248, 255]
          }
        });

        yPosition = (doc as any).lastAutoTable?.finalY + 15 || yPosition + (totalsData.length * 12) + 15;
      } catch (tableError) {
        console.error('Error al crear tabla de totales:', tableError);
        // Fallback manual para totales
        totalsData.forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, 20, yPosition);
          yPosition += 8;
        });
        yPosition += 10;
      }
    }

    // Narrativa (opcional)
    if (options.includeNarrative && report.narrative) {
      doc.addPage();
      yPosition = 20;

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('ANÁLISIS DEL REPORTE', 20, yPosition);
      yPosition += 15;

      // Resumen ejecutivo
      if (report.narrative.executive_summary) {
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text('Resumen Ejecutivo', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const summaryLines = doc.splitTextToSize(report.narrative.executive_summary, 170);
        doc.text(summaryLines, 20, yPosition);
        yPosition += summaryLines.length * 5 + 10;
      }

      // Insights clave
      if (report.narrative.key_insights && report.narrative.key_insights.length > 0) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text('Insights Clave', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        report.narrative.key_insights.forEach(insight => {
          const insightLines = doc.splitTextToSize(`• ${insight}`, 170);
          doc.text(insightLines, 20, yPosition);
          yPosition += insightLines.length * 5 + 3;
          
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        });
        yPosition += 10;
      }

      // Recomendaciones
      if (report.narrative.recommendations && report.narrative.recommendations.length > 0) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text('Recomendaciones', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        report.narrative.recommendations.forEach(recommendation => {
          const recLines = doc.splitTextToSize(`→ ${recommendation}`, 170);
          doc.text(recLines, 20, yPosition);
          yPosition += recLines.length * 5 + 3;
          
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        });
      }
    }

    // Generar nombre del archivo
    const filename = options.customFilename || generateFilename(report.report_type, 'pdf');
    
    // Guardar el PDF
    doc.save(filename);
      } catch (error) {
    // Error crítico que no puede ser manejado por el fallback interno
    console.error('Error crítico al generar PDF:', error);
    throw new Error(`Error al generar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// ==========================================
// Exportación a PDF simplificada (sin autoTable)
// ==========================================

export const exportToPDFSimple = async (report: ReportResponse, options: ExportOptions = {}): Promise<void> => {
  try {
    // Importar solo jsPDF básico
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;
    
    // Crear documento PDF
    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 6;
    const pageHeight = 280;

    // Configuración de fuentes
    doc.setFont('helvetica');

    // Título del reporte
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(getReportTitle(report.report_type), 20, yPosition);
    yPosition += 12;

    // Metadatos
    if (options.includeMetadata !== false) {
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Empresa: ${report.project_context}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Período: ${formatDate(report.period.from_date)} - ${formatDate(report.period.to_date)}`, 20, yPosition);
      yPosition += lineHeight;
      doc.text(`Generado: ${formatDate(report.generated_at)}`, 20, yPosition);
      yPosition += 15;
    }

    // Secciones del reporte
    if (report.table && report.table.sections) {
      for (const section of report.table.sections) {
        // Verificar si necesitamos nueva página
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        // Título de sección
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(section.section_name, 20, yPosition);
        yPosition += 10;

        // Headers de la tabla
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Código', 20, yPosition);
        doc.text('Cuenta', 50, yPosition);
        doc.text('Saldo Inicial', 120, yPosition);
        doc.text('Movimientos', 150, yPosition);
        doc.text('Saldo Final', 180, yPosition);
        yPosition += lineHeight + 2;

        // Línea separadora
        doc.line(20, yPosition - 2, 200, yPosition - 2);
        
        // Datos de cuentas
        doc.setFont('helvetica', 'normal');
        const flattenedItems = flattenAccountItems(section.items || []);
        
        flattenedItems.forEach(item => {
          // Verificar nueva página
          if (yPosition > pageHeight - 10) {
            doc.addPage();
            yPosition = 20;
            
            // Repetir headers en nueva página
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('Código', 20, yPosition);
            doc.text('Cuenta', 50, yPosition);
            doc.text('Saldo Inicial', 120, yPosition);
            doc.text('Movimientos', 150, yPosition);
            doc.text('Saldo Final', 180, yPosition);
            yPosition += lineHeight + 2;
            doc.line(20, yPosition - 2, 200, yPosition - 2);
            doc.setFont('helvetica', 'normal');
          }

          const indent = '  '.repeat(item.level || 0);
          const accountName = (indent + item.account_name).length > 20 
            ? (indent + item.account_name).substring(0, 20) + '...'
            : indent + item.account_name;

          doc.text(item.account_code, 20, yPosition);
          doc.text(accountName, 50, yPosition);
          doc.text(formatCurrency(item.opening_balance), 120, yPosition);
          doc.text(formatCurrency(item.movements), 150, yPosition);
          doc.text(formatCurrency(item.closing_balance), 180, yPosition);
          yPosition += lineHeight;
        });

        // Total de sección
        if (section.total) {
          yPosition += 3;
          doc.line(20, yPosition - 2, 200, yPosition - 2);
          doc.setFont('helvetica', 'bold');
          doc.text(`TOTAL ${section.section_name}`, 50, yPosition);
          doc.text(formatCurrency(section.total), 180, yPosition);
          doc.setFont('helvetica', 'normal');
          yPosition += 10;
        } else {
          yPosition += 8;
        }
      }
    }

    // Totales generales
    if (report.table && report.table.totals && Object.keys(report.table.totals).length > 0) {
      // Verificar espacio para totales
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('RESUMEN GENERAL', 20, yPosition);
      yPosition += 12;

      doc.setFontSize(10);
      Object.entries(report.table.totals).forEach(([key, value]) => {
        const label = key.replace(/_/g, ' ').toUpperCase();
        doc.text(`${label}:`, 20, yPosition);
        doc.text(formatCurrency(value), 120, yPosition);
        yPosition += lineHeight + 2;
      });
      yPosition += 10;
    }

    // Narrativa (opcional)
    if (options.includeNarrative && report.narrative) {
      doc.addPage();
      yPosition = 20;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('ANÁLISIS DEL REPORTE', 20, yPosition);
      yPosition += 15;

      // Resumen ejecutivo
      if (report.narrative.executive_summary) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumen Ejecutivo', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(report.narrative.executive_summary, 170);
        doc.text(summaryLines, 20, yPosition);
        yPosition += summaryLines.length * 5 + 10;
      }

      // Insights clave
      if (report.narrative.key_insights && report.narrative.key_insights.length > 0) {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Insights Clave', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        report.narrative.key_insights.forEach(insight => {
          const insightLines = doc.splitTextToSize(`• ${insight}`, 170);
          doc.text(insightLines, 20, yPosition);
          yPosition += insightLines.length * 5 + 3;
          
          if (yPosition > pageHeight - 10) {
            doc.addPage();
            yPosition = 20;
          }
        });
        yPosition += 10;
      }

      // Recomendaciones
      if (report.narrative.recommendations && report.narrative.recommendations.length > 0) {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Recomendaciones', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        report.narrative.recommendations.forEach(recommendation => {
          const recLines = doc.splitTextToSize(`→ ${recommendation}`, 170);
          doc.text(recLines, 20, yPosition);
          yPosition += recLines.length * 5 + 3;
          
          if (yPosition > pageHeight - 10) {
            doc.addPage();
            yPosition = 20;
          }
        });
      }
    }

    // Generar nombre del archivo
    const filename = options.customFilename || generateFilename(report.report_type, 'pdf');
    
    // Guardar el PDF
    doc.save(filename);
    
  } catch (error) {
    console.error('Error al generar PDF simple:', error);
    throw new Error(`Error al generar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// ==========================================
// Función auxiliar para crear tabla manual (fallback)
// ==========================================

const createManualTable = async (doc: any, tableData: string[][], startY: number): Promise<number> => {
  let yPosition = startY;
  const lineHeight = 8;  const columnWidths = [25, 80, 25, 25, 25];
  const startX = 20;
  
  // Headers
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const headers = ['Código', 'Cuenta', 'Saldo Inicial', 'Movimientos', 'Saldo Final'];
  
  let currentX = startX;
  headers.forEach((header, index) => {
    doc.text(header, currentX, yPosition);
    currentX += columnWidths[index];
  });
  
  yPosition += lineHeight + 2;
  
  // Data rows
  doc.setFont('helvetica', 'normal');
  tableData.forEach(row => {
    currentX = startX;
    row.forEach((cell, index) => {
      const cellText = cell.length > 15 ? cell.substring(0, 15) + '...' : cell;
      doc.text(cellText, currentX, yPosition);
      currentX += columnWidths[index];
    });
    yPosition += lineHeight;
    
    // Check for page break
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  return yPosition + 10;
};

// ==========================================
// Utilidad auxiliar para aplanar elementos jerárquicos
// ==========================================

const flattenAccountItems = (items: AccountReportItem[]): AccountReportItem[] => {
  const flattened: AccountReportItem[] = [];
  
  const addItemsRecursively = (itemList: AccountReportItem[], level: number = 0) => {
    itemList.forEach(item => {
      flattened.push({ ...item, level });
      if (item.children && item.children.length > 0) {
        addItemsRecursively(item.children, level + 1);
      }
    });
  };

  addItemsRecursively(items);
  return flattened;
};

// ==========================================
// Exportación unificada
// ==========================================

export const exportReport = (
  report: ReportResponse,
  format: 'csv' | 'excel' | 'pdf',
  options: ExportOptions = {}
): Promise<void> => {
  switch (format) {
    case 'csv':
      exportToCSV(report, options);
      return Promise.resolve();
    case 'excel':
      return exportToExcel(report, options);    case 'pdf':
      // Intentar primero con autoTable, si falla usar versión simple
      return exportToPDF(report, options).catch(async (error) => {
        console.info('🔄 Activando fallback a PDF simple debido a:', error.message);
        return exportToPDFSimple(report, options);
      });
    default:
      return Promise.reject(new Error(`Formato no soportado: ${format}`));
  }
};
