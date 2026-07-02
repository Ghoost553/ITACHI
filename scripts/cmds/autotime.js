module.exports = {
  config: {
    name: "autotime",
    version: "1.0",
    author: "GHOST",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Automatic Algeria time"
    },
    longDescription: {
      en: "Send Algeria time every hour"
    },
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onLoad: async function ({ api }) {

    const sendTime = async () => {
      try {
        const now = new Date();

        const time = now.toLocaleTimeString("en-GB", {
          timeZone: "Africa/Algiers",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });

        const date = now.toLocaleDateString("ar-DZ", {
          timeZone: "Africa/Algiers",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        const msg = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
        🇩🇿 𝗠𝗔𝗟𝗜𝗡𝗬𝗔 𝗕𝗢𝗧 🇩🇿
╰━━━━━━━━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━┓
┃ ⏰ الوقت
┃ ➜ ${time}
┣━━━━━━━━━━━━━━━━━━┫
┃ 📅 التاريخ
┃ ➜ ${date}
┣━━━━━━━━━━━━━━━━━━┫
┃ 🌍 المنطقة
┃ ➜ Africa/Algiers 🇩🇿
┗━━━━━━━━━━━━━━━━━━┛

╭───────────────╮
│ 🌸 ﷽
│ 🤍 لا تنسَ ذكر الله.
│ ✨ اللهم اجعل هذه الساعة
│ مليئة بالخير والبركة.
│ 💖 ابتسم... فالحياة أجمل بالأمل.
╰───────────────╯

╭━━━━━━━━━━━━━━━━━━╮
│ 👑 المطور : GHOST
│ 🤖 النظام : Malinya Bot
│ 🟢 الحالة : Online
╰━━━━━━━━━━━━━━━━━━╯

✦ شكراً لاستخدامكم Malinya Bot ✦
`;

        const threads = await api.getThreadList(100, null, ["INBOX"]);

        for (const thread of threads) {
          if (thread.isGroup) {
            api.sendMessage(msg, thread.threadID);
          }
        }

      } catch (e) {
        console.log(e);
      }
    };

    sendTime();

    setInterval(sendTime, 60 * 60 * 1000);
  },

  onStart: async function ({ message }) {
    message.reply("✅ تم تفعيل الإشعار التلقائي كل ساعة بتوقيت الجزائر.");
  }
};
