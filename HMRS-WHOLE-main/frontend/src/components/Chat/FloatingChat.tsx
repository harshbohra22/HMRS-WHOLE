import React from 'react';
import { X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

interface FloatingChatProps {
  applicationId: number;
  senderType: 'EMPLOYER' | 'JOBSEEKER';
  senderId: number;
  senderName: string;
  jobTitle: string;
  companyName: string;
  onClose: () => void;
}

/**
 * A floating wrapper for the ChatWindow component.
 * Positions the chat in the bottom-right corner of the screen.
 */
export const FloatingChat: React.FC<FloatingChatProps> = (props) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[400px] h-[600px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Close button overlay (since ChatWindow has its own header) */}
      <div className="absolute top-4 right-4 z-[110]">
        <button
          onClick={props.onClose}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm border border-white/10"
          title="Close Chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <ChatWindow 
        applicationId={props.applicationId}
        senderType={props.senderType}
        senderId={props.senderId}
        senderName={props.senderName}
        jobTitle={props.jobTitle}
        companyName={props.companyName}
      />
    </div>
  );
};
