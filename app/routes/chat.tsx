'use client';

import { useState, useEffect, useRef, use } from 'react';

import {
  PawPrintIcon as Paw,
  Search,
  MessageSquare,
  Send,
  ChevronLeft,
  User,
  MapPin,
  Calendar,
  DollarSign,
  X,
  Check,
  NotepadText,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Textarea } from '~/components/ui/textarea';

import { useIsMobile } from '~/hooks/use-mobile';
import {
  Link,
  useNavigate,
  useSearchParams,
  type MetaArgs,
} from 'react-router';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getChatMessages,
  getChats,
  listenToChat,
  markMessagesAsRead,
  sendMessage,
  startChat,
} from '~/services/chat';
import type { Messages, Root } from '~/types/chat';
import useAuth from '~/hooks/use-auth';
import { CreateProposalDialog } from '~/components/chat/create-proposal-dialog';
import { acceptProposal, rejectProposal } from '~/services/proposal';
import socket from '~/lib/socket';
import { useGlobalSocket } from '~/hooks/use-global-socket';
import ProtectedRoute from '~/components/protected-route';
import { handlePayment } from '~/services/stripe';

export function meta({}: MetaArgs) {
  return [
    { title: 'Noé - Chat' },
    {
      name: 'description',
      content:
        'Converse com os transportadores e tire suas dúvidas sobre as rotas disponíveis.',
    },
  ];
}

export default function ChatPage() {
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();

  const [searchParams] = useSearchParams();
  const transportadorId = searchParams.get('transportador') || '';
  const routeId = searchParams.get('route') || '';
  const chatId = searchParams.get('chatId') || '';

  const [activeChat, setActiveChat] = useState<Root | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const { mutateAsync } = useMutation({
    mutationFn: ({ userId, routeId }: { userId: string; routeId: string }) =>
      startChat(userId, routeId),

    onSuccess: (data) => {
      setActiveChat(data.chat);
    },

    onError: (error) => {
      toast.error('Erro ao iniciar chat');
    },
  });

  const queryClient = useQueryClient();

  const { data: chatMessages, isLoading: loadingMessages } = useQuery({
    queryKey: ['chatMessages', activeChat?.id],
    queryFn: () => getChatMessages(activeChat!.id),
    enabled: !!activeChat,
  });

  useGlobalSocket(activeChat?.id, (newMessage) => {
    if (newMessage.sender.id !== user?.id) {
      queryClient.setQueryData(
        ['chatMessages', activeChat!.id],
        (old: Messages[] = []) => {
          const alreadyExists = old.some((msg) => msg.id === newMessage.id);
          if (alreadyExists) return old;
          return [...old, newMessage];
        },
      );
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  const { mutateAsync: sendMessageMutation, isPending: sendingMessage } =
    useMutation({
      mutationFn: (message: string) => sendMessage(activeChat!.id, message),
      onSuccess: (data) => {
        queryClient.setQueryData(
          ['chatMessages', activeChat!.id],
          (old: Messages[] = []) => {
            const alreadyExists = old.some((msg) => msg.id === data.id);
            if (alreadyExists) return old;
            return [...old, data];
          },
        );
      },
      onError: () => {
        toast.error('Erro ao enviar mensagem');
      },
    });

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setMessageText('');
    await sendMessageMutation(messageText);
    textareaRef.current?.focus();
  };

  const {
    mutateAsync: acceptProposalMutation,
    isPending: isPendingProposalAccept,
  } = useMutation({
    mutationFn: (proposalId: string) => acceptProposal(proposalId),
    onSuccess: () => {
      toast.success('Proposta aceita com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao aceitar proposta');
    },
  });

  const {
    mutateAsync: rejectProposalMutation,
    isPending: isPendingProposalreject,
  } = useMutation({
    mutationFn: (proposalId: string) => rejectProposal(proposalId),
    onSuccess: () => {
      toast.success('Proposta recusada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao recusar proposta');
    },
  });

  const { data: chats } = useQuery({
    queryKey: ['chats'],
    queryFn: () => getChats(),
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (chatId && chats) {
      const chat = chats.find((c) => c.id === chatId);
      if (chat) {
        setActiveChat(chat);
      } else {
        toast.error('Conversa não encontrada');
      }
    }
  }, [chatId, chats]);

  const respondToProposal = async (proposalId: string, accept: boolean) => {
    if (accept) {
      await acceptProposalMutation(proposalId);
    } else {
      await rejectProposalMutation(proposalId);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString();
    }
  };

  const selectChat = async (chat: Root) => {
    setActiveChat(chat);
    socket.emit('joinChat', { chatId: chat.id, userId: user?.id }); // apenas avisa ao abrir
    await markMessagesAsRead(chat.id);
    queryClient.setQueryData(['chats'], (oldChats: Root[]) =>
      oldChats?.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)),
    );

    if (isMobile) {
      setShowSidebar(false);
    }
  };

  useEffect(() => {
    if (transportadorId && routeId && chats) {
      const chat = chats.find(
        (c) => c.otherUser.id === transportadorId && c.route.id === routeId,
      );
      if (chat) {
        setActiveChat(chat);
        setShowSidebar(false);
      } else {
        mutateAsync({ userId: transportadorId, routeId });
      }
    }
  }, [transportadorId, routeId, chats]);

  return (
    <ProtectedRoute allowedRoles={['TRANSPORTER', 'NORMAL']}>
      <div className="flex flex-col h-full overflow-y-auto">
        <header className="border-b bg-card backdrop-blur-xl shadow sticky top-0 z-10 rounded-t-2xl">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            {!showSidebar && activeChat && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setShowSidebar(true)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            {!showSidebar && activeChat && (
              <div className="flex items-center gap-3 flex-1 ml-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={'/placeholder.svg'} />
                  <AvatarFallback>
                    {activeChat.otherUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <h3 className=" font-medium truncate">
                    {activeChat.otherUser.name}
                  </h3>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                className="md:hover:bg-transparent"
                variant="ghost"
                size="icon"
                asChild
              >
                <Link to="/">
                  <ChevronLeft className="h-5 w-5 md:hidden" />
                  <span className="hidden md:inline">Voltar</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-y-auto bg-card rounded-b-2xl shadow border">
          {showSidebar && (
            <div className="w-full md:w-80 lg:w-96 border-r flex flex-col">
              <div className="p-4 border-b  flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold ">Mensagens</h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  <Input
                    placeholder="Buscar conversas..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="all" className="w-full py-4 px-4">
                  <TabsList className="flex items-center justify-start flex-wrap h-auto w-full">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="unread">Não lidas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    {chats && chats?.length > 0 ? (
                      <div className="divide-y flex flex-col gap-2">
                        {chats
                          .sort((a, b) => {
                            const dateA = new Date(
                              a.lastMessage?.createdAt,
                            ).getTime();
                            const dateB = new Date(
                              b.lastMessage?.createdAt,
                            ).getTime();
                            return dateB - dateA;
                          })
                          ?.map((chat) => (
                            <div
                              key={chat.id}
                              className={`p-4 rounded-lg cursor-pointer hover:bg-green-800/20 ${
                                activeChat?.id === chat.id
                                  ? 'bg-green-900/30'
                                  : ''
                              }`}
                              onClick={() => selectChat(chat)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={'/placeholder.svg'} />
                                    <AvatarFallback className="">
                                      {chat.otherUser.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  {chat.unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                      {chat.unreadCount}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h3 className=" font-medium truncate">
                                      {chat.otherUser.name}
                                    </h3>
                                    <span className=" text-xs">
                                      {formatDate(
                                        new Date(chat.createdAt) || new Date(),
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs mt-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">
                                      {chat.route.origin} →{' '}
                                      {chat.route.destination}
                                    </span>
                                  </div>
                                  {chat.lastMessage && (
                                    <p
                                      className={`text-sm mt-1 truncate ${
                                        chat.unreadCount > 0
                                          ? ' font-medium'
                                          : ''
                                      }`}
                                    >
                                      {chat.lastMessage.proposal
                                        ? '📋 Proposta de transporte'
                                        : chat.lastMessage.text}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                        <h3 className=" font-medium mb-2">
                          Nenhuma conversa encontrada
                        </h3>
                        <p className="mb-4">
                          {searchQuery
                            ? 'Nenhuma conversa corresponde à sua busca'
                            : 'Inicie uma nova conversa para começar'}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="unread" className="mt-0">
                    {chats &&
                    chats?.filter((chat) => chat.unreadCount > 0).length > 0 ? (
                      <div className="divide-y">
                        {chats
                          .filter((chat) => chat.unreadCount > 0)
                          .map((chat) => (
                            <div
                              key={chat.id}
                              className={`p-4 rounded-lg hover:bg-green-900/20 cursor-pointer ${
                                activeChat?.id === chat.id
                                  ? 'bg-green-900/80'
                                  : ''
                              }`}
                              onClick={() => selectChat(chat)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={'/placeholder.svg'} />
                                    <AvatarFallback className="">
                                      {chat.otherUser.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-1 -right-1 bg-red-500  text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {chat.unreadCount}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h3 className=" font-medium truncate">
                                      {chat.otherUser.name}
                                    </h3>
                                    <span className="text-xs">
                                      {formatDate(
                                        new Date(chat.createdAt) || new Date(),
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs mt-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">
                                      {chat.route.origin} →{' '}
                                      {chat.route.destination}
                                    </span>
                                  </div>
                                  {chat.lastMessage && (
                                    <p className=" font-medium text-sm mt-1 truncate">
                                      {chat.lastMessage.proposal
                                        ? '📋 Proposta de transporte'
                                        : chat.lastMessage.text}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                        <h3 className=" font-medium mb-2">
                          Nenhuma mensagem não lida
                        </h3>
                        <p>Todas as suas mensagens foram lidas</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Área de conversa */}
          {(isMobile ? !showSidebar : true) && activeChat ? (
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Área de mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="flex space-x-2">
                      <div
                        className="w-3 h-3 rounded-full bg-green-400 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-3 h-3 rounded-full bg-green-400 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-3 h-3 rounded-full bg-green-400 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-1  text-xs">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {activeChat.route.origin} →{' '}
                          {activeChat.route.destination}
                        </span>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{activeChat.route.originDate}</span>
                      </div>
                    </div>

                    {chatMessages &&
                      chatMessages?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender.id === user?.id
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          {message.proposal ? (
                            <Card className="w-full max-w-md  ">
                              <CardHeader className="pb-2">
                                <CardTitle className=" text-lg flex items-center justify-between">
                                  <span>Proposta de Transporte</span>
                                  <Badge
                                    className={
                                      message.paymentStatus === 'paid'
                                        ? 'bg-blue-600 hover:bg-blue-600'
                                        : message.proposal.status === 'pending'
                                        ? 'bg-yellow-600 hover:bg-yellow-600'
                                        : message.proposal.status === 'accepted'
                                        ? 'bg-green-600 hover:bg-green-600'
                                        : message.proposal.status === 'paid'
                                        ? 'bg-blue-600 hover:bg-blue-600'
                                        : 'bg-red-600 hover:bg-red-600'
                                    }
                                  >
                                    {message.paymentStatus === 'paid'
                                      ? 'Pago'
                                      : message.proposal.status === 'pending'
                                      ? 'Pendente'
                                      : message.proposal.status === 'accepted'
                                      ? 'Aceita'
                                      : message.proposal.status === 'paid'
                                      ? 'Paga'
                                      : 'Recusada'}
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3 py-2">
                                <div className="flex justify-between">
                                  <span className="text-green-900">Valor:</span>
                                  <span className=" font-medium">
                                    R$ {message.proposal.price}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-900">Rota:</span>
                                  <span className="">
                                    {activeChat.route.origin} →{' '}
                                    {activeChat.route.destination}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-900">Data:</span>
                                  <span className="">
                                    {new Date(
                                      activeChat.route.originDate,
                                    ).toLocaleString()}{' '}
                                    -{' '}
                                    {new Date(
                                      activeChat.route.destinationDate,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </CardContent>
                              {message.proposal.status === 'pending' &&
                                message.sender.id !== user?.id && (
                                  <CardFooter className="flex gap-2 pt-2">
                                    <Button
                                      className="flex-1"
                                      disabled={
                                        isPendingProposalAccept ||
                                        isPendingProposalreject
                                      }
                                      onClick={() =>
                                        respondToProposal(
                                          message.proposal!.id,
                                          true,
                                        )
                                      }
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Aceitar
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      className="flex-1 "
                                      disabled={
                                        isPendingProposalAccept ||
                                        isPendingProposalreject
                                      }
                                      onClick={() =>
                                        respondToProposal(
                                          message.proposal!.id,
                                          false,
                                        )
                                      }
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Recusar
                                    </Button>
                                  </CardFooter>
                                )}
                              {message.proposal.status === 'accepted' &&
                                !message.paymentStatus && (
                                  <CardFooter className="pt-2">
                                    <Button
                                      className="w-full bg-green-600 hover:bg-green-500 "
                                      onClick={() =>
                                        handlePayment(
                                          message?.proposal?.id || '',
                                        )
                                      }
                                    >
                                      <DollarSign className="h-4 w-4 mr-2" />
                                      Ir para pagamento
                                    </Button>
                                  </CardFooter>
                                )}

                              {message.paymentStatus === 'paid' && (
                                <CardFooter className="pt-2">
                                  <Button className="w-full bg-blue-600 hover:bg-blue-500 ">
                                    <NotepadText className="h-4 w-4 mr-2" />
                                    Detalhes do pedido
                                  </Button>
                                </CardFooter>
                              )}
                            </Card>
                          ) : (
                            <div
                              className={`max-w-xs shadow-sm sm:max-w-sm md:max-w-md rounded-lg px-4 py-2 ${
                                message.sender.id === user?.id
                                  ? 'bg-emerald-200 text-emerald-900 ml-auto'
                                  : ' bg-emerald-400 text-emerald-950'
                              }`}
                            >
                              <p>{message.text}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender.id === user?.id
                                    ? 'text-emerald-900 '
                                    : 'text-emerald-950'
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  },
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Área de entrada de mensagem */}
              <div className=" border-t  p-4 rounded-b-xl">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Digite sua mensagem..."
                      // disabled={sendingMessage}
                      className="min-h-[60px] max-h-[120px] resize-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    {user?.role === 'TRANSPORTER' && (
                      <CreateProposalDialog
                        userId={activeChat.otherUser.id}
                        routeId={activeChat.route.id}
                        chatId={activeChat.id}
                      />
                    )}
                    <Button
                      className="h-[60px] w-14"
                      onClick={() => handleSendMessage()}
                      disabled={!messageText.trim() || sendingMessage}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            isMobile &&
            !showSidebar && (
              <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center">
                <MessageSquare className="h-16 w-16 text-green-700 mb-4" />
                <h2 className="text-2xl font-bold  mb-2">Suas mensagens</h2>
                <p className="text-green-300 mb-6 max-w-md">
                  Selecione uma conversa para ver as mensagens
                </p>
              </div>
            )
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
