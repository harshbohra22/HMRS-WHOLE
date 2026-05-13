import axios from 'axios';
import type { ChatMessageDto } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const chatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const chatService = {
  /**
   * Load full conversation history for a chat room.
   * GET /api/chat/{applicationId}/history
   */
  getHistory: async (applicationId: number): Promise<ChatMessageDto[]> => {
    const response = await chatApi.get<{ data: ChatMessageDto[]; message: string }>(
      `/chat/${applicationId}/history`
    );
    return response.data.data ?? [];
  },
};
