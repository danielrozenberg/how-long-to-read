import type { Browser, Runtime } from 'webextension-polyfill';
import type { StatsMessage } from './types/messages';

declare const browser: Browser;

/**
 * Rounds a number to its two most significant digits.
 */
function prettyRound(num: number): string {
  const numAsString = String(num);
  const atLeastThreeDigitsMatch = numAsString.match(/(\d{2})(\d)(\d*)/);
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
  return Number(`${roundedPrefix}0${zeroesSuffix}`).toLocaleString();
}

export function backgroundMessageListener(
  stats: StatsMessage,
  sender: Runtime.MessageSender,
) {
  const tabId = sender.tab?.id;
  if (!tabId) {
    console.error('browser.runtime.onMessage received from unknown tab sender');
    return;
  }

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
      text = `${Math.floor(minutes / 60)}h`;
    } else {
      text = `${minutes}m`;
    }
    browser.browserAction.enable(tabId);
  } else {
    title = null;
    text = null;
    browser.browserAction.disable(tabId);
  }

  browser.browserAction.setTitle({ title, tabId });
  browser.browserAction.setBadgeText({ text, tabId });
  browser.browserAction.onClicked.addListener(() => {
    browser.tabs.sendMessage(tabId, 'estimateReadingTime');
  });
}

browser.runtime.onMessage.addListener(backgroundMessageListener);
