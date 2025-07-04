# GenericBulkActionsBar - Documentación

El `GenericBulkActionsBar` es un componente reutilizable que estandariza la interfaz de operaciones bulk (selección múltiple) en toda la aplicación. Elimina la duplicación de código y asegura una experiencia de usuario consistente.

## Características

- **Barra flotante estándar** con posición configurable
- **Acciones rápidas** (botones directos sin modal)
- **Operaciones con modal** para confirmación con razón
- **Estadísticas personalizables** por feature
- **Advertencias automáticas** para operaciones destructivas
- **Estado de carga** integrado

## Uso Básico

```tsx
import { GenericBulkActionsBar, type BulkAction, type OperationConfig } from '@/components/ui/GenericBulkActionsBar';

export function MyFeatureBulkActionsBar() {
  const { selectedItems, isLoading, clearSelection } = useMyFeatureStore();

  // Configurar acciones rápidas (sin modal)
  const quickActions: BulkAction[] = [
    {
      key: 'activate',
      label: 'Activar',
      icon: CheckCircleIcon,
      onClick: () => handleActivate(),
      disabled: isLoading,
      className: "text-green-600 hover:text-green-700 hover:bg-green-50"
    },
    {
      key: 'export',
      label: 'Exportar',
      icon: ArrowDownTrayIcon,
      onClick: () => handleExport(),
      disabled: isLoading,
      className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    }
  ];

  // Configurar operaciones con modal (requieren confirmación)
  const operationConfigs: Record<string, OperationConfig> = {
    delete: {
      label: 'Eliminar',
      color: 'red',
      icon: TrashIcon,
      description: 'Eliminar elementos seleccionados',
      confirmMessage: 'Esta acción eliminará permanentemente los elementos seleccionados.',
      requiresReason: true
    }
  };

  // Función para renderizar estadísticas específicas del feature
  const renderStats = (items: MyItem[]) => (
    <>
      <Badge color="green" variant="subtle" className="text-xs px-1 py-0">
        {items.filter(i => i.status === 'active').length} activos
      </Badge>
      <Badge color="gray" variant="subtle" className="text-xs px-1 py-0">
        {items.filter(i => i.status === 'inactive').length} inactivos
      </Badge>
    </>
  );

  return (
    <GenericBulkActionsBar
      selectedCount={selectedItems.length}
      selectedItems={selectedItems}
      isProcessing={isLoading}
      icon={MyFeatureIcon}
      itemTypeName="elemento"
      itemTypeNamePlural="elementos"
      quickActions={quickActions}
      renderStats={renderStats}
      operationConfigs={operationConfigs}
      onBulkOperation={handleBulkOperation}
      onClearSelection={clearSelection}
    />
  );
}
```

## Props

### Básicas
- `selectedCount: number` - Cantidad de elementos seleccionados
- `selectedItems: T[]` - Array de elementos seleccionados
- `isProcessing: boolean` - Estado de carga global
- `icon: ComponentType` - Icono que representa el feature
- `itemTypeName: string` - Nombre singular ("pago", "producto", etc.)
- `itemTypeNamePlural?: string` - Nombre plural (opcional, se genera automáticamente)

### Acciones
- `quickActions?: BulkAction[]` - Acciones rápidas (botones sin modal)
- `operationConfigs?: Record<string, OperationConfig>` - Operaciones con modal
- `onBulkOperation?: (operation: string, options: { reason?: string }) => void` - Callback para operaciones con modal
- `onClearSelection: () => void` - Callback para limpiar selección

### Personalización
- `renderStats?: (items: T[]) => ReactNode` - Función para renderizar estadísticas
- `position?: 'bottom' | 'top'` - Posición de la barra (default: 'bottom')
- `className?: string` - Clases CSS adicionales
- `footerInfo?: ReactNode` - Información adicional en el pie

## Tipos

### BulkAction
```tsx
interface BulkAction {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'ghost' | 'outline' | 'primary' | 'secondary';
}
```

### OperationConfig
```tsx
interface OperationConfig {
  label: string;
  color: 'blue' | 'red' | 'yellow' | 'green' | 'gray' | 'orange';
  icon: ComponentType<{ className?: string }>;
  description: string;
  confirmMessage: string;
  requiresReason?: boolean;
}
```

## Ejemplo Completo: PaymentBulkActionsBar

El nuevo `PaymentBulkActionsBar` es un ejemplo perfecto de cómo migrar de un componente específico al genérico:

### Antes (código duplicado)
```tsx
// 200+ líneas de HTML y lógica repetitiva
<div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
  <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-6 py-4 flex items-center space-x-4 min-w-[600px]">
    {/* Mucho código repetitivo... */}
  </div>
</div>
```

### Después (usando componente genérico)
```tsx
<GenericBulkActionsBar
  selectedCount={selectedPaymentCount}
  selectedItems={selectedPaymentData}
  isProcessing={isLoading}
  icon={BanknotesIcon}
  itemTypeName="pago"
  itemTypeNamePlural="pagos"
  quickActions={quickActions}
  renderStats={renderStats}
  operationConfigs={operationConfigs}
  onClearSelection={clearPaymentSelection}
  className="min-w-[600px]"
/>
```

## Ventajas

1. **Consistencia**: Todos los features tienen la misma interfaz y comportamiento
2. **Mantenibilidad**: Cambios en una sola ubicación afectan toda la aplicación
3. **Menos código**: Cada feature solo define su lógica específica
4. **Tipado fuerte**: TypeScript asegura el uso correcto del componente
5. **Flexibilidad**: Se adapta a las necesidades específicas de cada feature

## Migración

Para migrar un `BulkActionsBar` existente:

1. **Identifica las acciones rápidas** (botones directos)
2. **Identifica las operaciones con modal** (requieren confirmación)
3. **Crea la función `renderStats`** para mostrar estadísticas específicas
4. **Reemplaza el JSX repetitivo** con `<GenericBulkActionsBar>`
5. **Mantén los modales personalizados** (como `BulkConfirmationModal` de pagos)

## Features que pueden beneficiarse

- ✅ **Payments** - Ya migrado
- 🔄 **Products** - Puede usar el genérico
- 🔄 **Third Parties** - Puede usar el genérico  
- 🔄 **Cost Centers** - Puede usar el genérico
- 🔄 **Accounts** - Puede usar el genérico
- 🔄 **Journal Entries** - Puede usar el genérico
- 🔄 **Invoices** - Tiene lógica específica, evaluar migración parcial
