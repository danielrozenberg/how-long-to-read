const {estimateReadingTime} = require('../content_scripts/script');

describe('content', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    browser.storage.sync.get.mockReturnValue(Promise.resolve({}));
  });

  test.each([
    [2.5, 500],
    [4.8, 960],
    [0.3, 60],
  ])('estimate %d minutes based on %d "ducks" with default reading speed',
      async (minutes, ducks) => {
        document.body.innerText = new Array(ducks).fill('ducks').join(' ');

        await estimateReadingTime();

        expect(browser.runtime.sendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
              minutes,
              words: ducks,
            }));
      });

  test.each([
    [2.5, 200],
    [5, 100],
  ])('estimate %d minutes based on 500 "ducks" with reading speed of %d',
      async (minutes, wordsPerMinute) => {
        browser.storage.sync.get.mockReturnValue(Promise.resolve({
          wordsPerMinute,
        }));

        document.body.innerText = new Array(500).fill('ducks').join(' ');

        await estimateReadingTime();

        expect(browser.runtime.sendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
              minutes,
              words: 500,
            }));
      });
});
