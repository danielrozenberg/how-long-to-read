import { $$ } from './helper';

import type { Browser } from 'webextension-polyfill';

declare const browser: Browser;

export function initializeI18n() {
  const translatableElements = $$('[data-i18n-id]');
  translatableElements.forEach((element) => {
    element.textContent = browser.i18n.getMessage(
      element.getAttribute('data-i18n-id') ?? '',
    );
  });
}
