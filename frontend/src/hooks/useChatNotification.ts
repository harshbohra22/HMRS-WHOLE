import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessageDto } from '../../types/chat';

interface UseChatNotificationOptions {
  applicationIds: number[];       // all app IDs to watch
  senderType: 'EMPLOYER' | 'JOBSEEKER'; // the current user's type
  senderId: number;
  onNewMessage?: (appId: number, message: ChatMessageDto) => void;
}

/**
 * Silently subscribes to all provided application chat rooms.
 * Fires onNewMessage when a message arrives that was NOT sent by the current user.
 * Returns an unread count per applicationId.
 */
export function useChatNotification({
  applicationIds,
  senderType,
  senderId,
  onNewMessage,
}: UseChatNotificationOptions) {
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!applicationIds.length || !senderId) return;

    const wsUrl = `${window.location.protocol}//${window.location.host}/ws`;
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to ALL application chat rooms silently
        applicationIds.forEach((appId) => {
          client.subscribe(`/topic/chat/${appId}`, (frame) => {
            try {
              const incoming: ChatMessageDto = JSON.parse(frame.body);
              // Only count messages from OTHER people (not self, not BOT in job seeker view)
              const isFromOther =
                incoming.senderType !== senderType || incoming.senderId !== senderId;
              const isFromRecruiter =
                incoming.senderType === 'EMPLOYER' || incoming.senderType === 'BOT';

              if (senderType === 'JOBSEEKER' && isFromRecruiter) {
                setUnreadCounts((prev) => ({
                  ...prev,
                  [appId]: (prev[appId] || 0) + 1,
                }));
                onNewMessage?.(appId, incoming);
              } else if (senderType === 'EMPLOYER' && isFromOther) {
                setUnreadCounts((prev) => ({
                  ...prev,
                  [appId]: (prev[appId] || 0) + 1,
                }));
                onNewMessage?.(appId, incoming);
              }
            } catch (e) {
              // ignore parse errors
            }
          });
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [applicationIds.join(','), senderId]);

  const clearUnread = (appId: number) => {
    setUnreadCounts((prev) => ({ ...prev, [appId]: 0 }));
  };

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return { unreadCounts, clearUnread, totalUnread };
}
