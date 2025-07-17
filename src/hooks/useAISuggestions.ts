import { useState, useEffect } from 'react';
import { AIsuggestion } from '../types';

export function useAISuggestions(content: string) {
  const [suggestions, setSuggestions] = useState<AIsuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!content || content.length < 50) {
      setSuggestions([]);
      return;
    }

    const analyzeContent = async () => {
      setIsAnalyzing(true);
      
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const demoSuggestions: AIsuggestion[] = [];

      // Grammar suggestions
      if (content.includes('there') && content.includes('their')) {
        demoSuggestions.push({
          id: 'grammar-1',
          type: 'grammar',
          text: 'there',
          suggestion: 'their',
          confidence: 0.85,
          position: { start: content.indexOf('there'), end: content.indexOf('there') + 5 }
        });
      }

      // Style suggestions
      if (content.includes('very good')) {
        demoSuggestions.push({
          id: 'style-1',
          type: 'style',
          text: 'very good',
          suggestion: 'excellent',
          confidence: 0.78,
          position: { start: content.indexOf('very good'), end: content.indexOf('very good') + 9 }
        });
      }

      // Tone suggestions
      if (content.includes('I think')) {
        demoSuggestions.push({
          id: 'tone-1',
          type: 'tone',
          text: 'I think',
          suggestion: 'Consider using more confident language',
          confidence: 0.72,
          position: { start: content.indexOf('I think'), end: content.indexOf('I think') + 7 }
        });
      }

      // Summary suggestion for long content
      if (content.length > 1000) {
        demoSuggestions.push({
          id: 'summary-1',
          type: 'summary',
          text: content.substring(0, 100) + '...',
          suggestion: 'This document could benefit from a summary section at the beginning.',
          confidence: 0.90,
          position: { start: 0, end: 100 }
        });
      }

      setSuggestions(demoSuggestions);
      setIsAnalyzing(false);
    };

    const debounceTimer = setTimeout(analyzeContent, 2000);
    return () => clearTimeout(debounceTimer);
  }, [content]);

  const applySuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  return {
    suggestions,
    isAnalyzing,
    applySuggestion,
    dismissSuggestion
  };
}