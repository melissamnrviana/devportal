import { MessageRequest, MessageResponse } from "utils/typings/ai-platform";

class AIPlatformAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async sendMessage(request: MessageRequest): Promise<MessageResponse> {
    const response = await fetch(`${this.baseURL}/interact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return response.json();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
export default AIPlatformAPI;