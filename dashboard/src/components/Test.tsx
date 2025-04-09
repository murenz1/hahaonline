import React from 'react';
import { revenueData } from '../data/mockData';

const Test: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Component</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Revenue Data</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(revenueData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Test; 