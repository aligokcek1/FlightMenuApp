'use client';

import React, { useState, FormEvent, useEffect, useRef, useMemo } from 'react';
import { useMenuStore } from '@/store/menuStore';
import { translate } from '@/lib/languageUtils';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  language: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
  const welcomeMessages = useMemo(() => ({
    en: "Hello! I'm your menu assistant. I can help you with menu items, ingredients, and dietary information. How can I assist you today?",
    tr: "Merhaba! Ben menü asistanınızım. Size menü öğeleri, içerikler ve diyet bilgileri konusunda yardımcı olabilirim. Size nasıl yardımcı olabilirim?",
    fr: "Bonjour! Je suis votre assistant menu. Je peux vous aider avec les éléments du menu, les ingrédients et les informations diététiques. Comment puis-je vous aider aujourd'hui?",
    de: "Hallo! Ich bin Ihr Menüassistent. Ich kann Ihnen bei Menüpunkten, Zutaten und Ernährungsinformationen helfen. Wie kann ich Ihnen heute helfen?",
    es: "¡Hola! Soy tu asistente de menú. Puedo ayudarte con los elementos del menú, ingredientes e información dietética. ¿Cómo puedo ayudarte hoy?"
  }), []); // Empty dependency array since messages don't change

  const greetingMessages = useMemo(() => ({
    en: "Hi! Need help with the menu? 👋",
    tr: "Merhaba! Menü hakkında yardıma ihtiyacınız var mı? 👋",
    fr: "Bonjour! Besoin d'aide avec le menu? 👋",
    de: "Hallo! Brauchen Sie Hilfe mit dem Menü? 👋",
    es: "¡Hola! ¿Necesitas ayuda con el menú? 👋"
  }), []); // Also memoizing greetingMessages for consistency

  const menuItems = useMenuStore(state => state.menuItems);
  const [currentMenuItems, setCurrentMenuItems] = useState(menuItems);

  // Update initial message based on menu availability
  const getInitialMessage = (lang: string) => ({
    role: 'assistant' as const,
    content: menuItems.length === 0 
      ? translate('Please upload a menu first to start the conversation.', lang)
      : welcomeMessages[lang as keyof typeof welcomeMessages] || welcomeMessages.en
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage(language)]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Add useEffect to update welcome message when language changes
  useEffect(() => {
    setMessages(messages => [
      {
        role: 'assistant',
        content: welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en
      },
      ...messages.slice(1) // Keep all messages except the first one
    ]);
  }, [language, welcomeMessages]);

  // Modify this effect to only reset when menu items length changes
  useEffect(() => {
    const hasMenuChanged = menuItems.length !== currentMenuItems.length;
    
    if (hasMenuChanged) {
      setCurrentMenuItems(menuItems);
      // Reset chat to initial state with new menu
      setMessages([
        {
          role: 'assistant',
          content: menuItems.length > 0
            ? `${welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en}\n\n${
                translate('I see a new menu has been loaded. How can I help you with it?', language)
              }`
            : translate('Please upload a menu first to start the conversation.', language)
        }
      ]);
    } else {
      // Just update the current menu items reference without resetting messages
      setCurrentMenuItems(menuItems);
    }
  }, [menuItems, language, welcomeMessages, currentMenuItems]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          menuItems: currentMenuItems // Use current menu items
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      if (data.content) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.content
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new function to handle textarea height
  const handleTextAreaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`; // Max height of 150px
    setInput(textarea.value);
  };

  return (
    <div className="fixed bottom-6 left-6"> {/* Increased bottom and left margin */}
      {!isExpanded && (
        <div className="relative">
          <div className={`
            rounded-full shadow-xl overflow-hidden w-[100px] h-[100px] cursor-pointer 
            transition-transform hover:scale-105 
            ${menuItems.length > 0 ? 'animate-bounce' : 'opacity-75'}
          `}>
            <Image
              src="/ai_icon.png"
              alt="Chat Bubble"
              width={100}
              height={100}
              onClick={() => {
                setIsExpanded(true);
                setShowGreeting(false); 
              }}
              className="object-contain hover:brightness-110" /* Added hover effect */
            />
          </div>
          {showGreeting && menuItems.length > 0 && (
            <div className="absolute bottom-[90%] left-[90%] bg-white p-4 rounded-lg shadow-xl border-2 border-blue-200 w-64"> {/* Increased width, padding, and made border more prominent */}
              <div className="text-lg font-medium text-blue-600"> {/* Increased text size and added color */}
                {greetingMessages[language as keyof typeof greetingMessages] || greetingMessages.en}
              </div>
              <div className="absolute bottom-[15%] left-[-8px] transform rotate-45 w-4 h-4 bg-white border-l-2 border-b-2 border-blue-200"></div>
            </div>
          )}
        </div>
      )}

      <div className={`
        absolute bottom-0 left-0
        ${isExpanded ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}
        transition-all duration-300
        bg-white rounded-lg shadow-xl
        w-[350px] h-[500px]
        border border-gray-200
        flex flex-col
      `}>
        <div className="p-4 flex justify-between items-center bg-gray-50 rounded-t-lg border-b shrink-0">
          <h2 className="text-lg font-semibold">{translate('Menu Chat', language)}</h2>
          <button 
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        <div className="flex-1 flex flex-col h-[calc(500px-144px)] p-4">
          <div className="flex-1 overflow-y-auto border p-2 mb-2 bg-white rounded">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-2 p-2 rounded ${
                  msg.role === 'assistant' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-gray-50 text-gray-800'
                } whitespace-pre-wrap break-words`}
              >
                <strong>{translate(msg.role === 'assistant' ? 'Assistant:' : 'You:', language)}</strong>{' '}
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="text-gray-500 italic">
                {translate('Assistant is typing...', language)}
              </div>
            )}
          </div>
          <form onSubmit={sendMessage} className="flex space-x-2 shrink-0">
            <textarea
              ref={textareaRef}
              rows={1}
              className="flex-1 border p-2 rounded resize-none overflow-hidden min-h-[40px]"
              value={input}
              onChange={handleTextAreaHeight}
              placeholder={
                menuItems.length === 0 
                  ? translate('Please upload a menu first...', language)
                  : translate('Ask about menu items...', language)
              }
              disabled={isLoading || menuItems.length === 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage(e as unknown as FormEvent);
                  }
                }
              }}
            />
            <button 
              type="submit" 
              className={`px-4 py-2 rounded self-end ${
                isLoading || menuItems.length === 0
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isLoading || menuItems.length === 0}
            >
              {translate('Send', language)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;