import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { backgroundMessageListener } from '../src/background';

import type { Browser, Runtime } from 'webextension-polyfill';

declare const browser: jest.MockedObject<Browser>;

describe('background', () => {
  const sender = { tab: { id: 123 } } as Partial<Runtime.MessageSender>;

  beforeAll(() => {
    // TODO: this is a workaround for the missing `browser.action` mock in `jest-webextension-mock`.
    // Remove this when fixed: https://github.com/RickyMarou/jest-webextension-mock/issues/4
    browser.action = browser.browserAction;
  });

  it.each([
    ['1m', 0.6],
    ['12m', 12.43],
    ['60m', 59.5],
    ['90m', 90.2],
    ['1h', 90.6],
    ['2h', 120],
    ['10h+', 600],
  ])('show an estimate of %s based on %d minutes', async (text, minutes) => {
    await backgroundMessageListener({ minutes, words: 50 }, sender);

    expect(browser.action.enable).toHaveBeenCalledWith(sender.tab?.id);
    expect(browser.action.setTitle).toHaveBeenCalledWith({
      title: 'Estimated based on ~50 words\n(Click to refresh estimate)',
      tabId: sender.tab?.id,
    });
    expect(browser.action.setBadgeText).toHaveBeenCalledWith({
      text,
      tabId: sender.tab?.id,
    });
  });

  it('hide the estimate when the text too short', async () => {
    await backgroundMessageListener({ minutes: 0.4, words: 50 }, sender);

    expect(browser.action.disable).toHaveBeenCalledWith(sender.tab?.id);
    expect(browser.action.setTitle).toHaveBeenCalledWith({
      title: null,
      tabId: sender.tab?.id,
    });
    expect(browser.action.setBadgeText).toHaveBeenCalledWith({
      text: null,
      tabId: sender.tab?.id,
    });
  });
});
