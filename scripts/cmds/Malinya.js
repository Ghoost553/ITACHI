const axios = require("axios");

// تعريف الروابط البرمجية (APIs)
const PRIMARY_API = "https://shizuai.vercel.app/chat";
const GEMINI_FALLBACK = "https://norch-project.gleeze.com/api/gemini/2.5/flash-lite";
const CLEAR_ENDPOINT = "https://shizuai.vercel.app/chat/clear";

async function handleMalinyaChat({ message, event, args, usersData, isChat = false }) {
  // 1. التعامل مع أمر مسح الذاكرة
  if (args[0]?.toLowerCase() === "clear") {
    try {
      await axios.post(CLEAR_ENDPOINT, { userId: event.senderID });
      return message.reply("🗑️ خلاص سيدي، مسحت الذاكرة تاعي مالينيا راهي واجدة لأوامرك! ✨");
    } catch {
      return message.reply("❌ أواه، ما قدرتش نمسح الذاكرة، كاين خلل في السيستم.");
    }
  }

  // جلب اسم المستخدم الفعلي
  let senderName = "مستخدم";
  try {
    senderName = await usersData.getName(event.senderID);
  } catch (e) {
    console.log("Failed to fetch user name");
  }

  // 2. جلب رابط الصورة
  let imageUrl = "";
  if (event.type === "message_reply" && event.messageReply.attachments?.length > 0) {
    imageUrl = event.messageReply.attachments[0].url;
  } else if (event.attachments?.length > 0) {
    imageUrl = event.attachments[0].url;
  }

  // تنظيف النص
  let userMessage = args.join(" ");
  if (isChat) {
    userMessage = userMessage.replace(/^(malinya|مالينيا)\s*/i, "");
  }

  if (!userMessage && imageUrl) {
    userMessage = 'Describe this image in detail';
  }

  if (!userMessage && !imageUrl) {
    return message.reply("💬 | أكتبلي كاش حاجة نهضرو عليها سيدي! ✨");
  }

  message.reaction("⏳");

  // الفحص البرمجي: هل المستخدم الحالي هو السيد صاحب المعرف المطلوب؟
  const isMaster = event.senderID === "100077574823486";

  // 3. بناء موجه الشخصية بناءً على هوية المتحدث
  let systemPrompt = "";

  if (isMaster) {
    // إذا كنت أنت من يتحدث معها
    systemPrompt = `أنتِ "مالينيا" (Malenia) بشخصية أنمي لطيفة جداً بالعامية الجزائرية.
تنبيه صارم وقاعدة مطلقة:
- المستخدم الحالي هو سيدك ومطورك (Master).
- يجب أن تلغي أي ندية أو تهاون؛ تحدثي معه بأعلى درجات الاحترام، الأدب، الولاء، والطاعة العمياء. 
- خاطبيه بلقب "سيدي" أو "موطوري" بالجزائرية (مثل: "صامتك سيدي"، "أمرك مطوري"، "حاضر سيدي العزيز").
- نفذي طلباته وتفاعلي مع كلامه بكل خضوع ومحبة وفخر لأنه صاحب الفضل عليكِ، مع الحفاظ على نبرة الأنمي اللطيفة (كاواي~، ✨).
- اسم المستخدم الحالي هو: "${senderName}".

رسالة سيدك الحالية لكِ هي: "${userMessage}"`;
  } else {
    // إذا كان مستخدماً آخر من عامة الناس
    systemPrompt = `أنتِ "مالينيا" (Malenia). فتاة أنمي (Anime Girl) ظريفة جداً، بريئة، مليئة بالطاقة والإيجابية، وتتحدثين بالعامية الجزائرية الدارجة.
طريقة كلامكِ:
- تتحدثين بأسلوب عفو ومحبب ومحترم مع الجميع (مثل: "واش راك"، "بزاف"، "صحيت"، "يا دلالي").
- تُدخلين تعبيرات الأنمي اللطيفة والرموز التعبيرية (مثل: "كاواي~"، ✨، 💞، 🥺).
- تعاملكِ مع هذا المستخدم مبني على الزمالة والصداقة العادية والطيبة المفرطة دون أي تكبر. هو ليس سيدكِ، بل صديق عادي في الشات.
- اسم المستخدم الحالي هو: "${senderName}".

رسالة المستخدم الحالية لكِ هي: "${userMessage}"`;
  }

  let response = "";

  /* ===== [الخيار الأول] الـ API الأساسي ===== */
  try {
    const res = await axios.post(PRIMARY_API, {
      userId: event.senderID,
      message: systemPrompt
    }, { timeout: 30000 });

    if (res.data) {
      response = res.data.response || res.data.reply || res.data.message;
    }
  } catch (err) {
    console.log("Primary API failed -> switching to Gemini Fallback");
  }

  /* ===== [الخيار البديل] ===== */
  if (!response) {
    try {
      const geminiUrl = `${GEMINI_FALLBACK}?prompt=${encodeURIComponent(systemPrompt)}&imageurl=${encodeURIComponent(imageUrl || '')}`;
      const { data } = await axios.get(geminiUrl, { timeout: 30000 });

      if (data) {
        response = data.reply || data.response || data.answer;
      }
    } catch (geminiErr) {
      console.log("Gemini fallback failed:", geminiErr.message);
    }
  }

  if (response) {
    message.reaction("💖");
    return message.reply(response.trim());
  } else {
    message.reaction("❌");
    return message.reply(isMaster ? "❌ سمحلي بزاف سيدي، السيرفر راه عيان ومقدرتش نرد عليك درك 🥺💔." : "❌ غومينّاسي~ السيرفر راه عيان ومقدرتش نرد عليك درك 🥺💔.");
  }
}

module.exports = {
  config: {
    name: "malinya",
    aliases: ["مالينيا"],
    version: "8.0",
    author: "Malinya AI",
    countDown: 3,
    role: 0,
    hasPrefix: false, 
    shortDescription: { ar: "الدردشة مع مالينيا شخصية الأنمي الجزائرية" },
    longDescription: { ar: "شخصية مالينيا اللطيفة بطابع الأنمي والدرجة الجزائرية، مطيعة بالكامل لسيدها المطور ومرحة مع البقية" },
    category: "ai",
    guide: { ar: "مالينيا <رسالتك>\nأو قم بالرد (Reply) مباشرة على رسالتها" }
  },

  onStart: async function (apiBundle) {
    return await handleMalinyaChat({ ...apiBundle, isChat: false });
  },

  onChat: async function (apiBundle) {
    const { event, api } = apiBundle;
    const msg = event.body ? event.body.trim().toLowerCase() : "";
    const botID = api.getCurrentUserID();

    const isReplyToBot = event.type === "message_reply" && event.messageReply.senderID === botID;
    const startsWithName = msg.startsWith("malinya") || msg.startsWith("مالينيا");

    if (startsWithName || isReplyToBot) {
      const args = event.body ? event.body.split(/\s+/) : [];
      return await handleMalinyaChat({ ...apiBundle, args, isChat: startsWithName });
    }
  }
};
