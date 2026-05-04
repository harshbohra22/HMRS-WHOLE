import React, { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Wifi, WifiOff, MessageCircle, Loader2 } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import type { ChatMessageDto } from '../../types/chat';

interface ChatWindowProps {
  applicationId: number;
  senderType: 'EMPLOYER' | 'JOBSEEKER';
  senderId: number;
  senderName: string;
  jobTitle: string;
  companyName: string;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function groupByDate(messages: ChatMessageDto[]): { date: string; msgs: ChatMessageDto[] }[] {
  const groups: Record<string, ChatMessageDto[]> = {};
  for (const msg of messages) {
    const key = formatDate(msg.sentAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(msg);
  }
  return Object.entries(groups).map(([date, msgs]) => ({ date, msgs }));
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  applicationId,
  senderType,
  senderId,
  senderName,
  jobTitle,
  companyName,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, connected, loading } = useChat({
    applicationId,
    senderType,
    senderId,
    senderName,
  });

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isSelf = (msg: ChatMessageDto) => msg.senderType === senderType && msg.senderId === senderId;
  const grouped = groupByDate(messages);

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
      {/* ── Header ── */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{jobTitle}</p>
            <p className="text-indigo-200 text-xs">{companyName}</p>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          {connected ? (
            <span className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-400/30">
              <Wifi className="w-3 h-3" />
              Live
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-slate-700/50 backdrop-blur-sm text-slate-400 text-xs px-3 py-1.5 rounded-full border border-slate-600/30">
              <WifiOff className="w-3 h-3" />
              Connecting...
            </span>
          )}
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto bg-slate-900 px-4 py-4 space-y-1 min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-sm">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">No messages yet</p>
              <p className="text-xs text-slate-600 mt-1">Start the conversation below</p>
            </div>
          </div>
        ) : (
          grouped.map(({ date, msgs }) => (
            <div key={date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-700/50" />
                <span className="text-xs text-slate-500 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
                  {date}
                </span>
                <div className="flex-1 h-px bg-slate-700/50" />
              </div>

              {/* Messages in this date group */}
              <div className="space-y-2">
                {msgs.map((msg) => {
                  const self = isSelf(msg);
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${self ? 'items-end' : 'items-start'} animate-fade-in`}
                    >
                      {/* Sender label */}
                      <span className={`text-xs mb-1 px-1 ${self ? 'text-indigo-400' : 'text-emerald-400'}`}>
                        {self ? 'You' : msg.senderName}
                        {' '}
                        <span className="text-slate-600">·</span>
                        {' '}
                        <span className="text-slate-500">{formatTime(msg.sentAt)}</span>
                      </span>

                      {/* Bubble */}
                      <div
                        className={`relative max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-lg ${
                          self
                            ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm'
                            : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50 px-4 py-3">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              id="chat-input"
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // Auto-grow
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder={connected ? 'Type a message… (Enter to send)' : 'Connecting to chat…'}
              disabled={!connected}
              className="w-full bg-slate-700/70 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/60 border border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ minHeight: '46px', maxHeight: '120px' }}
            />
          </div>

          <button
            id="chat-send-btn"
            onClick={handleSend}
            disabled={!connected || !inputValue.trim()}
            className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mt-2 text-center">
          {senderType === 'EMPLOYER' ? '👔 Messaging as Employer' : '🧑‍💼 Messaging as Job Seeker'}
          {' · '}Application #{applicationId}
        </p>
      </div>
    </div>
  );
};
