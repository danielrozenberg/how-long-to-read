import type { Browser, Runtime } from 'webextension-polyfill';
import type { StatsMessage } from './types/messages';

declare const browser: Browser;

/**
 * Rounds a number to its two most significant digits.
 */
function prettyRound(num: number): string {
  const numAsString = String(num);
  const atLeastThreeDigitsMatch = /(\d{2})(\d)(\d*)/.exec(numAsString);
  if (!atLeastThreeDigitsMatch) {
    // Less than 3 digits, just return it as-is.
    return numAsString;
  }

  const [, prefix, thirdDigit, suffix] = atLeastThreeDigitsMatch;
  const zeroesSuffix = suffix.replace(/\d/g, '0');
  if (/[0-4]/.test(thirdDigit)) {
    // The third digit is less than 5, so round down.
    return Number(`${prefix}0${zeroesSuffix}`).toLocaleString();
  }

  // The third digit is 5 or higher, so round up.
  const roundedPrefix = Number(prefix) + 1;
  return Number(`${roundedPrefix.toFixed(0)}0${zeroesSuffix}`).toLocaleString();
}

export async function backgroundMessageListener(
  message: unknown,
  sender: Runtime.MessageSender,
) {
  const tabId = sender.tab?.id;
  if (!tabId) {
    console.error(
      '[browser.runtime.onMessage] received from unknown tab sender',
    );
    return;
  }

  if (typeof message !== 'object' || message === null) {
    console.error('[browser.runtime.onMessage] received non-object message');
    return;
  }

  if (!('words' in message) || !('minutes' in message)) {
    console.error(
      '[browser.runtime.onMessage] received message without words or minutes',
    );
    return;
  }

  const stats = message as StatsMessage;
  const minutes = Math.round(stats.minutes);
  const words = prettyRound(stats.words);

  let title: string | null;
  let text: string | null;

  if (minutes >= 1) {
    title =
      `Estimated based on ~${words} words\n` + '(Click to refresh estimate)';
    if (minutes >= 600) {
      text = '10h+';
    } else if (minutes > 90) {
      text = `${Math.floor(minutes / 60).toFixed(0)}h`;
    } else {
      text = `${minutes.toFixed(0)}m`;
    }
    await browser.action.enable(tabId);
  } else {
    title = null;
    text = null;
    await browser.action.disable(tabId);
  }

  await browser.action.setTitle({ title, tabId });
  await browser.action.setBadgeText({ text, tabId });
  browser.action.onClicked.addListener(async () => {
    await browser.tabs.sendMessage(tabId, 'estimateReadingTime');
  });
}

browser.runtime.onMessage.addListener(backgroundMessageListener);
