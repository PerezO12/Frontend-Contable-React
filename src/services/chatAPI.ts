/**
 * Servicio para interactuar con la API de chat IA con OpenAI
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  model?: string;
  tokens_used?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
  service_used: 'openai' | 'fallback' | 'error';
}

export interface ChatHealthResponse {
  openai_available: boolean;
  fallback_available: boolean;
  current_model: string;
  api_key_configured: boolean;
}

export interface ChatTestResponse {
  test_results: Array<{
    input: string;
    output: string;
    service_used: string;
    success: boolean;
  }>;
  system_health: ChatHealthResponse;
}

class ChatAPIService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  /**
   * Envía un mensaje al chat IA
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || `Error HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Verifica el estado del servicio de chat
   */
  async checkHealth(): Promise<ChatHealthResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/ai/chat/health`);

    if (!response.ok) {
      throw new Error(`Error checking chat health: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Prueba el sistema de chat con mensajes de ejemplo
   */
  async testChat(): Promise<ChatTestResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/ai/chat/test`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Error testing chat system: ${response.status}`);
    }

    return response.json();
  }
}

// Instancia singleton
export const chatAPIService = new ChatAPIService();
