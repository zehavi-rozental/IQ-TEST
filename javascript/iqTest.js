const userNameDisplay = document.getElementById("userNameDisplay");
const userName = sessionStorage.getItem('userName'); 

if (userNameDisplay) {
    userNameDisplay.textContent = `שלום ${userName}! 😊`; 
}

const questionsContainer = document.getElementById("questions");
let questionsData = [];
let currentQuestion = 0;
let CountingPoints = 0;
let lenQuestionsData = 0;

$.ajax({
    // נתיב לקובץ ה-JSON
    url: '../json/iqTest.json', 
    dataType: 'json', 
    success: (data) => {
        questionsData = data;
        lenQuestionsData = data.length;
        questionsData = shuffleArray(data);
        showQuestion(currentQuestion);
    },
    error: (xhr, status, error) => { 
        console.error(`AJAX Error loading iqTest.json: ${status} - ${error}`, xhr);
        alert('אירעה שגיאה בטעינת השאלות. אנא נסה/י שוב מאוחר יותר.');
    }
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}

// פונקציה להצגת שאלה בודדת
function showQuestion(index) {
    if (index >= questionsData.length) {
        displayResults();
        return;
    }

    questionsContainer.innerHTML = '';
    const question = questionsData[index]; 

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-area fade-in'; 
    // עדכון נתיב לתמונת השאלה
    const questionImageHtml = `<img class="question-img" src="../img/iqTest/${question.question}" alt="שאלת IQ">`; 
    questionDiv.innerHTML = questionImageHtml;

    const answerDiv = document.createElement('div');
    answerDiv.className = 'answers-area fade-in'; 

    // ארגון וערבוב התשובות
    const allAnswers = [
        { src: question.answers[0].answer1, isCorrect: false },
        { src: question.answers[0].answer2, isCorrect: false },
        { src: question.answers[0].answer4, isCorrect: false },
        { src: question.answers[0].answer5, isCorrect: false },
        { src: question.answers[0].answer6, isCorrect: false },
        { src: question.answers[0].correct, isCorrect: true } // התשובה הנכונה
    ];
    
    const shuffledAnswers = shuffleArray(allAnswers); 

    let answersHtml = '';
    shuffledAnswers.forEach(ans => {
        // עדכון נתיב לתמונות התשובות
        answersHtml += `<img class="answer-img ${ans.isCorrect ? 'correct-answer' : ''}" src="../img/iqTest/${ans.src}" alt="תשובה">`;
    });
    
    answerDiv.innerHTML = answersHtml;
    questionsContainer.appendChild(questionDiv);
    questionsContainer.appendChild(answerDiv);

    // מאזין לכל תמונת תשובה
    answerDiv.querySelectorAll('.answer-img').forEach(img => {
        img.addEventListener('click', () => {
            // **תיקון קריטי**: בדוק אם התשובה נכונה באמצעות הקלאס 'correct-answer'
            if (img.classList.contains('correct-answer')) {
                CountingPoints += (100 / lenQuestionsData); 
            }

            if (currentQuestion < questionsData.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                displayResults(); // הצג תוצאות סופיות
            }
        });
    });
}

// בסיום המבחן:
function displayResults() {
    // סגור פופ-אפים אחרים אם פתוחים
    ['loginPopup', 'welcomePopup', 'resultsPopup'].forEach(id => {
        const modalEl = document.getElementById(id);
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    });

    // עדכון הציון בפופ-אפ
    const score = CountingPoints.toFixed(2);
    document.getElementById('finalScoreDisplay').textContent = score;

    // הודעה חמודה
    let msg = '';
    if (score >= 90) msg = 'וואו! אתה ממש גאון! 🌟';
    else if (score >= 70) msg = 'כל הכבוד! תוצאה מצוינת! 🎉';
    else if (score >= 50) msg = 'יפה מאוד! המשך להתאמן! 💪';
    else msg = 'אל דאגה, תמיד אפשר לנסות שוב! 🌈';
    document.getElementById('cuteMessage').textContent = msg;

    // הצגת הפופ-אפ
    const quizEndModal = new bootstrap.Modal(document.getElementById('quizEndModal'));
    quizEndModal.show();
}

// פונקציות לטיפול בכפתור חזרה למסך הראשי
function confirmExit() {
    // מציג את המודל רק כשלוחצים על כפתור החזרה
    const exitModal = new bootstrap.Modal(document.getElementById('exitConfirmModal'));
    exitModal.show();
}

function goToMain() {
    window.location.href = 'main.html'; 
}
    exitModal.show();


function goToMain() {
    window.location.href = 'main.html'; 
}
