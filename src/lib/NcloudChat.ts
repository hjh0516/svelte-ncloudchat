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

export async function bind(id: string, fn: any) {
  await nc.bind(id, fn);
}

export async function unbindall(id: string) {
  await nc.unbindall(id);
}

export function isConnected() {
  return nc.isConnected();
}

export async function subscribe(channel_id: string) {
  await nc.subscribe(channel_id);
}

export async function unsubscribe(channel_id: string) {
  await nc.unsubscribe(channel_id);
}

export async function getSubscriptions(filter: any) {
  return await nc.getSubscriptions(filter, { created_at: 1 }, { offset: 0 });
}

export async function createChannel(name: string, imageUrl?: string) {
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
    imageUrl: imageUrl,
    members: [],
  });
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
