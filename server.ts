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

// Fallback candidate models in order of priority (handling transient 503 high-demand spikes)
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

// Offline knowledge base for fundamental inheritance queries if AI network experiences temporary outage
const INHERITANCE_KNOWLEDGE: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['اركان', 'أركان', 'ركن'],
    answer: `أركان الإرث في الشريعة الإسلامية ثلاثة أركان أساسية لا يقوم إلا بها جميعاً:
1. **المُوَرِّث (الميت):** وهو الشخص المتوفى حقيقةً (بمعاينة موته) أو حكماً (كالمفقود الذي يقضي القاضي بوفاته).
2. **الوارث (الحي):** وهو الشخص الذي يستحق نصيباً من التركة لقرابة أو نكاح، ويشترط تحقق حياته بعد موت المورث.
3. **الموروث (التركة):** وهو المال أو الحق أو العقار الذي خلفه الميت بعد سداد الديون والوصايا وتجهيز الجنازة.`,
  },
  {
    keywords: ['موانع', 'مانع'],
    answer: `موانع الإرث المتفق عليها بين جماهير الفقهاء ثلاثة:
1. **القتل:** القتل العمد العدوان لقول النبي ﷺ: «ليس للقاتل من الميراث شيء».
2. **اختلاف الدين:** فلا يرث المسلم الكافر ولا الكافر المسلم لقوله ﷺ: «لا يرث المسلم الكافر ولا الكافر المسلم».
3. **الرق:** لكون الرقيق لا يملك مالاً، وإنما ماله لسيده (وهذا الحكم غير مطبق لانتفاء الرق في عصرنا).`,
  },
  {
    keywords: ['شروط', 'شرط'],
    answer: `شروط الإرث في الفقه الإسلامي ثلاثة:
1. **تحقق موت المورِّث:** حقيقةً بالبينة الطبية أو حكماً بحكم القاضي.
2. **تحقق حياة الوارث عند موت المورِّث:** ولو تقديراً كالجنين في بطن أمه.
3. **العلم بالجهة المقتضية للإرث:** من قرابة أو زوجية مع تعيين درجته وعدم وجود مانع.`,
  },
  {
    keywords: ['فروض', 'اصحاب الفروض', 'أصحاب الفروض'],
    answer: `أصحاب الفروض هم الورثة المقدرة أنصبتهم في كتاب الله وسنة رسوله ﷺ، والفروض المقدرة ستة:
- **النصف (1/2):** للزوج (عدم الفرع الوارث)، البنت المنفردة، بنت الابن المنفردة، الأخت الشقيقة، والأخت لأب.
- **الربع (1/4):** للزوج (مع الفرع الوارث)، وللزوجة أو الزوجات (عدم الفرع الوارث).
- **الثمن (1/8):** للزوجة أو الزوجات (مع الفرع الوارث).
- **الثلثان (2/3):** للبنتين فأكثر، وبنات الابن، والأخوات الشقائق، والأخوات لأب (عند عدم المعصب).
- **الثلث (1/3):** للأم (عدم الفرع الوارث وعدم جمع من الإخوة)، وللإخوة لأم (اثنان فأكثر بالتساوي).
- **السدس (1/6):** للأب، الجد، الأم، الجدة، بنت الابن، الأخت لأب، والواحد من ولد الأم.`,
  },
  {
    keywords: ['عول', 'العول'],
    answer: `**العول** في علم الفرائض هو: زيادة في مجموع السهام المفروضة على أصل المسألة، مما يترتب عليه نقص في أنصبة جميع الورثة بنسبة سهامهم.
أول من قضى بالعول هو أمير المؤمنين عمر بن الخطاب رضي الله عنه بمشورة الصحابة (كالعباس وزيد بن ثابت)، حيث أدخل النقص على الجميع كالغُرماء في الدَّيْن، وأصول المسائل التي تعول هي: (6 تعول إلى 7 و8 و9 و10)، و(12 تعول إلى 13 و15 و17)، و(24 تعول إلى 27 فقط).`,
  },
  {
    keywords: ['رد', 'الرد'],
    answer: `**الرد** هو عكس العول: وهو زيادة في التركة بعد إعطاء أصحاب الفروض أنصبتهم عند عدم وجود عاصب يستغرق الباقي.
مذهب الجمهور (علي وابن مسعود والحنفية والحنابلة والمتأخرين من الشافعية والمالكية) يرد الفائض على ذوي الفروض النسبية بنسبة فروضهم، ولا يُرد على أحد الزوجين عند الجمهور حفظاً لأموال الأقارب.`,
  },
  {
    keywords: ['حجب', 'الحجب'],
    answer: `**الحجب** نوعان:
1. **حجب حرمان:** وهو إسقاط الوارث من الميراث بالكلية لوجود وارث أقرب منه (كالابن يحجب ابن الابن والإخوة، والأب يحجب الجد والإخوة).
   - ملاحظة: ستة من الورثة لا يُحجبون حجب حرمان أبداً: (الأب، الأم، الابن، البنت، الزوج، الزوجة).
2. **حجب نقصان:** وهو انتقال الوارث من نصيب أعلى إلى نصيب أقل (كانتقال الزوج من النصف إلى الربع بوجود الولد).`,
  },
  {
    keywords: ['عصبة', 'العصبات', 'عصبات'],
    answer: `العصبة هم كل وارث ليس له نصيب مقدر شرعاً، وإنما يأخذ كل التركة إذا انفرد، أو ما بقي بعد أصحاب الفروض، وهم ثلاثة أقسام:
1. **عصبة بالنفس:** وهم جميع ذكور القرابة عدا الأخ لأم (كالابن، ابن الابن، الأب، الجد، الأخ الشقيق، الأخ لأب، العم الشقيق، العم لأب).
2. **عصبة بالغير:** وهن الإناث ذوات الفروض اللاتي يتعصبن بأخوتهن (للذكر مثل حظ الأنثيين): كالبنت مع الابن، وبنت الابن مع ابن الابن، والأخت الشقيقة مع الأخ الشقيق، والأخت لأب مع الأخ لأب.
3. **عصبة مع الغير:** وهن الأخوات الشقائق أو لأب مع البنات أو بنات الابن لقول الصحابة: «اجعلوا الأخوات مع البنات عصبة».`,
  },
];

// Helper to find a fallback response from the knowledge base
function getFallbackKnowledge(text: string): string | null {
  const normalized = text.toLowerCase();
  for (const item of INHERITANCE_KNOWLEDGE) {
    if (item.keywords.some((kw) => normalized.includes(kw))) {
      return item.answer;
    }
  }
  return null;
}

// AI Inheritance Assistant Endpoint
app.post('/api/assistant', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
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

    // Try candidate models in order to withstand temporary demand spikes (503 / 429)
    let lastError: Error | null = null;
    let replyText: string | null = null;

    if (process.env.GEMINI_API_KEY) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: INHERITANCE_SYSTEM_INSTRUCTION,
              temperature: 0.2, // Low temperature for high factual accuracy in Islamic jurisprudence
            },
          });

          if (response.text && response.text.trim().length > 0) {
            replyText = response.text.trim();
            break; // Success!
          }
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          lastError = err instanceof Error ? err : new Error(errMsg);
          console.warn(`[Gemini Assistant] Model ${modelName} returned error: ${errMsg}. Trying fallback...`);
          // Continue to next candidate model
        }
      }
    }

    if (replyText) {
      return res.json({ reply: replyText });
    }

    // If all models failed or API key was missing, attempt offline domain knowledge matching
    const offlineReply = getFallbackKnowledge(message);
    if (offlineReply) {
      return res.json({
        reply: `${offlineReply}\n\n*(ملاحظة: هذه إجابة موثقة من خلاصة كتاب الفرائض في التطبيق نظراً لضغط مؤقت على خوادم الذكاء الاصطناعي).*`,
      });
    }

    // Dignified, helpful fallback if no model succeeded and no offline topic matched
    console.error('[Gemini Assistant] All models exhausted or unavailable. Last error:', lastError?.message);
    return res.json({
      reply: 'نعتذر، تشهد خدمة المعالجة الذكية ضغطاً كبيراً مؤقتاً في هذه اللحظة (High Demand). يرجى إعادة إرسال رسالتك بعد ثوانٍ معدودة، أو الاستعانة بـ «كتاب الفرائض» أو «حاسبة المواريث» المتاحة مباشرة في التطبيق.',
    });
  } catch (error: unknown) {
    console.error('Fatal error in /api/assistant:', error);
    return res.json({
      reply: 'نعتذر، حدث تعثر مؤقت في معالجة الاستفسار. يرجى المحاولة بعد لحظات، أو تصفح أبواب كتاب الفرائض في التطبيق.',
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
