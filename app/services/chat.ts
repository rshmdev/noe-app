import api from '~/lib/api';
import type { Messages, Root } from '~/types/chat';
import { io } from 'socket.io-client';
import socket from '~/lib/socket';

export async function startChat(userId: string, routeId: string) {
  const res = await api.post('/chats/start', {
    userId,
    routeId,
  });

  if (res.status !== 201) {
    throw new Error('Error starting chat');
  }

  return res.data;
}

export async function getChatMessages(chatId: string) {
  const res = await api.get(`/chats/${chatId}/messages`);

  if (res.status !== 200) {
    throw new Error('Error fetching chat messages');
  }

  return res.data as Messages[];
}

export async function sendMessage(chatId: string, message: string) {
  const res = await api.post(`/chats/${chatId}/messages`, {
    text: message,
  });

  if (res.status !== 201) {
    throw new Error('Error sending message');
  }

  return res.data;
}

export async function markMessagesAsRead(chatId: string) {
  const res = await api.post(`/chats/${chatId}/read`);

  if (res.status !== 201) {
    throw new Error('Error marking message as read');
  }

  return res.data;
}

export async function getChats() {
  const res = await api.get(`/chats`);

  if (res.status !== 200) {
    throw new Error('Error fetching chat');
  }

  return res.data as Root[];
}

export function listenToChat(
  chatId: string,
  userId: string,
  myUserId: string,
  onMessage: (msg: any) => void,
  onUnreadUpdate: (chatId: string) => void,
) {
  socket.emit('joinChat', { chatId, userId });

  socket.off('newMessage');
  socket.off('unreadUpdate');

  socket.on('newMessage', (message) => {
    if (message.sender.id !== myUserId) {
      // Só chama onMessage se NÃO fui eu quem enviei
      onMessage(message);
    }
  });

  socket.on('unreadUpdate', (data) => {
    if (data.chatId !== chatId) {
      onUnreadUpdate(data.chatId);
    }
  });
}

export function listenGlobalEvents(
  myUserId: string,
  onNewMessage: (chatId: string, message: any) => void,
  onUnreadUpdate: (chatId: string) => void,
) {
  socket.off('newMessage');
  socket.off('unreadUpdate');

  socket.on('newMessage', (message) => {
    if (message.sender.id !== myUserId) {
      onNewMessage(message.chatId, message);
    }
  });

  socket.on('unreadUpdate', (data) => {
    onUnreadUpdate(data.chatId);
  });
}
