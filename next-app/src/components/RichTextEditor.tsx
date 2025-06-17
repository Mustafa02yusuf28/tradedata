'use client';

import React, { useState } from 'react';

interface Formatting {
  bold?: boolean;
  italic?: boolean;
  fontSize?: 'small' | 'normal' | 'large' | 'xlarge';
  color?: string;
  highlight?: boolean;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  onTitleChange?: (title: string) => void;
  formatting?: Formatting;
  onFormattingChange?: (formatting: Formatting) => void;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your paragraph here...",
  title,
  onTitleChange,
  formatting = {},
  onFormattingChange
}: RichTextEditorProps) {
  const [showFormatting, setShowFormatting] = useState(false);

  const toggleFormat = (format: string) => {
    if (!onFormattingChange) return;
    
    const newFormatting = { ...formatting };
    if (format === 'bold') {
      newFormatting.bold = !newFormatting.bold;
    } else if (format === 'italic') {
      newFormatting.italic = !newFormatting.italic;
    } else if (format === 'highlight') {
      newFormatting.highlight = !newFormatting.highlight;
    }
    onFormattingChange(newFormatting);
  };

  const setFontSize = (size: 'small' | 'normal' | 'large' | 'xlarge') => {
    if (!onFormattingChange) return;
    onFormattingChange({ ...formatting, fontSize: size });
  };

  const setColor = (color: string) => {
    if (!onFormattingChange) return;
    onFormattingChange({ ...formatting, color });
  };

  const getTextStyle = () => {
    const style: React.CSSProperties = {};
    
    if (formatting.bold) style.fontWeight = 'bold';
    if (formatting.italic) style.fontStyle = 'italic';
    if (formatting.highlight) {
      style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
      style.padding = '2px 4px';
      style.borderRadius = '3px';
    }
    if (formatting.color) style.color = formatting.color;
    
    switch (formatting.fontSize) {
      case 'small':
        style.fontSize = '0.875rem';
        break;
      case 'large':
        style.fontSize = '1.125rem';
        break;
      case 'xlarge':
        style.fontSize = '1.25rem';
        break;
      default:
        style.fontSize = '1rem';
    }
    
    return style;
  };

  return (
    <div className="rich-text-editor">
      {/* Title Input */}
      {onTitleChange && (
        <div className="rich-text-title-group">
          <input
            type="text"
            value={title ?? ''}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Paragraph title (optional)"
            className="rich-text-title-input"
          />
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="rich-text-toolbar">
        <button
          type="button"
          onClick={() => setShowFormatting(!showFormatting)}
          className="rich-text-toggle-btn"
          title="Toggle formatting options"
        >
          ✏️ Format
        </button>
        
        {showFormatting && (
          <div className="rich-text-formatting-options">
            <button
              type="button"
              onClick={() => toggleFormat('bold')}
              className={`rich-text-format-btn ${formatting.bold ? 'active' : ''}`}
              title="Bold"
            >
              <strong>B</strong>
            </button>
            
            <button
              type="button"
              onClick={() => toggleFormat('italic')}
              className={`rich-text-format-btn ${formatting.italic ? 'active' : ''}`}
              title="Italic"
            >
              <em>I</em>
            </button>
            
            <button
              type="button"
              onClick={() => toggleFormat('highlight')}
              className={`rich-text-format-btn ${formatting.highlight ? 'active' : ''}`}
              title="Highlight"
            >
              🟡
            </button>
            
            <select
              value={formatting.fontSize || 'normal'}
              onChange={(e) => setFontSize(e.target.value as unknown as 'small' | 'normal' | 'large' | 'xlarge')}
              className="rich-text-font-size"
            >
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="xlarge">Extra Large</option>
            </select>
            
            <input
              type="color"
              value={formatting.color || '#ffffff'}
              onChange={(e) => setColor(e.target.value)}
              className="rich-text-color-picker"
              title="Text Color"
            />
          </div>
        )}
      </div>

      {/* Text Area */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rich-text-textarea"
        rows={4}
        style={getTextStyle()}
      />
    </div>
  );
} 