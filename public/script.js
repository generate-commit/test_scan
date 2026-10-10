let studentData = {};
const correctAnswers = { q1: "B", q2: "A" };

async function startTest() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const groupName = document.getElementById('groupName').value.trim();

    if (!firstName || !lastName || !groupName) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    studentData = { firstName, lastName, groupName };

    fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'start', studentInfo: studentData })
    });

    document.getElementById('login-section').style.display = 'none';
    document.getElementById('test-section').style.display = 'block';
}

async function finishTest() {
    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;
    let userAnswersText = "";

    for (let i = 1; i <= totalQuestions; i++) {
        const qName = `q${i}`;
        const selectedOption = document.querySelector(`input[name="${qName}"]:checked`);
        const userAns = selectedOption ? selectedOption.value : "Belgilanmadi";

        let status = "❌";
        if (userAns === correctAnswers[qName]) {
            score++;
            status = "✅";
        }
        userAnswersText += `• Savol ${i}: ${userAns} ${status}\n`;
    }

    const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'finish',
            studentInfo: studentData,
            results: { score, totalQuestions, details: userAnswersText }
        })
    });

    const result = await response.json();
    if (result.success) {
        alert("Test yakunlandi! Natijangiz yuborildi.");
        location.reload();
    } else {
        alert("Xatolik yuz berdi.");
    }
}
