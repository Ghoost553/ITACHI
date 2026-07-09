module.exports = {
    config: {
        name: "طرد",
        version: "1.0.5",
        author: "GHOST",
        countDown: 5,
        role: 0, 
        shortDescription: "طرد عضو من المجموعة",
        longDescription: "طرد أي عضو عن طريق المنشن أو الرد على رسالته بأمر من GHOST أو صديقه NABIL",
        category: "box chat",
        guide: {
            ar: "/طرد @الاسم أو بالرد على رسالته"
        }
    },

    onStart: async function ({ message, event, args, threadsData, usersData, api }) {
        const { threadID, messageID, senderID, mentions } = event;

        // 🆔 المعرفات المصرح لها باستخدام الأمر
        const GHOST_ID = "100077574823486"; // آيدي المطور GHOST
        const FRIEND_ID = "61586116221933"; // آيدي الصديق NABIL

        // 🛡️ التحقق من أن من أرسل الأمر هو المطور أو صديقه فقط
        if (senderID !== GHOST_ID && senderID !== FRIEND_ID) {
            return message.reply("⚠️ ⌊ عُذراً، هَذا الأمْرُ خَاص بـ المُمَيزِينَ فَقط ! ⌉");
        }

        let targetID;

        // 1. التحقق إذا كان الأمر بالرد على رسالة (Reply)
        if (event.type === "message_reply") {
            targetID = event.message_reply.senderID;
        } 
        // 2. التحقق إذا كان الأمر عبر المنشن (Mention)
        else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        } 
        // 3. إذا لم يتم تحديد شخص
        else {
            return message.reply("❌ ⌊ حَدّد الهَدَف ! قُم بالرّد أو المَنشَن لِطردهِ فَوراً ⌉");
        }

        // 👑 حماية المطور وصديقه من الطرد
        if (targetID === GHOST_ID) {
            return message.reply("👑 ⌊ مُستَحِيل ! لَن أقُوم بِطَرد مُطوّري العَظِيم GHOST ⌉");
        }
        if (targetID === FRIEND_ID) {
            return message.reply("🛡️ ⌊ لَن أقُوم بِطَرد نَبِيل صَدِيق مُطوّري الغَالِي ⌉");
        }

        // تنفيذ عملية الطرد وجلب اسم الضحية وتحديد صيغة الرد
        try {
            // جلب اسم الشخص المطرود
            const targetInfo = await usersData.get(targetID);
            const targetName = targetInfo ? targetInfo.name : "العضو";

            // مسح رسالة الأمر لتبدو الدردشة نظيفة ومنظمة
            try {
                await message.unsend(messageID);
            } catch (e) {
                // تجنب توقف الكود إذا فشل حذف الرسالة الأصلية
            }
            
            // طرد العضو من المجموعة
            await api.removeUserFromGroup(targetID, threadID);
            
            // تحديد نص الرد بناءً على من قام بالطرد
            let replyMessage = "";
            if (senderID === GHOST_ID) {
                replyMessage = `« تمّ طَردُ ولد قُــحْـبَة [ ${targetName} ] مِن المَجْمُوعَة بـ أمْرٍ مِن مُطوِّرِي GHOST ⚡ »`;
            } else {
                replyMessage = `« تمّ طَردُ ولد قُــحْـبَة [ ${targetName} ] مِن المَجْمُوعَة بـ أمْرٍ مِن NABIL صَدِيق مُطوِّر GHOST 🛡️ »`;
            }

            // رد بوت مالينيا المزخرف النهائي
            return message.send(`╭━━━ — — — ⚡ — — — ━━━╮\n  𓆩 𝐌𝐀𝐋𝐈𝐍𝐘𝐀 𓆪\n\n${replyMessage}\n\n╰━━━ — — — ⚡ — — — ━━━╯`);
        } catch (error) {
            console.error(error);
            return message.reply("❌ ⌊ فَشِل الطّرد، تأكّد من تَرقيَتِي إلَى مُشرِف أوّلاً ! ⌉");
        }
    }
};
