const axios = require('axios');

module.exports = {
    config: {
        name: "بحث",
        aliases: ["findanime", "trace", "ابحث"],
        version: "1.0.0",
        author: "AI Assistant",
        countDown: 5,
        role: 0,
        shortDescription: "البحث عن الأنمي ومقطع الفيديو من الصورة",
        longDescription: "قم بالرد على صورة أو أرسل صورة مع أمر /بحث لمعرفة اسم الأنمي ورقم الحلقة والحصول على فيديو المشهد.",
        category: "anime",
        guide: "{p}بحث (قم بالرد على صورة)"
    },

    onStart: async function ({ message, event }) {
        let imageUrl = "";

        // التحقق مما إذا كان المستخدم قد رد على رسالة تحتوي على صورة
        if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0]) {
            imageUrl = event.messageReply.attachments[0].url;
        } 
        // أو إذا أرسل الصورة مباشرة في نفس الرسالة مع الأمر
        else if (event.attachments && event.attachments[0]) {
            imageUrl = event.attachments[0].url;
        }

        if (!imageUrl) {
            return message.reply("⚠️ من فضلك قم بالرد على صورة أو أرسل صورة مع الأمر!");
        }

        message.reply("🔍 جاري البحث عن المشهد وفيديو الأنمي، انتظر قليلاً...");

        try {
            // استعلام من API الخاص بـ trace.moe
            const response = await axios.get(`https://api.trace.moe/search?url=${encodeURIComponent(imageUrl)}`);
            const result = response.data.result[0];

            if (!result) {
                return message.reply("❌ للأسف لم أتمكن من العثور على هذا الأنمي.");
            }

            const animeName = result.filename;
            const episode = result.episode;
            const similarity = (result.similarity * 100).toFixed(2);
            const videoUrl = result.video;

            const replyMessage = `📺 **تم العثور على الأنمي بنجاح!**\n\n` +
                                 `🎬 **الاسم:** ${animeName}\n` +
                                 `🎞️ **رقم الحلقة:** ${episode || "غير محدد"}\n` +
                                 `🎯 **نسبة التطابق:** ${similarity}%\n\n` +
                                 `👇 مقطع فيديو قصير للمشهد:`;

            // إرسال كرت المعلومات ومعه رابط بث الفيديو مباشرة كملف مرفق
            return message.reply({
                body: replyMessage,
                attachment: await global.utils.getStreamFromURL(videoUrl)
            });

        } catch (error) {
            console.error(error);
            return message.reply("❌ حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة مرة أخرى لاحقاً.");
        }
    }
};
