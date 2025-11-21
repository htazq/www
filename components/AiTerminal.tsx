import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, Cpu, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { TERMINAL_WELCOME } from '../constants';

const AiTerminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Initial welcome sequence
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessages: ChatMessage[] = TERMINAL_WELCOME.map((text, i) => ({
        role: 'model',
        text,
        timestamp: Date.now() + i * 1000
      }));
      setMessages(initialMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(input);

    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ease-in-out shadow-2xl border border-slate-700 bg-slate-950/95 backdrop-blur-xl overflow-hidden
        ${isOpen
          ? 'bottom-4 right-4 w-[90vw] h-[60vh] md:w-[450px] md:h-[550px] rounded-lg'
          : 'bottom-4 right-4 w-14 h-14 rounded-full hover:scale-110 cursor-pointer'
        }
      `}
    >
      {/* Toggle Button State */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        >
          <Cpu className="w-6 h-6 animate-pulse-slow" />
        </button>
      )}

      {/* Open Terminal State */}
      {isOpen && (
        <div className="flex flex-col h-full font-mono text-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800 cursor-move select-none">
            <div className="flex items-center gap-2 text-cyan-400">
              <Terminal className="w-4 h-4" />
              <span className="font-bold tracking-wider">HAITANG.AI_CORE</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-md break-words ${
                    msg.role === 'user'
                      ? 'bg-cyan-900/30 text-cyan-100 border border-cyan-800/50'
                      : 'text-green-400 border-l-2 border-green-600 pl-3'
                  }`}
                >
                   {msg.role === 'model' && <span className="text-xs text-green-700 block mb-1">{'>'} SYSTEM_RESPONSE</span>}
                   {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-green-400 animate-pulse pl-3">
                {'>'} PROCESSING_QUERY...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-900/50 border-t border-slate-800 flex gap-2">
            <span className="text-cyan-500 pt-2">{'>'}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Execute command or ask query..."
              className="flex-1 bg-transparent text-slate-200 focus:outline-none placeholder-slate-600"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="text-cyan-500 hover:text-cyan-300 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiTerminal;
