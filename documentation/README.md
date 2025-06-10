# Documentación del Sistema Contable

Este directorio contiene toda la documentación técnica del sistema contable, organizada por módulos y funcionalidades.

## Estructura de la Documentación

### Sistema de Usuario y Autenticación
- [Autenticación y Seguridad](./auth/authentication.md) - Sistema completo de autenticación
- [Gestión de Usuarios](./auth/user-management.md) - CRUD y administración de usuarios
- [Roles y Permisos](./auth/roles-permissions.md) - Sistema de roles y control de acceso
- [Sesiones y Tokens](./auth/sessions-tokens.md) - Gestión de sesiones JWT
- [Endpoints de Autenticación](./auth/auth-endpoints.md) - API de autenticación
- [Endpoints de Usuarios](./auth/user-endpoints.md) - API de gestión de usuarios

### Otros Módulos (Para futuras expansiones)
- [Cuentas Contables](./accounts/) - Gestión del plan de cuentas
- [Asientos Contables](./journal-entries/) - Sistema de asientos contables
- [Reportes](./reports/) - Sistema de reportes financieros
- [Auditoría](./audit/) - Sistema de auditoría y logs

## Convenciones de Documentación

### Formato
- Todos los archivos están en formato Markdown (.md)
- Uso de títulos jerárquicos (H1, H2, H3...)
- Ejemplos de código con sintaxis destacada
- Enlaces entre documentos relacionados

### Estructura de Cada Documento
1. **Descripción General** - Qué hace el módulo
2. **Características Principales** - Funcionalidades clave
3. **Arquitectura** - Cómo está organizado el código
4. **Schemas/Modelos** - Estructuras de datos
5. **Servicios** - Lógica de negocio
6. **Endpoints** - APIs disponibles
7. **Ejemplos de Uso** - Casos prácticos
8. **Configuración** - Parámetros y settings
9. **Seguridad** - Consideraciones de seguridad
10. **Troubleshooting** - Problemas comunes

## Tecnologías Documentadas

- **FastAPI** - Framework web principal
- **SQLAlchemy 2.0** - ORM y gestión de base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Tokens de autenticación
- **bcrypt** - Hashing de contraseñas
- **Pydantic** - Validación y serialización
- **Alembic** - Migraciones de base de datos

## Cómo Contribuir

1. Mantener la estructura establecida
2. Incluir ejemplos prácticos
3. Documentar cambios en la API
4. Actualizar diagramas cuando sea necesario
5. Revisar enlaces y referencias cruzadas

## Últimas Actualizaciones

- **Junio 2025** - Documentación inicial del sistema de autenticación
- Sistema de usuarios y roles completamente funcional
- Endpoints de autenticación documentados
- Ejemplos de integración incluidos
