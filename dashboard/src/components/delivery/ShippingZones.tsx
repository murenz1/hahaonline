import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import {
  Map,
  Plus,
  Settings,
  DollarSign,
  Package,
  Clock,
  Truck,
  Edit,
  Trash,
} from 'lucide-react';

interface ShippingZone {
  id: string;
  name: string;
  description: string;
  countries: string[];
  states?: string[];
  cities?: string[];
  postalCodes?: string[];
  rates: {
    id: string;
    name: string;
    minWeight: number;
    maxWeight: number;
    minOrderValue: number;
    maxOrderValue: number;
    basePrice: number;
    perKgPrice: number;
    estimatedDeliveryTime: string;
    vehicleType: string;
  }[];
  status: 'active' | 'inactive';
}

interface ShippingZonesProps {
  zones: ShippingZone[];
  onAddZone: () => void;
  onEditZone: (zone: ShippingZone) => void;
  onDeleteZone: (zone: ShippingZone) => void;
  onAddRate: (zone: ShippingZone) => void;
  onEditRate: (zone: ShippingZone, rate: ShippingZone['rates'][0]) => void;
  onDeleteRate: (zone: ShippingZone, rate: ShippingZone['rates'][0]) => void;
}

export const ShippingZones: React.FC<ShippingZonesProps> = ({
  zones,
  onAddZone,
  onEditZone,
  onDeleteZone,
  onAddRate,
  onEditRate,
  onDeleteRate,
}) => {
  const { theme } = useTheme();

  const getStatusBadge = (status: ShippingZone['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
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
          Shipping Zones
        </h1>
        <Button onClick={onAddZone}>
          <Plus className="w-4 h-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div
            key={zone.id}
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
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{zone.name}</h3>
                  <p className="text-sm text-gray-500">{zone.description}</p>
                </div>
              </div>
              {getStatusBadge(zone.status)}
            </div>

            {/* Coverage */}
            <div className="space-y-2">
              <h4 className="font-medium">Coverage</h4>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Countries:</span> {zone.countries.join(', ')}
                </div>
                {zone.states && (
                  <div className="text-sm">
                    <span className="font-medium">States:</span> {zone.states.join(', ')}
                  </div>
                )}
                {zone.cities && (
                  <div className="text-sm">
                    <span className="font-medium">Cities:</span> {zone.cities.join(', ')}
                  </div>
                )}
                {zone.postalCodes && (
                  <div className="text-sm">
                    <span className="font-medium">Postal Codes:</span> {zone.postalCodes.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Rates */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Shipping Rates</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddRate(zone)}
                >
                  Add Rate
                </Button>
              </div>
              <div className="space-y-2">
                {zone.rates.map((rate) => (
                  <div
                    key={rate.id}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>{rate.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditRate(zone, rate)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteRate(zone, rate)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Weight: {rate.minWeight}kg - {rate.maxWeight}kg
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Order Value: ${rate.minOrderValue} - ${rate.maxOrderValue}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Base Price: ${rate.basePrice} + ${rate.perKgPrice}/kg
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          ETA: {rate.estimatedDeliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onEditZone(zone)}
              >
                Edit Zone
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDeleteZone(zone)}
              >
                Delete Zone
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 