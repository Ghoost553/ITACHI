const axios = require("axios");

module.exports = {
	config: {
		name: "melina",
		version: "1.0.0",
		author: "GHOST",
		role: 0,
		category: "AI"
	},

	onChat: async function ({ event, message }) {
		const text = event.body;

		if (!text) return;

		// كلمات تجعل ميلينا ترد فقط
		const triggers = ["ميلينا", "melina"];

		if (!triggers.some(x => text.toLowerCase().includes(x)))
			return;

		try {
			const res = await axios.post(
				"https://openrouter.ai/api/v1/chat/completions",
				{
					model: "openai/gpt-4o-mini",
					messages: [
						{
							role: "system",
							content:
							"أنت ميلينا. شخصيتك متكبرة وذكية، تتكلمين بثقة وسخرية خفيفة، لكن تساعدين المستخدم."
						},
						{
							role: "user",
							content: text
						}
					]
				},
				{
					headers: {
						"Authorization": "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",
						"Content-Type": "application/json"
					}
				}
			);

			return message.reply(
				"💎 ميلينا:\n" + res.data.choices[0].message.content
			);

		} catch (err) {
			console.log(err);
			return message.reply("❌ فشل الاتصال بالذكاء الاصطناعي.");
		}
	}
};
