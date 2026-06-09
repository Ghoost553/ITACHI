const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "7.1",
    author: "GHOST",
    shortDescription: "عرض جميع الأوامر",
    longDescription: "عرض قائمة الأوامر بشكل منظم واحترافي",
    category: "system",
    guide: "{pn}help [command]"
  },

  onStart: async function ({ message, args, prefix, api }) {
    const allCommands = global.GoatBot.commands;

    // 🔥 ترجمة شاملة
    const tr = {
      4k: "تحسين الصور بدقة 4K",
      liner: "مساعد ذكاء اصطناعي",
      prompt: "إنشاء برومبت",
      remini: "تحسين الصور",
      weather: "الطقس",
      webinfo: "معلومات موقع",
      youai: "دردشة ذكاء اصطناعي",

      accept: "قبول الطلبات",
      pastebin: "رفع نص",
      qrgen: "إنشاء QR",
      translate: "ترجمة",
      uid: "معرفة UID",
      webss: "تصوير موقع",

      adduser: "إضافة عضو",
      admin: "المشرفون",
      all: "منشن الجميع",
      allbox: "كل المجموعات",
      boxinfo: "معلومات المجموعة",
      lock: "قفل المجموعة",
      warn: "إنذار",
      kick: "طرد عضو",
      kickall: "طرد الجميع",

      help: "المساعدة",
      restart: "إعادة تشغيل",
      update: "تحديث البوت",
      eval: "تنفيذ كود",
      backupdata: "نسخ احتياطي",
      clear: "مسح البيانات",
      setlang: "تغيير اللغة",

      kiss: "قبلة",
      pair: "تزاوج عشوائي",
      jail: "سجن",
      hack: "اختراق وهمي",
      trash: "قمامة",

      tiktok: "تحميل تيك توك",
      download: "تحميل",
      say: "تحويل نص لصوت",
      sing: "غناء",

      daily: "مكافأة يومية",
      bet: "مراهنة",
      slot: "لعبة حظ",
      leaderboard: "ترتيب اللاعبين"
    };

    const smartTranslate = (cmd) => {
      return tr[cmd] || cmd.replace(/[_-]/g, " ");
    };

    // 📌 تنظيم الكاتيجوري بشكل صحيح
    const normalizeCat = {
      "ai-image": "الذكاء الاصطناعي",
      ai: "الذكاء الاصطناعي",
      utility: "الأدوات",
      tools: "الأدوات",
      group: "المجموعة",
      box: "المجموعة",
      system: "النظام",
      owner: "المالك",
      fun: "الترفيه",
      entertainment: "الترفيه",
      media: "الوسائط",
      economy: "الاقتصاد",
      game: "الألعاب",
      anime: "أنمي",
      info: "معلومات",
      music: "الموسيقى",
      other: "أخرى"
    };

    const categories = {};

    for (const [name, cmd] of allCommands) {
      let cat = (cmd.config.category || "other").toLowerCase();
      cat = normalizeCat[cat] || cat;

      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    const formatCommands = (cmds) =>
      cmds
        .sort()
        .map(c => {
          const desc = smartTranslate(c);
          return `• ${c.padEnd(15)} → ${desc}`;
        })
        .join("\n");

    let msg =
`╭─『 🤖 GHOST BOT 』
│ 📊 ${allCommands.size} أمر
╰────────────\n`;

    for (const cat of Object.keys(categories)) {
      msg += `\n📁 ${cat}\n`;
      msg += formatCommands(categories[cat]) + "\n";
    }

    msg += `\n💡 اكتب: ${prefix}help <اسم الأمر>`;

    // 🎯 GIF واحد ثابت (بدون تحميل كل مرة)
    const gifPath = path.join(__dirname, "cache", "menu.gif");

    try {
      if (!fs.existsSync(path.dirname(gifPath))) {
        fs.mkdirSync(path.dirname(gifPath), { recursive: true });
      }

      // تحميل مرة واحدة فقط
      if (!fs.existsSync(gifPath)) {
        const url = "https://i.imgur.com/Xw6JTfn.gif";

        await new Promise((resolve, reject) => {
          const file = fs.createWriteStream(gifPath);

          https.get(url, (res) => {
            if (res.statusCode !== 200) return reject();
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
          }).on("error", reject);
        });
      }

      return message.reply({
        body: msg,
        attachment: fs.createReadStream(gifPath)
      });

    } catch (e) {
      return message.reply(msg);
    }
  }
};
