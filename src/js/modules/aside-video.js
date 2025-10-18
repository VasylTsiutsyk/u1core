// aside-video.js
const STORAGE_PREFIX = 'asideVideo:';

function canUseLocalStorage() {
  try {
    const k = '__t__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch (_) {
    return false;
  }
}

export default function initAsideVideo(root = document) {
  const supportsLS = canUseLocalStorage();
  const blocks = Array.from(root.querySelectorAll('[data-aside-video]'));

  blocks.forEach((el, idx) => {
    const key = el.dataset.lsKey || `${STORAGE_PREFIX}${idx}`;

    if (supportsLS && localStorage.getItem(key) === '1') {
      // el.setAttribute('hidden', '');
      el.classList.remove('_show');
      return;
    } else {
      // el.removeAttribute('hidden');
      el.classList.add('_show');
    }

    const closeBtn = el.querySelector('[data-aside-video-close]');
    if (!closeBtn) return;

    const hide = () => {
      const video = el.querySelector('video');
      if (video) {
        try {
          video.pause();
          video.currentTime = 0;
        } catch (_) {}
      }

      // el.setAttribute('hidden', '');
      el.classList.remove('_show');
      if (supportsLS) localStorage.setItem(key, '1');
    };

    closeBtn.addEventListener('click', hide);

    el.addEventListener('keydown', e => {
      if (e.key === 'Escape') hide();
    });
  });
}
