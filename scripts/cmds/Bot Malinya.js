const { GoogleGenAI } = require("@google/generative-ai");

module.exports = {
    config: {
        name: "مالينيا",
        version: "3.0.0",
        author: "AI Developer",
        countDown: 3,
        role: 0,
        shortDescription: "الدردشة مع الذكاء الاصطناعي مالينيا عبر Gemini",
        longDescription: "تحدث مع الذكاء الاصطناعي مالينيا المدعوم بمحرك Gemini الرسمي",
        category: "ذكاء اصطناعي",
        guide: "{p}مالينيا [النص أو السؤال]"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const prompt = args.join(" ");

        if (!prompt) {
            return api.sendMessage("نعم؟ أنا مالينيا، كيف يمكنني مساعدتك اليوم؟ 🌸", threadID, messageID);
        }

        return this.chatWithGemini({ api, event, prompt });
    },

    onChat: async function ({ api, event }) {
        const { threadID, messageID, body } = event;
        if (!body) return;

        const terms = ["مالينيا", "يا مالينيا"];
        const match = terms.some(term => body.toLowerCase().startsWith(term));

        if (match) {
            const prompt = body.split(" ").slice(1).join(" ");
            if (!prompt) {
                return api.sendMessage("نعم، أنا هنا! كيف يمكنني مساعدتك؟ ✨", threadID, messageID);
            }
            return this.chatWithGemini({ api, event, prompt });
        }
    },

    chatWithGemini: async function ({ api, event, prompt }) {
        const { threadID, messageID } = event;

        // ⚠️ ضع مفتاح الـ API الخاص بك من Google AI Studio هنا بين القوسين
        const apiKey = "AIzaSyCpZUpQwthrWj-1pLMPh8D0ET_IMbnjzlQ";

        // توجيه شخصية مالينيا
        const systemInstruction = "أنتِ ذكاء اصطناعي واسمكِ 'مالينيا'. تجيبين على الأسئلة بذكاء، لباقة، وودودية تامة باللغة العربية. ساعدي المستخدم بكل ما يحتاجه.";

        api.sendMessage("جاري التفكير... ⏳", threadID, async (err, info) => {
            try {
                // إعداد اتصال Gemini
                const ai = new GoogleGenAI({ apiKey: apiKey });
                
                // استخدام موديل Gemini Flash السريع والممتاز للمحادثات
                const model = ai.getGenerativeModel({ 
                    model: "gemini-1.5-flash",
                    systemInstruction: systemInstruction
                });

                const result = await model.generateContent(prompt);
                const reply = result.response.text();

                if (info && info.messageID) api.unsendMessage(info.messageID);
                return api.sendMessage(reply, threadID, messageID);

            } catch (error) {
                console.error("Gemini Error:", error);
                if (info && info.messageID) api.unsendMessage(info.messageID);
                return api.sendMessage("عذراً، حدث خطأ أثناء الاتصال بمحرك Gemini. تأكد من صحة مفتاح الـ API الخاص بك.", threadID, messageID);
            }
        });
    }
};
