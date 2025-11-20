import { Checkbox } from './ui/checkbox';
import { Filter } from 'lucide-react';

export function DataSourcesPanel() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-gray-900 mb-3">Data</h3>
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <Checkbox id="file1" defaultChecked />
            <label htmlFor="file1" className="cursor-pointer">
              Filename
            </label>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
          <Checkbox id="recording" defaultChecked />
          <label htmlFor="recording" className="cursor-pointer">
            <span className="text-red-600">New Recording</span> 1443.m4a
          </label>
        </div>
      </div>
    </div>
  );
}
