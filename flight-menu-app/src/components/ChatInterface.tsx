'use client';

import React, { useState, FormEvent } from 'react';
import { useMenuStore } from '@/store/menuStore';
import { translate } from '@/lib/languageUtils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  language: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuItems = useMenuStore(state => state.menuItems);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          menuItems: menuItems
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

  return (
    <div className="border rounded-lg bg-gray-50 transition-all duration-300 mt-8">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold">{translate('Menu Chat', language)}</h2>
        <button 
          className="text-gray-600 hover:text-gray-800"
          aria-label={isExpanded ? 'Collapse Chat' : 'Expand Chat'}
        >
          {translate(isExpanded ? 'Collapse Chat' : 'Expand Chat', language)}
        </button>
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-[500px] p-4' : 'max-h-0'
      }`}>
        <div className="h-60 overflow-y-auto border p-2 mb-2 bg-white rounded">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded ${
                msg.role === 'assistant' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'bg-gray-50 text-gray-800'
              }`}
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
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            className="flex-1 border p-2 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={translate('Ask about menu items...', language)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={`w-20 px-2 py-2 rounded text-sm ${
              isLoading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            disabled={isLoading}
          >
            {translate('Send', language)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;