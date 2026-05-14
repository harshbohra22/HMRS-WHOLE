export interface ChatMessageDto {
  id: number;
  applicationId: number;
  senderType: 'EMPLOYER' | 'JOBSEEKER' | 'BOT' | 'SYSTEM';
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
}

export interface SendMessageRequest {
  applicationId: number;
  senderType: 'EMPLOYER' | 'JOBSEEKER';
  senderId: number;
  senderName: string;
  content: string;
}
