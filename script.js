const menuToggle = document.querySelector('.menu-toggle');
const menuToggleLabel = menuToggle?.querySelector('.sr-only');
const siteNav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const aboutDialog = document.querySelector('#about-dialog');
const dialogOpeners = [...document.querySelectorAll('[data-dialog-open="about-dialog"]')];
const dialogClose = aboutDialog?.querySelector('[data-dialog-close]');
let lastDialogTrigger;

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  if (menuToggleLabel) menuToggleLabel.textContent = '메뉴 열기';
  siteNav.classList.remove('is-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  if (menuToggleLabel) menuToggleLabel.textContent = isOpen ? '메뉴 열기' : '메뉴 닫기';
  siteNav?.classList.toggle('is-open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

function openAboutDialog(trigger) {
  if (!aboutDialog || aboutDialog.open) return;
  lastDialogTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  aboutDialog.showModal();
  dialogClose?.focus({ preventScroll: true });
  aboutDialog.scrollTop = 0;
}

function closeAboutDialog() {
  if (aboutDialog?.open) aboutDialog.close();
}

dialogOpeners.forEach((trigger) => trigger.addEventListener('click', () => openAboutDialog(trigger)));
dialogClose?.addEventListener('click', closeAboutDialog);

aboutDialog?.addEventListener('click', (event) => {
  if (event.target === aboutDialog) closeAboutDialog();
});

aboutDialog?.addEventListener('close', () => {
  lastDialogTrigger?.setAttribute('aria-expanded', 'false');
  lastDialogTrigger?.focus();
  lastDialogTrigger = undefined;
});

const projectDialogOpeners = [...document.querySelectorAll('[data-project-dialog-open]')];
const projectDialogs = [...document.querySelectorAll('.project-dialog')];
let lastProjectDialogTrigger;

function openProjectDialog(trigger) {
  const dialog = document.querySelector(`#${trigger.dataset.projectDialogOpen}`);
  if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
  lastProjectDialogTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  dialog.showModal();
  dialog.querySelector('[data-project-dialog-close]')?.focus({ preventScroll: true });
  dialog.scrollTop = 0;
}

function closeProjectDialog(dialog) {
  if (dialog.open) dialog.close();
}

projectDialogOpeners.forEach((trigger) => trigger.addEventListener('click', () => openProjectDialog(trigger)));
projectDialogs.forEach((dialog) => {
  dialog.querySelector('[data-project-dialog-close]')?.addEventListener('click', () => closeProjectDialog(dialog));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeProjectDialog(dialog);
  });
  dialog.addEventListener('close', () => {
    resetDialogMotion(dialog);
    lastProjectDialogTrigger?.setAttribute('aria-expanded', 'false');
    lastProjectDialogTrigger?.focus();
    lastProjectDialogTrigger = undefined;
  });
});

const projectCarousel = document.querySelector('[data-project-carousel]');
const projectScrollControls = [...document.querySelectorAll('[data-project-scroll]')];

// 최신순 카드도 항상 왼쪽 첫 카드부터 시작합니다.
// 브라우저의 가로 스크롤 복원은 load 이후에도 발생할 수 있어 짧은 초기화 구간을 둡니다.
function resetProjectCarouselStart() {
  if (!projectCarousel) return;
  projectCarousel.scrollLeft = 0;
}

function establishProjectCarouselStart() {
  [0, 60, 240, 600].forEach((delay) => {
    window.setTimeout(resetProjectCarouselStart, delay);
  });
}

establishProjectCarouselStart();
window.addEventListener('load', establishProjectCarouselStart, { once: true });
window.addEventListener('pageshow', establishProjectCarouselStart);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionImages = Array.from(document.querySelectorAll('[data-motion-src][data-motion-poster]'));
const motionToggles = Array.from(document.querySelectorAll('[data-motion-toggle]'));
const motionPlayers = [];

function setMotionPlayback(motionImage, motionToggle, shouldPlay) {
  if (!(motionImage instanceof HTMLImageElement) || !(motionToggle instanceof HTMLButtonElement)) return;
  const source = shouldPlay ? motionImage.dataset.motionSrc : motionImage.dataset.motionPoster;
  if (source && motionImage.getAttribute('src') !== source) motionImage.setAttribute('src', source);
  motionToggle.dataset.motionPlaying = String(shouldPlay);
  motionToggle.setAttribute('aria-pressed', String(shouldPlay));
  motionToggle.textContent = shouldPlay ? '애니메이션 정지' : '애니메이션 재생';
}

function resetDialogMotion(dialog) {
  dialog.querySelectorAll('[data-motion-src][data-motion-poster]').forEach((motionImage) => {
    if (!(motionImage instanceof HTMLImageElement) || !motionImage.id) return;
    const motionToggle = motionToggles.find((toggle) => toggle.getAttribute('aria-controls') === motionImage.id);
    if (motionToggle instanceof HTMLButtonElement) setMotionPlayback(motionImage, motionToggle, false);
  });
}

motionImages.forEach((motionImage) => {
  if (!(motionImage instanceof HTMLImageElement) || !motionImage.id) return;
  const motionToggle = motionToggles.find((toggle) => toggle.getAttribute('aria-controls') === motionImage.id);
  if (!(motionToggle instanceof HTMLButtonElement)) return;

  motionPlayers.push({ motionImage, motionToggle });
  motionToggle.hidden = false;
  const shouldAutoplay = motionImage.dataset.motionAutoplay !== 'false' && !reducedMotion.matches;
  setMotionPlayback(motionImage, motionToggle, shouldAutoplay);
  motionToggle.addEventListener('click', () => {
    const shouldPlay = motionToggle.dataset.motionPlaying !== 'true';
    if (shouldPlay) {
      motionPlayers.forEach((player) => {
        if (player.motionImage !== motionImage) {
          setMotionPlayback(player.motionImage, player.motionToggle, false);
        }
      });
    }
    setMotionPlayback(motionImage, motionToggle, shouldPlay);
  });
});

reducedMotion.addEventListener?.('change', (event) => {
  if (!event.matches) return;
  motionPlayers.forEach(({ motionImage, motionToggle }) => setMotionPlayback(motionImage, motionToggle, false));
});

function updateProjectScrollControls() {
  if (!projectCarousel) return;
  const maxScroll = Math.max(0, projectCarousel.scrollWidth - projectCarousel.clientWidth);
  const atStart = projectCarousel.scrollLeft <= 1;
  const atEnd = projectCarousel.scrollLeft >= maxScroll - 1;

  projectScrollControls.forEach((control) => {
    control.disabled = maxScroll <= 1 || (control.dataset.projectScroll === 'previous' ? atStart : atEnd);
  });
}

function scrollProjects(direction) {
  if (!projectCarousel) return;
  const firstCard = projectCarousel.querySelector('.project-carousel-card');
  const cardWidth = firstCard?.getBoundingClientRect().width || projectCarousel.clientWidth;
  const gap = Number.parseFloat(getComputedStyle(projectCarousel.querySelector('.project-carousel-track')).gap) || 0;

  projectCarousel.scrollBy({
    left: direction * (cardWidth + gap),
    behavior: reducedMotion.matches ? 'auto' : 'smooth',
  });
}

projectScrollControls.forEach((control) => {
  control.addEventListener('click', () => scrollProjects(control.dataset.projectScroll === 'next' ? 1 : -1));
});
projectCarousel?.addEventListener('scroll', updateProjectScrollControls, { passive: true });
window.addEventListener('resize', updateProjectScrollControls);
updateProjectScrollControls();

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const activeEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!activeEntry) return;
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${activeEntry.target.id}`);
    });
  },
  { rootMargin: '-35% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));
document.querySelector('#year').textContent = String(new Date().getFullYear());

