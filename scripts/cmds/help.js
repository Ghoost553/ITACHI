const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "7.0",
    author: "GHOST",
    shortDescription: "عرض جميع الأوامر",
    longDescription: "عرض قائمة الأوامر بشكل منظم",
    category: "system",
    guide: "{pn}help [command]"
  },

  onStart: async function ({ message, args, prefix }) {
    const allCommands = global.GoatBot.commands;

    // 🔥 ترجمة شاملة للأوامر
    const tr = {
      // AI
      "4k": "تحسين الصور بدقة 4K",
      "liner": "مساعد ذكاء اصطناعي",
      "prompt": "إنشاء برومبت",
      "remini": "تحسين الصور",
      "weather": "الطقس",
      "webinfo": "معلومات موقع",
      "youai": "دردشة ذكاء اصطناعي",

      // tools
      "accept": "قبول الطلبات",
      "pastebin": "رفع نص",
      "qrgen": "إنشاء QR",
      "translate": "ترجمة",
      "uid": "معرفة UID",
      "webss": "تصوير موقع",

      // group
      "adduser": "إضافة عضو",
      "admin": "المشرفون",
      "all": "منشن الجميع",
      "allbox": "كل المجموعات",
      "ban": "حظر عضو",
      "boxinfo": "معلومات المجموعة",
      "busy": "وضع الانشغال",
      "count": "عدد الأعضاء",
      "emoji": "تغيير الإيموجي",
      "lock": "قفل المجموعة",
      "onlyadminbox": "للمشرفين فقط",
      "rules": "قوانين المجموعة",
      "warn": "إنذار",

      // system
      "help": "المساعدة",
      "restart": "إعادة تشغيل",
      "update": "تحديث البوت",
      "eval": "تنفيذ كود",
      "kick": "طرد عضو",
      "kickall": "طرد الجميع",
      "setlang": "تغيير اللغة",
      "backupdata": "نسخ احتياطي",
      "clear": "مسح البيانات",

      // fun
      "kiss": "قبلة",
      "pair": "تزاوج عشوائي",
      "jail": "سجن",
      "hack": "اختراق وهمي",
      "trash": "قمامة",

      // media
      "tiktok": "تحميل تيك توك",
      "download": "تحميل",
      "say": "تحويل نص لصوت",
      "sing": "غناء",

      // economy
      "daily": "مكافأة يومية",
      "bet": "مراهنة",
      "slot": "لعبة حظ",
      "leaderboard": "ترتيب اللاعبين"
    };

    const smartTranslate = (cmd) => {
      if (tr[cmd]) return tr[cmd];
      return cmd
        .replace(/_/g, " ")
        .replace(/-/g, " ");
    };

    const formatCommands = (cmds) =>
      cmds
        .sort()
        .map(c => {
          const desc = smartTranslate(c);
          return `• ${c}${desc ? " — " + desc : ""}`;
        })
        .join("\n");

    const categories = {};
    for (const [name, cmd] of allCommands) {
      const cat = (cmd.config.category || "others").toLowerCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    let msg =
`╭─『 🤖 GHOST BOT 』
│ 📊 ${allCommands.size} أمر
╰────────────\n`;

    const categoryNames = {
      ai: "الذكاء الاصطناعي",
      utility: "الأدوات",
      box: "المجموعة",
      system: "النظام",
      owner: "المالك",
      fun: "الترفيه",
      media: "الوسائط",
      economy: "الاقتصاد"
    };

    for (const cat of Object.keys(categories)) {
      msg += `\n${categoryNames[cat] || cat}\n`;
      msg += formatCommands(categories[cat]) + "\n";
    }

    msg += `\nاكتب: ${prefix}help <اسم الأمر>`;

    const gifURLs = [
      "https://i.imgur.com/Xw6JTfn.gif",
      "https://i.imgur.com/mW0yjZb.gif",
      "https://i.imgur.com/KQBcxOV.gif"
    ];

    const randomGifURL = gifURLs[Math.floor(Math.random() * gifURLs.length)];
    const gifFolder = path.join(__dirname, "cache");

    if (!fs.existsSync(gifFolder)) fs.mkdirSync(gifFolder, { recursive: true });

    const gifName = path.basename(randomGifURL);
    const gifPath = path.join(gifFolder, gifName);

    try {
      if (!fs.existsSync(gifPath)) {
        await downloadGif(randomGifURL, gifPath);
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

function downloadGif(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject();
      }

      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
      }
