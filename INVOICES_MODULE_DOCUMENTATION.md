# Módulo de Facturas - Frontend

## Descripción
El módulo de facturas implementa el flujo tipo Odoo adaptado al sistema contable, proporcionando una interfaz moderna y funcional para la gestión completa del ciclo de facturación.

## Características Implementadas

### 🎯 Flujo de Trabajo Odoo
El módulo sigue el flujo estándar de Odoo:
1. **Cliente Registrado** - Cliente dado de alta en el sistema
2. **Factura Borrador** - Crear factura con líneas de productos/servicios
3. **Validar y Emitir** - Contabilizar factura (genera asiento automático)
4. **Registrar Pago** - Crear pago del cliente
5. **Aplicar Pago** - Vincular pago con factura

### 📱 Interfaces Implementadas

#### Listado de Facturas (`/invoices`)
- **Filtros avanzados**: Por estado, tipo, cliente, fechas
- **Búsqueda**: Por número, referencia o cliente
- **Paginación**: Navegación eficiente de grandes volúmenes
- **Acciones**: Confirmar, emitir, marcar como pagada, cancelar
- **Badges de estado**: Visualización clara del estado actual

#### Creación de Facturas (`/invoices/new`)
- **Selección de terceros**: Integración con API de clientes/proveedores
- **Líneas dinámicas**: Agregar/quitar productos y servicios
- **Cálculo automático**: Subtotales, impuestos y totales
- **Validaciones**: Campos requeridos y reglas de negocio

#### Edición de Facturas (`/invoices/:id/edit`)
- **Solo borradores**: Restricción a facturas en estado borrador
- **Formulario completo**: Misma funcionalidad que creación
- **Preservación de datos**: Mantiene información existente

#### Detalle de Facturas (`/invoices/:id`)
- **Vista completa**: Toda la información de la factura
- **Acciones de workflow**: Botones contextuales según estado
- **Historial**: Seguimiento de cambios de estado
- **Navegación**: Enlaces a asientos contables relacionados

### 🛠️ Arquitectura Técnica

#### Store (Zustand)
```typescript
// Estado centralizado con acciones asincrónicas
const useInvoiceStore = () => ({
  // Estados de datos
  invoices: Invoice[],
  currentInvoice: Invoice | null,
  
  // Estados de UI
  loading: boolean,
  saving: boolean,
  
  // Acciones
  fetchInvoices: (filters?) => Promise<void>,
  createInvoice: (data) => Promise<Invoice>,
  updateInvoice: (data) => Promise<Invoice>,
  performWorkflowAction: (id, action) => Promise<void>
})
```

#### API Client
```typescript
// Cliente HTTP para comunicación con backend
class InvoiceAPI {
  static getInvoices(filters?: InvoiceFilters): Promise<InvoiceListResponse>
  static createInvoice(data: InvoiceCreateData): Promise<Invoice>
  static updateInvoice(data: InvoiceUpdateData): Promise<Invoice>
  static confirmInvoice(id: string): Promise<Invoice>
  static postInvoice(id: string): Promise<Invoice>
  static markPaid(id: string): Promise<Invoice>
  static cancelInvoice(id: string): Promise<Invoice>
}
```

#### Hooks Personalizados
```typescript
// Hook para terceros en facturas
const useThirdPartiesForInvoices = () => ({
  options: ThirdPartyOption[],
  customerOptions: ThirdPartyOption[],
  supplierOptions: ThirdPartyOption[],
  loading: boolean
})

// Hook para productos en facturas  
const useProductsForInvoices = () => ({
  options: ProductOption[],
  productOptions: ProductOption[],
  serviceOptions: ProductOption[],
  loading: boolean
})
```

### 🎨 Componentes UI

#### Componentes Reutilizables
- **Badge**: Estados de facturas con colores distintivos
- **Table**: Tabla responsive con sorting y paginación
- **SearchInput**: Búsqueda con debounce
- **Select**: Dropdown con filtrado y carga asíncrona
- **LoadingSpinner**: Indicadores de carga
- **ConfirmDialog**: Confirmaciones de acciones críticas

#### Iconos SVG Locales
- Evita dependencias externas
- Consistencia visual
- Optimización de rendimiento

### 🔗 Integración con Módulos Existentes

#### Terceros (Clientes/Proveedores)
- Reutiliza `ThirdPartyService` existente
- Filtrado por tipo (cliente/proveedor)
- Formato consistente para selects

#### Productos y Servicios  
- Integración con `ProductService`
- Carga automática de precios y tasas de impuestos
- Diferenciación entre productos y servicios

#### Autenticación y Roles
- Respeta permisos: ADMIN y CONTADOR
- Integración con `ProtectedRoute`
- Control de acceso granular

### 📊 Dashboard Integration

#### Estadísticas
- **Facturas Pendientes**: Contador en tiempo real
- **Métricas de flujo**: Seguimiento del workflow Odoo

#### Acciones Rápidas
- **Nueva Factura**: Acceso directo a creación
- **Ver Facturas**: Navegación al listado
- **Prioridad visual**: Destacado en dashboard

### 🗂️ Estructura de Archivos
```
src/features/invoices/
├── api/
│   └── invoiceAPI.ts          # Cliente HTTP
├── components/
│   └── InvoiceList.tsx        # Componente de listado
├── hooks/
│   ├── useThirdPartiesForInvoices.ts
│   └── useProductsForInvoices.ts
├── pages/
│   ├── InvoiceListPage.tsx
│   ├── InvoiceCreatePage.tsx
│   ├── InvoiceEditPage.tsx
│   └── InvoiceDetailPage.tsx
├── stores/
│   └── invoiceStore.ts        # Estado Zustand
└── types/
    └── index.ts               # Tipos TypeScript
```

### 🚀 Próximos Pasos

#### Funcionalidades Pendientes
1. **Pagos**: Integración con flujo de pagos
2. **Extractos Bancarios**: Importación y conciliación
3. **Productos Mejorados**: Selector con búsqueda avanzada
4. **Reportes**: Dashboard específico de facturas
5. **Exportación**: PDF, Excel, formatos fiscales

#### Mejoras de UX/UI
1. **Formularios Avanzados**: Validación en tiempo real
2. **Búsqueda Global**: Buscador omnipresente
3. **Notificaciones**: Toast mejorados con acciones
4. **Responsive**: Optimización móvil completa
5. **Temas**: Soporte para modo oscuro

#### Integraciones
1. **Email**: Envío automático de facturas
2. **API Externa**: Integración con servicios fiscales
3. **Webhooks**: Notificaciones en tiempo real
4. **Backup**: Sincronización automática

## 🎯 Uso del Módulo

### Navegación
1. Acceder desde el menú lateral: **Contabilidad > Facturas**
2. Desde el dashboard: **Ver Facturas** o **Nueva Factura**
3. URLs directas: `/invoices`, `/invoices/new`, `/invoices/:id`

### Flujo Típico
1. **Crear Cliente**: Si no existe, registrar en Terceros
2. **Nueva Factura**: Completar información general
3. **Agregar Líneas**: Productos/servicios con cantidades
4. **Confirmar**: Cambiar de borrador a pendiente
5. **Emitir**: Generar asiento contable automático
6. **Gestionar Pago**: Registrar y aplicar pagos

### Permisos Requeridos
- **ADMIN**: Acceso completo
- **CONTADOR**: Acceso completo
- **SOLO_LECTURA**: Solo visualización

## 🔧 Configuración Técnica

### Variables de Entorno
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Dependencias Principales
- **React Router**: Navegación
- **Zustand**: Gestión de estado
- **Axios**: Comunicación HTTP
- **Tailwind CSS**: Estilos
- **TypeScript**: Tipado estático

### Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Verificación TypeScript
npx tsc --noEmit
```

---

El módulo de facturas está completamente integrado y listo para usar, proporcionando una base sólida para el flujo de trabajo tipo Odoo en el sistema contable.
