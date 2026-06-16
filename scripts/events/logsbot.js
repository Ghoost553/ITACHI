const { getTime } = global.utils;

module.exports = {
	config: {
		name: "logsbot",
		isBot: true,
		version: "1.4",
		author: "GHOST",
		envConfig: {
			allow: true
		},
		category: "events"
	},

	langs: {
		en: {
			title: "╔═══════ 『 🤖 MALINIA LOGS 』 ═══════╗",

			added:
"\n🌸 تم إضافة مالينيا إلى مجموعة جديدة\n" +
"- 👤 بواسطة: %1",

			kicked:
"\n💔 تم إخراج مالينيا من مجموعة\n" +
"- 👤 بواسطة: %1",

			footer:
"\n━━━━━━━━━━━━━━━━━━\n" +
"- 🆔 User ID: %1\n" +
"- 👥 Group: %2\n" +
"- 🔰 Group ID: %3\n" +
"- ⏰ Time: %4\n" +
"━━━━━━━━━━━━━━━━━━\n" +
"🤖 MALINIA BOT\n" +
"⚡ Hosted By GHOST"
		}
	},

	onStart: async ({ usersData, threadsData, event, api, getLang }) => {
		if (
			(event.logMessageType == "log:subscribe" &&
				event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID()))
			||
			(event.logMessageType == "log:unsubscribe" &&
				event.logMessageData.leftParticipantFbId == api.getCurrentUserID())
		) return async function () {

			let msg = getLang("title");
			const { author, threadID } = event;

			if (author == api.getCurrentUserID()) return;

			let threadName;

			const { config } = global.GoatBot;

			if (event.logMessageType == "log:subscribe") {
				if (!event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID()))
					return;

				threadName = (await api.getThreadInfo(threadID)).threadName;
				const authorName = await usersData.getName(author);
				msg += getLang("added", authorName);
			}

			else if (event.logMessageType == "log:unsubscribe") {
				if (event.logMessageData.leftParticipantFbId != api.getCurrentUserID())
					return;

				const authorName = await usersData.getName(author);
				const threadData = await threadsData.get(threadID);
				threadName = threadData.threadName;
				msg += getLang("kicked", authorName);
			}

			const time = getTime("DD/MM/YYYY HH:mm:ss");

			msg += getLang("footer", author, threadName, threadID, time);

			for (const adminID of config.adminBot) {
				api.sendMessage(msg, adminID);
			}
		};
	}
};
