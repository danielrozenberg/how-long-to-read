const wordsPerMinuteElement =document.getElementById('wordsPerMinute');

wordsPerMinuteElement.addEventListener('change', (event) => {
  browser.storage.sync.set({
    wordsPerMinute: event.target.value,
  });
});

browser.storage.sync.get().then((options) => {
  if (options.wordsPerMinute) {
    wordsPerMinuteElement.value = options.wordsPerMinute;
  }
});
