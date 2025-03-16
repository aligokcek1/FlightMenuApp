# Flight Menu App :airplane:

A digital menu system built with Next.js and TypeScript, leveraging ChatGPT Vision API for menu image processing and interactive menu experiences.

## Architecture Overview

### Client-Side
- Built with Next.js using the App Router
- Components for image upload, menu display, and chat interface
- Responsive styling with Tailwind CSS

### Server-Side
- RESTful endpoints for chat and image processing
- OpenAI integration for query and image processing
- Secure middleware implementation

### State Management
- Zustand for centralized state management
- Handles menu items and application state

## Major Components

### Image Processing
- **ImageUploader**: Handles image file uploads
- **CameraCapture**: Enables direct photo capture
- Integration with GPT-4-mini API for text extraction

### Menu System
- **MenuParser**: Processes API responses
- **MenuDisplay**: Shows filtered and searchable items
- Support for multiple languages (English/Turkish)

### Chat Assistant
- Interactive query system for menu-related questions
- Real-time responses based on menu context

## Technologies Used

```plaintext
- Next.js - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- OpenAI API - Image/text processing
- Zustand - State management
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/aligokcek1/FlightMenuApp/
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
- Create .env.local file
- Add OpenAI API key:
```plaintext
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start development server:
```bash
npm run dev
```

## Usage Guide

1. **Menu Image Processing**
   - Upload image via drag-drop
   - Use camera capture feature
   - System extracts menu items automatically

2. **Menu Navigation**
   - Search and filter items
   - View item details and translations
   - Select items (one main course at a time)

3. **Chat Assistance**
   - Ask questions about menu items
   - Get dietary information
   - Request recommendations

4. **Language Options**
   - Switch between English and Turkish
   - Real-time interface updates

## Deployment

Optimized for Vercel deployment. Ensure environment variables are properly configured in production.

## Contributing

We welcome contributions and feedback. Please open issues or submit pull requests for improvements.

---

For more information or support, please open an issue in the repository.