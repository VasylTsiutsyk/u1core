// js/modules/copyright

// ======================== Copyright ======================== //
// HTML: s-copyright

function initCopyright() {
  const copyrightEl = document.querySelector('[data-copyright]');
  if (!copyrightEl) return;

  const year = new Date().getFullYear();
  copyrightEl.innerText = year;
}

export default initCopyright;
