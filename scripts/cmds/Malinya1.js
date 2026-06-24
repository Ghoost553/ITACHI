module.exports = {
  config: {
    name: "Malinya",
    aliases: ["about", "info", "botinfo", "malinya"],
    version: "1.0",
    author: "GHOST",
    role: 0,
    description: "عرض معلومات بوت Malinya مع صورة"
  },

  onStart: async function ({ message, api, event }) {

    const text = `
✨══════════════════✨
      🤖  𝙈𝘼𝙇𝙄𝙉𝙔𝘼 𝘽𝙊𝙏
✨══════════════════✨

👑 | المالك : GHOST
💠 | الاسم : Malinya Bot
⚙️ | الإصدار : 1.0.0
📡 | الحالة : 🟢 Online
💡 | النوع : Messenger Bot

📌 | للأطلاع على الأوامر اكتب: /help

✨══════════════════✨
`;

    // 🔥 حط رابط صورة مباشر (يفضل i.ibb.co أو imgur direct)
    const imageUrl = "https://i.ibb.co/whPqdsq1/image.jpg";

    return api.sendMessage(
      {
        body: text,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      },
      event.threadID,
      event.messageID
    );
  }
};
