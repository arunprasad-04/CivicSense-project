'use client';

import { useState } from 'react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Add user message
    setMessages((prev) => [...prev, "You: " + userMessage]);

    try {
      setLoading(true);

      // Show typing indicator
      setMessages((prev) => [...prev, "Bot: typing..."]);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // Replace "typing..." with actual reply
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = "Bot: " + data.reply;
        return updated;
      });

    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = "Bot: AI unavailable right now.";
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 💬 Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {/* 💬 Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-xl p-4 z-50 border">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-sm">CivicSense Assistant</h2>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="h-48 overflow-y-auto text-sm space-y-1 mb-3">
            {messages.length === 0 ? (
              <p className="text-gray-400">Ask something...</p>
            ) : (
              messages.map((m, i) => (
                <p key={i}>{m}</p>
              ))
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="border flex-1 p-2 rounded text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 text-white px-3 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}