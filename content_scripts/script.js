const BodyExtractor = require('extract-main-text');
const readingTime = require('reading-time');

const textPromise = new BodyExtractor(
    {html: document.body.outerHTML},
    {debug: false}
).analyze();

textPromise.then((text) => {
  const readingStats = readingTime(text);
  browser.runtime.sendMessage(readingStats);
});

exports.textPromise = textPromise;
