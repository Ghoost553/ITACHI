const axios = require("axios");

// تعريف الروابط البرمجية (APIs)
const PRIMARY_API = "https://shizuai.vercel.app/chat";
const GEMINI_FALLBACK = "https://norch-project.gleeze.com/api/gemini/2.5/flash-lite";
const CLEAR_ENDPOINT = "https://shizuai.vercel.app/chat/clear";

module.exports = {
  config: {
    name: "malinya",
    aliases: ["مالينيا"],
    version: "2.5",
    author: "Malinya AI",
    countDown: 3,
    role: 0,
    shortDescription: {
      ar: "الدردشة مع مالينيا مع نظام حماية من الأعطال"
    },
    longDescription: {
      ar: "ذكاء اصطناعي يعتمد على سيرفر مالينيا الأساسي ويتحول تلقائياً إلى جمناي عند العطل"
    },
    category: "ai",
    guide: {
      ar: "{pn} <رسالتك> أو أرسل صورة مع الأمر\n{pn} clear"
    }
  },

  onStart: async function ({ message, event, args }) {
    // 1. التعامل مع أمر مسح الذاكرة
    if (args[0]?.toLowerCase() === "clear") {
      try {
        await axios.post(CLEAR_ENDPOINT, { userId: event.senderID });
        return message.reply("🗑️ تم مسح ذاكرة مالينيا.");
      } catch {
        return message.reply("❌ فشل مسح الذاكرة.");
      }
    }

    // 2. جلب رابط الصورة إذا قام المستخدم بإرفاق صورة (سواء في الرسالة أو عبر الرد)
    let imageUrl = "";
    if (event.type === "message_reply" && event.messageReply.attachments?.length > 0) {
      imageUrl = event.messageReply.attachments[0].url;
    } else if (event.attachments?.length > 0) {
      imageUrl = event.attachments[0].url;
    }

    let finalQuestion = args.join(" ");

    // إذا أرسل المستخدم صورة فقط بدون نص، نضع نصاً افتراضياً لوصف الصورة
    if (!finalQuestion && imageUrl) {
      finalQuestion = 'Describe this image in detail';
    }

    // التحقق من وجود مدخلات (نص أو صورة)
    if (!finalQuestion && !imageUrl) {
      return message.reply("💬 | اكتب رسالة أو أرفق صورة بعد الأمر.");
    }

    // تفاعل البوت للتنبيه أنه جاري معالجة الطلب
    message.reaction("⏳");

    let response = "";

    /* ===== [الخيار الأول] الـ API الأساسي لـ مالينيا ===== */
    try {
      const res = await axios.post(PRIMARY_API, {
        userId: event.senderID,
        message: finalQuestion
      }, { timeout: 30000 }); // مهلة استجابة 30 ثانية

      if (res.data) {
        response = res.data.response || res.data.reply || res.data.message;
      }
    } catch (err) {
      console.log("Primary API failed -> switching to Gemini Fallback");
    }

    /* ===== [الخيار البديل] في حال فشل السيرفر الأول، ننتقل لـ GEMINI ===== */
    if (!response) {
      try {
        const geminiUrl = `${GEMINI_FALLBACK}?prompt=${encodeURIComponent(finalQuestion)}&imageurl=${encodeURIComponent(imageUrl || '')}`;
        const { data } = await axios.get(geminiUrl, { timeout: 30000 });

        if (data) {
          response = data.reply || data.response || data.answer;
        }
      } catch (geminiErr) {
        console.log("Gemini fallback failed as well:", geminiErr.message);
      }
    }

    // 3. إرسال النتيجة النهائية للمستخدم بناءً على السيرفر المستجيب
    if (response) {
      message.reaction("✅");
      return message.reply(response.trim());
    } else {
      message.reaction("❌");
      return message.reply("❌ عذراً، فشل الاتصال بسيرفرات الذكاء الاصطناعي حالياً.");
    }
  }
};
