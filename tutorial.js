const controls = document.querySelector('#width-controls');
const preview = document.querySelector('#layout-preview');
if (controls && preview) {
  controls.hidden = false;
  controls.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-width]');
    if (!button) return;
    preview.style.width = button.dataset.width === 'full' ? '100%' : '360px';
    for (const item of controls.querySelectorAll('button')) {
      item.setAttribute('aria-pressed', String(item === button));
    }
  });
}

const lessonMenu = document.querySelector('.lesson-menu');
if (lessonMenu) {
  const smallScreen = window.matchMedia('(max-width: 800px)');
  const setMenuDefault = () => { lessonMenu.open = !smallScreen.matches; };
  setMenuDefault();
  smallScreen.addEventListener('change', setMenuDefault);
}

// Local practice checks: no scores, personal data or network requests.
for (const quiz of document.querySelectorAll('.quiz')) {
  const options = [...quiz.querySelectorAll('.quiz-option')];
  const feedback = quiz.querySelector('.quiz-feedback');
  for (const option of options) {
    option.disabled = false;
    option.addEventListener('click', () => {
      for (const other of options) other.setAttribute('aria-pressed', String(other === option));
      feedback.textContent = option.dataset.feedback;
      feedback.dataset.result = option.dataset.correct === 'true' ? 'correct' : 'retry';
    });
  }
}
