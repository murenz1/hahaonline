import React, { useState } from 'react';
import { team, freeAgents } from '../data/mockData';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';

interface TeamProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Team: React.FC<TeamProps> = ({ searchTerm, setSearchTerm }) => {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showFreeAgents, setShowFreeAgents] = useState<boolean>(false);

  const filteredTeam = team.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const filteredFreeAgents = freeAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || agent.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const roles = Array.from(new Set([...team, ...freeAgents].map(member => member.role)));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-gray-500">Manage your team members and their roles</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <UserPlus size={20} className="mr-2" />
          Add Member
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button
          onClick={() => setShowFreeAgents(!showFreeAgents)}
          className={`px-4 py-2 rounded-lg border ${
            showFreeAgents ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          Free Agents
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(showFreeAgents ? filteredFreeAgents : filteredTeam).map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
              {'status' in member && (
                <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'Available' ? 'bg-green-100 text-green-800' :
                  member.status === 'Busy' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {member.status}
                </span>
              )}
            </div>
            <div className="border-t px-4 py-3 bg-gray-50 rounded-b-lg">
              <div className="flex justify-around">
                <button className="text-gray-600 hover:text-blue-600">
                  <Mail size={18} />
                </button>
                <button className="text-gray-600 hover:text-blue-600">
                  <Phone size={18} />
                </button>
                <button className="text-gray-600 hover:text-blue-600">
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team; 