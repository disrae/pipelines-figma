import { Search, Star, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';

export function SavedQueriesTab() {
  const savedQueries = [
    {
      id: 1,
      query: 'tell me about what was said about quality',
      context: 'New Recording 1443(A9)',
      date: 'Nov 14, 2025',
    },
    {
      id: 2,
      query: 'create a sentiment chart from all recordings',
      context: 'All Data Sources',
      date: 'Nov 13, 2025',
    },
    {
      id: 3,
      query: 'extract top 5 themes from customer interviews',
      context: 'Customer Interviews Q4',
      date: 'Nov 12, 2025',
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-4">Saved Queries</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search saved queries..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {savedQueries.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-500">{item.date}</span>
                </div>
                <p className="text-gray-900 mb-2">{item.query}</p>
                <Badge variant="secondary">{item.context}</Badge>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
