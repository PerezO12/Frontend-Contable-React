import { useState, useCallback, useRef, useEffect } from 'react';
import { chatAPIService } from '../services/chatAPI';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  model?: string;
}

export const useAIChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isOpen: false,
    error: null,
  });

  const messageIdCounter = useRef(0);

  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}`;
  };

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage;
  }, []);

  const toggleChat = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      error: null,
    }));
  }, []);

  const closeChat = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      error: null,
    }));
  }, []);

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim()) return;

    // Añadir mensaje del usuario
    addMessage({
      role: 'user',
      content: messageContent.trim(),
    });

    setChatState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Usar el servicio dedicado
      const chatResponse = await chatAPIService.sendMessage({
        message: messageContent.trim()
      });

      // Añadir respuesta del asistente
      addMessage({
        role: 'assistant',
        content: chatResponse.message || 'Respuesta recibida',
      });

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al enviar mensaje';

      setChatState(prev => ({
        ...prev,
        error: errorMessage,
      }));

      // Añadir mensaje de error como respuesta del asistente
      addMessage({
        role: 'assistant',
        content: `❌ Lo siento, ocurrió un error: ${errorMessage}`,
      });
    } finally {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [chatState.messages, addMessage]);

  // Inicializar con mensaje de bienvenida
  useEffect(() => {
    if (chatState.messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de contabilidad. Puedo ayudarte con consultas generales y crear facturas. ¿En qué puedo ayudarte?',
      });
    }
  }, [chatState.messages.length, addMessage]);

  return {
    ...chatState,
    sendMessage,
    toggleChat,
    closeChat,
    clearMessages,
  };
};
