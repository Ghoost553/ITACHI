const axios = require('axios');

module.exports = {
    config: {
        name: "توضيح",
        aliases: ["upscale", "hd", "حسن"],
        version: "1.0.0",
        author: "AI Assistant",
        countDown: 8,
        role: 0,
        shortDescription: "تحسين جودة الصور وزيادة وضوحها",
        longDescription: "قم بالرد على صورة ضعيفة الجودة باستخدام أمر /توضيح لجعلها عالية الدقة HD.",
        category: "tools",
        guide: "{p}توضيح (بالرد على صورة)"
    },

    onStart: async function ({ message, event }) {
        let imageUrl = "";

        if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0]) {
            imageUrl = event.messageReply.attachments[0].url;
        } else if (event.attachments && event.attachments[0]) {
            imageUrl = event.attachments[0].url;
        }

        if (!imageUrl) {
            return message.reply("⚠️ من فضلك قم بالرد على صورة لتحسين جودتها!");
        }

        message.reply("🪄 جاري معالجة الصورة وتحسين جودتها، انتظر لحظة...");

        try {
            // استخدام API مجاني لتحسين جودة الصور
            const upscaleUrl = `https://api.vyturex.com/upscale?url=${encodeURIComponent(imageUrl)}`;
            const response = await axios.get(upscaleUrl);
            
            const hdImageUrl = response.data.result || response.data.url;

            if (!hdImageUrl) {
                return message.reply("❌ لم أتمكن من معالجة هذه الصورة.");
            }

            return message.reply({
                body: "✨ تم تحسين جودة الصورة بنجاح!",
                attachment: await global.utils.getStreamFromURL(hdImageUrl)
            });

        } catch (error) {
            console.error(error);
            return message.reply("❌ حدث خطأ أثناء تحسين جودة الصورة. جرب صورة أخرى.");
        }
    }
};
