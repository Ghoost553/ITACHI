const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "3.0.0",
    author: "GHOST",
    role: 0,
    shortDescription: "معلومات المالك VIP",
    category: "information",
    guide: {
      ar: "owner"
    }
  },

  onStart: async function ({ api, event }) {

    const ownerText =
`━━━━━━━━━━━━━━
👑  𝐎𝐖𝐍𝐄𝐑 𝐕𝐈𝐏 𝐂𝐀𝐑𝐃 👑
━━━━━━━━━━━━━━

👤 الاسم   : GHOST
🎂 العمر   : 19 سنة
💘 الحالة  : عازب
🎓 المهنة  : عسكري
📚 الدراسة : علوم وتكنولوجيا وبرمجة
🏡 الموقع  : سيڨ، ولاية معسكر

━━━━━━━━━━━━━━
🔗 تواصل مع المالك:
📘 فيسبوك : facebook.com/61588788488487
📞 واتساب : +213 784 317 810

━━━━━━━━━━━━━━
⚡ 𝐆𝐇𝐎𝐒𝐓 𝐁𝐎𝐓 ⚡
━━━━━━━━━━━━━━`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.ibb.co/TMHZmqcV/65cd7dc0a3ed.jpg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
