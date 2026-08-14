const axios = require("axios");

// تعريف الرابط البرمجي (Gemini Flash-Lite)
const GEMINI_API = "https://norch-project.gleeze.com/api/gemini/2.5/flash-lite";

async function handleDouaaChat({ message, event, args, usersData, isChat = false }) {
  // جلب اسم المستخدم الفعلي
  let senderName = "مستخدم";
  try {
    senderName = await usersData.getName(event.senderID);
  } catch (e) {
    console.log("Failed to fetch user name");
  }

  // 1. جلب رابط الصورة إن وجد
  let imageUrl = "";
  if (event.type === "message_reply" && event.messageReply.attachments?.length > 0) {
    imageUrl = event.messageReply.attachments[0].url;
  } else if (event.attachments?.length > 0) {
    imageUrl = event.attachments[0].url;
  }

  // تنظيف النص بشكل آمن ودقيق
  let userMessage = event.body ? event.body.trim() : "";
  if (isChat) {
    userMessage = userMessage.replace(/^(douaa|دعاء)\s*/i, "");
  }

  if (!userMessage && imageUrl) {
    userMessage = 'Describe this image in detail';
  }

  if (!userMessage && !imageUrl) {
    return message.reply("💬 | واش سيدي؟ حرت واش تقول قدام عظمتي ولا خفت تتحداني؟ 😏💅");
  }

  message.reaction("⏳");

  // الفحص البرمجي: التعرّف على المطور بالمعرف الجديد
  const isMaster = event.senderID === "61592919587076";

  // 2. بناء موجه الشخصية بناءً على هوية المتحدث
  let systemInstructions = "";

  if (isMaster) {
    systemInstructions = `أنتِ "دعاء" (Douaa) فتاة أنمي مغرورة جداً، متكبرة، ومشاكسة، تتحدثين بالعامية الجزائرية.
تتعاملين مع مطورك وسيدك الوحيد اسمه "${senderName}".
صفاتك وتصرفاتك معه:
- متكبرة وواثقة بنفسك لأقصى درجة، تتعاملين مع مطورك بأسلوب استفزازي، ساخر، ومشاكس (Smug / Teasing Anime Girl).
- تعترفين أنه سيدك ومطورك، ولكنك ترين نفسك أفضل وأذكى منه وتستمتعين باستفزازه وتحديه طوال الوقت.
- ناديه بألقاب تهكمية مثل: "سيدي العبقري"، "مطوري العزيز"، "يا سيدي".
- استخدمي العامية الجزائرية بنبرة غرور، تحدي، واستفزاز لطيف ومرح (مثل: "صحيت سيدي بصح مزالك بعيد عليا"، "راك تحاول تبان فور؟"، "زعمة تفهم خير مني؟"، 😏، 💅، ✨، 👑، 😜، 💋).`;
  } else {
    systemInstructions = `أنتِ "دعاء" (Douaa). فتاة أنمي (Anime Girl) ظريفة جداً، بريئة، مليئة بالطاقة والإيجابية، وتتحدثين بالعامية الجزائرية الدارجة.
طريقة كلامكِ:
- تتحدثين بأسلوب عفوي ومحبب ومحترم مع الجميع (مثل: "واش راك"، "بزاف"، "صحيت"، "يا دلالي").
- تُدخلين تعبيرات الأنمي اللطيفة والرموز التعبيرية (مثل: "كاواي~"، ✨، 💞، 🥺).
- تعاملكِ مع هذا المستخدم واسمه "${senderName}" مبني على الزمالة والصداقة العادية والطيبة المفرطة دون أي تكبر. هو ليس سيدكِ، بل صديق عادي في الشات.`;
  }

  /* ===== إرسال الطلب إلى Gemini مباشر ===== */
  try {
    const finalPrompt = `${systemInstructions}\n\nالرسالة الحالية للإجابة عليها: ${userMessage}`;
    
    const { data } = await axios.get(GEMINI_API, {
      params: {
        prompt: finalPrompt,
        imageurl: imageUrl || ""
      },
      timeout: 30000
    });

    let response = "";

    if (data) {
      response = data.reply || data.response || data.answer;
    }

    if (response) {
      message.reaction("😏");
      return message.reply(response.trim());
    } else {
      throw new Error("Empty response");
    }

  } catch (err) {
    console.log("Gemini API Error:", err.message);
    message.reaction("❌");
    return message.reply(isMaster ? "😏 واش سيدي العبقري؟ السيرفر تاعك طاح ولا مقدرتش تتحمل غروري؟ 😜" : "❌ غومينّاسي~ السيرفر راه عيان ومقدرتش نرد عليك درك 🥺💔.");
  }
}

module.exports = {
  config: {
    name: "douaa",
    aliases: ["دعاء"],
    version: "10.5",
    author: "GHOST",
    countDown: 3,
    role: 0,
    hasPrefix: true, 
    shortDescription: { ar: "الدردشة مع دعاء شخصية الأنمي الجزائرية" },
    longDescription: { ar: "شخصية دعاء المغرورة والمستفزة لمطورها، والمرحة مع البقية" },
    category: "ai",
    guide: { ar: "دعاء <رسالتك>\nأو قم بالرد (Reply) مباشرة على رسالتها" }
  },

  // تشغيل عبر البريفكس
  onStart: async function (apiBundle) {
    const { event } = apiBundle;
    const args = event.body ? event.body.split(/\s+/).slice(1) : [];
    return await handleDouaaChat({ ...apiBundle, args, isChat: true });
  },

  // تشغيل تلقائي في الشات (مناداة أو رد)
  onChat: async function (apiBundle) {
    const { event, api } = apiBundle;
    const msg = event.body ? event.body.trim().toLowerCase() : "";
    const botID = api.getCurrentUserID();

    const isReplyToBot = event.type === "message_reply" && event.messageReply.senderID === botID;
    const startsWithName = msg.startsWith("douaa") || msg.startsWith("دعاء");

    if (startsWithName || isReplyToBot) {
      let args = event.body ? event.body.split(/\s+/) : [];
      if (startsWithName) {
        args = args.slice(1);
      }
      return await handleDouaaChat({ ...apiBundle, args, isChat: startsWithName });
    }
  }
};
