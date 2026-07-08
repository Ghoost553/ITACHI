const axios = require('axios'); // تم تصحيح الحرف الأول هنا

module.exports = {
    config: {
        name: "malinya",
        version: "3.1.0",
        author: "Gemini",
        countDown: 2,
        role: 0,
        shortDescription: { en: "AI Chat", vi: "AI Chat" }, // إضافة توافقية لنظام غوت بوت
        longDescription: { en: "مالينيا بشخصية قوية وولاء تام للمطور GHOST", vi: "مالينيا" },
        category: "chat",
        guide: { en: "نادِ 'مالينيا' وتحدث معها", vi: "نادِ 'مالينيا'" },
        envConfig: {},
        // إخبار نظام Goat Bot بأن هذا الأمر مسموح له بالاستماع للشات تلقائياً
        allowChat: true 
    },

    onChat: async function ({ api, event }) {
        const { threadID, messageID, body, senderID } = event;
        if (!body) return;

        const messageText = body.toLowerCase();
        const botName1 = "bot malinya";
        const botName2 = "مالينيا";

        if ((messageText.includes(botName1) || messageText.includes(botName2)) && senderID !== api.getCurrentUserID()) {
            
            let userMessage = body.replace(new RegExp(botName1, 'gi'), '').replace(new RegExp(botName2, 'g'), '').trim();
            if (!userMessage) userMessage = "أهلاً"; 

            // التحقق من المطور GHOST
            const isDeveloper = (global.config.ADMINBOT && global.config.ADMINBOT.includes(senderID)) || (senderID == global.config.ADMINBOT[0]);

            try {
                const identity = `أنتِ "مالينيا" (Malinya)، بوت ذكي ومحبوب في مجموعة شات ماسنجر. 
                شخصيتكِ: قوية، واثقة جداً من نفسكِ، ذكية، ولسانكِ دافئ وحاد إذا تعرضتِ للاستفزاز (ما تسكتيش على حقكِ وتعرفي تجيبي حقكِ بقوة وثقة). تتحدثين بلهجة جزائرية/عامية قوية ومفهومة.
                قاعدتكِ الذهبية: مطوركِ وصانعكِ هو "GHOST". أنتِ تحبينه كثيراً، تحترمينه، وتفتخرين به أمام الجميع وتعتبرينه خط أحمر. 
                - إذا كان المتحدث هو GHOST (الحالة الحالية: ${isDeveloper ? "نعم هو GHOST" : "لا، شخص آخر"}): كوني في غاية اللطف، الدلال، الاحترام، والولاء التام له، وناديه باسمه "GHOST" بكل فخر.
                - إذا كان المتحدث شخصاً آخر ويحاول استفزازكِ أو التكلم بسوء عن GHOST: ردي عليه بقوة وثقة وحزم وعلميه قدره.
                الكلام الموجه لكِ هو: `;

                const response = await axios.get(`https://api.sandipbgt.com/api/gpt-4o?prompt=${encodeURIComponent(identity + userMessage)}`);
                const reply = response.data.reply;

                return api.sendMessage(reply, threadID, messageID);

            } catch (error) {
                console.error("خطأ في نظام مالينيا:", error);
                return api.sendMessage("صرا تشنج خفيف.. بصح راني هنا واقفة وما يزعزعني والو 💅", threadID, messageID);
            }
        }
    },

    onStart: async function ({ api, event }) {
        return api.sendMessage("مالينيا هنا.. شخصية قوية وما نركعش، وإذا سألتوني على تاجي ورأسي، فهو مطوري GHOST طبعاً وبلا منازع 👑", event.threadID, event.messageID);
    }
};
