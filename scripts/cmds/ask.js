const axios = require("axios");

module.exports = {
  config: {
    name: "سؤال",
    aliases: ["ask", "س", "سؤ"],
    version: "3.0",
    author: "GHOST",
    role: 0,
    category: "ai"
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) {
      return message.reply("✍️ اكتب سؤالك\nمثال: اين تقع اليابان");
    }

    let question = args.join(" ");

    try {
      // 🌐 بحث من DuckDuckGo
      const res = await axios.get(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(question)}&format=json`
      );

      let answer = res.data?.AbstractText;

      // 🌍 Wikipedia كخيار ثاني
      if (!answer || answer.length < 10) {
        const wiki = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(question)}`
        ).catch(() => null);

        answer = wiki?.data?.extract;
      }

      // 🧠 إذا السؤال غير مفهوم → تحليل ذكي
      if (!answer || answer.length < 5) {
        let guess = "";

        if (question.includes("كم")) {
          guess = "يبدو أنك تسأل عن عدد أو إحصائية، لكن السؤال غير واضح تماماً.";
        } else if (question.includes("اين")) {
          guess = "يبدو أنك تسأل عن موقع جغرافي.";
        } else if (question.includes("ما")) {
          guess = "يبدو أنك تسأل عن تعريف أو شرح شيء ما.";
        } else {
          guess = "لم أستطع فهم السؤال بدقة، حاول إعادة صياغته.";
        }

        return message.reply(
`╭───「 🤖 GHOST AI 」
│ ❓ السؤال:
│ ${question}
│
│ 🧠 التحليل:
│ ${guess}
│
│ 💡 نصيحة:
│ حاول كتابة السؤال بشكل أوضح
╰───────────────`
        );
      }

      // ✨ رد نهائي مزخرف
      return message.reply(
`╭───「 🤖 GHOST AI 」
│ ❓ السؤال:
│ ${question}
│
│ ━━━━━━━━━━━━━
│ 🧠 الإجابة:
│ ${answer}
│
│ ━━━━━━━━━━━━━
│ ⚡ ملاحظة:
│ تم تحليل السؤال + جلب معلومات من الإنترنت
╰───────────────`
      );

    } catch (err) {
      return message.reply(
`╭───「 ⚠️ خطأ 」
│ لم أستطع جلب المعلومات
│
│ 💡 حاول مرة أخرى لاحقاً
╰───────────────`
      );
    }
  }
};
