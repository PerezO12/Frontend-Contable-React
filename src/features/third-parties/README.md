# Módulo de Terceros

Este módulo implementa la gestión completa de terceros (clientes, proveedores y empleados) en el sistema contable, siguiendo los mismos patrones de diseño y funcionalidad que los módulos de cuentas, asientos contables y centros de costo.

## Características Implementadas

### ✅ **CRUD Completo**
- **Crear**: Formulario completo con validación
- **Leer**: Lista con filtros avanzados y vista de detalles
- **Actualizar**: Edición in-place con validación
- **Eliminar**: Eliminación individual y masiva con confirmación

### ✅ **Operaciones Masivas**
- **Exportación**: Excel, CSV y PDF con filtros personalizables
- **Eliminación Masiva**: Con validación de integridad y forzado
- **Selección Múltiple**: Checkbox individual y "seleccionar todo"

### ✅ **Funcionalidades Avanzadas**
- **Estados de Cuenta**: Generación automática con movimientos detallados
- **Análisis de Balance**: Saldos actuales y análisis de antigüedad
- **Búsqueda Inteligente**: Por documento, nombre, email
- **Filtros Múltiples**: Por tipo, documento, estado, saldos, etc.

### ✅ **Integración Contable**
- **Balances en Tiempo Real**: Calculados desde asientos contables
- **Antigüedad de Saldos**: Clasificación por períodos de vencimiento
- **Límites de Crédito**: Control de exposición financiera
- **Términos de Pago**: Gestión de políticas comerciales

## Estructura del Módulo

```
src/features/third-parties/
├── types/
│   └── index.ts              # Tipos TypeScript y validaciones
├── services/
│   └── third-party.service.ts # Cliente de API con todos los endpoints
├── hooks/
│   └── useThirdParties.ts     # Hooks React personalizados
├── components/
│   ├── ThirdPartyList.tsx     # Lista con filtros y acciones masivas
│   ├── ThirdPartyForm.tsx     # Formulario crear/editar
│   ├── ThirdPartyDetail.tsx   # Vista detalle con tabs
│   ├── ThirdPartyExportModal.tsx  # Modal de exportación
│   └── BulkDeleteModal.tsx    # Modal eliminación masiva
├── pages/
│   ├── ThirdPartiesPage.tsx   # Router principal
│   ├── ThirdPartyListPage.tsx # Página lista
│   ├── ThirdPartyCreatePage.tsx # Página crear
│   ├── ThirdPartyDetailPage.tsx # Página detalle
│   └── ThirdPartyEditPage.tsx # Página editar
└── index.ts                   # Exportaciones públicas
```

## Rutas Implementadas

- `/third-parties` - Lista de terceros
- `/third-parties/new` - Crear nuevo tercero
- `/third-parties/:id` - Ver detalle del tercero
- `/third-parties/:id/edit` - Editar tercero

## Tipos de Terceros Soportados

### 🏢 **Clientes**
- Información comercial completa
- Límites de crédito y términos de pago
- Estados de cuenta detallados
- Análisis de antigüedad de cuentas por cobrar

### 🏭 **Proveedores**
- Datos de contacto y ubicación
- Términos de pago y descuentos
- Control de cuentas por pagar
- Seguimiento de vencimientos

### 👤 **Empleados**
- Información personal y laboral
- Datos de nómina y beneficios
- Control de anticipos y descuentos
- Integración con sistema de RRHH

## Documentos Soportados

- **RUT** (Chile) - Rol Único Tributario
- **CI** - Cédula de Identidad
- **DNI** (Argentina) - Documento Nacional de Identidad
- **RFC** (México) - Registro Federal de Contribuyentes
- **CUIT** (Argentina) - Clave Única de Identificación Tributaria
- **PASSPORT** - Pasaporte internacional
- **OTHER** - Otros tipos de documento

## API Endpoints Integrados

### **CRUD Básico**
- `GET /api/v1/third-parties` - Listar con filtros
- `POST /api/v1/third-parties` - Crear nuevo
- `GET /api/v1/third-parties/{id}` - Obtener por ID
- `PUT /api/v1/third-parties/{id}` - Actualizar
- `DELETE /api/v1/third-parties/{id}` - Eliminar

### **Búsqueda y Filtros**
- `GET /api/v1/third-parties/search` - Búsqueda inteligente
- Filtros: tipo, documento, estado, saldos, fechas, etc.

### **Estados Financieros**
- `GET /api/v1/third-parties/{id}/statement` - Estado de cuenta
- `GET /api/v1/third-parties/{id}/balance` - Balance y antigüedad

### **Operaciones Masivas**
- `POST /api/v1/third-parties/bulk-operations` - Operaciones masivas
- `POST /api/v1/third-parties/export` - Exportación
- `POST /api/v1/third-parties/import` - Importación

### **Analytics**
- `GET /api/v1/third-parties/analytics/summary` - Resumen analítico
- `GET /api/v1/third-parties/analytics/aging-report` - Reporte de antigüedad

## Uso del Módulo

### **1. Importar en Rutas**

```tsx
import { ThirdPartiesPage } from '../features/third-parties';

// En tu router principal
<Route path="/third-parties/*" element={<ThirdPartiesPage />} />
```

### **2. Usar Componentes Individuales**

```tsx
import { ThirdPartyList, ThirdPartyForm } from '../features/third-parties';

// Lista de terceros
<ThirdPartyList 
  onThirdPartySelect={(tp) => navigate(`/third-parties/${tp.id}`)}
  showActions={true}
/>

// Formulario de tercero
<ThirdPartyForm
  mode="create"
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

### **3. Usar Hooks Personalizados**

```tsx
import { useThirdParties, useThirdPartyBalance } from '../features/third-parties';

// Hook para lista
const { thirdParties, loading, error, refetch } = useThirdParties({
  type: 'CLIENTE',
  is_active: true
});

// Hook para balance
const { balance, loading } = useThirdPartyBalance(thirdPartyId);
```

### **4. Servicios Directos**

```tsx
import { ThirdPartyService } from '../features/third-parties';

// Búsqueda directa
const results = await ThirdPartyService.searchThirdParties('empresa');

// Exportación
const exportResponse = await ThirdPartyService.exportThirdParties({
  format: 'xlsx',
  include_balances: true
});
```

## Funcionalidades de UX

### **✨ Experiencia de Usuario**
- **Diseño Consistente**: Mismo estilo visual que otros módulos
- **Filtros Intuitivos**: Búsqueda en tiempo real y filtros múltiples
- **Acciones Masivas**: Selección múltiple con operaciones batch
- **Navegación Fluida**: Breadcrumbs y navegación contextual
- **Feedback Visual**: Estados de carga, errores y confirmaciones

### **📱 Responsive Design**
- **Mobile First**: Optimizado para dispositivos móviles
- **Adaptable**: Se ajusta a diferentes tamaños de pantalla
- **Accesible**: Cumple estándares de accesibilidad web

### **⚡ Performance**
- **Lazy Loading**: Carga diferida de componentes pesados
- **Memoización**: Optimización de re-renders innecesarios
- **Paginación**: Manejo eficiente de grandes datasets
- **Cache Inteligente**: Reutilización de datos cargados

## Validaciones Implementadas

### **Frontend (Zod)**
```typescript
const ThirdPartyCreateSchema = z.object({
  type: z.nativeEnum(ThirdPartyType),
  document_number: z.string().min(1, 'Número de documento requerido'),
  business_name: z.string().min(1, 'Razón social requerida'),
  email: z.string().email().optional(),
  // ... más validaciones
});
```

### **Backend Integration**
- Validación de unicidad de documentos
- Verificación de integridad referencial
- Control de reglas de negocio específicas
- Manejo de errores con mensajes descriptivos

## Próximas Mejoras

### **🔮 Funcionalidades Futuras**
- [ ] **Importación Masiva**: Excel/CSV con validación avanzada
- [ ] **Integración CRM**: Sincronización con sistemas externos
- [ ] **Alertas Inteligentes**: Notificaciones automáticas de vencimientos
- [ ] **Dashboard Analytics**: Métricas y KPIs de terceros
- [ ] **Gestión de Documentos**: Adjuntar archivos y contratos
- [ ] **API Webhooks**: Notificaciones en tiempo real
- [ ] **Auditoría Completa**: Trazabilidad de cambios
- [ ] **Multi-moneda**: Soporte para múltiples divisas

## Mantenimiento

### **🔧 Debugging**
- Todos los componentes incluyen logging detallado
- Error boundaries para recuperación automática
- Herramientas de desarrollo integradas

### **🧪 Testing**
- Unit tests para todos los hooks y servicios
- Integration tests para flujos completos
- E2E tests para casos de uso críticos

### **📚 Documentación**
- Código autodocumentado con TypeScript
- Storybook para componentes UI
- Documentación de API actualizada

---

**✅ Estado**: **Completamente Implementado y Funcional**  
**📅 Última actualización**: Diciembre 2024  
**👥 Compatibilidad**: React 18+, TypeScript 5+  
**🔗 Dependencias**: Integrado con sistema contable existente
