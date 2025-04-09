import React from 'react';
import { Button } from './ui/Button';
import { DropdownMenu } from './ui/DropdownMenu';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../hooks/useTheme';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
}

export const UpcomingTasks: React.FC = () => {
  const { theme } = useTheme();
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Review Customer Feedback',
      description: 'Analyze and respond to customer feedback from last week',
      dueDate: new Date(Date.now() + 86400000),
      priority: 'high',
      status: 'pending',
      assignedTo: 'John Doe',
    },
    {
      id: '2',
      title: 'Monthly Report',
      description: 'Prepare monthly sales and performance report',
      dueDate: new Date(Date.now() + 172800000),
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Jane Smith',
    },
    {
      id: '3',
      title: 'Team Meeting',
      description: 'Weekly team sync and planning',
      dueDate: new Date(Date.now() + 259200000),
      priority: 'low',
      status: 'pending',
      assignedTo: 'Team Lead',
    },
  ];

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return theme === 'dark' 
          ? 'bg-red-900/50 text-red-200' 
          : 'bg-red-100 text-red-800';
      case 'medium':
        return theme === 'dark'
          ? 'bg-yellow-900/50 text-yellow-200'
          : 'bg-yellow-100 text-yellow-800';
      case 'low':
        return theme === 'dark'
          ? 'bg-green-900/50 text-green-200'
          : 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const menuItems = [
    {
      label: 'Add New Task',
      icon: <Plus className="h-4 w-4" />,
      onClick: () => {/* Handle add task */},
    },
    {
      label: 'View All Tasks',
      onClick: () => {/* Handle view all */},
    },
    {
      label: 'Filter Tasks',
      onClick: () => {/* Handle filter */},
    },
  ];

  return (
    <div className={cn(
      "rounded-lg shadow transition-colors duration-200",
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    )}>
      <div className={cn(
        "p-6 border-b transition-colors duration-200",
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      )}>
        <div className="flex items-center justify-between">
          <h2 className={cn(
            "text-lg font-semibold",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            Upcoming Tasks
          </h2>
          <DropdownMenu items={menuItems} />
        </div>
      </div>
      <div className={cn(
        "divide-y transition-colors duration-200",
        theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
      )}>
        {tasks.map((task) => (
          <div key={task.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "font-medium",
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {task.title}
                  </h3>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getPriorityColor(task.priority)
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className={cn(
                  "mt-1 text-sm",
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {task.description}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className={cn(
                      "h-4 w-4",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )} />
                    <span className={cn(
                      "text-xs",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    <span className={cn(
                      "text-xs",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "text-xs",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      Assigned to: {task.assignedTo}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {/* Handle task action */}}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className={cn(
        "p-4 border-t transition-colors duration-200",
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      )}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => {/* Handle load more */}}
        >
          View All Tasks
        </Button>
      </div>
    </div>
  );
}; 