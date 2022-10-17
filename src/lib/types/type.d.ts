export interface Channel {
  idx: number;
  channel_id: string;
  user_idx: number;
  name: string;
  type: string;
  image_url?: string;
  link_url?: string;
  push: boolean;
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
}

export interface Subscription {
  idx: number;
  user_idx: number;
  channel_idx: number;
  created_at: string;
  nickname: string;
  profile: string;
}

export interface Chat {
  idx?: number;
  user_idx?: number;
  channel_id?: string;
  channel_idx?: number;
  type: string;
  message: string;
  created_at: string;
  nickname?: string;
  profile?: string;
  show_nickname?: boolean;
  show_profile?: boolean;
  show_date?: boolean;
}

export interface User {
  id: string;
  name: string;
  profile: string;
}

export interface Tag {
  idx: number;
  channel_idx: number;
  tag: string;
}
