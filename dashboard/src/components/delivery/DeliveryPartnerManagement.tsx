import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import {
  Search,
  Plus,
  MapPin,
  Truck,
  User,
  Phone,
  Mail,
  Star,
  Clock,
  Shield,
} from 'lucide-react';

interface DeliveryPartner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  coverageAreas: string[];
  vehicleType: string;
  workingHours: {
    start: string;
    end: string;
  };
  commissionRate: number;
  documents: {
    license: string;
    insurance: string;
    vehicleRegistration: string;
  };
}

interface DeliveryPartnerManagementProps {
  partners: DeliveryPartner[];
  onAddPartner: () => void;
  onEditPartner: (partner: DeliveryPartner) => void;
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

export const DeliveryPartnerManagement: React.FC<DeliveryPartnerManagementProps> = ({
  partners,
  onAddPartner,
  onEditPartner,
  onSearch,
  onFilter,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [selectedVehicleType, setSelectedVehicleType] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onFilter({ ...selectedStatus, status: value });
  };

  const handleVehicleTypeChange = (value: string) => {
    setSelectedVehicleType(value);
    onFilter({ ...selectedVehicleType, vehicleType: value });
  };

  const getStatusBadge = (status: DeliveryPartner['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
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
          Delivery Partners
        </h1>
        <Button onClick={onAddPartner}>
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )} />
          <Input
            type="text"
            placeholder="Search partners..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={handleStatusChange}
        >
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="Status" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="active">Active</Select.Item>
            <Select.Item value="inactive">Inactive</Select.Item>
            <Select.Item value="suspended">Suspended</Select.Item>
          </Select.Content>
        </Select>
        <Select
          value={selectedVehicleType}
          onValueChange={handleVehicleTypeChange}
        >
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="Vehicle Type" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="bike">Bike</Select.Item>
            <Select.Item value="scooter">Scooter</Select.Item>
            <Select.Item value="car">Car</Select.Item>
            <Select.Item value="van">Van</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
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
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{partner.name}</h3>
                  <p className="text-sm text-gray-500">{partner.vehicleType}</p>
                </div>
              </div>
              {getStatusBadge(partner.status)}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{partner.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{partner.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{partner.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{partner.rating} Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{partner.workingHours.start} - {partner.workingHours.end}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Coverage Areas: {partner.coverageAreas.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Commission: {partner.commissionRate}%</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => onEditPartner(partner)}
              >
                Edit Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 