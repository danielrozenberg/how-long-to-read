const readingTime = require('reading-time');

const optionsPromise = browser.storage.sync.get('wordsPerMinute');

optionsPromise.then((options) => {
  const text = Array.from(document.querySelectorAll('p'))
      .map((p) => p.textContent)
      .join(' ');
  const readingStats = readingTime(text, options);
  browser.runtime.sendMessage(readingStats);
});

exports.optionsPromise = optionsPromise;
