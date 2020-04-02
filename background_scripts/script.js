/**
 * Rounds a number to its two most significant digits.
 * @param {Number} num an integer
 * @return {string} a rounded string representation of num.
 */
function prettyRound(num) {
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

browser.runtime.onMessage.addListener((stats, sender) => {
  const minutes = Math.round(stats.minutes);
  const words = prettyRound(stats.words);

  let titleText;
  let badgeText;

  if (minutes >= 1) {
    titleText = `Estimated based on ~${words} words\n` +
        '(Click to refresh estimate)';
    if (minutes >= 600) {
      badgeText = '10h+';
    } else if (minutes > 90) {
      badgeText = `${Math.floor(minutes / 60)}h`;
    } else {
      badgeText = `${minutes}m`;
    }
    browser.browserAction.enable(sender.tab.id);
  } else {
    titleText = null;
    badgeText = null;
    browser.browserAction.disable(sender.tab.id);
  }

  browser.browserAction.setTitle({
    title: titleText,
    tabId: sender.tab.id,
  });
  browser.browserAction.setBadgeText({
    text: badgeText,
    tabId: sender.tab.id,
  });
  browser.browserAction.onClicked.addListener(() => {
    browser.tabs.sendMessage(sender.tab.id, 'estimateReadingTime');
  });
});
