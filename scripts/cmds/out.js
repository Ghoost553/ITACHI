module.exports = {
  config: {
    name: "out",
    version: "2.0",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 2,
    shortDescription: "إخراج البوت من المجموعة",
    longDescription: "هذا الأمر يجعل البوت يغادر المجموعة الحالية أو مجموعة محددة",
    category: "owner",
    guide: {
      en: "{pn} [threadID (اختياري)]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const botID = api.getCurrentUserID();
    const targetThread = args[0] || event.threadID;

    try {
      await api.sendMessage("👋 وداعاً جميعاً! سأغادر المجموعة الآن...", targetThread);
      await api.removeUserFromGroup(botID, targetThread);
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        "❌ لم أستطع المغادرة! ربما لست أدمن أو حدث خطأ.",
        event.threadID
      );
    }
  },
};
