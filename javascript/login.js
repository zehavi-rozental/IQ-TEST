// פונקציה לטיפול בלוגין ולניתוב
function handleLogin(event) {
    event.preventDefault(); // מונע את שליחת הטופס הרגילה ורענון הדף

    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim(); // קבלת הערך של שדה השם וניקוי רווחים מיותרים

    if (!name) {
        // אם השם ריק, מציגים התראה וממקדים את השדה
        alert('היי! אנחנו ממש רוצים להכיר אותך! בבקשה כתוב את השם שלך 😊');
        nameInput.focus(); // ממקד את שדה הקלט
        return; // עוצרים את הפונקציה
    }

    localStorage.setItem('name', name); // שמירת השם ב-localStorage

    // קבלת סוג המבחן מפרמטרי ה-URL
    const urlParams = new URLSearchParams(window.location.search);
    const testType = urlParams.get('test');

    // ניתוב לדף המבחן המתאים בהתאם לפרמטר 'test'
    switch(testType) {
        case 'shapes':
            window.location.href = 'iqTest.html';
            break;
        case 'pictures':
            window.location.href = 'picture.html';
            break;
        case 'questions':
            window.location.href = 'question.html';
            break;
        case 'different':
            window.location.href = 'bloks.html';
            break;
        default:
            // אם אין פרמטר 'test' או שהוא לא תקין, מנתבים לדף הבית הראשי
            window.location.href = 'main.html'; 
    }
}

// מאזין לאירוע שליחת הטופס (submit) ומפעיל את הפונקציה handleLogin
document.getElementById('loginForm').addEventListener('submit', handleLogin);