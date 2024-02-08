import type { Browser } from 'webextension-polyfill';

declare const browser: Browser;

const wordsPerMinuteElement = document.getElementById(
  'wordsPerMinute',
) as HTMLSelectElement;

wordsPerMinuteElement.addEventListener('change', async () => {
  await browser.storage.sync.set({
    wordsPerMinute: Number(wordsPerMinuteElement.value),
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const { wordsPerMinute } = await browser.storage.sync.get({
    wordsPerMinute: 200,
  });
  wordsPerMinuteElement.value = wordsPerMinute;
});
