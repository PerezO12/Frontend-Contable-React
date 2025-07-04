import React, { useState, useRef, useEffect } from 'react';
import { chatAPIService } from '../../services/chatAPI';
import type { ChatMessage, ChatRequest } from '../../services/chatAPI';
import { useChatSettings } from '../../hooks/useChatSettings';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  XMarkIcon,
  ChevronDownIcon 
} from '../../shared/components/icons';

interface ExtendedChatMessage extends ChatMessage {
  id: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  initialContext?: 'general' | 'invoicing' | 'accounting' | 'reports';
  preferredLanguage?: 'es' | 'en' | 'pt' | null;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  isOpen, 
  onToggle, 
  initialContext = 'general',
  preferredLanguage = null 
}) => {
  const { settings } = useChatSettings();
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar chat cuando se abre
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ExtendedChatMessage = {
        id: '1',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const getWelcomeMessage = () => {
    const messages = {
      'es': '¡Hola! Soy tu asistente de contabilidad. ¿En qué puedo ayudarte?',
      'en': 'Hello! I\'m your accounting assistant. How can I help you?',
      'pt': 'Olá! Sou seu assistente de contabilidade. Como posso ajudar?',
      'auto': '¡Hola! Soy tu asistente de contabilidad. ¿En qué puedo ayudarte?'
    };
    
    const lang = preferredLanguage || 'auto';
    return messages[lang as keyof typeof messages] || messages.auto;
  };

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
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: ExtendedChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.error || 'Lo siento, hubo un error al procesar tu mensaje.',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessage]);
      }

    } catch (err) {
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
      content: getWelcomeMessage(),
      timestamp: new Date()
    }]);
  };

  if (!settings.isEnabled || !isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white shadow-xl rounded-lg border ${isMinimized ? 'w-80' : 'w-96'} ${isMinimized ? 'h-16' : 'h-[600px]'} flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span className="font-medium text-sm">Asistente IA</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-blue-600 rounded"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-blue-600 rounded"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                      <span className="text-xs text-gray-600">Escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Limpiar chat
                </button>
                <span className="text-xs text-gray-500">
                  {initialContext.charAt(0).toUpperCase() + initialContext.slice(1)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
