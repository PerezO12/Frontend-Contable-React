import React, { useState, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenterExport } from '../hooks';

interface SimpleCostCenterExportControlsProps {
  selectedCostCenterIds: string[];
  costCenterCount: number;
  onExportStart?: () => void;
  onExportEnd?: () => void;
}

type ExportFormat = 'xlsx' | 'csv' | 'json';

export const SimpleCostCenterExportControls: React.FC<SimpleCostCenterExportControlsProps> = ({
  selectedCostCenterIds,
  costCenterCount,
  onExportStart,
  onExportEnd
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('xlsx');
  const { exportCostCenters, isExporting } = useCostCenterExport();

  const handleExport = useCallback(async () => {
    if (selectedCostCenterIds.length === 0) return;    try {
      onExportStart?.();
      
      await exportCostCenters(
        selectedCostCenterIds,
        exportFormat
      );
      
    } finally {
      onExportEnd?.();
    }
  }, [selectedCostCenterIds, exportFormat, exportCostCenters, onExportStart, onExportEnd]);

  if (selectedCostCenterIds.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
        disabled={isExporting}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >        <option value="xlsx">Excel (.xlsx)</option>
        <option value="csv">CSV (.csv)</option>
        <option value="json">JSON (.json)</option>
      </select>
      
      <Button
        size="sm"
        onClick={handleExport}
        disabled={isExporting || selectedCostCenterIds.length === 0}
        className="flex items-center space-x-2"
      >
        {isExporting ? (
          <>
            <Spinner size="sm" />
            <span>Exportando...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>Exportar {exportFormat.toUpperCase()}</span>
          </>
        )}
      </Button>
      
      {selectedCostCenterIds.length > 0 && (
        <span className="text-sm text-gray-600">
          ({costCenterCount} seleccionado{costCenterCount === 1 ? '' : 's'})
        </span>
      )}
    </div>
  );
};
