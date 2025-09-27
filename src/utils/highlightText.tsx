import React from 'react';

export const highlightText = (text: string, searchTerm: string): React.ReactElement => {
  if (!searchTerm || !searchTerm.trim()) {
    return <span>{text}</span>;
  }

  const trimmedSearchTerm = searchTerm.trim();

  const escapedSearchTerm = trimmedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        if (part && part.toLowerCase() === trimmedSearchTerm.toLowerCase()) {
          return (
            <mark
              key={index}
              style={{
                backgroundColor: '#ffeb3b',
                padding: '0 2px',
                fontWeight: '600',
                borderRadius: '2px'
              }}
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
