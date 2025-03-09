# Flight Menu App

Flight Menu App is a digital menu system for Turkish Airlines flights, built using Next.js and TypeScript. The app leverages OCR processing, image pre-processing, state management, and chat assistant functionality to provide an interactive menu experience.

## Architecture Overview

- **Client-Side (App):**
  - Built with Next.js using the new App Router.
  - Components include image upload/camera capture, menu items display, language selection, and chat interface.
  - Styling is provided via Tailwind CSS for responsive and modern UI.

- **Server-Side (API):**
  - Provides endpoints (e.g., `/api/chat`) for chat functionality.
  - Integrates with OpenAI to process user queries about the menu.
  - Uses middleware for adding security headers.

- **State Management:**
  - Zustand is used for managing shared state (menu items) across the application.
  
- **OCR & Image Processing:**
  - Tesseract.js is integrated for extracting text from uploaded or captured images.
  - A custom ImagePreprocessor enhances image quality before OCR processing.

## Major Components

- **ImageUploader & CameraCapture:**
  - Allow users to either upload a menu image or capture one from the camera.
  - Preprocess images and extract menu items via OCR.
  
- **MenuParser:**
  - Parses the raw OCR results and normalizes the text into structured menu items.
  - Detects sections (e.g., pre-landing) and avoids duplicate entries.

- **ChatInterface:**
  - A chat window that allows users to interact with an AI assistant.
  - Provides dynamic responses based on current menu items and user queries.
  
- **LanguageSelector:**
  - Enables switching between English and Turkish for a localized experience.

- **State Management (menuStore):**
  - Uses Zustand to manage and modify the list of menu items.
  - Supports toggling selections and handling unique behaviors like main course selection.

## Libraries & Technologies

- **Next.js:** React framework to manage server-side rendering and API endpoints.
- **TypeScript:** Ensures type safety and improved developer experience.
- **Tailwind CSS:** For rapid and responsive UI development.
- **Tesseract.js:** OCR processing for text extraction from menu images.
- **Zustand:** Lightweight state management library.
- **OpenAI API:** Provides AI chat functionality via GPT-3.5-turbo model.
- **franc-min:** Language detection for translating menu items.

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone <your-repository-url>
   cd flight-menu-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**
   - Create a `.env.local` file in the project root.
   - Set your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. **Run Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage Guide

1. **Uploading/ Capturing a Menu Image:**
   - Use the ImageUploader component to drag-and-drop or select an image.
   - Alternatively, click 'Take Photo' to use your device camera.
   - The application pre-processes and extracts text via OCR, then parses detected menu items.

2. **Viewing Menu Items:**
   - Parsed menu items are displayed in two sections: Regular and Pre-landing.
   - Each menu item card shows details, translation, and dietary information (if available).

3. **Selecting Menu Items:**
   - Click on a menu item to toggle its selection.
   - For main courses, you can only select one at a time.

4. **Chat Assistant:**
   - Use the ChatInterface to ask questions about the menu.
   - The assistant provides answers based on menu data and user queries.
   
5. **Language Switch:**
   - Use the LanguageSelector to toggle the interface language between English and Turkish.

## Deployment

Flight Menu App is optimized for deployment on platforms like Vercel. For production builds, ensure all environment variables are correctly set and consider adding further security measures via Next.js middleware.

## Contributing

Contributions and feedback are welcome. Feel free to open issues or submit pull requests for improvements.

---

Happy flying and bon appétit!
