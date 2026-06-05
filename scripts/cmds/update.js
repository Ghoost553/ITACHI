const axios = require("axios");
const fs = require("fs-extra");
const execSync = require("child_process").execSync;
const dirBootLogTemp = `${__dirname}/tmp/rebootUpdated.txt`;

module.exports = {
	config: {
		name: "update",
		version: "1.5",
		author: "Chat GPT, NTKhang",
		role: 2,
		description: {
			en: "Check for and install updates for the chatbot.",
			ar: "فحص وتثبيت تحديثات البوت"
		},
		category: "owner",
		guide: {
			ar: "{pn}"
		}
	},

	langs: {
		ar: {
			noUpdates: "✅ | أنت تستخدم آخر إصدار من البوت (v%1).",

			updatePrompt:
				"💫 | أنت تستخدم الإصدار %1.\n" +
				"يتوفر إصدار جديد: %2\n\n" +
				"⬆️ الملفات التي سيتم تحديثها:\n%3%4\n\n" +
				"💡 اضغط على أي تفاعل لتأكيد التحديث",

			fileWillDelete: "\n🗑️ الملفات التي سيتم حذفها:\n%1",

			andMore: " ...و %1 ملفات أخرى",

			updateConfirmed: "🚀 | تم تأكيد التحديث، جاري التحديث...",

			updateComplete:
				"✅ | تم التحديث بنجاح.\nهل تريد إعادة تشغيل البوت الآن؟ (اكتب yes أو y)",

			updateTooFast:
				"⚠️ | لا يمكن التحديث الآن لأن آخر تحديث كان منذ %1 دقيقة و %2 ثانية.\nحاول بعد %3 دقيقة و %4 ثانية.",

			botWillRestart: "🔄 | سيتم إعادة تشغيل البوت الآن!"
		}
	},

	onLoad: async function ({ api }) {
		if (fs.existsSync(dirBootLogTemp)) {
			const threadID = fs.readFileSync(dirBootLogTemp, "utf-8");
			fs.removeSync(dirBootLogTemp);
			api.sendMessage("🔄 | تم إعادة تشغيل البوت بنجاح.", threadID);
		}
	},

	onStart: async function ({ message, getLang, commandName, event }) {
		const { data: { version } } = await axios.get(
			"https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json"
		);

		const currentVersion = require("../../package.json").version;

		if (compareVersion(version, currentVersion) < 1)
			return message.reply(getLang("noUpdates", currentVersion));

		message.reply(
			getLang(
				"updatePrompt",
				currentVersion,
				version,
				""
			)
		);
	},

	onReply: async function ({ message, getLang, event }) {
		if (['yes', 'y'].includes(event.body?.toLowerCase())) {
			await message.reply(getLang("botWillRestart"));
			process.exit(2);
		}
	}
};

function compareVersion(version1, version2) {
	const v1 = version1.split(".");
	const v2 = version2.split(".");
	for (let i = 0; i < 3; i++) {
		if (parseInt(v1[i]) > parseInt(v2[i])) return 1;
		if (parseInt(v1[i]) < parseInt(v2[i])) return -1;
	}
	return 0;
	}
