import React from 'react';
import { UserPlus as LayerPlus } from 'lucide-react';

interface RelatedQueryItemProps {
  query: string;
}

const RelatedQueryItem: React.FC<RelatedQueryItemProps> = ({ query}) => {
  return (
    <div 
      className="py-2 px-4 cursor-pointer group flex items-center justify-between hover:bg-navy-800/50 rounded-lg transition-all duration-300"
    >
      <div className="text-gray-300 group-hover:text-blue-400 transition-all duration-300 font-medium">
        {query}
      </div>
      <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </div>
    </div>
  );
};

interface RelatedQueriesProps {
  queries: string[];
}

const RelatedQueries: React.FC<RelatedQueriesProps> = ({ queries}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="bg-navy-900/40 backdrop-blur-sm border border-navy-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <LayerPlus className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-medium text-gray-200">Related Queries</h2>
        </div>
        <div className="space-y-1">
          {queries.map((query, index) => (
            <RelatedQueryItem 
              key={index} 
              query={query} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedQueries;