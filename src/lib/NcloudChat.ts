import { v4 as uuidv4 } from "uuid";
import { Chat } from "ncloudchat";
import type { ChannelType as CType } from "ncloudchat/esm/Type";
import type { ChannelType, SubscriptionType } from "./types/ChannelType";
import type { MessageType } from "./types/MessageType";

export const nc = new Chat();

export function initialize() {
  nc.initialize("2ef56fa4-c935-4c6c-ac64-ceb4fbbc73b6");
}

export async function connect(id: string, name: string) {
  nc.setUser({ id: id, name: name });
  return await nc.connect({ id: id, name: name });
}

export async function disconnect() {
  await nc.disconnect();
}

export async function bind(id: string, fn: any) {
  await nc.bind(id, fn);
}

export async function unbindall(id: string) {
  await nc.unbindall(id);
}

export function isConnected() {
  return nc.isConnected();
}

export async function getUser() {
  return await nc.getUser();
}

export async function subscribe(channel_id: string) {
  await nc.subscribe(channel_id);
}

export async function unsubscribe(channel_id: string) {
  await nc.unsubscribe(channel_id);
}

export async function getChannels(
  offset: number,
  per_page: number
): Promise<ChannelType[]> {
  return await nc.getChannels(
    { state: true },
    { created_at: "asc" },
    { offset: offset, per_page: per_page }
  );
}

export async function getSubscriptions(
  user_id: string,
  offset: number,
  per_page: number
): Promise<SubscriptionType[]> {
  return await nc.getSubscriptions(
    { user_id: user_id, online: true },
    { created_at: "asc" },
    { offset: offset, per_page: per_page }
  );
}

export async function getChannel(id: string) {
  return await nc.getChannel(id);
}

export async function createChannel(
  type: CType,
  name: string
): Promise<ChannelType> {
  const uuid = uuidv4();
  return await nc.createChannel({
    id: uuid,
    type: type,
    name: name,
    uniqueId: uuid,
    translation: false,
    disabled: false,
    push: false,
    mutes: false,
    linkUrl: "",
    imageUrl: "",
    members: [],
  });
}

export async function updateChannel(id: string, type: CType, name: string) {
  return await nc.updateChannel(id, {
    id: id,
    type: type,
    name: name,
    uniqueId: id,
    translation: false,
    disabled: false,
    push: false,
    mutes: false,
    linkUrl: "",
    imageUrl: "",
    members: [],
  });
}

export async function getMessages(
  channel_id: string,
  offset: number,
  per_page: number
): Promise<MessageType[]> {
  return await nc.getMessages(
    { channel_id: channel_id },
    { created_at: -1 },
    { offset: offset, per_page: per_page }
  );
}

export async function getMessage(
  channel_id: string,
  message_id: string
): Promise<MessageType> {
  return await nc.getMessage(channel_id, message_id);
}

export async function sendMessage(
  channel_id: string,
  type: string,
  message: string
) {
  return await nc.sendMessage(channel_id, {
    type: type,
    message: message,
  });
}

export async function sendImage(channel_id: string, file: any) {
  await nc.sendImage(channel_id, file);
}
