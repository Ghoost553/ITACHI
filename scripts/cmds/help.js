const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "8.0",
    author: "GHOST",
    shortDescription: "قائمة أوامر احترافية",
    category: "system",
    guide: "{pn}help [command]"
  },

  onStart: async function ({ message, args, prefix }) {
    const cmds = global.GoatBot.commands;

    // 🎨 ستايل أسماء
    const fancy = (t) =>
      t.replace(/[a-z]/gi, c => {
        const m = {
          a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",
          i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",
          q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",
          y:"𝐲",z:"𝐳"
        };
        return m[c.toLowerCase()] || c;
      });

    // 🧠 وصف تلقائي
    const desc = (cmd) => {
      const d = {
        4k: "تحسين الصور بدقة 4K",
        age: "معرفة العمر",
        liner: "مساعد ذكاء اصطناعي",
        prompt: "إنشاء برومبت",
        remini: "تحسين جودة الصور",
        weather: "الطقس",
        webinfo: "معلومات موقع",
        youai: "دردشة ذكاء اصطناعي",

        accept: "قبول الطلبات",
        fbcover: "غلاف فيسبوك",
        pastebin: "رفع نص",
        qrgen: "إنشاء QR",
        translate: "ترجمة",
        uid: "معرفة UID",
        webss: "تصوير موقع",

        admin: "إدارة المشرفين",
        help: "عرض القائمة",
        kick: "طرد عضو",
        ban: "حظر عضو",
        restart: "إعادة تشغيل",
        update: "تحديث البوت"
      };
      return d[cmd] || "أمر بوت";
    };

    const groups = {};
    for (const [name, cmd] of cmds) {
      const cat = (cmd.config.category || "others").toLowerCase();
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(name);
    }

    // 🎨 UI Categories
    const ui = {
      ai: "🟣 𝙰𝙸",
      utility: "🟢 𝚄𝚃𝙸𝙻𝙸𝚃𝚈",
      box: "🔵 𝙱𝙾𝚇 𝙲𝙷𝙰𝚃",
      system: "🟡 𝚂𝚈𝚂𝚃𝙴𝙼",
      owner: "🔴 𝙾𝚆𝙽𝙴𝚁"
    };

    let msg =
`╭━━━━━━━━━━━━━━━╮
┃ 🤖 𝐆𝐇𝐎𝐒𝐓 𝐁𝐎𝐓
┃ 📊 ${cmds.size} 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
╰━━━━━━━━━━━━━━━╯\n`;

    for (const cat of Object.keys(groups)) {
      msg += `\n╭─ ${ui[cat] || cat.toUpperCase()}\n`;

      msg += groups[cat]
        .sort()
        .map(c =>
          `│ • ${fancy(c)} ➜ ${desc(c)}`
        )
        .join("\n");

      msg += `\n╰──────────────\n`;
    }

    msg += `\n💡 اكتب: ${prefix}help <command>`;

    // 🎞️ GIF
    const gif = "https://i.imgur.com/KQBcxOV.gif";
    const dir = path.join(__dirname, "cache");
    const file = path.join(dir, "help.gif");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!fs.existsSync(file)) {
      await new Promise((res, rej) => {
        const f = fs.createWriteStream(file);
        https.get(gif, r => {
          r.pipe(f);
          f.on("finish", () => f.close(res));
        }).on("error", rej);
      });
    }

    return message.reply({
      body: msg,
      attachment: fs.createReadStream(file)
    });
  }
};
