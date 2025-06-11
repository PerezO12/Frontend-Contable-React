# 📊 Módulo de Reportes Financieros

## Descripción General

El módulo de reportes financieros proporciona una solución completa y profesional para generar, visualizar y analizar reportes contables fundamentales en aplicaciones empresariales React TypeScript.

## 🏗️ Arquitectura

```
src/features/reports/
├── components/           # Componentes UI reutilizables
│   ├── ReportFilters.tsx    # Filtros y configuración
│   ├── ReportViewer.tsx     # Visualización de reportes
│   ├── ReportHistory.tsx    # Historial y gestión
│   ├── FinancialSummary.tsx # Análisis financiero
│   └── ReportComparison.tsx # Comparación entre reportes
├── hooks/               # Hooks personalizados
│   └── useReports.ts       # Hook principal de gestión
├── pages/               # Páginas principales
│   └── ReportsDashboard.tsx # Dashboard principal
├── services/            # Servicios API
│   └── reportsAPI.ts       # Cliente API unificado
├── stores/              # Estado global
│   └── reportsStore.ts     # Store principal con Zustand
├── types/               # Definiciones TypeScript
│   └── index.ts            # Todas las interfaces y tipos
├── utils/               # Utilidades
│   └── reportUtils.ts      # Funciones auxiliares
├── routes/              # Configuración de rutas
│   └── index.tsx           # Rutas del módulo
└── index.ts             # Exportaciones principales
```

## 🚀 Instalación y Configuración

### 1. Importar el módulo

```typescript
import { 
  ReportsDashboard,
  useReports,
  ReportsRoutes,
  reportsAPI 
} from '@/features/reports';
```

### 2. Configurar rutas

```typescript
// En tu archivo de rutas principal
import { ReportsRoutes } from '@/features/reports';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/reportes/*" element={<ReportsRoutes />} />
      {/* otras rutas */}
    </Routes>
  );
}
```

### 3. Usar el dashboard

```typescript
import { ReportsDashboard } from '@/features/reports';

function ReportsPage() {
  return <ReportsDashboard />;
}
```

## 📋 Tipos de Reportes Soportados

### 1. Balance General
- Estado de situación financiera a una fecha específica
- Incluye Activos, Pasivos y Patrimonio
- Validación automática de ecuación fundamental

### 2. Estado de Pérdidas y Ganancias
- Ingresos y gastos en un período específico
- Cálculo automático de utilidades
- Análisis de rentabilidad

### 3. Estado de Flujo de Efectivo
- Movimientos de efectivo por actividades
- Flujos operativos, de inversión y financiamiento
- Análisis de liquidez

## 🎯 Funcionalidades Principales

### ✨ Generación de Reportes
- **Filtros Flexibles**: Fecha, nivel de detalle, contexto
- **Formatos Múltiples**: API unificada y clásica
- **Validación Automática**: Verificación de parámetros

### 📊 Visualización Avanzada
- **Interfaz Intuitiva**: Diseño profesional y moderno
- **Narrativa Automática**: Análisis e insights generados por IA
- **Responsive Design**: Adaptable a dispositivos móviles

### 📈 Análisis Financiero
- **Ratios Automáticos**: Cálculo de indicadores clave
- **Salud Financiera**: Evaluación integral de la empresa
- **Comparaciones**: Entre períodos y reportes

### 📤 Exportación
- **Múltiples Formatos**: PDF, Excel, CSV
- **Configuración Avanzada**: Incluir narrativa, gráficos
- **Descarga Directa**: Sin configuración adicional

## 💻 Ejemplos de Uso

### Uso Básico del Hook

```typescript
import { useReports } from '@/features/reports';

function MyReportComponent() {
  const { 
    reportsState, 
    generateReport, 
    exportReport 
  } = useReports();

  const handleGenerate = async () => {
    await generateReport({
      reportType: 'balance_general',
      filters: {
        from_date: '2025-01-01',
        to_date: '2025-06-10',
        detail_level: 'medio'
      }
    });
  };

  const handleExport = async () => {
    await exportReport({ 
      format: 'pdf',
      includeNarrative: true 
    });
  };

  return (
    <div>
      <button onClick={handleGenerate}>
        Generar Balance General
      </button>
      
      {reportsState.currentReport && (
        <button onClick={handleExport}>
          Exportar a PDF
        </button>
      )}
      
      {reportsState.isGenerating && <p>Generando...</p>}
      {reportsState.error && <p>Error: {reportsState.error}</p>}
    </div>
  );
}
```

### Configuración Avanzada de Filtros

```typescript
import { useReportFilters, dateUtils } from '@/features/reports';

function AdvancedFilters() {
  const { 
    filters, 
    setFilters, 
    validateFilters 
  } = useReportFilters();

  const setThisMonth = () => {
    const dates = dateUtils.getPeriodDates('thisMonth');
    setFilters(dates);
  };

  const validation = validateFilters();

  return (
    <div>
      <button onClick={setThisMonth}>
        Este Mes
      </button>
      
      {!validation.isValid && (
        <div>
          {validation.errors.map(error => (
            <p key={error} style={{ color: 'red' }}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Análisis Financiero

```typescript
import { useFinancialAnalysis } from '@/features/reports';

function FinancialAnalysis() {
  const { 
    calculateRatios, 
    getFinancialHealth 
  } = useFinancialAnalysis();

  const ratios = calculateRatios();
  const health = getFinancialHealth();

  if (!ratios) {
    return <p>Genera un Balance General para ver el análisis</p>;
  }

  return (
    <div>
      <h3>Salud Financiera: {health?.level}</h3>
      <p>Ratio Deuda/Patrimonio: {ratios.debtToEquityRatio.toFixed(2)}</p>
      <p>Ratio de Patrimonio: {ratios.equityRatio.toFixed(2)}</p>
      
      {health?.alerts.map(alert => (
        <div key={alert} style={{ color: 'orange' }}>
          ⚠️ {alert}
        </div>
      ))}
    </div>
  );
}
```

### Uso del API Directamente

```typescript
import { reportsAPI } from '@/features/reports';

async function generateCustomReport() {
  try {
    const report = await reportsAPI.generateBalanceGeneral({
      from_date: '2025-01-01',
      to_date: '2025-06-10',
      detail_level: 'alto',
      project_context: 'Mi Empresa S.A.',
      include_subaccounts: true
    });

    console.log('Reporte generado:', report);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 🎨 Personalización

### Temas y Estilos

El módulo usa los componentes UI existentes (`Button`, `Card`, `Input`) y hereda automáticamente tu tema de Tailwind CSS.

### Validaciones Personalizadas

```typescript
import { validationUtils } from '@/features/reports';

const customValidation = (filters) => {
  const baseValidation = validationUtils.validateReportFilters(filters);
  
  // Agregar validaciones personalizadas
  if (filters.project_context === 'PRODUCCION') {
    baseValidation.errors.push('No se permiten reportes en producción');
  }
  
  return baseValidation;
};
```

### Formatos de Exportación

```typescript
import { exportUtils } from '@/features/reports';

const customExport = async (report) => {
  const csvData = transformUtils.reportToCSV(report);
  const blob = new Blob([csvData], { type: 'text/csv' });
  
  exportUtils.downloadBlob(
    blob, 
    exportUtils.generateFilename(report.report_type, 'csv')
  );
};
```

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8000

# Límites de exportación
VITE_MAX_EXPORT_SIZE=100MB
VITE_EXPORT_TIMEOUT=30000
```

### Configuración del Store

```typescript
import { useReportsStore } from '@/features/reports';

// Configurar preferencias por defecto
const configureReports = () => {
  const store = useReportsStore.getState();
  
  store.setFilters({
    detail_level: 'medio',
    include_zero_balances: false
  });
};
```

## 📊 Métricas y Monitoreo

### Performance
- Generación de reportes: < 5 segundos
- Carga de datos: Lazy loading automático
- Exportación: Procesamiento en background

### Límites
- Período máximo: 2 años para reportes detallados
- Rate limiting: 20 solicitudes por minuto
- Tamaño máximo: 10MB por reporte

## 🛠️ Desarrollo y Testing

### Estructura de Tests

```typescript
// Ejemplo de test
import { renderHook } from '@testing-library/react';
import { useReports } from '@/features/reports';

test('should generate report successfully', async () => {
  const { result } = renderHook(() => useReports());
  
  await act(async () => {
    await result.current.generateReport({
      reportType: 'balance_general',
      filters: {
        from_date: '2025-01-01',
        to_date: '2025-06-10'
      }
    });
  });
  
  expect(result.current.reportsState.currentReport).toBeTruthy();
});
```

### Debugging

```typescript
// Habilitar logs detallados
localStorage.setItem('reports-debug', 'true');

// Inspeccionar estado del store
console.log(useReportsStore.getState());
```

## 🔮 Roadmap

### Próximas Funcionalidades
- **Reportes Personalizados**: Constructor visual de reportes
- **Dashboards Interactivos**: Gráficos en tiempo real
- **IA Avanzada**: Predicciones y recomendaciones automáticas
- **Integración ERP**: Conectores para sistemas externos

### Mejoras Planeadas
- **Performance**: Optimización de consultas grandes
- **UX**: Mejoras en la interfaz y experiencia
- **Accesibilidad**: Cumplimiento WCAG 2.1
- **Mobile**: App nativa complementaria

## 🤝 Contribución

Para contribuir al módulo:

1. Seguir la arquitectura establecida
2. Mantener tipos TypeScript estrictos
3. Incluir tests para nuevas funcionalidades
4. Documentar cambios en el API

## 📄 Licencia

Este módulo está diseñado para uso interno empresarial y sigue las políticas de desarrollo de la organización.
