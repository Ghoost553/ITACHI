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
    longDescription: "قائمة أوامر تلقائية",
    category: "system",
    guide: "{pn}help [command]"
  },

  onStart: async function ({ message, args, prefix }) {
    const allCommands = global.GoatBot.commands;

    const fancyFont = (str = "") =>
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

    const categoryFont = (str = "") =>
      str.split("").map(c => {
        const map = {
          A:"𝙰",B:"𝙱",C:"𝙲",D:"𝙳",E:"𝙴",F:"𝙵",G:"𝙶",H:"𝙷",
          I:"𝙸",J:"𝙹",K:"𝙺",L:"𝙻",M:"𝙼",N:"𝙽",O:"𝙾",P:"𝙿",
          Q:"𝚀",R:"𝚁",S:"𝚂",T:"𝚃",U:"𝚄",V:"𝚅",W:"𝚆",X:"𝚇",
          Y:"𝚈",Z:"𝚉"
        };
        return map[c] || c;
      }).join("");

    const formatCommands = (cmds) =>
      cmds
        .sort()
        .map(c => {
          const cmd = allCommands.get(c);

          const desc =
            cmd?.config?.shortDescription ||
            cmd?.config?.longDescription ||
            "بدون وصف";

          return `• ${fancyFont(c)} — ${desc}`;
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
      ai: "𝙰𝙸",
      utility: "𝚄𝚃𝙸𝙻𝙸𝚃𝚈",
      box: "𝙱𝙾𝚇",
      system: "𝚂𝚈𝚂𝚃𝙴𝙼",
      owner: "𝙾𝚆𝙽𝙴𝚁"
    };

    for (const cat of Object.keys(categories)) {
      msg += `\n${categoryFont(categoryNames[cat] || cat.toUpperCase())}\n`;
      msg += formatCommands(categories[cat]) + "\n";
    }

    msg += `\n📌 اكتب: ${prefix}help <command>`;
    
    return message.reply(msg);
  }
};
