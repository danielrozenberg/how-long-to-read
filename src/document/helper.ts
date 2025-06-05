export function $(selector: string): HTMLElement {
  const element = document.querySelector(selector);
  if (element instanceof HTMLElement) {
    return element;
  }
  throw new Error(`Element not found for selector: ${selector}`);
}

export function $$<T extends HTMLElement>(selector: string): NodeListOf<T> {
  return document.querySelectorAll<T>(selector);
}
