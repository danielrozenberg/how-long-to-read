const wordsPerMinuteElement =document.getElementById('wordsPerMinute');

wordsPerMinuteElement.addEventListener('change', async (event) => {
  await browser.storage.sync.set({
    wordsPerMinute: event.target.value,
  });
});

browser.storage.sync.get().then((options) => {
  if (options.wordsPerMinute) {
    wordsPerMinuteElement.value = options.wordsPerMinute;
  } else {
    // Default value from the reading-time library.
    wordsPerMinuteElement.value = '200';
  }
});
