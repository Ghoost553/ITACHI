const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "imagine",
        version: "1.0.0",
        author: "GHOST & Gemini",
        countDown: 10, // 10 ثوانٍ لمنع الضغط المكثف على السيرفر
        role: 0, // متاح للجميع
        description: "توليد صور برسم الذكاء الاصطناعي بمجرد الوصف",
        category: "media",
        guide: "{p}imagine [وصف الصورة بالإنجليزية أو العربية]"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const prompt = args.join(" ");

        // إذا لم يكتب المستخدم وصفاً للصورة
        if (!prompt) {
            return api.sendMessage("🎨 لازم تكتبلي وصف للصورة لي راك حابني نرسمها! \nمثال: !imagine a futuristic city, cyberpunk style", threadID, messageID);
        }

        // رسالة انتظار متماشية مع شخصية مالينيا
        api.sendMessage("🎨 راني نوجد في الألوان والفرشاة.. ثواني برك ونرسمهالك ✨", threadID, async (err, info) => {
            
            // تحديد مسار مؤقت لحفظ الصورة داخل سيرفر البوت قبل إرسالها
            const cachePath = path.join(__dirname, 'cache', `imagine_${messageID}.png`);
            
            try {
                // التأكد من وجود مجلد cache لحفظ الملحقات المؤقتة
                await fs.ensureDir(path.join(__dirname, 'cache'));

                // رابط الـ API لتوليد الصور (مجاني وسريع جداً)
                const apiUrl = `https://image.pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}`;

                // تحميل الصورة كـ Buffer
                const response = await axios({
                    method: 'GET',
                    url: apiUrl,
                    responseType: 'arraybuffer'
                });

                // حفظ الصورة في السيرفر مؤقتاً
                await fs.writeFile(cachePath, Buffer.from(response.data));

                // حذف رسالة الانتظار وإرسال الصورة المرسومة للمجموعة
                if (err) api.unsendMessage(info.messageID);
                
                await api.sendMessage({
                    body: "تفضل، هاهي الرسمة تاعك واجدة! واش رأيك؟ 😎🎨",
                    attachment: fs.createReadStream(cachePath)
                }, threadID, () => {
                    // حذف الصورة المؤقتة بعد الإرسال للحفاظ على مساحة السيرفر
                    fs.unlinkSync(cachePath);
                }, messageID);

            } catch (error) {
                console.error("خطأ في أمر الرسم:", error);
                if (err) api.unsendMessage(info.messageID);
                
                // حذف الملف المؤقت في حال حدوث خطأ أثناء التحميل
                if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
                
                return api.sendMessage("❌ عذراً، صرا مشكل والفرشاة تكسرت.. عاود جرب في وقت آخر!", threadID, messageID);
            }
        });
    }
};
