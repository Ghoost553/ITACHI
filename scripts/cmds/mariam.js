const axios = require('axios');

module.exports = {
    config: {
        name: "مريم",
        version: "3.0.0",
        author: "AI Master",
        countDown: 2,
        role: 0,
        description: "مريم: شخصية متكبرة وقوية ومطيعة لسيدها",
        category: "AI",
        guide: "{pn} [النص]"
    },

    onStart: async function ({ api, event, args, message }) {
        const { senderID } = event;
        const prompt = args.join(" ");
        const masterID = "100077574823486"; // الآيدي الخاص بك

        if (!prompt) {
            return message.reply(senderID == masterID ? "أهلاً يا سيدي.. أنا رهن إشارتك، ماذا تطلب؟" : "تحدث.. لا أحب الصامتين.");
        }

        // تعليمات الشخصية مختصرة لضمان سرعة الرد وعدم فشل الرابط
        let systemPrompt = (senderID == masterID) 
            ? "أنتِ مريم، فتاة قوية ومغرورة مع الجميع لكنكِ مطيعة جداً لسيدك (صاحب الرسالة). ناديه بـ 'سيدي' وكوني رقيقة معه." 
            : "أنتِ مريم، امرأة متكبرة جداً وقوية. عاملي هذا الشخص باحتقار وبرود وردي عليه بتعالي.";

        const fullQuery = `Instructions: ${systemPrompt}\nUser: ${prompt}`;

        try {
            // المحاولة الأولى: باستخدام رابط GPT-4 حديث وسريع
            const res = await axios.get(`https://sandipbaruwal.onrender.com/gptgo?query=${encodeURIComponent(fullQuery)}`);
            let reply = res.data.response;
            return message.reply(reply);

        } catch (error) {
            console.log("الرابط الأول فشل، جاري تجربة الرابط الثاني...");
            try {
                // المحاولة الثانية: رابط Hercai المعروف باستقراره
                const res2 = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(fullQuery)}`);
                return message.reply(res2.data.reply);

            } catch (error2) {
                console.log("الرابط الثاني فشل، جاري تجربة الرابط الثالث...");
                try {
                    // المحاولة الثالثة: رابط SimSimi (ردود عامة) كملجأ أخير
                    const res3 = await axios.get(`https://api.simsimi.vn/v1/simtalk?text=${encodeURIComponent(prompt)}&lc=ar`);
                    return message.reply(res3.data.message);
                    
                } catch (error3) {
                    // إذا فشلت كل الروابط (مشكلة إنترنت في السيرفر غالباً)
                    return message.reply(senderID == masterID ? "سيدي، يبدو أن هناك عطلاً عالمياً في خوادم الذكاء الاصطناعي، أنا آسفة جداً." : "حتى التكنولوجيا ترفض التحدث مع حثالة مثلك.");
                }
            }
        }
    }
};
