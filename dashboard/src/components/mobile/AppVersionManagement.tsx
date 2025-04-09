import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Package,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface AppVersion {
  id: string;
  version: string;
  platform: 'ios' | 'android';
  releaseDate: string;
  status: 'draft' | 'review' | 'published' | 'deprecated';
  releaseNotes: string;
  minOSVersion: string;
  size: string;
  downloadUrl: string;
  forceUpdate: boolean;
  features: string[];
  bugFixes: string[];
  knownIssues: string[];
  changelog: string;
}

interface AppVersionManagementProps {
  versions: AppVersion[];
  onAddVersion: (version: Omit<AppVersion, 'id'>) => void;
  onEditVersion: (id: string, version: Partial<AppVersion>) => void;
  onDeleteVersion: (id: string) => void;
  onPublishVersion: (id: string) => void;
  onRollbackVersion: (id: string) => void;
}

export const AppVersionManagement: React.FC<AppVersionManagementProps> = ({
  versions,
  onAddVersion,
  onEditVersion,
  onDeleteVersion,
  onPublishVersion,
  onRollbackVersion,
}) => {
  const { theme } = useTheme();
  const [isAddingVersion, setIsAddingVersion] = React.useState(false);
  const [selectedPlatform, setSelectedPlatform] = React.useState<'ios' | 'android'>('ios');

  const getStatusColor = (status: AppVersion['status']) => {
    switch (status) {
      case 'draft':
        return 'text-gray-500';
      case 'review':
        return 'text-yellow-500';
      case 'published':
        return 'text-green-500';
      case 'deprecated':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: AppVersion['status']) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'review':
        return <AlertTriangle className="w-4 h-4" />;
      case 'published':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'deprecated':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
          App Version Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingVersion(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Version
          </Button>
        </div>
      </div>

      {/* Version List */}
      <div className="space-y-4">
        {versions.map((version) => (
          <div
            key={version.id}
            className={cn(
              "rounded-lg border p-6 space-y-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <h2 className="text-lg font-semibold">Version {version.version}</h2>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    getStatusColor(version.status)
                  )}>
                    {getStatusIcon(version.status)}
                    {version.status.toUpperCase()}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Platform: {version.platform.toUpperCase()} | 
                  Release Date: {version.releaseDate} | 
                  Min OS: {version.minOSVersion} | 
                  Size: {version.size}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditVersion(version.id, version)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteVersion(version.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Release Notes */}
            <div>
              <h3 className="font-medium mb-2">Release Notes</h3>
              <p className="text-sm text-gray-500">{version.releaseNotes}</p>
            </div>

            {/* Features & Fixes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">New Features</h3>
                <ul className="list-disc list-inside text-sm text-gray-500">
                  {version.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Bug Fixes</h3>
                <ul className="list-disc list-inside text-sm text-gray-500">
                  {version.bugFixes.map((fix, index) => (
                    <li key={index}>{fix}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Known Issues */}
            {version.knownIssues.length > 0 && (
              <div>
                <h3 className="font-medium mb-2 text-yellow-500">Known Issues</h3>
                <ul className="list-disc list-inside text-sm text-yellow-500">
                  {version.knownIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPublishVersion(version.id)}
                disabled={version.status === 'published'}
              >
                <Upload className="w-4 h-4 mr-2" />
                Publish
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRollbackVersion(version.id)}
                disabled={version.status !== 'published'}
              >
                <Download className="w-4 h-4 mr-2" />
                Rollback
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Version Modal */}
      {isAddingVersion && (
        <div className={cn(
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          <div className={cn(
            "bg-white rounded-lg p-6 w-full max-w-2xl",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          )}>
            <h2 className="text-xl font-semibold mb-4">Add New Version</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Platform</label>
                <Select
                  value={selectedPlatform}
                  onValueChange={(value) => setSelectedPlatform(value as 'ios' | 'android')}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="ios">iOS</Select.Item>
                    <Select.Item value="android">Android</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-500">Version Number</label>
                <Input placeholder="e.g., 1.0.0" />
              </div>
              <div>
                <label className="text-sm text-gray-500">Release Notes</label>
                <Input as="textarea" rows={4} placeholder="Enter release notes..." />
              </div>
              <div>
                <label className="text-sm text-gray-500">Minimum OS Version</label>
                <Input placeholder="e.g., iOS 13.0 or Android 8.0" />
              </div>
              <div>
                <label className="text-sm text-gray-500">Force Update</label>
                <Select>
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="true">Yes</Select.Item>
                    <Select.Item value="false">No</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddingVersion(false)}>
                Cancel
              </Button>
              <Button>
                Add Version
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 