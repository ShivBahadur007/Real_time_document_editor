import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code, Undo, Redo, Type } from 'lucide-react';

interface ToolbarProps {
  onFormat: (command: string, value?: string) => void;
  activeFormats: Set<string>;
}

export function Toolbar({ onFormat, activeFormats }: ToolbarProps) {
  const toolbarButtons = [
    { command: 'undo', icon: Undo, label: 'Undo' },
    { command: 'redo', icon: Redo, label: 'Redo' },
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'underline', icon: Underline, label: 'Underline' },
    { command: 'insertUnorderedList', icon: List, label: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered List' },
    { command: 'formatBlock', icon: Quote, label: 'Quote', value: 'blockquote' },
    { command: 'formatBlock', icon: Code, label: 'Code Block', value: 'pre' },
  ];

  const headingOptions = [
    { value: 'div', label: 'Normal' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center space-x-1">
      {/* Heading Selector */}
      <div className="relative mr-4">
        <select
          onChange={(e) => onFormat('formatBlock', e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {headingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Type className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-300 mr-4"></div>

      {/* Format Buttons */}
      {toolbarButtons.map((button, index) => {
        const Icon = button.icon;
        const isActive = activeFormats.has(button.command) || 
          (button.value && activeFormats.has(`${button.command}-${button.value}`));

        return (
          <React.Fragment key={button.command + (button.value || '')}>
            <button
              onClick={() => onFormat(button.command, button.value)}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              title={button.label}
            >
              <Icon className="w-4 h-4" />
            </button>
            
            {(index === 1 || index === 4) && (
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}