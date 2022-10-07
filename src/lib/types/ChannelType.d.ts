import type { MessageType } from "$types/MessageType";

export interface ChannelType {
  id: string;
  project_id: string;
  unique_id: string;
  name: string;
  user_id: string;
  user_id: array;
  unique_id: string;
  default_lang: string;
  lang: string;
  members: string[];
  last_message: MessageType;
  push: boolean;
  link_url: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionType {
  id: string;
  channel_id: string;
  user_id: string;
  created_at: string;
  online: boolean;
  push: boolean;
  language: string;
  mark: {
    user_id: string;
    message_id: string;
    sort_id: string;
  };
}
