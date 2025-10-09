const STATE_TYPES = {
  content: 'content',
  media: 'media',
};

function initProjectTypeCard(card) {
  const btn = card.querySelector('[data-project-type-toggle]');

  btn.addEventListener('click', () => {
    const showContent = card.dataset.state !== STATE_TYPES.content;
    card.dataset.state = showContent ? STATE_TYPES.content : STATE_TYPES.media;
    btn.setAttribute('aria-expanded', String(showContent));
  });
}

export default function initProjectTypeCards(root = document) {
  root.querySelectorAll('[data-project-type]').forEach(initProjectTypeCard);
}
