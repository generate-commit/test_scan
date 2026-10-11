export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, studentInfo, results } = req.body;

    // TOKEN VA ID'LARINGIZNI SHU YERGA ANIQ YOZING:
    const BOT_TOKEN = "8502635236:AAGL3bj1x4eQAGnqI86voIbpIMBKY9FKTYc"; 
    const CHAT_ID = "8694565465"; // Guruh yoki o'zingizning Telegram ID'ingiz

    let messageText = "";

    if (type === 'start') {
        messageText = `🚀 *O'quvchi testni boshladi!*\n\n👤 *O'quvchi:* ${studentInfo.lastName} ${studentInfo.firstName}\n🏫 *Guruh:* ${studentInfo.groupName}\n⏰ *Vaqt:* ${new Date().toLocaleTimeString("uz-UZ")}`;
    } else if (type === 'finish') {
        messageText = `🎯 *Test Yakunlandi!*\n\n👤 *O'quvchi:* ${studentInfo.lastName} ${studentInfo.firstName}\n🏫 *Guruh:* ${studentInfo.groupName}\n📊 *Natija:* ${results.score} / ${results.totalQuestions} (${results.percentage}%)\n\n📝 *Javoblar tafsiloti:*\n${results.details}`;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: CHAT_ID, 
                text: messageText, 
                parse_mode: 'Markdown' 
            })
        });

        const data = await response.json();
        
        if (!data.ok) {
            console.error("Telegram API Xatosi:", data);
            return res.status(500).json({ success: false, error: data.description });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
