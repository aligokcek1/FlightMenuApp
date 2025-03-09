'use client';

import React, { useState, FormEvent } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          messages: [...messages, userMessage]
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
    <div className="border p-4 mt-4 rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">Menu Chat</h2>
      <div className="h-60 overflow-y-auto border p-2 mb-2 bg-white">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-2 p-2 rounded ${
              msg.role === 'assistant' 
                ? 'bg-blue-50 text-blue-700' 
                : 'bg-gray-50 text-gray-800'
            }`}
          >
            <strong>{msg.role === 'assistant' ? 'Assistant:' : 'You:'}</strong>{' '}
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 italic">Assistant is typing...</div>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about menu items..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={`px-4 py-2 rounded ${
            isLoading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;