import type { Browser, Runtime } from 'webextension-polyfill';
import { backgroundMessageListener } from '../src/background';

declare const browser: jest.MockedObjectDeep<Browser>;

describe('background', () => {
  const sender = { tab: { id: 123 } } as Partial<Runtime.MessageSender>;

  test.each([
    ['1m', 0.6],
    ['12m', 12.43],
    ['60m', 59.5],
    ['90m', 90.2],
    ['1h', 90.6],
    ['2h', 120],
    ['10h+', 600],
  ])('show an estimate of %s based on %d minutes', (text, minutes) => {
    backgroundMessageListener({ minutes, words: 50 }, sender);
    expect(browser.browserAction.enable).toHaveBeenCalledWith(sender.tab?.id);
    expect(browser.browserAction.setTitle).toHaveBeenCalledWith({
      title: 'Estimated based on ~50 words\n(Click to refresh estimate)',
      tabId: sender.tab?.id,
    });
    expect(browser.browserAction.setBadgeText).toHaveBeenCalledWith({
      text,
      tabId: sender.tab?.id,
    });
  });

  test('hide the estimate when the text too short', () => {
    backgroundMessageListener({ minutes: 0.4, words: 50 }, sender);
    expect(browser.browserAction.disable).toHaveBeenCalledWith(sender.tab?.id);
    expect(browser.browserAction.setTitle).toHaveBeenCalledWith({
      title: null,
      tabId: sender.tab?.id,
    });
    expect(browser.browserAction.setBadgeText).toHaveBeenCalledWith({
      text: null,
      tabId: sender.tab?.id,
    });
  });
});
