import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { UserProfile } from '../types';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Lightbulb,
  FlaskConical,
  Flame,
  MessageCircle,
} from 'lucide-react';

interface AiTutorDrawerProps {
  user: UserProfile;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedPrompt?: string;
}

// Clean any leftover raw computer/LaTeX code into human-readable textbook chemistry
const sanitizeHumanChemistryText = (rawText: string): string => {
  if (!rawText) return '';
  return rawText
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\times/g, '×')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\longrightarrow/g, '→')
    .replace(/\\rightleftharpoons/g, '⇌')
    .replace(/\\circ/g, '°')
    .replace(/\^\\circ/g, '°')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\pm/g, '±')
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/cm\^3/g, 'cm³')
    .replace(/dm\^3/g, 'dm³')
    .replace(/mol dm\^-3/g, 'mol dm⁻³')
    .replace(/kJ mol\^-1/g, 'kJ mol⁻¹')
    .replace(/Fe\^\{?2\+\}?/g, 'Fe²⁺')
    .replace(/Fe\^\{?3\+\}?/g, 'Fe³⁺')
    .replace(/Cu\^\{?2\+\}?/g, 'Cu²⁺')
    .replace(/Zn\^\{?2\+\}?/g, 'Zn²⁺')
    .replace(/Pb\^\{?2\+\}?/g, 'Pb²⁺')
    .replace(/Ag\^\{?\+\}?/g, 'Ag⁺')
    .replace(/NO_3\^\{?-\}?/g, 'NO₃⁻')
    .replace(/SO_4\^\{?2-\}?/g, 'SO₄²⁻')
    .replace(/CO_3\^\{?2-\}?/g, 'CO₃²⁻')
    .replace(/Cl\^\{?-\}?/g, 'Cl⁻')
    .replace(/OH\^\{?-\}?/g, 'OH⁻')
    .replace(/H\^\{?\+\}?/g, 'H⁺');
};

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Dr. Molecule online. Ask any SPM Chemistry question for direct, accurate solutions and marking points.`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'How to remember insoluble sulfates?',
    'Observation for Fe²⁺ vs Fe³⁺ with NaOH and NH₃?',
    'Formula and calculation for standard cell voltage E°cell?',
    'Test for Nitrate ion (Brown Ring Test)?',
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          topic: 'SPM Chemistry',
          userRole: user.role,
          conversationHistory: messages
            .filter((m) => m.id !== 'm1')
            .map((m) => ({
              role: m.sender === 'user' ? 'user' : 'model',
              content: m.text,
            })),
          userContext: {
            name: user.name,
            form: user.form,
            role: user.role,
          },
        }),
      });

      const data = await res.json();
      const aiReplyText =
        data.text ||
        data.reply ||
        `Balanced chemical equation with state symbols is required: check reactant states and charge neutrality.`;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Ensure all ionic equations balance both mass and charge, with appropriate state symbols (s, l, g, aq).`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Mascot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl shadow-blue-200 border-2 border-white/60 flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95 cursor-pointer animate-bounce-subtle"
          title="Ask Dr. Molecule (AI SPM Chemistry Tutor)"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xl">
            🧪
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-black leading-tight">Dr. Molecule 🤖</span>
            <span className="block text-[10px] font-bold text-blue-100">Ask SPM Chemistry AI</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] bg-white rounded-3xl shadow-2xl border-2 border-blue-100 flex flex-col overflow-hidden animate-fadeIn">
          {/* Top Bar */}
          <div className="p-4 bg-blue-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30">
                🧪
              </div>
              <div>
                <h3 className="text-sm font-black flex items-center gap-1.5">
                  <span>Dr. Molecule</span>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">AI Tutor</span>
                </h3>
                <p className="text-[11px] text-blue-100 font-medium">SPM Chemistry Specialist</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                    🧪
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <div className="prose prose-xs max-w-none text-slate-800 space-y-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_strong]:text-slate-900 [&_strong]:font-bold [&_p]:my-1">
                      <ReactMarkdown>
                        {sanitizeHumanChemistryText(m.text)}
                      </ReactMarkdown>
                    </div>
                  )}
                  <span
                    className={`block text-[9px] mt-1.5 text-right font-bold ${
                      m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 p-2.5 rounded-2xl w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Dr. Molecule is formulating solution...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-[10px] font-bold text-slate-700 rounded-xl whitespace-nowrap border border-slate-200 transition cursor-pointer shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about SPM Chemistry..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 focus:outline-blue-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-lg shadow-blue-200 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
