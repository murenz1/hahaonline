import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { 
  Clock, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  MessagesSquare,
  ExternalLink,
  UserCircle,
  Tag,
  ChevronDown,
  Plus,
  Paperclip,
  X,
  Upload
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  messages: {
    id: string;
    sender: 'customer' | 'agent';
    senderName: string;
    message: string;
    timestamp: Date;
    attachments?: string[];
  }[];
}

const TicketManagement: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for tickets
  const tickets: Ticket[] = [
    {
      id: 'TKT-1001',
      subject: 'Payment failed but money deducted',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      status: 'open',
      priority: 'high',
      category: 'Payment',
      createdAt: new Date('2023-04-01T10:30:00'),
      updatedAt: new Date('2023-04-01T14:45:00'),
      assignedTo: 'Sarah Johnson',
      messages: [
        {
          id: 'MSG-1',
          sender: 'customer',
          senderName: 'John Doe',
          message: 'I tried to pay for my order but the payment failed. However, the money was deducted from my account. Order ID: #ORD-8721',
          timestamp: new Date('2023-04-01T10:30:00')
        },
        {
          id: 'MSG-2',
          sender: 'agent',
          senderName: 'Sarah Johnson',
          message: "I apologize for the inconvenience. I'll check this with our payment team and get back to you shortly. Could you please provide your transaction ID?",
          timestamp: new Date('2023-04-01T14:45:00')
        }
      ]
    },
    {
      id: 'TKT-1002',
      subject: 'Wrong item delivered',
      customerName: 'Emily Wilson',
      customerEmail: 'emily.wilson@example.com',
      status: 'pending',
      priority: 'medium',
      category: 'Order',
      createdAt: new Date('2023-04-02T09:15:00'),
      updatedAt: new Date('2023-04-02T11:30:00'),
      assignedTo: 'Michael Chen',
      messages: [
        {
          id: 'MSG-3',
          sender: 'customer',
          senderName: 'Emily Wilson',
          message: 'I received my order today but it contained the wrong item. I ordered a blue shirt but received a red one. Order ID: #ORD-9532',
          timestamp: new Date('2023-04-02T09:15:00')
        },
        {
          id: 'MSG-4',
          sender: 'agent',
          senderName: 'Michael Chen',
          message: 'I\'m sorry to hear that. Let me check your order details and arrange for the correct item to be sent to you. Could you please confirm your shipping address?',
          timestamp: new Date('2023-04-02T11:30:00')
        }
      ]
    },
    {
      id: 'TKT-1003',
      subject: 'How to reset password',
      customerName: 'Robert Brown',
      customerEmail: 'robert.brown@example.com',
      status: 'resolved',
      priority: 'low',
      category: 'Account',
      createdAt: new Date('2023-04-03T16:45:00'),
      updatedAt: new Date('2023-04-03T17:20:00'),
      assignedTo: 'Lisa Wang',
      messages: [
        {
          id: 'MSG-5',
          sender: 'customer',
          senderName: 'Robert Brown',
          message: 'I forgot my password and cannot log in to my account. How can I reset it?',
          timestamp: new Date('2023-04-03T16:45:00')
        },
        {
          id: 'MSG-6',
          sender: 'agent',
          senderName: 'Lisa Wang',
          message: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password. Let me know if you need further assistance.',
          timestamp: new Date('2023-04-03T17:20:00')
        }
      ]
    },
    {
      id: 'TKT-1004',
      subject: 'Request for product refund',
      customerName: 'Alex Johnson',
      customerEmail: 'alex.johnson@example.com',
      status: 'open',
      priority: 'urgent',
      category: 'Refund',
      createdAt: new Date('2023-04-04T13:10:00'),
      updatedAt: new Date('2023-04-04T15:30:00'),
      assignedTo: 'David Smith',
      messages: [
        {
          id: 'MSG-7',
          sender: 'customer',
          senderName: 'Alex Johnson',
          message: 'I would like to request a refund for the product I purchased last week. It does not work as described. Order ID: #ORD-7653',
          timestamp: new Date('2023-04-04T13:10:00')
        },
        {
          id: 'MSG-8',
          sender: 'agent',
          senderName: 'David Smith',
          message: 'I\'m sorry to hear that. Could you please provide more details about the issue you\'re experiencing with the product? Also, do you have any photos that might help us understand the problem better?',
          timestamp: new Date('2023-04-04T15:30:00')
        }
      ]
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    // Filter by search query
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    
    // Filter by priority
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CircleDashed className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <CircleDashed className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;

    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to submit the reply
      const newMessage = {
        id: `MSG-${Date.now()}`,
        sender: 'agent' as const,
        senderName: 'Current Agent', // Replace with actual agent name
        message: replyText,
        timestamp: new Date(),
        attachments: attachments.map(file => file.name)
      };

      // Update the ticket with the new message
      setSelectedTicket(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date()
      } : null);

      // Clear the form
      setReplyText('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTicketStatus = (newStatus: Ticket['status']) => {
    if (!selectedTicket) return;

    setSelectedTicket(prev => prev ? {
      ...prev,
      status: newStatus,
      updatedAt: new Date()
    } : null);
    setShowStatusDropdown(false);
  };

  const assignTicket = (agentName: string) => {
    if (!selectedTicket) return;

    setSelectedTicket(prev => prev ? {
      ...prev,
      assignedTo: agentName,
      updatedAt: new Date()
    } : null);
    setShowAssignDropdown(false);
  };

  return (
    <div className={cn("p-6 rounded-lg", isDark ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>Ticket Management</h2>
        <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
          Manage customer support tickets and inquiries
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        {/* Priority Filter */}
        <div className="relative">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* New Ticket Button */}
      <div className="mb-6">
        <button
          className={cn(
            "flex items-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      {/* Tickets Table */}
      {filteredTickets.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
          <MessagesSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDark ? "text-gray-200" : "text-gray-900")}>No tickets found</h3>
          <p className={cn("mt-2 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={cn("min-w-full divide-y", isDark ? "divide-gray-700" : "divide-gray-200")}>
            <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ticket</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white")}>
              {filteredTickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className={isDark ? "hover:bg-gray-700 cursor-pointer" : "hover:bg-gray-50 cursor-pointer"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{ticket.id}</div>
                    <div className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{ticket.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{ticket.customerName}</div>
                    <div className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{ticket.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center", getStatusBadgeClass(ticket.status))}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center", getPriorityBadgeClass(ticket.priority))}>
                      {getPriorityIcon(ticket.priority)}
                      <span className={ticket.priority === 'urgent' ? "ml-1" : ""}>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-1">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={cn("rounded-lg shadow-lg max-w-4xl w-full mx-4 overflow-hidden", isDark ? "bg-gray-800" : "bg-white")}>
            {/* Modal Header */}
            <div className={cn("p-4 border-b flex justify-between items-center", isDark ? "border-gray-700" : "border-gray-200")}>
              <div>
                <h3 className={cn("text-lg font-medium", isDark ? "text-white" : "text-gray-900")}>
                  {selectedTicket.id}: {selectedTicket.subject}
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getStatusBadgeClass(selectedTicket.status))}>
                    {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                  </span>
                  <span className={cn("px-2 inline-flex text-xs leading-5 font-semibold rounded-full", getPriorityBadgeClass(selectedTicket.priority))}>
                    {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                  </span>
                  <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    {formatDate(selectedTicket.createdAt)}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className={cn("p-1 rounded-full", isDark ? "hover:bg-gray-700" : "hover:bg-gray-100")}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn("p-3 rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
                  <h4 className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-600")}>Customer Information</h4>
                  <div className="flex items-center">
                    <UserCircle className="h-10 w-10 text-gray-400" />
                    <div className="ml-3">
                      <div className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{selectedTicket.customerName}</div>
                      <div className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{selectedTicket.customerEmail}</div>
                    </div>
                  </div>
                </div>
                <div className={cn("p-3 rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
                  <h4 className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-600")}>Ticket Details</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-gray-400 mr-2" />
                      <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-800")}>Category: {selectedTicket.category}</span>
                    </div>
                    {selectedTicket.assignedTo && (
                      <div className="flex items-center">
                        <UserCircle className="h-4 w-4 text-gray-400 mr-2" />
                        <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-800")}>Assigned to: {selectedTicket.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Conversation */}
              <div className="space-y-4 mt-6">
                <h4 className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-600")}>Conversation</h4>
                {selectedTicket.messages.map(message => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "p-3 rounded-lg max-w-3xl",
                      message.sender === 'customer' 
                        ? isDark ? "bg-gray-700 ml-0" : "bg-gray-100 ml-0"
                        : isDark ? "bg-blue-900/20 ml-auto" : "bg-blue-50 ml-auto"
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={cn("font-medium text-sm", isDark ? "text-gray-300" : "text-gray-800")}>
                        {message.senderName} {message.sender === 'agent' && '(Agent)'}
                      </span>
                      <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                        {formatDate(message.timestamp, { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-800")}>{message.message}</p>
                  </div>
                ))}
              </div>
              
              {/* Reply form */}
              <div className="mt-6">
                <textarea 
                  placeholder="Type your reply..." 
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className={cn(
                    "w-full p-3 rounded-lg border focus:ring-2 focus:outline-none",
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  )}
                ></textarea>
                
                {/* Attachments */}
                {attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {attachments.map((file, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "flex items-center justify-between p-2 rounded",
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        )}
                      >
                        <div className="flex items-center">
                          <Paperclip className="w-4 h-4 mr-2" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="p-1 hover:bg-gray-200 rounded-full dark:hover:bg-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex justify-between">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "px-3 py-1 rounded border mr-2 flex items-center",
                        isDark 
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Attach Files
                    </button>
                    <button 
                      className={cn(
                        "px-3 py-1 rounded border",
                        isDark 
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      Use Template
                    </button>
                  </div>
                  <button 
                    onClick={handleReply}
                    disabled={!replyText.trim() || isSubmitting}
                    className={cn(
                      "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className={cn("p-4 border-t", isDark ? "border-gray-700" : "border-gray-200")}>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="relative">
                    <button 
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className={cn(
                        "px-3 py-1 rounded font-medium flex items-center",
                        isDark 
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                    >
                      Update Status
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {showStatusDropdown && (
                      <div className={cn(
                        "absolute bottom-full mb-1 left-0 w-48 rounded-lg shadow-lg",
                        isDark ? "bg-gray-800" : "bg-white",
                        "border",
                        isDark ? "border-gray-700" : "border-gray-200"
                      )}>
                        {['open', 'pending', 'resolved', 'closed'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateTicketStatus(status as Ticket['status'])}
                            className={cn(
                              "w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg",
                              isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                            )}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                      className={cn(
                        "px-3 py-1 rounded font-medium flex items-center",
                        isDark 
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                    >
                      Assign to
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {showAssignDropdown && (
                      <div className={cn(
                        "absolute bottom-full mb-1 left-0 w-48 rounded-lg shadow-lg",
                        isDark ? "bg-gray-800" : "bg-white",
                        "border",
                        isDark ? "border-gray-700" : "border-gray-200"
                      )}>
                        {['Sarah Johnson', 'Michael Chen', 'Lisa Wang', 'David Smith'].map((agent) => (
                          <button
                            key={agent}
                            onClick={() => assignTicket(agent)}
                            className={cn(
                              "w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg",
                              isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                            )}
                          >
                            {agent}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement; 