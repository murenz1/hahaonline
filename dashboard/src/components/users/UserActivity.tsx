import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Activity,
  Clock,
  LogOut,
  MapPin,
  Monitor,
  Search,
  Shield,
  User,
  XCircle,
} from 'lucide-react';

interface Session {
  id: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string | null;
  duration: string;
  ipAddress: string;
  device: string;
  location: string;
  status: 'active' | 'expired' | 'terminated';
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

interface UserActivityProps {
  sessions: Session[];
  activityLogs: ActivityLog[];
  onTerminateSession: (sessionId: string) => void;
  onFilterChange: (filter: string) => void;
  onSearch: (query: string) => void;
}

export const UserActivity: React.FC<UserActivityProps> = ({
  sessions,
  activityLogs,
  onTerminateSession,
  onFilterChange,
  onSearch,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilterChange(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          User Activity
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select
            value={selectedFilter}
            onValueChange={handleFilterChange}
          >
            <Select.Trigger>
              <Activity className="w-4 h-4 mr-2" />
              <Select.Value placeholder="Filter by status" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All Activity</Select.Item>
              <Select.Item value="active">Active Sessions</Select.Item>
              <Select.Item value="expired">Expired Sessions</Select.Item>
              <Select.Item value="terminated">Terminated Sessions</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      {/* Active Sessions */}
      <div className={cn(
        "rounded-lg border",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
          <div className="space-y-4">
            {sessions.filter(session => session.status === 'active').map((session) => (
              <div
                key={session.id}
                className={cn(
                  "p-4 rounded-lg border",
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">{session.userName}</div>
                      <div className="text-sm text-gray-500">
                        Started {session.startTime}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTerminateSession(session.id)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Terminate
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{session.device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Duration: {session.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className={cn(
        "rounded-lg border",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "border-b",
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                )}>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activityLogs.map((log) => (
                  <tr key={log.id} className={cn(
                    "hover:bg-gray-50",
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  )}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">{log.userName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{log.action}</td>
                    <td className="px-6 py-4 text-sm">{log.details}</td>
                    <td className="px-6 py-4 text-sm">{log.ipAddress}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      )}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}; 