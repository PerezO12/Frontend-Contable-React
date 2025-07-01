# Guía de Migración al Sistema ListView

## Resumen

Esta guía te ayudará a migrar de los componentes de listado existentes (como `ProductList` y `ThirdPartyList`) al nuevo sistema unificado basado en `ListView`.

## Ventajas de la Migración

- ✅ **UX/UI Consistente**: Todos los listados tendrán la misma experiencia
- ✅ **Mantenimiento Reducido**: Un solo componente que mantener
- ✅ **Accesibilidad Mejorada**: Cumplimiento WCAG automático
- ✅ **Funcionalidades Avanzadas**: Filtros, paginación y acciones unificadas
- ✅ **TypeScript Completo**: Mayor seguridad y developer experience
- ✅ **Performance Optimizada**: Mejores prácticas integradas

## Proceso de Migración

### Paso 1: Análisis del Componente Actual

Antes de migrar, analiza el componente existente:

```typescript
// ❌ Antes - ProductList.tsx (Ejemplo de análisis)
interface ProductListProps {
  onProductSelect?: (product: Product) => void;
  onCreateProduct?: () => void;
  initialFilters?: ProductFilters;
  showActions?: boolean;
}

// Identificar:
// - Props que se mantienen
// - Props que se transforman  
// - Props nuevas que se añaden
// - Funcionalidades que se mejoran
```

### Paso 2: Mapeo de Props

#### Props que se mantienen igual:
```typescript
// ✅ Estas props se mantienen idénticas
onProductSelect?: (product: Product) => void;
onCreateProduct?: () => void; 
initialFilters?: ProductFilters;
showActions?: boolean;
```

#### Props que se transforman:
```typescript
// ❌ Antes
interface OldProductListProps {
  data: Product[];
  loading: boolean;
  pagination: PaginationInfo;
}

// ✅ Después  
interface NewProductListProps {
  dataFetcher: (params: DataFetchParams) => Promise<DataFetchResponse<Product>>;
  // El componente maneja internamente loading y pagination
}
```

### Paso 3: Migración de ProductList

#### 3.1. Crear el nuevo componente

```typescript
// ✅ src/components/atomic/templates/ProductListView.tsx
import { ListView } from '../organisms/ListView';
import { ProductService } from '../../../features/products/services';

export const ProductListView: React.FC<ProductListViewProps> = (props) => {
  // Configuración de columnas
  const columns: ListViewColumn<Product>[] = [
    {
      key: 'code',
      header: 'Código',
      width: '150px',
      render: (product) => (
        <div className="font-medium text-secondary-900">
          {product.code}
        </div>
      ),
    },
    // ... más columnas
  ];

  // Data fetcher que reemplaza la lógica de carga
  const dataFetcher = async (params: any) => {
    const response = await ProductService.getProducts(params);
    return {
      items: response.items || [],
      total: response.total || 0,
      page: response.page || 1,
      pages: response.pages || 1,
      perPage: response.per_page || 25,
    };
  };

  return (
    <ListView<Product>
      title="Productos"
      columns={columns}
      dataFetcher={dataFetcher}
      {...props}
    />
  );
};
```

#### 3.2. Actualizar las páginas que usan ProductList

```typescript
// ❌ Antes - pages/ProductsPage.tsx
import { ProductList } from '../features/products/components';

function ProductsPage() {
  return (
    <ProductList
      onProductSelect={handleSelect}
      onCreateProduct={handleCreate}
    />
  );
}

// ✅ Después - pages/ProductsPage.tsx  
import { ProductListView } from '../components/atomic/templates';

function ProductsPage() {
  return (
    <ProductListView
      onProductSelect={handleSelect}
      onCreateProduct={handleCreate}
    />
  );
}
```

#### 3.3. Actualizar tests

```typescript
// ❌ Antes - __tests__/ProductList.test.tsx
import { ProductList } from '../ProductList';

describe('ProductList', () => {
  it('renders products correctly', () => {
    const mockProducts = [/* mock data */];
    render(
      <ProductList 
        data={mockProducts}
        loading={false}
        pagination={mockPagination}
      />
    );
  });
});

// ✅ Después - __tests__/ProductListView.test.tsx
import { ProductListView } from '../ProductListView';

describe('ProductListView', () => {
  it('renders products correctly', async () => {
    // Mock del service
    jest.spyOn(ProductService, 'getProducts').mockResolvedValue({
      items: mockProducts,
      total: 2,
      page: 1,
      pages: 1,
      per_page: 25,
    });

    render(<ProductListView />);
    
    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
    });
  });
});
```

### Paso 4: Migración de ThirdPartyList

Sigue el mismo proceso para los terceros:

#### 4.1. Análisis de diferencias específicas

```typescript
// Diferencias específicas de ThirdPartyList:
// - Diferentes campos de datos
// - Diferentes tipos de filtros  
// - Diferentes acciones masivas
// - Diferentes badges de estado
```

#### 4.2. Implementación

```typescript
// ✅ src/components/atomic/templates/ThirdPartyListView.tsx
export const ThirdPartyListView: React.FC<ThirdPartyListViewProps> = (props) => {
  const columns: ListViewColumn<ThirdParty>[] = [
    {
      key: 'name',
      header: 'Nombre / Razón Social',
      render: (thirdParty) => (
        <div>
          <div className="text-sm font-medium">{thirdParty.name}</div>
          {thirdParty.commercial_name && (
            <div className="text-sm text-secondary-500">
              {thirdParty.commercial_name}
            </div>
          )}
        </div>
      ),
    },
    // ... más columnas específicas de terceros
  ];

  // ... resto de la implementación
};
```

### Paso 5: Verificación Post-Migración

#### 5.1. Checklist de Funcionalidades

- [ ] **Datos se cargan correctamente**
  - [ ] Lista se pobla con datos del backend
  - [ ] Paginación funciona correctamente
  - [ ] Estados de carga se muestran

- [ ] **Filtros funcionan**
  - [ ] Filtros de texto buscan correctamente
  - [ ] Filtros de select aplican correctamente
  - [ ] Combinación de filtros funciona
  - [ ] Reset de filtros limpia todo

- [ ] **Acciones funcionan**
  - [ ] Botones de acción ejecutan funciones correctas
  - [ ] Selección múltiple funciona
  - [ ] Acciones masivas se ejecutan
  - [ ] Confirmaciones aparecen cuando corresponde

- [ ] **Navegación funciona**
  - [ ] Click en filas navega correctamente
  - [ ] Breadcrumbs son correctos
  - [ ] URLs se mantienen

- [ ] **Responsive Design**
  - [ ] Se ve bien en desktop
  - [ ] Se adapta a tablet
  - [ ] Funciona en móvil

#### 5.2. Tests de Regresión

```bash
# Ejecutar tests de la feature migrada
npm test src/components/atomic/templates/ProductListView.test.tsx

# Ejecutar tests de integración
npm test src/pages/ProductsPage.test.tsx

# Ejecutar tests de accesibilidad
npm run test:a11y
```

#### 5.3. Validación de Performance

```typescript
// Usar React DevTools Profiler para comparar:
// - Tiempo de renderizado inicial
// - Tiempo de re-renderizado en cambios
// - Número de re-renders innecesarios
// - Uso de memoria

// Herramientas recomendadas:
// - React DevTools Profiler
// - Chrome DevTools Performance
// - Lighthouse para accesibilidad
```

### Paso 6: Limpieza del Código Legacy

#### 6.1. Eliminar componentes obsoletos

```bash
# Después de verificar que todo funciona:
rm src/features/products/components/ProductList.tsx
rm src/features/third-parties/components/ThirdPartyList.tsx

# Actualizar archivos de índice
# Eliminar exports obsoletos
```

#### 6.2. Actualizar documentación

```typescript
// Actualizar README.md de cada feature
// Actualizar comentarios en código
// Actualizar Storybook stories si existen
```

## Migración de Otras Features

### Plantilla para Nuevas Migraciones

Para migrar otras features (cuentas, términos de pago, etc.):

```typescript
// 1. Crear el template específico
// src/components/atomic/templates/AccountListView.tsx
export const AccountListView: React.FC<AccountListViewProps> = (props) => {
  const columns: ListViewColumn<Account>[] = [
    // Definir columnas específicas de Account
  ];

  const filters: ListViewFilter[] = [
    // Definir filtros específicos de Account  
  ];

  const dataFetcher = async (params: any) => {
    const response = await AccountService.getAccounts(params);
    return transformResponse(response);
  };

  return (
    <ListView<Account>
      title="Cuentas Contables"
      columns={columns}
      filters={filters}
      dataFetcher={dataFetcher}
      {...props}
    />
  );
};

// 2. Actualizar las páginas
// 3. Migrar tests
// 4. Verificar funcionalidad
// 5. Limpiar código legacy
```

## Troubleshooting

### Problemas Comunes

#### 1. **Los datos no se cargan**

```typescript
// ✅ Verificar que dataFetcher retorne el formato correcto
const dataFetcher = async (params: any) => {
  const response = await Service.getData(params);
  
  // ⚠️ DEBE retornar este formato exacto:
  return {
    items: response.items || response.data || [],
    total: response.total || 0,
    page: response.page || 1,
    pages: response.pages || Math.ceil(total / perPage),
    perPage: response.per_page || response.perPage || 25,
  };
};
```

#### 2. **Los filtros no funcionan**

```typescript
// ✅ Verificar que las keys de filtros coincidan con la API
const filters: ListViewFilter[] = [
  {
    key: 'search', // ⚠️ Debe coincidir con lo que espera el backend
    type: 'text',
    label: 'Buscar',
  }
];
```

#### 3. **Las acciones no se ejecutan**

```typescript
// ✅ Verificar que las funciones onClick sean correctas
const actions: ListViewAction<T>[] = [
  {
    key: 'create',
    label: 'Crear',
    onClick: (selectedItems) => {
      // ⚠️ selectedItems será un array, incluso si no hay selección
      console.log('Items seleccionados:', selectedItems);
      handleCreate(); // Tu función original
    }
  }
];
```

#### 4. **Estilos se ven mal**

```typescript
// ✅ Verificar que Tailwind CSS esté configurado correctamente
// ✅ Verificar que los tokens de diseño estén aplicados
// ✅ Revisar que no haya CSS conflictivo
```

### Herramientas de Debugging

```typescript
// 1. Console logs en dataFetcher
const dataFetcher = async (params: any) => {
  console.log('🔍 Parámetros recibidos:', params);
  const response = await Service.getData(params);
  console.log('📦 Respuesta del servidor:', response);
  return transformedResponse;
};

// 2. React DevTools para inspeccionar props
// 3. Network tab para verificar llamadas a API
// 4. Console para verificar errores JavaScript
```

## Cronograma Sugerido

### Semana 1: Preparación
- [ ] Revisar documentación
- [ ] Configurar entorno de desarrollo  
- [ ] Ejecutar tests existentes
- [ ] Identificar componentes a migrar

### Semana 2: Migración Core
- [ ] Migrar ProductList
- [ ] Migrar ThirdPartyList
- [ ] Tests básicos
- [ ] Verificación funcional

### Semana 3: Migración Adicional
- [ ] Migrar otras features (cuentas, etc.)
- [ ] Tests completos
- [ ] Refinamiento UI/UX

### Semana 4: Finalización
- [ ] Limpieza código legacy
- [ ] Documentación actualizada
- [ ] Code review
- [ ] Deploy a producción

## Contacto y Soporte

Si tienes dudas durante la migración:

1. **Revisa la documentación**: `src/components/atomic/README.md`
2. **Consulta los ejemplos**: Templates existentes
3. **Ejecuta los tests**: Para verificar que todo funciona
4. **Usa herramientas de debugging**: React DevTools, Console

¡El nuevo sistema ListView mejorará significativamente la experiencia de usuario y la eficiencia de desarrollo!
