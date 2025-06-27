# Frontend Contable - Sistema de Contabilidad (en desarrollo)

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-CC--BY--NC--ND--4.0-green.svg)
![React](https://img.shields.io/badge/react-19.1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)
![Vite](https://img.shields.io/badge/vite-6.3.5-brightgreen.svg)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-4.1.8-blueviolet.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen)

## 🌟 Descripción

Frontend moderno y robusto para el Sistema de Contabilidad, desarrollado con React 19, TypeScript y Vite. Proporciona una interfaz de usuario intuitiva y eficiente para la gestión contable empresarial.

### Características Principales

- **Interfaz Moderna**: Diseño limpio y profesional con TailwindCSS
- **Navegación Intuitiva**: Sistema de rutas organizado con React Router
- **Gestión de Estado**: Manejo eficiente con Zustand
- **Formularios Robustos**: Validación y manejo con React Hook Form y Zod
- **Exportación de Datos**: Soporte para PDF (jsPDF) y Excel (XLSX)
- **Seguridad**: Autenticación JWT y control de acceso basado en roles
- **Optimización**: Carga diferida de componentes y rutas
- **Responsive**: Diseño adaptable para todas las pantallas

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18 o superior
- npm 9 o superior
- API Contable (Backend) en ejecución

### Instalación

1. Clone el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/frontend-contable.git
   cd frontend-contable
   ```

2. Instale las dependencias:
   ```bash
   npm install
   ```

3. Configure las variables de entorno:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_APP_ENV=development
   ```

4. Inicie el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🎯 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción
- `npm run lint`: Ejecuta el linter
- `npm run preview`: Vista previa de la build de producción

## 📚 Estructura del Proyecto

```
frontend-contable/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── forms/      # Componentes de formularios
│   │   ├── layout/     # Componentes de diseño
│   │   └── ui/         # Componentes de interfaz
│   ├── features/       # Módulos principales
│   │   ├── accounts/   # Gestión de cuentas
│   │   ├── auth/       # Autenticación
│   │   ├── invoices/   # Gestión de facturas
│   │   └── reports/    # Reportes financieros
│   ├── shared/         # Utilidades compartidas
│   │   ├── api/        # Cliente HTTP
│   │   ├── hooks/      # Hooks personalizados
│   │   └── utils/      # Funciones utilitarias
│   └── stores/         # Estado global
├── public/             # Archivos estáticos
└── documentation/      # Documentación
```

## 🛣️ Rutas Principales

### Autenticación
- `/login` - Inicio de sesión

### Dashboard
- `/dashboard` - Panel principal

### Asientos Contables
- `/journal-entries` - Lista de asientos
- `/journal-entries/new` - Crear asiento
- `/journal-entries/:id` - Detalles del asiento
- `/journal-entries/:id/edit` - Editar asiento

### Cuentas
- `/accounts` - Gestión de cuentas
- `/accounts/list` - Lista de cuentas
- `/accounts/new` - Crear cuenta
- `/accounts/:id` - Detalles de cuenta
- `/accounts/:id/edit` - Editar cuenta

### Centros de Costo
- `/cost-centers` - Gestión de centros
- `/cost-centers/list` - Lista de centros
- `/cost-centers/new` - Crear centro
- `/cost-centers/:id` - Detalles del centro
- `/cost-centers/:id/edit` - Editar centro

### Facturas
- `/invoices` - Lista de facturas
- `/invoices/new` - Crear factura
- `/invoices/create-odoo` - Crear desde Odoo
- `/invoices/:id` - Detalles de factura
- `/invoices/:id/edit` - Editar factura

## 🔒 Seguridad

- Autenticación mediante JWT
- Protección de rutas por roles
- Sanitización de datos con DOMPurify
- Validación de formularios con Zod
- Manejo seguro de tokens
- Interceptores de Axios para refresh token

## 🎨 UI/UX

- Diseño responsivo con Tailwind CSS
- Temas personalizables
- Componentes accesibles
- Feedback visual inmediato
- Mensajes de error claros
- Animaciones suaves
- Modo oscuro/claro

## 📦 Dependencias Principales

- **React 19.1.0**: Framework principal
- **TypeScript 5.8.3**: Tipado estático
- **Vite 6.3.5**: Bundler y dev server
- **React Router 7.6.2**: Enrutamiento
- **Zustand 5.0.5**: Gestión de estado
- **React Hook Form 7.58.1**: Manejo de formularios
- **Zod 3.25.57**: Validación de esquemas
- **Axios 1.9.0**: Cliente HTTP
- **TailwindCSS 4.1.8**: Framework CSS
- **jsPDF 3.0.1**: Generación de PDFs
- **XLSX 0.18.5**: Manejo de Excel

## 🧪 Testing

Para ejecutar las pruebas:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

## 📋 Licencia

Este proyecto está bajo la Licencia Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC-BY-NC-ND-4.0). 

Esta licencia permite que otros descarguen y compartan el trabajo siempre que den crédito, pero no permite su uso comercial ni la creación de trabajos derivados.

### Términos principales:
- **Atribución** — Debe dar crédito adecuado y proporcionar un enlace a la licencia
- **NoComercial** — No puede utilizar el material con fines comerciales
- **NoDerivadas** — No puede distribuir el material modificado
- **Sin restricciones adicionales** — No puede aplicar términos legales adicionales

Para más detalles, consulte el archivo [LICENSE.md](./LICENSE.md) o visite:
https://creativecommons.org/licenses/by-nc-nd/4.0/

## 📞 Soporte

Para preguntas o soporte técnico:
- Abra un issue en el repositorio
- Contacte al equipo de desarrollo

---

⭐ **Frontend Contable - Interfaz Moderna para la Gestión Contable** ⭐
