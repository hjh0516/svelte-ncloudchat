import type { MemberType } from "./MemberType";

export interface MessageType {
  message_id?: string;
  sort_id?: string;
  project_id?: string;
  channel_id: string;
  message_type: string;
  sender: MemberType;
  admin?: MemberType;
  mentions?: string[];
  mentions_everyone?: string;
  content: string;
  created_at?: string;
  sended_at?: string;
}
