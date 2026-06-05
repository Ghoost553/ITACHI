module.exports = {
	config: {
		name: "userinfo",
		aliases: ["user", "info", "معلومات"],
		version: "2.0",
		author: "GHOST",
		countDown: 5,
		role: 0,
		shortDescription: "معلومات العضو",
		longDescription: "عرض معلومات مفصلة عن العضو",
		category: "info",
		guide: "{pn} أو {pn} @عضو"
	},

	onStart: async function ({ api, event, usersData, threadsData, message }) {
		try {
			let uid;

			if (Object.keys(event.mentions || {}).length > 0)
				uid = Object.keys(event.mentions)[0];
			else
				uid = event.senderID;

			const userInfo = await api.getUserInfo(uid);
			const user = userInfo[uid];

			const threadInfo = await threadsData.get(event.threadID);
			const adminIDs = threadInfo.adminIDs?.map(x => x.id || x) || [];

			const isAdmin = adminIDs.includes(uid);

			const userData = await usersData.get(uid);

			const exp = userData?.exp || 0;
			const money = userData?.money || 0;
			const messages = userData?.data?.messageCount || 0;

			const msg =
`╭───〔 👤 معلومات العضو 〕───╮

📛 الاسم: ${user.name}
🆔 UID: ${uid}

🛡️ مشرف المجموعة: ${isAdmin ? "نعم" : "لا"}

💬 عدد الرسائل: ${messages}
⭐ الخبرة: ${exp}
💰 الرصيد: ${money}

🔗 رابط الحساب:
https://facebook.com/${uid}

╰────────────────╯`;

			message.reply(msg);
		}
		catch (err) {
			console.log(err);
			message.reply("❌ | تعذر جلب معلومات العضو");
		}
	}
};
