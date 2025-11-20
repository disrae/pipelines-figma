import { Search, ArrowUp, Star, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function AnalysisTab() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Search Section */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search, generate charts, extract quotes"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            Magic Suggestions
          </Button>
          <Button variant="outline" size="sm">
            create an empathy map
          </Button>
          <Button variant="outline" size="sm">
            extract top 5 themes
          </Button>
          <Button variant="outline" size="sm">
            create a sentiment chart
          </Button>
          <Button variant="outline" size="sm">
            +1 more
          </Button>
        </div>
      </div>

      {/* Query Result */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Context:</span>
            <Badge variant="secondary">New Recording 1443(A9)</Badge>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Star className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-blue-600 mb-2">Query:</h3>
          <p className="text-gray-900">tell me about what was said about quality</p>
        </div>

        <div className="mb-4">
          <h3 className="text-green-600 mb-2">Response:</h3>
          <p className="text-gray-700 mb-4">
            The discussions around quality focused on several key areas, primarily concerning image acquisition and its significance in clinical applications.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-gray-900 mb-2">
              1. <span className="font-medium">Image Acquisition Quality:</span> A participant emphasized the challenges associated with image acquisition quality, particularly when it comes to scans performed by less experienced operators. They suggested implementing a quality indicator in prototypes to assess whether images meet necessary standards. This would facilitate support for less experienced personnel through AI assistance, ensuring consistency in results. <Eye className="inline w-4 h-4 ml-1" />
            </h4>
          </div>

          <div>
            <h4 className="text-gray-900 mb-2">
              2. <span className="font-medium">Algorithmic Labeling:</span> There were mentions of using algorithmic labeling to enhance the confidence in segmenting images, which could improve overall performance. This approach was highlighted as promising even with a relatively small dataset, signaling the potential for significant advancements in image quality through algorithmic solutions. <Eye className="inline w-4 h-4 ml-1" />
            </h4>
          </div>

          <div>
            <h4 className="text-gray-900 mb-2">
              3. <span className="font-medium">Integration with Clinical Protocols:</span> The conversation included plans for the development of a portal that could instantly evaluate the quality of scans, potentially identifying areas needing rescans. This would be beneficial for improving the quality of images taken during clinical trials. <Eye className="inline w-4 h-4 ml-1" />
            </h4>
          </div>

          <div>
            <h4 className="text-gray-900 mb-2">
              4. <span className="font-medium">Measurement Techniques:</span> There was a discussion about adjusting measurement strategies, particularly in terms of selecting frames for analysis. It was suggested that it might be beneficial to focus on smaller measurements as more accurate indicators of bowel wall thickness rather than maximum measurements. <Eye className="inline w-4 h-4 ml-1" />
            </h4>
          </div>

          <div>
            <h4 className="text-gray-900 mb-2">
              5. <span className="font-medium">Continuous Feedback Systems:</span> The idea of a feedback system was raised, where the operators could receive guidance in real time based on the quality of images being captured. This approach aims to enhance both the learning process for new operators and the accuracy of image assessments. <Eye className="inline w-4 h-4 ml-1" />
            </h4>
          </div>
        </div>

        <p className="text-gray-700 mt-4">
          Overall, these insights reflect a strong acknowledgement of the challenges and opportunities tied to image quality in medical imaging, emphasizing the importance of systematic improvements, training, and technological integration.
        </p>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">Ask a follow-up question</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-600">Query#: 1</span>
          </div>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-lg">
        <ArrowUp className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
