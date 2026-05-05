import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatService } from '../services/chatService';
import type { ChatMessageDto, SendMessageRequest } from '../types/chat';

interface UseChatOptions {
  applicationId: number;
  senderType: 'EMPLOYER' | 'JOBSEEKER';
  senderId: number;
  senderName: string;
}

interface UseChatReturn {
  messages: ChatMessageDto[];
  sendMessage: (content: string) => void;
  connected: boolean;
  loading: boolean;
}

export function useChat({
  applicationId,
  senderType,
  senderId,
  senderName,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const clientRef = useRef<Client | null>(null);

  // Load history from REST on mount
  useEffect(() => {
    setLoading(true);
    chatService
      .getHistory(applicationId)
      .then((history) => setMessages(history))
      .catch((err) => console.error('Failed to load chat history', err))
      .finally(() => setLoading(false));
  }, [applicationId]);

  // Set up STOMP / WebSocket connection
  useEffect(() => {
    const wsUrl = `${window.location.protocol}//${window.location.host}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        // Subscribe to this application's chat room topic
        client.subscribe(`/topic/chat/${applicationId}`, (frame) => {
          try {
            const incoming: ChatMessageDto = JSON.parse(frame.body);
            if (incoming.senderType !== senderType) {
              setIsTyping(false);
            }
            setMessages((prev) => [...prev, incoming]);
          } catch (e) {
            console.error('Failed to parse incoming chat message', e);
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [applicationId]);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !clientRef.current?.connected) return;

      const payload: SendMessageRequest = {
        applicationId,
        senderType,
        senderId,
        senderName,
        content: trimmed,
      };

      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payload),
      });

      if (senderType === 'JOBSEEKER') {
        setIsTyping(true);
      }
    },
    [applicationId, senderType, senderId, senderName]
  );

  return { messages, sendMessage, connected, loading, isTyping };
}
