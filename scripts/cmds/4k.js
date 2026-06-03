module.exports = {
  config: {
    name: "4k",
    version: "1.7",
    author: "MahMUD",
    countDown: 10,
    role: 0,
    category: "AI",
    description: "تحسين جودة الصور بالذكاء الاصطناعي إلى 4K",
    guide: {
      ar: "{pn} [رابط الصورة] أو قم بالرد على صورة"
    }
  },

  onStart: async function ({ message, event, args }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);

    if (module.exports.config.author !== obfuscatedAuthor) {
      return message.reply("غير مسموح لك بتغيير اسم المطور.");
    }

    const startTime = Date.now();
    let imgUrl;

    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = event.messageReply.attachments[0].url;
    } else if (args[0]) {
      imgUrl = args.join(" ");
    }

    if (!imgUrl) {
      return message.reply("❌ قم بالرد على صورة أو أرسل رابط صورة.");
    }

    const waitMsg = await message.reply("🖼️ جاري تحسين الصورة إلى جودة 4K، يرجى الانتظار...");
    message.reaction("⏳", event.messageID);

    try {
      const apiUrl = `${await mahmud()}/api/hd?imgUrl=${encodeURIComponent(imgUrl)}`;

      const res = await axios.get(apiUrl, {
        responseType: "stream"
      });

      if (waitMsg?.messageID)
        message.unsend(waitMsg.messageID);

      message.reaction("✅", event.messageID);

      const processTime = ((Date.now() - startTime) / 1000).toFixed(2);

      message.reply({
        body: `✅ تم تحسين الصورة بنجاح!

⏱️ وقت المعالجة: ${processTime} ثانية`,
        attachment: res.data
      });

    } catch (error) {
      if (waitMsg?.messageID)
        message.unsend(waitMsg.messageID);

      message.reaction("❌", event.messageID);

      message.reply("حدث خطأ أثناء معالجة الصورة، حاول مرة أخرى لاحقًا.");
    }
  }
};
