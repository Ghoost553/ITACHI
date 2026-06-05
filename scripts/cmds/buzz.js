const delay = (ms) => new Promise(res => setTimeout(res, ms));

module.exports = {
  config: {
    name: "buzz",
    version: "4.0.0",
    role: 0,
    author: "تعديل GHOST",
    description: "🎌 نظام طاقة أنمي Ghost Aura",
    category: "أنمي",
    usages: "@منشن",
    cooldowns: 5,
  },

  onStart: async function({ message, event }) {
    try {
      const mention = Object.keys(event.mentions)[0];
      if (!mention) {
        return message.reply("⚠️ يجب منشن شخص أولاً!");
      }

      const name = event.mentions[mention];
      const arraytag = [{ id: mention, tag: name }];

      const messages = [
        `☠️ Ghost: تم رصد طاقتك يا ${name}`,
        `⚡ مستوى القوة يرتفع حولك...`,
        `🔥 لديك هالة مقاتل أسطوري`,
        `🌑 الظل يتحرك كلما اقتربت القوة منك`,
        `👁️ لا أحد يستطيع قراءة مستقبلك بسهولة`,
        `🎌 Ghost يمنحك ختم الأنمي الخاص`
      ];

      message.reply(`🎌 بدء تفعيل "Ghost Aura" على ${name}...`);

      for (const msg of messages) {
        await delay(2000);
        message.reply({ body: msg, mentions: arraytag });
      }

      message.reply(`💀 انتهى التفعيل... طاقة ${name} أصبحت غير مستقرة`);
    } catch (err) {
      console.error(err);
      message.reply("❌ حدث خطأ أثناء تشغيل النظام");
    }
  }
};
