'use client';

import React, { useState, useCallback } from 'react';
import { detectLanguage } from '@/lib/languageUtils';
import { OpenAI } from 'openai';

interface ChatInterfaceProps {
  menuItems: Array<{
    name: string;
    description: string;
    category?: string;
    
  }>;
  language: string;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  language?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ menuItems }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_AIMLAPI_KEY || '',
    baseURL: process.env.NEXT_PUBLIC_AIMLAPI_URL,
    dangerouslyAllowBrowser: true
  });

  const processUserQuery = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const detectedLanguage = detectLanguage(query);
      const menuContext = menuItems.map(item => 
        `${item.name}: ${item.description}`
      ).join('\n');

      const completion = await api.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "system",
            content: `You are a helpful flight menu assistant. 
            Use the following menu context to answer questions:
            ${menuContext}
            
            Key guidelines:
            - Answer questions about menu items
            - Support dietary restrictions
            - Be helpful and precise
            - Respond in the language: ${detectedLanguage}`
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 256
      });

      const aiResponse = completion.choices[0].message.content || 'I could not find an answer.';

      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          text: query, 
          sender: 'user', 
          language: detectedLanguage 
        },
        { 
          id: Date.now() + 1, 
          text: aiResponse, 
          sender: 'assistant', 
          language: detectedLanguage 
        }
      ]);
    } catch (error) {
      console.error('Chat processing error:', error);
      setError('Sorry, there was an error processing your request.');
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          text: 'Sorry, there was an error processing your request.', 
          sender: 'assistant' 
        }
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  }, [menuItems, api]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      processUserQuery(input);
    }
  };

  return (
    <div className="border rounded-lg shadow-md">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 text-center">
          {error}
        </div>
      )}
      <div className="h-96 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`mb-2 p-2 rounded-lg max-w-[80%] 
              ${msg.sender === 'user' 
                ? 'bg-blue-100 text-blue-800 self-end ml-auto' 
                : 'bg-gray-100 text-gray-800 mr-auto'}
            `}
          >
            <p>{msg.text}</p>
            {msg.language && (
              <span className="text-xs text-gray-500 block mt-1">
                ({msg.language})
              </span>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-500">
            Processing your request...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the menu..."
          className="flex-grow p-2 border rounded-l-lg"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded-r-lg"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;