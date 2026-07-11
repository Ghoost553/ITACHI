const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "ghost",
    aliases: ["GHOST", "Ghost"],
    version: "3.0.0",
    author: "GHOST",
    role: 0,
    shortDescription: "معلومات المالك VIP",
    category: "information",
    guide: {
      ar: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {

    const ownerText = `╭━━━〔 👑 𝐎𝐖𝐍𝐄𝐑 𝐕𝐈𝐏 👑 〕━━━╮
┃
┃ 👤 ⫸ الاسم : 『 GHOST 』
┃ 🎂 ⫸ العمر : 『 19 سنة 』
┃ 💍 ⫸ الحالة : 『 أعزب 』
┃ 🪖 ⫸ المهنة : 『 عسكري + زيتون أسود 』
┃ 📚 ⫸ الدراسة : 『 علوم وتكنولوجيا وبرمجة 』
┃ 📍 ⫸ الموقع : 『 سيڨ - ولاية معسكر 🇩🇿 』
┃
┣━━━━━━━━━━━━━━━━━━
┃ 🌐 𝐂𝐎𝐍𝐓𝐀𝐂𝐓
┃
┃ 📘 Facebook
┃ 🔗 https://www.facebook.com/Dakota553
┃
┃ 📞 WhatsApp
┃ ☎ +213 784 317 810
┃
┣━━━━━━━━━━━━━━━━━━
┃ 👑 ══『 𝐁𝐎𝐓 𝐌𝐀𝐋𝐈𝐍𝐘𝐀 』══ 👑
┃ 🤍 ذكاء اصطناعي متطور
┃ ⚡ سرعة • احترافية • استقرار
┃ 👑 Powered By GHOST
╰━━━━━━━━━━━━━━━━━━╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "ghost.jpg");

    fs.ensureDirSync(cacheDir);

    const imgLink = "https://i.ibb.co/S7v5h6Nv/5807f8263ca6.jpg";

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", () => {
        api.sendMessage(
          {
            body: ownerText,
            attachment: fs.createReadStream(imgPath)
          },
          event.threadID,
          () => {
            if (fs.existsSync(imgPath))
              fs.unlinkSync(imgPath);
          },
          event.messageID
        );
      })
      .on("error", () => {
        api.sendMessage(ownerText, event.threadID, event.messageID);
      });
  }
};
