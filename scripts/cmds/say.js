const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "say",
    version: "2.0.0",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    shortDescription: "تحويل النص إلى صوت",
    longDescription: "تحويل أي نص إلى رسالة صوتية وإرسالها.",
    category: "media",
    guide: {
      ar: "{p}say <النص>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const text = args.join(" ") || (event.messageReply?.body ?? null);

      if (!text) {
        return api.sendMessage(
          "❌ يرجى كتابة النص الذي تريد تحويله إلى صوت.",
          event.threadID,
          event.messageID
        );
      }

      const filePath = path.join(__dirname, "cache", `${event.senderID}.mp3`);

      // اللغة العربية
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob`;

      const response = await axios.get(url, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, Buffer.from(response.data));

      await api.sendMessage(
        {
          body: "🎙️ تم تحويل النص إلى صوت بنجاح.",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
        }
      );

    } catch (error) {
      console.error("Say command error:", error);

      api.sendMessage(
        "❌ حدث خطأ أثناء تحويل النص إلى صوت، حاول مرة أخرى لاحقًا.",
        event.threadID
      );
    }
  }
};
