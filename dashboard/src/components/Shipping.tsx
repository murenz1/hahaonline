import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ShippingProps {}

interface ShipmentStatus {
  id: string;
  name: string;
  color: string;
}

interface Shipment {
  id: string;
  orderNumber: string;
  customer: string;
  destination: string;
  carrier: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery: Date;
  createdAt: Date;
  priority: 'high' | 'medium' | 'low';
}

const Shipping: React.FC<ShippingProps> = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created');

  // Shipping statuses
  const statuses: ShipmentStatus[] = [
    { id: 'pending', name: 'Pending', color: 'yellow' },
    { id: 'in_transit', name: 'In Transit', color: 'blue' },
    { id: 'delivered', name: 'Delivered', color: 'green' },
    { id: 'failed', name: 'Failed', color: 'red' }
  ];

  // Mock shipments data
  const shipments: Shipment[] = [
    {
      id: 'SHP-001',
      orderNumber: 'ORD-2024-001',
      customer: 'John Doe',
      destination: 'New York, USA',
      carrier: 'FedEx',
      trackingNumber: 'FDX123456789',
      status: 'in_transit',
      estimatedDelivery: new Date('2024-03-20'),
      createdAt: new Date('2024-03-15'),
      priority: 'high'
    },
    {
      id: 'SHP-002',
      orderNumber: 'ORD-2024-002',
      customer: 'Jane Smith',
      destination: 'Los Angeles, USA',
      carrier: 'UPS',
      trackingNumber: 'UPS987654321',
      status: 'pending',
      estimatedDelivery: new Date('2024-03-22'),
      createdAt: new Date('2024-03-15'),
      priority: 'medium'
    },
    {
      id: 'SHP-003',
      orderNumber: 'ORD-2024-003',
      customer: 'Robert Johnson',
      destination: 'Chicago, USA',
      carrier: 'DHL',
      trackingNumber: 'DHL456789123',
      status: 'delivered',
      estimatedDelivery: new Date('2024-03-18'),
      createdAt: new Date('2024-03-14'),
      priority: 'low'
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || shipment.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Shipping</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage shipments and track deliveries
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Shipments', value: '156', icon: Package },
          { label: 'In Transit', value: '32', icon: Truck },
          { label: 'Delivered Today', value: '18', icon: CheckCircle },
          { label: 'Delayed', value: '3', icon: AlertTriangle }
        ].map((stat, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg border",
              isDarkMode 
                ? "bg-gray-700 border-gray-600" 
                : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center">
              <stat.icon className={cn(
                "w-5 h-5 mr-3",
                index === 0 ? "text-blue-500" :
                index === 1 ? "text-green-500" :
                index === 2 ? "text-purple-500" :
                "text-yellow-500"
              )} />
              <div>
                <p className={cn("text-sm font-medium", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  {stat.label}
                </p>
                <p className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          />
        </div>
        
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="relative">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <button
          className={cn(
            "flex items-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Shipment
        </button>

        <div className="flex items-center space-x-2">
          <button
            className={cn(
              "px-4 py-2 rounded-lg font-medium",
              isDarkMode 
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Shipments Table */}
      {filteredShipments.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDarkMode ? "bg-gray-700" : "bg-gray-100")}>
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDarkMode ? "text-gray-200" : "text-gray-900")}>No shipments found</h3>
          <p className={cn("mt-2 text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={cn("min-w-full divide-y", isDarkMode ? "divide-gray-700" : "divide-gray-200")}>
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Shipment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Delivery</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDarkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white")}>
              {filteredShipments.map((shipment) => (
                <tr 
                  key={shipment.id}
                  className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                          {shipment.orderNumber}
                        </div>
                        <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          {shipment.trackingNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                        {shipment.customer}
                      </div>
                      <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        {shipment.destination}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getStatusBadgeClass(shipment.status)
                    )}>
                      {shipment.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getPriorityBadgeClass(shipment.priority)
                    )}>
                      {shipment.priority.charAt(0).toUpperCase() + shipment.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                      {shipment.estimatedDelivery.toLocaleDateString()}
                    </div>
                    <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      {shipment.carrier}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mx-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Shipping; 