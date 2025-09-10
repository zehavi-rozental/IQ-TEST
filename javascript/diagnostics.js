//אם הרשת לא עובדת ישתמש בקוד הבא
document.addEventListener('DOMContentLoaded', function() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.dataset.content;
            const extendedContent = document.getElementById(content);
            
            if (extendedContent.classList.contains('active')) {
                extendedContent.classList.remove('active');
                this.textContent = 'קרא עוד';
            } else {
                // סגירת כל התוכן המורחב האחר
                document.querySelectorAll('.extended-content.active').forEach(content => {
                    content.classList.remove('active');
                });
                document.querySelectorAll('.read-more-btn').forEach(btn => {
                    btn.textContent = 'קרא עוד';
                });
                
                // פתיחת התוכן הנוכחי
                extendedContent.classList.add('active');
                this.textContent = 'סגור';
            }
        });
    });
    
    const readMoreBtn = document.querySelector('.read-more-btn');
    const extendedContent = document.querySelector('.extended-content');

    if (readMoreBtn && extendedContent) {
        readMoreBtn.addEventListener('click', function() {
            if (extendedContent.style.display === 'block') {
                extendedContent.style.display = 'none';
                readMoreBtn.textContent = 'קרא עוד';
            } else {
                extendedContent.style.display = 'block';
                readMoreBtn.textContent = 'סגור';
            }
        });
    }
});

