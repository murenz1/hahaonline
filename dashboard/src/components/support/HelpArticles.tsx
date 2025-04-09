import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatters';
import {
  Search,
  FileText,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Eye,
  BookOpen,
  FileQuestion,
  AlertTriangle
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  status: 'published' | 'draft' | 'archived';
}

const HelpArticles: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Mock data for articles
  const articles: Article[] = [
    {
      id: 'ART-1001',
      title: 'How to Track Your Order',
      content: `<h2>Tracking Your Order</h2>
      <p>Once your order has been shipped, you will receive a confirmation email with tracking information. To track your order:</p>
      <ol>
        <li>Log in to your account</li>
        <li>Go to "My Orders" section</li>
        <li>Find your order and click "Track"</li>
        <li>You will be redirected to the carrier's website with your tracking information</li>
      </ol>
      <p>If you don't see tracking information, your order may not have shipped yet. Please allow 1-2 business days for processing.</p>`,
      category: 'Orders',
      tags: ['tracking', 'shipping', 'delivery'],
      author: 'Support Team',
      createdAt: new Date('2023-01-15T09:30:00'),
      updatedAt: new Date('2023-03-20T14:45:00'),
      views: 1542,
      status: 'published'
    },
    {
      id: 'ART-1002',
      title: 'Returns and Refunds Policy',
      content: `<h2>Our Returns Policy</h2>
      <p>We accept returns within 30 days of purchase. Items must be unused and in original packaging.</p>
      <h3>How to Return an Item</h3>
      <ol>
        <li>Log in to your account</li>
        <li>Go to "My Orders" and find the order</li>
        <li>Click "Return Items" and follow the instructions</li>
        <li>Print the return label and attach it to your package</li>
        <li>Drop off the package at the specified carrier location</li>
      </ol>
      <h3>Refund Timeline</h3>
      <p>Once we receive your return, refunds typically process within 5-7 business days, depending on your payment method.</p>`,
      category: 'Returns',
      tags: ['returns', 'refunds', 'policy'],
      author: 'Legal Team',
      createdAt: new Date('2023-02-10T11:20:00'),
      updatedAt: new Date('2023-03-15T09:30:00'),
      views: 2357,
      status: 'published'
    },
    {
      id: 'ART-1003',
      title: 'Payment Methods Accepted',
      content: `<h2>Payment Options</h2>
      <p>We accept the following payment methods:</p>
      <ul>
        <li>Credit Cards (Visa, MasterCard, American Express, Discover)</li>
        <li>PayPal</li>
        <li>Apple Pay</li>
        <li>Google Pay</li>
        <li>Shop Pay</li>
      </ul>
      <h3>Payment Security</h3>
      <p>All transactions are encrypted and secure. We do not store your full credit card details on our servers.</p>`,
      category: 'Payments',
      tags: ['payments', 'credit card', 'security'],
      author: 'Finance Team',
      createdAt: new Date('2023-02-22T15:40:00'),
      updatedAt: new Date('2023-02-22T15:40:00'),
      views: 1876,
      status: 'published'
    },
    {
      id: 'ART-1004',
      title: 'Shipping Zones and Delivery Times',
      content: `<h2>Shipping Information</h2>
      <p>Shipping times vary based on your location and selected shipping method.</p>
      <h3>Domestic Shipping</h3>
      <ul>
        <li>Standard: 3-5 business days</li>
        <li>Express: 1-2 business days</li>
      </ul>
      <h3>International Shipping</h3>
      <ul>
        <li>Standard: 7-14 business days</li>
        <li>Express: 3-5 business days</li>
      </ul>
      <p>Please note that customs clearance may cause additional delays for international shipments.</p>`,
      category: 'Shipping',
      tags: ['shipping', 'delivery', 'international'],
      author: 'Logistics Team',
      createdAt: new Date('2023-03-05T12:15:00'),
      updatedAt: new Date('2023-03-18T10:20:00'),
      views: 1243,
      status: 'draft'
    },
    {
      id: 'ART-1005',
      title: 'Account Creation and Management',
      content: `<h2>Managing Your Account</h2>
      <p>Learn how to create and manage your account settings.</p>
      <h3>Creating an Account</h3>
      <ol>
        <li>Click "Sign Up" in the top right corner</li>
        <li>Enter your email and create a password</li>
        <li>Verify your email address</li>
        <li>Complete your profile information</li>
      </ol>
      <h3>Updating Account Information</h3>
      <ol>
        <li>Log in to your account</li>
        <li>Click on your name in the top right</li>
        <li>Select "Account Settings"</li>
        <li>Update your information and save changes</li>
      </ol>`,
      category: 'Account',
      tags: ['account', 'profile', 'settings'],
      author: 'Support Team',
      createdAt: new Date('2023-03-10T09:45:00'),
      updatedAt: new Date('2023-03-10T09:45:00'),
      views: 967,
      status: 'published'
    }
  ];

  const filteredArticles = articles.filter(article => {
    // Filter by search query
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    
    // Filter by status
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Orders':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Returns':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Payments':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Shipping':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'Account':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className={cn("p-6 rounded-lg", isDark ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>Help Articles</h2>
          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
            Manage knowledge base articles and documentation
          </p>
        </div>
        <button
          className="mt-3 md:mt-0 flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search articles..."
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
        
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDark 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Categories</option>
            <option value="Orders">Orders</option>
            <option value="Returns">Returns</option>
            <option value="Payments">Payments</option>
            <option value="Shipping">Shipping</option>
            <option value="Account">Account</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Articles Table */}
      {filteredArticles.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDark ? "bg-gray-700" : "bg-gray-100")}>
          <FileQuestion className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDark ? "text-gray-200" : "text-gray-900")}>No articles found</h3>
          <p className={cn("mt-2 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={cn("min-w-full divide-y", isDark ? "divide-gray-700" : "divide-gray-200")}>
            <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Article</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Views</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white")}>
              {filteredArticles.map((article) => (
                <tr 
                  key={article.id} 
                  className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start">
                      <FileText className={cn("flex-shrink-0 h-5 w-5 mt-0.5", isDark ? "text-gray-400" : "text-gray-500")} />
                      <div className="ml-3">
                        <div className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{article.title}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {article.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className={cn(
                                "px-2 py-0.5 text-xs rounded-full",
                                isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      getCategoryBadgeClass(article.category)
                    )}>
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      getStatusBadgeClass(article.status)
                    )}>
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {article.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(article.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-1">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mx-1">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mx-1">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Article Preview Modal (would be implemented here) */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={cn("rounded-lg shadow-lg max-w-4xl w-full mx-4 overflow-hidden", isDark ? "bg-gray-800" : "bg-white")}>
            {/* Modal content would go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpArticles; 