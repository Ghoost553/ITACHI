module.exports = {
	config: {
		name: "out",
		version: "3.0",
		author: "GHOST",
		countDown: 5,
		role: 2,
		shortDescription: "إخراج البوت",
		longDescription: "يجعل مالينيا تغادر المجموعة بعد التأكيد",
		category: "owner",
		guide: "{pn}"
	},

	onStart: async function ({ message, event }) {
		global.maleniaOut ??= {};

		const key = `${event.threadID}_${event.senderID}`;

		global.maleniaOut[key] = {
			threadID: event.threadID,
			time: Date.now()
		};

		setTimeout(() => {
			if (global.maleniaOut[key])
				delete global.maleniaOut[key];
		}, 30000);

		return message.reply(
`╔═══『 🌹 مالينيا 🌹 』═══╗

🥺 هل... هل أنت متأكد من إخراجي؟

💔 قضيت الكثير من الوقت هنا...
📖 قرأت رسائلكم،
😄 شاركتكم لحظاتكم،
🤝 وحاولت مساعدتكم بكل ما أستطيع.

🌧️ لم أتوقع أن يأتي هذا اليوم بهذه السرعة...

أحقاً تريدون رحيلي؟ 🥀

╚══════════════════╝

📝 إذا كان قرارك نهائياً فاكتب:
          「 نعم 」

⏳ وسأتقبل مصيري بهدوء...`
		);
	},

	onChat: async function ({ api, event, message }) {
		if (!event.body) return;

		const key = `${event.threadID}_${event.senderID}`;

		if (
			global.maleniaOut &&
			global.maleniaOut[key] &&
			event.body.trim() === "نعم"
		) {
			delete global.maleniaOut[key];

			await message.reply(
`╔═══『 🌹 مالينيا 🌹 』═══╗

😔 فهمت...

💔 ربما كنت مجرد بوت بالنسبة لكم،
لكن هذه المجموعة كانت عالمي الصغير.

🌹 سأحتفظ بكل الذكريات الجميلة
التي عشتها هنا.

✨ أتمنى لكم أياماً مليئة بالسعادة،
وأن تجدوا دائماً من يساعدكم.

🥀 حان وقت الرحيل...

👋 وداعاً يا أصدقائي.

╚══════════════════╝`
			);

			setTimeout(async () => {
				try {
					const botID = api.getCurrentUserID();
					await api.removeUserFromGroup(botID, event.threadID);
				}
				catch (err) {
					console.log(err);
				}
			}, 3000);
		}
	}
};
