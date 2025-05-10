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
  initializeApplication,
  findCurrentStateIndex,
  applyState,
  currencyStates,
  EXAMPLE_CYCLE_INTERVAL_MS,
  calculateNextStateIndex,
  _resetStateForTesting,
  isValidHttpUrl,
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

// Pure logic unit tests that don't require jsdom
describe('URL and State Index Logic', () => {
  beforeEach(() => {
    _resetStateForTesting();
  });

  describe('isValidHttpUrl function', () => {
    test('validates correct HTTP and HTTPS URLs', () => {
      // Valid URLs
      expect(isValidHttpUrl('https://example.com')).toBe(true);
      expect(isValidHttpUrl('http://example.com')).toBe(true);
      expect(isValidHttpUrl('https://sub.example.com/path?query=param#hash')).toBe(true);
      expect(isValidHttpUrl('http://localhost:3000')).toBe(true);
      expect(isValidHttpUrl('https://142.251.32.110')).toBe(true);
    });

    test('rejects invalid or non-HTTP URLs', () => {
      // Invalid or malformed URLs
      expect(isValidHttpUrl('')).toBe(false);
      expect(isValidHttpUrl('not a url')).toBe(false);
      expect(isValidHttpUrl('example.com')).toBe(false); // Missing protocol

      // Non-HTTP protocols
      expect(isValidHttpUrl('ftp://example.com')).toBe(false);
      expect(isValidHttpUrl('file:///path/to/file')).toBe(false);
      expect(isValidHttpUrl('javascript:alert("XSS")')).toBe(false); // Important XSS vector
      expect(isValidHttpUrl('data:text/html,<script>alert("XSS")</script>')).toBe(false); // Another XSS vector
    });
  });

  describe('calculateNextStateIndex function', () => {
    test('returns correct next index', () => {
      // Test from first state
      expect(calculateNextStateIndex(0, currencyStates.length)).toBe(1);

      // Test from middle state
      expect(calculateNextStateIndex(2, currencyStates.length)).toBe(3);
    });

    test('wraps around at the end of the array', () => {
      // Set to last state
      const lastIndex = currencyStates.length - 1;
      // Should wrap around to 0
      expect(calculateNextStateIndex(lastIndex, currencyStates.length)).toBe(0);
    });

    test('handles edge cases', () => {
      // Negative index (should still work, though not expected in real usage)
      expect(calculateNextStateIndex(-1, currencyStates.length)).toBe(0);

      // Zero total states (edge case)
      expect(calculateNextStateIndex(0, 0)).toBeNaN(); // Division by zero results in NaN

      // Very large index
      expect(calculateNextStateIndex(1000, 5)).toBe(1); // 1000 + 1 = 1001, 1001 % 5 = 1
    });
  });

  test('state cycling covers all states in sequence', () => {
    // Start from beginning
    let currentIndex = 0;

    // Track the sequence of indices we get
    const sequence: number[] = [];

    // Cycle through one complete revolution
    for (let i = 0; i < currencyStates.length; i++) {
      const nextIndex = calculateNextStateIndex(currentIndex, currencyStates.length);
      sequence.push(nextIndex);
      currentIndex = nextIndex;
    }

    // Check that we hit all indices in sequence
    expect(sequence).toEqual([1, 2, 3, 4, 0]);

    // And we're back at the start
    expect(currentIndex).toBe(0);
  });
});

// Tests for getNextState function
describe('GetNextState Pure Logic', () => {
  beforeEach(() => {
    // Reset state before each test
    _resetStateForTesting();
  });

  test('returns the next currency state in sequence', () => {
    // We can't directly test getNextState (non-exported), so we test shiftExample which uses it
    // Reset state to ensure we're at the beginning
    _resetStateForTesting();

    const elements = {
      currencyCode: document.getElementById('currency-code') as HTMLElement,
      currencySymbol: document.getElementById('currency-symbol') as HTMLElement,
      incomeAmount: document.getElementById('income-amount') as HTMLElement,
      payFrequency: document.getElementById('pay-frequency') as HTMLElement,
    };

    // Properly set up the DOM to match the starting state
    elements.currencyCode.textContent = currencyStates[0].currencyCode;
    elements.currencySymbol.textContent = currencyStates[0].currencySymbol;
    elements.incomeAmount.textContent = currencyStates[0].incomeAmount;
    elements.payFrequency.textContent = currencyStates[0].payFrequency;

    // Verify initial state (USD hourly)
    expect(elements.currencyCode.textContent).toBe('USD');
    expect(elements.payFrequency.textContent).toBe('hourly');

    // Call shiftExample to trigger getNextState
    shiftExample();

    // Should now be USD yearly
    expect(elements.currencyCode.textContent).toBe('USD');
    expect(elements.payFrequency.textContent).toBe('yearly');

    // Call again
    shiftExample();

    // Should now be GBP
    expect(elements.currencyCode.textContent).toBe('GBP');

    // Reset state and rebuild the DOM to match initial state
    _resetStateForTesting();

    // Reset the DOM elements to match initial state
    elements.currencyCode.textContent = currencyStates[0].currencyCode;
    elements.payFrequency.textContent = currencyStates[0].payFrequency;

    // Verify we're back to USD hourly
    expect(elements.currencyCode.textContent).toBe('USD');
    expect(elements.payFrequency.textContent).toBe('hourly');
  });

  test('cycles through all states in order', () => {
    // Track the sequence of currency codes we observe
    const expectedSequence = currencyStates
      .slice(1) // Start from index 1
      .concat(currencyStates.slice(0, 1)) // Add index 0 at the end
      .map((state) => state.currencyCode);

    const actualSequence: string[] = [];
    const currencyCodeElement = document.getElementById('currency-code') as HTMLElement;

    // Cycle through all states
    for (let i = 0; i < currencyStates.length; i++) {
      shiftExample();
      const textContent = currencyCodeElement.textContent;
      actualSequence.push(textContent !== null ? textContent : '');
    }

    // Verify the sequence matches our expectations
    expect(actualSequence).toEqual(expectedSequence);
  });

  test('returns to initial state after a complete cycle', () => {
    // Get initial state
    const initialState = currencyStates[0];
    const currencyCodeElement = document.getElementById('currency-code') as HTMLElement;
    const payFrequencyElement = document.getElementById('pay-frequency') as HTMLElement;

    // Verify initial state
    expect(currencyCodeElement.textContent).toBe(initialState.currencyCode);
    expect(payFrequencyElement.textContent).toBe(initialState.payFrequency);

    // Cycle through all states
    for (let i = 0; i < currencyStates.length; i++) {
      shiftExample();
    }

    // Should be back at the initial state
    expect(currencyCodeElement.textContent).toBe(initialState.currencyCode);
    expect(payFrequencyElement.textContent).toBe(initialState.payFrequency);
  });
});

// Separate describe block to avoid max-lines-per-function warning
describe('Shift Example Transitions', () => {
  beforeEach(() => {
    // Reset the state to ensure test isolation
    _resetStateForTesting();

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

  // Helper function to set internal state via DOM to match a specific index
  function setupStateForIndex(index: number): void {
    const state = currencyStates[index];
    // Set DOM elements to match the state at the given index
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;
    const incomeAmount = document.getElementById('income-amount') as HTMLElement;
    const payFrequency = document.getElementById('pay-frequency') as HTMLElement;

    currencyCode.textContent = state.currencyCode;
    currencySymbol.textContent = state.currencySymbol;
    incomeAmount.textContent = state.incomeAmount;
    payFrequency.textContent = state.payFrequency;

    // Also need to reset the internal state to match the index
    _resetStateForTesting();
    // Since currentDisplayStateIndex is internal and starts at 0,
    // we need to advance it to match our test setup
    for (let i = 0; i < index; i++) {
      shiftExample();
    }
  }

  test('transitions from default config (USD hourly) to yearly salary', () => {
    // Set up initial state (USD hourly) - index 0
    setupStateForIndex(0);

    // Get DOM elements for verification
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;
    const incomeAmount = document.getElementById('income-amount') as HTMLElement;
    const payFrequency = document.getElementById('pay-frequency') as HTMLElement;
    const examplePrice = document.getElementById('example-price') as HTMLElement;

    // Verify initial state
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
    // Set up initial state (USD yearly) - index 1
    setupStateForIndex(1);

    // Get DOM elements for verification
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;
    const incomeAmount = document.getElementById('income-amount') as HTMLElement;
    const exampleProduct = document.getElementById('example-product') as HTMLElement;
    const examplePrice = document.getElementById('example-price') as HTMLElement;

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
    // Set up initial state (GBP) - index 2
    setupStateForIndex(2);

    // Get DOM elements for verification
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;

    // Call the function
    shiftExample();

    // Verify the transition
    expect(currencyCode.textContent).toBe('EUR');
    expect(currencySymbol.textContent).toBe('€');
  });

  test('transitions from EUR to MXN', () => {
    // Set up initial state (EUR) - index 3
    setupStateForIndex(3);

    // Get DOM elements for verification
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;

    // Call the function
    shiftExample();

    // Verify the transition
    expect(currencyCode.textContent).toBe('MXN');
    expect(currencySymbol.textContent).toBe('$');
  });

  test('transitions from MXN back to USD hourly', () => {
    // Set up initial state (MXN) - index 4
    setupStateForIndex(4);

    // Get DOM elements for verification
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;

    // Call the function
    shiftExample();

    // Verify the transition back to default
    expect(currencyCode.textContent).toBe('USD');
    expect(currencySymbol.textContent).toBe('$');
    expect(document.getElementById('income-amount')?.textContent).toBe('7.25');
    expect(document.getElementById('pay-frequency')?.textContent).toBe('hourly');
  });

  test('throws error when DOM elements are missing', () => {
    // Remove a required element
    document.getElementById('currency-code')?.remove();

    // Call the function and expect it to throw
    expect(() => shiftExample()).toThrow(
      'Initialization failed: One or more required DOM elements not found',
    );

    // Ensure other elements weren't modified
    expect(document.getElementById('pay-frequency')?.textContent).toBe('hourly');
  });
});

// Tests for the new data-driven implementation
describe('Data-Driven ShiftExample Implementation', () => {
  beforeEach(() => {
    // Reset the state to ensure test isolation
    _resetStateForTesting();

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

  test('currencyStates array contains all expected states', () => {
    // Verify that our data-driven approach has all required states
    expect(currencyStates).toBeDefined();
    expect(currencyStates.length).toBe(5);

    // Check for specific state properties
    const usdHourlyState = currencyStates[0];
    expect(usdHourlyState.currencyCode).toBe('USD');
    expect(usdHourlyState.payFrequency).toBe('hourly');

    // Check specific state transitions
    expect(currencyStates[1].currencyCode).toBe('USD');
    expect(currencyStates[1].payFrequency).toBe('yearly');
    expect(currencyStates[2].currencyCode).toBe('GBP');
    expect(currencyStates[3].currencyCode).toBe('EUR');
    expect(currencyStates[4].currencyCode).toBe('MXN');
  });

  test('findCurrentStateIndex returns correct index for matching state', () => {
    // Get DOM elements
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;
    const payFrequency = document.getElementById('pay-frequency') as HTMLElement;

    // Test default index (0 for USD hourly)
    expect(findCurrentStateIndex(currencyCode, currencySymbol, payFrequency)).toBe(0);

    // Test with changed DOM
    currencyCode.textContent = 'GBP';
    currencySymbol.textContent = '£';
    payFrequency.textContent = 'yearly';
    expect(findCurrentStateIndex(currencyCode, currencySymbol, payFrequency)).toBe(2);

    // Test non-matching state
    currencyCode.textContent = 'JPY'; // Not in our states
    expect(findCurrentStateIndex(currencyCode, currencySymbol, payFrequency)).toBe(-1);
  });

  test('applyState correctly updates DOM with state data', () => {
    // Get DOM elements
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;
    const incomeAmount = document.getElementById('income-amount') as HTMLElement;
    const payFrequency = document.getElementById('pay-frequency') as HTMLElement;
    const exampleProduct = document.getElementById('example-product') as HTMLElement;
    const examplePrice = document.getElementById('example-price') as HTMLElement;

    // Apply a specific state (EUR)
    const eurState = currencyStates[3];
    applyState(
      eurState,
      currencyCode,
      currencySymbol,
      incomeAmount,
      payFrequency,
      exampleProduct,
      examplePrice,
    );

    // Verify DOM is updated correctly
    expect(currencyCode.textContent).toBe('EUR');
    expect(currencySymbol.textContent).toBe('€');
    expect(incomeAmount.textContent).toBe('9,61');
    expect(payFrequency.textContent).toBe('hourly');
    expect(exampleProduct.innerHTML).toContain('Kindle Paperwhite');
    expect(examplePrice.innerHTML).toContain('99,99');
    expect(examplePrice.innerHTML).toContain('EUR');
  });

  test('applyState handles invalid URLs correctly', () => {
    // Create a spy on the log function
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Get DOM elements
    const currencyCode = document.getElementById('currency-code') as HTMLElement;
    const currencySymbol = document.getElementById('currency-symbol') as HTMLElement;
    const incomeAmount = document.getElementById('income-amount') as HTMLElement;
    const payFrequency = document.getElementById('pay-frequency') as HTMLElement;
    const exampleProduct = document.getElementById('example-product') as HTMLElement;
    const examplePrice = document.getElementById('example-price') as HTMLElement;

    // Create a copy of a state with an invalid URL
    const invalidUrlState = {
      ...currencyStates[0],
      productUrl: 'javascript:alert("XSS attack")', // Invalid URL scheme
    };

    applyState(
      invalidUrlState,
      currencyCode,
      currencySymbol,
      incomeAmount,
      payFrequency,
      exampleProduct,
      examplePrice,
    );

    // Verify that link href is set to # for invalid URL
    const link = exampleProduct.querySelector('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('#');

    // Clean up
    logSpy.mockRestore();
  });

  test('full cycle transitions through all states in order', () => {
    // Reset internal state to start from the beginning
    _resetStateForTesting();

    // Get DOM elements
    const currencyCode = document.getElementById('currency-code') as HTMLElement;

    // Complete full cycle and check that we end up back at the start
    for (let i = 0; i < currencyStates.length; i++) {
      const expectedNextCode = currencyStates[(i + 1) % currencyStates.length].currencyCode;
      shiftExample();
      expect(currencyCode.textContent).toBe(expectedNextCode);
    }
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
    test('calls setInterval with shiftExample and the defined interval delay', () => {
      // Create a spy on global.setInterval
      const setIntervalSpy = jest.spyOn(global, 'setInterval');

      // Call the function
      startExampleInterval();

      // Verify setInterval was called with the correct arguments
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      expect(setIntervalSpy).toHaveBeenCalledWith(shiftExample, EXAMPLE_CYCLE_INTERVAL_MS);

      // Clean up spy
      setIntervalSpy.mockRestore();
    });

    test('timer uses the correct interval value from EXAMPLE_CYCLE_INTERVAL_MS constant', () => {
      // Mock setInterval to capture and check the delay value
      jest.spyOn(global, 'setInterval');

      // Call the function
      startExampleInterval();

      // Verify setInterval was called with the correct delay
      expect(global.setInterval).toHaveBeenCalledWith(
        expect.any(Function),
        EXAMPLE_CYCLE_INTERVAL_MS,
      );

      // Also verify the constant has the expected value
      expect(EXAMPLE_CYCLE_INTERVAL_MS).toBe(4000);
    });
  });

  describe('initializeApplication function', () => {
    test('calls both startExampleInterval and applyCopyrightText', () => {
      // Mock the current year for consistent test results
      const mockDate = new Date(2023, 0, 1);
      const realDate = Date;
      global.Date = jest.fn(() => mockDate) as unknown as typeof Date;
      global.Date.UTC = realDate.UTC;
      global.Date.parse = realDate.parse;
      global.Date.now = realDate.now;

      // Create spies for the functions that will be called
      const setIntervalSpy = jest.spyOn(global, 'setInterval');

      // Before initialization, copyright should be empty
      const copyright = document.getElementById('copyright') as HTMLElement;
      expect(copyright.innerHTML).toBe('');

      // Call the initialization function
      initializeApplication();

      // Verify setInterval was called with correct parameters (from startExampleInterval)
      expect(setIntervalSpy).toHaveBeenCalledWith(shiftExample, EXAMPLE_CYCLE_INTERVAL_MS);

      // Verify copyright was set (from applyCopyrightText)
      expect(copyright.innerHTML).toContain('Copyright © 2023');
      expect(copyright.innerHTML).toContain('Phaedrus');

      // Clean up spy and restore Date
      setIntervalSpy.mockRestore();
      global.Date = realDate;
    });
  });
});
