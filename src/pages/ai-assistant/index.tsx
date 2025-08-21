import { AIChat } from '../../components/ai-chat';

export default function AIAssistantPage() {
  return (
      <div className="ai-assistant-page">
        <h1>VTEX AI Assistant</h1>
        <p>Ask questions about VTEX development, APIs, and documentation.</p>
        <AIChat />
      </div>
  );
}