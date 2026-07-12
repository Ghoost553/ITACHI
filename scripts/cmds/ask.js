const axios = require('axios');

module.exports = {
  config: {
    name: "ask",
    version: "1.0.0",
    author: "AI Assistant",
    countDown: 5, // وقت الانتظار بالثواني لمنع السبام
    role: 0, // 0 = للجميع، 1 = للمشرفين، 2 = للمطور
    description: "اسأل الذكاء الاصطناعي أي سؤال",
    category: "ai",
    guide: {
      en: "{p}ask [السؤال]"
    }
  },

  onStart: async function ({ api, event, args, reply }) {
    try {
      // دمج الكلمات التي كتبها المستخدم بعد الأمر لتكوين السؤال
      const userQuery = args.join(" ");

      // التحقق مما إذا كان المستخدم قد كتب سؤالاً بالفعل
      if (!userQuery) {
        return reply("⚠️ من فضلك اكتب سؤالك بعد الأمر.\nمثال: /ask ما هي عاصمة فرنسا؟");
      }

      reply("⏳ جاري التفكير والإجابة، انتظر لحظة...");

      // رابط الـ API (يمكنك استبداله بـ API الخاص بـ Gemini أو OpenAI أو أي API مجاني متوافق)
      const apiUrl = `https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(userQuery)}`;

      // إرسال الطلب وجلب النتيجة باستخدام axios
      const response = await axios.get(apiUrl);
      
      // استخراج الإجابة (تأكد من تعديل المفتاح حسب الـ API الذي تستخدمه)
      const botAnswer = response.data.response; 

      // إرسال الرد النهائي للمستخدم في المسنجر
      return reply(botAnswer);

    } catch (error) {
      console.error(error);
      return reply("❌ عذراً، حدث خطأ أثناء الاتصال بالـ API الذكي.");
    }
  }
};
