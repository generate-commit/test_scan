export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, studentInfo, results } = req.body;

    // TOKEN VA ID'LARNI TO'G'RIDAN-TO'G'RI SHU YERGA YOZASIZ:
    const BOT_TOKEN = "8502635236:AAGL3bj1x4eQAGnqI86voIbpIMBKY9FKTYc"; 
    const CHAT_ID = "8694565465";     
    const OWNER_ID = "8694565465'";   

    let messageText = "";

    if (type === 'start') {
        messageText = `🚀 *O'quvchi testga kirdi!*\n\n👤 *Ism/Familiya:* ${studentInfo.lastName} ${studentInfo.firstName}\n🏫 *Guruh:* ${studentInfo.groupName}\n⏰ *Vaqt:* ${new Date().toLocaleTimeString("uz-UZ")}`;
    } else if (type === 'finish') {
        messageText = `✅ *Test yakunlandi!*\n\n👤 *O'quvchi:* ${studentInfo.lastName} ${studentInfo.firstName}\n🏫 *Guruh:* ${studentInfo.groupName}\n📊 *Natija:* ${results.score} / ${results.totalQuestions} (${results.percentage}%)\n\n📝 *Javoblar tafsiloti:*\n${results.details}`;
    }

    async function sendToTelegram(chatId) {
        if (!chatId) return;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: messageText, parse_mode: 'Markdown' })
        });
    }

    try {
        await sendToTelegram(CHAT_ID);
        await sendToTelegram(OWNER_ID);

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
