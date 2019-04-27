const BodyExtractor = require('extract-main-text');
const readingTime = require('reading-time');

const estimatePromise = new BodyExtractor(
    {html: document.body.outerHTML},
    {debug: false},
).analyze();

estimatePromise.then((text) => {
  const readingStats = readingTime(text);
  browser.runtime.sendMessage(readingStats);
});

exports.estimatePromise = estimatePromise;
