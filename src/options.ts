import { getWordsPerMinute, setWordsPerMinute } from './common/settings';
import { $ } from './document/helper';
import { initializeI18n } from './document/i18n';

import type { Browser } from 'webextension-polyfill';

declare const browser: Browser;

const wordsPerMinuteSelector = $('#wordsPerMinute') as HTMLSelectElement;

async function updateSettingsSection() {
  const wordsPerMinute = await getWordsPerMinute();
  wordsPerMinuteSelector.value = wordsPerMinute.toFixed(0);
}

browser.storage.sync.onChanged.addListener(async () => {
  await updateSettingsSection();
});

wordsPerMinuteSelector.addEventListener('change', async () => {
  await setWordsPerMinute(parseInt(wordsPerMinuteSelector.value, 10));
});

document.addEventListener('DOMContentLoaded', async () => {
  initializeI18n();
  await updateSettingsSection();
});
