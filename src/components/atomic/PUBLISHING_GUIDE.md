# Instrucciones de Publicación y Versionado

## Resumen del Sistema ListView

El sistema ListView es un conjunto de componentes genéricos basado en **Atomic Design** que unifica la experiencia de usuario en todos los listados de datos. Proporciona:

- ✅ **UX/UI consistente** con tokens de diseño unificados
- ✅ **Accesibilidad WCAG 2.1 AA** completa
- ✅ **TypeScript completo** con tipos seguros
- ✅ **Performance optimizada** con best practices
- ✅ **Componentes reutilizables** siguiendo Atomic Design

## Estructura del Sistema

```
src/components/atomic/
├── atoms/                     # Componentes básicos
│   ├── Button.tsx            # Botón con variantes
│   ├── Input.tsx             # Input con validación
│   ├── Icon.tsx              # Contenedor de iconos
│   ├── Typography.tsx        # Tipografía semántica
│   └── index.ts
├── molecules/                 # Combinaciones de átomos
│   ├── FilterGroup.tsx       # Grupo de filtros
│   ├── Pagination.tsx        # Paginación
│   ├── ActionBar.tsx         # Barra de acciones
│   ├── Breadcrumbs.tsx       # Navegación
│   └── index.ts
├── organisms/                 # Componentes complejos
│   ├── ListView.tsx          # Componente principal
│   └── index.ts
├── templates/                 # Implementaciones específicas
│   ├── ProductListView.tsx   # Lista de productos
│   ├── ThirdPartyListView.tsx # Lista de terceros
│   └── index.ts
├── examples/                  # Ejemplos de uso
│   ├── ProductsPageExample.tsx
│   ├── ThirdPartiesPageExample.tsx
│   └── index.ts
├── types.ts                   # Definiciones TypeScript
├── theme.ts                   # Tokens de diseño
├── README.md                  # Documentación principal
├── MIGRATION_GUIDE.md         # Guía de migración
├── ACCESSIBILITY_CHECKLIST.md # Checklist accesibilidad
└── index.ts                   # Exportaciones principales
```

## Versionado SemVer

### Versión Inicial: 1.0.0

**Major (1)**: Primera versión estable del sistema
**Minor (0)**: Funcionalidades base implementadas
**Patch (0)**: Versión inicial sin patches

### Reglas de Versionado

#### Major (X.0.0) - Breaking Changes
- Cambios en la API que rompen compatibilidad
- Restructura de props principales
- Cambios en tipos TypeScript que requieren actualización de código

```typescript
// Ejemplo de breaking change (v2.0.0)
// v1.x.x
interface ListViewProps {
  dataFetcher: (params: any) => Promise<Response>;
}

// v2.x.x  
interface ListViewProps {
  dataSource: DataSource; // Cambio de API
}
```

#### Minor (x.Y.0) - New Features
- Nuevas funcionalidades sin romper compatibilidad
- Nuevos props opcionales
- Mejoras de performance
- Nuevos componentes

```typescript
// Ejemplo de feature nueva (v1.1.0)
interface ListViewProps {
  // Props existentes...
  virtualScrolling?: boolean; // Nueva feature opcional
  rowHeight?: number;
}
```

#### Patch (x.y.Z) - Bug Fixes
- Corrección de bugs
- Mejoras menores de accesibilidad
- Actualizaciones de documentación
- Optimizaciones menores

### Changelog Automático

Usar [Conventional Commits](https://www.conventionalcommits.org/) para generar changelogs automáticamente:

```bash
# Features
git commit -m "feat: add virtual scrolling support"

# Bug fixes  
git commit -m "fix: resolve pagination issue with empty data"

# Breaking changes
git commit -m "feat!: restructure ListView API for better performance"

# Documentation
git commit -m "docs: update migration guide with new examples"
```

## Publicación en NPM Interno

### Configuración del package.json

```json
{
  "name": "@company/atomic-listview",
  "version": "1.0.0",
  "description": "Sistema de componentes ListView basado en Atomic Design",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist/",
    "README.md",
    "MIGRATION_GUIDE.md",
    "ACCESSIBILITY_CHECKLIST.md"
  ],
  "scripts": {
    "build": "tsc && vite build",
    "prepublishOnly": "npm run build",
    "test": "jest",
    "test:a11y": "jest --testMatch='**/*.a11y.test.tsx'",
    "lint": "eslint src/",
    "version": "auto-changelog -p && git add CHANGELOG.md"
  },
  "keywords": [
    "react",
    "typescript", 
    "atomic-design",
    "listview",
    "accessibility",
    "wcag",
    "ui-components"
  ],
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "jest-axe": "^8.0.0",
    "auto-changelog": "^2.4.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/company/atomic-listview.git"
  },
  "publishConfig": {
    "registry": "https://npm.company.com"
  }
}
```

### Proceso de Build

```bash
# 1. Build de TypeScript
tsc --project tsconfig.build.json

# 2. Build de componentes  
vite build --mode production

# 3. Generar tipos
tsc --emitDeclarationOnly --declaration --declarationDir dist/types

# 4. Copiar assets estáticos
cp README.md dist/
cp MIGRATION_GUIDE.md dist/
cp ACCESSIBILITY_CHECKLIST.md dist/
```

### Configuración de TypeScript para Build

```json
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "emitDeclarationOnly": false
  },
  "include": [
    "src/components/atomic/**/*"
  ],
  "exclude": [
    "**/*.test.tsx",
    "**/*.stories.tsx",
    "**/examples/**/*"
  ]
}
```

## Pipeline CI/CD

### GitHub Actions / Azure DevOps

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Test
        run: npm run test
        
      - name: Accessibility Tests
        run: npm run test:a11y
        
      - name: Build
        run: npm run build

  release:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          registry-url: 'https://npm.company.com'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Release
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          npm run semantic-release
```

### Scripts de Release

```bash
#!/bin/bash
# scripts/release.sh

set -e

echo "🚀 Iniciando proceso de release..."

# 1. Verificar que estamos en main
if [ "$(git branch --show-current)" != "main" ]; then
  echo "❌ Error: Debe estar en la rama main para hacer release"
  exit 1
fi

# 2. Verificar que no hay cambios sin commit
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: Hay cambios sin commit"
  exit 1
fi

# 3. Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# 4. Ejecutar tests
echo "🧪 Ejecutando tests..."
npm run test
npm run test:a11y

# 5. Lint
echo "🔍 Ejecutando lint..."
npm run lint

# 6. Build
echo "🔨 Construyendo..."
npm run build

# 7. Verificar que el build es válido
echo "✅ Verificando build..."
node -e "require('./dist/index.js')"

# 8. Preguntar por el tipo de release
echo "❓ ¿Qué tipo de release es?"
echo "1) patch (bug fixes)"
echo "2) minor (new features)"  
echo "3) major (breaking changes)"
read -p "Selecciona (1-3): " release_type

case $release_type in
  1) npm version patch ;;
  2) npm version minor ;;
  3) npm version major ;;
  *) echo "❌ Opción inválida"; exit 1 ;;
esac

# 9. Push tags
echo "📤 Enviando tags..."
git push --follow-tags

# 10. Publicar en NPM
echo "🚀 Publicando en NPM..."
npm publish

echo "✅ Release completado!"
echo "📋 No olvides:"
echo "   - Actualizar la documentación si es necesario"
echo "   - Comunicar los cambios al equipo"
echo "   - Actualizar proyectos que usen el componente"
```

## Distribución y Uso

### Instalación

```bash
# NPM interno
npm install @company/atomic-listview

# Yarn
yarn add @company/atomic-listview
```

### Uso Básico

```typescript
// En tu proyecto
import { ListView, ProductListView } from '@company/atomic-listview';

// CSS requerido (si no usas Tailwind)
import '@company/atomic-listview/dist/styles.css';

function App() {
  return (
    <ProductListView
      onProductSelect={(product) => navigate(`/products/${product.id}`)}
      onCreateProduct={() => navigate('/products/new')}
    />
  );
}
```

### Configuración de Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@company/atomic-listview/**/*.{js,ts,jsx,tsx}',
  ],
  // ... resto de la configuración
};
```

## Mantenimiento y Evolución

### Roadmap de Versiones

#### v1.1.0 - Mejoras UX
- [ ] Drag & drop para reordenar
- [ ] Columnas redimensionables
- [ ] Vistas de card y lista
- [ ] Filtros guardados

#### v1.2.0 - Performance
- [ ] Virtualización para listas grandes
- [ ] Cache inteligente
- [ ] Lazy loading de imágenes
- [ ] Optimización de renders

#### v2.0.0 - Arquitectura
- [ ] Soporte para GraphQL
- [ ] Real-time updates con WebSockets
- [ ] Plugin system
- [ ] Temas dinámicos

### Métricas de Adopción

```typescript
// Tracking de uso (opcional)
const trackUsage = () => {
  if (process.env.NODE_ENV === 'production') {
    analytics.track('ListView.Rendered', {
      component: 'ProductListView',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  }
};
```

### Feedback y Mejoras

1. **Issues en GitHub**: Para bugs y feature requests
2. **Slack channel**: #atomic-listview para discusiones
3. **Monthly review**: Revisar métricas y feedback
4. **Quarterly planning**: Roadmap y prioridades

## Checklist de Release

### Pre-Release
- [ ] Tests pasan (unit + integration + a11y)
- [ ] Lint sin errores
- [ ] Build exitoso
- [ ] Documentación actualizada
- [ ] Migration guide revisado
- [ ] Changelog generado

### Release
- [ ] Version bump con semantic versioning
- [ ] Git tags creados
- [ ] NPM package publicado
- [ ] GitHub release creado
- [ ] Documentación desplegada

### Post-Release
- [ ] Comunicación al equipo
- [ ] Actualización de proyectos dependientes
- [ ] Monitoreo de errores
- [ ] Recolección de feedback

---

**¡El sistema ListView está listo para transformar la experiencia de usuario de todas nuestras listas de datos!** 🚀
