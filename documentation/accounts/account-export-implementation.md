# Funcionalidad de Exportación de Cuentas

## Descripción General

Se ha implementado una funcionalidad completa de exportación de cuentas contables que permite a los usuarios exportar datos de cuentas en múltiples formatos (CSV, JSON, XLSX) con capacidades de selección granular y filtrado avanzado.

## Componentes Implementados

### 1. `ExportService` (Shared Service)
- Servicio genérico de exportación que sigue la documentación del sistema
- Maneja exportación simple por IDs y exportación avanzada con filtros
- Incluye utilidades para descarga de archivos y generación de nombres únicos

**Ubicación:** `src/shared/services/exportService.ts`

### 2. `AccountExportModal` (Component)
- Modal para exportación básica con selección individual de cuentas
- Checkbox para "seleccionar todas" las cuentas
- Búsqueda integrada para filtrar cuentas
- Selección de formato (CSV, JSON, XLSX)
- Previsualización de cuentas seleccionadas

**Ubicación:** `src/features/accounts/components/AccountExportModal.tsx`

### 3. `AccountAdvancedExportModal` (Component)
- Modal para exportación avanzada con filtros complejos
- Filtros por tipo de cuenta, categoría, estado, búsqueda y fechas
- Selección de columnas específicas para exportar
- Barra de progreso durante la exportación
- Configuración de formato con descripciones

**Ubicación:** `src/features/accounts/components/AccountAdvancedExportModal.tsx`

### 4. `useAccountExport` (Hook)
- Hook personalizado para manejar toda la lógica de exportación
- Manejo de estados de carga y progreso
- Callbacks para éxito y error
- Métodos para exportación simple y avanzada

**Ubicación:** `src/features/accounts/hooks/useAccountExport.ts`

### 5. Extensiones al `AccountService`
- Métodos nuevos para exportación usando el sistema genérico
- `exportAccounts()` - Exportación por IDs seleccionados
- `exportAccountsAdvanced()` - Exportación con filtros avanzados
- `getExportSchema()` - Obtener esquema de columnas disponibles

**Ubicación:** `src/features/accounts/services/accountService.ts`

## Funcionalidades Principales

### Exportación Básica
- **Acceso:** Botón "Exportar" en la lista de cuentas (`AccountList`)
- **Características:**
  - Selección individual de cuentas con checkbox
  - Checkbox "Seleccionar todas" para selección masiva
  - Búsqueda en tiempo real para filtrar cuentas
  - Selección de formato (CSV, JSON, XLSX)
  - Contador de cuentas seleccionadas
  - Validación de selección mínima

### Exportación Avanzada
- **Acceso:** Botón "Exportación Avanzada" en la página de cuentas (`AccountsPage`)
- **Características:**
  - Filtros por tipo de cuenta y categoría (con dependencias)
  - Filtro por estado (activas/inactivas)
  - Búsqueda por código, nombre o descripción
  - Filtros de rango de fechas
  - Selección granular de columnas a exportar
  - Previsualización de progreso durante exportación
  - Configuración de formato con descripciones detalladas

### Formatos Soportados
1. **CSV** - Compatible con Excel y hojas de cálculo
2. **JSON** - Para integración con APIs y sistemas
3. **XLSX** - Archivo Excel nativo

## Integración con el Sistema

### Backend API
- Utiliza los endpoints `/api/v1/export/` según la documentación
- Exportación simple: `POST /api/v1/export/`
- Exportación avanzada: `POST /api/v1/export/advanced`
- Esquema de tabla: `GET /api/v1/export/tables/accounts/schema`

### UI/UX
- Modales responsivos con diseño empresarial
- Indicadores de progreso y estados de carga
- Validaciones en tiempo real
- Mensajes de éxito y error mediante toast notifications
- Interfaces intuitivas con iconografía clara

### Arquitectura
- Separación clara de responsabilidades
- Hooks reutilizables para lógica de negocio
- Servicios modulares y extensibles
- Tipos TypeScript completos para type safety
- Manejo robusto de errores

## Uso

### Para Exportación Básica:
1. Ir a la lista de cuentas
2. Hacer clic en "Exportar"
3. Seleccionar cuentas individuales o usar "Seleccionar todas"
4. Elegir formato de exportación
5. Hacer clic en "Exportar [FORMATO]"

### Para Exportación Avanzada:
1. Ir a la página de cuentas
2. Hacer clic en "Exportación Avanzada"
3. Configurar filtros según necesidades
4. Seleccionar columnas específicas (opcional)
5. Elegir formato y hacer clic en "Exportar"

## Características Técnicas

### Manejo de Estados
- Estados de carga durante exportación
- Progreso granular en exportaciones avanzadas
- Validación de formularios en tiempo real
- Feedback visual inmediato

### Optimizaciones
- Búsqueda con debouncing
- Lazy loading de esquemas
- Memoización de filtros
- Gestión eficiente de memoria para archivos grandes

### Accesibilidad
- Navegación por teclado completa
- Labels descriptivos para screen readers
- Indicadores visuales claros
- Mensajes de error accesibles

## Extensibilidad

El sistema está diseñado para ser fácilmente extensible:

1. **Nuevos Formatos:** Agregar al enum de formatos en `ExportService`
2. **Nuevos Filtros:** Extender interfaces de filtros en tipos
3. **Nuevas Tablas:** Reutilizar `ExportService` para otras entidades
4. **Nuevas Funcionalidades:** Usar los hooks como base para nuevas características

## Consideraciones de Seguridad

- Validación de permisos de usuario en backend
- Filtrado automático de datos sensibles
- Auditoría de todas las exportaciones
- Límites de tamaño y volumen configurables
- Sanitización de datos exportados

## Compatibilidad

- Compatible con todos los navegadores modernos
- Responsive design para dispositivos móviles y tablets
- Integración completa con el sistema de autenticación existente
- Manejo robusto de diferentes tamaños de datos
