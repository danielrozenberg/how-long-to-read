import type { Browser } from 'webextension-polyfill';

declare const browser: Browser;

export async function getWordsPerMinute(): Promise<number> {
  const { wordsPerMinute } = (await browser.storage.sync.get({
    wordsPerMinute: 200,
  })) as Record<string, number>;
  return wordsPerMinute;
}

export async function setWordsPerMinute(wordsPerMinute: number): Promise<void> {
  await browser.storage.sync.set({ wordsPerMinute });
}
