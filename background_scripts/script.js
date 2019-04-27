browser.runtime.onMessage.addListener((readingStats, sender) => {
  const minutes = Math.round(readingStats.minutes);
  const words = readingStats.words;

  let titleText;
  let badgeText;

  if (minutes >= 1) {
    titleText = `Estimated based on ~${words} words`;
    if (minutes >= 600) {
      badgeText = '10h+';
    } else if (minutes >= 60) {
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
});
