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

const imageLightbox = document.querySelector('#image-lightbox');
const imageLightboxImage = imageLightbox?.querySelector('.image-lightbox-image');
const imageLightboxClose = imageLightbox?.querySelector('[data-image-lightbox-close]');
const aboutImages = [...(aboutDialog?.querySelectorAll('img') || [])].filter((image) => image.alt && !image.closest('a, button'));
const projectImages = [...document.querySelectorAll('.project-dialog img')].filter((image) => image.alt && !image.closest('a, button'));
let lastImageLightboxTrigger;

function openImageLightbox(sourceImage) {
  if (!(imageLightbox instanceof HTMLDialogElement) || !(imageLightboxImage instanceof HTMLImageElement) || imageLightbox.open) return;
  lastImageLightboxTrigger = sourceImage;
  imageLightbox.classList.toggle('image-lightbox--motion', /\.gif(?:[?#]|$)/i.test(sourceImage.src));
  imageLightboxImage.src = sourceImage.src;
  imageLightboxImage.alt = sourceImage.alt;
  imageLightbox.showModal();
  imageLightboxClose?.focus({ preventScroll: true });
}

function closeImageLightbox() {
  if (imageLightbox?.open) imageLightbox.close();
}

[...aboutImages, ...projectImages].forEach((image) => {
  image.classList.add('is-image-lightbox-trigger');
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-haspopup', 'dialog');
  image.setAttribute('aria-controls', 'image-lightbox');
  image.setAttribute('aria-label', `${image.alt || '사진'} 원본 보기`);
  image.addEventListener('click', () => openImageLightbox(image));
  image.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openImageLightbox(image);
  });
});

imageLightboxClose?.addEventListener('click', closeImageLightbox);
imageLightbox?.addEventListener('click', (event) => {
  if (event.target === imageLightbox) closeImageLightbox();
});
imageLightbox?.addEventListener('close', () => {
  imageLightboxImage?.removeAttribute('src');
  if (imageLightboxImage) imageLightboxImage.alt = '';
  if (lastImageLightboxTrigger?.isConnected) lastImageLightboxTrigger.focus({ preventScroll: true });
  lastImageLightboxTrigger = undefined;
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
  const playLabel = motionToggle.dataset.motionPlayLabel || '애니메이션 재생';
  const pauseLabel = motionToggle.dataset.motionPauseLabel || '애니메이션 정지';
  motionToggle.textContent = shouldPlay ? pauseLabel : playLabel;
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

