# AI Chat Assistant

This documentation explains the AI Chat Assistant implementation for the VTEX Developer Portal.

## Overview

The AI Chat Assistant provides contextual help to users browsing the documentation. It appears as a floating chat button in the bottom-right corner that works across all device sizes - mobile, tablet, and desktop.

## Features

### Context Awareness
The AI assistant automatically detects:
- Current page path and URL
- Page title and section  
- Page content and headings
- Document structure

### Responsive Design
- **All Devices**: Single floating chat interface that adapts to screen size
- **Mobile**: Full-width chat window
- **Tablet/Desktop**: Fixed-width chat window with enhanced features

### Session Management
- Maintains conversation history during the session
- Generates unique session IDs for each user
- Preserves context across messages

## Components

### FloatingAIChat (`src/components/floating-ai-chat/`)
- Single component that works across all screen sizes
- Floating button that expands to chat interface
- Responsive design optimized for each device type
- SSR-safe implementation

## Integration

The AI chat is automatically included in all pages through the main layout component (`src/components/layout.tsx`).

```tsx
// Both components are included in the layout
<FloatingAIChat />
<DesktopAIChat />
```

## Configuration

### Environment Variables
Set the AI platform URL in your environment:

```env
NEXT_PUBLIC_AI_PLATFORM_URL=http://localhost:8000
```

### API Integration
The chat uses the `AIPlatformAPI` service (`src/utils/services/ai-platform-api.ts`) to communicate with your AI backend.

Required API endpoints:
- `POST /interact` - Send messages to the AI
- `GET /health` - Health check endpoint

### Message Format
Messages sent to the AI include page context:

```
[Current page: API Reference > Orders API in API Reference section (/docs/api-reference/orders-api)]
[Page headings: Overview, Authentication, Endpoints, Examples]
[Page content preview: This API allows you to manage orders...]
User question: How do I create an order?
```

## Styling

Both components use the VTEX brand design system:
- Primary color: `#E31C58` (VTEX Pink)
- Background: `#F8F9FA` (Light Gray)
- Text: `#142032` (Dark Blue)
- Border: `#E7E9EE` (Light Border)

## Usage Tips

1. **Page Context**: The AI automatically knows what page you're on and can provide relevant help
2. **Session Continuity**: Conversations persist during your session
3. **Responsive**: Works seamlessly across all device sizes
4. **Minimizable**: Desktop version can be minimized when not needed

## Customization

### Styling
Modify the styles in:
- `src/components/floating-ai-chat/styles.ts`
- `src/components/desktop-ai-chat/styles.ts`

### Content Extraction
The components automatically extract:
- Page title from document.title
- Content from main article areas
- Headings (h1-h4) for context
- URL path and segments

### Positioning
- **Floating**: Bottom right corner with z-index 9999
- **Desktop**: Top right at 100px from top, 20px from right edge

## Development

### Adding New Features
1. Update the message interface in `src/utils/typings/ai-platform.ts`
2. Modify the context extraction logic in the components
3. Update the API service if needed

### Testing
The chat includes error handling and fallback messages for API failures.

## Browser Compatibility

Works in all modern browsers that support:
- CSS Grid and Flexbox
- ES6+ JavaScript features
- Fetch API
- CSS custom properties

## Performance

- Lazy loads chat interface until first interaction
- Optimized scroll behavior
- Efficient DOM queries for content extraction
- Session-based caching
