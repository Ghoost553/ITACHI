const { drive } = global.utils;
const { nickNameBot } = global.GoatBot.config;
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "welcome",
    version: "8.0",
    author: "EryXenX",
    category: "events"
  },

  langs: {
    ar: {
      defaultWelcomeMessage:
        "👋 مرحباً {userName} 🎉\n" +
        "━━━━━━━━━━━━━━━━━━\n" +
        "✨ سعيدون بانضمامك إلينا!\n" +
        "استمتع بوقتك واصنع ذكريات جميلة 🌸",

      botAddedMessage:
        "━━━━━━━━━━━━━━━━━━\n" +
        "🤖 شكراً لإضافتي إلى المجموعة 💖\n\n" +
        "⚙️ بادئة البوت: /\n" +
        "📜 اكتب /help لعرض جميع الأوامر\n\n" +
        "✨ لنصنع جواً ممتعاً معاً 😄\n" +
        "━━━━━━━━━━━━━━━━━━"
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData.settings.sendWelcomeMessage) return;

    const addedMembers = event.logMessageData.addedParticipants;
    const threadName = threadData.threadName || "المجموعة";
    const prefix = global.utils.getPrefix(threadID);
    const inviterID = event.author;

    for (const user of addedMembers) {
      const userID = user.userFbId;
      const botID = api.getCurrentUserID();

      if (userID == botID) {
        if (nickNameBot) await api.changeNickname(nickNameBot, threadID, botID);
        return message.send(getLang("botAddedMessage"));
      }

      const userName = user.fullName;
      const inviterName = await usersData.getName(inviterID);
      const memberCount = event.participantIDs.length;

      let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

      welcomeMessage = welcomeMessage
        .replace(/\{userName\}/g, userName)
        .replace(/\{userTag\}/g, userName)
        .replace(/\{threadName\}/g, threadName)
        .replace(/\{memberCount\}/g, memberCount)
        .replace(/\{inviterName\}/g, inviterName);

      let welcomeImagePath = null;
      try {
        welcomeImagePath = await createWelcomeCard({
          userName,
          threadName,
          memberCount,
          inviterName,
          newUserID: userID,
          inviterID,
          threadID,
          api
        });
      } catch (err) {
        console.error("فشل إنشاء صورة الترحيب:", err);
      }

      const form = {
        body: welcomeMessage,
        mentions: [{ tag: userName, id: userID }]
      };

      if (welcomeImagePath && fs.existsSync(welcomeImagePath)) {
        form.attachment = fs.createReadStream(welcomeImagePath);
      }

      message.send(form);

      if (welcomeImagePath && fs.existsSync(welcomeImagePath)) {
        setTimeout(() => {
          try { fs.unlinkSync(welcomeImagePath); } catch (_) {}
        }, 5000);
      }
    }
  }
};
