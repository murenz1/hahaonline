import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
  ChevronDown,
  User,
  AlertTriangle
} from 'lucide-react';

interface Feedback {
  id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  createdAt: Date;
  source: 'website' | 'app' | 'email' | 'social';
  status: 'new' | 'reviewed' | 'responded';
  helpful: number;
  notHelpful: number;
  orderId?: string;
}

const CustomerFeedback: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  // Mock data for feedback
  const feedbacks: Feedback[] = [
    {
      id: 'FB-1001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@example.com',
      rating: 5,
      comment: 'Great experience with your store! The products arrived quickly and were exactly as described.',
      createdAt: new Date('2023-03-28T14:30:00'),
      source: 'website',
      status: 'new',
      helpful: 12,
      notHelpful: 2,
      orderId: 'ORD-7842'
    },
    {
      id: 'FB-1002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@example.com',
      rating: 2,
      comment: 'The product quality was good but delivery took too long. Would appreciate faster shipping.',
      createdAt: new Date('2023-03-25T09:15:00'),
      source: 'app',
      status: 'reviewed',
      helpful: 5,
      notHelpful: 1,
      orderId: 'ORD-7523'
    },
    {
      id: 'FB-1003',
      customerName: 'Michael Wong',
      customerEmail: 'michael.w@example.com',
      rating: 4,
      comment: 'Good customer service. They helped me resolve an issue with my order quickly.',
      createdAt: new Date('2023-03-22T16:45:00'),
      source: 'email',
      status: 'responded',
      helpful: 8,
      notHelpful: 0,
      orderId: 'ORD-7325'
    },
    {
      id: 'FB-1004',
      customerName: 'Emma Davis',
      customerEmail: 'emma.d@example.com',
      rating: 1,
      comment: 'Extremely disappointed with the product quality. Not as advertised at all.',
      createdAt: new Date('2023-03-20T11:30:00'),
      source: 'social',
      status: 'responded',
      helpful: 3,
      notHelpful: 0,
      orderId: 'ORD-7124'
    },
    {
      id: 'FB-1005',
      customerName: 'Robert Brown',
      customerEmail: 'robert.b@example.com',
      rating: 5,
      comment: 'Excellent products and fast shipping. Will definitely order again!',
      createdAt: new Date('2023-03-18T10:20:00'),
      source: 'website',
      status: 'new',
      helpful: 15,
      notHelpful: 1,
      orderId: 'ORD-7023'
    }
  ];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Filter by search query
    const matchesSearch = 
      feedback.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (feedback.orderId && feedback.orderId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by rating
    const matchesRating = filterRating === 'all' || 
      (filterRating === '5' && feedback.rating === 5) ||
      (filterRating === '4' && feedback.rating === 4) ||
      (filterRating === '3' && feedback.rating === 3) ||
      (filterRating === '2' && feedback.rating === 2) ||
      (filterRating === '1' && feedback.rating === 1);
    
    // Filter by source
    const matchesSource = filterSource === 'all' || feedback.source === filterSource;
    
    return matchesSearch && matchesRating && matchesSource;
  });

  const getRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={cn(
          "w-4 h-4",
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        )}
      />
    ));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'responded':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'website':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'app':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'email':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'social':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className={cn("p-6 rounded-lg", isDark ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>Customer Feedback</h2>
        <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
          Review and respond to customer feedback across all channels
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search feedback..."
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
        
        {/* Rating Filter */}
        <div className="relative">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        {/* Source Filter */}
        <div className="relative">
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="app">Mobile App</option>
            <option value="email">Email</option>
            <option value="social">Social Media</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Feedback Cards */}
      {filteredFeedbacks.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDark ? "text-gray-200" : "text-gray-900")}>No feedback found</h3>
          <p className={cn("mt-2 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <div 
              key={feedback.id}
              className={cn(
                "p-4 rounded-lg border",
                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              )}
            >
              <div className="flex flex-col md:flex-row justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <User className={cn("h-10 w-10 p-2 rounded-full", isDark ? "bg-gray-700" : "bg-gray-100")} />
                  <div>
                    <h3 className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                      {feedback.customerName}
                    </h3>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                      {feedback.customerEmail}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <div className="flex">
                        {getRatingStars(feedback.rating)}
                      </div>
                      <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                        • {formatDate(feedback.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    getStatusBadgeClass(feedback.status)
                  )}>
                    {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                  </span>
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    getSourceBadgeClass(feedback.source)
                  )}>
                    {feedback.source.charAt(0).toUpperCase() + feedback.source.slice(1)}
                  </span>
                  {feedback.orderId && (
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"
                    )}>
                      Order: {feedback.orderId}
                    </span>
                  )}
                </div>
              </div>
              
              <div className={cn(
                "p-3 rounded my-3",
                isDark ? "bg-gray-700" : "bg-gray-50"
              )}>
                <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-800")}>
                  {feedback.comment}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-4">
                  <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span>{feedback.helpful}</span>
                  </button>
                  <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    <span>{feedback.notHelpful}</span>
                  </button>
                </div>
                <div>
                  <button
                    className={cn(
                      "px-3 py-1 text-sm font-medium rounded",
                      isDark 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    )}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerFeedback; 