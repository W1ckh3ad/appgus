import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { Statue } from '../App';

type ChatbotProps = {
  statue: Statue;
  onClose: () => void;
  darkMode: boolean;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function Chatbot({ statue, onClose, darkMode }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am ${statue.name}, created by ${statue.artist}. Ask me anything about my history, creation, or cultural significance!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    // Context-aware responses based on the question
    if (lowerQuestion.includes('when') && (lowerQuestion.includes('created') || lowerQuestion.includes('made') || lowerQuestion.includes('built'))) {
      return `I was created during the ${statue.period} period, specifically in ${statue.year}. This was a remarkable time for art and sculpture!`;
    }
    
    if (lowerQuestion.includes('who') && (lowerQuestion.includes('created') || lowerQuestion.includes('made') || lowerQuestion.includes('artist'))) {
      return `I was created by ${statue.artist}, a masterful sculptor of the ${statue.period} period. Their skill and vision brought me to life!`;
    }
    
    if (lowerQuestion.includes('where') && (lowerQuestion.includes('found') || lowerQuestion.includes('discovered'))) {
      return `I was found in ${statue.foundLocation}. You can see the exact location on Google Maps from my information page!`;
    }
    
    if (lowerQuestion.includes('where') && (lowerQuestion.includes('now') || lowerQuestion.includes('located') || lowerQuestion.includes('see'))) {
      return `You can find me at ${statue.location}. I've been preserved there so people from all over the world can admire me.`;
    }
    
    if (statue.damages && (lowerQuestion.includes('damage') || lowerQuestion.includes('missing') || lowerQuestion.includes('broken') || lowerQuestion.includes('arm') || lowerQuestion.includes('head'))) {
      const damageParts = statue.damages.map(d => d.part.toLowerCase()).join(' and ');
      return `Over the centuries, I've lost my ${damageParts}. ${statue.damages[0].description} Despite this, I'm still considered a masterpiece!`;
    }
    
    if (lowerQuestion.includes('material') || lowerQuestion.includes('made of') || lowerQuestion.includes('marble') || lowerQuestion.includes('bronze')) {
      return `I'm crafted from marble, a material prized by sculptors of the ${statue.period} period for its beauty and workability. The marble was carefully selected and carved with incredible precision.`;
    }
    
    if (lowerQuestion.includes('meaning') || lowerQuestion.includes('represent') || lowerQuestion.includes('symbolize')) {
      return `${statue.description} I represent not just artistic skill, but also the cultural values and beliefs of my time.`;
    }
    
    if (lowerQuestion.includes('size') || lowerQuestion.includes('big') || lowerQuestion.includes('tall') || lowerQuestion.includes('height')) {
      if (statue.id === 'david') {
        return `I stand at an impressive 17 feet (5.17 meters) tall! I was carved from a single block of marble, which makes my size even more remarkable.`;
      }
      return `I'm a life-sized sculpture, carefully proportioned according to the artistic principles of the ${statue.period} period.`;
    }
    
    if (lowerQuestion.includes('period') || lowerQuestion.includes('era') || lowerQuestion.includes('time')) {
      return `I'm from the ${statue.period} period, created in ${statue.year}. This was an incredible time in art history, with major developments in sculpture and artistic technique.`;
    }
    
    if (lowerQuestion.includes('technique') || lowerQuestion.includes('how') && lowerQuestion.includes('made')) {
      return `I was created using traditional sculpting techniques of the ${statue.period} period. My creator, ${statue.artist}, used chisels, points, and careful planning to transform raw marble into the form you see today.`;
    }

    if (lowerQuestion.includes('thank')) {
      return `You're very welcome! I'm honored to share my story with you. Feel free to ask anything else!`;
    }

    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi ') || lowerQuestion.includes('hey')) {
      return `Greetings! I'm delighted you're interested in learning about me. What would you like to know?`;
    }

    // Default response
    return `That's an interesting question about ${statue.name}! Let me tell you: ${statue.description.split('.')[0]}. Is there something specific you'd like to know about my creation, history, or significance?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const quickQuestions = [
    'When were you created?',
    'Who made you?',
    'Where were you found?',
    'Tell me about your damages'
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="absolute inset-0 bg-white dark:bg-neutral-900 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white">Chat with {statue.name}</h2>
            <p className="text-sm text-white/90">Ask me anything!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 dark:bg-blue-700 text-white rounded-br-sm'
                  : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-sm shadow'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 bg-neutral-50 dark:bg-neutral-900">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Quick questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="flex-shrink-0 px-3 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-full focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}