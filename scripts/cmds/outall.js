module.exports = {
  config: {
    name: "outall",
    version: "1.0.0",
    author: "GHOST",
    countDown: 10,
    role: 2, // للمطور/الأدمن الرئيسي فقط
    shortDescription: {
      ar: "خروج البوت من جميع المجموعات"
    },
    longDescription: {
      ar: "جعل البوت يغادر كافة المجموعات والمتطلبات التي يتواجد فيها حالياً."
    },
    category: "admin",
    guide: {
      ar: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      // جلب قائمة كافة المحادثات التي يتواجد فيها البوت
      const list = await api.getThreadList(100, null, ["INBOX"]);
      
      // تصفية المجموعات فقط (استثناء المحادثات الفردية)
      const groupThreads = list.filter(thread => thread.isGroup && thread.threadID !== event.threadID);
      
      if (groupThreads.length === 0) {
        return message.reply("⚠️ البوت غير متواجد في أي مجموعة أخرى حالياً.");
      }

      await message.reply(`⏳ جاري الخروج من ${groupThreads.length} مجموعة...`);

      let count = 0;
      for (const thread of groupThreads) {
        try {
          await api.removeUserFromGroup(api.getCurrentUserID(), thread.threadID);
          count++;
        } catch (e) {
          console.error(`تعذر الخروج من المجموعة: ${thread.threadID}`, e);
        }
      }

      // الخروج من المجموعة الحالية التي أُرسل منها الأمر في النهاية
      await message.reply(`✅ تم الخروج من ${count} مجموعة بنجاح. جاري الخروج من هذه المجموعة أيضاً...`);
      return await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);

    } catch (error) {
      console.error(error);
      return message.reply("❌ حدث خطأ أثناء محاولة الخروج من المجموعات.");
    }
  }
};
