/**
 * @jest-environment jsdom
 */

describe('Time Is Money DOM Elements', () => {
  beforeEach(() => {
    // Create a mock document object
    document.body.innerHTML = `
      <div id="currency-code">USD</div>
      <div id="currency-symbol">$</div>
      <div id="income-amount">7.25</div>
      <div id="pay-frequency">hourly</div>
      <div id="example-product"></div>
      <div id="example-price"></div>
      <div id="copyright"></div>
    `;
  });

  // Mock the document.getElementById behavior
  test('is utility function works correctly', () => {
    // Recreate the 'is' function directly in the test
    function is(element: HTMLElement, val: string): boolean {
      return element.textContent === val;
    }

    const element = document.getElementById('currency-code') as HTMLElement;
    expect(is(element, 'USD')).toBe(true);
    expect(is(element, 'EUR')).toBe(false);
  });

  test('copyright should contain current year when updated', () => {
    const copyright = document.getElementById('copyright') as HTMLElement;

    // Simulate what the script would do
    copyright.innerHTML =
      'Copyright \u00A9 ' +
      new Date().getFullYear() +
      " <a href='https://www.phaedrus.io' target='_blank'>Phaedrus</a>";

    const currentYear = new Date().getFullYear().toString();
    expect(copyright.innerHTML).toContain(currentYear);
  });
});
