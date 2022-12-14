export interface Channel {
  idx: number;
  channel_id: string;
  user_idx: number;
  name: string;
  type: string;
  image_url?: string;
  link_url?: string;
  created_at: string;
  updated_at: string;
  chat_idx: number;
  chat_type: string;
  message: string;
  last_chat_at: string;
  subscriptions_count?: number;
  tags?: Tag[];
  nickname?: string;
  profile?: string;
  unread_count: number;
  notification: boolean;
  is_subscription: boolean;
  subscriptions: Subscription[];
}

export interface Subscription {
  idx: number;
  user_idx: number;
  channel_idx: number;
  created_at: string;
  nickname: string;
  profile: string;
  is_ban: boolean;
}

export interface Chat {
  idx?: number;
  user_idx?: number;
  channel_id?: string;
  channel_idx?: number;
  type: string;
  message?: string;
  image_url?: string;
  created_at: string;
  nickname?: string;
  profile?: string;
  show_nickname?: boolean;
  show_profile?: boolean;
  show_date?: boolean;
  is_read?: number;
}

export interface User {
  id: string;
  name: string;
  profile: string;
  level: number;
  use_chat: boolean;
  chat_notification: boolean;
}

export interface Tag {
  idx: number;
  channel_idx: number;
  tag: string;
}

export interface Notification {
  idx: number;
  user_idx: number;
  channel_idx: number;
  notification: boolean;
  created_at: string;
  updated_at: string;
}

export interface Read {
  idx: number;
  user_idx: number;
  channel_idx: number;
  chat_idx: number;
  created_at: string;
  updated_at: string;
}

export interface Emoji {
  idx: number;
  content_idx: number;
  contents: string;
  emoticon_name: string;
  created_at: string;
  show: boolean;
  nickname: string;
  is_bookmark: boolean;
  is_like: boolean;
  likes_count: boolean;
  files: EmojiFile[];
}

export interface EmojiFile {
  idx: number;
  content_idx: number;
  path: string;
}

export interface Member {
  id: string;
  name: string;
  profile?: string;
}

export interface Message {
  message_id: string;
  sort_id: string;
  project_id: string;
  channel_id: string;
  message_type: string;
  sender: Member;
  mentions: string[];
  mentions_everyone: boolean;
  content?: string;
  created_at: string;
  sended_at?: string;
  attachment_filenames: {
    name?: string;
    size: number;
    type: string;
    url?: string;
  };
}

export interface Content {
  idx: number;
  content_idx: number;
  origin_path: string;
  path: string;
}
