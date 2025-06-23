# Mejoras del Preview del Asiento Contable - Editor Completo

## Resumen de Funcionalidades Implementadas

### 🎯 **Editor Completo del Asiento Contable**

El preview del asiento contable ahora es completamente editable, permitiendo al usuario:

#### 1. **Editar Cuentas Contables**
- **Antes**: Solo se podían ver las cuentas predefinidas
- **Ahora**: Se puede cambiar cualquier cuenta usando `AccountSearch` con autocomplete
- **Funcionalidad**: Dropdown con búsqueda en tiempo real de todas las cuentas disponibles

#### 2. **Editar Descripciones**
- **Antes**: Descripciones fijas basadas en las líneas de factura
- **Ahora**: Campo de texto editable para personalizar cada descripción
- **Casos de uso**: Agregar más detalle contable, referencias específicas

#### 3. **Editar Montos**
- **Funcionalidad existente mejorada**: Campos numéricos para ajustar débitos y créditos
- **Validación**: Recalculo automático de totales
- **Balance**: Indicador visual del estado del balance del asiento

#### 4. **Agregar Nuevas Líneas**
- **Líneas de Débito**: Botón para agregar líneas adicionales de débito
- **Líneas de Crédito**: Botón para agregar líneas adicionales de crédito
- **Casos de uso**: 
  - Dividir un débito entre múltiples cuentas
  - Agregar retenciones o impuestos
  - Registrar descuentos en cuentas específicas

#### 5. **Eliminar Líneas**
- **Botón de eliminación**: Icono de basurera en cada línea editable
- **Recalculo automático**: Los totales se actualizan al eliminar líneas
- **Protección**: Solo se pueden eliminar líneas editables (no las automáticas del sistema)

## Interfaz de Usuario

### Modo Vista (Por Defecto)
```tsx
- Botón: "Editar Asiento"
- Tabla de solo lectura con cuentas, descripciones y montos
- Totales y estado del balance
```

### Modo Edición (Al hacer clic en "Editar Asiento")
```tsx
- Botón: "Finalizar Edición"
- Campos editables:
  * AccountSearch para seleccionar cuentas
  * Input de texto para descripciones
  * Input numérico para montos
- Botones de acción:
  * "Agregar Línea Débito" (verde)
  * "Agregar Línea Crédito" (azul)
  * Botones de eliminación por línea (rojo)
```

## Implementación Técnica

### Estructura de Datos Actualizada

```typescript
interface JournalEntryPreview {
  debit_lines: Array<{
    id: string;
    account_id?: string;        // ✅ NUEVO: Para edición de cuentas
    account_code: string;
    account_name: string;
    description: string;
    debit_amount: number;
    is_editable?: boolean;      // ✅ Control de edición
  }>;
  credit_lines: Array<{
    id: string;
    account_id?: string;        // ✅ NUEVO: Para edición de cuentas
    account_code: string;
    account_name: string;
    description: string;
    credit_amount: number;
    is_editable?: boolean;      // ✅ Control de edición
  }>;
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
}
```

### Funciones Implementadas

#### Edición de Cuentas
```typescript
handleDebitAccountChange(lineId, accountId, accountInfo)
handleCreditAccountChange(lineId, accountId, accountInfo)
```

#### Edición de Descripciones
```typescript
handleDebitDescriptionChange(lineId, newDescription)
handleCreditDescriptionChange(lineId, newDescription)
```

#### Edición de Montos (Mejorada)
```typescript
handleDebitAmountChange(lineId, newAmount)    // Con recalculo automático
handleCreditAmountChange(lineId, newAmount)   // Con recalculo automático
```

#### Gestión de Líneas
```typescript
addDebitLine()                // Agregar nueva línea de débito
addCreditLine()               // Agregar nueva línea de crédito
handleRemoveDebitLine(lineId) // Eliminar línea de débito
handleRemoveCreditLine(lineId)// Eliminar línea de crédito
```

## Casos de Uso Prácticos

### 1. **División de Débitos**
**Escenario**: Factura de $1,000 donde $800 van a una cuenta y $200 a otra
- Editar la línea de débito principal ($800)
- Agregar nueva línea de débito ($200)
- Seleccionar cuentas diferentes para cada línea

### 2. **Agregar Retenciones**
**Escenario**: Factura con retención en la fuente
- Líneas automáticas: Débito "Cuentas por Cobrar" y Crédito "Ventas"
- Agregar: Débito "Retención en la Fuente" y reducir "Cuentas por Cobrar"

### 3. **Corrección de Cuentas**
**Escenario**: El sistema asignó una cuenta incorrecta
- Hacer clic en "Editar Asiento"
- Cambiar la cuenta usando AccountSearch
- Mantener descripción y monto

### 4. **Asientos Más Detallados**
**Escenario**: Necesidad de más granularidad contable
- Dividir una línea de crédito por productos
- Agregar múltiples líneas con descripciones específicas
- Asignar cuentas específicas por categoría

## Validaciones y Controles

### Balance Automático
- ✅ Verificación en tiempo real: `total_debit === total_credit`
- ✅ Indicador visual: Verde (balanceado) / Rojo (desbalanceado)
- ✅ Cálculo automático de diferencias

### Protección de Datos
- ✅ Solo líneas marcadas como `is_editable` pueden modificarse
- ✅ Recalculo automático de totales en cada cambio
- ✅ Validación de montos mínimos (≥ 0)

### UX/UI
- ✅ Feedback visual inmediato
- ✅ Confirmación de acciones destructivas
- ✅ Estados de carga y validación
- ✅ Responsive design para diferentes pantallas

## Estado Final

El preview del asiento contable ahora es un **editor completo** que permite:

🎯 **Flexibilidad Total**: Modificar cualquier aspecto del asiento
🎯 **Facilidad de Uso**: Interfaz intuitiva con componentes reutilizables
🎯 **Validación Robusta**: Control automático del balance contable
🎯 **Casos Complejos**: Soporte para asientos contables avanzados

Esta implementación transforma el preview de un simple visualizador a una herramienta de edición contable completa, manteniendo la integridad de los datos y la facilidad de uso.
