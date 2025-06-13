# Implementación de Force Reset en Operaciones Bulk (Cambio de Estado Masivo)

## ✅ Funcionalidad Completada

Se ha implementado el checkbox de **"force_reset"** en las operaciones masivas de cambio de estado, específicamente para la restauración a borrador (DRAFT) desde el selector de estado bulk.

## 🔧 Cambios Realizados

### 1. **Modal de Razón (`ReasonPromptModal.tsx`)**

#### Nueva Interfaz
```typescript
interface ReasonPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, forceReset?: boolean) => void; // ✅ Nuevo parámetro
  title: string;
  placeholder: string;
  showForceReset?: boolean; // ✅ Nuevo prop para mostrar checkbox
}
```

#### Nuevo Estado
```typescript
const [forceReset, setForceReset] = useState(false);
```

#### Nueva UI - Checkbox Condicional
```tsx
{/* Force Reset Checkbox - Solo para restaurar a borrador */}
{showForceReset && (
  <div className="mb-6">
    <label className="flex items-start space-x-3">
      <input
        type="checkbox"
        checked={forceReset}
        onChange={(e) => setForceReset(e.target.checked)}
        disabled={isSubmitting}
        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">
          Forzar restauración
        </span>
        <p className="text-xs text-gray-500 mt-1">
          Activa esta opción para forzar la restauración de asientos que normalmente no pueden ser restaurados a borrador. 
          <span className="text-yellow-600 font-medium"> Usar con precaución.</span>
        </p>
      </div>
    </label>
  </div>
)}
```

### 2. **Selector de Estado Bulk (`BulkStatusChanger.tsx`)**

#### Interfaz Actualizada
```typescript
interface BulkStatusChangerProps {
  selectedEntryIds: string[];
  onStatusChange: (entryIds: string[], newStatus: JournalEntryStatus | 'REVERSE', reason?: string, forceReset?: boolean) => Promise<any>; // ✅ Nuevo parámetro
  onSuccess?: () => void;
}
```

#### Funciones Actualizadas
```typescript
// Función que ejecuta el cambio de estado
const executeStatusChange = async (status: JournalEntryStatus | 'REVERSE', reason?: string, forceReset?: boolean)

// Función que maneja la confirmación de razón
const handleReasonConfirm = async (reason: string, forceReset?: boolean)
```

#### Modal con Checkbox Condicional
```tsx
{pendingStatusChange && (
  <ReasonPromptModal
    isOpen={showReasonModal}
    onClose={handleCloseReasonModal}
    onConfirm={handleReasonConfirm}
    title={pendingStatusChange.title}
    placeholder={pendingStatusChange.placeholder}
    showForceReset={pendingStatusChange.status === JournalEntryStatus.DRAFT} // ✅ Solo para DRAFT
  />
)}
```

### 3. **Lista de Journal Entries (`JournalEntryList.tsx`)**

#### Función Handler Actualizada
```typescript
const handleBulkStatusChange = async (entryIds: string[], newStatus: JournalEntryStatus | 'REVERSE', reason?: string, forceReset?: boolean) => {
  try {
    console.log(`Cambiando ${entryIds.length} asientos al estado/operación ${newStatus}`, reason ? `con razón: ${reason}` : '', forceReset ? `(force_reset: ${forceReset})` : '');
    
    let result;
    
    if (newStatus === 'REVERSE') {
      // Operación especial de reversión
      result = await JournalEntryService.bulkReverseOperation(entryIds, reason || 'Reversión masiva desde interfaz');
    } else {
      // Cambio de estado normal - pasar forceReset solo para DRAFT
      if (newStatus === JournalEntryStatus.DRAFT && forceReset !== undefined) {
        result = await JournalEntryService.bulkChangeStatus(entryIds, newStatus, reason, forceReset); // ✅ Con force_reset
      } else {
        result = await JournalEntryService.bulkChangeStatus(entryIds, newStatus, reason);
      }
    }
    
    // ...resto del código
  } catch (error) {
    // ...manejo de errores
  }
};
```

## 🎯 Flujo de Funcionamiento

### **Operación Normal (Otros Estados)**
1. Usuario selecciona asientos → Hace clic en "🔄 Cambiar Estado"
2. Selecciona estado (Aprobado, Contabilizado, Cancelado, etc.)
3. Aparece modal pidiendo razón
4. **NO aparece checkbox** de force_reset
5. Confirma y se ejecuta normalmente

### **Restaurar a Borrador (DRAFT)**
1. Usuario selecciona asientos → Hace clic en "🔄 Cambiar Estado"
2. Selecciona "Restaurar a Borrador"
3. Aparece modal pidiendo razón
4. **✅ APARECE checkbox** "Forzar restauración" (deshabilitado por defecto)
5. Usuario puede:
   - Dejar checkbox desmarcado → Operación normal
   - **Marcar checkbox** → Forzar restauración con `force_reset: true`
6. Confirma y se ejecuta con el parámetro correspondiente

## 🔒 Seguridad y UX

### **Condiciones de Aparición**
- ✅ **Solo aparece para DRAFT**: El checkbox es específico para restaurar a borrador
- ✅ **Deshabilitado por defecto**: Requiere acción consciente del usuario
- ✅ **Advertencia clara**: Texto explicativo con advertencia en amarillo

### **Integración con Backend**
- ✅ **Servicio ya actualizado**: `JournalEntryService.bulkChangeStatus()` acepta `forceReset`
- ✅ **Request correcto**: Se envía `force_reset: true/false` según selección
- ✅ **Logging completo**: Se registra el uso de force_reset

## 📱 Experiencia de Usuario

### **Donde Aparece**
- ✅ **Selección múltiple**: Cuando se seleccionan uno o varios asientos
- ✅ **Dropdown de estado**: Al elegir "Restaurar a Borrador" desde el menú bulk
- ✅ **Modal de confirmación**: Checkbox visible en el modal de razón

### **Diseño Visual**
- ✅ **Checkbox estilizado**: Colores azules consistentes con la UI
- ✅ **Descripción clara**: Texto explicativo sobre qué hace la opción
- ✅ **Advertencia destacada**: "Usar con precaución" en color amarillo
- ✅ **Responsive**: Funciona correctamente en diferentes tamaños de pantalla

## ✅ Estado Final

| Componente | Funcionalidad | Estado |
|------------|---------------|--------|
| **ReasonPromptModal** | Checkbox condicional para force_reset | ✅ Completado |
| **BulkStatusChanger** | Paso de parámetro force_reset | ✅ Completado |
| **JournalEntryList** | Manejo de force_reset en bulk operations | ✅ Completado |
| **Servicio Backend** | Envío de force_reset al API | ✅ Ya implementado |
| **UX/UI** | Advertencias y usabilidad | ✅ Completado |

## 🎉 Resultado Final

Los usuarios ahora pueden:

1. **Seleccionar uno o múltiples asientos** desde la lista
2. **Usar el dropdown de cambio de estado masivo** (🔄 Cambiar Estado)
3. **Elegir "Restaurar a Borrador"**
4. **Ver el checkbox "Forzar restauración"** en el modal
5. **Decidir si usar force_reset** según sea necesario
6. **Tener control granular** sobre el comportamiento de la restauración

La funcionalidad está **completamente implementada** y funcional para operaciones bulk de cambio de estado.
