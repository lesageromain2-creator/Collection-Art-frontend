// ============================================
// TYPES MESSAGES DE CONTACT
// ============================================

import { UUID, Timestamps } from './common';

export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived';
export type MessagePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ContactMessage extends Timestamps {
  id: UUID;
  sender_id?: UUID;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  priority: MessagePriority;
  ip_address?: string;
  user_agent?: string;
  replied_at?: string;
  replied_by?: UUID;
}

export interface ContactMessageReply extends Timestamps {
  id: UUID;
  message_id: UUID;
  replied_by: UUID;
  reply_content: string;
  is_internal: boolean; // Note interne ou réponse envoyée
}

export interface ContactMessageCreateData {
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageReplyData {
  reply_content: string;
  is_internal?: boolean;
}

export interface ContactMessageWithReplies extends ContactMessage {
  replies: ContactMessageReply[];
}
