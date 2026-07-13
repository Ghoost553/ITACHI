const axios = require('axios');

module.exports = {
    config: {
        name: "اقتباس",
        aliases: ["quote", "كتابة"],
        version: "1.0.1",
        author: "AI Assistant",
        countDown: 5,
        role: 0,
        shortDescription: "تحويل النص إلى صورة اقتباس رائعة",
        longDescription: "قم بكتابة نص ليتم تصميمه داخل صورة اقتباس مع صورتك الشخصية واسمك الشخصي.",
        category: "fun",
        guide: "{p}اقتباس (النص الخاص بك)"
    },

    onStart: async function ({ message, event, args, usersData }) {
        const text = args.join(" ");
        if (!text) {
            return message.reply("⚠️ اكتب النص الذي تريد تحويله لاقتباس! مثال:\n/اقتباس كن جميلاً ترى الوجود جميلاً.");
        }

        const senderID = event.senderID;
        
        // جلب اسم المستخدم الحقيقي من قاعدة بيانات البوت (usersData)
        let name = "مستخدم فيسبوك";
        try {
            if (usersData && typeof usersData.getName === "function") {
                name = await usersData.getName(senderID);
            }
        } catch (e) {
            console.error("تعذر جلب اسم المستخدم:", e);
        }

        message.reply("✍️ جاري تصميم الاقتباس، انتظر لحظة...");

        try {
            // إعداد البيانات وإرسالها إلى الـ API الخاص بـ Quotly
            const quoteData = {
                "type": "quote",
                "format": "png",
                "backgroundColor": "#1b1b1b",
                "width": 512,
                "height": 768,
                "scale": 2,
                "messages": [
                    {
                        "entities": [],
                        "avatar": true,
                        "from": {
                            "id": parseInt(senderID) || 100000000000000,
                            "first_name": name,
                            "last_name": "",
                            "username": "",
                            "language_code": "ar"
                        },
                        "text": text,
                        "replyBackup": {}
                    }
                ]
            };

            const response = await axios.post('https://bot.carlyxs.my.id/api/quote', quoteData);
            
            // التحقق من استجابة الخادم
            const base64Image = response.data.result || response.data.image;

            if (!base64Image) {
                return message.reply("❌ فشل تصميم الاقتباس، لم يقم الخادم بإرسال الصورة.");
            }

            // تحويل الـ Base64 إلى Buffer ليتم إرساله كمرفق (Attachment)
            const buffer = Buffer.from(base64Image, 'base64');

            return message.reply({
                body: `💬 تفضل اقتباسك يا ${name}:`,
                attachment: buffer
            });

        } catch (error) {
            console.error("خطأ في أمر الاقتباس:", error);
            return message.reply("❌ حدث خطأ أثناء الاتصال بخادم الاقتباسات، يرجى المحاولة لاحقاً.");
        }
    }
};
