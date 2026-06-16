const axios = require("axios");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "malinya_memory.json");

// إنشاء ملف الذاكرة إذا ماكانش موجود
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({}));
}

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "chat",
    version: "3.1",
    author: "Malinya System",
    category: "ai"
  },

  onStart: async ({ message, args, event }) => {
    const userID = event.senderID;
    const text = args.join(" ").trim();

    if (!text) {
      return message.reply("⚠️ اكتب سؤالك\nمثال: chat من أنت؟");
    }

    let db = loadDB();

    if (!db[userID]) {
      db[userID] = {
        history: [],
        moodPoints: 0
      };
    }

    // حفظ آخر الرسائل (حد أقصى 10)
    db[userID].history.push(text);
    if (db[userID].history.length > 10) db[userID].history.shift();

    // تحليل المزاج
    if (text.includes("حب") || text.includes("احبك")) db[userID].moodPoints += 2;
    if (text.includes("حزين") || text.includes("تعبان")) db[userID].moodPoints -= 2;
    if (text.includes("شكرا")) db[userID].moodPoints += 1;

    saveDB(db);

    const hour = new Date().getHours();

    let persona = "⚡ MALINYA AI";

    if (hour >= 5 && hour < 12) persona = "☀️ مالينيا الصباحية";
    else if (hour >= 12 && hour < 18) persona = "🔥 مالينيا النشطة";
    else if (hour >= 18 && hour < 22) persona = "🌙 مالينيا الهادئة";
    else persona = "🌌 مالينيا الليلية";

    try {
      await message.reply("🧠 MALINYA تفكر...");

      const res = await axios.get(
        "https://api.affiliateplus.xyz/api/chatbot",
        {
          params: {
            message: text,
            botname: "MALINYA",
            ownername: "GHOST"
          },
          timeout: 10000
        }
      );

      let reply = res.data?.message || "❌ لا يوجد رد حالياً";

      const mood = db[userID].moodPoints;

      if (mood >= 5) {
        reply = "💖 طاقة إيجابية عالية!\n\n" + reply;
      } else if (mood <= -5) {
        reply = "🌙 لا تقلق… أنا معك دائمًا\n\n" + reply;
      } else {
        reply = "⚡ " + reply;
      }

      const last = db[userID].history.slice(-3).join(" | ");

      reply += `\n\n🧠 آخر أسئلتك: ${last}`;
      reply += `\n\n${persona}`;

      message.reply(reply);

    } catch (err) {
      console.log(err);
      message.reply("❌ خطأ في نظام MALINYA AI");
    }
  }
};
