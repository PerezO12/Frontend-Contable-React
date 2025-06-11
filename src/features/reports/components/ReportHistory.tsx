// ==========================================
// Componente para mostrar historial de reportes
// ==========================================

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ReportResponse, ReportType } from '../types';

interface ReportHistoryProps {
  reports: ReportResponse[];
  onSelectReport?: (report: ReportResponse) => void;
  className?: string;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reports,
  onSelectReport,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ReportType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');

  // ==========================================
  // Filtering and sorting logic
  // ==========================================

  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.project_context.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.report_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(report => report.report_type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime();
      } else {
        return a.report_type.localeCompare(b.report_type);
      }
    });

    return filtered;
  }, [reports, searchTerm, filterType, sortBy]);

  // ==========================================
  // Helper functions
  // ==========================================
  const getReportTypeName = (type: ReportType) => {
    const names: Record<string, string> = {
      'balance_general': 'Balance General',
      'p_g': 'Pérdidas y Ganancias',
      'flujo_efectivo': 'Flujo de Efectivo',
      'balance_comprobacion': 'Balance de Comprobación'
    };
    return names[type] || type;
  };

  const getReportTypeColor = (type: ReportType) => {
    const colors: Record<string, string> = {
      'balance_general': 'bg-blue-100 text-blue-800',
      'p_g': 'bg-green-100 text-green-800',
      'flujo_efectivo': 'bg-yellow-100 text-yellow-800',
      'balance_comprobacion': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPeriod = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
    const to = new Date(toDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
    return `${from} - ${to}`;
  };

  // ==========================================
  // Render
  // ==========================================

  if (reports.length === 0) {
    return (
      <Card className={`p-12 text-center ${className}`}>
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sin Historial de Reportes
        </h3>
        <p className="text-gray-600">
          Los reportes que generes aparecerán aquí para fácil acceso.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Controls */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Historial de Reportes
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAndSortedReports.length} de {reports.length} reportes
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Buscar por proyecto o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ReportType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="balance_general">Balance General</option>
              <option value="p_g">Pérdidas y Ganancias</option>
              <option value="flujo_efectivo">Flujo de Efectivo</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'type')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Por fecha</option>
              <option value="type">Por tipo</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedReports.map((report, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReportTypeColor(report.report_type)}`}>
                    {getReportTypeName(report.report_type)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(report.generated_at)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">
                  {report.project_context}
                </h3>
                
                <p className="text-sm text-gray-600">
                  Período: {formatPeriod(report.period.from_date, report.period.to_date)}
                </p>
              </div>

              {onSelectReport && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onSelectReport(report)}
                >
                  Ver
                </Button>
              )}
            </div>

            {/* Summary Info */}
            <div className="space-y-2">
              {/* Executive Summary Preview */}
              {report.narrative?.executive_summary && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {report.narrative.executive_summary}
                  </p>
                </div>
              )}

              {/* Key Metrics */}
              {report.table.totals && Object.keys(report.table.totals).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(report.table.totals).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <span className="font-medium">
                        {key.replace(/_/g, ' ')}: 
                      </span>
                      <span className="ml-1">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(parseFloat(value.replace(/,/g, '')))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-xs text-gray-500">
                <span>📊</span>
                <span className="ml-1">
                  {report.table.sections.length} sección{report.table.sections.length !== 1 ? 'es' : ''}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  📄 PDF
                </button>
                <button className="text-xs text-green-600 hover:text-green-800">
                  📊 Excel
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAndSortedReports.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron reportes
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </Card>
      )}
    </div>
  );
};
