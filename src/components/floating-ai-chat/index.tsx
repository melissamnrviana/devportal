import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text, Button } from '@vtex/brand-ui';
import AIPlatformAPI from '../../utils/services/ai-platform-api';
import { MessageRequest, MessageResponse } from '../../utils/typings/ai-platform';
import styles from './styles';
import FormattedMessage from './FormattedMessage';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PageContext {
  path: string;
  title: string;
  section: string;
  content?: string;
  headings?: string[];
}

export const FloatingAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiClient = new AIPlatformAPI(
    process.env.NEXT_PUBLIC_AI_PLATFORM_URL || 'http://localhost:8000'
  );

  // Only mount on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentPageContext = (): PageContext => {
    const path = router.asPath;
    const pathSegments = path.split('/').filter(Boolean);
    
    let section = 'Home';
    let title = 'VTEX Developer Portal';
    let content = '';
    const headings: string[] = [];

    if (pathSegments.length > 0) {
      if (pathSegments[0] === 'docs') {
        section = pathSegments[1] ? pathSegments[1].replace('-', ' ') : 'Documentation';
        title = pathSegments.slice(1).join(' > ').replace(/-/g, ' ');
        
        // Try to extract page content and headings from the DOM (client-side only)
        if (isMounted && typeof window !== 'undefined' && document) {
          const mainContent = document.querySelector('[data-testid="article-content"]') || 
                             document.querySelector('main') ||
                             document.querySelector('.article-content') ||
                             document.querySelector('article');
          
          if (mainContent) {
            const textContent = mainContent.textContent || '';
            // Get first 800 characters as context
            content = textContent.substring(0, 800).trim();
            
            // Extract headings for better context
            const headingElements = mainContent.querySelectorAll('h1, h2, h3, h4');
            headingElements.forEach(heading => {
              const text = heading.textContent?.trim();
              if (text) headings.push(text);
            });
          }
          
          // Also try to get the document title
          if (document.title && document.title !== 'VTEX Developer Portal') {
            title = document.title;
          }
        }
      } else {
        section = pathSegments[0].replace('-', ' ');
        title = pathSegments.join(' > ').replace(/-/g, ' ');
      }
    }

    return {
      path,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      section: section.charAt(0).toUpperCase() + section.slice(1),
      content,
      headings
    };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const pageContext = getCurrentPageContext();
    let contextualMessage = `[Current page: ${pageContext.title} in ${pageContext.section} section (${pageContext.path})]`;
    
    if (pageContext.headings && pageContext.headings.length > 0) {
      contextualMessage += `[Page headings: ${pageContext.headings.join(', ')}]`;
    }
    
    if (pageContext.content) {
      contextualMessage += `[Page content preview: ${pageContext.content}...]`;
    }
    
    contextualMessage += ` User question: ${input}`;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const request: MessageRequest = {
        message: contextualMessage,
        session_id: sessionId
      };

      const response: MessageResponse = await apiClient.sendMessage(request);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Don't render on server-side
  if (!isMounted) {
    return null;
  }

  return (
    <Box sx={styles.container}>
      {isOpen && (
        <Box sx={styles.chatWindow}>
          <Flex sx={styles.chatHeader}>
            <Text sx={styles.headerTitle}>AI Assistant</Text>
            <Button 
              sx={styles.closeButton} 
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ×
            </Button>
          </Flex>

          <Box sx={styles.messagesContainer}>
            {messages.length === 0 && (
              <Box sx={styles.welcomeMessage}>
                <Text sx={styles.welcomeText}>
                  Hi! I'm here to help you with VTEX documentation. I can see you're currently on the{' '}
                  <strong>{getCurrentPageContext().title}</strong> page in the{' '}
                  <strong>{getCurrentPageContext().section}</strong> section.
                </Text>
                <Text sx={styles.welcomeSubtext}>
                  Ask me anything about VTEX APIs, guides, or this specific page!
                </Text>
              </Box>
            )}
            
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={styles.messageContainer(message.role)}
              >
                <Box sx={styles.message(message.role)}>
                  {message.role === 'assistant' ? (
                    <FormattedMessage content={message.content} />
                  ) : (
                    <Text sx={styles.messageContent}>{message.content}</Text>
                  )}
                  <Text sx={styles.messageTimestamp}>
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </Box>
              </Box>
            ))}

            {isLoading && (
              <Box sx={styles.messageContainer('assistant')}>
                <Box sx={styles.message('assistant')}>
                  <Text sx={styles.messageContent}>Thinking...</Text>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={styles.inputContainer}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about VTEX..."
              disabled={isLoading}
              style={{
                width: '100%',
                minHeight: '44px',
                maxHeight: '120px',
                padding: '12px',
                border: '1px solid #E7E9EE',
                borderRadius: '8px',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              sx={styles.sendButton}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}

      <Button 
        sx={styles.toggleButton(isOpen)} 
        onClick={toggleChat}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
      >
        {isOpen ? '✕' : '💬'}
      </Button>
    </Box>
  );
};

export default FloatingAIChat;
