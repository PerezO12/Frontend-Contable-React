import React, { useState, useRef, useEffect } from 'react';
import { chatAPIService } from '../services/chatAPI';
import type { ChatMessage, ChatRequest } from '../services/chatAPI';
import { useChatSettings } from '../hooks/useChatSettings';
import ChatStatus from '../components/ui/ChatStatus';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  ExclamationCircleIcon 
} from '../shared/components/icons';

interface ExtendedChatMessage extends ChatMessage {
  id: string;
  timestamp: Date;
  service_used?: string;
  tokens_used?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const ChatPage: React.FC = () => {
  const { settings } = useChatSettings();
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mensaje inicial de bienvenida
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ExtendedChatMessage = {
        id: '1',
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de contabilidad con IA powered by OpenAI. Puedo ayudarte con facturas, reportes, contabilidad y análisis financiero. ¿En qué puedo ayudarte?',
        timestamp: new Date(),
        service_used: 'system'
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ExtendedChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const chatRequest: ChatRequest = {
        message: inputMessage
      };

      const response = await chatAPIService.sendMessage(chatRequest);

      if (response.success) {
        const assistantMessage: ExtendedChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          service_used: response.service_used,
          tokens_used: response.tokens_used
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(response.error || 'Error desconocido');
        
        const errorMessage: ExtendedChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.error || 'Lo siento, hubo un error procesando tu mensaje.',
          timestamp: new Date(),
          service_used: response.service_used
        };

        setMessages(prev => [...prev, errorMessage]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error enviando mensaje');
      
      const errorMessage: ExtendedChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error de conexión. Por favor intenta de nuevo.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de contabilidad con IA. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
      service_used: 'system'
    }]);
    setError(null);
  };

  const testExamples = [
    "¿Cómo creo una factura?",
    "Explícame qué es la partida doble",
    "¿Cómo puedo generar un reporte de balance?",
    "Ayúdame con el registro de gastos"
  ];

  if (!settings.isEnabled) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationCircleIcon className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Chat IA Deshabilitado</h3>
              <p className="text-yellow-700">El servicio de chat está deshabilitado en la configuración.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat con IA</h1>
              <p className="text-gray-600">Asistente inteligente para contabilidad</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar Chat
          </button>
        </div>

        {/* Estado del sistema */}
        <ChatStatus className="mb-4" />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="mb-1">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs opacity-70">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  
                  {message.role === 'assistant' && message.service_used && message.service_used !== 'system' && (
                    <div className="flex items-center space-x-2 ml-2">
                      <span className={`px-2 py-1 rounded ${
                        message.service_used === 'openai' 
                          ? 'bg-green-100 text-green-700' 
                          : message.service_used === 'fallback'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {message.service_used === 'openai' ? '🤖 OpenAI' : 
                         message.service_used === 'fallback' ? '🔄 Fallback' : '❌ Error'}
                      </span>
                      {message.tokens_used && (
                        <span className="text-gray-500">
                          🔢 {message.tokens_used.total_tokens}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Pensando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          {/* Ejemplos de preguntas */}
          {messages.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Ejemplos de preguntas:</p>
              <div className="flex flex-wrap gap-2">
                {testExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(example)}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
