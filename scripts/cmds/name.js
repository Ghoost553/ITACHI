const meta = {
    name: "كنية",
    aliases: ["كنية"], // سيتم التعرف عليه مباشرة عند كتابة /كنية
    version: "2.1",
    author: "Developer",
    description: "تغيير كنية أي عضو (مخصص للمطور)",
    guide: "بالرد على الرسالة: /كنية [اللقب الجديد]",
    cooldown: 2,
    prefix: "both", // سيعمل سواء كتبت /كنية أو كنية فقط
    category: "owner"
};

async function onStart({ bot, chatId, msg, message, event }) {
    const OWNER_ID = "100077574823486";
    const senderId = msg.from.id.toString();

    // التحقق من هويتك
    if (senderId !== OWNER_ID) return; 

    // التأكد من وجود رد على رسالة
    if (!msg.reply_to_message) {
        return message.reply("⚠️ يرجى الرد على رسالة الشخص وكتابة اللقب الجديد.\nمثال: /كنية الملك");
    }

    // استخراج الكنية الجديدة (الكلمة الأولى بعد الأمر)
    const args = msg.text.split(" ").slice(1);
    const newNickname = args.join(" ");

    if (!newNickname) {
        return message.reply("❌ اكتب الكنية الجديدة بعد الأمر.");
    }

    const targetUserId = msg.reply_to_message.from.id;

    try {
        // تنفيذ تغيير الكنية
        if (global.api) {
            await global.api.changeNickname(newNickname, chatId, targetUserId);
        } else {
            await bot.api.changeNickname(newNickname, chatId, targetUserId);
        }
        
        await message.react("✅"); // تفاعل البوت بعلامة صح عند النجاح
    } catch (error) {
        console.error(error);
        await message.reply("❌ فشل تغيير الكنية، تأكد من صلاحيات البوت.");
    }
}

module.exports = { meta, onStart };
