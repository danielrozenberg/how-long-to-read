import { $ } from './document/helper';
import { initializeI18n } from './document/i18n';

import type { Browser } from 'webextension-polyfill';

declare const browser: Browser;

const wordsPerMinuteElement = $('#wordsPerMinute') as HTMLSelectElement;

wordsPerMinuteElement.addEventListener('change', async () => {
  await browser.storage.sync.set({
    wordsPerMinute: Number(wordsPerMinuteElement.value),
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  initializeI18n();

  const { wordsPerMinute } = (await browser.storage.sync.get({
    wordsPerMinute: 200,
  })) as Record<string, number>;
  wordsPerMinuteElement.value = wordsPerMinute.toFixed(0);
});
