import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  XMarkIcon, 
  ChatBubbleLeftRightIcon, 
  TrashIcon 
} from '../../shared/components/icons';
import { useAIChat, type ChatMessage } from '../../hooks/useAIChat';
import { useChatSettings } from '../../hooks/useChatSettings';

interface FloatingChatProps {
  className?: string;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ className = '' }) => {
  const { settings: chatSettings } = useChatSettings();

  const {
    messages,
    isLoading,
    isOpen,
    error,
    sendMessage,
    toggleChat,
    closeChat,
    clearMessages,
  } = useAIChat();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll a los mensajes más recientes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus en input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // No mostrar el chat si no está habilitado o no es saludable
  if (!chatSettings.isEnabled || !chatSettings.isHealthy) {
    return null;
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage;
    setInputMessage('');
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    // Detectar y formatear mensajes especiales
    if (content.includes('✅')) {
      return (
        <div className="text-green-600 font-medium">
          {content}
        </div>
      );
    }

    if (content.includes('❌')) {
      return (
        <div className="text-red-600">
          {content}
        </div>
      );
    }

    // Formatear líneas
    return content.split('\n').map((line, index) => (
      <div key={index} className="mb-1 last:mb-0">
        {line}
      </div>
    ));
  };

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`
            max-w-[80%] px-4 py-2 rounded-lg text-sm
            ${isUser 
              ? 'bg-blue-500 text-white rounded-br-sm' 
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }
          `}
        >
          {formatMessageContent(message.content)}
          <div 
            className={`text-xs mt-1 opacity-70 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}
          >
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={toggleChat}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Abrir chat de IA"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <h3 className="font-semibold">Asistente IA</h3>
            {isLoading && (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearMessages}
              className="text-white hover:text-gray-200 transition-colors"
              title="Limpiar conversación"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            <button
              onClick={closeChat}
              className="text-white hover:text-gray-200 transition-colors"
              title="Cerrar chat"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 text-center">
            Presiona Enter para enviar • Shift+Enter para nueva línea
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingChat;
