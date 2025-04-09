import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  Download,
  FileText,
  BarChart2,
  LineChart,
  PieChart,
  Calendar,
  Printer,
  Share2,
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'budget' | 'tax';
  period: string;
  generatedDate: string;
  status: 'ready' | 'generating' | 'error';
  format: 'pdf' | 'excel' | 'csv';
  size: string;
}

interface FinancialReportsProps {
  reports: Report[];
  onGenerateReport: (type: string) => void;
  onDownloadReport: (id: string) => void;
  onPrintReport: (id: string) => void;
  onShareReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  reports,
  onGenerateReport,
  onDownloadReport,
  onPrintReport,
  onShareReport,
  onDeleteReport,
}) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('all');

  const filteredReports = reports.filter(report => {
    const matchesPeriod = selectedPeriod === 'all' || report.period === selectedPeriod;
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesPeriod && matchesType;
  });

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'income_statement':
        return <LineChart className="w-5 h-5" />;
      case 'balance_sheet':
        return <BarChart2 className="w-5 h-5" />;
      case 'cash_flow':
        return <PieChart className="w-5 h-5" />;
      case 'budget':
        return <BarChart2 className="w-5 h-5" />;
      case 'tax':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'generating':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
          Financial Reports
        </h1>
        <div className="flex gap-2">
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <Select.Trigger>
              <FileText className="w-4 h-4 mr-2" />
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All Reports</Select.Item>
              <Select.Item value="income_statement">Income Statement</Select.Item>
              <Select.Item value="balance_sheet">Balance Sheet</Select.Item>
              <Select.Item value="cash_flow">Cash Flow</Select.Item>
              <Select.Item value="budget">Budget Report</Select.Item>
              <Select.Item value="tax">Tax Report</Select.Item>
            </Select.Content>
          </Select>
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
            <Select.Trigger>
              <Calendar className="w-4 h-4 mr-2" />
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All Periods</Select.Item>
              <Select.Item value="monthly">Monthly</Select.Item>
              <Select.Item value="quarterly">Quarterly</Select.Item>
              <Select.Item value="yearly">Yearly</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className={cn(
              "rounded-lg border p-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getReportIcon(report.type)}
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <div className="text-sm text-gray-500">{report.period}</div>
                </div>
              </div>
              <div className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(report.status)
              )}>
                <span>{report.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Format</div>
                  <div className="font-medium">{report.format.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-medium">{report.size}</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Generated: {report.generatedDate}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownloadReport(report.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPrintReport(report.id)}
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShareReport(report.id)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate New Report */}
      <div className="flex justify-center">
        <Button onClick={() => onGenerateReport(selectedType)}>
          Generate New Report
        </Button>
      </div>
    </div>
  );
}; 