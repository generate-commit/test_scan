export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, studentInfo, results } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    let messageText = "";

    if (type === 'start') {
        messageText = `🚀 TEST BOSHLANDI!\n\n👤 O'quvchi: ${studentInfo.lastName} ${studentInfo.firstName}\n🏫 Guruh: ${studentInfo.groupName}\n⏰ Vaqti: ${new Date().toLocaleTimeString("uz-UZ")}`;
    } else if (type === 'finish') {
        messageText = `✅ TEST YAKUNLANDI!\n\n👤 O'quvchi: ${studentInfo.lastName} ${studentInfo.firstName}\n🏫 Guruh: ${studentInfo.groupName}\n📊 Natija: ${results.score} / ${results.totalQuestions} ball\n\n📝 Javoblar:\n${results.details}`;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: messageText })
        });
        const data = await response.json();
        return res.status(200).json({ success: data.ok });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
