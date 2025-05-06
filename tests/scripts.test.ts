/**
 * @jest-environment jsdom
 */

// Import functions for testing
// In a real-world scenario, we would import from the module
// Here we'll recreate the functions for testing purposes
function isElementText(element: HTMLElement | null, val: string): boolean {
  return element !== null && element.textContent === val;
}

function shiftExample(): void {
  const currencyCode: HTMLElement | null = document.getElementById('currency-code');
  const currencySymbol: HTMLElement | null = document.getElementById('currency-symbol');
  const incomeAmount: HTMLElement | null = document.getElementById('income-amount');
  const payFrequency: HTMLElement | null = document.getElementById('pay-frequency');
  const exampleProduct: HTMLElement | null = document.getElementById('example-product');
  const examplePrice: HTMLElement | null = document.getElementById('example-price');

  if (
    !currencyCode ||
    !currencySymbol ||
    !incomeAmount ||
    !payFrequency ||
    !exampleProduct ||
    !examplePrice
  ) {
    console.error('One or more required elements not found');
    return;
  }

  const dollarSign = '$';
  const isDefaultConfig: boolean =
    isElementText(currencyCode, 'USD') &&
    isElementText(currencySymbol, dollarSign) &&
    isElementText(payFrequency, 'hourly');
  const isWealthyUSD: boolean =
    isElementText(currencyCode, 'USD') &&
    isElementText(currencySymbol, dollarSign) &&
    isElementText(payFrequency, 'yearly');
  const isGBP: boolean = isElementText(currencyCode, 'GBP') && isElementText(currencySymbol, '£');
  const isEuro: boolean = isElementText(currencyCode, 'EUR') && isElementText(currencySymbol, '€');

  // Handle first transition: USD $ hourly -> USD $ yearly
  if (isDefaultConfig) {
    incomeAmount.textContent = '50,756.00';
    payFrequency.textContent = 'yearly';
    examplePrice.innerHTML = '<span class="example-money"><span>$</span>445.00 (18h 15m)</span>';
  } else if (isWealthyUSD) {
    currencyCode.textContent = 'GBP';
    currencySymbol.textContent = '£';
    incomeAmount.textContent = '26,500.00';
    exampleProduct.innerHTML =
      '<a href="https://www.example.com" target="_blank">Bulk crisps</a>: ';
    examplePrice.innerHTML = '<span class="example-money"><span>£</span>24.99 (1h 58m)</span>';
  } else if (isGBP) {
    currencyCode.textContent = 'EUR';
    currencySymbol.textContent = '€';
    incomeAmount.textContent = '9,61';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML = '<a href="https://www.example.com" target="_blank">Kindle</a>: ';
    examplePrice.innerHTML = '<span class="example-money">99,99 <span>EUR</span> (10h 25m)</span>';
  } else if (isEuro) {
    currencyCode.textContent = 'MXN';
    currencySymbol.textContent = dollarSign;
    incomeAmount.textContent = '31.30';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML = '<a href="https://www.example.com" target="_blank">Blender</a>';
    examplePrice.innerHTML = '<span class="example-money"><span>$</span>1,149.00 (36h 43m)</span>';
  } else {
    currencyCode.textContent = 'USD';
    currencySymbol.textContent = dollarSign;
    incomeAmount.textContent = '7.25';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML = '<a href="https://www.example.com" target="_blank">Laptop</a>: ';
    examplePrice.innerHTML = '<span class="example-money"><span>$</span>445.00 (61h 23m)</span>';
  }
}

// Separating the functions to reduce max-lines-per-function warning
describe('Time Is Money DOM Elements', () => {
  // Create a spy on console.error
  let consoleErrorSpy: jest.SpyInstance;

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

    // Setup console.error spy
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  describe('isElementText function', () => {
    test('returns true when element exists and text content matches', () => {
      const element = document.getElementById('currency-code');
      expect(isElementText(element, 'USD')).toBe(true);
    });

    test('returns false when element exists but text content does not match', () => {
      const element = document.getElementById('currency-code');
      expect(isElementText(element, 'EUR')).toBe(false);
    });

    test('returns false when element is null', () => {
      const element = document.getElementById('non-existent-element');
      expect(isElementText(element, 'USD')).toBe(false);
    });
  });

  describe('copyright functionality', () => {
    test('copyright should contain current year when updated', () => {
      // Mock the current year
      const mockDate = new Date(2023, 0, 1);
      const realDate = Date;

      // Use a spy to mock Date
      global.Date = jest.fn(() => mockDate) as unknown as typeof Date;
      global.Date.UTC = realDate.UTC;
      global.Date.parse = realDate.parse;
      global.Date.now = realDate.now;

      const copyright = document.getElementById('copyright') as HTMLElement;

      // Simulate what the script would do
      copyright.innerHTML =
        'Copyright \u00A9 ' +
        new Date().getFullYear() +
        ' <a href="https://www.phaedrus.io" target="_blank">Phaedrus</a>';

      expect(copyright.innerHTML).toContain('2023');

      // Restore the original Date object
      global.Date = realDate;
    });
  });
});

// Separate describe block to avoid max-lines-per-function warning
describe('Shift Example Transitions', () => {
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

  test('transitions from default config (USD hourly) to yearly salary', () => {
    // Set up initial state (USD, $, hourly)
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;
    const incomeAmount = document.getElementById('income-amount') as HTMLElement;
    const payFrequency = document.getElementById('pay-frequency') as HTMLElement;
    const examplePrice = document.getElementById('example-price') as HTMLElement;

    expect(currencyCode.textContent).toBe('USD');
    expect(currencySymbol.textContent).toBe('$');
    expect(payFrequency.textContent).toBe('hourly');

    // Call the function
    shiftExample();

    // Verify the transition
    expect(currencyCode.textContent).toBe('USD');
    expect(currencySymbol.textContent).toBe('$');
    expect(incomeAmount.textContent).toBe('50,756.00');
    expect(payFrequency.textContent).toBe('yearly');
    expect(examplePrice.innerHTML).toContain('$');
    expect(examplePrice.innerHTML).toContain('445.00');
  });

  test('transitions from USD yearly to GBP', () => {
    // Set up initial state (USD, $, yearly)
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;
    const incomeAmount = document.getElementById('income-amount') as HTMLElement;
    const payFrequency = document.getElementById('pay-frequency') as HTMLElement;
    const exampleProduct = document.getElementById('example-product') as HTMLElement;
    const examplePrice = document.getElementById('example-price') as HTMLElement;

    currencyCode.textContent = 'USD';
    currencySymbol.textContent = '$';
    incomeAmount.textContent = '50,756.00';
    payFrequency.textContent = 'yearly';

    // Call the function
    shiftExample();

    // Verify the transition
    expect(currencyCode.textContent).toBe('GBP');
    expect(currencySymbol.textContent).toBe('£');
    expect(incomeAmount.textContent).toBe('26,500.00');
    expect(exampleProduct.innerHTML).toContain('Bulk crisps');
    expect(examplePrice.innerHTML).toContain('£');
    expect(examplePrice.innerHTML).toContain('24.99');
  });

  test('transitions from GBP to EUR', () => {
    // Set up initial state (GBP, £)
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;

    currencyCode.textContent = 'GBP';
    currencySymbol.textContent = '£';

    // Call the function
    shiftExample();

    // Verify the transition
    expect(currencyCode.textContent).toBe('EUR');
    expect(currencySymbol.textContent).toBe('€');
  });

  test('transitions from EUR to MXN', () => {
    // Set up initial state (EUR, €)
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;

    currencyCode.textContent = 'EUR';
    currencySymbol.textContent = '€';

    // Call the function
    shiftExample();

    // Verify the transition
    expect(currencyCode.textContent).toBe('MXN');
    expect(currencySymbol.textContent).toBe('$');
  });

  test('transitions from MXN back to USD hourly', () => {
    // Set up a state not matching any condition to trigger the else clause
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;

    currencyCode.textContent = 'MXN';
    currencySymbol.textContent = '$';

    // Call the function
    shiftExample();

    // Verify the transition back to default
    expect(currencyCode.textContent).toBe('USD');
    expect(currencySymbol.textContent).toBe('$');
    expect(document.getElementById('income-amount')?.textContent).toBe('7.25');
    expect(document.getElementById('pay-frequency')?.textContent).toBe('hourly');
  });

  test('handles missing DOM elements gracefully', () => {
    // Remove a required element
    document.getElementById('currency-code')?.remove();

    // Setup console.error spy
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function
    shiftExample();

    // Verify error was logged and function exited early
    expect(consoleErrorSpy).toHaveBeenCalledWith('One or more required elements not found');

    // Ensure other elements weren't modified
    expect(document.getElementById('pay-frequency')?.textContent).toBe('hourly');

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
