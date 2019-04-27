describe('background', () => {
  const sender = {tab: {id: 123}};
  let backgroundMessageListener;

  beforeAll(() => {
    browser.runtime.onMessage.addListener.mockImplementation(
        (listener) => backgroundMessageListener = listener);

    require('../background_scripts/script');
  });

  test.each([
    ['1m', 0.6],
    ['12m', 12.43],
    ['1h', 59.5],
    ['1h', 119],
    ['2h', 120],
    ['10h+', 600],
  ])('show an estimate of %s based on %d minutes', (text, minutes) => {
    backgroundMessageListener({minutes, words: 50}, sender);
    expect(browser.browserAction.enable).toHaveBeenCalledWith(sender.tab.id);
    expect(browser.browserAction.setTitle).toHaveBeenCalledWith({
      title: 'Estimated based on ~50 words',
      tabId: sender.tab.id,
    });
    expect(browser.browserAction.setBadgeText).toHaveBeenCalledWith({
      text,
      tabId: sender.tab.id,
    });
  });

  test('hide the estimate when the text too short', () => {
    backgroundMessageListener({minutes: 0.4, words: 50}, sender);
    expect(browser.browserAction.disable).toHaveBeenCalledWith(sender.tab.id);
    expect(browser.browserAction.setTitle).toHaveBeenCalledWith({
      title: null,
      tabId: sender.tab.id,
    });
    expect(browser.browserAction.setBadgeText).toHaveBeenCalledWith({
      text: null,
      tabId: sender.tab.id,
    });
  });
});
