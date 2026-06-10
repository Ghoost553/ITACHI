const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "6.2",
    author: "GHOST",
    shortDescription: "عرض جميع الأوامر",
    longDescription: "عرض قائمة الأوامر بشكل منظم",
    category: "system",
    guide: "{pn}help [command name]"
  },

  onStart: async function ({ message, args, prefix }) {
    const allCommands = global.GoatBot.commands;

    const fancyFont = (str) =>
      str.replace(/[A-Za-z]/g, (c) => {
        const map = {
          A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",
          I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",
          Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",
          Y:"𝐘",Z:"𝐙",
          a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",
          i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",
          q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",
          y:"𝐲",z:"𝐳"
        };
        return map[c] || c;
      });

    const categoryFont = (str) =>
      str.split("").map(c => {
        const map = {
          A:"𝙰",B:"𝙱",C:"𝙲",D:"𝙳",E:"𝙴",F:"𝙵",G:"𝙶",H:"𝙷",
          I:"𝙸",J:"𝙹",K:"𝙺",L:"𝙻",M:"𝙼",N:"𝙽",O:"𝙾",P:"𝙿",
          Q:"𝚀",R:"𝚁",S:"𝚂",T:"𝚃",U:"𝚄",V:"𝚅",W:"𝚆",X:"𝚇",
          Y:"𝚈",Z:"𝚉"
        };
        return map[c] || c;
      }).join("");

    const tr = {
      "4k": "تحسين الصور بدقة 4K",
      "age": "معرفة العمر",
      "liner": "مساعد ذكاء اصطناعي",
      "prompt": "إنشاء برومبت",
      "remini": "تحسين جودة الصور",
      "weather": "الطقس",
      "webinfo": "معلومات موقع",
      "youai": "دردشة ذكاء اصطناعي",

      "accept": "قبول الطلبات",
      "fbcover": "إنشاء غلاف فيسبوك",
      "pastebin": "رفع نص",
      "qrgen": "إنشاء رمز QR",
      "translate": "ترجمة",
      "uid": "معرفة UID",
      "webss": "تصوير موقع",

      "activemember": "الأعضاء النشطون",
      "adduser": "إضافة عضو",
      "admin": "المشرفون",
      "all": "منشن الجميع",
      "allbox": "جميع المجموعات",
      "antichangeinfobox": "منع تعديل معلومات المجموعة",
      "autosetname": "تعيين اسم تلقائي",
      "baby": "طفل المجموعة",
      "badwords": "الكلمات المحظورة",
      "ban": "حظر عضو",
      "boxinfo": "معلومات المجموعة",
      "busy": "وضع الانشغال",
      "count": "عدد الأعضاء",
      "emoji": "تغيير الإيموجي",
      "filteruser": "تصفية الأعضاء",
      "lock": "قفل المجموعة",
      "onlyadminbox": "للمشرفين فقط",
      "refresh": "تحديث",
      "rules": "القوانين",
      "sendnoti": "إرسال إشعار",
      "setname": "تغيير الاسم",
      "tid": "معرف المجموعة",
      "unsend": "حذف الرسالة",
      "warn": "إنذار",

      "adminmention": "منشن المشرفين",
      "anti_isis_leave": "منع الخروج التلقائي",
      "autoreact": "ردود تلقائية",
      "autoseen": "مشاهدة تلقائية",
      "delete": "حذف",
      "fork": "معلومات النسخة",
      "help": "المساعدة",
      "join": "الانضمام",
      "text_voice": "تحويل نص لصوت",
      "up": "فحص التشغيل",

      "adminonly": "للمالك فقط",
      "backupdata": "نسخ احتياطي",
      "clear": "مسح البيانات",
      "eval": "تنفيذ كود",
      "event": "إدارة الأحداث",
      "filecmd": "أوامر الملفات",
      "getfbstate": "حالة فيسبوك",
      "kick": "طرد عضو",
      "kickall": "طرد الجميع",
      "restart": "إعادة تشغيل",
      "setlang": "تغيير اللغة",
      "update": "تحديث البوت"
    };

    const formatCommands = (cmds) =>
      cmds
        .sort()
        .map(c => `• ${fancyFont(c)} — ${tr[c] || "بدون وصف"}`)
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
      ai: "𝙰𝙸",
      utility: "𝚄𝚃𝙸𝙻𝙸𝚃𝚈",
      box: "𝙱𝙾𝚇 𝙲𝙷𝙰𝚃",
      system: "𝚂𝚈𝚂𝚃𝙴𝙼",
      owner: "𝙾𝚆𝙽𝙴𝚁"
    };

    for (const cat of Object.keys(categories)) {
      msg += `\n${categoryFont(categoryNames[cat] || cat.toUpperCase())}\n`;
      msg += formatCommands(categories[cat]) + "\n";
    }

    msg += `\nاكتب: ${prefix}help <اسم_الأمر>`;

    const gifURLs = [
      "https://i.imgur.com/Xw6JTfn.gif",
      "https://i.imgur.com/mW0yjZb.gif",
      "https://i.imgur.com/KQBcxOV.gif"
    ];

    const randomGifURL = gifURLs[Math.floor(Math.random() * gifURLs.length)];
    const gifFolder = path.join(__dirname, "cache");

    if (!fs.existsSync(gifFolder))
      fs.mkdirSync(gifFolder, { recursive: true });

    const gifName = path.basename(randomGifURL);
    const gifPath = path.join(gifFolder, gifName);

    if (!fs.existsSync(gifPath))
      await downloadGif(randomGifURL, gifPath);

    return message.reply({
      body: msg,
      attachment: fs.createReadStream(gifPath)
    });
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
