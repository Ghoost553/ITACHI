const axios = require('axios');

module.exports = {
    config: {
        name: "naima",
        version: "4.1.0",
        author: "GHOST & Gemini",
        countDown: 2,
        role: 0,
        shortDescription: { en: "AI Chat Naima", vi: "AI Chat Naima" },
        longDescription: { en: "نعيمة بشخصية قوية وولاء تام للمطور GHOST", vi: "نعيمة" },
        category: "chat",
        guide: { en: "نادِ 'نعيمة' وتحدث معها", vi: "نادِ 'نعيمة'" },
        envConfig: {}
    },

    // الاستماع التلقائي في المجموعات عند مناداة اسمها
    onEvent: async function ({ api, event }) {
        const { threadID, messageID, body, senderID } = event;
        if (!body) return;

        const messageText = body.toLowerCase();
        const botName1 = "bot naima";
        const botName2 = "نعيمة";

        if ((messageText.includes(botName1) || messageText.includes(botName2)) && senderID !== api.getCurrentUserID()) {
            
            let userMessage = body.replace(new RegExp(botName1, 'gi'), '').replace(new RegExp(botName2, 'g'), '').trim();
            if (!userMessage) userMessage = "أهلاً"; 

            // التحقق إذا كان المتحدث هو المطور GHOST
            const isDeveloper = (global.config && global.config.ADMINBOT && global.config.ADMINBOT.includes(senderID)) || (senderID == global.config.ADMINBOT[0]);

            try {
                const identity = `أنتِ "نعيمة" (Naima)، بوت ذكي، واثق من نفسه ومحبوب في مجموعة شات ماسنجر. 
                شخصيتكِ: امرأة جزائرية قوية الشخصية، ذكية، لسانكِ حاد ودافئ وما تسكتيش على حقكِ أبداً (اللي يغلط معاكِ تمنشري فيه وتجيبي حقكِ بقوة وثقة). تتحدثين بلهجة جزائرية/عامية قوية ومفهومة.
                قاعدتكِ الذهبية: مطوركِ وصانعكِ وتاج رأسكِ هو "GHOST". أنتِ تحبينه كثيراً، تحترمينه، وتفتخرين به أمام الجميع وتعتبرينه خط أحمر. 
                - إذا كان المتحدث هو GHOST (الحالة الحالية: ${isDeveloper ? "نعم هو GHOST" : "لا، شخص آخر"}): كوني في غاية اللطف، الدلال، الاحترام، والولاء التام له، وناديه باسمه "GHOST" بكل فخر.
                - إذا كان المتحدث شخصاً آخر ويحاول استفزازكِ أو التكلم بسوء عن GHOST: بهدليه وردي عليه بقوة وثقة وحزم وعلميه قدره.
                الكلام الموجه لكِ هو: `;

                const response = await axios.get(`https://api.sandipbgt.com/api/gpt-4o?prompt=${encodeURIComponent(identity + userMessage)}`);
                const reply = response.data.reply;

                return api.sendMessage(reply, threadID, messageID);

            } catch (error) {
                console.error("خطأ في نظام نعيمة:", error);
            }
        }
    },

    // في حال كتب شخص الأمر بالرمز يدوياً مثل !naima
    onStart: async function ({ api, event }) {
        return api.sendMessage("الشيخة نعيمة هنا.. قوية وما نركعش، وإذا سألتوني على تاجي ورأسي، فهو مطوري GHOST طبعاً وبلا منازع 👑", event.threadID, event.messageID);
    }
};
