import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text, Button } from '@vtex/brand-ui';
import AIPlatformAPI from '../../utils/services/ai-platform-api';
import { MessageRequest, MessageResponse } from '../../utils/typings/ai-platform';
import styles from './styles';

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
}

export const DesktopAIChat: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiClient = new AIPlatformAPI(
    process.env.NEXT_PUBLIC_AI_PLATFORM_URL || 'http://localhost:8000'
  );

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

    if (pathSegments.length > 0) {
      if (pathSegments[0] === 'docs') {
        section = pathSegments[1] ? pathSegments[1].replace('-', ' ') : 'Documentation';
        title = pathSegments.slice(1).join(' > ').replace(/-/g, ' ');
        
        // Try to extract page content from the DOM
        const mainContent = document.querySelector('[data-testid="article-content"]') || 
                           document.querySelector('main') ||
                           document.querySelector('.article-content');
        
        if (mainContent) {
          const textContent = mainContent.textContent || '';
          // Get first 500 characters as context
          content = textContent.substring(0, 500).trim();
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
      content
    };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const pageContext = getCurrentPageContext();
    let contextualMessage = `[Current page: ${pageContext.title} in ${pageContext.section} section (${pageContext.path})]`;
    
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

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Box sx={styles.desktopContainer}>
      <Box sx={styles.desktopChatWindow(isMinimized)}>
        <Flex sx={styles.desktopHeader} onClick={toggleMinimize}>
          <Text sx={styles.desktopHeaderTitle}>💬 AI Assistant</Text>
          <Button 
            sx={styles.minimizeButton} 
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            {isMinimized ? '▲' : '▼'}
          </Button>
        </Flex>

        {!isMinimized && (
          <>
            <Box sx={styles.desktopMessagesContainer}>
              {messages.length === 0 && (
                <Box sx={styles.desktopWelcomeMessage}>
                  <Text sx={styles.welcomeText}>
                    Hi! I can help you with VTEX documentation.
                  </Text>
                  <Text sx={styles.welcomeSubtext}>
                    I can see you're on: <strong>{getCurrentPageContext().title}</strong>
                  </Text>
                </Box>
              )}
              
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={styles.desktopMessageContainer(message.role)}
                >
                  <Box sx={styles.desktopMessage(message.role)}>
                    <Text sx={styles.messageContent}>{message.content}</Text>
                  </Box>
                </Box>
              ))}

              {isLoading && (
                <Box sx={styles.desktopMessageContainer('assistant')}>
                  <Box sx={styles.desktopMessage('assistant')}>
                    <Text sx={styles.messageContent}>Thinking...</Text>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={styles.desktopInputContainer}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about this page..."
                disabled={isLoading}
                style={{
                  width: '100%',
                  minHeight: '40px',
                  maxHeight: '80px',
                  padding: '8px 12px',
                  border: '1px solid #E7E9EE',
                  borderRadius: '6px',
                  resize: 'none',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                sx={styles.desktopSendButton}
              >
                Send
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DesktopAIChat;
