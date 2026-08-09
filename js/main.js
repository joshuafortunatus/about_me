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

(async () => {
  const subtitle = document.getElementById('gh-subtitle');
  const monthsEl = document.getElementById('gh-months');
  const gridEl = document.getElementById('gh-grid');
  if (!subtitle || !monthsEl || !gridEl) return;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  try {
    const res = await fetch('data/gh-contributions.json');
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const days = data.contributions;

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    monthsEl.style.gridTemplateColumns = `repeat(${weeks.length}, 10px)`;
    weeks.forEach((week, i) => {
      const firstOfMonth = week.find((d) => Number(d.date.slice(-2)) === 1);
      const label = firstOfMonth
        ? monthNames[Number(firstOfMonth.date.slice(5, 7)) - 1]
        : i === 0
          ? monthNames[Number(week[0].date.slice(5, 7)) - 1]
          : '';
      const span = document.createElement('span');
      span.style.gridColumn = String(i + 1);
      span.textContent = label;
      monthsEl.appendChild(span);
    });

    days.forEach((day) => {
      const cell = document.createElement('span');
      cell.className = `gh-cell gh-cell--${day.level}`;
      const label = day.count === 1 ? '1 contribution' : `${day.count} contributions`;
      cell.title = `${label} on ${day.date}`;
      gridEl.appendChild(cell);
    });

    const total = data.total.lastYear;
    subtitle.textContent = `${total.toLocaleString()} contributions in the last year`;
  } catch (err) {
    subtitle.textContent = 'Could not load contribution activity — see the profile link below.';
  }
})();
