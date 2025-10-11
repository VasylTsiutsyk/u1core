import { CLASSES } from './constants';
import { slideUp, slideDown, dataMediaQueries } from './functions';

export function showMore() {
  const showMoreBlocks = document.querySelectorAll('[data-show-more]');
  if (!showMoreBlocks.length) return;

  let showMoreBlocksRegular = Array.from(showMoreBlocks).filter(
    item => !item.dataset.showmoreMedia
  );

  if (showMoreBlocksRegular.length) initItems(showMoreBlocksRegular);

  document.addEventListener('click', showMoreActions);
  window.addEventListener('resize', showMoreActions);

  const mdQueriesArray = dataMediaQueries(showMoreBlocks, 'showmoreMedia');
  if (mdQueriesArray?.length) {
    mdQueriesArray.forEach(mdItem => {
      mdItem.matchMedia.addEventListener('change', () => {
        initItems(mdItem.itemsArray, mdItem.matchMedia);
      });
    });
    initItemsMedia(mdQueriesArray);
  }

  function initItemsMedia(arr) {
    arr.forEach(mdItem => initItems(mdItem.itemsArray, mdItem.matchMedia));
  }

  function initItems(blocks, mm) {
    blocks.forEach(block => initItem(block, mm));
  }

  function initItem(block, matchMedia = false) {
    block = matchMedia ? block.item : block;

    const content = block.querySelector('[data-show-more-content]');
    const btn = block.querySelector('[data-show-more-btn]');
    if (!content || !btn) return;

    const linesLimit = parseInt(content.dataset.showMoreLines);
    let lineHeight = parseFloat(getComputedStyle(content).lineHeight);
    if (!lineHeight || isNaN(lineHeight)) lineHeight = 24;

    const limitedHeight = !isNaN(linesLimit) ? linesLimit * lineHeight : null;
    const fullHeight = getOriginalHeight(content);

    // Якщо нічого згортати — ховаємо кнопку (і додаємо клас _hidden)
    if (limitedHeight && fullHeight <= limitedHeight + 1) {
      block.classList.add('_hidden');
      btn.hidden = true;
      btn.classList.add('_hidden');
      content.classList.remove('_collapsed'); // показуємо повністю
      return;
    } else {
      // кнопку треба показати
      btn.hidden = false;
      btn.classList.remove('_hidden');
    }

    const isExpanded = block.classList.contains(CLASSES.ACTIVE);
    const targetHeight = isExpanded
      ? fullHeight
      : (limitedHeight ?? getHeight(block, content));

    // Встановлюємо початкову висоту + стан _collapsed
    content.classList.toggle('_collapsed', !isExpanded);
    slideUp(content, 0, targetHeight - 8);
  }

  function getHeight(block, content) {
    let hiddenHeight = 0;
    const type = block.dataset.showMore || 'size';
    const rowGap = parseFloat(getComputedStyle(content).rowGap) || 0;

    if (type === 'items') {
      const count = content.dataset.showMoreContent || 3;
      const items = content.children;
      for (let i = 1; i < items.length; i++) {
        const item = items[i - 1];
        const mt = parseFloat(getComputedStyle(item).marginTop) || 0;
        const mb = parseFloat(getComputedStyle(item).marginBottom) || 0;
        hiddenHeight += item.offsetHeight + mt;
        if (i == count) break;
        hiddenHeight += mb;
      }
      if (rowGap) hiddenHeight += (count - 1) * rowGap;
    } else {
      const height = content.dataset.showMoreContent || 150;
      hiddenHeight = height;
    }

    return hiddenHeight;
  }

  function getOriginalHeight(el) {
    const prevH = el.offsetHeight;
    el.style.removeProperty('height');

    let parentHidden;
    if (el.closest('[hidden]')) {
      parentHidden = el.closest('[hidden]');
      parentHidden.hidden = false;
    }

    const h = el.offsetHeight;

    if (parentHidden) parentHidden.hidden = true;
    el.style.height = `${prevH}px`;
    return h;
  }

  function showMoreActions(e) {
    const target = e.target;
    const type = e.type;

    if (type === 'click' && target.closest('[data-show-more-btn]')) {
      const btn = target.closest('[data-show-more-btn]');
      const block = btn.closest('[data-show-more]');
      const content = block.querySelector('[data-show-more-content]');
      const speed = block.dataset.showMoreSpeed || 500;

      const linesLimit = parseInt(content.dataset.showMoreLines);
      let lineHeight = parseFloat(getComputedStyle(content).lineHeight) || 24;
      const limitedHeight = linesLimit * lineHeight;

      const fullHeight = getOriginalHeight(content);
      const hiddenHeight = limitedHeight;

      if (!content.classList.contains('--slide')) {
        const isExpanded = block.classList.contains('_active');

        if (isExpanded) {
          // Згортаємо
          slideUp(content, speed, hiddenHeight - 8);
          content.classList.add('_collapsed');
        } else {
          // Розгортаємо
          slideDown(content, speed, fullHeight - 8);
          content.classList.remove('_collapsed');
        }

        block.classList.toggle('_active');
        btn.classList.toggle('_active');
      }
    }

    if (type === 'resize') {
      if (showMoreBlocksRegular.length) initItems(showMoreBlocksRegular);
      if (mdQueriesArray?.length) initItemsMedia(mdQueriesArray);
    }
  }
}
