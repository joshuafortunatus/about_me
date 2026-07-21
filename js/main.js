document.getElementById('year').textContent = new Date().getFullYear();

const navLinks = document.querySelectorAll('.nav__links a');
const sections = document.querySelectorAll('main .section, .hero');

const setActive = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  });
};

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);
sections.forEach((section) => navObserver.observe(section));

const revealTargets = document.querySelectorAll(
  '.timeline__item, .project-card, .stack__group, .education-card, .interests__list'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
  const dialog = document.getElementById(trigger.dataset.modalOpen);
  if (dialog) trigger.addEventListener('click', () => dialog.showModal());
});

document.querySelectorAll('.project-modal').forEach((dialog) => {
  dialog.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
});
