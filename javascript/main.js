
//להצגת העכבר
document.addEventListener('DOMContentLoaded', () => {
    // לוגיקה של סמן עכבר מותאם אישית
    const customCursor = document.querySelector('.custom-cursor');
    // בחירת כל האלמנטים האינטראקטיביים שאמורים להפעיל את מצב ה'פעיל' של הסמן
    const interactiveElements = document.querySelectorAll('a, button, input, .test-circle, .swiper-slide, .list-group-item, .why-box, .accordion-button');

    if (customCursor) {
        // עדכון מיקום הסמן המותאם אישית בתנועת עכבר
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            console.log(`Mouse X: ${e.clientX}, Mouse Y: ${e.clientY}`);
            customCursor.style.top = `${e.clientY}px`;
        });

        // הוספה/הסרה של מחלקת 'active' על אלמנטים אינטראקטיביים לאפקט קנה המידה של הסמן
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                customCursor.classList.add('active');
            });
            element.addEventListener('mouseleave', () => {
                customCursor.classList.remove('active');
            });
        });
    }

    // מעקב עכבר לרקע דינמי
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        document.addEventListener('mousemove', (e) => {
            // חישוב מיקום העכבר כאחוז מה-viewport
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            // עדכון משתני CSS מותאמים אישית למיקום גרדיאנט רדיאלי
            mainHeader.style.setProperty('--mouse-x', `${x}%`);
            mainHeader.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // הצגת פופ-אפ ברוכים הבאים אחרי 6 שניות
    const welcomePopupElement = document.getElementById('welcomePopup');
    if (welcomePopupElement) {
        setTimeout(() => {
            const welcomePopup = new bootstrap.Modal(welcomePopupElement);
            welcomePopup.show();
        }, 6000);
    }

    // אפקט אבק כוכבים
    function createStardustParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('stardust-particle');
        document.body.appendChild(particle);

        // הגרלת כיוון ומרחק לתנועת החלקיק
        const angle = Math.random() * Math.PI * 2; // מעגל שלם
        const distance = Math.random() * 50 + 50; // מרחק בין 50px ל-100px
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;

        // הגדרת מיקום התחלתי
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        // הגדרת משתני CSS לשימוש באנימציה
        particle.style.setProperty('--stardust-x', `${endX - x}px`);
        particle.style.setProperty('--stardust-y', `${endY - y}px`);

        // הסרת החלקיק לאחר סיום האנימציה שלו לניקוי ה-DOM
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    // טיפול בפופ-אפ התחברות
    let loginModal;
    let currentTest;

    window.showLoginPopup = function(testType) {
        currentTest = testType;
        document.getElementById('selectedTest').value = testType;
        
        if (!loginModal) {
            loginModal = new bootstrap.Modal(document.getElementById('loginPopup'));
        }
        loginModal.show();
    }

    // פונקציה גלובלית לטיפול בלוגין
    window.handleLogin = function(event) {
        event.preventDefault();
        const userName = document.getElementById('userName').value;
        sessionStorage.setItem('userName', userName);
        loginModal.hide();
        
        // הפעלת אפקט אבק כוכבים ממרכז כפתור ההתחברות
        const loginButton = event.target.querySelector('.btn-lg');
        if (loginButton) {
            const rect = loginButton.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            for (let i = 0; i < 15; i++) { // יצירת 15 חלקיקים לאפקט התפרצות נחמד
                createStardustParticle(centerX, centerY);
            }
        }

        // ניתוב למבחן המתאים לאחר השהיה קצרה לאנימציית אבק הכוכבים
        setTimeout(() => {
            switch(currentTest) {
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
                    // במקרה של testType לא ידוע, ניתן להפנות לדף ברירת מחדל או להציג הודעה
                    console.warn('Unknown test type:', currentTest);
                    window.location.href = 'main.html';
                    break;
            }
        }, 800); // מתן זמן קצר לאנימציית אבק הכוכבים לפני הניתוב
    }

    // פונקציות לחישוב ציון
    function calculateScore(correctAnswers, totalQuestions) {
        const score = (correctAnswers / totalQuestions) * 100;
        return Math.round(score); // עיגול למספר שלם
    }

    // טיפול בסיום המבחן
    window.handleTestCompletion = function(correctAnswers, totalQuestions) {
        const finalScore = calculateScore(correctAnswers, totalQuestions);
        
        // הצגת הציון בפופאפ
        const scoreElement = document.getElementById('finalScore');
        if (scoreElement) {
            scoreElement.textContent = finalScore;
        }
        
        // הצגת הודעת משוב
        const feedbackElement = document.querySelector('.feedback-message');
        if (feedbackElement) {
            if (correctAnswers === totalQuestions) {
                feedbackElement.textContent = '🌟 מדהים! כל התשובות נכונות! כל הכבוד! 🌟';
            } else if (finalScore >= 80) {
                feedbackElement.textContent = '👏 כל הכבוד! תוצאה מצוינת!';
            } else if (finalScore >= 60) {
                feedbackElement.textContent = '😊 טוב מאוד! המשך להתאמן!';
            } else {
                feedbackElement.textContent = '💪 נסה שוב, אתה יכול להצליח יותר!';
            }
        }
        
        // הצגת פופאפ התוצאות
        const resultsModal = new bootstrap.Modal(document.getElementById('resultsPopup'));
        resultsModal.show();

        playScoreSound(finalScore); // השמעת צליל בהתאם לציון
    }

    // מאזינים לאירוע מותאם אישית 'testSubmit' המופעל מדפי המבחנים
    document.addEventListener('testSubmit', (e) => {
        const { correctAnswers, totalQuestions } = e.detail;
        handleTestCompletion(correctAnswers, totalQuestions);
    });

    // פונקציה להשמעת צליל ציון
    function playScoreSound(score) {
        let src;
        if (score === 100) src = '../sounds/perfect.mp3';
        else if (score >= 80) src = '../sounds/excellent.mp3';
        else if (score >= 60) src = '../sounds/good.mp3';
        else src = '../sounds/tryagain.mp3';
        
        if (window.Howl) {
            new Howl({src: [src]}).play();
        } else {
            console.warn('Howler.js is not loaded. Cannot play sound.');
        }
    }

    // אתחול Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    } else {
        console.warn('particles.js library not found. Background animation will not be initialized.');
    }
});

