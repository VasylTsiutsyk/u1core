// js/modules/modal.js

// ===== MODAL ===== //
import { SELECTORS } from './constants';

class Modal {
  constructor(options) {
    const defaultOptions = {
      isOpen: () => {},
      isClose: () => {},
    };

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.modal = document.querySelector('.modal');
    this.speed = false;
    this.animation = false;
    this.isOpen = false;
    this.modalContainer = false;
    this.previousActiveElement = false;
    this.fixBlocks = document.querySelectorAll('.fix-block');
    this.focusElements = [
      'a[href]',
      'input',
      'button',
      'select',
      'textarea',
      '[tabindex]',
    ];
    this.events();
  }

  events() {
    if (this.modal) {
      document.addEventListener('click', e => {
        const clickedElement = e.target.closest('[data-modal-target]');
        if (clickedElement) {
          const target = clickedElement.dataset.modalTarget;
          const animation = clickedElement.dataset.modalAnimation;
          const speed = clickedElement.dataset.modalSpeed;
          this.animation = animation || 'modal-fade';
          this.speed = speed ? parseInt(speed, 10) : 300;
          this.modalContainer = document.querySelector(
            `[data-modal-id="${target}"]`
          );
          this.open();
          return;
        }

        if (
          e.target.closest('.modal__close') ||
          e.target.closest('[data-modal-close]')
        ) {
          this.close();
        }
      });

      window.addEventListener('keydown', e => {
        if (e.keyCode === 27) {
          if (this.isOpen) {
            this.close();
          }
        }

        if (e.keyCode === 9 && this.isOpen) {
          this.focusCatch(e);
        }
      });

      this.modal.addEventListener('click', e => {
        if (
          !e.target.classList.contains('modal__container') &&
          !e.target.closest('.modal__container') &&
          this.isOpen
        ) {
          this.close();
        }
      });
    }
  }

  open() {
    this.previousActiveElement = document.activeElement;
    this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
    this.modal.classList.add('is-open');
    this.disableScroll();

    this.modalContainer.classList.add('modal-open');
    this.modalContainer.classList.add(this.animation);

    setTimeout(() => {
      this.options.isOpen(this);
      this.modalContainer.classList.add('animate-open');
      this.isOpen = true;
      this.focusTrap();
    }, this.speed);
  }

  show(target = null, animation = 'modal-fade', speed = 300) {
    if (target) {
      this.animation = animation;
      this.speed = parseInt(speed, 10);

      this.modalContainer = document.querySelector(
        `[data-modal-id="${target}"]`
      );

      this.open();
    }
  }

  close() {
    if (this.modalContainer) {
      this.modalContainer.classList.remove('animate-open');
      this.modalContainer.classList.remove(this.animation);
      this.modal.classList.remove('is-open');
      this.modalContainer.classList.remove('modal-open');

      this.enableScroll();
      this.options.isClose(this);
      this.isOpen = false;
      this.focusTrap();
    }
  }

  focusCatch(e) {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);

    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }

    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }

  focusTrap() {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);

    if (this.isOpen) {
      focusable[0].focus();
    } else {
      this.previousActiveElement.focus();
    }
  }

  disableScroll() {
    const pagePosition = window.scrollY;
    this.lockPadding();
    SELECTORS.BODY.classList.add('disable-scroll');
    SELECTORS.BODY.dataset.position = pagePosition;
    SELECTORS.BODY.style.top = `${-pagePosition}px`;
  }

  enableScroll() {
    const pagePosition = parseInt(SELECTORS.BODY.dataset.position, 10);
    this.unlockPadding();
    SELECTORS.BODY.style.top = 'auto';
    SELECTORS.BODY.classList.remove('disable-scroll');
    window.scroll({ top: pagePosition, left: 0 });
    SELECTORS.BODY.removeAttribute('data-position');
  }

  lockPadding() {
    const paddingOffset = `${window.innerWidth - SELECTORS.BODY.offsetWidth}px`;

    this.fixBlocks.forEach(el => {
      el.style.paddingRight = paddingOffset;
    });

    SELECTORS.BODY.style.paddingRight = paddingOffset;
  }

  unlockPadding() {
    this.fixBlocks.forEach(el => {
      el.style.paddingRight = '0';
    });

    SELECTORS.BODY.style.paddingRight = '0';
  }
}

export default Modal;
