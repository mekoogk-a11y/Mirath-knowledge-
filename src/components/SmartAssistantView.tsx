import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, AlertCircle, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

const SAMPLE_QUESTIONS = [
  'ما هي شروط استحقاق الزوجة للربع؟',
  'ما هي المسألة المنبرية ولماذا سميت بذلك؟',
  'متى ترث الأم الثلث كاملاً ومتى ترث السدس؟',
  'ما الفرق بين حجب الحرمان وحجب النقصان؟',
  'كيف تُقسم تركة من مات وترك بنتاً وزوجة؟',
];

export const SmartAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'السلام عليكم ورحمة الله وبركاته. أهلاً بك في مساعد المواريث الذكي المتخصص حصرياً في علم الفرائض وأحكام التركات في الشريعة الإسلامية. كيف يمكنني إفادتك اليوم؟',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6),
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'assistant',
            text: data.reply,
          },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'assistant',
            text: `تنبيه: ${data.error}`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: 'عذراً، تعذر الاتصال بخادم المساعد الذكي حالياً. يرجى التأكد من تشغيل الخادم والاتصال بالإنترنت.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e382c]/10 text-[#0e382c] border border-[#c5a059]/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>مستشار الفرائض التفاعلي</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[#0e382c]">
          مساعد المواريث الذكي
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          اطرح استفساراتك الفقهية حول الحجب، الفروض، العصبات، والمسائل الخلافية وفق مذهب جمهور الفقهاء.
        </p>
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-xl bg-white border border-[#c5a059]/30 text-[#0e382c] hover:bg-[#c5a059]/10 transition shadow-2xs disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-2xl border border-[#c5a059]/40 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-right">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                    isUser
                      ? 'bg-[#c5a059] text-[#0e382c] font-bold'
                      : 'bg-[#0e382c] text-[#f3e5ab]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-[#0e382c] text-white rounded-tl-xs'
                      : 'bg-[#fbf9f4] text-gray-800 border border-[#c5a059]/20 rounded-tr-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0e382c] text-[#f3e5ab] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#fbf9f4] border border-[#c5a059]/20 rounded-2xl rounded-tr-xs p-4 text-xs text-gray-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c5a059]" />
                <span>جاري البحث في القواعد الفقهية والأدلة...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#fbf9f4] border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="اكتب سؤالك في المواريث والفرائض..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm focus:border-[#0e382c] outline-hidden text-right"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#0e382c] text-white hover:bg-[#155443] transition disabled:opacity-40 flex items-center justify-center shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4 text-[#c5a059] rotate-180" />
            </button>
          </form>

          <p className="text-[10px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3 text-[#c5a059]" />
            <span>هذا المساعد للأغراض التعليمية والإرشادية، وللقسمة القضائية والنزاعات يجب مراجعة المحاكم الشرعية.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
