import { useState } from 'react';
import { DataSourcesPanel } from './components/DataSourcesPanel';
import { AnalysisTab } from './components/AnalysisTab';
import { SavedQueriesTab } from './components/SavedQueriesTab';
import { PipelinesTab } from './components/PipelinesTab';
import { Button } from './components/ui/button';
import { Plus, Settings, User } from 'lucide-react';

type Tab = 'analysis' | 'saved-queries' | 'pipelines';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className={`${isSidebarOpen ? 'w-[240px]' : 'w-0'} border-r border-gray-200 transition-all duration-300 overflow-hidden`}>
        <DataSourcesPanel />
      </div>

      {/* Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute left-0 top-[36px] z-10 p-2 hover:bg-gray-100"
      >
        <div className="flex flex-col gap-1">
          <div className="w-4 h-0.5 bg-gray-600"></div>
          <div className="w-4 h-0.5 bg-gray-600"></div>
          <div className="w-4 h-0.5 bg-gray-600"></div>
        </div>
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              Add a Data Source
              <Plus className="w-4 h-4" />
            </Button>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analysis
              </button>
              <button
                onClick={() => setActiveTab('saved-queries')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'saved-queries'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Saved Queries
              </button>
              <button
                onClick={() => setActiveTab('pipelines')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'pipelines'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pipelines
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'analysis' && <AnalysisTab />}
          {activeTab === 'saved-queries' && <SavedQueriesTab />}
          {activeTab === 'pipelines' && <PipelinesTab />}
        </div>
      </div>
    </div>
  );
}
