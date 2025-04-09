import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ShoppingCart,
  Package,
  Users,
  ChevronRight,
  Bell,
  Search,
  Plus,
  ChevronDown,
  Download,
  DollarSign,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  AlertCircle,
  Sun,
  Cloud,
  CheckCircle,
  Star,
  TrendingUp,
  Cpu,
  Battery,
  Wifi,
  User,
  X,
  TrendingDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Import mock data
import { 
  revenueData, 
  stats, 
  team, 
  freeAgents, 
  inventory, 
  orders, 
  districts,
  notifications,
  upcomingEvents,
  recentActivity,
  weatherData,
  tasks,
  customerFeedback,
  salesComparison,
  resourceUtilization
} from '../data/mockData';

interface DashboardProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
}

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

const Dashboard: React.FC<DashboardProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
  showNotifications,
  setShowNotifications,
  showCalendar,
  setShowCalendar
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  const stats = [
    {
      title: 'Total order Recieved',
      value: '36,569',
      trend: '+25%',
      isPositive: true,
      icon: Package
    },
    {
      title: 'Delivered Goods',
      value: '1,22,450',
      trend: '+30%',
      isPositive: true,
      icon: Package
    },
    {
      title: 'Total Customers',
      value: '12,400',
      trend: '-12%',
      isPositive: false,
      icon: Users
    }
  ];

  const teamMembers = [
    { name: 'Clodine', role: 'On Duty Today', avatar: '/avatars/1.jpg' },
    { name: 'Zabayo', role: 'On Duty Today', avatar: '/avatars/2.jpg' },
  ];

  const myTeam = [
    { name: 'Saruhara', role: 'Store Manager', avatar: '/avatars/3.jpg' },
    { name: 'kobwa', role: 'Master chef', avatar: '/avatars/4.jpg' },
    { name: 'Pablo', role: 'Chef', avatar: '/avatars/5.jpg' },
    { name: 'hungu', role: 'Waiter', avatar: '/avatars/6.jpg' },
    { name: 'Goodman', role: 'Waiter', avatar: '/avatars/7.jpg' },
  ];

  const pieData = [
    { name: 'In Stock', value: 90 },
    { name: 'Out of Stock', value: 10 },
  ];

  const COLORS = ['#4ade80', '#f87171'];

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Admin!</h1>
          <p className="text-gray-500">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-full"
          >
            <Bell size={20} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Calendar size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <ChevronDown size={20} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon size={24} className="text-gray-600" />
              </div>
              <div className="flex items-center space-x-1">
                <span className={`text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
                {stat.isPositive ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
              </div>
            </div>
            <h3 className="text-sm text-gray-500 mb-1">{stat.title}</h3>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border rounded-lg px-3 py-1"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Team Members</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Weather</h2>
              <weatherData.icon className="text-yellow-500" size={24} />
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-gray-500">{weatherData.condition}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="font-medium">{weatherData.humidity}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wind Speed</p>
                  <p className="font-medium">{weatherData.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button className="text-blue-500 hover:text-blue-600">
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border ${
                    selectedTask?.id === task.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className={`text-sm ${
                      task.priority === 'high' ? 'text-red-500' :
                      task.priority === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Due: {task.dueDate}</p>
                  <div className="flex items-center mt-2">
                    {task.status === 'pending' && <Clock className="text-yellow-500" size={16} />}
                    {task.status === 'in-progress' && <AlertCircle className="text-blue-500" size={16} />}
                    {task.status === 'completed' && <CheckCircle className="text-green-500" size={16} />}
                    <span className="text-sm text-gray-500 ml-1">{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Feedback */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Customer Feedback</h2>
            <div className="space-y-4">
              {customerFeedback.map((feedback) => (
                <div key={feedback.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{feedback.customer}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`${
                            i < feedback.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                          size={16}
                          fill={i < feedback.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{feedback.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">{feedback.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team and Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Free Agents */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 bg-amber-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Free Agents</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View all <ChevronRight size={16} className="inline" />
              </button>
            </div>
            <div className="text-sm text-gray-500">25 Mar, 2025</div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-500">On Duty Today</h3>
              <select className="text-sm border rounded-md px-2 py-1">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="flex -space-x-2 mb-4">
              {teamMembers.map((member, index) => (
                <img
                  key={index}
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <h3 className="text-sm text-gray-500 mb-2">My Team</h3>
            <div className="space-y-3">
              {myTeam.map((member, index) => (
                <div key={index} className="flex items-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Inventory</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View all <ChevronRight size={16} className="inline" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="text-sm text-red-500 mb-4">04 items Low in Stock</div>
            <div className="relative w-48 h-48 mx-auto mb-4">
              <PieChart width={192} height={192}>
                <Pie
                  data={pieData}
                  cx={96}
                  cy={96}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">90%</span>
              </div>
            </div>
            <div className="space-y-4">
              {inventory.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.available && `Available: ${item.available}`}
                      {item.needed && ` Need to order: ${item.needed}`}
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Consumers */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Most consumers</h2>
              <select className="text-sm border rounded-md px-2 py-1">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {districts.map((district, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{district.name}</span>
                    <span className="text-sm">😊</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${district.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 