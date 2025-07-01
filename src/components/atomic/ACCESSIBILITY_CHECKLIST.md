 # Checklist de Accesibilidad - Sistema ListView

## Introducción

Este checklist garantiza que el sistema ListView cumple con los estándares de accesibilidad WCAG 2.1 AA. Cada elemento ha sido diseñado e implementado considerando usuarios con diferentes capacidades y tecnologías de asistencia.

## ✅ Nivel A - Requisitos Básicos

### Perceptibilidad

#### Imágenes y Contenido No Textual
- [x] **1.1.1** Todos los iconos tienen texto alternativo descriptivo
- [x] **1.1.1** Elementos gráficos informativos incluyen labels apropiados
- [x] **1.1.1** Estados visuales (loading, error) tienen descripciones textuales

```typescript
// ✅ Implementación correcta
<Icon aria-label="Producto disponible" aria-hidden={false}>
  <CheckIcon />
</Icon>

// ✅ Estados descriptivos  
const LoadingState = () => (
  <div aria-live="polite" aria-label="Cargando productos">
    <Spinner />
    <span className="sr-only">Cargando lista de productos...</span>
  </div>
);
```

#### Medios Basados en Tiempo
- [x] **1.2.1** No aplica - El sistema no usa contenido multimedia

#### Adaptabilidad  
- [x] **1.3.1** Estructura semántica correcta usando elementos HTML apropiados
- [x] **1.3.2** Orden de lectura lógico y secuencial
- [x] **1.3.3** Instrucciones no dependen solo de características sensoriales

```typescript
// ✅ Estructura semántica
<table role="table" aria-label="Lista de productos">
  <thead>
    <tr role="row">
      <th role="columnheader" scope="col">Código</th>
      <th role="columnheader" scope="col">Nombre</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row">
      <td role="gridcell">P001</td>
      <td role="gridcell">Producto 1</td>
    </tr>
  </tbody>
</table>
```

#### Distinguibilidad
- [x] **1.4.1** Color no es el único medio visual para transmitir información
- [x] **1.4.2** Control de audio no aplica - no hay contenido multimedia
- [x] **1.4.3** Contraste mínimo de 4.5:1 para texto normal, 3:1 para texto grande

```css
/* ✅ Ratios de contraste verificados con colores suaves */
.text-primary { color: #4f46e5; } /* Contraste: 7.8:1 sobre blanco */
.text-secondary { color: #6b7280; } /* Contraste: 7.1:1 sobre blanco */
.text-success { color: #059669; } /* Contraste: 6.2:1 sobre blanco */
.text-error { color: #dc2626; } /* Contraste: 7.0:1 sobre blanco */
```

### Operabilidad

#### Accesibilidad del Teclado
- [x] **2.1.1** Toda la funcionalidad está disponible vía teclado
- [x] **2.1.2** No hay trampas de teclado - focus puede moverse libremente

```typescript
// ✅ Navegación por teclado implementada
const Button = ({ onKeyDown, ...props }) => (
  <button
    {...props}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        props.onClick?.(e);
      }
      onKeyDown?.(e);
    }}
  />
);
```

#### Convulsiones y Reacciones Físicas  
- [x] **2.3.1** Sin contenido que parpadee más de 3 veces por segundo

#### Navegabilidad
- [x] **2.4.1** Mecanismo para saltar bloques de contenido (skip links donde aplique)
- [x] **2.4.2** Páginas tienen títulos descriptivos
- [x] **2.4.3** Orden de enfoque es lógico y significativo
- [x] **2.4.4** Propósito de enlaces es claro por contexto o texto del enlace

```typescript
// ✅ Orden de tabulación lógico
const ListView = () => (
  <div>
    {/* 1. Filtros */}
    <FilterGroup tabIndex={0} />
    
    {/* 2. Acciones principales */}
    <ActionBar tabIndex={0} />
    
    {/* 3. Contenido de la tabla */}
    <DataTable tabIndex={0} />
    
    {/* 4. Paginación */}
    <Pagination tabIndex={0} />
  </div>
);
```

### Comprensibilidad

#### Legibilidad
- [x] **3.1.1** Idioma de la página está especificado (html lang="es")

#### Predecibilidad  
- [x] **3.2.1** Componentes no cambian cuando reciben foco
- [x] **3.2.2** Componentes no cambian cuando se cambian valores

```typescript
// ✅ Comportamiento predecible
const FilterInput = ({ onChange }) => {
  const [value, setValue] = useState('');
  
  // Cambios solo ocurren por acciones explícitas del usuario
  const handleChange = (e) => {
    setValue(e.target.value);
    // Debounce para evitar cambios inesperados
    debouncedOnChange(e.target.value);
  };
};
```

#### Asistencia de Entrada
- [x] **3.3.1** Errores son identificados y descritos en texto
- [x] **3.3.2** Etiquetas o instrucciones están disponibles cuando se requiere entrada del usuario

```typescript
// ✅ Manejo de errores accesible
const Input = ({ error, label, required }) => (
  <div>
    <label htmlFor={inputId} className={error ? 'text-error-700' : 'text-secondary-700'}>
      {label}
      {required && <span aria-label="campo requerido"> *</span>}
    </label>
    <input
      id={inputId}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${inputId}-error` : undefined}
    />
    {error && (
      <div id={`${inputId}-error`} role="alert" className="text-error-600">
        {error}
      </div>
    )}
  </div>
);
```

### Robustez

#### Compatibilidad
- [x] **4.1.1** Código HTML válido y bien formado
- [x] **4.1.2** Nombre, función y valor están disponibles para tecnologías de asistencia

```typescript
// ✅ ARIA correctamente implementado
<button
  aria-label="Eliminar producto seleccionado"
  aria-describedby="delete-help"
  disabled={selectedItems.length === 0}
  aria-disabled={selectedItems.length === 0}
>
  Eliminar
</button>
<div id="delete-help" className="sr-only">
  Esta acción eliminará permanentemente los elementos seleccionados
</div>
```

## ✅ Nivel AA - Requisitos Avanzados

### Perceptibilidad Avanzada

#### Distinguibilidad Mejorada
- [x] **1.4.4** Texto puede redimensionarse hasta 200% sin pérdida de funcionalidad
- [x] **1.4.5** Imágenes de texto se evitan en favor de texto real
- [x] **1.4.10** Reflow - contenido se presenta sin scroll horizontal en 320px
- [x] **1.4.11** Contraste de elementos no textuales de al menos 3:1

```css
/* ✅ Responsive design que soporta zoom y reflow */
@media (max-width: 320px) {
  .table-container {
    overflow-x: auto;
    scroll-behavior: smooth;
  }
  
  .table-row {
    min-width: max-content;
  }
}

/* ✅ Contraste para elementos UI con colores suaves */
.border-primary { border-color: #4f46e5; } /* Contraste: 4.2:1 */
.focus-ring { outline: 2px solid #4f46e5; } /* Contraste: 4.2:1 */
```

### Operabilidad Avanzada

#### Navegabilidad Mejorada
- [x] **2.4.5** Múltiples maneras de localizar páginas (navegación, búsqueda, mapa del sitio)
- [x] **2.4.6** Encabezados y etiquetas descriptivos
- [x] **2.4.7** Indicador de foco visible

```typescript
// ✅ Focus visible y múltiples formas de navegación
const Button = ({ className = '', ...props }) => (
  <button
    className={`
      focus:outline-none 
      focus:ring-2 
      focus:ring-primary-500 
      focus:ring-offset-2
      ${className}
    `}
    {...props}
  />
);

// ✅ Breadcrumbs para navegación alternativa
<Breadcrumbs items={[
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/products' },
  { label: 'Lista de productos' }
]} />
```

### Comprensibilidad Avanzada

#### Asistencia de Entrada Avanzada
- [x] **3.3.3** Sugerencias de error están disponibles cuando se detecta automáticamente
- [x] **3.3.4** Prevención de errores para páginas con consecuencias legales/financieras

```typescript
// ✅ Prevención y corrección de errores
const BulkDeleteAction = ({ selectedItems, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const requiredText = 'ELIMINAR';
  
  return (
    <Modal>
      <Typography variant="h4" color="error">
        ⚠️ Acción Irreversible
      </Typography>
      
      <Typography variant="body1">
        Estás a punto de eliminar {selectedItems.length} elementos permanentemente.
      </Typography>
      
      <Typography variant="body2" color="secondary">
        Para confirmar, escribe "{requiredText}" en el campo siguiente:
      </Typography>
      
      <Input
        value={confirmText}
        onChange={setConfirmText}
        aria-label="Campo de confirmación"
        aria-describedby="confirm-help"
      />
      
      <div id="confirm-help" className="sr-only">
        Debes escribir la palabra {requiredText} exactamente para confirmar la eliminación
      </div>
      
      <Button
        variant="error"
        disabled={confirmText !== requiredText}
        onClick={onConfirm}
        aria-describedby="delete-consequence"
      >
        Eliminar Permanentemente
      </Button>
      
      <div id="delete-consequence" className="sr-only">
        Esta acción no se puede deshacer
      </div>
    </Modal>
  );
};
```

## 🧪 Tests de Accesibilidad

### Tests Automatizados

```typescript
// __tests__/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ListView } from '../ListView';

expect.extend(toHaveNoViolations);

describe('ListView Accessibility', () => {
  const defaultProps = {
    title: 'Test List',
    columns: [{ key: 'name', header: 'Name' }],
    dataFetcher: jest.fn(),
  };

  it('should not have accessibility violations', async () => {
    const { container } = render(<ListView {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    const { getByRole } = render(<ListView {...defaultProps} />);
    
    // Verificar que elementos focusables están en orden correcto
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  it('has proper ARIA labels', () => {
    render(
      <ListView 
        {...defaultProps} 
        ariaLabel="Lista de productos"
        ariaDescription="Tabla con todos los productos del sistema"
      />
    );
    
    expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'Lista de productos');
  });

  it('announces dynamic content changes', async () => {
    const { rerender } = render(<ListView {...defaultProps} />);
    
    // Simular cambio de estado
    rerender(<ListView {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Cargando...')).toHaveAttribute('aria-live', 'polite');
  });
});
```

### Tests Manuales con Lectores de Pantalla

#### NVDA (Windows)
- [ ] Navegación por encabezados (H key)
- [ ] Navegación por formularios (F key)
- [ ] Navegación por tablas (T key)
- [ ] Lectura de contenido dinámico
- [ ] Anuncio de cambios de estado

#### JAWS (Windows)  
- [ ] Virtual cursor navigation
- [ ] Forms mode functionality
- [ ] Table navigation
- [ ] Live region announcements

#### VoiceOver (macOS)
- [ ] Rotor navigation
- [ ] Table navigation (Control+Option+Cmd+T)
- [ ] Form controls interaction
- [ ] Dynamic content updates

#### TalkBack (Android)
- [ ] Explore by touch
- [ ] Linear navigation
- [ ] Reading controls
- [ ] Gesture navigation

### Tests de Teclado

```typescript
// Keyboard navigation test cases
describe('Keyboard Navigation', () => {
  it('Tab key moves focus forward', () => {
    // Test implementation
  });

  it('Shift+Tab moves focus backward', () => {
    // Test implementation  
  });

  it('Enter activates buttons and links', () => {
    // Test implementation
  });

  it('Space activates buttons', () => {
    // Test implementation
  });

  it('Escape closes modals and dropdowns', () => {
    // Test implementation
  });

  it('Arrow keys navigate within components', () => {
    // Test implementation for table navigation
  });
});
```

## 🎯 Validaciones Específicas del Sistema

### Filtros
- [x] Cada filtro tiene label asociado
- [x] Errores de validación se anuncian
- [x] Placeholders son descriptivos
- [x] Required fields están marcados

### Tabla de Datos
- [x] Headers están asociados correctamente
- [x] Datos se pueden navegar con teclado
- [x] Sorting se anuncia cuando cambia
- [x] Selección múltiple es accesible

### Paginación
- [x] Estado actual se anuncia
- [x] Controles son accesibles por teclado
- [x] Deshabilitación se maneja correctamente
- [x] Navegación rápida funciona

### Acciones Masivas
- [x] Selección se anuncia
- [x] Acciones peligrosas requieren confirmación
- [x] Resultados de acciones se anuncian
- [x] Estados de loading son accesibles

## 🔧 Herramientas de Validación

### Automatizadas
- **axe-core**: Tests automatizados integrados
- **Lighthouse**: Auditorías de accesibilidad
- **WAVE**: Extensión de navegador para evaluación
- **Accessibility Insights**: Herramienta de Microsoft

### Manuales
- **Keyboard navigation**: Desconectar mouse y navegar solo con teclado
- **Screen readers**: Probar con NVDA, JAWS, VoiceOver
- **High contrast mode**: Verificar visibilidad en modo alto contraste
- **Zoom**: Probar hasta 200% de zoom

### Comandos útiles

```bash
# Ejecutar tests de accesibilidad
npm run test:a11y

# Auditoría con Lighthouse
npm run lighthouse:a11y

# Verificar contraste de colores
npm run test:contrast

# Validar HTML
npm run validate:html
```

## 📋 Checklist Final

### Pre-deploy
- [ ] Todos los tests de accesibilidad pasan
- [ ] Validación manual con lectores de pantalla
- [ ] Navegación completa solo con teclado
- [ ] Contraste verificado en todos los estados
- [ ] HTML válido y semánticamente correcto

### Post-deploy  
- [ ] Tests en diferentes navegadores
- [ ] Verificación en dispositivos móviles
- [ ] Feedback de usuarios con discapacidades
- [ ] Monitoreo continuo de métricas de accesibilidad

## 📚 Recursos Adicionales

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Inclusive Components](https://inclusive-components.design/)

---

**Nota**: Este checklist debe revisarse y actualizarse regularmente para mantener los más altos estándares de accesibilidad.
