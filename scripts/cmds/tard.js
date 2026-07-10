module.exports = {
	config: {
		name: "tard",
		aliases: ["طرد"],
		version: "1.0",
		author: "GHOST",
		countDown: 5,
		role: 2,
		shortDescription: {
			ar: "طرد عضو"
		},
		longDescription: {
			ar: "طرد عضو من المجموعة"
		},
		category: "group",
		guide: {
			ar: "{pn} @العضو\nأو قم بالرد على رسالة العضو ثم اكتب {pn}"
		}
	},

	onStart: async function ({ api, event, message }) {
		const { threadID, messageReply, mentions } = event;

		let uid;

		if (messageReply)
			uid = messageReply.senderID;
		else if (Object.keys(mentions).length > 0)
			uid = Object.keys(mentions)[0];
		else
			return message.reply("❌ | قم بمنشن العضو أو بالرد على رسالته.");

		try {
			await api.removeUserFromGroup(uid, threadID);
			return message.reply("✅ | تم طرد العضو بنجاح.");
		}
		catch (e) {
			return message.reply("❌ | فشل الطرد. تأكد أن البوت مشرف وأن العضو ليس مشرفًا.");
		}
	}
};
