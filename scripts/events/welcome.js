const { drive } = global.utils;
const { nickNameBot } = global.GoatBot.config;
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
config: {
name: "welcome",
version: "8.1",
author: "GHOST",
category: "events"
},

langs: {
ar: {
defaultWelcomeMessage: `╭━━━━━━━━━━━━━━━━━━╮
┃ 🌸 أهلاً وسهلاً {userName}
╰━━━━━━━━━━━━━━━━━━╯

✨ مرحباً بك في 「 {threadName} 」

👥 أنت العضو رقم {memberCount}
🎖️ تمت إضافتك بواسطة {inviterName}

💖 نتمنى لك أوقاتاً ممتعة معنا
📜 يرجى احترام القوانين وأعضاء المجموعة

🌷 نورت المجموعة يا صديق 🌷`,

  botAddedMessage: `╭━━━━━━━━━━━━━━━━━━╮

┃ 🤖 مـالـيـنـيـا
╰━━━━━━━━━━━━━━━━━━╯

💖 شكراً لإضافتي إلى هذه المجموعة

⚙️ البريفكس الخاص بي: /
📜 اكتب /help لرؤية جميع الأوامر

✨ أستطيع المساعدة، الإدارة،
الترفيه، الزخرفة، والألعاب

🌸 أتمنى أن أكون عند حسن ظنكم 🌸`
},

en: {
  defaultWelcomeMessage: `╭━━━━━━━━━━━━━━━━━━╮

┃ 🌸 أهلاً وسهلاً {userName}
╰━━━━━━━━━━━━━━━━━━╯

✨ مرحباً بك في 「 {threadName} 」

👥 أنت العضو رقم {memberCount}
🎖️ تمت إضافتك بواسطة {inviterName}

💖 نتمنى لك أوقاتاً ممتعة معنا
📜 يرجى احترام القوانين وأعضاء المجموعة

🌷 نورت المجموعة يا صديق 🌷`,

  botAddedMessage: `╭━━━━━━━━━━━━━━━━━━╮

┃ 🤖 مـالـيـنـيـا
╰━━━━━━━━━━━━━━━━━━╯

💖 شكراً لإضافتي إلى هذه المجموعة

⚙️ البريفكس الخاص بي: /
📜 اكتب /help لرؤية جميع الأوامر

✨ أستطيع المساعدة، الإدارة،
الترفيه، الزخرفة، والألعاب

🌸 أتمنى أن أكون عند حسن ظنكم 🌸`
}
},

onStart: async ({
threadsData,
message,
event,
api,
usersData,
getLang
}) => {
if (event.logMessageType !== "log:subscribe") return;

const { threadID } = event;
const threadData = await threadsData.get(threadID);

if (!threadData.settings.sendWelcomeMessage) return;

const addedMembers =
  event.logMessageData.addedParticipants;

const threadName =
  threadData.threadName || "المجموعة";

const inviterID = event.author;

for (const user of addedMembers) {
  const userID = user.userFbId;
  const botID = api.getCurrentUserID();

  // عند إضافة البوت
  if (userID == botID) {
    if (nickNameBot) {
      await api.changeNickname(
        nickNameBot,
        threadID,
        botID
      );
    }

    return message.send(
      getLang("botAddedMessage")
    );
  }

  const userName = user.fullName;

  const inviterName =
    await usersData.getName(inviterID);

  const memberCount =
    event.participantIDs.length;

  let {
    welcomeMessage =
      getLang("defaultWelcomeMessage")
  } = threadData.data;

  welcomeMessage = welcomeMessage
    .replace(/\{userName\}/g, userName)
    .replace(/\{userTag\}/g, userName)
    .replace(/\{threadName\}/g, threadName)
    .replace(/\{memberCount\}/g, memberCount)
    .replace(/\{inviterName\}/g, inviterName);

  let welcomeImagePath = null;

  try {
    welcomeImagePath =
      await createWelcomeCard({
        userName,
        threadName,
        memberCount,
        inviterName,
        newUserID: userID,
        inviterID,
        threadID,
        api
      });
  } catch (err) {
    console.error(
      "Welcome image creation failed:",
      err
    );
  }

  const form = {
    body: welcomeMessage,
    mentions: [
      {
        tag: userName,
        id: userID
      }
    ]
  };

  if (
    welcomeImagePath &&
    fs.existsSync(welcomeImagePath)
  ) {
    form.attachment =
      fs.createReadStream(welcomeImagePath);
  } else if (
    threadData.data.welcomeAttachment
  ) {
    const attachments =
      threadData.data.welcomeAttachment.map(
        f => drive.getFile(f, "stream")
      );

    form.attachment = (
      await Promise.allSettled(attachments)
    )
      .filter(
        ({ status }) =>
          status === "fulfilled"
      )
      .map(
        ({ value }) => value
      );
  }

  await message.send(form);

  if (
    welcomeImagePath &&
    fs.existsSync(welcomeImagePath)
  ) {
    setTimeout(() => {
      try {
        fs.unlinkSync(welcomeImagePath);
      } catch (_) {}
    }, 5000);
  }
}

}
};

const ACCESS_TOKEN =
"6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

async function downloadHighQualityProfile(userID) {
try {
const url =
"https://graph.facebook.com/${userID}/picture?width=500&height=500&access_token=${ACCESS_TOKEN}";

const res = await axios({
  method: "GET",
  url,
  responseType: "arraybuffer",
  timeout: 10000
});

return Buffer.from(res.data, "binary");

} catch {
return null;
}
}

async function downloadImage(url) {
try {
const res = await axios({
method: "GET",
url,
responseType: "arraybuffer",
timeout: 10000
});

return Buffer.from(res.data, "binary");

} catch {
return null;
}
}

async function getGroupImage(threadID, api) {
try {
const info =
await api.getThreadInfo(threadID);

if (info.imageSrc) {
  const res = await axios({
    method: "GET",
    url: info.imageSrc,
    responseType: "arraybuffer",
    timeout: 10000
  });

  return Buffer.from(res.data, "binary");
}

} catch {}

return null;
}

function unicodeToPlain(str) {
if (!str) return "";

const ranges = [
[0x1D400, 0x1D419, "A"],
[0x1D41A, 0x1D433, "a"],
[0x1D434, 0x1D44D, "A"],
[0x1D44E, 0x1D467, "a"],
[0x1D468, 0x1D481, "A"],
[0x1D482, 0x1D49B, "a"],
[0x1D5D4, 0x1D5ED, "A"],
[0x1D5EE, 0x1D607, "a"],
[0x1D63C, 0x1D655, "A"],
[0x1D656, 0x1D66F, "a"],
[0x1D7CE, 0x1D7D7, "0"],
[0xFF21, 0xFF3A, "A"],
[0xFF41, 0xFF5A, "a"],
[0xFF10, 0xFF19, "0"],
[0x24B6, 0x24CF, "A"],
[0x24D0, 0x24E9, "a"]
];

const singles = {
0x1D49C: "A",
0x212C: "B",
0x2102: "C",
0x2145: "D",
0x2130: "E",
0x2131: "F",
0x210A: "g",
0x210B: "H",
0x2110: "I",
0x2111: "I",
0x2112: "L",
0x2113: "l",
0x2115: "N",
0x2118: "P",
0x211A: "Q",
0x211B: "R",
0x211C: "R",
0x2124: "Z",
0x2128: "Z"
};

let result = "";

for (const char of str) {
const cp = char.codePointAt(0);

if (singles[cp] !== undefined) {
  result += singles[cp];
  continue;
}

let mapped = false;

for (const [start, end, base] of ranges) {
  if (cp >= start && cp <= end) {
    result += String.fromCodePoint(
      base.codePointAt(0) + cp - start
    );

    mapped = true;
    break;
  }
}

if (!mapped) result += char;

}

return result;
}

function safeStr(str) {
if (!str) return "";

try {
return Buffer.from(
str,
"latin1"
).toString("utf8");
} catch {
return str;
}
}

function readableText(str) {
return unicodeToPlain(
safeStr(str)
);
}

function ordinal(n) {
const s = [
"th",
"st",
"nd",
"rd"
];

const v = n % 100;

return n +
(s[(v - 20) % 10] ||
s[v] ||
s[0]);
}

function roundRect(
ctx,
x,
y,
w,
h,
r
) {
ctx.beginPath();

ctx.moveTo(x + r, y);
ctx.lineTo(x + w - r, y);

ctx.quadraticCurveTo(
x + w,
y,
x + w,
y + r
);

ctx.lineTo(
x + w,
y + h - r
);

ctx.quadraticCurveTo(
x + w,
y + h,
x + w - r,
y + h
);

ctx.lineTo(x + r, y + h);

ctx.quadraticCurveTo(
x,
y + h,
x,
y + h - r
);

ctx.lineTo(x, y + r);

ctx.quadraticCurveTo(
x,
y,
x + r,
y
);

ctx.closePath();
}

function drawCircleAvatar(
ctx,
img,
cx,
cy,
r
) {
ctx.save();

ctx.beginPath();

ctx.arc(
cx,
cy,
r,
0,
Math.PI * 2
);

ctx.clip();

ctx.drawImage(
img,
cx - r,
cy - r,
r * 2,
r * 2
);

ctx.restore();
}

function fitText(
ctx,
text,
maxPx,
maxSize = 34,
minSize = 14
) {
let t = text;
let size = maxSize;

ctx.font =
"bold ${size}px "Segoe UI", Arial";

while (
ctx.measureText(t).width > maxPx &&
size > minSize
) {
size--;

ctx.font =
  `bold ${size}px "Segoe UI", Arial`;

}

if (
ctx.measureText(t).width > maxPx
) {
while (
ctx.measureText(t + "…").width > maxPx &&
t.length > 1
) {
t = t.slice(0, -1);
}

t += "…";

}

return {
text: t,
size
};
}

async function createWelcomeCard({
userName,
threadName,
memberCount,
inviterName,
newUserID,
inviterID,
threadID,
api
}) {
const W = 1200;
const H = 630;

const canvas =
createCanvas(W, H);

const ctx =
canvas.getContext("2d");

async function loadProfile(uid) {
const buf =
await downloadHighQualityProfile(uid);

if (buf) {
  return loadImage(buf)
    .catch(() => null);
}

try {
  const info =
    await api.getUserInfo([uid]);

  const src =
    info[uid]?.thumbSrc;

  if (src) {
    const b =
      await downloadImage(src);

    if (b) {
      return loadImage(b)
        .catch(() => null);
    }
  }
} catch {}

return null;

}

const [
newUserImg,
inviterImg,
groupImg
] = await Promise.all([
loadProfile(newUserID),
loadProfile(inviterID),
getGroupImage(threadID, api)
.then(b =>
b
? loadImage(b)
.catch(() => null)
: null
)
]);

const safeUser =
readableText(userName);

const safeInviter =
readableText(inviterName);

const safeGroup =
readableText(threadName);

ctx.fillStyle =
"#09090f";

ctx.fillRect(
0,
0,
W,
H
);

const splitX =
Math.round(W * 0.385);

const PAD = 44;

ctx.fillStyle =
"#0d0d16";

ctx.fillRect(
0,
0,
splitX,
H
);

const leftCX =
splitX / 2;

const avatarR = 115;

const avatarY =
H / 2 - 18;

ctx.textAlign =
"center";

ctx.font =
'bold 17px "Segoe UI", Arial';

ctx.fillStyle =
"rgba(46,204,113,0.85)";

ctx.fillText(
"N E W   M E M B E R",
leftCX,
50
);

ctx.strokeStyle =
"rgba(46,204,113,0.9)";

ctx.lineWidth =
3.5;

ctx.beginPath();

ctx.arc(
leftCX,
avatarY,
avatarR + 8,
0,
Math.PI * 2
);

ctx.stroke();

if (newUserImg) {
drawCircleAvatar(
ctx,
newUserImg,
leftCX,
avatarY,
avatarR
);
} else {
ctx.fillStyle =
"#161628";

ctx.beginPath();

ctx.arc(
  leftCX,
  avatarY,
  avatarR,
  0,
  Math.PI * 2
);

ctx.fill();

}

const userText =
fitText(
ctx,
safeUser,
splitX - 32,
34,
15
);

ctx.font =
"bold ${userText.size}px "Segoe UI", Arial";

ctx.fillStyle =
"#f0f0f8";

ctx.fillText(
userText.text,
leftCX,
avatarY + avatarR + 40
);

const bText =
"✦ ${ordinal(memberCount)} Member ✦";

ctx.font =
'bold 17px "Segoe UI", Arial';

ctx.fillStyle =
"rgba(46,204,113,0.92)";

ctx.fillText(
bText,
leftCX,
avatarY + avatarR + 95
);

const rX =
splitX + PAD;

const rRight =
W - PAD;

ctx.textAlign =
"left";

ctx.font =
'bold 40px "Segoe UI", Arial';

ctx.fillStyle =
"#ffffff";

ctx.fillText(
"Welcome To Our Group",
rX,
90
);

const groupSecY =
155;

const gAvSize =
90;

ctx.font =
'500 12px "Segoe UI", Arial';

ctx.fillStyle =
"rgba(0,200,255,0.55)";

ctx.fillText(
"G R O U P",
rX,
groupSecY
);

const gAx =
rX;

const gAy =
groupSecY + 14;

if (groupImg) {
ctx.save();

roundRect(
  ctx,
  gAx,
  gAy,
  gAvSize,
  gAvSize,
  16
);

ctx.clip();

ctx.drawImage(
  groupImg,
  gAx,
  gAy,
  gAvSize,
  gAvSize
);

ctx.restore();

}

const gTx =
gAx + gAvSize + 20;

const gTw =
rRight - gTx;

const groupText =
fitText(
ctx,
safeGroup,
gTw,
34,
14
);

ctx.font =
"bold ${groupText.size}px "Segoe UI", Arial";

ctx.fillStyle =
"#e8e8f2";

ctx.fillText(
groupText.text,
gTx,
gAy + gAvSize / 2
);

const invSecY =
gAy + gAvSize + 40;

const invAvR =
52;

ctx.font =
'500 12px "Segoe UI", Arial';

ctx.fillStyle =
"rgba(255,215,0,0.5)";

ctx.fillText(
"A D D E D   B Y",
rX,
invSecY
);

const invAy =
invSecY + 14;

const invCX =
rX + invAvR;

const invCY =
invAy + invAvR;

if (inviterImg) {
drawCircleAvatar(
ctx,
inviterImg,
invCX,
invCY,
invAvR
);
}

const iTx =
invCX + invAvR + 20;

const iTw =
rRight - iTx;

const inviterText =
fitText(
ctx,
safeInviter,
iTw,
34,
14
);

ctx.font =
"bold ${inviterText.size}px "Segoe UI", Arial";

ctx.fillStyle =
"#e8e8f2";

ctx.fillText(
inviterText.text,
iTx,
invCY + inviterText.size * 0.35
);

const tempPath =
path.join(
__dirname,
"temp_welcome_${Date.now()}.png"
);

await fs.writeFile(
tempPath,
canvas.toBuffer("image/png")
);

return tempPath;
    }
