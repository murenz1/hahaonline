import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatters';
import {
  MessageSquare,
  Send,
  Phone,
  Video,
  Paperclip,
  User,
  Clock,
  Check,
  AlertCircle,
  CheckCheck,
  MoreVertical,
  Search,
  Users
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'customer';
  senderName: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

interface ChatConversation {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: 'active' | 'waiting' | 'closed';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: ChatMessage[];
}

const LiveChat: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>('chat-1');

  // Mock data for chats
  const conversations: ChatConversation[] = [
    {
      id: 'chat-1',
      customer: {
        id: 'cust-101',
        name: 'John Smith',
        email: 'john.smith@example.com',
      },
      status: 'active',
      lastMessage: "I still haven't received my order. It's been over a week now.",
      lastMessageTime: new Date('2023-04-05T10:23:00'),
      unreadCount: 2,
      messages: [
        {
          id: 'msg-1-1',
          sender: 'customer',
          senderName: 'John Smith',
          message: 'Hello, I placed an order last week (Order #12345) but it still shows as "processing". When will it ship?',
          timestamp: new Date('2023-04-05T10:15:00'),
          status: 'read'
        },
        {
          id: 'msg-1-2',
          sender: 'agent',
          senderName: 'Support Agent',
          message: 'Hi John, let me check your order status. One moment please.',
          timestamp: new Date('2023-04-05T10:17:00'),
          status: 'read'
        },
        {
          id: 'msg-1-3',
          sender: 'agent',
          senderName: 'Support Agent',
          message: 'I can see that your order is now packed and scheduled for shipment today. You should receive a tracking number by email this evening.',
          timestamp: new Date('2023-04-05T10:20:00'),
          status: 'read'
        },
        {
          id: 'msg-1-4',
          sender: 'customer',
          senderName: 'John Smith',
          message: "I still haven't received my order. It's been over a week now.",
          timestamp: new Date('2023-04-05T10:23:00'),
          status: 'read'
        }
      ]
    },
    {
      id: 'chat-2',
      customer: {
        id: 'cust-102',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
      },
      status: 'waiting',
      lastMessage: "How do I return an item that doesn't fit?",
      lastMessageTime: new Date('2023-04-05T09:45:00'),
      unreadCount: 1,
      messages: [
        {
          id: 'msg-2-1',
          sender: 'customer',
          senderName: 'Sarah Johnson',
          message: "How do I return an item that doesn't fit?",
          timestamp: new Date('2023-04-05T09:45:00'),
          status: 'delivered'
        }
      ]
    },
    {
      id: 'chat-3',
      customer: {
        id: 'cust-103',
        name: 'Michael Wong',
        email: 'michael.w@example.com',
      },
      status: 'active',
      lastMessage: "Thank you for the information. I'll try that.",
      lastMessageTime: new Date('2023-04-05T09:30:00'),
      unreadCount: 0,
      messages: [
        {
          id: 'msg-3-1',
          sender: 'customer',
          senderName: 'Michael Wong',
          message: "I'm having trouble adding items to my cart. The site keeps showing an error.",
          timestamp: new Date('2023-04-05T09:20:00'),
          status: 'read'
        },
        {
          id: 'msg-3-2',
          sender: 'agent',
          senderName: 'Support Agent',
          message: "I'm sorry to hear that, Michael. Could you try clearing your browser cache and cookies, then reloading the page?",
          timestamp: new Date('2023-04-05T09:25:00'),
          status: 'read'
        },
        {
          id: 'msg-3-3',
          sender: 'customer',
          senderName: 'Michael Wong',
          message: "Thank you for the information. I'll try that.",
          timestamp: new Date('2023-04-05T09:30:00'),
          status: 'read'
        }
      ]
    },
    {
      id: 'chat-4',
      customer: {
        id: 'cust-104',
        name: 'Emma Davis',
        email: 'emma.d@example.com',
      },
      status: 'closed',
      lastMessage: 'Great, thank you for your help!',
      lastMessageTime: new Date('2023-04-04T16:50:00'),
      unreadCount: 0,
      messages: [
        {
          id: 'msg-4-1',
          sender: 'customer',
          senderName: 'Emma Davis',
          message: 'Do you offer express shipping to Canada?',
          timestamp: new Date('2023-04-04T16:40:00'),
          status: 'read'
        },
        {
          id: 'msg-4-2',
          sender: 'agent',
          senderName: 'Support Agent',
          message: 'Yes, we do offer express shipping to Canada. The delivery time is typically 2-3 business days, and the cost depends on the weight and dimensions of your order.',
          timestamp: new Date('2023-04-04T16:45:00'),
          status: 'read'
        },
        {
          id: 'msg-4-3',
          sender: 'customer',
          senderName: 'Emma Davis',
          message: 'Great, thank you for your help!',
          timestamp: new Date('2023-04-04T16:50:00'),
          status: 'read'
        }
      ]
    }
  ];

  const filteredConversations = conversations.filter(conversation => {
    // Filter by search query
    return (
      conversation.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedConversation = conversations.find(conv => conv.id === activeConversation) || null;

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    // In a real app, this would send the message to the backend
    console.log(`Sending message to ${activeConversation}: ${newMessage}`);
    
    // Clear input
    setNewMessage('');
  };

  const getConversationStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className={cn("rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-16rem)]", isDark ? "bg-gray-800" : "bg-white")}>
      {/* Conversation List (Left Sidebar) */}
      <div className={cn("border-r", isDark ? "border-gray-700" : "border-gray-200")}>
        <div className={cn("p-4 border-b", isDark ? "border-gray-700" : "border-gray-200")}>
          <h2 className={cn("text-lg font-semibold mb-3", isDark ? "text-white" : "text-gray-900")}>Conversations</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-9 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none",
                isDark 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              )}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                No conversations found
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={cn(
                  "p-3 cursor-pointer",
                  activeConversation === conversation.id
                    ? isDark ? "bg-gray-700" : "bg-gray-100"
                    : isDark ? "hover:bg-gray-700" : "hover:bg-gray-50",
                  conversation.unreadCount > 0 && "font-semibold"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center", 
                    isDark ? "bg-gray-600" : "bg-gray-200"
                  )}>
                    {conversation.customer.avatar ? (
                      <img 
                        src={conversation.customer.avatar} 
                        alt={conversation.customer.name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className={isDark ? "text-white" : "text-gray-900"}>
                        {conversation.customer.name}
                      </span>
                      <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                        {formatDate(conversation.lastMessageTime, {
                          hour: undefined, 
                          minute: undefined, 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className={cn(
                        "text-sm truncate", 
                        isDark ? "text-gray-300" : "text-gray-600",
                      )}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 flex-shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full", 
                        getConversationStatusClass(conversation.status)
                      )}>
                        {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area (Center) */}
      <div className="col-span-2 flex flex-col h-full">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className={cn("p-4 border-b flex justify-between items-center", isDark ? "border-gray-700" : "border-gray-200")}>
              <div className="flex items-center">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center mr-3", 
                  isDark ? "bg-gray-600" : "bg-gray-200"
                )}>
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h2 className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                    {selectedConversation.customer.name}
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    {selectedConversation.customer.email}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className={cn(
                  "p-2 rounded-full", 
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}>
                  <Phone className="h-5 w-5 text-gray-500" />
                </button>
                <button className={cn(
                  "p-2 rounded-full", 
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}>
                  <Video className="h-5 w-5 text-gray-500" />
                </button>
                <button className={cn(
                  "p-2 rounded-full", 
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}>
                  <Users className="h-5 w-5 text-gray-500" />
                </button>
                <button className={cn(
                  "p-2 rounded-full", 
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}>
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className={cn(
              "flex-1 p-4 overflow-y-auto", 
              isDark ? "bg-gray-900" : "bg-gray-50"
            )}>
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === 'agent' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-xs md:max-w-md rounded-lg p-3",
                      message.sender === 'agent'
                        ? isDark ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-900"
                        : isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900",
                      message.sender === 'agent' ? "rounded-br-none" : "rounded-bl-none"
                    )}>
                      <p className="mb-1">{message.message}</p>
                      <div className={cn(
                        "text-xs flex justify-end items-center space-x-1",
                        message.sender === 'agent'
                          ? isDark ? "text-blue-200" : "text-blue-700"
                          : isDark ? "text-gray-400" : "text-gray-500"
                      )}>
                        <span>{formatMessageTime(message.timestamp)}</span>
                        {message.sender === 'agent' && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat Input */}
            <div className={cn("p-4 border-t", isDark ? "border-gray-700" : "border-gray-200")}>
              <div className="flex items-end">
                <button className={cn(
                  "p-2 rounded-full", 
                  isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                )}>
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 mx-2">
                  <textarea
                    rows={1}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className={cn(
                      "w-full p-3 rounded-lg border focus:ring-2 focus:outline-none resize-none",
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                    )}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={cn(
                    "p-2 rounded-full",
                    !newMessage.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700",
                    "bg-blue-600 text-white"
                  )}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className={cn("text-lg font-medium", isDark ? "text-gray-200" : "text-gray-900")}>No conversation selected</h3>
              <p className={cn("mt-2 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                Select a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat; 