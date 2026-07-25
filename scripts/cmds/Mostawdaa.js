const axios = require("axios");

module.exports = {
  config: {
    name: "مستودع",
    version: "3.0",
    author: "GHOST",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "جلب تفاصيل ورابط تحميل مستودع GitHub"
    },
    longDescription: {
      ar: "يقوم بجلب معلومات شاملة لأي مستودع على GitHub مع رابط التحميل المباشر سواء أدخلت الرابط أو اسم المستودع."
    },
    category: "أدوات",
    guide: {
      ar: " {p}مستودع [رابط_المستودع أو user/repo]"
    }
  },

  onStart: async function ({ api, event, args }) {
    let input = args[0];

    // التأكد من إدخال قيمة
    if (!input) {
      return api.sendMessage(
        "❌ يرجى إدخال اسم أو رابط المستودع!\n\n📌 **أمثلة للاستخدام:**\n• `.مستودع expressjs/express`\n• `.مProps https://github.com/expressjs/express`",
        event.threadID,
        event.messageID
      );
    }

    // تنظيف الرابط واستخراج (User/Repo) تلقائياً
    const repoPath = input
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/\.git$/, "")
      .replace(/\/$/, "");

    if (!repoPath.includes("/")) {
      return api.sendMessage(
        "❌ الصيغة غير صحيحة! يجب أن يكون الإدخال بحجم: `مستخدم/مستودع` أو رابط مباشر.",
        event.threadID,
        event.messageID
      );
    }

    try {
      // جلب البيانات من GitHub API
      const response = await axios.get(`https://api.github.com/repos/${repoPath}`);
      const data = response.data;

      // حساب الحجم والتاريخ
      const sizeMB = (data.size / 1024).toFixed(2);
      const lastUpdate = new Date(data.updated_at).toLocaleDateString("ar-EG");

      // رابط تحميل ZIP للمستودع كاملاً
      const zipDownloadUrl = `https://github.com/${repoPath}/archive/refs/heads/${data.default_branch}.zip`;

      const msg = 
        `📊 **تفاصيل المستودع الشاملة**\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🏷️ **الاسم:** ${data.full_name}\n` +
        `📝 **الوصف:** ${data.description || "لا يوجد وصف"}\n` +
        `💻 **اللغة:** ${data.language || "غير محددة"}\n` +
        `📦 **الحجم:** ${sizeMB} ميجابايت\n` +
        `⭐ **النجوم:** ${data.stargazers_count}\n` +
        `🍴 **التفرعات (Forks):** ${data.forks_count}\n` +
        `🚨 **المشاكل المفتوحة:** ${data.open_issues_count}\n` +
        `📜 **الترخيص:** ${data.license ? data.license.spdx_id : "بدون ترخيص"}\n` +
        `📅 **آخر تحديث:** ${lastUpdate}\n` +
        `🌿 **الفرع الافتراضي:** ${data.default_branch}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📥 **رابط تحميل الكود كاملاً (ZIP):**\n${zipDownloadUrl}\n\n` +
        `🌐 **رابط المستودع الأصل:**\n${data.html_url}`;

      return api.sendMessage(msg, event.threadID, event.messageID);

    } catch (error) {
      return api.sendMessage(
        "⚠️ لم يتم العثور على المستودع! تأكد من صحة الرابط/الاسم وأن المستودع عام (Public وليس Private).",
        event.threadID,
        event.messageID
      );
    }
  }
};
