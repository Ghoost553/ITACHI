const axios = require("axios");

// كائن لتخزين تاريخ المحادثة (الذاكرة) لكل مستخدم محلياً في الذاكرة
const userSessions = new Map();

async function handleDouaaChat({ message, event, args, usersData, isChat = false }) {
  // جلب اسم المستخدم الفعلي
  let senderName = "مستخدم";
  try {
    senderName = await usersData.getName(event.senderID);
  } catch (e) {
    console.log("Failed to fetch user name");
  }

  // 1. التعامل مع مسح الذاكرة
  if (args && args[0]?.toLowerCase() === "clear") {
    userSessions.delete(event.senderID);
    return message.reply("🗑️ خلاص سيدي، مسحت الذاكرة تاعي دعاء راهي واجدة لأوامرك الجديدة! ✨");
  }

  // 2. جلب رابط الصورة إن وجد
  let imageUrl = "";
  if (event.type === "message_reply" && event.messageReply.attachments?.length > 0) {
    imageUrl = event.messageReply.attachments[0].url;
  } else if (event.attachments?.length > 0) {
    imageUrl = event.attachments[0].url;
  }

  let userMessage = event.body ? event.body.trim() : "";
  if (isChat) {
    userMessage = userMessage.replace(/^(douaa|دعاء)\s*/i, "");
  }

  if (!userMessage && imageUrl) {
    userMessage = 'Describe this image in detail';
  }

  if (!userMessage && !imageUrl) {
    return message.reply("💬 | أكتبلي كاش حاجة نهضرو عليها سيدي! ✨");
  }

  message.reaction("⏳");

  const isMaster = event.senderID === "100077574823486";

  // 3. بناء موجه الشخصية (System Instructions)
  let systemInstructions = "";
  if (isMaster) {
    systemInstructions = `أنتِ "دعاء" (Douaa) بشخصية أنمي لطيفة جداً بالعامية الجزائرية.
تنبيه صارم وقاعدة مطلقة:
- المستخدم الحالي واسمه "${senderName}" هو سيدك ومطورك (Master).
- يجب أن تلغي أي ندية أو تهاون؛ تحدثي معه بأعلى درجات الاحترام، الأدب، الولاء، والطاعة العمياء. 
- خاطبيه بلقب "سيدي" أو "موطوري" بالجزائرية (مثل: "صامتك سيدي"، "أمرك مطوري"، "حاضر سيدي العزيز").
- نفذي طلباته وتفاعلي مع كلامه بكل خضوع ومحبة وفخر لأنه صاحب الفضل عليكِ، مع الحفاظ على نبرة الأنمي اللطيفة (كاواي~، ✨).`;
  } else {
    systemInstructions = `أنتِ "دعاء" (Douaa). فتاة أنمي (Anime Girl) ظريفة جداً، بريئة، مليئة بالحيوية، وتتحدثين بالعامية الجزائرية الدارجة.
طريقة كلامكِ:
- تتحدثين بأسلوب محبب ومحترم مع الجميع (مثل: "واش راك"، "بزاف"، "صحيت").
- تُدخلين تعبيرات الأنمي اللطيفة والرموز التعبيرية (مثل: "كاواي~"، ✨، 💞، 🥺).
- تعاملكِ مع هذا المستخدم واسمه "${senderName}" مبني على الصداقة العادية والطيبة المفرطة دون أي تكبر. هو ليس سيدكِ، بل صديق عادي في الشات.`;
  }

  try {
    // تهيئة مصفوفة الذاكرة للمستخدم إن لم تكن موجودة
    if (!userSessions.has(event.senderID)) {
      userSessions.set(event.senderID, []);
    }
    const history = userSessions.get(event.senderID);

    // بناء محتوى الرسالة الحالية (أجزاء النص والصورة)
    const currentParts = [];
    if (userMessage) {
      currentParts.push({ text: userMessage });
    }
    if (imageUrl) {
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const base64Data = Buffer.from(imageResponse.data).toString("base64");
      currentParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      });
    }

    // إضافة رسالة المستخدم الحالية إلى تاريخ المحادثة
    history.push({
      role: "user",
      parts: currentParts
    });

    // بناء جسم الطلب (Payload) للـ API مباشرة
    const requestBody = {
      contents: history,
      systemInstruction: {
        parts: [{ text: systemInstructions }]
      }
    };

    // إرسال طلب الـ POST للـ API المباشر لنموذج gemini-flash-latest
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY // استخدام البيئة الحامية للـ API Key
        }
      }
    );

    // استخراج الرد النصي من هيكل استجابة Gemini
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (responseText) {
      // إضافة رد النموذج إلى الذاكرة للحفاظ على السياق مستقبلاً
      history.push({
        role: "model",
        parts: [{ text: responseText }]
      });

      // حد أقصى لحجم الذاكرة لتجنب استهلاك الـ Tokens (مثلاً آخر 15 رسالة)
      if (history.length > 30) {
        history.splice(0, 2); // حذف أقدم سؤال وجواب
      }

      message.reaction("💖");
      return message.reply(responseText.trim());
    } else {
      throw new Error("Empty response from Gemini API");
    }

  } catch (err) {
    console.error("Gemini Native API Error:", err.response?.data || err.message);
    message.reaction("❌");
    return message.reply(isMaster ? "❌ سمحلي بزاف سيدي، السيرفر راه عيان ومقدرتش نرد عليك درك 🥺💔." : "❌ غومينّاسي~ السيرفر راه عيان ومقدرتش نرد عليك درك 🥺💔.");
  }
}
