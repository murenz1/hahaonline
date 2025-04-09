import React, { useState } from 'react';
import { inventory } from '../data/mockData';
import {
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
  Edit,
  Trash
} from 'lucide-react';

interface InventoryProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ searchTerm, setSearchTerm }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusIcon = (status?: string) => {
    if (!status) return <CheckCircle className="text-green-500" size={20} />;
    switch (status.toLowerCase()) {
      case 'not available':
        return <XCircle className="text-red-500" size={20} />;
      case 'low stock':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <CheckCircle className="text-green-500" size={20} />;
    }
  };

  const getStatusClass = (status?: string) => {
    if (!status) return 'bg-green-100 text-green-800';
    switch (status.toLowerCase()) {
      case 'not available':
        return 'bg-red-100 text-red-800';
      case 'low stock':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (item.status?.toLowerCase() === statusFilter.toLowerCase()) ||
      (!item.status && statusFilter === 'available');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-gray-500">Manage your inventory items and stock levels</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} className="mr-2" />
          Add Item
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="not available">Not Available</option>
          <option value="low stock">Low Stock</option>
        </select>
        <button className="flex items-center px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">
          <RefreshCw size={20} className="mr-2" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Needed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="text-gray-500" size={20} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.status && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.available || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.needed || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {item.action}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <button className="text-gray-400 hover:text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory; 