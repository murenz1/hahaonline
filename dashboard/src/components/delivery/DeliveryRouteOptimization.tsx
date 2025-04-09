import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import {
  Map,
  Navigation,
  Package,
  Clock,
  Truck,
  Route,
  Settings,
  Download,
  Upload,
} from 'lucide-react';

interface DeliveryRoute {
  id: string;
  name: string;
  deliveryPartner: {
    id: string;
    name: string;
    vehicleType: string;
  };
  orders: {
    id: string;
    orderNumber: string;
    customer: {
      name: string;
      address: string;
    };
    priority: 'high' | 'medium' | 'low';
    estimatedDeliveryTime: string;
  }[];
  totalDistance: number;
  estimatedTime: string;
  status: 'planned' | 'in_progress' | 'completed';
  optimizationScore: number;
  waypoints: {
    order: number;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    orderId: string;
  }[];
}

interface DeliveryRouteOptimizationProps {
  routes: DeliveryRoute[];
  onOptimize: (route: DeliveryRoute) => void;
  onStartRoute: (route: DeliveryRoute) => void;
  onCompleteRoute: (route: DeliveryRoute) => void;
  onExport: (format: 'csv' | 'pdf') => void;
  onImport: (file: File) => void;
}

export const DeliveryRouteOptimization: React.FC<DeliveryRouteOptimizationProps> = ({
  routes,
  onOptimize,
  onStartRoute,
  onCompleteRoute,
  onExport,
  onImport,
}) => {
  const { theme } = useTheme();
  const [selectedRoute, setSelectedRoute] = React.useState<DeliveryRoute | null>(null);

  const getStatusBadge = (status: DeliveryRoute['status']) => {
    switch (status) {
      case 'planned':
        return <Badge variant="secondary">Planned</Badge>;
      case 'in_progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
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
          Route Optimization
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export Routes
          </Button>
          <Button variant="outline" onClick={() => onImport(new File([], 'routes.csv'))}>
            <Upload className="w-4 h-4 mr-2" />
            Import Routes
          </Button>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div
            key={route.id}
            className={cn(
              "rounded-lg border p-6 space-y-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}>
                  <Route className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{route.name}</h3>
                  <p className="text-sm text-gray-500">
                    {route.deliveryPartner.name} - {route.deliveryPartner.vehicleType}
                  </p>
                </div>
              </div>
              {getStatusBadge(route.status)}
            </div>

            {/* Route Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-500" />
                <span>{route.totalDistance} km</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{route.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <span>Optimization Score: {route.optimizationScore}%</span>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-2">
              <h4 className="font-medium">Orders ({route.orders.length})</h4>
              <div className="space-y-2">
                {route.orders.map((order) => (
                  <div
                    key={order.id}
                    className={cn(
                      "p-2 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>#{order.orderNumber}</span>
                      </div>
                      {getPriorityBadge(order.priority)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.customer.name} - {order.customer.address}
                    </div>
                    <div className="text-sm text-gray-500">
                      ETA: {order.estimatedDeliveryTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {route.status === 'planned' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onOptimize(route)}
                  >
                    Optimize
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onStartRoute(route)}
                  >
                    Start Route
                  </Button>
                </>
              )}
              {route.status === 'in_progress' && (
                <Button
                  variant="outline"
                  onClick={() => onCompleteRoute(route)}
                >
                  Complete Route
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 