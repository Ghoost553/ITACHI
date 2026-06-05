const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    version: "1.0.0",
    author: "GHOST",
    countDown: 10,
    role: 0,
    category: "AI",
    description: "تحسين جودة الصور إلى 4K",
    guide: {
      ar: "{pn} [رد على صورة أو رابط]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const startTime = Date.now();
    let imgUrl;

    // صورة من الرد
    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = event.messageReply.attachments[0].url;
    }

    // أو رابط
    else if (args[0]) {
      imgUrl = args.join(" ");
    }

    if (!imgUrl) {
      return message.reply("❌ قم بالرد على صورة أو أرسل رابط صورة.");
    }

    const waitMsg = await message.reply("🖼️ جاري تحسين الصورة إلى 4K...");

    try {
      // API مجانية بديلة شغالة غالباً
      const apiUrl = `https://api.lolhuman.xyz/api/remini?apikey=free&img=${encodeURIComponent(imgUrl)}`;

      const res = await axios.get(apiUrl, {
        responseType: "stream"
      });

      const processTime = ((Date.now() - startTime) / 1000).toFixed(2);

      return message.reply({
        body: `✅ تم تحسين الصورة إلى 4K\n⏱️ الوقت: ${processTime}s`,
        attachment: res.data
      });

    } catch (error) {
      console.log(error);
      message.reply("❌ حدث خطأ أثناء تحسين الصورة، حاول مرة أخرى.");
    }
  }
};
