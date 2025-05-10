import { useEffect } from 'react';
import socket from '~/lib/socket';
import { toast } from 'sonner';
import useAuth from './use-auth';
import { useNavigate } from 'react-router';

export function useGlobalSocket(
  activeChatId?: string,
  onNewMessage?: (message: any) => void,
) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Garante que o usuário esteja conectado à sua sala pessoal
    socket.emit('joinChat', { userId: user.id });

    const handleNewMessage = (message: any) => {
      console.log('Nova mensagem recebida:', message);

      // Atualiza as mensagens se o chat estiver ativo
      if (message.chatId === activeChatId && onNewMessage) {
        onNewMessage(message);
      }

      // Exibe o toast se for uma nova mensagem de outro chat
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
    };

    const handleUnreadUpdate = (data: any) => {
      if (data.chatId !== activeChatId) {
        // Atualiza unread no frontend
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('unreadUpdate', handleUnreadUpdate);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('unreadUpdate', handleUnreadUpdate);
    };
  }, [user?.id, activeChatId, onNewMessage]);
}
