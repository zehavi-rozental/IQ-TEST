
const userNameDisplay = document.getElementById("userNameDisplay");
const userName = sessionStorage.getItem('userName'); 
const questionsContainer = document.getElementById("questions");
let picturesData = [];
let currentPicture = 0;
let lenPicturesData = 0;
let CountingPoints = 0;
let questionsData = [];
let lenQuestionsData = 0;
let currentQuestion = 0;
let count = 0;

if (userNameDisplay) {
    userNameDisplay.textContent = `שלום ${userName}! 😊`; 
}

$.ajax({
    url: '../json/allPicture.json',
    success: (data) => {
        picturesData = data[0].pictures;
        lenPicturesData = picturesData.length;
        shuffleArray(picturesData);
        showWelcomeMessage(); // Show welcome message first
    },
    error: () => {
        alert('אירעה שגיאה במהלך שליפת הנתונים');
    }
});
// משפט שמוצג בתחילת המשחק

function showWelcomeMessage() {
    questionsContainer.innerHTML = `
        <div class="welcome-message" style="
            text-align: center;
            font-size: 1.5em;
            padding: 20px;
            margin: 20px;
            color: #2c3e50;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            animation: fadeInOut 3s ease-in-out forwards;
        ">
            <h2 style="color: #e74c3c; margin-bottom: 15px;">🌟 בואו נתחיל לשחק! 🌟</h2>
            <p>הסתכלו היטב על התמונות והשמות שיופיעו...</p>
            <p>זכרו אותם, ונראה כמה אתם חכמים! 😊</p>
        </div>
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(style);

    // Start showing pictures after the welcome message
    setTimeout(() => {
        showPictures();
    }, 6000);
}

// משתנים גלובליים
let isLearningPhase = true; // האם אנחנו בשלב הלימוד

// שלב 1: הצגת התמונות ללימוד
function showPictures() {
    if (currentPicture >= lenPicturesData) {
        isLearningPhase = false;
        loadQuestions();
        return;
    }

    questionsContainer.innerHTML = `
        <div class="picture-display fade-in">
            <img src="../img/picture/${picturesData[currentPicture].picture}" alt="${picturesData[currentPicture].name}">
            <h2>${picturesData[currentPicture].name}</h2>
        </div>
    `;
    setTimeout(() => {
        currentPicture++;
        showPictures();
    }, 2000);
}

// שלב 2: החידון
function loadQuestions() {
    $.ajax({
        url: '../json/picture.json',
        success: (data) => {
            questionsData = data.questions;
            lenQuestionsData = questionsData.length;
            showQuestion(0);
        },
        error: () => {
            alert('אירעה שגיאה בטעינת השאלות');
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // החלפת מקומות
    }
    return array;
}

function showResultsPopup() {
    showResults(CountingPoints, 'picture');
}

function showQuestion(idx) {
    if (idx >= lenQuestionsData) {
        displayResults();
        return;
    }

    const question = questionsData[idx];
    const shuffledAnswers = shuffleArray([...question.answers]);
    questionsContainer.innerHTML = '';
    
    const mainContainer = document.createElement('div');
    mainContainer.className = 'img-and-answers';
    
    const imageArea = document.createElement('div');
    imageArea.className = 'img';
    const img = document.createElement('img');
    img.src = `../img/picture/${question.image}`;
    imageArea.appendChild(img);
    
    const answersArea = document.createElement('div');
    answersArea.className = 'answers';
    
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'button';
        button.textContent = answer;
        button.dataset.answer = answer;  // הוספת dataset.answer
        answersArea.appendChild(button);
    });
    
    mainContainer.appendChild(imageArea); 
    mainContainer.appendChild(answersArea);
    questionsContainer.appendChild(mainContainer);

    // הוספת מאזיני לחיצה לכל הכפתורים
    const buttons = questionsContainer.querySelectorAll('.button');
    // הוספת צלילים
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            count++;
            if (button.dataset.answer === question.correctAnswer) {
                // הוספת צליל נכון
                correctSound.currentTime = 0;
                correctSound.play();
                CountingPoints += Math.ceil(100 / lenQuestionsData);
                // הוספת צליל לחיצה
            } else {
                wrongSound.currentTime = 0;
                wrongSound.play();
            }
            
            if (count === lenQuestionsData)
                CountingPoints = Math.min(Math.floor(CountingPoints), 100);
            setTimeout(() => showQuestion(idx + 1), 500);
        });
    });
}

function showResults() {
    questionsContainer.innerHTML = `
        <div class="results fade-in">
            <h2>כל הכבוד! סיימת את המבחן</h2>
            <p>הציון שלך: ${CountingPoints}</p>
            <button onclick="window.location.href='main.html'" class="btn-main">
                חזרה לדף הראשי
            </button>
        </div>
    `;
}
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
    const score = CountingPoints;
    document.getElementById('finalScoreDisplay').textContent = score;

    // הודעה חמודה התקן את הקוד כך שיהיה כתוב בשניות הראשונות של תחילת התוכנית משפט שיגיד לילד להסתכל חזק על התמונות עם השם של כל אחד שיוכל להצליח כתוב משפט כזה קצר וקולע שישיג את המטרה ויהיה כיף לקרוא אותו בנוסף עצב זאת יפה בפרופורציה עם כל שאר העיצוב ושיבוא וילך המשפט עם אנימציה יפה
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


