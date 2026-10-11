let tg = window.Telegram.WebApp;
tg.expand();

const questionsDatabase = [
    { id: 1, question: "O'zbekiston poytaxti qaysi shahar?", options: ["Samarqand", "Toshkent", "Buxoro", "Namangan"], correct: "Toshkent" },
    { id: 2, question: "Python dasturlash tilida ekranga chiqarish funksiyasi qaysi?", options: ["echo", "print", "console.log", "write"], correct: "print" },
    { id: 3, question: "5 * 5 + 5 nechaga teng?", options: ["25", "30", "35", "20"], correct: "30" },
    { id: 4, question: "Vercel asosan qanday turdagi ilovalarni joylash uchun qulay?", options: ["Faqat mobil ilovalar", "Frontend va Serverless loyihalar", "Faqat Desktop o'yinlar", "Fayl Server"], correct: "Frontend va Serverless loyihalar" }
];

let studentData = {};
let timer;
let timeLeft = 300; // 5 daqiqa

function startTest() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const groupName = document.getElementById('groupName').value.trim();

    if (!firstName || !lastName || !groupName) {
        alert("Iltimos, barcha maydonlarni to'liq to'ldiring!");
        return;
    }

    studentData = { firstName, lastName, groupName };

    // Botga test boshlangani haqida 1 marta xabar yuborish
    fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'start', studentInfo: studentData })
    });

    document.getElementById('login-section').style.display = 'none';
    document.getElementById('test-section').style.display = 'block';

    renderQuestions();
    startTimer();
}

function renderQuestions() {
    let container = document.getElementById('questions-container');
    container.innerHTML = "";

    questionsDatabase.forEach((q, index) => {
        let optionsHtml = q.options.map(opt => `
            <label class="option-label">
                <input type="radio" name="q${q.id}" value="${opt}"> ${opt}
            </label>
        `).join('');

        container.innerHTML += `
            <div class="question-card">
                <p>${index + 1}. ${q.question}</p>
                ${optionsHtml}
            </div>
        `;
    });
}

function startTimer() {
    timer = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById('time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Vaqtingiz tugadi!");
            finishTest();
        }
        timeLeft--;
    }, 1000);
}

async function finishTest() {
    clearInterval(timer);
    let score = 0;
    let totalQuestions = questionsDatabase.length;
    let detailsText = "";
    let reviewHtml = "<h3 style='font-size:16px; margin-top:20px;'>Javoblar tahlili:</h3>";

    questionsDatabase.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        const userAns = selected ? selected.value : "Belgilanmadi";

        let isCorrect = (userAns === q.correct);
        if (isCorrect) score++;

        detailsText += `${index + 1}. ${q.question}\nJavob: ${userAns} ${isCorrect ? '✅' : '❌ (To\'g\'ri: ' + q.correct + ')'}\n\n`;
        
        reviewHtml += `
            <div style="background: ${isCorrect ? '#f0fdf4' : '#fef2f2'}; padding: 12px; margin-bottom: 10px; border-radius: 10px; border: 1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}">
                <p style="margin:0 0 6px 0; font-size:14px;"><b>${index + 1}. ${q.question}</b></p>
                <p style="margin:0; font-size:13px;">Sizning javobingiz: <b>${userAns}</b> ${isCorrect ? '✅' : '❌'}</p>
                ${!isCorrect ? `<p style="color: #dc2626; margin:4px 0 0 0; font-size:13px;">To'g'ri javob: ${q.correct}</p>` : ''}
            </div>
        `;
    });

    let percentage = Math.round((score / totalQuestions) * 100);

    // 1. Natijani sayt ekranga chiqarish
    document.getElementById('test-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('score-text').textContent = `Natijangiz: ${score} / ${totalQuestions} (${percentage}%)`;
    document.getElementById('review-container').innerHTML = reviewHtml;

    // 2. Botga natijani 1 marta yuborish
    try {
        await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'finish',
                studentInfo: studentData,
                results: { score, totalQuestions, percentage, details: detailsText }
            })
        });
    } catch (err) {
        console.error("Xatolik:", err);
    }
}
