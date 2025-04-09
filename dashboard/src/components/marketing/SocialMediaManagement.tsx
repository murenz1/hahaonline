import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Calendar,
  Image,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertTriangle,
  Globe,
  BarChart2,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
  Eye
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface SocialMediaPost {
  id: string;
  content: string;
  mediaUrls?: string[];
  platforms: string[];
  scheduledFor: Date;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  publishedAt?: Date;
  campaign?: string;
  stats?: {
    likes: number;
    shares: number;
    comments: number;
    clicks?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface SocialMediaManagementProps {
  initialPosts?: SocialMediaPost[];
  onCreatePost?: (post: Omit<SocialMediaPost, 'id' | 'createdAt' | 'updatedAt' | 'stats'>) => Promise<void>;
  onUpdatePost?: (id: string, post: Partial<SocialMediaPost>) => Promise<void>;
  onDeletePost?: (id: string) => Promise<void>;
  onPublishNow?: (id: string) => Promise<void>;
  onReschedule?: (id: string, scheduledFor: Date) => Promise<void>;
}

const SocialMediaManagement: React.FC<SocialMediaManagementProps> = ({
  initialPosts = [],
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onPublishNow,
  onReschedule
}) => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<SocialMediaPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<SocialMediaPost> | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    if (initialPosts.length === 0) {
      fetchPosts();
    }
  }, [initialPosts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/marketing/social/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch social media posts:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.campaign && post.campaign.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || post.status === statusFilter;
    const matchesPlatform = platformFilter === 'ALL' || post.platforms.includes(platformFilter);
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const handleCreatePost = async (post: Omit<SocialMediaPost, 'id' | 'createdAt' | 'updatedAt' | 'stats'>) => {
    if (onCreatePost) {
      await onCreatePost(post);
      setIsCreateModalOpen(false);
      fetchPosts();
    }
  };

  const handleUpdatePost = async (id: string, post: Partial<SocialMediaPost>) => {
    if (onUpdatePost) {
      await onUpdatePost(id, post);
      setCurrentPost(null);
      fetchPosts();
    }
  };

  const handleDeletePost = async (id: string) => {
    if (onDeletePost) {
      await onDeletePost(id);
      fetchPosts();
    }
  };

  const handlePublishNow = async (id: string) => {
    if (onPublishNow) {
      await onPublishNow(id);
      fetchPosts();
    }
  };

  const handleReschedule = async (id: string, scheduledFor: Date) => {
    if (onReschedule) {
      await onReschedule(id, scheduledFor);
      fetchPosts();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'SCHEDULED':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'DRAFT':
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
      case 'FAILED':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle className="w-4 h-4" />;
      case 'SCHEDULED':
        return <Clock className="w-4 h-4" />;
      case 'DRAFT':
        return <MessageSquare className="w-4 h-4" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string, className = "w-5 h-5") => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className={className} />;
      case 'twitter':
        return <Twitter className={className} />;
      case 'instagram':
        return <Instagram className={className} />;
      case 'linkedin':
        return <Linkedin className={className} />;
      default:
        return <Globe className={className} />;
    }
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className={`rounded-lg border overflow-hidden ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className={`px-6 py-4 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {post.platforms.map((platform, index) => (
                    <span key={index} className="flex-shrink-0">
                      {getPlatformIcon(platform)}
                    </span>
                  ))}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)} inline-flex items-center`}>
                  {getStatusIcon(post.status)}
                  <span className="ml-1">{post.status}</span>
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {/* View post details */}}
                  className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => setCurrentPost(post)}
                  className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className={`mt-3 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {post.content}
            </p>
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mt-3 flex -mx-1 overflow-x-auto">
                {post.mediaUrls.map((url, index) => (
                  <div key={index} className="px-1 flex-shrink-0">
                    <div 
                      className="w-20 h-20 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
                    >
                      <img src={url} alt={`Media ${index + 1}`} className="object-cover w-full h-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {post.status === 'PUBLISHED' 
                  ? `Published ${formatDate(new Date(post.publishedAt || post.createdAt))}` 
                  : `Scheduled for ${formatDate(new Date(post.scheduledFor))}`}
              </div>
              {post.status === 'PUBLISHED' && post.stats && (
                <div className="flex items-center space-x-3 text-sm">
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1 text-blue-500" />
                    {post.stats.comments}
                  </span>
                  <span className="flex items-center">
                    <Share2 className="w-4 h-4 mr-1 text-green-500" />
                    {post.stats.shares}
                  </span>
                  <span className="flex items-center">
                    <BarChart2 className="w-4 h-4 mr-1 text-purple-500" />
                    {post.stats.likes}
                  </span>
                </div>
              )}
            </div>
          </div>
          {post.status === 'SCHEDULED' && (
            <div className={`px-6 py-3 border-t flex justify-end ${
              theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
            }`}>
              <button
                onClick={() => handlePublishNow(post.id)}
                className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 mr-2"
              >
                Publish Now
              </button>
              <button
                onClick={() => {/* Open reschedule dialog */}}
                className={`px-3 py-1 text-sm rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Reschedule
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCalendarView = () => (
    <div className={`rounded-lg border overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">April 2023</h3>
        </div>
        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={i} className="text-center text-sm font-medium py-2">
              {day}
            </div>
          ))}
          {/* Calendar days would go here */}
          <div className="text-center p-2 text-gray-400">26</div>
          <div className="text-center p-2 text-gray-400">27</div>
          <div className="text-center p-2 text-gray-400">28</div>
          <div className="text-center p-2 text-gray-400">29</div>
          <div className="text-center p-2 text-gray-400">30</div>
          <div className="text-center p-2 text-gray-400">31</div>
          <div className="text-center p-2">1</div>
          {/* Days with posts would have indicators */}
          <div className="text-center p-2">2</div>
          <div className="text-center p-2">3</div>
          <div className="text-center p-2 relative">
            4
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            </div>
          </div>
          <div className="text-center p-2">5</div>
          <div className="text-center p-2">6</div>
          <div className="text-center p-2">7</div>
          <div className="text-center p-2">8</div>
          {/* And so on... */}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Social Media Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Schedule and manage posts across social media platforms
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-3 md:mt-0 flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 w-full rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        <div>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className={`px-4 py-2 w-full rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="ALL">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        <div className={`inline-flex rounded-md border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm rounded-l-md ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 text-sm rounded-r-md ${
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className={`p-8 text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No posts found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : viewMode === 'list' ? renderListView() : renderCalendarView()}

      {/* Create/Edit Post Modal would go here */}
      {(isCreateModalOpen || currentPost) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg max-w-3xl w-full mx-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className="text-lg font-medium mb-4">
              {currentPost ? 'Edit Post' : 'Create New Post'}
            </h3>
            {/* Post form would go here */}
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCurrentPost(null);
                }}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentPost ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaManagement; 