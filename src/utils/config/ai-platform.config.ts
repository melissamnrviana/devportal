export const aiPlatformConfig = {
  apiUrl: process.env.NEXT_PUBLIC_AI_PLATFORM_URL || 'http://localhost:8000',
  defaultAgent: 'vtex-docs-assistant',
  features: {
    knowledgeBase: true,
    sessionPersistence: true,
    multiAgent: false
  }
};