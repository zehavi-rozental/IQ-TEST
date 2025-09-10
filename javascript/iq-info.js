//אם הרשת לא מחוברת יעבוד הקוד הבא
document.addEventListener('DOMContentLoaded', function() {
    const readMoreLink = document.querySelector('.read-more-link');
    const extendedContent = document.querySelector('.extended-content');
    const readMoreBtn = document.querySelector('.read-more-btn');
    const contentExpandable = document.querySelector('.content-expandable');
    const contentInner = document.querySelector('.content-inner');

    readMoreLink.addEventListener('click', function(e) {
        e.preventDefault();
        extendedContent.classList.toggle('active');
        readMoreLink.textContent = extendedContent.classList.contains('active') ? 'סגור' : 'קרא עוד';
    });

    if (readMoreBtn && contentExpandable) {
        readMoreBtn.addEventListener('click', function() {
            if (contentExpandable.style.display === 'none') {
                contentExpandable.style.display = 'block';
                setTimeout(() => {
                    contentInner.classList.add('show');
                }, 10);
                readMoreBtn.textContent = 'סגור';
            } else {
                contentInner.classList.remove('show');
                setTimeout(() => {
                    contentExpandable.style.display = 'none';
                }, 300);
                readMoreBtn.textContent = 'קרא עוד';
            }
        });
    }
});
