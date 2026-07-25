const axios = require("axios");

module.exports = {
  config: {
    name: "تجميد",
    version: "3.0.0",
    author: "GHOST x MALENIA",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "كشف هيئة الملاذ الأخير بأمر شفرة ميكويلا"
    },
    longDescription: {
      ar: "تستدعي رؤية روح المحارب المطلوبة من خلال نسيج التعفن القرمزي بأعلى دقة."
    },
    category: "أدوات اسطورية",
    guide: {
      ar: "{pn} [منشن الفريسة / الرد على الرسالة / استدعاء روحك]"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      let targetUsers = [];

      // 1. التاكد من وجود منشنات
      if (Object.keys(event.mentions).length > 0) {
        for (const [uid, name] of Object.entries(event.mentions)) {
          targetUsers.push({ uid, name: name.replace("@", "") });
        }
      } 
      // 2. التاكد اذا تم الرد على رسالة
      else if (event.type === "message_reply") {
        const uid = event.messageReply.senderID;
        const userInfo = await api.getUserInfo(uid);
        const name = userInfo[uid]?.name || "المحارب المجهول";
        targetUsers.push({ uid, name });
      } 
      // 3. استدعاء صاحب الأمر
      else {
        const uid = event.senderID;
        const userInfo = await api.getUserInfo(uid);
        const name = userInfo[uid]?.name || "روحك المقيدة";
        targetUsers.push({ uid, name });
      }

      const attachments = [];
      
      // الترويسة بأسلوب مالينيا
      let captionText = "🗡️ ─────────────── 🗡️\n";
      captionText += "   « ⚜️ 𝐈 𝐀𝐌 𝐌𝐀𝐋𝐄𝐍𝐈𝐀, 𝐁𝐋𝐀𝐃𝐄 𝐎𝐅 𝐌𝐈𝐐𝐔𝐄𝐋𝐋𝐀 ⚜️ »\n";
      captionText += "   « 🥀 وَلَمْ أَعْرِفْ يَوْمًا طَعْمَ الْهَزِيمَةِ... 🥀 »\n";
      captionText += "⚔️ ─────────────── ⚔️\n\n";

      for (const user of targetUsers) {
        const avatarUrl = `https://graph.facebook.com/${user.uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        
        try {
          const res = await axios.get(avatarUrl, { responseType: "stream" });
          attachments.push(res.data);
          
          captionText += `🩸 ⎯⎯⎯⎯⎯ [ ⚜️ 𝕯𝕰𝕿𝕬𝕴𝕷𝕾 ⚜️ ] ⎯⎯⎯⎯⎯ 🩸\n`;
          captionText += `👑 𝔑𝔞𝔪𝔢 ⧽ ${user.name}\n`;
          captionText += `🗡️ ℑ𝔇 ⧽ \`${user.uid}\`\n`;
          captionText += `🔗 ℜ𝔢𝔩𝔦𝔠 ⧽ https://facebook.com/${user.uid}\n`;
          captionText += `🌺 ─────────────── 🌺\n`;
        } catch (err) {
          console.error(`خطأ في استدعاء روح ${user.uid}:`, err);
        }
      }

      if (attachments.length === 0) {
        return api.sendMessage(
          "🥀 لقد تلاشى الجسد في سديم التعفن القرمزي... تعذر جلب الهيئة.",
          event.threadID,
          event.messageID
        );
      }

      return api.sendMessage(
        {
          body: captionText,
          attachment: attachments
        },
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error(error);
      return api.sendMessage(
        "⚔️ سقطت السلسلة المطلوبة... حدث خطأ أثناء استدعاء الرؤيا.",
        event.threadID,
        event.messageID
      );
    }
  }
};
