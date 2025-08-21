import type { SxStyleProp } from '@vtex/brand-ui';

const desktopContainer: SxStyleProp = {
  position: 'fixed',
  top: '100px',
  right: '20px',
  width: '320px',
  zIndex: 1000,
  display: ['none', 'none', 'none', 'none', 'block'], // Only show on xl screens
};

const desktopChatWindow = (isMinimized: boolean): SxStyleProp => ({
  backgroundColor: 'white',
  borderRadius: '12px',
  border: '1px solid #E7E9EE',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  maxHeight: isMinimized ? '50px' : '500px',
  transition: 'max-height 0.3s ease-in-out',
});

const desktopHeader: SxStyleProp = {
  padding: '12px 16px',
  backgroundColor: '#F8F9FA',
  borderBottom: '1px solid #E7E9EE',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#F0F2F5',
  },
};

const desktopHeaderTitle: SxStyleProp = {
  fontWeight: '600',
  fontSize: '14px',
  color: '#142032',
  margin: 0,
};

const minimizeButton: SxStyleProp = {
  background: 'transparent',
  border: 'none',
  fontSize: '12px',
  cursor: 'pointer',
  color: '#A1A8B3',
  padding: '2px 4px',
  minWidth: 'auto',
  height: 'auto',
  '&:hover': {
    color: '#142032',
    backgroundColor: 'transparent',
  },
};

const desktopMessagesContainer: SxStyleProp = {
  height: '300px',
  overflowY: 'auto',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const desktopWelcomeMessage: SxStyleProp = {
  padding: '16px',
  backgroundColor: '#F8F9FA',
  borderRadius: '6px',
  textAlign: 'left',
};

const welcomeText: SxStyleProp = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#5B6E84',
  margin: 0,
  marginBottom: '6px',
};

const welcomeSubtext: SxStyleProp = {
  fontSize: '11px',
  color: '#A1A8B3',
  margin: 0,
};

const desktopMessageContainer = (role: 'user' | 'assistant'): SxStyleProp => ({
  display: 'flex',
  justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
  width: '100%',
});

const desktopMessage = (role: 'user' | 'assistant'): SxStyleProp => ({
  maxWidth: '85%',
  padding: '8px 12px',
  borderRadius: role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
  backgroundColor: role === 'user' ? '#E31C58' : '#F8F9FA',
  color: role === 'user' ? 'white' : '#142032',
  wordBreak: 'break-word',
  fontSize: '13px',
  lineHeight: '1.4',
});

const messageContent: SxStyleProp = {
  fontSize: '13px',
  lineHeight: '1.4',
  margin: 0,
};

const desktopInputContainer: SxStyleProp = {
  padding: '12px',
  borderTop: '1px solid #E7E9EE',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const desktopSendButton: SxStyleProp = {
  alignSelf: 'flex-end',
  backgroundColor: '#E31C58',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: '500',
  cursor: 'pointer',
  minWidth: 'auto',
  height: 'auto',
  '&:hover': {
    backgroundColor: '#C91550',
  },
  '&:disabled': {
    backgroundColor: '#E7E9EE',
    color: '#A1A8B3',
    cursor: 'not-allowed',
  },
};

export default {
  desktopContainer,
  desktopChatWindow,
  desktopHeader,
  desktopHeaderTitle,
  minimizeButton,
  desktopMessagesContainer,
  desktopWelcomeMessage,
  welcomeText,
  welcomeSubtext,
  desktopMessageContainer,
  desktopMessage,
  messageContent,
  desktopInputContainer,
  desktopSendButton,
};
