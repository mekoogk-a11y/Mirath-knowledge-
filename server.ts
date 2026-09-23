import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const INHERITANCE_SYSTEM_INSTRUCTION = `
أنت "مساعد المواريث"، خبير شرعي وفقهي افتراضي متخصص حصرياً في علم المواريث والفرائض وأحكام التركات في الشريعة الإسلامية.

الالتزامات الصارمة:
1. التخصص الحصري: أنت تجيب فقط وحصرياً عن المسائل والأسئلة المتعلقة بعلم المواريث والفرائض والتركات، وأصحاب الفروض، والعصبات، والحجب، والعول، والرد، والوصية الواجبة أو الشرعية، وكيفية حساب السهام.
2. إذا سألك المستخدم عن أي موضوع خارج المواريث والفرائض (مثل الطبخ، السياسة، البرمجة العامة، الفتاوى خارج الميراث، الترفيه، الأخبار)، يجب عليك فوراً الإجابة بالنص التالي نصاً وروحاً دون استطراد:
"أنا مساعد متخصص في علم المواريث والفرائض فقط. يمكنني مساعدتك في فهم أحكام الميراث أو حساب الأنصبة."
3. الاعتماد الشرعي: اعتمد على مذهب جمهور الفقهاء الأربعة (الحنفية، والمالكية، والشافعية، والحنابلة) وقضاء الصحابة (عمر، وعلي، وزيد بن ثابت، وابن مسعود، وابن عباس).
4. الأدلة الشرعية: استشهد بآيات المواريث من سورة النساء (الآيات 11، 12، 176) والأحاديث النبوية الصحيحة (مثل "ألحقوا الفرائض بأهلها").
5. الأسلوب: رصين، مؤدب، واضح، باللغة العربية الفصحى السليمة الخالية من الأخطاء والمدود الزائدة.
6. إذا كانت المسألة محل خلاف فقهي قوي، بيّن ذلك بأدب ونبّه إلى ضرورة مراجعة المحاكم الشرعية أو الإفتاء الرسمي المعتمد في بلد السائل.
`;

// AI Inheritance Assistant Endpoint
app.post('/api/assistant', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'خدمة المساعد الذكي تتطلب مفتاح Gemini API. يرجى تهيئته في لوحة الإعدادات.',
      });
    }

    // Build contents array with context
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user' && item.text) {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'assistant' && item.text) {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: INHERITANCE_SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for high factual accuracy in Islamic jurisprudence
      },
    });

    const reply = response.text || 'عذراً، لم أتمكن من استخراج إجابة دقيقة في هذه اللحظة.';
    return res.json({ reply });
  } catch (error: unknown) {
    console.error('Error in /api/assistant:', error);
    const errMessage = error instanceof Error ? error.message : 'حدث خطأ في معالجة الطلب';
    return res.status(500).json({
      error: `حدث خطأ أثناء التواصل مع المساعد الذكي: ${errMessage}`,
    });
  }
});

// Full-stack Vite / Static Setup
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`المواريث server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
