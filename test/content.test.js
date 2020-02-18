const HTML_TEMPLATE = `<!doctype html>
<html>
<head>
  <title>Super short document</title>
</head>
<body>
  <div>$DIV</div>
</body>
</html>`;

describe('content', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    browser.storage.sync.get.mockReturnValue(Promise.resolve({}));
  });

  test.each([
    [2.5, 5, 100],
    [4.8, 80, 12],
    [0.3, 2, 30],
  ])('estimate %d minutes based on %d paragraphs of %d "ducks"',
      async (minutes, paragraphs, ducks) => {
        const paragraph = `<p>${new Array(ducks).fill('ducks').join(' ')}</p>`;
        const divInner = new Array(paragraphs).fill(paragraph).join('\n');
        document.body.outerHTML = HTML_TEMPLATE.replace('$DIV', divInner);

        const {
          textPromise,
          optionsPromise,
        } = require('../content_scripts/script');
        await expect(textPromise).resolves
            .toEqual(expect.stringContaining('ducks'));
        await expect(optionsPromise).resolves
            .toEqual(expect.objectContaining({}));
        expect(browser.runtime.sendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
              minutes,
              words: paragraphs * ducks,
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

        const paragraph = `<p>${new Array(500).fill('ducks').join(' ')}</p>`;
        document.body.outerHTML = HTML_TEMPLATE.replace('$DIV', paragraph);

        const {
          textPromise,
          optionsPromise,
        } = require('../content_scripts/script');
        await expect(textPromise).resolves;
        await expect(optionsPromise).resolves
            .toEqual(expect.objectContaining({
              wordsPerMinute,
            }));
        expect(browser.runtime.sendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
              minutes,
              words: 500,
            }));
      });
});
