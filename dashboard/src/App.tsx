import React, { useState } from 'react';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings as SettingsIcon, Menu, Megaphone, 
         MessageCircle, BrainCircuit, Shield, Smartphone, Truck, BarChart2, CreditCard, Store, DollarSign } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Team from './components/Team';
import Inventory from './components/Inventory';
import Settings from './components/Settings';
import Marketing from './components/Marketing';
import Header from './components/Header';
import Support from './components/Support';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AiAutomation from './components/AiAutomation';
import Security from './components/Security';
import MobileApp from './components/MobileApp';
import Shipping from './components/Shipping';
import Analytics from './components/Analytics';
import Payments from './components/Payments';
import Vendors from './components/Vendors';
import Products from './components/Products';
import Customers from './components/Customers';
import Finance from './components/finance/Finance';
import { BrowserRouter as Router } from 'react-router-dom';

const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [selectedTab, setSelectedTab] = useState('finance');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('week');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'New Order',
      message: 'You have received a new order from John Doe',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Black olives are running low in stock',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Payment received for order #745632',
      time: '2 hours ago',
      read: true
    }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <Package size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'vendors', label: 'Vendors', icon: <Store size={20} /> },
    { id: 'team', label: 'Team', icon: <Users size={20} /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
    { id: 'marketing', label: 'Marketing', icon: <Megaphone size={20} /> },
    { id: 'mobile', label: 'Mobile App', icon: <Smartphone size={20} /> },
    { id: 'support', label: 'Support', icon: <MessageCircle size={20} /> },
    { id: 'ai', label: 'AI & Automation', icon: <BrainCircuit size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return (
          <Dashboard
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            activeTab={selectedTab}
            setActiveTab={setSelectedTab}
          />
        );
      case 'inventory':
        return <Inventory searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'products':
        return <Products searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'orders':
        return <Orders searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'customers':
        return <Customers searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'vendors':
        return <Vendors />;
      case 'team':
        return <Team searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'finance':
        return <Finance />;
      case 'payments':
        return <Payments />;
      case 'shipping':
        return <Shipping />;
      case 'analytics':
        return <Analytics />;
      case 'marketing':
        return <Marketing searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'mobile':
        return <MobileApp />;
      case 'support':
        return <Support searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'ai':
        return <AiAutomation />;
      case 'security':
        return <Security />;
      case 'settings':
        return <Settings searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      default:
        return <div className="p-6">Coming soon...</div>;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-200 ease-in-out ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
      } shadow-lg ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className={`flex items-center p-4 border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h1 className={`ml-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Store Dashboard
          </h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setSelectedTab(item.id)}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    selectedTab === item.id
                      ? isDarkMode 
                        ? 'bg-green-900 text-green-400'
                        : 'bg-green-50 text-green-600'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-200 ease-in-out ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Mobile Header */}
        <div className={`lg:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4`}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            } rounded-lg`}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Header */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          notifications={notifications}
          userName="Junior"
        />

        {/* Main Content */}
        <main className={`p-6 ${isDarkMode ? 'text-gray-100' : ''}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;