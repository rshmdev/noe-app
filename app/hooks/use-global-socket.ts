import { useEffect } from 'react';
import socket from '~/lib/socket';
import { toast } from 'sonner';
import useAuth from './use-auth';
import { useNavigate } from 'react-router';

export function useGlobalSocket(activeChatId?: string) {
  const { user } = useAuth(); // ou pegue o user de algum lugar
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('joinChat', { userId: user.id });

    socket.off('newMessage');
    socket.off('unreadUpdate');

    socket.on('newMessage', (message) => {
      console.log('Nova mensagem recebida:', message);
      if (message.sender.id !== user.id && message.chatId !== activeChatId) {
        toast(`${message.sender.name} te enviou uma mensagem`, {
          description: message.text
            ? `"${message.text}"`
            : '📋 Enviou uma proposta de transporte',
          duration: 5000,
          action: {
            label: 'Abrir Chat',
            onClick: () => {
              navigate(`/chat?chatId=${message.chatId}`);
            },
          },
        });
      }
    });

    socket.on('unreadUpdate', (data) => {
      if (data.chatId !== activeChatId) {
        // Atualiza unread no frontend
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('unreadUpdate');
    };
  }, [user?.id, activeChatId]);
}
