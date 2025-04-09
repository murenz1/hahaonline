import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Star,
  MessageSquare,
  Download,
  TrendingUp,
  Filter,
  Search,
  Reply,
  Flag,
  Shield,
} from 'lucide-react';

interface AppStoreReview {
  id: string;
  platform: 'ios' | 'android';
  rating: number;
  title: string;
  content: string;
  author: string;
  date: string;
  version: string;
  device: string;
  country: string;
  status: 'new' | 'replied' | 'flagged' | 'hidden';
  response?: {
    content: string;
    date: string;
  };
}

interface AppStoreListing {
  id: string;
  platform: 'ios' | 'android';
  title: string;
  description: string;
  keywords: string[];
  screenshots: string[];
  icon: string;
  version: string;
  rating: {
    average: number;
    count: number;
    distribution: {
      '1': number;
      '2': number;
      '3': number;
      '4': number;
      '5': number;
    };
  };
  downloads: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  status: 'live' | 'pending' | 'rejected' | 'inReview';
  lastUpdated: string;
}

interface AppStoreManagementProps {
  listings: AppStoreListing[];
  reviews: AppStoreReview[];
  onUpdateListing: (id: string, listing: Partial<AppStoreListing>) => void;
  onReplyToReview: (id: string, response: string) => void;
  onFlagReview: (id: string, reason: string) => void;
  onHideReview: (id: string) => void;
  onExportReviews: (format: 'csv' | 'pdf') => void;
}

export const AppStoreManagement: React.FC<AppStoreManagementProps> = ({
  listings,
  reviews,
  onUpdateListing,
  onReplyToReview,
  onFlagReview,
  onHideReview,
  onExportReviews,
}) => {
  const { theme } = useTheme();
  const [selectedPlatform, setSelectedPlatform] = React.useState<'ios' | 'android'>('ios');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const filteredReviews = reviews.filter(review => {
    const matchesPlatform = review.platform === selectedPlatform;
    const matchesSearch = searchQuery === '' || 
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = selectedRating === null || review.rating === selectedRating;
    return matchesPlatform && matchesSearch && matchesRating;
  });

  const getStatusColor = (status: AppStoreListing['status']) => {
    switch (status) {
      case 'live':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'rejected':
        return 'text-red-500';
      case 'inReview':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getReviewStatusColor = (status: AppStoreReview['status']) => {
    switch (status) {
      case 'new':
        return 'text-blue-500';
      case 'replied':
        return 'text-green-500';
      case 'flagged':
        return 'text-red-500';
      case 'hidden':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          App Store Management
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onExportReviews('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export Reviews
          </Button>
        </div>
      </div>

      {/* Listings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className={cn(
              "rounded-lg border p-6",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{listing.title}</h2>
                <div className={cn(
                  "flex items-center gap-1 text-sm",
                  getStatusColor(listing.status)
                )}>
                  {listing.status.toUpperCase()}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Version {listing.version}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Rating</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.floor(listing.rating.average)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({listing.rating.count.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Downloads</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-lg font-bold">{listing.downloads.total.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Daily</div>
                    <div className="text-lg font-bold">{listing.downloads.daily.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">Reviews</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search reviews..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedPlatform}
              onValueChange={(value) => setSelectedPlatform(value as 'ios' | 'android')}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="ios">iOS</Select.Item>
                <Select.Item value="android">Android</Select.Item>
              </Select.Content>
            </Select>
            <Select
              value={selectedRating?.toString() || ''}
              onValueChange={(value) => setSelectedRating(value ? parseInt(value) : null)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Filter by rating" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="">All Ratings</Select.Item>
                <Select.Item value="5">5 Stars</Select.Item>
                <Select.Item value="4">4 Stars</Select.Item>
                <Select.Item value="3">3 Stars</Select.Item>
                <Select.Item value="2">2 Stars</Select.Item>
                <Select.Item value="1">1 Star</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={cn(
                "border rounded-lg p-4",
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className={cn(
                    "text-sm",
                    getReviewStatusColor(review.status)
                  )}>
                    {review.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {review.date}
                </div>
              </div>

              <div className="mb-2">
                <h3 className="font-medium">{review.title}</h3>
                <p className="text-sm text-gray-500">{review.content}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{review.author}</span>
                <span>Version {review.version}</span>
                <span>{review.device}</span>
                <span>{review.country}</span>
              </div>

              {review.response && (
                <div className={cn(
                  "border-l-4 pl-4 py-2 mb-4",
                  theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <Reply className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Your Response</span>
                    <span className="text-sm text-gray-500">{review.response.date}</span>
                  </div>
                  <p className="text-sm text-gray-500">{review.response.content}</p>
                </div>
              )}

              <div className="flex gap-2">
                {!review.response && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReplyToReview(review.id, '')}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFlagReview(review.id, '')}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Flag
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onHideReview(review.id)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Hide
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 