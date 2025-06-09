import {
  hasHostsPermission,
  requestHostsPermission,
} from './common/host-permission';
import { getWordsPerMinute, setWordsPerMinute } from './common/settings';
import { $ } from './document/helper';
import { initializeI18n } from './document/i18n';

import type { Browser } from 'webextension-polyfill';

declare const browser: Browser;

const hostsPermissionSection = $('#host-permission-section');
const grantHostsPermissionButton = $('#grant-hosts-permission');
const settingsSection = $('#settings-section');
const wordsPerMinuteSelector = $('#wordsPerMinute') as HTMLSelectElement;
const settingsCloseButton = $('#close');

async function chooseStep() {
  if (!(await hasHostsPermission())) {
    hostsPermissionSection.inert = false;
    settingsSection.inert = true;
    return;
  }

  hostsPermissionSection.inert = true;
  settingsSection.inert = false;
  await updateSettingsSection();
}

async function updateSettingsSection() {
  const wordsPerMinute = await getWordsPerMinute();
  wordsPerMinuteSelector.value = wordsPerMinute.toFixed(0);
}

[browser.permissions.onRemoved, browser.permissions.onAdded].forEach(
  (onEvent) => {
    onEvent.addListener(async () => {
      await chooseStep();
    });
  },
);

browser.storage.sync.onChanged.addListener(async () => {
  await updateSettingsSection();
});

grantHostsPermissionButton.addEventListener('click', async () => {
  await requestHostsPermission();
});

wordsPerMinuteSelector.addEventListener('change', async () => {
  await setWordsPerMinute(parseInt(wordsPerMinuteSelector.value, 10));
});

settingsCloseButton.addEventListener('click', () => {
  window.close();
});

document.addEventListener('DOMContentLoaded', async () => {
  initializeI18n();
  await Promise.all([updateSettingsSection(), chooseStep()]);
});
