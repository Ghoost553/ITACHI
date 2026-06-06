const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "setting",
    version: "2.0.0",
    author: "GHOST EDIT",
    countDown: 5,
    role: 2,
    shortDescription: "إعدادات البوت",
    category: "admin",
    guide: "{prefix}setting"
  },

  onStart: async function ({ message, event }) {
    const menu = `
╭─『 ⚙️ لوحة التحكم 』
│ 🤖 إعدادات البوت
╰────────────

1️⃣ إعدادات عامة
2️⃣ إدارة الأدمن
3️⃣ القائمة البيضاء
4️⃣ الوضع العام (ON/OFF)
5️⃣ الإشعارات والتفاعل
6️⃣ كنية البوت
7️⃣ إعدادات فيسبوك (FCA)

━━━━━━━━━━━━━━
✍️ رد برقم الخيار
    `;

    const sent = await message.reply(menu);

    global.GoatBot.onReply.set(sent.messageID, {
      commandName: "setting",
      messageID: sent.messageID,
      author: event.senderID,
      state: "main"
    });
  },

  onReply: async function ({ event, Reply, message, api }) {
    const { author, state } = Reply;
    if (event.senderID !== author) return;

    const configPath = path.join(process.cwd(), "config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    const input = event.body.trim();
    const num = parseInt(input);

    const save = () => fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    const status = (v) => (v ? "ON ✅" : "OFF ❌");

    // ───────── MAIN MENU ─────────
    if (state === "main") {
      if (num === 1) {
        config.adminOnly = config.adminOnly || {};
        config.adminOnly.enable = !config.adminOnly.enable;
        save();
        return message.reply(`⚙️ إعدادات عامة تم التحديث`);
      }

      if (num === 2) return message.reply("👮 إدارة الأدمن قيد التطوير");

      if (num === 3) return message.reply("📋 القائمة البيضاء قيد التطوير");

      if (num === 4) {
        config.noPrefix = config.noPrefix || {};
        config.noPrefix.enable = !config.noPrefix.enable;
        save();
        return message.reply(`⚡ الوضع العام: ${status(config.noPrefix.enable)}`);
      }

      if (num === 5) return message.reply("🔔 إعدادات التفاعل قيد التطوير");

      if (num === 6) {
        return message.reply("✏️ اكتب الكنية الجديدة للبوت:");
      }

      if (num === 7) return message.reply("📡 إعدادات FCA قيد التطوير");
    }

    // ───────── SET BOT NAME ─────────
    if (!isNaN(num) && state === "main" && num === 6) {
      const nickname = input;

      if (!nickname) return message.reply("❌ اسم غير صالح");

      config.nickNameBot = nickname;
      save();

      try {
        await api.changeNickname(nickname, event.threadID, api.getCurrentUserID());
      } catch (e) {}

      return message.reply(`🤖 تم تغيير كنية البوت إلى: ${nickname}`);
    }
  }
};
