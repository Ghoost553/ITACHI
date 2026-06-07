module.exports = {
	config: {
		name: "ban",
		version: "1.0",
		author: "GHOST",
		countDown: 5,
		role: 1,
		shortDescription: {
			ar: "حظر مستخدم من البوت"
		},
		category: "admin"
	},

	onStart: async function ({ event, message, args, threadsData }) {
		const bannedUsers = await threadsData.get(
			event.threadID,
			"data.bannedUsers",
			[]
		);

		if (args[0] == "unban") {
			const uid = Object.keys(event.mentions || {})[0];

			if (!uid)
				return message.reply("❌ قم بمنشن الشخص");

			const newList = bannedUsers.filter(id => id != uid);

			await threadsData.set(
				event.threadID,
				newList,
				"data.bannedUsers"
			);

			return message.reply("✅ تم فك الحظر");
		}

		const uid = Object.keys(event.mentions || {})[0];

		if (!uid)
			return message.reply("❌ قم بمنشن الشخص");

		if (bannedUsers.includes(uid))
			return message.reply("⚠️ هذا الشخص محظور بالفعل");

		bannedUsers.push(uid);

		await threadsData.set(
			event.threadID,
			bannedUsers,
			"data.bannedUsers"
		);

		message.reply("✅ تم حظر المستخدم من استخدام البوت");
	},

	onChat: async function ({ event, threadsData }) {
		const bannedUsers = await threadsData.get(
			event.threadID,
			"data.bannedUsers",
			[]
		);

		if (bannedUsers.includes(event.senderID))
			return false;
	}
};
