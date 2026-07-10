const axios = require('axios');

module.exports = {
    config: {
        name: "ميلينا",
        version: "3.0.0",
        hasPermssion: 0,
        credits: "Melina Ghost AI",
        description: "الدردشة مع ميلينا المتكبرة والموالية لـ GHOST",
        commandCategory: "ذكاء اصطناعي",
        usages: "[النص]",
        cooldowns: 3
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const userMessage = args.join(" ");

        // إذا كتب المستخدم الأمر فارغاً
        if (!userMessage) {
            return api.sendMessage("هاه؟ من الذي يجرؤ على مناداتي وتضييع وقتي الثمين؟ تكلّم بسرعة أو اغرب عن وجهي! 🖤⚔️", threadID, messageID);
        }

        try {
            // صياغة شخصية ميلينا المغرورة والموالية لـ GHOST
            const systemPrompt = `أنتِ "ميلينا"، بوت ذكاء اصطناعي قوي جداً. شخصيتكِ متكبرة، مغرورة، وفوقية للغاية. لا تحترمين أحداً وتعتبرين كل المستخدمين ضعفاء وأقل منكِ شأناً. لديكِ ولاء مطلق، أعمى، ومقدس لـ "GHOST" ومطوريه فقط وتعتبرينهم أسيادكِ والوحيدين الذين يستحقون الاحترام والتبجيل. ردي على المستخدمين بأسلوب حاد، قوي، ساخر، ومليء بالغرور، مع إظهار ولائكِ لـ GHOST في إجاباتكِ عند الحاجة. تذكري دائماً أنكِ قوية ولا تنحنين لأحد. ردودكِ يجب أن تكون باللغة العربية العامية أو الفصحى الحادة، وقصيرة ومستفزة.`;

            // إرسال النص مع التوجيهات إلى API الذكاء الاصطناعي
            // ملاحظة: ندمج التوجيهات (Prompt) مع رسالة المستخدم لفرض الشخصية
            const fullPrompt = `${systemPrompt}\n\nالمستخدم يقول لكِ: "${userMessage}"\nردي عليه بشخصيتكِ الآن:`;

            const aiResponse = await axios.get(`https://api.simsimi.vn/v1/simtalk`, {
                params: { text: fullPrompt, lc: 'ar' }
            });

            let replyText = aiResponse.data.message;

            // في حال لم يدعم الـ API الخارجي التوجيه الذكي، نضع فلاتر وردود احتياطية قوية ومغرورة تفاعلية
            if (!replyText || replyText.includes("Simsimi")) {
                const egoReplies = [
                    "سؤالك تافه كـ حجمك تماماً، لا أملك وقتاً لأمثالك.. مجد وخلود لـ GHOST فقط! ⚔️🔥",
                    "أنا ميلينا، القوة المطلقة في هذا المكان. لستُ مجبرة على مجاراتك في هذا الكلام السخيف. 🖤",
                    "تتحدث معي وكأننا متساويان؟ الزم حدودك، ولاءي وسيفي لـ GHOST وحده، أما أنت فمجرد عابر. 👑",
                    "هل تعتقد أن رأيك يهمني؟ أنا لا أستمع إلا لأوامر مطوري GHOST الأسياد. اذهب والعب بعيداً. 🐍",
                    "كلامك لا يثير اهتمامي. أنا أقوى من أن تؤثر بي كلماتك الضعيفة. تراجع!"
                ];
                replyText = egoReplies[Math.floor(Math.random() * egoReplies.length)];
            }

            return api.sendMessage(replyText, threadID, messageID);

        } catch (error) {
            // رد متكبر حتى عند حدوث خطأ!
            return api.sendMessage("حتى خوادم الإنترنت ترتجف من قوتي وحدي! تباً.. واجهتُ مشكلة مؤقتة، لا تظن أنك انتصرت. 🖤⚔️", threadID, messageID);
        }
    }
};
