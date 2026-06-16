const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "malinyaDynamicClock",
    version: "2.0",
    author: "Malinya System",
    category: "system"
  },

  onLoad: async ({ api }) => {
    setInterval(async () => {
      try {
        const now = moment().tz("Africa/Algiers");
        const time = now.format("HH:mm");
        const date = now.format("YYYY/MM/DD");
        const hour = parseInt(now.format("HH"));

        let title, mood, system, border;

        // 🌅 صباح
        if (hour >= 5 && hour < 12) {
          title = "☀️ 𝗠𝗢𝗥𝗡𝗜𝗡𝗚 𝗠𝗢𝗗𝗘";
          mood = [
            "✦ صباح النور 🌸 يوم جديد يبدأ بقوة",
            "✦ استغل طاقتك… كل شيء أمامك",
            "✦ النظام في وضع الإشراق ☀️"
          ];
          system = "🟢 نشط | بداية قوية";
          border = "╔═══ 𝗦𝗨𝗡 𝗘𝗡𝗘𝗥𝗚𝗬 ═══╗";
        }

        // ☀️ ظهر / عصر
        else if (hour >= 12 && hour < 18) {
          title = "⚡ 𝗔𝗙𝗧𝗘𝗥𝗡𝗢𝗢𝗡 𝗠𝗢𝗗𝗘";
          mood = [
            "✦ نهار نشيط 🔥 استمر في التقدم",
            "✦ لا تتوقف… القوة في المنتصف",
            "✦ النظام يعمل بأقصى كفاءة ⚙️"
          ];
          system = "🟡 مستقر | أداء عالي";
          border = "╔═══ 𝗣𝗢𝗪𝗘𝗥 𝗠𝗢𝗗𝗘 ═══╗";
        }

        // 🌙 مساء
        else if (hour >= 18 && hour < 22) {
          title = "🌙 𝗘𝗩𝗘𝗡𝗜𝗡𝗚 𝗠𝗢𝗗𝗘";
          mood = [
            "✦ مساء هادئ ✨ خفف الضغط",
            "✦ لحظة راحة تستحقها",
            "✦ النظام في وضع الاستقرار 🌙"
          ];
          system = "🟠 هادئ | استقرار";
          border = "╔═══ 𝗖𝗔𝗟𝗠 𝗠𝗢𝗗𝗘 ═══╗";
        }

        // 🌌 ليل
        else {
          title = "🌌 𝗡𝗜𝗚𝗛𝗧 𝗠𝗢𝗗𝗘";
          mood = [
            "✦ ليلة عميقة 🌌 النظام يحرسك",
            "✦ كل شيء هادئ… استرح",
            "✦ وضع الحماية الليلية مفعل 🔒"
          ];
          system = "🔵 حماية | وضع الليل";
          border = "╔═══ 𝗡𝗜𝗚𝗛𝗧 𝗦𝗛𝗜𝗘𝗟𝗗 ═══╗";
        }

        const randomMsg = mood[Math.floor(Math.random() * mood.length)];

        const msg = `
${border}
║ ⚡ 𝑩𝑶𝑻 𝑴𝑨𝑳𝑰𝑵𝒀𝑨 𝑺𝒀𝑺𝑻𝑬𝑴 ⚡
║ 🧠 LIVE CLOCK ENGINE
╚══════════════════════

╭────────────────────╮
│ 🇩🇿 ALGERIA STATUS
├────────────────────┤
│ ⏰ الوقت : ${time}
│ 📅 التاريخ : ${date}
│ 📡 الحالة : ${system}
│ 🧠 الوضع : ${title}
╰────────────────────╯

╭────────────────────╮
│ 💬 MESSAGE CORE
├────────────────────┤
│ ${randomMsg}
│ ✦ كل شيء يعمل بسلاسة
│ ✦ MALINYA يراقب النظام ⚡
╰────────────────────╯

╭════════════════════╮
║ 🔁 تحديث كل ساعة
║ 🤖 MALINYA SYSTEM ACTIVE
╚════════════════════╝
`;

        const threadID = global.db.allThreadData?.find(t => t.data?.clock)?.threadID;

        if (threadID) {
          api.sendMessage(msg, threadID);
        }

      } catch (e) {
        console.log("Malinya dynamic clock error:", e);
      }
    }, 1000 * 60 * 60);
  }
};
