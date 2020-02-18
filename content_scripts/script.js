const BodyExtractor = require('extract-main-text');
const readingTime = require('reading-time');

const textPromise = new BodyExtractor(
    {html: document.body.outerHTML},
    {debug: false}).analyze();

const optionsPromise = browser.storage.sync.get('wordsPerMinute');

Promise.all([textPromise, optionsPromise]).then((results) => {
  const [text, options] = results;
  const readingStats = readingTime(text, options);
  browser.runtime.sendMessage(readingStats);
});

exports.textPromise = textPromise;
exports.optionsPromise = optionsPromise;
