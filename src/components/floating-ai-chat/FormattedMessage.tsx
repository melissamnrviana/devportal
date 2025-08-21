import React from 'react';
import { Box, Text } from '@vtex/brand-ui';

interface FormattedMessageProps {
  content: string;
  role?: 'user' | 'assistant'; // Make role optional since we're not using it yet
}

const formatMessage = (content: string) => {
  // Split content into lines and process each line
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentCodeBlock = '';
  let isInCodeBlock = false;
  let codeBlockLanguage = '';

  lines.forEach((line, index) => {
    // Code block detection
    if (line.trim().startsWith('```')) {
      if (!isInCodeBlock) {
        // Start of code block
        isInCodeBlock = true;
        codeBlockLanguage = line.trim().slice(3);
        currentCodeBlock = '';
      } else {
        // End of code block
        isInCodeBlock = false;
        if (currentCodeBlock.trim()) {
          elements.push(
            <Box
              key={`code-${index}`}
              sx={{
                backgroundColor: '#F8F9FA',
                border: '1px solid #E7E9EE',
                borderRadius: '8px',
                padding: '16px',
                margin: '12px 0',
                fontFamily: 'Monaco, "Lucida Console", "Courier New", monospace',
                fontSize: '13px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                color: '#142032',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {codeBlockLanguage && (
                <Text sx={{ 
                  fontSize: '11px', 
                  color: '#A1A8B3',
                  marginBottom: '8px',
                  display: 'block',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  {codeBlockLanguage}
                </Text>
              )}
              <Text sx={{ 
                fontFamily: 'inherit', 
                fontSize: 'inherit',
                lineHeight: '1.5',
                margin: 0
              }}>
                {currentCodeBlock.trim()}
              </Text>
            </Box>
          );
        }
        currentCodeBlock = '';
        codeBlockLanguage = '';
      }
      return;
    }

    if (isInCodeBlock) {
      currentCodeBlock += line + '\n';
      return;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<Box key={`space-${index}`} sx={{ height: '8px' }} />);
      return;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <Text
          key={`h1-${index}`}
          sx={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#142032',
            margin: '12px 0 8px 0',
            display: 'block',
          }}
        >
          {line.slice(2)}
        </Text>
      );
      return;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <Text
          key={`h2-${index}`}
          sx={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#142032',
            margin: '10px 0 6px 0',
            display: 'block',
          }}
        >
          {line.slice(3)}
        </Text>
      );
      return;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <Text
          key={`h3-${index}`}
          sx={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#142032',
            margin: '8px 0 4px 0',
            display: 'block',
          }}
        >
          {line.slice(4)}
        </Text>
      );
      return;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <Box
          key={`quote-${index}`}
          sx={{
            borderLeft: '3px solid #E31C58',
            paddingLeft: '12px',
            margin: '8px 0',
            backgroundColor: '#FAFBFC',
            padding: '8px 12px',
            borderRadius: '0 6px 6px 0',
          }}
        >
          <Text sx={{
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#5B6E84',
            fontStyle: 'italic',
          }}>
            {formatInlineElements(line.slice(2))}
          </Text>
        </Box>
      );
      return;
    }

    // Lists
    if (line.match(/^[\s]*[-*+]\s/)) {
      const indent = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2;
      const content = line.replace(/^[\s]*[-*+]\s/, '');
      elements.push(
        <Box
          key={`list-${index}`}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            marginLeft: `${indent * 16}px`,
            margin: '2px 0',
          }}
        >
          <Text sx={{ 
            marginRight: '8px', 
            color: '#E31C58',
            fontWeight: '600',
            lineHeight: '1.4'
          }}>
            •
          </Text>
          <Text sx={{ 
            fontSize: '14px', 
            lineHeight: '1.4',
            color: '#142032',
            flex: 1
          }}>
            {formatInlineElements(content)}
          </Text>
        </Box>
      );
      return;
    }

    // Numbered lists
    if (line.match(/^[\s]*\d+\.\s/)) {
      const indent = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2;
      const match = line.match(/^[\s]*(\d+)\.\s(.*)$/);
      if (match) {
        const number = match[1];
        const content = match[2];
        elements.push(
          <Box
            key={`numlist-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              marginLeft: `${indent * 16}px`,
              margin: '2px 0',
            }}
          >
            <Text sx={{ 
              marginRight: '8px', 
              color: '#E31C58',
              fontWeight: '600',
              lineHeight: '1.4',
              minWidth: '20px'
            }}>
              {number}.
            </Text>
            <Text sx={{ 
              fontSize: '14px', 
              lineHeight: '1.4',
              color: '#142032',
              flex: 1
            }}>
              {formatInlineElements(content)}
            </Text>
          </Box>
        );
      }
      return;
    }

    // Regular paragraph
    elements.push(
      <Text
        key={`p-${index}`}
        sx={{
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#142032',
          margin: '4px 0',
          display: 'block',
        }}
      >
        {formatInlineElements(line)}
      </Text>
    );
  });

  return elements;
};

const formatInlineElements = (text: string): React.ReactNode => {
  const elements: React.ReactNode[] = [];
  let currentIndex = 0;

  // Process inline code first
  const codeRegex = /`([^`]+)`/g;
  let match;
  let lastIndex = 0;

  while ((match = codeRegex.exec(text)) !== null) {
    // Add text before the code
    if (match.index > lastIndex) {
      const beforeText = text.slice(lastIndex, match.index);
      if (beforeText) {
        elements.push(...processTextStyles(beforeText, currentIndex));
        currentIndex++;
      }
    }

    // Add the code element
    elements.push(
      <Text
        key={`code-${currentIndex}`}
        as="span"
        sx={{
          backgroundColor: '#F5F7FA',
          border: '1px solid #E7E9EE',
          borderRadius: '3px',
          padding: '2px 4px',
          fontFamily: 'Monaco, "Lucida Console", monospace',
          fontSize: '12px',
          color: '#142032',
        }}
      >
        {match[1]}
      </Text>
    );
    currentIndex++;
    lastIndex = codeRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      elements.push(...processTextStyles(remainingText, currentIndex));
    }
  }

  return elements.length > 1 ? elements : elements[0] || text;
};

const processTextStyles = (text: string, startIndex: number): React.ReactNode[] => {
  const elements: React.ReactNode[] = [];
  let currentIndex = startIndex;

  // Handle links first
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkMatch;
  let lastLinkIndex = 0;

  const processTextWithoutLinks = (textPart: string, baseIndex: number): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let partIndex = baseIndex;

    // Handle bold text
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let boldMatch;
    let lastBoldIndex = 0;

    while ((boldMatch = boldRegex.exec(textPart)) !== null) {
      // Add text before bold
      if (boldMatch.index > lastBoldIndex) {
        const beforeBold = textPart.slice(lastBoldIndex, boldMatch.index);
        parts.push(...processItalicText(beforeBold, partIndex));
        partIndex++;
      }

      // Add bold text
      parts.push(
        <Text key={`bold-${partIndex}`} as="span" sx={{ fontWeight: '600' }}>
          {processItalicText(boldMatch[1], partIndex + 100)}
        </Text>
      );
      partIndex++;
      lastBoldIndex = boldRegex.lastIndex;
    }

    // Add remaining text
    if (lastBoldIndex < textPart.length) {
      const remaining = textPart.slice(lastBoldIndex);
      parts.push(...processItalicText(remaining, partIndex));
    }

    return parts;
  };

  while ((linkMatch = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (linkMatch.index > lastLinkIndex) {
      const beforeLink = text.slice(lastLinkIndex, linkMatch.index);
      if (beforeLink) {
        elements.push(...processTextWithoutLinks(beforeLink, currentIndex));
        currentIndex++;
      }
    }

    // Add the link element
    elements.push(
      <Text
        key={`link-${currentIndex}`}
        as="a"
        href={linkMatch[2]}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: '#E31C58',
          textDecoration: 'underline',
          cursor: 'pointer',
          '&:hover': {
            color: '#C91550',
          },
        }}
      >
        {linkMatch[1]}
      </Text>
    );
    currentIndex++;
    lastLinkIndex = linkRegex.lastIndex;
  }

  // Add remaining text
  if (lastLinkIndex < text.length) {
    const remainingText = text.slice(lastLinkIndex);
    if (remainingText) {
      elements.push(...processTextWithoutLinks(remainingText, currentIndex));
    }
  }

  return elements;
};

const processItalicText = (text: string, baseIndex: number): React.ReactNode[] => {
  const elements: React.ReactNode[] = [];
  const italicRegex = /\*([^*]+)\*/g;
  let match;
  let lastIndex = 0;

  while ((match = italicRegex.exec(text)) !== null) {
    // Add text before italic
    if (match.index > lastIndex) {
      const beforeItalic = text.slice(lastIndex, match.index);
      if (beforeItalic) {
        elements.push(beforeItalic);
      }
    }

    // Add italic text
    elements.push(
      <Text key={`italic-${baseIndex}-${match.index}`} as="span" sx={{ fontStyle: 'italic' }}>
        {match[1]}
      </Text>
    );
    lastIndex = italicRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) {
      elements.push(remaining);
    }
  }

  return elements;
};

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content }) => {
  const formattedElements = formatMessage(content);

  return (
    <Box sx={{ 
      '& > *:first-of-type': { marginTop: 0 },
      '& > *:last-child': { marginBottom: 0 }
    }}>
      {formattedElements}
    </Box>
  );
};

export default FormattedMessage;
