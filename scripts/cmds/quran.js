const axios = require("axios");

const surahs = [
  "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
  "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
  "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
  "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
  "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
  "الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
  "الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
  "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
  "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
  "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
  "القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
  "المسد","الإخلاص","الفلق","الناس"
];

module.exports = {
  config: {
    name: "quran",
    version: "3.0",
    author: "GHOST",
    role: 0,
    category: "🕌 نور إسلامي"
  },

  onStart: async function ({ message, args }) {
    const input = args.join(" ").trim().toLowerCase();

    // 🌙 عرض كل السور
    if (!input) {
      let list = surahs.map((s, i) => `┃ ${i + 1}. ${s}`).join("\n");

      return message.reply(
`╔═══❖ • 🕌 القرآن الكريم • ❖═══╗
┃
${list}
┃
╚═══❖ • 📖 نور وهداية • ❖═══╝

✨ الأوامر:
┃ quran رقم / اسم
┃ quran search كلمة
┃ quran audio اسم
┃ quran tafsir 2:255`
      );
    }

    // 🔍 بحث
    if (input.startsWith("search")) {
      let key = input.replace("search", "").trim();

      let result = surahs
        .map((s, i) => ({ s, i }))
        .filter(x => x.s.includes(key));

      if (!result.length) {
        return message.reply("╔═══❖ ❌ لا نتائج ❌ ❖═══╗");
      }

      return message.reply(
`╔═══❖ 🔎 نتائج البحث ❖═══╗

${result.map(r => `┃ ${r.i + 1}. ${r.s}`).join("\n")}

╚══════════════════════╝`
      );
    }

    // 🎧 صوت
    if (input.startsWith("audio")) {
      let name = input.replace("audio", "").trim();
      let index = getIndex(name);

      if (index === -1) return message.reply("❌ السورة غير موجودة");

      let num = index + 1;

      return message.reply(
`╔═══❖ 🎧 تلاوة عطرة ❖═══╗

┃ 🕌 سورة: ${surahs[index]}
┃ 🔊 استمع بخشوع

${"https://server8.mp3quran.net/afs/" + String(num).padStart(3,"0") + ".mp3"}

╚══════════════════════╝`
      );
    }

    // 📖 تفسير
    if (input.startsWith("tafsir")) {
      let ref = input.replace("tafsir", "").trim();

      try {
        let res = await axios.get(`https://api.alquran.cloud/v1/ayah/${ref}/ar.muyassar`);

        return message.reply(
`╔═══❖ 📖 التفسير ❖═══╗

┃ ${ref}
┃
${res.data.data.text}

╚══════════════════════╝`
        );
      } catch {
        return message.reply("❌ لم يتم العثور على الآية");
      }
    }

    // 🔢 رقم
    let index = Number(input) - 1;

    if (!isNaN(index) && surahs[index]) {
      return send(message, index + 1, surahs[index]);
    }

    // 🏷 اسم
    let found = getIndex(input);

    if (found !== -1) {
      return send(message, found + 1, surahs[found]);
    }

    return message.reply("❌ لم يتم العثور على السورة");
  }
};

// 🕌 عرض السورة
async function send(message, number, name) {
  try {
    const res = await axios.get(`https://api.alquran.cloud/v1/surah/${number}`);
    const data = res.data.data;

    return message.reply(
`╔═══❖ 🕌 سورة ${name} ❖═══╗

┃ 🔢 رقم: ${number}
┃ 📖 الآيات: ${data.numberOfAyahs}
┃ 📌 النوع: ${data.revelationType}

✨ أول آية:
${data.ayahs[0].text}

🎧 استماع:
https://server8.mp3quran.net/afs/${String(number).padStart(3,"0")}.mp3

╚══════════════════════╝`
    );

  } catch {
    return message.reply("⚠️ خطأ في جلب البيانات");
  }
}

// 🔎 بحث
function getIndex(name) {
  return surahs.findIndex(s =>
    s.includes(name) || name.includes(s)
  );
}
