import { Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Statue, epochs } from '../App';

type ChatbotProps = {
  statue: Statue;
  onClose: () => void;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function Chatbot({ statue, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hallo! Ich bin ${statue.name}, geschaffen von ${statue.artist}. Frag mich gern nach meiner Geschichte, Entstehung oder kulturellen Bedeutung!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const epochName = epochs[statue.period]?.name ?? statue.period;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    const includesWhen = lowerQuestion.includes('when') || lowerQuestion.includes('wann');
    const includesCreated =
      lowerQuestion.includes('created') ||
      lowerQuestion.includes('made') ||
      lowerQuestion.includes('built') ||
      lowerQuestion.includes('geschaffen') ||
      lowerQuestion.includes('erschaffen') ||
      lowerQuestion.includes('gebaut');
    const includesWho = lowerQuestion.includes('who') || lowerQuestion.includes('wer');
    const includesWhere = lowerQuestion.includes('where') || lowerQuestion.includes('wo');
    const includesFound =
      lowerQuestion.includes('found') ||
      lowerQuestion.includes('discovered') ||
      lowerQuestion.includes('gefunden') ||
      lowerQuestion.includes('entdeckt');
    const includesNow =
      lowerQuestion.includes('now') ||
      lowerQuestion.includes('located') ||
      lowerQuestion.includes('see') ||
      lowerQuestion.includes('jetzt') ||
      lowerQuestion.includes('heute') ||
      lowerQuestion.includes('stehen') ||
      lowerQuestion.includes('ansehen');
    const includesDamage =
      lowerQuestion.includes('damage') ||
      lowerQuestion.includes('missing') ||
      lowerQuestion.includes('broken') ||
      lowerQuestion.includes('arm') ||
      lowerQuestion.includes('head') ||
      lowerQuestion.includes('schaden') ||
      lowerQuestion.includes('beschädigt') ||
      lowerQuestion.includes('fehl') ||
      lowerQuestion.includes('kopf');
    const includesMaterial =
      lowerQuestion.includes('material') ||
      lowerQuestion.includes('made of') ||
      lowerQuestion.includes('marble') ||
      lowerQuestion.includes('bronze') ||
      lowerQuestion.includes('woraus') ||
      lowerQuestion.includes('marmor') ||
      lowerQuestion.includes('aus welchem');
    const includesMeaning =
      lowerQuestion.includes('meaning') ||
      lowerQuestion.includes('represent') ||
      lowerQuestion.includes('symbolize') ||
      lowerQuestion.includes('bedeut') ||
      lowerQuestion.includes('symbol');
    const includesSize =
      lowerQuestion.includes('size') ||
      lowerQuestion.includes('big') ||
      lowerQuestion.includes('tall') ||
      lowerQuestion.includes('height') ||
      lowerQuestion.includes('groß') ||
      lowerQuestion.includes('gross') ||
      lowerQuestion.includes('höhe') ||
      lowerQuestion.includes('hoch');
    const includesPeriod =
      lowerQuestion.includes('period') ||
      lowerQuestion.includes('era') ||
      lowerQuestion.includes('time') ||
      lowerQuestion.includes('epoche') ||
      lowerQuestion.includes('zeit');
    const includesTechnique =
      lowerQuestion.includes('technique') ||
      (lowerQuestion.includes('how') && lowerQuestion.includes('made')) ||
      lowerQuestion.includes('technik') ||
      (lowerQuestion.includes('wie') && lowerQuestion.includes('gemacht')) ||
      lowerQuestion.includes('angefertigt');
    const includesThank =
      lowerQuestion.includes('thank') || lowerQuestion.includes('danke');
    const includesHello =
      lowerQuestion.includes('hello') ||
      lowerQuestion.includes('hi ') ||
      lowerQuestion.startsWith('hi') ||
      lowerQuestion.includes('hey') ||
      lowerQuestion.includes('hallo') ||
      lowerQuestion.includes('servus') ||
      lowerQuestion.includes('moin');

    // Context-aware responses based on the question
    if (includesWhen && includesCreated) {
      return `Ich entstand in der Epoche ${epochName}, genauer gesagt im Jahr ${statue.year}. Es war eine bemerkenswerte Zeit für Kunst und Bildhauerei!`;
    }

    if (
      includesWho &&
      (includesCreated ||
        lowerQuestion.includes('artist') ||
        lowerQuestion.includes('künstler'))
    ) {
      return `Geschaffen wurde ich von ${statue.artist}, einer herausragenden Persönlichkeit der Epoche ${epochName}. Ihr Können und ihre Vision haben mich zum Leben erweckt.`;
    }

    if (includesWhere && includesFound) {
      return `Gefunden wurde ich in ${statue.foundLocation}. Über meinen Info-Bereich kannst du den Ort direkt auf Google Maps ansehen.`;
    }

    if (includesWhere && includesNow) {
      return `Aktuell findest du mich im ${statue.location}. Dort werde ich bewahrt, damit Menschen aus aller Welt mich bestaunen können.`;
    }

    if (statue.damages && includesDamage) {
      const damageParts = statue.damages.map((d) => d.part.toLowerCase()).join(' und ');
      return `Im Laufe der Jahrhunderte habe ich meine ${damageParts} verloren. ${statue.damages[0].description} Trotzdem gelte ich weiterhin als Meisterwerk!`;
    }

    if (includesMaterial) {
      return `Ich bin aus Marmor gearbeitet, einem in der Epoche ${epochName} besonders geschätzten Material, weil es Schönheit und gute Bearbeitbarkeit verbindet. Der Stein wurde sorgfältig ausgewählt und mit großer Präzision geformt.`;
    }

    if (includesMeaning) {
      return `${statue.description} Ich stehe nicht nur für künstlerisches Können, sondern auch für die Werte und Vorstellungen meiner Zeit.`;
    }

    if (includesSize) {
      if (statue.id === 'david') {
        return `Ich bin beeindruckende 17 Fuß (5,17 Meter) groß! Ich wurde aus einem einzigen Marmorblock gehauen, was meine Dimensionen noch außergewöhnlicher macht.`;
      }
      return `Ich habe Lebensgröße und wurde nach den Gestaltungsprinzipien der Epoche ${epochName} sorgfältig proportioniert.`;
    }

    if (includesPeriod) {
      return `Ich entstamme der Epoche ${epochName} und wurde ${statue.year} geschaffen. Diese Zeit brachte bedeutende Entwicklungen in der Kunst- und Bildhauergeschichte mit sich.`;
    }

    if (includesTechnique) {
      return `Ich entstand mit traditionellen Bildhauertechniken der Epoche ${epochName}. Mein Schöpfer ${statue.artist} nutzte Meißel, Spitzen und viel Planung, um den Rohmarmor in meine heutige Form zu verwandeln.`;
    }

    if (includesThank) {
      return `Sehr gern! Es freut mich, meine Geschichte mit dir zu teilen. Frag ruhig weiter!`;
    }

    if (includesHello) {
      return `Willkommen! Schön, dass du mehr über mich erfahren möchtest. Was interessiert dich?`;
    }

    // Default response
    return `Spannende Frage zu ${statue.name}! Hier ein erster Einblick: ${
      statue.description.split('.')[0]
    }. Möchtest du etwas Bestimmtes über meine Entstehung, Geschichte oder Bedeutung erfahren?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(
      () => {
        const response = generateResponse(input);
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000
    );
  };

  const quickQuestions = [
    'Wann wurdest du geschaffen?',
    'Wer hat dich erschaffen?',
    'Wo wurdest du gefunden?',
    'Erzähl mir von deinen Schäden',
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
            <h2 className="text-white">Chat mit {statue.name}</h2>
            <p className="text-sm text-white/90">Frag mich alles!</p>
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
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
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
                <div
                  className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 bg-neutral-50 dark:bg-neutral-900">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
            Schnellfragen:
          </p>
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
            placeholder="Stell eine Frage..."
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
