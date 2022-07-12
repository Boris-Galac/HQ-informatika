let overlay = document.createElement('div');

// nav menu

const hamIcon = document.querySelector('.header__ham-btn');
const navMenu = document.querySelector('.nav');

hamIcon.addEventListener('click', (e) => {
  let lines = [...e.currentTarget.children];
  lines.forEach((line) => {
    line.classList.add('active');
  });
  navMenu.classList.add('active');
  overlay.classList.add('overlay');
  document.body.append(overlay);
  overlay.addEventListener('click', (e) => {
    navMenu.classList.remove('active');
    overlay.remove();
    lines.forEach((line) => {
      line.classList.remove('active');
    });
  });
});
