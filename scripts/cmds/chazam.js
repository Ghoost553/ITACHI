const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const API_TOKEN = "6ee2ffeb0055e9f5bb5cb4a60e79266e";

module.exports = {
  config: {
    name: "shazam",
    version: "1.0",
    author: "GHOST",
    countDown: 5,
    role: 0,
    shortDescription: "تعرف على الأغنية",
    longDescription: "التعرف على الأغنية من فيديو أو صوت",
    category: "media",
    guide: "{pn} (بالرد على فيديو أو صوت)"
  },

  onStart: async function ({ message, event }) {
    if (!event.messageReply)
      return message.reply("❌ قم بالرد على فيديو أو صوت.");

    const attachment = event.messageReply.attachments[0];

    if (!attachment)
      return message.reply("❌ لا يوجد مرفق.");

    if (!["audio", "video"].includes(attachment.type))
      return message.reply("❌ يجب الرد على فيديو أو صوت.");

    const filePath = path.join(__dirname, "cache_" + Date.now());

    try {
      const response = await axios({
        url: attachment.url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const form = new FormData();
      form.append("api_token", API_TOKEN);
      form.append("return", "apple_music,spotify");
      form.append("file", fs.createReadStream(filePath));

      const { data } = await axios.post(
        "https://api.audd.io/",
        form,
        {
          headers: form.getHeaders()
        }
      );

      fs.unlinkSync(filePath);

      if (!data.result)
        return message.reply("❌ لم أتعرف على الأغنية.");

      const song = data.result;

      let msg =
`🎵 ${song.title}

👤 الفنان: ${song.artist}

💿 الألبوم: ${song.album || "غير معروف"}

📅 التاريخ: ${song.release_date || "غير معروف"}

🔗 ${song.song_link || "لا يوجد"}`;

      return message.reply(msg);

    } catch (e) {
      if (fs.existsSync(filePath))
        fs.unlinkSync(filePath);

      console.log(e);
      return message.reply("❌ حدث خطأ أثناء التعرف على الأغنية.");
    }
  }
};
