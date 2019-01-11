const BodyExtractor = require('extract-main-text');
const readingTime = require('reading-time');

new BodyExtractor(
  {html: document.body.outerHTML},
  {debug: false}).analyze().then(text => {
    const readingStats = readingTime(text);
    browser.runtime.sendMessage(readingStats);
  });
