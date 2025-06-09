import type { Browser, Permissions } from 'webextension-polyfill';

declare const browser: Browser;

const ALL_HOST_PERMISSION: Permissions.Permissions = {
  origins: ['*://*/*'],
};

export async function hasHostsPermission(): Promise<boolean> {
  return browser.permissions.contains(ALL_HOST_PERMISSION);
}

export async function requestHostsPermission(): Promise<boolean> {
  return browser.permissions.request(ALL_HOST_PERMISSION);
}
