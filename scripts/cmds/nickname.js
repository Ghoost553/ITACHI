module.exports = {
  config: {
    name: "كنية",
    version: "1.5.0",
    author: "NT",
    countDown: 5,
    role: 0, // 0 = للجميع، 1 = المشرفين فقط (ملاحظة: لتغيير كنية "الجميع" قد يحتاج البوت صلاحيات مشرف)
    description: "تغيير كنيتك، كنية شخص محدد، أو كنية جميع أعضاء المجموعة.",
    category: "المجموعة",
    guide: {
      ar: "/كنية [الكنية الجديدة]\n/كنية [@منشن] [الكنية الجديدة]\n/كنية جميع [الكنية الجديدة]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, mentions } = event;

    // التحقق من إدخال اسم الكنية
    if (args.length === 0) {
      return api.sendMessage("⚠️ يرجى إدخال الكنية الجديدة التي ترغب في تعيينها.", threadID, event.messageID);
    }

    // الحالة الأولى: تغيير كنية جميع الأعضاء (/كنية جميع <الكنية>)
    if (args[0].toLowerCase() === "جميع") {
      const nicknameToSet = args.slice(1).join(" ");
      if (!nicknameToSet) {
        return api.sendMessage("⚠️ يرجى كتابة الكنية بعد كلمة 'جميع'.\nمثال: /كنية جميع المشاغبين", threadID, event.messageID);
      }

      try {
        const threadInfo = await api.getThreadInfo(threadID);
        const participantIDs = threadInfo.participantIDs;

        api.sendMessage(`🔄 جاري تغيير كنية جميع الأعضاء (${participantIDs.length} عضو) إلى: "${nicknameToSet}"...`, threadID);

        for (const userID of participantIDs) {
          await api.changeNickname(nicknameToSet, threadID, userID);
        }

        return api.sendMessage("✅ تم تغيير كنية جميع الأعضاء بنجاح!", threadID);
      } catch (error) {
        return api.sendMessage(`❌ حدث خطأ أثناء محاولة تغيير كنية الجميع: ${error.message}`, threadID, event.messageID);
      }
    }

    // الحالة الثانية: تغيير كنية شخص تم عمل منشن له (/كنية @شخص <الكنية>)
    const mentionKeys = Object.keys(mentions);
    if (mentionKeys.length > 0) {
      const targetUserID = mentionKeys[0]; // نأخذ أول شخص تم عمل منشن له
      const mentionName = mentions[targetUserID];
      
      // إزالة المنشن من النص للحصول على الكنية فقط
      const nicknameToSet = args.join(" ").replace(mentionName, "").trim();

      if (!nicknameToSet) {
        return api.sendMessage("⚠️ يرجى كتابة الكنية الجديدة بعد المنشن.", threadID, event.messageID);
      }

      try {
        await api.changeNickname(nicknameToSet, threadID, targetUserID);
        return api.sendMessage(`✅ تم تغيير كنية العضو بنجاح إلى: "${nicknameToSet}"`, threadID, event.messageID);
      } catch (error) {
        return api.sendMessage(`❌ تعذر تغيير الكنية: ${error.message}`, threadID, event.messageID);
      }
    }

    // الحالة الثالثة: تغيير كنية كاتب الأمر نفسه (/كنية <الكنية>)
    const nicknameToSet = args.join(" ");
    try {
      await api.changeNickname(nicknameToSet, threadID, senderID);
      return api.sendMessage(`✅ تم تغيير كنيتك بنجاح إلى: "${nicknameToSet}"`, threadID, event.messageID);
    } catch (error) {
      return api.sendMessage(`❌ تعذر تغيير كنيتك: ${error.message}`, threadID, event.messageID);
    }
  }
};
