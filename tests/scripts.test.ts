/**
 * @jest-environment jsdom
 */

// Import functions from scripts.ts for testing
import {
  isElementText,
  shiftExample,
  getCopyrightText,
  applyCopyrightText,
  startExampleInterval,
} from '../scripts';

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

  describe('getCopyrightText function', () => {
    test('returns correct copyright text for a given year', () => {
      expect(getCopyrightText(2023)).toContain('Copyright © 2023');
      expect(getCopyrightText(2023)).toContain('<a href="https://www.phaedrus.io"');
      expect(getCopyrightText(2024)).toContain('2024');
      expect(getCopyrightText(1999)).toContain('1999');
    });
  });

  describe('applyCopyrightText function', () => {
    test('applies copyright text with current year to the DOM', () => {
      // Mock the current year
      const mockDate = new Date(2023, 0, 1);
      const realDate = Date;

      // Use a spy to mock Date
      global.Date = jest.fn(() => mockDate) as unknown as typeof Date;
      global.Date.UTC = realDate.UTC;
      global.Date.parse = realDate.parse;
      global.Date.now = realDate.now;

      // Get the copyright element before calling the function
      const copyright = document.getElementById('copyright') as HTMLElement;
      expect(copyright.innerHTML).toBe('');

      // Call the function being tested
      applyCopyrightText();

      // Verify it contains the expected content
      expect(copyright.innerHTML).toContain('Copyright © 2023');
      expect(copyright.innerHTML).toContain('Phaedrus');

      // Restore the original Date object
      global.Date = realDate;
    });

    test('does nothing when copyright element does not exist', () => {
      // Remove the copyright element
      document.getElementById('copyright')?.remove();

      // This should not throw an error
      expect(() => applyCopyrightText()).not.toThrow();
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

// Add tests for interval functionality
describe('Interval Timer', () => {
  beforeEach(() => {
    // Use fake timers
    jest.useFakeTimers();

    // Create a mock document body for DOM manipulation
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

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers();
  });

  describe('startExampleInterval function', () => {
    test('calls setInterval with shiftExample and 4000ms delay', () => {
      // Create a spy on global.setInterval
      const setIntervalSpy = jest.spyOn(global, 'setInterval');

      // Call the function
      startExampleInterval();

      // Verify setInterval was called with the correct arguments
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      expect(setIntervalSpy).toHaveBeenCalledWith(shiftExample, 4000);

      // Clean up spy
      setIntervalSpy.mockRestore();
    });

    test('timer uses the correct interval value of 4000ms', () => {
      // Mock setInterval to capture and check the delay value
      jest.spyOn(global, 'setInterval');

      // Call the function
      startExampleInterval();

      // Verify setInterval was called with the correct delay
      expect(global.setInterval).toHaveBeenCalledWith(expect.any(Function), 4000);

      // This test is specifically designed to fail if the interval value changes,
      // which is used for verification in the task requirements
    });
  });
});
