import { useState, useCallback } from 'react';
import { GenericImportService } from '../services/GenericImportService';

interface UseTemplateDownloadState {
  isDownloading: boolean;
  error: string | null;
  lastDownloadedModel: string | null;
}

interface UseTemplateDownloadReturn extends UseTemplateDownloadState {
  downloadTemplate: (modelName: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useTemplateDownload(): UseTemplateDownloadReturn {
  const [state, setState] = useState<UseTemplateDownloadState>({
    isDownloading: false,
    error: null,
    lastDownloadedModel: null,
  });

  const downloadTemplate = useCallback(async (modelName: string) => {
    setState(prev => ({
      ...prev,
      isDownloading: true,
      error: null,
    }));

    try {
      await GenericImportService.downloadTemplate(modelName);
      setState(prev => ({
        ...prev,
        isDownloading: false,
        lastDownloadedModel: modelName,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isDownloading: false,
        error: error instanceof Error ? error.message : 'Error al descargar la plantilla',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isDownloading: false,
      error: null,
      lastDownloadedModel: null,
    });
  }, []);

  return {
    ...state,
    downloadTemplate,
    clearError,
    reset,
  };
}
