import React, { useState } from 'react';
import ChatWidget from '../components/ui/ChatWidget';
import { ChatBubbleLeftRightIcon } from '../shared/components/icons';

const DashboardPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Dashboard Principal
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Facturas</h3>
            <p className="text-blue-700 text-sm">Gestiona tus facturas de forma rápida</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900 mb-2">Contabilidad</h3>
            <p className="text-green-700 text-sm">Revisa tus registros contables</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900 mb-2">Reportes</h3>
            <p className="text-purple-700 text-sm">Genera reportes financieros</p>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Asistente IA</h2>
          <p className="text-gray-600 mb-4">
            ¿Necesitas ayuda? Nuestro asistente de inteligencia artificial puede ayudarte con:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4">
            <li>Crear facturas automáticamente</li>
            <li>Explicar conceptos contables</li>
            <li>Guiarte en procesos financieros</li>
            <li>Responder en español, inglés o portugués</li>
          </ul>
          
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span>Abrir Chat con IA</span>
          </button>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        initialContext="general"
        preferredLanguage={null} // Detección automática
      />

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-40"
          title="Abrir chat con IA"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default DashboardPage;
