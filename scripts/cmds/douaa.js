const { GoogleGenAI } = require("@google/genai");

// تهيئة مكتبة Gemini الرسمية باستخدام مفتاح الـ API الخاص بك
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// كائن لتخزين الـ interaction_id الخاص بكل مستخدم محلياً في الذاكرة لتفعيل الذاكرة المستمرة
const userSessions = new Map();

async function handleDouaaChat({ message, event, args, usersData, isChat = false }) {
  // جلب اسم المستخدم الفعلي
  let senderName = "مستخدم";
  try {
    senderName = await usersData.getName(event.senderID);
  } catch (e) {
    console.log("Failed to fetch user name");
  }

  // 1. التعامل مع مسح الذاكرة (بسيط جداً الآن، فقط نحذف الـ Session ID)
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
    // جلب الـ ID الخاص بالمحادثة السابقة إن وجد لتستمر "دعاء" في تذكر الكلام السابق
    const previousInteractionId = userSessions.get(event.senderID);

    // تجهيز محتويات الطلب (نص وصورة إن وجدت)
    const contents = [];
    if (userMessage) contents.push(userMessage);
    if (imageUrl) {
      contents.push({
        inlineData: {
          mimeType: "image/jpeg", // أو ديناميكياً بحسب نوع الصورة
          data: Buffer.from((await axios.get(imageUrl, { responseType: 'arraybuffer' })).data).toString("base64")
        }
      });
    }

    // إنشاء Interaction جديد باستخدام الـ SDK الرسمي ونموذج gemini-2.5-flash-lite المستقر وسريع الاستجابة
    const interaction = await ai.interactions.create({
      model: "gemini-2.5-flash-lite",
      contents: contents,
      config: {
        systemInstruction: systemInstructions,
        // حفظ الجلسة على السيرفر لتفعيل الذاكرة
        store: true 
      },
      // ربط الجلسة الحالية بالجلسة السابقة للمستخدم
      previousInteractionId: previousInteractionId || undefined
    });

    // حفظ معرف الجلسة الجديد للمرة القادمة
    if (interaction.id) {
      userSessions.set(event.senderID, interaction.id);
    }

    // استخراج الرد النهائي وإرساله للمستخدم
    const responseText = interaction.modelOutput?.text || "";

    if (responseText) {
      message.reaction("💖");
      return message.reply(responseText.trim());
    } else {
      throw new Error("No output from Gemini");
    }

  } catch (err) {
    console.error("Gemini Interactions API Error:", err);
    message.reaction("❌");
    return message.reply(isMaster ? "❌ سمحلي بزاف سيدي، السيرفر راه عيان ومقدرتش نرد عليك درك 🥺💔." : "❌ غومينّاسي~ السيرفر راه عيان ومقدرتش نرد عليك درك 🥺💔.");
  }
}
