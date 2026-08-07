module.exports = {
    config: {
        name: "حجر",
        version: "2.5.0",
        author: "GHOST",
        countDown: 3,
        role: 0,
        shortDescription: "تحدي حجر ورق مقص مخصص",
        longDescription: "تحدي تكتيكي ضد البوت مع ميزات خاصة وصلاحيات للـ Owner!",
        category: "ألعاب",
        guide: "{pn} [حجر | ورق | مقص]"
    },

    onStart: async function ({ api, event, args, message }) {
        // الآيدي الخاص بك
        const ownerID = "61592423722586";
        const isOwner = event.senderID == ownerID;
        
        const userChoice = args[0] ? args[0].trim().toLowerCase() : null;
        const validChoices = ["حجر", "ورق", "مقص"];

        // الترحيب المخصص
        const header = isOwner 
            ? "👑 **أهلاً بك يا سيدي القائد (GHOST)!**" 
            : "⚔️ **مرحبًا بك في ساحة التحدي!**";

        if (!userChoice || !validChoices.includes(userChoice)) {
            return message.reply(
                `${header}\n\n` +
                (isOwner 
                    ? `يشرفني التحدي ضدك شخصيًا اليوم. اختر سلاحك لتبدأ المعركة:\n` 
                    : `أتحداك أن تهزمني! اختر سلاحك بحكمة:\n`) +
                `• \`حجر\` 🪨\n` +
                `• \`ورق\` 📄\n` +
                `• \`مقص\` ✂️\n\n` +
                `📌 مثال: \`حجر ورق\``
            );
        }

        const botChoice = validChoices[Math.floor(Math.random() * validChoices.length)];

        const icons = {
            "حجر": "🪨",
            "ورق": "📄",
            "مقص": "✂️"
        };

        let statusText = "";

        if (userChoice === botChoice) {
            statusText = isOwner 
                ? `🤝 **تعادل الملوك!**\nتفكيرك العالي يقرأ تحركاتي بدقة يا سيدي.. الجولة القادمة ستحسم المعركة!`
                : `🤝 **تعادل محتدم!**\nتفكيرنا متطابق بشكل مذهل.. لكن الجولة القادمة ستحسم التحدي!`;
        } else if (
            (userChoice === "حجر" && botChoice === "مقص") ||
            (userChoice === "ورق" && botChoice === "حجر") ||
            (userChoice === "مقص" && botChoice === "ورق")
        ) {
            statusText = isOwner
                ? `🎉 **انتصار مهيب للمطور!**\nكما هو متوقع من ذكائك وتكتيكك العالي! احترامي الكامل لك يا سيدي. هل نلعب جولة أخرى؟`
                : `🎉 **انتصار مستحق!**\nاحترامي لك، لقد كانت ضربة ذكية! لكن احذر، لن أترك لك الفوز بسهولة في المرة القادمة.`;
        } else {
            statusText = isOwner
                ? `🔥 **تفوق نادِر للبوت!**\nاستطعت التغلب عليك هذه المرة بالحظ فقط يا سيدي! أحيي شجاعتك وتحديك، هل نلعب جولة انتقامية؟`
                : `🔥 **الفوز للبوت!**\nأحيي محاولتك القوية، لكن التكتيك كان لصالحي هذه المرة! أقدر شجاعتك.. هل تحاول مجددًا؟`;
        }

        return message.reply(
            `${header}\n\n` +
            `👤 اختيارك: ${icons[userChoice]} **${userChoice}**\n` +
            `🤖 اختياري: ${icons[botChoice]} **${botChoice}**\n\n` +
            `───────────────\n` +
            `${statusText}`
        );
    }
};
