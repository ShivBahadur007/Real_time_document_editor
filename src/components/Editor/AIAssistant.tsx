import React, { useState } from 'react';
import { Sparkles, CheckCircle, X, Lightbulb, Brain, MessageSquare } from 'lucide-react';
import { AIsuggestion } from '../../types';

interface AIAssistantProps {
  suggestions: AIsuggestion[];
  isAnalyzing: boolean;
  onApplySuggestion: (suggestionId: string) => void;
  onDismissSuggestion: (suggestionId: string) => void;
}

export function AIAssistant({
  suggestions,
  isAnalyzing,
  onApplySuggestion,
  onDismissSuggestion
}: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getTypeIcon = (type: AIsuggestion['type']) => {
    switch (type) {
      case 'grammar':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'style':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'tone':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'summary':
        return <Brain className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: AIsuggestion['type']) => {
    switch (type) {
      case 'grammar':
        return 'border-green-200 bg-green-50';
      case 'style':
        return 'border-yellow-200 bg-yellow-50';
      case 'tone':
        return 'border-blue-200 bg-blue-50';
      case 'summary':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isAnalyzing && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg mb-4">
            <div className="animate-spin">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-blue-700">Analyzing your content...</span>
          </div>
        )}

        {suggestions.length === 0 && !isAnalyzing && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No suggestions available</p>
            <p className="text-gray-400 text-xs mt-1">Keep writing to get AI-powered recommendations</p>
          </div>
        )}

        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border rounded-lg p-3 ${getTypeColor(suggestion.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(suggestion.type)}
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {suggestion.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                  <button
                    onClick={() => onDismissSuggestion(suggestion.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {suggestion.type !== 'summary' && (
                <div className="mb-2">
                  <p className="text-xs text-gray-600 mb-1">Original:</p>
                  <p className="text-sm bg-white px-2 py-1 rounded border font-mono">
                    {suggestion.text}
                  </p>
                </div>
              )}

              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">
                  {suggestion.type === 'summary' ? 'Suggestion:' : 'Suggested:'}
                </p>
                <p className="text-sm text-gray-800">{suggestion.suggestion}</p>
              </div>

              {suggestion.type !== 'summary' && (
                <button
                  onClick={() => onApplySuggestion(suggestion.id)}
                  className="w-full bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Apply Suggestion
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}