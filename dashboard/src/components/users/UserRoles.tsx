import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Users,
  Key,
  Settings,
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  userCount: number;
}

interface UserRolesProps {
  roles: Role[];
  permissions: Permission[];
  onAddRole: () => void;
  onEditRole: (roleId: string) => void;
  onDeleteRole: (roleId: string) => void;
  onUpdatePermissions: (roleId: string, permissions: string[]) => void;
  onSetDefault: (roleId: string) => void;
}

export const UserRoles: React.FC<UserRolesProps> = ({
  roles,
  permissions,
  onAddRole,
  onEditRole,
  onDeleteRole,
  onUpdatePermissions,
  onSetDefault,
}) => {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const getRolePermissions = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.permissions : [];
  };

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    const currentPermissions = getRolePermissions(roleId);
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(p => p !== permissionId)
      : [...currentPermissions, permissionId];
    onUpdatePermissions(roleId, newPermissions);
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          User Roles & Permissions
        </h1>
        <div className="flex gap-2">
          <Button onClick={onAddRole}>
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List */}
        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <h2 className="text-lg font-semibold mb-4">Roles</h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <div
                key={role.id}
                className={cn(
                  "p-3 rounded-lg cursor-pointer",
                  selectedRole === role.id
                    ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                )}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-gray-500">{role.userCount} users</div>
                  </div>
                  {role.isDefault && (
                    <div className="text-xs text-green-600 font-medium">Default</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="lg:col-span-3">
          {selectedRole ? (
            <div className={cn(
              "rounded-lg border p-6",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    {roles.find(r => r.id === selectedRole)?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {roles.find(r => r.id === selectedRole)?.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onEditRole(selectedRole)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Role
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onDeleteRole(selectedRole)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onSetDefault(selectedRole)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Set as Default
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h3 className="font-medium mb-3">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className={cn(
                            "p-4 rounded-lg border",
                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{permission.name}</div>
                              <div className="text-sm text-gray-500">
                                {permission.description}
                              </div>
                            </div>
                            <Switch
                              checked={getRolePermissions(selectedRole).includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(selectedRole, permission.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={cn(
              "rounded-lg border p-6 flex items-center justify-center",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}>
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Role</h3>
                <p className="text-gray-500">
                  Choose a role from the list to view and manage its permissions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 