# Funcionalidad de Eliminación/Desactivación de Términos de Pago

## Resumen de Implementación

Se ha implementado la funcionalidad solicitada para permitir eliminar términos de pago, con la lógica inteligente de desactivación cuando hay facturas asociadas.

## Backend - Cambios Realizados

### 1. Nuevo Endpoint de Verificación
**Archivo**: `app/api/payment_terms.py`
- **Endpoint**: `GET /api/v1/payment-terms/{payment_terms_id}/can-delete`
- **Función**: Verifica si un término de pago se puede eliminar o solo desactivar
- **Respuesta**:
  ```json
  {
    "can_delete": boolean,
    "can_deactivate": boolean,
    "usage_count": number,
    "is_active": boolean,
    "message": string
  }
  ```

### 2. Nuevo Método en el Servicio
**Archivo**: `app/services/payment_terms_service.py`
- **Método**: `check_can_delete_payment_terms()`
- **Lógica**: 
  - Cuenta cuántas facturas (journal entries) usan este término de pago
  - Si `usage_count = 0`, permite eliminar
  - Si `usage_count > 0`, solo permite desactivar

### 3. Endpoint Existente Aprovechado
- **Endpoint**: `PATCH /api/v1/payment-terms/{payment_terms_id}/toggle-active`
- **Función**: Alterna el estado activo/inactivo

## Frontend - Cambios Realizados

### 1. Nuevos Métodos en el Hook
**Archivo**: `src/features/payment-terms/hooks/usePaymentTerms.ts`
- **Método**: `removePaymentTermsLocal()` - Remueve un término de pago de la lista local
- **Método**: `updatePaymentTermsLocal()` - Actualiza un término de pago en la lista local
- **Método**: `addPaymentTermsLocal()` - Agrega un nuevo término de pago a la lista local

### 2. Nuevo Componente UI
**Archivo**: `src/features/payment-terms/services/paymentTermsService.ts`
- **Método**: `checkCanDeletePaymentTerms()` - Verifica si se puede eliminar
- **Método**: `toggleActiveStatus()` - Cambia el estado activo/inactivo (ya existía)

### 2. Nuevo Componente UI
**Archivo**: `src/components/ui/ConfirmationModal.tsx`
- Modal de confirmación reutilizable
- Soporte para diferentes tipos: `danger`, `warning`, `info`
- Indicador de loading durante la operación
- Mejora la UX comparado con `window.confirm()`

### 3. Interfaz de Usuario Actualizada
**Archivo**: `src/features/payment-terms/pages/PaymentTermsPage.tsx`

#### Nuevos Botones de Acción:
- **Editar** (icono de lápiz): Abre modal de edición
- **Activar/Desactivar** (icono de check/X): Alterna estado activo
- **Eliminar** (icono de papelera): Elimina o sugiere desactivar

#### Flujo de Eliminación Inteligente:
1. **Verificación**: Llama al endpoint de verificación
2. **Si se puede eliminar**: Muestra modal de confirmación para eliminar
3. **Si NO se puede eliminar**: Muestra modal explicando por qué y ofrece desactivar
4. **Feedback**: Notificaciones de éxito/error

### 4. Estilos CSS Agregados
**Archivo**: `src/index.css`
- Estilo para botón `btn-warning` (faltaba)

## Funcionalidades Implementadas

### ✅ Creación Inmediata
- Al crear un término de pago, aparece inmediatamente en la lista
- Verifica si cumple con los filtros actuales antes de mostrarlo
- Selecciona automáticamente el nuevo término creado

### ✅ Edición Inmediata
- Los cambios de edición se reflejan inmediatamente en la lista
- Mantiene la selección del término editado

### ✅ Eliminación Segura
- Antes de eliminar, verifica si hay facturas asociadas
- Respuesta clara sobre por qué no se puede eliminar

### ✅ Eliminación Segura
- Solo permite eliminar si no hay facturas asociadas
- Confirmación con modal elegante

### ✅ Desactivación Alternativa
- Cuando no se puede eliminar, ofrece desactivar
- Mantiene integridad referencial

### ✅ Interfaz Intuitiva
- Botones de acción claros en cada elemento
- Iconos descriptivos
- Estados visuales (activo/inactivo)

### ✅ Experiencia de Usuario
- Modales de confirmación profesionales
- Loading states durante operaciones
- Mensajes informativos
- Prevención de clics accidentales

## Uso

### **Crear un término de pago**:
1. Click en "Crear Nuevo"
2. Llenar el formulario en el modal
3. Al confirmar, se crea en el backend
4. **Inmediatamente** aparece en la lista (si cumple con los filtros actuales)
5. Se selecciona automáticamente el nuevo término

### **Editar un término de pago**:
1. Hacer doble click en un término de pago (o usar opción de edición existente)
2. Modificar datos en el modal
3. Al confirmar, se actualiza en el backend
4. **Inmediatamente** se actualizan los datos en la lista
5. Se mantiene la selección del término editado

### **Activar/Desactivar un término de pago**:
1. Click en el icono de check/X
2. Confirmar la acción en el modal
3. **Inmediatamente** se actualiza el estado en la lista

### **Eliminar un término de pago**:
1. Click en el icono de papelera
2. Si no hay facturas asociadas: Se elimina directamente
3. Si hay facturas asociadas: Se ofrece desactivar en su lugar
4. **Inmediatamente** desaparece de la lista (si se elimina) o cambia estado (si se desactiva)

## Seguridad

- Todas las operaciones requieren confirmación
- Verificación de backend antes de eliminación
- Mantenimiento de integridad referencial
- Logs detallados de operaciones

## Próximos Pasos Sugeridos

1. **Notificaciones Toast**: Reemplazar `alert()` con sistema de toast
2. **Undo/Redo**: Permitir deshacer operaciones de desactivación
3. **Auditoría**: Registrar quién y cuándo realizó cada operación
4. **Bulk Operations**: Permitir operaciones masivas con la misma lógica
