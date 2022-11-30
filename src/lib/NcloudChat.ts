import { ChannelType } from "ncloudchat/esm/Type";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "ncloudchat";

export const nc = new Chat();

export function initialize() {
  nc.initialize(import.meta.env.VITE_PROJECT_ID);
}

export async function connect(id: string, name: string, profile: string) {
  if (!nc.isConnected()) {
    nc.setUser({ id: id, name: name, profile });
    return await nc.connect({ id: id, name: name, profile: profile });
  }
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
  filter: any,
  offset: number,
  per_page: number
) {
  return await nc.getChannels(
    filter,
    { unique_id: -1 },
    { offset: offset, per_page: per_page }
  );
}

export async function getSubscriptions(filter: any) {
  return await nc.getSubscriptions(filter, { created_at: 1 }, { offset: 0 });
}

export async function getChannel(id: string) {
  return await nc.getChannel(id);
}

export async function createChannel(name: string, imageUrl: string) {
  const uuid = uuidv4();
  return await nc.createChannel({
    id: uuid,
    type: ChannelType.PUBLIC,
    name: name,
    uniqueId: Date.now().toString(),
    translation: false,
    disabled: false,
    push: false,
    mutes: false,
    linkUrl: "",
    imageUrl: imageUrl,
    members: [],
    customField: "",
  });
}

export async function updateChannel(
  id: string,
  type: ChannelType,
  name: string,
  unique_id: string
) {
  return await nc.updateChannel(id, {
    id: id,
    type: type,
    name: name,
    uniqueId: unique_id,
    translation: false,
    disabled: false,
    push: false,
    mutes: false,
    linkUrl: "",
    imageUrl: "",
    members: [],
    customField: "",
  });
}

export async function deleteChannel(id: string) {
  return await nc.deleteChannel(id);
}

export async function getMessages(
  channel_id: string,
  offset: number,
  per_page: number
) {
  return await nc.getMessages(
    { channel_id: channel_id },
    { created_at: -1 },
    { offset: offset, per_page: per_page }
  );
}

export async function getMessage(channel_id: string, message_id: string) {
  return await nc.getMessage(channel_id, message_id);
}

export async function sendMessage(
  channel_id: string,
  type: string,
  message: string
) {
  return await nc.sendExpressMessage(channel_id, {
    type: type,
    message: message,
  });
}

export async function sendImage(channel_id: string, file: any) {
  await nc.sendImage(channel_id, file);
}
