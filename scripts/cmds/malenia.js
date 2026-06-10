const axios = require("axios");

module.exports = {
	config: {
		name: "maleniaAI",
		version: "1.0",
		author: "GHOST",
		role: 0,
		category: "ai"
	},

	onChat: async function ({ event, message }) {
		try {
			if (!event.body) return;

			const body = event.body.trim();

			if (!body.toLowerCase().startsWith("مالينيا"))
				return;

			const question = body.slice("مالينيا".length).trim();

			if (!question)
				return message.reply("🌸 نعم؟ كيف يمكنني مساعدتك؟");

			const API_KEY = "AQ.Ab8RN6JDonQLuoE03eNba94ceH6pGhm_LBbWDxnK8E783TTtsA";

			const res = await axios.post(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
				{
					contents: [
						{
							parts: [
								{
									text: `أنت مالينيا، مساعدة ذكية ولطيفة. أجيبي بالعربية فقط وبأسلوب ودود.

سؤال المستخدم:
${question}`
								}
							]
						}
					]
				}
			);

			const answer =
				res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
				"عذراً، لم أتمكن من الإجابة.";

			return message.reply(`🌸 | ${answer}`);

		} catch (e) {
			console.error(e);
			return message.reply("❌ حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
		}
	}
};
