import { useState } from 'react';
import { Plus, Play, Pause, Settings, Trash2, Clock, Database, FileOutput, ChevronDown, Tag, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PipelineBuilder } from './PipelineBuilder';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Pipeline {
  id: string;
  name: string;
  dataSources: string[];
  schedule: string;
  output: string;
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  analysisType: 'Auto-tagging' | 'Queries';
  chartData?: any[];
  queryResults?: Array<{ response: string; timestamp: string }>;
}

export function PipelinesTab() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'Reddit Sentiment Analysis',
      dataSources: ['Reddit'],
      schedule: 'Daily at 9:00 AM',
      output: 'Google Sheets',
      status: 'active',
      lastRun: '2 hours ago',
      analysisType: 'Auto-tagging',
      chartData: [
        { name: 'Mon', value: 45 },
        { name: 'Tue', value: 62 },
        { name: 'Wed', value: 58 },
        { name: 'Thu', value: 73 },
        { name: 'Fri', value: 81 },
        { name: 'Sat', value: 68 },
        { name: 'Sun', value: 55 },
      ],
    },
    {
      id: '2',
      name: 'Customer Support Insights',
      dataSources: ['Intercom', 'Zendesk'],
      schedule: 'Every 6 hours',
      output: 'Slack',
      status: 'active',
      lastRun: '30 minutes ago',
      analysisType: 'Queries',
      queryResults: [
        { response: 'Users report login is smooth and fast, with 92% success rate on first attempt', timestamp: '2025-11-20T14:30:00Z' },
        { response: 'Top login complaint: Password reset emails taking too long (avg 5 minutes)', timestamp: '2025-11-20T14:00:00Z' },
        { response: 'Social login (Google/Apple) preferred by 68% of new users', timestamp: '2025-11-20T13:30:00Z' },
        { response: 'Mobile login experience rated 4.2/5, desktop rated 4.7/5', timestamp: '2025-11-20T13:00:00Z' },
        { response: '15% of users struggle with two-factor authentication setup', timestamp: '2025-11-20T12:30:00Z' },
        { response: 'Biometric login adoption increased 40% since last quarter', timestamp: '2025-11-20T12:00:00Z' },
      ],
    },
  ]);

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [viewingPipeline, setViewingPipeline] = useState<Pipeline | null>(null);

  const handleCreatePipeline = () => {
    setEditingPipeline(null);
    setIsBuilderOpen(true);
  };

  const handleEditPipeline = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline);
    setIsBuilderOpen(true);
  };

  const handleSavePipeline = (pipeline: Partial<Pipeline>) => {
    if (editingPipeline) {
      setPipelines(pipelines.map(p => p.id === editingPipeline.id ? { ...p, ...pipeline } : p));
    } else {
      const newPipeline: Pipeline = {
        id: Date.now().toString(),
        name: pipeline.name || 'New Pipeline',
        dataSources: pipeline.dataSources || [],
        schedule: pipeline.schedule || 'Manual',
        output: pipeline.output || 'None',
        status: 'draft',
      };
      setPipelines([...pipelines, newPipeline]);
    }
    setIsBuilderOpen(false);
  };

  const handleDeletePipeline = (id: string) => {
    setPipelines(pipelines.filter(p => p.id !== id));
  };

  const togglePipelineStatus = (id: string) => {
    setPipelines(pipelines.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'paused' : 'active' as 'active' | 'paused' | 'draft' }
        : p
    ));
  };

  if (isBuilderOpen) {
    return (
      <PipelineBuilder
        pipeline={editingPipeline}
        onSave={handleSavePipeline}
        onCancel={() => setIsBuilderOpen(false)}
      />
    );
  }

  // Pipeline Detail View
  if (viewingPipeline) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => setViewingPipeline(null)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pipelines
        </Button>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-900 mb-2">{viewingPipeline.name}</h2>
              <p className="text-gray-600">Pipeline Details</p>
            </div>
            <Badge
              variant={
                viewingPipeline.status === 'active' ? 'default' :
                viewingPipeline.status === 'paused' ? 'secondary' :
                'outline'
              }
            >
              {viewingPipeline.status}
            </Badge>
          </div>

          {viewingPipeline.analysisType === 'Auto-tagging' && viewingPipeline.chartData && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-700">Tags:</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Wrist Pain
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-900 border-gray-300">
                  Software Issues
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={viewingPipeline.chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {viewingPipeline.analysisType === 'Queries' && viewingPipeline.queryResults && (
            <div>
              <h4 className="text-gray-700 mb-4">
                Query Results for: <span className="text-gray-900">"What do people think about login"</span>
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600">Response</th>
                      <th className="px-4 py-3 text-left text-gray-600 w-48">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {viewingPipeline.queryResults.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{result.response}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(result.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded">
                {viewingPipeline.analysisType === 'Auto-tagging' ? (
                  <Tag className="w-4 h-4 text-orange-600" />
                ) : (
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-gray-600 mb-1">Analysis Type</p>
                <p className="text-gray-900">{viewingPipeline.analysisType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded">
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 mb-1">Data Sources</p>
                <div className="flex gap-1 flex-wrap">
                  {viewingPipeline.dataSources.map((source) => (
                    <Badge key={source} variant="outline">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 mb-1">Schedule</p>
                <p className="text-gray-900">{viewingPipeline.schedule}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded">
                <FileOutput className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 mb-1">Output</p>
                <p className="text-gray-900">{viewingPipeline.output}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-2">Pipelines</h2>
          <p className="text-gray-600">Build automated workflows to process data from multiple sources</p>
        </div>
        <Button onClick={handleCreatePipeline} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Pipeline
        </Button>
      </div>

      <div className="space-y-4">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            onClick={() => setViewingPipeline(pipeline)}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-gray-900">{pipeline.name}</h3>
                  <Badge
                    variant={
                      pipeline.status === 'active' ? 'default' :
                      pipeline.status === 'paused' ? 'secondary' :
                      'outline'
                    }
                  >
                    {pipeline.status}
                  </Badge>
                </div>
                {pipeline.lastRun && (
                  <p className="text-gray-500">Last run: {pipeline.lastRun}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePipelineStatus(pipeline.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded text-gray-600"
                >
                  {pipeline.status === 'active' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPipeline(pipeline);
                  }}
                  className="p-2 hover:bg-gray-100 rounded text-gray-600"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePipeline(pipeline.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic content based on analysis type - REMOVED */}

            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded">
                  {pipeline.analysisType === 'Auto-tagging' ? (
                    <Tag className="w-4 h-4 text-orange-600" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Analysis Type</p>
                  <p className="text-gray-900">{pipeline.analysisType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Data Sources</p>
                  <div className="flex gap-1 flex-wrap">
                    {pipeline.dataSources.map((source) => (
                      <Badge key={source} variant="outline">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Schedule</p>
                  <p className="text-gray-900">{pipeline.schedule}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded">
                  <FileOutput className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Output</p>
                  <p className="text-gray-900">{pipeline.output}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {pipelines.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">No pipelines yet</h3>
            <p className="text-gray-600 mb-4">Create your first pipeline to automate data processing</p>
            <Button onClick={handleCreatePipeline} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Pipeline
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}