import type { LucideIcon } from 'lucide-react';
import {
  ShoppingCart,
  Package,
  Users,
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
  Plus
} from 'lucide-react';

interface RevenueData {
  name: string;
  expenses: number;
  revenue: number;
}

interface Stat {
  icon: LucideIcon;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

interface FreeAgent {
  name: string;
  role: string;
  status: string;
  avatar: string;
}

interface InventoryItem {
  name: string;
  status?: string;
  available?: string;
  needed?: string;
  action: string;
}

interface Order {
  id: string;
  customer: string;
  items: number | Array<{ name: string; size: string; price: number }>;
  total: number;
  status: string;
}

interface District {
  name: string;
  progress: number;
  emoji: string;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
  read: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  icon: LucideIcon;
}

interface Weather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: LucideIcon;
}

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

interface Feedback {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

interface SalesData {
  name: string;
  current: number;
  previous: number;
}

interface Resource {
  name: string;
  current: number;
  capacity: number;
  status: string;
}

// Mock data for revenue chart
export const revenueData: RevenueData[] = [
  { name: 'Jan', expenses: 4000, revenue: 2400 },
  { name: 'Feb', expenses: 3000, revenue: 1398 },
  { name: 'Mar', expenses: 2000, revenue: 9800 },
  { name: 'Apr', expenses: 2780, revenue: 3908 },
  { name: 'May', expenses: 1890, revenue: 4800 },
  { name: 'Jun', expenses: 2390, revenue: 3800 },
  { name: 'Jul', expenses: 3490, revenue: 4300 },
  { name: 'Aug', expenses: 2490, revenue: 4300 },
  { name: 'Sep', expenses: 2490, revenue: 4300 },
  { name: 'Oct', expenses: 2490, revenue: 4300 },
  { name: 'Nov', expenses: 2490, revenue: 4300 },
  { name: 'Dec', expenses: 2490, revenue: 4300 }
];

// Mock data for stats
export const stats: Stat[] = [
  { 
    icon: Package,
    title: "Total Orders Received",
    value: "36,569",
    change: "+25%",
    trend: "up"
  },
  {
    icon: ShoppingCart,
    title: "Delivered Goods",
    value: "122,450",
    change: "+30%",
    trend: "up"
  },
  {
    icon: Users,
    title: "Total Customers",
    value: "12,400",
    change: "-12%",
    trend: "down"
  }
];

// Mock data for team
export const team: TeamMember[] = [
  {
    name: "Clodine",
    role: "On Duty Today",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "Zabayo",
    role: "On Duty Today",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    name: "Saruhara",
    role: "Store Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    name: "Kobwa",
    role: "Master Chef",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
  },
  {
    name: "Pablo",
    role: "Chef",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  {
    name: "Hungu",
    role: "Waiter",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop"
  },
  {
    name: "Goodman",
    role: "Waiter",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  }
];

// Mock data for free agents
export const freeAgents: FreeAgent[] = [
  {
    name: "John Smith",
    role: "Waiter",
    status: "Available",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  {
    name: "Sarah Johnson",
    role: "Chef",
    status: "Busy",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "Mike Wilson",
    role: "Delivery",
    status: "Break",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  }
];

// Mock data for inventory
export const inventory: InventoryItem[] = [
  {
    name: "Black olives",
    status: "Not available",
    action: "Order Now"
  },
  {
    name: "Mushroom",
    available: "12kg",
    needed: "15kg",
    action: "Order Now"
  },
  {
    name: "Cornmeal",
    available: "85kg",
    needed: "93kg",
    action: "Order Now"
  }
];

// Mock data for orders
export const orders: Order[] = [
  {
    id: "745632",
    customer: "RWEMA Pascal",
    items: [
      { name: "Home made store", size: "Regular", price: 12.00 },
      { name: "Home made store", size: "Large", price: 35.00 },
      { name: "Home made store", size: "Medium", price: 25.00 }
    ],
    total: 250.00,
    status: "Pending"
  },
  {
    id: "745633",
    customer: "Kanyarwanda Oneal",
    items: 3,
    total: 15.00,
    status: "Pending"
  },
  {
    id: "836252",
    customer: "Michaela",
    items: 5,
    total: 120.00,
    status: "Pending"
  },
  {
    id: "525996",
    customer: "Goodman",
    items: 3,
    total: 82.00,
    status: "Done"
  },
  {
    id: "635892",
    customer: "Helphase",
    items: 2,
    total: 26.00,
    status: "Cancel"
  }
];

// Mock data for districts
export const districts: District[] = [
  {
    name: "Gasabo district",
    progress: 90,
    emoji: "😊"
  },
  {
    name: "Nyarugenge district",
    progress: 75,
    emoji: "😊"
  },
  {
    name: "kicukiro district",
    progress: 60,
    emoji: "😊"
  }
];

// Mock data for notifications
export const notifications: Notification[] = [
  {
    id: 1,
    type: 'order',
    message: 'New order #745634 received',
    time: '2 minutes ago',
    read: false
  },
  {
    id: 2,
    type: 'inventory',
    message: 'Low stock alert: Black olives',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'system',
    message: 'System update completed',
    time: '2 hours ago',
    read: true
  }
];

// Mock data for upcoming events
export const upcomingEvents: Event[] = [
  {
    id: 1,
    title: 'Team Meeting',
    date: '2025-03-26',
    time: '10:00 AM',
    type: 'meeting'
  },
  {
    id: 2,
    title: 'Inventory Check',
    date: '2025-03-27',
    time: '2:00 PM',
    type: 'task'
  },
  {
    id: 3,
    title: 'Monthly Review',
    date: '2025-03-28',
    time: '11:00 AM',
    type: 'meeting'
  }
];

// Mock data for recent activity
export const recentActivity: Activity[] = [
  {
    id: 1,
    user: 'Saruhara',
    action: 'updated inventory',
    time: '5 minutes ago',
    icon: Package
  },
  {
    id: 2,
    user: 'Kobwa',
    action: 'completed order #745632',
    time: '15 minutes ago',
    icon: ShoppingCart
  },
  {
    id: 3,
    user: 'Pablo',
    action: 'added new menu item',
    time: '1 hour ago',
    icon: Plus
  }
];

// Mock data for weather
export const weatherData: Weather = {
  temperature: 24,
  condition: 'Sunny',
  humidity: 65,
  windSpeed: 12,
  icon: Sun
};

// Mock data for tasks
export const tasks: Task[] = [
  {
    id: 1,
    title: 'Review monthly sales report',
    dueDate: '2025-03-26',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Schedule team meeting',
    dueDate: '2025-03-27',
    priority: 'medium',
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'Update inventory system',
    dueDate: '2025-03-28',
    priority: 'low',
    status: 'pending'
  }
];

// Mock data for customer feedback
export const customerFeedback: Feedback[] = [
  {
    id: 1,
    customer: 'Alice Johnson',
    rating: 5,
    comment: 'Excellent service and food quality!',
    date: '2025-03-25'
  },
  {
    id: 2,
    customer: 'Bob Smith',
    rating: 4,
    comment: 'Good experience overall, but waiting time was a bit long.',
    date: '2025-03-24'
  },
  {
    id: 3,
    customer: 'Carol White',
    rating: 5,
    comment: 'Amazing staff and delicious food!',
    date: '2025-03-23'
  }
];

// Mock data for sales comparison
export const salesComparison: SalesData[] = [
  { name: 'Mon', current: 1200, previous: 1000 },
  { name: 'Tue', current: 1500, previous: 1300 },
  { name: 'Wed', current: 1800, previous: 1600 },
  { name: 'Thu', current: 2000, previous: 1800 },
  { name: 'Fri', current: 2500, previous: 2200 },
  { name: 'Sat', current: 3000, previous: 2800 },
  { name: 'Sun', current: 2800, previous: 2500 }
];

// Mock data for resource utilization
export const resourceUtilization: Resource[] = [
  {
    name: 'Kitchen Staff',
    current: 85,
    capacity: 100,
    status: 'optimal'
  },
  {
    name: 'Delivery Vehicles',
    current: 60,
    capacity: 80,
    status: 'good'
  },
  {
    name: 'Storage Space',
    current: 75,
    capacity: 100,
    status: 'optimal'
  }
]; 