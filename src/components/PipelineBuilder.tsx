import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowRight, ArrowLeft, Send, Settings as SettingsIcon, Plus, X } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  connected?: boolean;
}

interface AnalysisConfig {
  type: 'sentiment' | 'query' | 'auto-tagging';
  query?: string;
  tagName?: string;
  tagDescription?: string;
  tagExample?: string;
}

interface PipelineBuilderProps {
  pipeline: any;
  onSave: (pipeline: any) => void;
  onCancel: () => void;
}

export function PipelineBuilder({ pipeline, onSave, onCancel }: PipelineBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState(pipeline?.name || '');
  const [selectedSources, setSelectedSources] = useState<string[]>(pipeline?.dataSources || []);
  const [schedule, setSchedule] = useState(pipeline?.schedule || 'manual');
  const [customSchedule, setCustomSchedule] = useState('');
  const [output, setOutput] = useState(pipeline?.output || '');
  const [otherDataSource, setOtherDataSource] = useState('');
  
  // Analysis Type States
  const [selectedAnalyses, setSelectedAnalyses] = useState<AnalysisConfig[]>([]);
  const [queryText, setQueryText] = useState('');
  const [tagName, setTagName] = useState('');
  const [tagDescription, setTagDescription] = useState('');
  const [tagExample, setTagExample] = useState('');

  const dataSources: DataSource[] = [
    { id: 'reddit', name: 'Reddit', icon: '🔴', enabled: true, connected: true },
    { id: 'intercom', name: 'Intercom', icon: '💬', enabled: true, connected: true },
    { id: 'zendesk', name: 'Zendesk', icon: '🎫', enabled: true, connected: false },
    { id: 'slack', name: 'Slack', icon: '💬', enabled: false },
    { id: 'twitter', name: 'Twitter', icon: '🐦', enabled: false },
  ];

  const outputOptions = [
    'Google Sheets',
    'Slack',
    'Email',
    'Webhook',
    'Database',
    'CSV Export',
  ];

  const steps = [
    { number: 1, title: 'Pipeline Name', color: 'bg-blue-600' },
    { number: 2, title: 'Data Sources', color: 'bg-purple-600' },
    { number: 3, title: 'Analysis Type', color: 'bg-green-600' },
    { number: 4, title: 'Schedule', color: 'bg-orange-600' },
    { number: 5, title: 'Output', color: 'bg-pink-600' },
  ];

  const toggleSource = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter(s => s !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  const hasAnalysisType = (type: 'sentiment' | 'query' | 'auto-tagging') => {
    return selectedAnalyses.some(a => a.type === type);
  };

  const addSentiment = () => {
    if (!hasAnalysisType('sentiment')) {
      setSelectedAnalyses([...selectedAnalyses, { type: 'sentiment' }]);
    }
  };

  const addQuery = () => {
    if (!hasAnalysisType('query') && queryText.trim()) {
      setSelectedAnalyses([...selectedAnalyses, { type: 'query', query: queryText }]);
      setQueryText('');
    }
  };

  const addAutoTagging = () => {
    if (!hasAnalysisType('auto-tagging') && tagName.trim()) {
      setSelectedAnalyses([...selectedAnalyses, { 
        type: 'auto-tagging', 
        tagName: tagName.trim() || 'Onboarding Issue',
        tagDescription: tagDescription.trim() || 'Any issues related to users signing up or confusion during the first use, or issues setting up the app',
        tagExample: tagExample.trim() || 'I couldn\'t log in, I lost my password, I didn\'t know where to start, I couldn\'t set up my first template'
      }]);
      setTagName('');
      setTagDescription('');
      setTagExample('');
    }
  };

  const removeAnalysis = (index: number) => {
    setSelectedAnalyses(selectedAnalyses.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return name.trim().length > 0;
      case 1: return selectedSources.length > 0;
      case 2: return selectedAnalyses.length > 0;
      case 3: return true; // Schedule always has a value
      case 4: return output.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const scheduleValue = schedule === 'custom' ? customSchedule : 
                         schedule === 'manual' ? 'Manual' :
                         schedule === 'hourly' ? 'Every hour' :
                         schedule === 'daily' ? 'Daily at 9:00 AM' :
                         schedule === '6hours' ? 'Every 6 hours' :
                         'Manual';

    onSave({
      name,
      dataSources: selectedSources.map(id => 
        dataSources.find(ds => ds.id === id)?.name || id
      ),
      schedule: scheduleValue,
      output,
      analysisTypes: selectedAnalyses,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">
          {pipeline ? 'Edit Pipeline' : 'Create New Pipeline'}
        </h2>
        <p className="text-gray-600">Configure your automated workflow</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
                index === currentStep
                  ? step.color
                  : index < currentStep
                  ? 'bg-gray-400'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  index < currentStep ? 'bg-gray-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-[400px] mb-6">
        {/* Step 0: Pipeline Name */}
        {currentStep === 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full ${steps[0].color} text-white flex items-center justify-center`}>
                1
              </div>
              <h3 className="text-gray-900">Pipeline Name</h3>
            </div>
            <p className="text-gray-600 mb-6">Give your pipeline a descriptive name</p>
            <Label htmlFor="pipeline-name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="pipeline-name"
              placeholder="e.g., Customer Feedback Analysis"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-lg"
            />
          </div>
        )}

        {/* Step 1: Data Sources */}
        {currentStep === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full ${steps[1].color} text-white flex items-center justify-center`}>
                2
              </div>
              <h3 className="text-gray-900">Select Data Sources</h3>
            </div>
            <p className="text-gray-600 mb-6">Choose where your data comes from</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {dataSources.map((source) => (
                <div
                  key={source.id}
                  className={`border rounded-lg p-4 transition-all ${
                    selectedSources.includes(source.id)
                      ? 'border-blue-500 bg-blue-50'
                      : source.enabled
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-100 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{source.icon}</span>
                    <Checkbox
                      checked={selectedSources.includes(source.id)}
                      disabled={!source.enabled}
                      onCheckedChange={() => source.enabled && toggleSource(source.id)}
                    />
                  </div>
                  <p className="text-gray-900 mb-2">{source.name}</p>
                  {source.enabled ? (
                    source.connected ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">Connected</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <SettingsIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-600 hover:text-gray-900">
                          Connect
                        </Button>
                      </div>
                    )
                  ) : (
                    <p className="text-gray-500">Coming soon</p>
                  )}
                </div>
              ))}
              
              {/* Other Data Source */}
              <div className="border rounded-lg p-4 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">➕</span>
                </div>
                <p className="text-gray-900 mb-2">Other</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter source"
                    value={otherDataSource}
                    onChange={(e) => setOtherDataSource(e.target.value)}
                    className="h-8"
                  />
                  <Button 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => {
                      if (otherDataSource.trim()) {
                        setSelectedSources([...selectedSources, otherDataSource]);
                        setOtherDataSource('');
                      }
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {selectedSources.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-2">Selected sources:</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedSources.map((sourceId) => {
                    const source = dataSources.find(ds => ds.id === sourceId);
                    return (
                      <Badge key={sourceId} variant="secondary">
                        {source?.icon} {source?.name || sourceId}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Analysis Type */}
        {currentStep === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full ${steps[2].color} text-white flex items-center justify-center`}>
                3
              </div>
              <h3 className="text-gray-900">Analysis Type</h3>
            </div>
            <p className="text-gray-600 mb-6">Define how to analyze each incoming data</p>
            
            <div className="space-y-4">
              {/* Sentiment Analysis */}
              <div className="border rounded-lg p-4 border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Sentiment Analysis</h4>
                    <p className="text-gray-600">
                      Automatically analyze sentiment for each piece of incoming data
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={addSentiment}
                    disabled={hasAnalysisType('sentiment')}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Query */}
              <div className="border rounded-lg p-4 border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Query</h4>
                    <p className="text-gray-600 mb-3">
                      Automatically query incoming data with a question or request
                    </p>
                    <Input
                      placeholder="Extract top 5 themes"
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      disabled={hasAnalysisType('query')}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 ml-3"
                    onClick={addQuery}
                    disabled={hasAnalysisType('query') || !queryText.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Auto-Tagging */}
              <div className="border rounded-lg p-4 border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Auto-Tagging</h4>
                    <p className="text-gray-600 mb-3">
                      Auto-tag incoming data based on your description and generate charts
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="tag-name" className="mb-1 block text-gray-700">
                          Tag Name
                        </Label>
                        <Input
                          id="tag-name"
                          placeholder="Onboarding Issue"
                          value={tagName}
                          onChange={(e) => setTagName(e.target.value)}
                          disabled={hasAnalysisType('auto-tagging')}
                          className="placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tag-description" className="mb-1 block text-gray-700">
                          Description
                        </Label>
                        <Textarea
                          id="tag-description"
                          placeholder="Any issues related to users signing up or confusion during the first use, or issues setting up the app"
                          value={tagDescription}
                          onChange={(e) => setTagDescription(e.target.value)}
                          disabled={hasAnalysisType('auto-tagging')}
                          rows={2}
                          className="placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tag-example" className="mb-1 block text-gray-700">
                          Example
                        </Label>
                        <Textarea
                          id="tag-example"
                          placeholder="I couldn't log in, I lost my password, I didn't know where to start, I couldn't set up my first template"
                          value={tagExample}
                          onChange={(e) => setTagExample(e.target.value)}
                          disabled={hasAnalysisType('auto-tagging')}
                          rows={2}
                          className="placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 ml-3"
                    onClick={addAutoTagging}
                    disabled={hasAnalysisType('auto-tagging')}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Analyses */}
            {selectedAnalyses.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-2">Selected analyses:</p>
                <div className="space-y-2">
                  {selectedAnalyses.map((analysis, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-3 py-2">
                      <div className="flex-1">
                        {analysis.type === 'sentiment' && (
                          <span className="text-gray-900">Sentiment Analysis</span>
                        )}
                        {analysis.type === 'query' && (
                          <div>
                            <span className="text-gray-900">Query: </span>
                            <span className="text-gray-700">{analysis.query}</span>
                          </div>
                        )}
                        {analysis.type === 'auto-tagging' && (
                          <div>
                            <span className="text-gray-900">Auto-Tagging: </span>
                            <span className="text-gray-700">{analysis.tagName}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeAnalysis(index)}
                        className="p-1 hover:bg-blue-100 rounded"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full ${steps[3].color} text-white flex items-center justify-center`}>
                4
              </div>
              <h3 className="text-gray-900">Set Schedule</h3>
            </div>
            <p className="text-gray-600 mb-6">When should this pipeline run?</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="manual"
                  name="schedule"
                  value="manual"
                  checked={schedule === 'manual'}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="manual" className="cursor-pointer">Manual (Run on demand)</Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="hourly"
                  name="schedule"
                  value="hourly"
                  checked={schedule === 'hourly'}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="hourly" className="cursor-pointer">Every hour</Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="6hours"
                  name="schedule"
                  value="6hours"
                  checked={schedule === '6hours'}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="6hours" className="cursor-pointer">Every 6 hours</Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="daily"
                  name="schedule"
                  value="daily"
                  checked={schedule === 'daily'}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="daily" className="cursor-pointer">Daily at 9:00 AM</Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="custom"
                  name="schedule"
                  value="custom"
                  checked={schedule === 'custom'}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="custom" className="cursor-pointer">Custom schedule</Label>
              </div>
              {schedule === 'custom' && (
                <Input
                  placeholder="e.g., Every Monday at 3:00 PM"
                  value={customSchedule}
                  onChange={(e) => setCustomSchedule(e.target.value)}
                  className="ml-7 max-w-lg"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 4: Output */}
        {currentStep === 4 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full ${steps[4].color} text-white flex items-center justify-center`}>
                5
              </div>
              <h3 className="text-gray-900">Configure Output</h3>
            </div>
            <p className="text-gray-600 mb-6">Where should the results go?</p>
            <Select value={output} onValueChange={setOutput}>
              <SelectTrigger className="max-w-lg">
                <SelectValue placeholder="Select output destination" />
              </SelectTrigger>
              <SelectContent>
                {outputOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {output && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded max-w-lg">
                <p className="text-blue-900">
                  Results will be sent to: <span className="font-medium">{output}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : handleBack}
          className="gap-2"
        >
          {currentStep === 0 ? (
            <>Cancel</>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" />
              Back
            </>
          )}
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            disabled={!canProceed()}
          >
            Save Pipeline
          </Button>
        )}
      </div>
    </div>
  );
}
