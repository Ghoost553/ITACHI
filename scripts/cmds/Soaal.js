import telebot
import requests

# ضع توكن البوت الخاص بك هنا (تأخذه من BotFather)
BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'
bot = telebot.TeleBot(BOT_TOKEN)

# ضع مفتاح الـ API الخاص بالذكاء الاصطناعي هنا
AI_API_KEY = 'YOUR_AI_API_KEY'
AI_API_URL = 'https://api.example.com/v1/chat/completions' # رابط الـ API المستخدم

@bot.message_handler(commands=['ask'])
def ask_question(message):
    # فصل الأمر عن السؤال (أخذ النص الذي يأت بعد /ask)
    user_query = message.text.replace('/ask', '').strip()
    
    if not user_query:
        bot.reply_to(message, "⚠️ من فضلك اكتب سؤالك بعد الأمر. مثال:\n`/ask ما هي عاصمة ماليزيا؟`")
        return

    bot.reply_to(message, "⏳ جاري التفكير والإجابة...")

    # إعداد البيانات لإرسالها للـ API
    headers = {
        "Authorization": f"Bearer {AI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-4" or "gemini-pro", # اسم النموذج المستخدم
        "messages": [{"role": "user", "content": user_query}]
    }

    try:
        # إرسال الطلب إلى الـ API
        response = requests.post(AI_API_URL, json=payload, headers=headers)
        response_data = response.json()
        
        # استخراج الإجابة (يختلف المسار حسب الـ API المستخدم)
        bot_answer = response_data['choices'][0]['message']['content']
        
        # إرسال الإجابة للمستخدم
        bot.reply_to(message, bot_answer)
        
    except Exception as e:
        bot.reply_to(message, "❌ عذراً، حدث خطأ أثناء الاتصال بالـ API.")
        print(f"Error: {e}")

# تشغيل البوت باستمرار
bot.polling()
