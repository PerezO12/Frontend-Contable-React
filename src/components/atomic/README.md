# Sistema de Componentes Atómicos - ListView

## Descripción

Este sistema implementa un componente genérico `ListView` basado en **Atomic Design** para unificar la experiencia de usuario en todos los listados de datos del sistema. El componente proporciona funcionalidades consistentes de filtrado, paginación, selección y acciones masivas.

## Arquitectura

### Atomic Design Structure

```
src/components/atomic/
├── atoms/                  # Componentes básicos reutilizables
│   ├── Button.tsx         # Botón con variantes y estados
│   ├── Input.tsx          # Input con validación y estados
│   ├── Icon.tsx           # Contenedor de iconos con tamaños
│   ├── Typography.tsx     # Tipografía con variantes semánticas
│   └── index.ts
├── molecules/             # Combinaciones de átomos
│   ├── FilterGroup.tsx    # Grupo de filtros configurables
│   ├── Pagination.tsx     # Componente de paginación
│   ├── ActionBar.tsx      # Barra de acciones y selección
│   ├── Breadcrumbs.tsx    # Navegación de migas de pan
│   └── index.ts
├── organisms/             # Componentes complejos
│   ├── ListView.tsx       # Componente principal de listado
│   └── index.ts
├── templates/             # Implementaciones específicas
│   ├── ProductListView.tsx    # Ejemplo para productos
│   ├── ThirdPartyListView.tsx # Ejemplo para terceros
│   └── index.ts
├── types.ts               # Definiciones de tipos TypeScript
├── theme.ts               # Tokens de diseño
└── index.ts               # Exportaciones principales
```

## Tokens de Diseño

### Colores
- **Primary**: #3b82f6 (azul)
- **Secondary**: #64748b (gris)
- **Success**: #22c55e (verde)
- **Warning**: #eab308 (amarillo)
- **Error**: #ef4444 (rojo)

### Tipografía
- **Font Family**: Inter, system-ui, sans-serif
- **Sizes**: xs (12px), sm (14px), base (16px), lg (18px), xl (20px)
- **Weights**: normal (400), medium (500), semibold (600), bold (700)

### Espaciado
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### Animaciones
- **Duración**: 150ms, 200ms, 300ms
- **Easing**: ease-in-out, ease-out, ease-in
- **Transiciones**: color, background, transform, opacity

## API del Componente ListView

### Props Principales

```typescript
interface ListViewProps<T = any, F = Record<string, any>> {
  // Identificación y metadatos
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  
  // Configuración de columnas y datos
  columns: ListViewColumn<T>[];
  dataFetcher: (params: DataFetchParams) => Promise<DataFetchResponse<T>>;
  
  // Filtros
  filters?: ListViewFilter[];
  initialFilters?: F;
  
  // Acciones
  actions?: ListViewAction<T>[];
  bulkActions?: ListViewAction<T>[];
  
  // Configuración de paginación
  pagination?: PaginationConfig;
  
  // Comportamiento
  selectionMode?: 'none' | 'single' | 'multiple';
  onRowClick?: (item: T) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  
  // Personalización visual
  loadingIndicator?: ReactNode;
  emptyState?: ReactNode;
  variant?: 'table' | 'cards' | 'list';
  
  // Accesibilidad
  ariaLabel?: string;
  ariaDescription?: string;
}
```

### Configuración de Columnas

```typescript
interface ListViewColumn<T = any> {
  key: string;                                    // Clave del campo
  header: string;                                 // Título de la columna
  width?: string | number;                        // Ancho de la columna
  sortable?: boolean;                             // Si es ordenable
  render?: (item: T, value: any) => ReactNode;   // Función de renderizado personalizada
  className?: string;                             // Clases CSS adicionales
}
```

### Configuración de Filtros

```typescript
interface ListViewFilter {
  key: string;                                    // Clave del filtro
  type: 'text' | 'select' | 'date' | 'range' | 'boolean'; // Tipo de filtro
  label: string;                                  // Etiqueta del filtro
  placeholder?: string;                           // Texto de ayuda
  options?: Array<{ value: string | number; label: string }>; // Opciones para select
  defaultValue?: any;                             // Valor por defecto
  validation?: {                                  // Validaciones
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
}
```

### Configuración de Acciones

```typescript
interface ListViewAction<T = any> {
  key: string;                                    // Identificador único
  label: string;                                  // Texto del botón
  icon?: ReactNode;                               // Icono del botón
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'; // Variante visual
  onClick: (selectedItems: T[]) => void;          // Función a ejecutar
  disabled?: boolean;                             // Si está deshabilitado
  requiresSelection?: boolean;                    // Si requiere elementos seleccionados
  confirmMessage?: string;                        // Mensaje de confirmación
}
```

## Ejemplos de Uso

### Ejemplo 1: Lista de Productos

```typescript
import { ProductListView } from '@/components/atomic/templates';

function ProductsPage() {
  const handleProductSelect = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleCreateProduct = () => {
    navigate('/products/new');
  };

  return (
    <ProductListView
      onProductSelect={handleProductSelect}
      onCreateProduct={handleCreateProduct}
      showActions={true}
    />
  );
}
```

### Ejemplo 2: Lista de Terceros

```typescript
import { ThirdPartyListView } from '@/components/atomic/templates';

function ThirdPartiesPage() {
  const handleThirdPartySelect = (thirdParty: ThirdParty) => {
    navigate(`/third-parties/${thirdParty.id}`);
  };

  const handleCreateThirdParty = () => {
    navigate('/third-parties/new');
  };

  return (
    <ThirdPartyListView
      onThirdPartySelect={handleThirdPartySelect}
      onCreateThirdParty={handleCreateThirdParty}
      initialFilters={{ third_party_type: 'customer' }}
      showActions={true}
    />
  );
}
```

### Ejemplo 3: ListView Personalizado

```typescript
import { ListView } from '@/components/atomic/organisms';

function CustomListPage() {
  const columns = [
    {
      key: 'name',
      header: 'Nombre',
      render: (item, value) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      render: (item, value) => (
        <Badge color={value === 'active' ? 'green' : 'red'}>
          {value}
        </Badge>
      )
    }
  ];

  const filters = [
    {
      key: 'search',
      type: 'text' as const,
      label: 'Buscar',
      placeholder: 'Buscar...'
    },
    {
      key: 'status',
      type: 'select' as const,
      label: 'Estado',
      options: [
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' }
      ]
    }
  ];

  const actions = [
    {
      key: 'create',
      label: 'Crear',
      variant: 'primary' as const,
      onClick: () => console.log('Crear')
    }
  ];

  const dataFetcher = async (params) => {
    const response = await api.getData(params);
    return {
      items: response.data,
      total: response.total,
      page: response.page,
      pages: response.pages,
      perPage: response.perPage,
    };
  };

  return (
    <ListView
      title="Mi Lista Personalizada"
      columns={columns}
      filters={filters}
      actions={actions}
      dataFetcher={dataFetcher}
      selectionMode="multiple"
      pagination={{
        pageSizeOptions: [10, 25, 50],
        defaultPageSize: 25,
        showPageSizeSelector: true,
        showTotal: true,
      }}
    />
  );
}
```

## Características

### ✅ UX/UI Unificada
- Design tokens consistentes
- Animaciones suaves
- Estados visuales claros
- Responsive design

### ✅ Accesibilidad (WCAG)
- Navegación por teclado
- Lectores de pantalla
- Contraste adecuado
- Roles ARIA
- Etiquetas descriptivas

### ✅ Funcionalidades
- Filtrado avanzado
- Paginación configurable
- Selección múltiple
- Acciones masivas
- Ordenamiento
- Exportación
- Búsqueda en tiempo real
- Auto-refresh

### ✅ Rendimiento
- Renderizado optimizado
- Debouncing en búsqueda
- Memoización de datos
- Estados de carga

### ✅ Flexibilidad
- Columnas personalizables
- Filtros configurables
- Acciones modulares
- Temas personalizables

## Migración desde Componentes Existentes

### Paso 1: Identificar Componentes a Migrar
- ProductList.tsx → ProductListView.tsx
- ThirdPartyList.tsx → ThirdPartyListView.tsx

### Paso 2: Mapear Props Existentes
```typescript
// Antes
<ProductList
  onProductSelect={handleSelect}
  onCreateProduct={handleCreate}
  initialFilters={filters}
  showActions={true}
/>

// Después
<ProductListView
  onProductSelect={handleSelect}
  onCreateProduct={handleCreate}
  initialFilters={filters}
  showActions={true}
/>
```

### Paso 3: Actualizar Importaciones
```typescript
// Antes
import { ProductList } from '@/features/products/components';

// Después
import { ProductListView } from '@/components/atomic/templates';
```

### Paso 4: Verificar Funcionalidad
- [ ] Filtros funcionan correctamente
- [ ] Paginación opera como se espera
- [ ] Acciones ejecutan las funciones correctas
- [ ] Selección múltiple funciona
- [ ] Navegación por teclado es fluida
- [ ] Diseño responsive se mantiene

## Testing

### Tests Unitarios
```typescript
// __tests__/ListView.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ListView } from '@/components/atomic/organisms';

describe('ListView', () => {
  const mockDataFetcher = jest.fn();
  const defaultProps = {
    title: 'Test List',
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'status', header: 'Status' }
    ],
    dataFetcher: mockDataFetcher,
  };

  beforeEach(() => {
    mockDataFetcher.mockResolvedValue({
      items: [
        { id: '1', name: 'Item 1', status: 'active' },
        { id: '2', name: 'Item 2', status: 'inactive' }
      ],
      total: 2,
      page: 1,
      pages: 1,
      perPage: 25,
    });
  });

  it('renders title and data correctly', async () => {
    render(<ListView {...defaultProps} />);
    
    expect(screen.getByText('Test List')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  it('handles selection correctly', async () => {
    const onSelectionChange = jest.fn();
    render(
      <ListView 
        {...defaultProps} 
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
      />
    );
    
    await waitFor(() => {
      const checkbox = screen.getAllByRole('checkbox')[1]; // First item checkbox
      fireEvent.click(checkbox);
    });
    
    expect(onSelectionChange).toHaveBeenCalledWith([
      { id: '1', name: 'Item 1', status: 'active' }
    ]);
  });

  it('handles pagination correctly', async () => {
    render(<ListView {...defaultProps} />);
    
    await waitFor(() => {
      const nextButton = screen.getByText('Siguiente');
      // Test pagination functionality
    });
  });
});
```

### Tests de Accesibilidad
```typescript
// __tests__/ListView.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ListView } from '@/components/atomic/organisms';

expect.extend(toHaveNoViolations);

describe('ListView Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<ListView {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
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
    expect(screen.getByRole('table')).toHaveAttribute('aria-describedby');
  });
});
```

## Consideraciones de Rendimiento

### Optimizaciones Implementadas
1. **Memoización**: `useMemo` para datos procesados
2. **Callbacks optimizados**: `useCallback` para handlers
3. **Renderizado condicional**: Lazy loading de componentes
4. **Debouncing**: En filtros de texto
5. **Paginación**: Carga de datos por páginas

### Mejores Prácticas
- Usar `React.memo` para componentes puros
- Implementar virtualization para listas muy grandes
- Cachear respuestas de API cuando sea apropiado
- Optimizar imágenes y assets

## Roadmap

### Versión 1.1
- [ ] Soporte para drag & drop
- [ ] Vistas de card y lista
- [ ] Filtros avanzados con fecha/rango
- [ ] Exportación en más formatos
- [ ] Columnas redimensionables

### Versión 1.2
- [ ] Virtualización para listas grandes
- [ ] Modo offline con cache
- [ ] Filtros guardados
- [ ] Temas personalizables
- [ ] Columnas movibles

### Versión 2.0
- [ ] Integración con GraphQL
- [ ] Real-time updates
- [ ] Advanced sorting
- [ ] Búsqueda federada
- [ ] Analytics integrados

## Soporte y Contribución

### Reportar Issues
- Usar el template de issue en GitHub
- Incluir pasos para reproducir
- Especificar versión y navegador
- Adjuntar capturas de pantalla si es necesario

### Contribuir
1. Fork del repositorio
2. Crear rama feature/fix
3. Seguir las convenciones de código
4. Escribir tests
5. Crear Pull Request

### Convenciones de Código
- TypeScript estricto
- ESLint + Prettier
- Convenciones de naming consistentes
- Documentación JSDoc
- Tests obligatorios para nuevas features
