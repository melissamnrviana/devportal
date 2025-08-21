interface MessageRequest {
  message: string;
  session_id?: string;
}

interface MessageResponse {
  response: string;
  session_id: string;
  agent_name: string;
}

export type { MessageRequest, MessageResponse };