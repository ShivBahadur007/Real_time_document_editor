import React, { useRef, useEffect, useState } from 'react';
import { Toolbar } from './Toolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onCursorChange: (position: number) => void;
  className?: string;
}

export function RichTextEditor({ content, onChange, onCursorChange, className = '' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      
      editorRef.current.innerHTML = content;
      
      // Restore cursor position
      if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        try {
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch (e) {
          // Ignore range errors
        }
      }
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      
      // Update cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        onCursorChange(range.startOffset);
      }
    }
  };

  const handleSelectionChange = () => {
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList');
    if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList');
    
    setActiveFormats(formats);
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
    handleInput();
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Toolbar onFormat={handleFormat} activeFormats={activeFormats} />
      
      <div className="flex-1 overflow-y-auto">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="min-h-full p-6 focus:outline-none prose prose-lg max-w-none"
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            lineHeight: '1.6',
            fontSize: '16px'
          }}
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}