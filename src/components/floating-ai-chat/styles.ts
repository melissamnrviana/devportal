import type { SxStyleProp } from '@vtex/brand-ui';

const container: SxStyleProp = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 9999,
  display: 'flex', // Show on all screen sizes
  flexDirection: 'column',
  alignItems: 'flex-end',
};

const chatWindow: SxStyleProp = {
  width: ['calc(100vw - 40px)', '400px', '400px', '450px'], // Slightly larger on desktop
  height: ['calc(100vh - 120px)', '500px', '500px', '550px'], // Slightly taller on desktop
  maxWidth: '450px',
  backgroundColor: 'white',
  borderRadius: '12px',
  border: '1px solid #E7E9EE',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  mb: '12px',
  overflow: 'hidden',
};

const chatHeader: SxStyleProp = {
  padding: '16px 20px',
  borderBottom: '1px solid #E7E9EE',
  backgroundColor: '#F8F9FA',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '60px',
};

const headerTitle: SxStyleProp = {
  fontWeight: '600',
  fontSize: '16px',
  color: '#142032',
  margin: 0,
};

const closeButton: SxStyleProp = {
  background: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#A1A8B3',
  padding: '4px',
  minWidth: 'auto',
  height: 'auto',
  '&:hover': {
    color: '#142032',
    backgroundColor: 'transparent',
  },
};

const messagesContainer: SxStyleProp = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const welcomeMessage: SxStyleProp = {
  padding: '20px',
  backgroundColor: '#F8F9FA',
  borderRadius: '8px',
  textAlign: 'center',
};

const welcomeText: SxStyleProp = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#5B6E84',
  margin: 0,
  marginBottom: '8px',
};

const welcomeSubtext: SxStyleProp = {
  fontSize: '12px',
  color: '#A1A8B3',
  margin: 0,
};

const messageContainer = (role: 'user' | 'assistant'): SxStyleProp => ({
  display: 'flex',
  justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
  width: '100%',
});

const message = (role: 'user' | 'assistant'): SxStyleProp => ({
  maxWidth: '80%',
  padding: '12px 16px',
  borderRadius: role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  backgroundColor: role === 'user' ? '#E31C58' : '#F8F9FA',
  color: role === 'user' ? 'white' : '#142032',
  wordBreak: 'break-word',
});

const messageContent: SxStyleProp = {
  fontSize: '14px',
  lineHeight: '1.4',
  margin: 0,
  marginBottom: '4px',
};

const messageTimestamp: SxStyleProp = {
  fontSize: '11px',
  opacity: 0.7,
  margin: 0,
};

const inputContainer: SxStyleProp = {
  padding: '16px',
  borderTop: '1px solid #E7E9EE',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const sendButton: SxStyleProp = {
  alignSelf: 'flex-end',
  backgroundColor: '#E31C58',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#C91550',
  },
  '&:disabled': {
    backgroundColor: '#E7E9EE',
    color: '#A1A8B3',
    cursor: 'not-allowed',
  },
};

const toggleButton = (isOpen: boolean): SxStyleProp => ({
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  backgroundColor: isOpen ? '#F5F7FA' : '#E31C58',
  color: isOpen ? '#5B6E84' : 'white',
  border: isOpen ? '1px solid #E7E9EE' : 'none',
  fontSize: '20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: isOpen ? '0px 4px 16px rgba(0, 0, 0, 0.08)' : '0px 4px 16px rgba(227, 28, 88, 0.3)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: isOpen ? '#E7E9EE' : '#C91550',
    transform: 'scale(1.05)',
  },
  minWidth: '56px',
});

export default {
  container,
  chatWindow,
  chatHeader,
  headerTitle,
  closeButton,
  messagesContainer,
  welcomeMessage,
  welcomeText,
  welcomeSubtext,
  messageContainer,
  message,
  messageContent,
  messageTimestamp,
  inputContainer,
  sendButton,
  toggleButton,
};
