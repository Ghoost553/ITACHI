const axios = require("axios");

module.exports = {
  config: {
    name: "فري_فاير",
    aliases: ["ff", "ffinfo"],
    version: "1.0.0",
    author: "GHOST",
    countDown: 5,
    role: 0,
    shortDescription: "جلب معلومات حساب فري فاير بواسطة ID",
    longDescription: "يقوم بجلب بيانات حساب فري فاير مثل الاسم، المستوى، الإعجابات، والمنطقة باستخدام ID الحساب.",
    category: "أدوات",
    guide: "{p}فري_فاير <ID_الحساب>"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const uid = args[0];

    if (!uid) {
      return api.sendMessage("❌ يرجى إدخال أيدي (ID) حساب فري فاير!\nمثال: .فري_فاير 123456789", threadID, messageID);
    }

    try {
      api.sendMessage("🔍 جاري البحث عن بيانات الحساب...", threadID, messageID);

      // استخدام API جلب بيانات فري فاير
      const res = await axios.get(`https://free-fire-api-five.vercel.app/api/ff-info?id=${uid}`);
      const data = res.data;

      if (!data || data.error || !data.AccountInfo) {
        return api.sendMessage("❌ لم يتم العثور على حساب بهذا الأيدي أو أن الخدمة غير متوفرة حالياً.", threadID, messageID);
      }

      const info = data.AccountInfo;
      const guild = data.GuildInfo || {};

      let msg = `🎮 **معلومات حساب فري فاير** 🎮\n`;
      msg += `-------------------------\n`;
      msg += `👤 **الاسم:** ${info.AccountName || "غير معروف"}\n`;
      msg += `🆔 **الأيدي:** ${info.AccountId}\n`;
      msg += `📊 **المستوى:** ${info.AccountLevel || "N/A"}\n`;
      msg += `⭐ **الإعجابات (Likes):** ${info.AccountLikes || 0}\n`;
      msg += `🌍 **المنطقة (Region):** ${info.AccountRegion || "غير معروف"}\n`;
      msg += `🛡️ **الكلان:** ${guild.GuildName || "لا يوجد"}\n`;
      msg += `👑 **قائد الكلان:** ${guild.GuildLeaderName || "N/A"}\n`;
      msg += `-------------------------\n`;
      msg += `✨ تم الاستخراج بنجاح!`;

      return api.sendMessage(msg, threadID, messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("⚠️ حدث خطأ أثناء جلب البيانات. تأكد من صحة الأيدي أو حاول لاحقاً.", threadID, messageID);
    }
  }
};
