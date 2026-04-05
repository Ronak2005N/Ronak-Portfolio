const reveals = document.querySelectorAll('.reveal:not(.project-card)');
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach(reveal => revealObserver.observe(reveal));

const projectCards = document.querySelectorAll('.projects-grid .project-card.reveal');
let projectStackRaf = null;

const updateProjectStackState = () => {
  let activeIndex = -1;
  const topFooterElement = document.querySelector('.top-footer');
  const anchorY = (topFooterElement ? topFooterElement.offsetHeight : 88) + 26;

  projectCards.forEach((projectCard, index) => {
    if (!projectCard.classList.contains('visible')) {
      return;
    }

    const rect = projectCard.getBoundingClientRect();
    if (rect.top <= anchorY && rect.bottom > anchorY) {
      activeIndex = index;
    }
  });

  if (activeIndex === -1) {
    projectCards.forEach((projectCard, index) => {
      if (activeIndex === -1 && projectCard.classList.contains('visible')) {
        activeIndex = index;
      }
    });
  }

  projectCards.forEach((projectCard, index) => {
    projectCard.classList.remove('project-card-active', 'project-card-previous', 'project-card-deep');

    if (!projectCard.classList.contains('visible')) {
      return;
    }

    if (index === activeIndex) {
      projectCard.classList.add('project-card-active');
      return;
    }

    if (index === activeIndex - 1) {
      projectCard.classList.add('project-card-previous');
      return;
    }

    if (index < activeIndex - 1) {
      projectCard.classList.add('project-card-deep');
    }
  });
};

const scheduleProjectStackState = () => {
  if (projectStackRaf !== null) {
    return;
  }

  projectStackRaf = window.requestAnimationFrame(() => {
    projectStackRaf = null;
    updateProjectStackState();
  });
};

const projectObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      const order = Number(entry.target.getAttribute('data-project-order')) || 0;
      entry.target.style.transitionDelay = `${Math.min(order * 0.06, 0.2)}s`;
      entry.target.classList.add('visible');
      scheduleProjectStackState();
      projectObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.28,
    rootMargin: '0px 0px -14% 0px'
  }
);

projectCards.forEach((projectCard, index) => {
  projectCard.setAttribute('data-project-order', String(index));
  projectCard.style.zIndex = String(index + 1);
  projectObserver.observe(projectCard);
});

if (projectCards.length > 0) {
  window.addEventListener('scroll', scheduleProjectStackState, { passive: true });
  window.addEventListener('resize', scheduleProjectStackState);
  scheduleProjectStackState();
}

document.querySelectorAll('.stats-strip .stat-item').forEach((element, index) => {
  element.style.transitionDelay = index * 0.1 + 's';
});

document.querySelectorAll('.skill-card').forEach((element, index) => {
  element.style.transitionDelay = index * 0.07 + 's';
});

const topFooter = document.querySelector('.top-footer');
const marquee = document.querySelector('.marquee-wrap');

if (topFooter && marquee) {
  const syncTopFooterTone = () => {
    const marqueeRect = marquee.getBoundingClientRect();
    const navRect = topFooter.getBoundingClientRect();
    const isOverMarquee = marqueeRect.top <= navRect.bottom && marqueeRect.bottom >= navRect.top;

    topFooter.classList.toggle('top-footer-over-marquee', isOverMarquee);
  };

  syncTopFooterTone();
  window.addEventListener('scroll', syncTopFooterTone, { passive: true });
  window.addEventListener('resize', syncTopFooterTone);
}
