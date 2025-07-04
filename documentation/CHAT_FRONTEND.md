# Chat IA - Frontend

Este documento describe la implementación del chat flotante con IA en el frontend de la aplicación contable.

## 🎯 Características Implementadas

### ✅ Componentes Principales

1. **FloatingChat** (`src/components/ui/FloatingChat.tsx`)
   - Chat flotante posicionado en la esquina inferior derecha
   - Interfaz conversacional con burbujas de mensaje
   - Indicadores de carga y estado
   - Botones para limpiar conversación y cerrar chat

2. **useAIChat** (`src/hooks/useAIChat.ts`)
   - Hook personalizado para manejar el estado del chat
   - Gestión de mensajes, historial y comunicación con API
   - Manejo de errores y estados de carga

3. **useChatSettings** (`src/hooks/useChatSettings.ts`)
   - Hook para verificar permisos y estado del servicio
   - Verificación de salud del backend IA
   - Configuración de permisos por usuario/rol

4. **ChatAPIService** (`src/services/chatAPI.ts`)
   - Servicio dedicado para comunicación con la API de chat
   - Métodos para enviar mensajes, verificar salud y probar traducción
   - Manejo centralizado de errores

5. **ChatAdminPage** (`src/pages/ChatAdminPage.tsx`)
   - Página de administración para configurar el chat
   - Monitoreo del estado del servicio
   - Herramientas de prueba y diagnóstico

## 🚀 Integración

### En el Layout Principal

El chat se integra automáticamente en `MainLayout.tsx`:

```tsx
import FloatingChat from '../ui/FloatingChat';

// Dentro del component
<FloatingChat />
```

### Configuración de API

En `.env.development`:
```bash
VITE_API_URL=http://localhost:8000
```

## 🎨 UI/UX

### Diseño Responsive
- **Móvil**: Chat ocupa 90% del ancho de pantalla
- **Desktop**: Ancho fijo de 384px (w-96)
- **Altura**: 500px fija con scroll interno

### Estados Visuales
- **Cerrado**: Botón flotante circular con icono de chat
- **Abierto**: Panel completo con header, mensajes e input
- **Cargando**: Animación de puntos en el header
- **Error**: Mensaje de error en color rojo

### Iconografía
- **Chat**: `ChatBubbleLeftRightIcon`
- **Enviar**: `PaperAirplaneIcon`
- **Cerrar**: `XMarkIcon`
- **Limpiar**: `TrashIcon`

## 📱 Funcionalidades

### Detección Automática
- **Idiomas**: Español, Portugués, Inglés
- **Respuestas**: Traducidas al idioma original
- **Contexto**: Mantiene historial de conversación

### Function Calling
- **Crear Facturas**: Detecta intención y extrae parámetros
- **Validación**: Verifica datos antes de crear en BD
- **Confirmación**: Respuesta con ID de factura creada

### Gestión de Conversaciones
- **Historial**: Últimos 5 mensajes para contexto
- **Limpieza**: Botón para reiniciar conversación
- **Persistencia**: Mensajes mantenidos durante la sesión

## 🔧 Configuración Avanzada

### Permisos por Usuario
```typescript
interface ChatPermissions {
  canUseChat: boolean;
  canCreateInvoices: boolean;
  canAccessAI: boolean;
}
```

### Verificación de Salud
```typescript
// Automática al cargar
const { settings, isLoading, error } = useChatSettings();

// Manual
await chatAPIService.checkHealth();
```

### Pruebas de Funcionalidad
```typescript
// Probar traducción
await chatAPIService.testTranslation("Hola mundo");

// Probar chat completo
await chatAPIService.sendMessage({
  user_message: "Crear factura cliente 123",
  history: []
});
```

## 🛠️ Desarrollo

### Estructura de Archivos
```
src/
├── components/ui/
│   └── FloatingChat.tsx
├── hooks/
│   ├── useAIChat.ts
│   └── useChatSettings.ts
├── services/
│   └── chatAPI.ts
├── pages/
│   └── ChatAdminPage.tsx
└── shared/components/
    └── icons.tsx (iconos añadidos)
```

### Añadir Nuevas Funciones IA

1. **Backend**: Añadir función en `chat_utils.py`
2. **Frontend**: Actualizar tipos en `chatAPI.ts`
3. **UI**: Manejar respuesta en `FloatingChat.tsx`

### Ejemplo de Nueva Función
```typescript
// En chatAPI.ts
export interface SearchCustomerFunction {
  name: "search_customer";
  arguments: { query: string };
}

// En useAIChat.ts
if (function_call.name === "search_customer") {
  // Manejar búsqueda de cliente
}
```

## 🎯 Casos de Uso

### Usuario Final
1. **Consulta General**: "¿Cómo crear un asiento contable?"
2. **Crear Factura**: "Quiero facturar al cliente 123, producto 456, cantidad 2"
3. **Ayuda Contextual**: "¿Qué significa este error en mi factura?"

### Administrador
1. **Verificar Estado**: Acceder a `/chat-admin`
2. **Habilitar/Deshabilitar**: Toggle del servicio
3. **Probar Funcionalidad**: Test de traducción y chat

## 🚨 Troubleshooting

### Chat No Aparece
- Verificar `VITE_API_URL` en `.env`
- Confirmar que backend esté corriendo
- Revisar consola del navegador para errores

### Errores de Traducción
- Verificar estado en página de admin
- Confirmar modelos cargados en backend
- Probar endpoint de traducción

### Problemas de Permisos
- Verificar configuración de usuario/rol
- Revisar `useChatSettings` hook
- Confirmar API de autenticación

## 🔮 Mejoras Futuras

- [ ] **Modo Oscuro**: Tema dark para el chat
- [ ] **Shortcuts**: Atajos de teclado (Ctrl+K para abrir)
- [ ] **Histórico Persistente**: Guardar conversaciones en localStorage
- [ ] **Notificaciones**: Alertas cuando hay respuesta
- [ ] **Attachments**: Subir archivos al chat
- [ ] **Voice Input**: Reconocimiento de voz
- [ ] **Chat Rooms**: Múltiples conversaciones
- [ ] **Colaborativo**: Chat entre usuarios

## 📊 Métricas

Para implementar analytics del chat:

```typescript
// En useAIChat.ts
const trackChatEvent = (event: string, data?: any) => {
  // Google Analytics, Mixpanel, etc.
  analytics.track(`chat_${event}`, data);
};

// Ejemplos de eventos
trackChatEvent('message_sent', { message_length: message.length });
trackChatEvent('function_called', { function_name: 'create_invoice' });
trackChatEvent('error_occurred', { error_type: error.type });
```

¡El chat IA está listo para usar! 🎉
