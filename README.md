# Sistema Contable Frontend - Autenticación

## 📋 Descripción

Frontend del Sistema Contable Empresarial desarrollado con React + TypeScript, enfocado en el sistema de autenticación y seguridad. Consume APIs de FastAPI con autenticación JWT.

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **DOMPurify** - Sanitización de datos

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   # Crear .env.development
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_APP_NAME=Sistema Contable
   VITE_APP_ENV=development
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en navegador**
   ```
   http://localhost:5173
   ```

## 🔐 Sistema de Autenticación

### Características Implementadas

- ✅ Login con email y contraseña
- ✅ Gestión de tokens JWT (access/refresh)
- ✅ Renovación automática de tokens
- ✅ Sistema de roles (ADMIN, CONTADOR, SOLO_LECTURA)
- ✅ Protección de rutas basada en roles
- ✅ Manejo de sesiones
- ✅ Logout seguro
- ✅ Validación de formularios
- ✅ Sanitización de datos
- ✅ Manejo de errores

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

## 🚦 Estado del Proyecto

### Completado ✅

- Sistema de autenticación completo
- Componentes UI básicos
- Protección de rutas
- Gestión de tokens
- Validación de formularios
- Manejo de errores

### Próximas Fases 🚧

1. **Módulo de Cuentas Contables**
2. **Sistema de Reportes**
3. **Gestión de Usuarios (Admin)**
4. **Dashboard con gráficos**
5. **Notificaciones en tiempo real**

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
