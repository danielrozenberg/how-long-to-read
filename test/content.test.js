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
  });

  test.each([
    [2.5, 5, 100],
    [4.8, 80, 12],
    [0.3, 2, 30],
  ])('estimate %d minutes based on %d paragraphs of %d "ducks"',
      (minutes, paragraphs, ducks, done) => {
        const paragraph = `<p>${new Array(ducks).fill('ducks').join(' ')}</p>`;
        const divInner = new Array(paragraphs).fill(paragraph).join('\n');
        document.body.outerHTML = HTML_TEMPLATE.replace('$DIV', divInner);

        const {textPromise} = require('../content_scripts/script');
        textPromise.then(() => {
          expect(browser.runtime.sendMessage).toHaveBeenCalledWith(
              expect.objectContaining({
                minutes,
                words: paragraphs * ducks,
              }));
          done();
        });
      });
});
