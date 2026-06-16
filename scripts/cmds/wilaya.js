module.exports = {
  config: {
    name: "wilaya",
    version: "7.0",
    author: "ChatGPT",
    category: "info"
  },

  onStart: async function ({ message, args }) {

    const wilayas = {
      "31": {
        name: "وهران",
        type: "🌊 ساحلية",
        area: "2,114 كم²",
        population: "1.6 مليون",
        cities: "وهران - أرزيو - عين الترك",
        vibe: "مدينة البحر والموسيقى والحياة",
        image: "https://source.unsplash.com/800x500/?oran,algeria,sea"
      },

      "16": {
        name: "الجزائر العاصمة",
        type: "🏙️ حضرية",
        area: "363 كم²",
        population: "3 مليون",
        cities: "الجزائر - باب الواد - القبة",
        vibe: "قلب الجزائر النابض",
        image: "https://source.unsplash.com/800x500/?algiers,algeria,city"
      },

      "29": {
        name: "معسكر",
        type: "🌾 داخلية",
        area: "5,135 كم²",
        population: "800 ألف",
        cities: "معسكر - سيق - المحمدية",
        vibe: "ولاية هادئة وتاريخية",
        image: "https://source.unsplash.com/800x500/?mascara,algeria,nature"
      }
    };

    const input = args.join(" ");

    // القائمة
    if (!input) {
      let text = "🖤⚡ مالينيا | ولايات الجزائر ⚡🖤\n━━━━━━━━━━━━━━\n";
      for (let id in wilayas) {
        text += `【${id}】 ${wilayas[id].name}\n`;
      }
      text += "\n💀 مثال: /wilaya 31";
      return message.reply(text);
    }

    // رقم ولاية
    if (!isNaN(input)) {
      const w = wilayas[input];
      if (!w) return message.reply("💀 مالينيا: هذه الولاية غير موجودة");

      return message.reply({
        body:
`🖤⚡ مالينيا ترى الولاية ⚡🖤
━━━━━━━━━━━━━━
🏷️ الاسم: ${w.name}
🌍 النوع: ${w.type}
📏 المساحة: ${w.area}
👥 السكان: ${w.population}
🏙️ المدن: ${w.cities}

🖤 الجو العام:
${w.vibe}
━━━━━━━━━━━━━━`,
        attachment: await global.utils.getStreamFromURL(w.image)
      });
    }

    // بحث بالاسم
    for (let id in wilayas) {
      if (wilayas[id].name.includes(input)) {
        const w = wilayas[id];

        return message.reply({
          body:
`🖤⚡ مالينيا وجدت الولاية ⚡🖤
━━━━━━━━━━━━━━
🏷️ ${id} - ${w.name}
🌍 النوع: ${w.type}
📏 المساحة: ${w.area}
👥 السكان: ${w.population}
🏙️ المدن: ${w.cities}

🖤 الجو العام:
${w.vibe}
━━━━━━━━━━━━━━`,
          attachment: await global.utils.getStreamFromURL(w.image)
        });
      }
    }

    return message.reply("💀 مالينيا لم تجد هذه الولاية...");
  }
};
