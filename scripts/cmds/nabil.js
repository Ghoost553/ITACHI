const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "نبيل",
    aliases: ["nabil", "NABIL"],
    version: "1.0.0",
    author: "GHOST",
    role: 0,
    shortDescription: "بطاقة نبيل VIP",
    category: "information",
    guide: {
      ar: "/نبيل"
    }
  },

  onStart: async function ({ api, event }) {

    const ownerText = `
╔══════════════════════════════╗
        👑 𝙉𝘼𝘽𝙄𝙇 • 𝙑𝙄𝙋 👑
╚══════════════════════════════╝

      ✦『 𝙋𝙍𝙀𝙈𝙄𝙐𝙈 𝘽𝙄𝙊 𝘾𝘼𝙍𝘿 』✦

╭────────────────────────────╮
│ 👤 الاسم     ➤ 𝙉𝘼𝘽𝙄𝙇
│ 🎂 العمر     ➤ 18 سنة
│ 💙 الحالة    ➤ حاب يتزوج 💍
│
│ 💻 المهنة
│    ├ مطور ومبرمج تطبيقات ومواقع
│    └ طباخ 👨‍🍳
│
│ 🎓 الدراسة  ➤ 2 ثانوي
│ 📸 Instagram ➤ @Rozex_slayr
│ 📘 Facebook
│    ➤ https://www.facebook.com/profile.php?id=61586116221933
╰────────────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│ 💫 𝙈𝙊𝙏𝙏𝙊
│
│ ❝ العمر مجرد رقم،
│    أما الإنجازات فهي
│    التي تخلّد اسم صاحبها. ❞ 😎🔥
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╔══════════════════════════════╗
 🤖 𝙈𝘼𝙇𝙄𝙉𝙔𝘼 𝘽𝙊𝙏 • Powered By GHOST
╚══════════════════════════════╝`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "nabil.jpg");

    if (!fs.existsSync(cacheDir))
      fs.mkdirSync(cacheDir);

    const imgLink = "https://i.ibb.co/Pz9SZrf6/d4b4e8a40d88.jpg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        },
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
