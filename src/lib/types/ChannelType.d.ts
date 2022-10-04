import type { MessageType } from "./MessageType";

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
