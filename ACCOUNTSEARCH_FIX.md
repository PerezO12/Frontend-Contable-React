# Corrección del Problema de Reset y Bucle Infinito en AccountSearch

## Problemas Identificados

### 1. Reset del Campo de Texto
El componente `AccountSearch` tenía un conflicto en el manejo del estado que causaba que el campo de texto se reseteara mientras el usuario estaba escribiendo.

### 2. Bucle Infinito en useEffect
El error "Maximum update depth exceeded" indicaba un bucle infinito causado por:
- `accountOptions` recalculándose en cada render
- Dependencias de `useEffect` que cambiaban constantemente
- Funciones no memoizadas que se recreaban en cada render

## Solución Implementada

### 1. Estabilización de accountOptions con useMemo
```typescript
const accountOptions: AccountOption[] = useMemo(() => {
  return accounts.map(account => ({
    id: account.id,
    code: account.code,
    name: account.name,
    type: account.account_type || 'other',
    level: account.level || 1
  }));
}, [accounts]); // Solo depende de accounts
```

### 2. Memoización de handleAccountSelect
```typescript
const handleAccountSelect = useCallback((account: AccountOption) => {
  setSelectedAccount(account);
  setSearchTerm(`${account.code} - ${account.name}`);
  setIsOpen(false);
  setIsUserTyping(false);
  onChange(account.id, account);
}, [onChange]); // Solo depende de onChange
```

### 3. Estado de Control de Escritura
```typescript
const [isUserTyping, setIsUserTyping] = useState(false);
```

### 4. useEffect Optimizado para Sincronización
```typescript
useEffect(() => {
  if (isUserTyping) return; // No actualizar si el usuario está escribiendo
  
  if (value && accountOptions.length > 0) {
    const account = accountOptions.find(acc => acc.id === value);
    setSelectedAccount(account || null);
    if (account) {
      setSearchTerm(`${account.code} - ${account.name}`);
    }
  } else {
    setSelectedAccount(null);
    setSearchTerm('');
  }
}, [value, accountOptions, isUserTyping]); // Dependencias estables
```

### 5. useEffect Simplificado para Click Outside
```typescript
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setIsUserTyping(false);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []); // Sin dependencias para evitar recreación constante
```

## Cambios Clave para Evitar Bucles Infinitos

### ✅ useMemo para Datos Derivados
- `accountOptions` ahora se memoiza y solo cambia cuando `accounts` cambia
- Evita recálculos innecesarios en cada render

### ✅ useCallback para Funciones
- `handleAccountSelect` memoizada para evitar recreación constante
- Solo se recrea si `onChange` cambia

### ✅ Dependencias Mínimas en useEffect
- Eliminadas dependencias innecesarias en el useEffect del click outside
- Solo las dependencias esenciales en otros useEffect

### ✅ Estado de Control Inteligente
- `isUserTyping` previene conflictos entre input del usuario y sincronización externa
- Control preciso de cuándo actualizar cada estado

## Mejoras Adicionales Implementadas

### 🎯 Navegación por Teclado
```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && filteredAccounts.length > 0 && !selectedAccount) {
    e.preventDefault();
    handleAccountSelect(filteredAccounts[0]);
  } else if (e.key === 'Escape') {
    setIsOpen(false);
    setIsUserTyping(false);
  }
};
```

### 🎯 Gestión de Estados Coordinada
- `onFocus`: Activa modo de escritura
- `onChange`: Mantiene modo de escritura
- `onSelect`: Desactiva modo de escritura
- `onBlur`: Desactiva modo de escritura

## Resultado Final

### ✅ Problemas Resueltos
- **Sin bucles infinitos**: useEffect optimizados con dependencias estables
- **Sin reset del campo**: Control inteligente del estado de escritura
- **Performance mejorado**: Memoización efectiva de cálculos costosos
- **Experiencia fluida**: Usuario puede escribir sin interrupciones

### ✅ Comportamiento Esperado
1. **Escritura libre**: Sin interrupciones ni resets
2. **Búsqueda en tiempo real**: Filtrado mientras escribe
3. **Selección intuitiva**: Clic, Enter o autocompletado
4. **Sincronización externa**: Cambios desde el padre funcionan correctamente
5. **Performance óptimo**: Sin renders innecesarios

### ✅ Código Limpio
- Funciones memoizadas apropiadamente
- Estados bien organizados
- useEffect con propósitos específicos
- Dependencias mínimas y necesarias

El componente ahora es estable, eficiente y proporciona una excelente experiencia de usuario sin los problemas de performance y bucles infinitos que tenía antes.
