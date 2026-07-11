const axios = require("axios");

module.exports = {
  config: {
    name: "جليل",
    version: "1.0.0",
    author: "MALINYA",
    countDown: 3,
    role: 0,
    description: "عرض بطاقة تعريف ROBIN",
    category: "INFO"
  },

  onStart: async function ({ api, event }) {

    const msg = `
╭━━━〔 ✨ 𝙍𝙊𝘽𝙄𝙉 𝙋𝙍𝙊𝙁𝙄𝙇𝙀 ✨ 〕━━━╮

        👤 𝘽𝙄𝙊 𝘾𝘼𝙍𝘿

╭━━━━━━━━━━━━━━╮
│ 🏷️ الاسم : 𝙍𝙊𝘽𝙄𝙉
│ 🎂 العمر : 𝟭𝟲 سنة
│ 💙 الحالة : مرتبط
│ 💼 المهنة : مزال حال عليه
│ 🎓 الدراسة : أولى ثانوي
╰━━━━━━━━━━━━━━╯

📘 فيسبوك للتواصل:
https://www.facebook.com/profile.php?id=61572638745323

💫 ملاحظة:
لا تحكم عليه من عمره،
فالصغير في السن قد يكون كبيرًا في المقام 😎🔥

╰━━━〔 🤖 𝙈𝘼𝙇𝙄𝙉𝙔𝘼 𝘽𝙊𝙏 〕━━━╯
`;

    const image = await axios.get(
      "https://i.ibb.co/wNQj9Dqr/6afab301a08b.jpg",
      { responseType: "stream" }
    );

    api.sendMessage({
      body: msg,
      attachment: image.data
    }, event.threadID);
  }
};
