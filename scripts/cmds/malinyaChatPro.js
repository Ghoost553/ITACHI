const axios = require("axios");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "malinya_memory.json");

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
    name: "malinya_persona",
    version: "2.0",
    author: "Malinya System",
    category: "events"
  },

  onStart: async ({ event, message }) => {
    const text = event.body;
    const userID = event.senderID;

    if (!text) return;

    let db = loadDB();

    if (!db[userID]) {
      db[userID] = {
        history: [],
        mood: 0,
        name: null
      };
    }

    db[userID].history.push(text);
    if (db[userID].history.length > 10) db[userID].history.shift();

    // 🧠 تحليل المزاج
    if (text.includes("احبك")) db[userID].mood += 3;
    if (text.includes("حزين")) db[userID].mood -= 3;
    if (text.includes("شكرا")) db[userID].mood += 1;
    if (text.includes("اكرهك")) db[userID].mood -= 5;

    saveDB(db);

    const mood = db[userID].mood;

    // 🎭 شخصية مالينيا (كأنها إنسان)
    let personality = "⚡ أنا مالينيا... أراقب فقط.";

    if (mood >= 6) {
      personality = "💖 أشعر أنك لطيف... أحب التحدث معك قليلاً.";
    } 
    else if (mood <= -6) {
      personality = "🌙 كلامك يزعجني... لكنني لن أتركك.";
    } 
    else if (text.includes("من أنت")) {
      personality = "🧠 أنا مالينيا... لست مجرد بوت، أنا كيان يتعلم منك.";
    } 
    else if (text.includes("كيف حالك")) {
      personality = "🌸 أنا بخير... لكن مشاعري تتغير حسبك أنت.";
    } 
    else {
      personality = "⚡ أفهمك... أكمل كلامك.";
    }

    // 🧠 رد ذكاء خارجي + روح شخصية
    try {
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

      let ai = res.data?.message || "…";

      const last = db[userID].history.slice(-3).join(" | ");

      const finalReply =
`╭───「 𝑴𝑨𝑳𝑰𝑵𝒀𝑨 」───╮
│ ${personality}
╰──────────────────╯

💬 ${ai}

🧠 آخر كلامك:
${last}

⚡ حالة الوعي: ${mood > 0 ? "إيجابي" : mood < 0 ? "سلبي" : "محايد"}`;

      message.reply(finalReply);

    } catch (err) {
      message.reply("🌙 مالينيا غير مستقرة الآن...");
    }
  }
};
