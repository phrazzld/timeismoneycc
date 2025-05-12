/**
 * @jest-environment jsdom
 */

// Import functions from scripts.ts for testing
import {
  shiftExample,
  applyCopyrightText,
  initializeApplication,
  applyState,
  _resetStateForTesting,
  isValidHttpUrl,
  _isElementTextForTesting as isElementText,
  _getCopyrightTextForTesting as getCopyrightText,
  _calculateNextStateIndexForTesting as calculateNextStateIndex,
  _EXAMPLE_CYCLE_INTERVAL_MS_FOR_TESTING as EXAMPLE_CYCLE_INTERVAL_MS,
  _currencyStatesForTesting as currencyStates,
  _startExampleIntervalForTesting as startExampleInterval,
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
});

// Helper function for tests
const getDisplayState = (): {
  currencyCode: string;
  currencySymbol: string;
  incomeAmount: string;
  payFrequency: string;
  productHTML: string;
  priceHTML: string;
} => {
  return {
    currencyCode: document.getElementById('currency-code')?.textContent ?? '',
    currencySymbol: document.getElementById('currency-symbol')?.textContent ?? '',
    incomeAmount: document.getElementById('income-amount')?.textContent ?? '',
    payFrequency: document.getElementById('pay-frequency')?.textContent ?? '',
    productHTML: document.getElementById('example-product')?.innerHTML ?? '',
    priceHTML: document.getElementById('example-price')?.innerHTML ?? '',
  };
};

// Tests for currency state transition behavior
describe('Currency State Transitions', () => {
  // Common setup for all state transition tests
  beforeEach(() => {
    // Reset state before each test
    _resetStateForTesting();

    // Setup DOM with default structure
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

  describe('Cycle Tests', () => {
    test('cycles through all currency states in sequence', () => {
      // Get observable data for each expected state
      const expectedStates = currencyStates.map((state) => ({
        currencyCode: state.currencyCode,
        currencySymbol: state.currencySymbol,
        incomeAmount: state.incomeAmount,
        payFrequency: state.payFrequency,
      }));

      // Verify initial state matches first expected state (USD hourly)
      let displayState = getDisplayState();
      expect(displayState.currencyCode).toBe(expectedStates[0].currencyCode);
      expect(displayState.payFrequency).toBe(expectedStates[0].payFrequency);

      // Cycle through all states and verify each transition
      for (let i = 0; i < expectedStates.length; i++) {
        shiftExample();
        displayState = getDisplayState();

        // Get the expected state (with wrapping)
        const expectedIndex = (i + 1) % expectedStates.length;
        const expected = expectedStates[expectedIndex];

        // Verify transition occurred correctly based on observable DOM state
        expect(displayState.currencyCode).toBe(expected.currencyCode);
        expect(displayState.currencySymbol).toBe(expected.currencySymbol);
        expect(displayState.incomeAmount).toBe(expected.incomeAmount);
        expect(displayState.payFrequency).toBe(expected.payFrequency);
      }
    });

    test('completes a full cycle and returns to the initial state', () => {
      // Get the initial display state
      const initialState = getDisplayState();

      // Cycle through all states (5 total)
      for (let i = 0; i < currencyStates.length; i++) {
        shiftExample();
      }

      // Get the final state after completing the cycle
      const finalState = getDisplayState();

      // Verify we're back at the initial state
      expect(finalState.currencyCode).toBe(initialState.currencyCode);
      expect(finalState.currencySymbol).toBe(initialState.currencySymbol);
      expect(finalState.incomeAmount).toBe(initialState.incomeAmount);
      expect(finalState.payFrequency).toBe(initialState.payFrequency);
    });
  });

  describe('Individual Transitions', () => {
    test('transitions from USD hourly to USD yearly', () => {
      // Get the initial display state
      const initialState = getDisplayState();
      expect(initialState.currencyCode).toBe('USD');
      expect(initialState.payFrequency).toBe('hourly');

      // Trigger the state transition
      shiftExample();

      // Get the new display state
      const newState = getDisplayState();

      // Verify the transition occurred correctly
      expect(newState.currencyCode).toBe('USD');
      expect(newState.currencySymbol).toBe('$');
      expect(newState.incomeAmount).toBe('50,756.00');
      expect(newState.payFrequency).toBe('yearly');
      expect(newState.priceHTML).toContain('$');
      expect(newState.priceHTML).toContain('445.00');
    });

    test('transitions from USD yearly to GBP', () => {
      // Start by transitioning to USD yearly
      shiftExample();

      // Verify we're in USD yearly state
      let displayState = getDisplayState();
      expect(displayState.currencyCode).toBe('USD');
      expect(displayState.payFrequency).toBe('yearly');

      // Trigger next transition
      shiftExample();

      // Get the new display state
      displayState = getDisplayState();

      // Verify transition to GBP
      expect(displayState.currencyCode).toBe('GBP');
      expect(displayState.currencySymbol).toBe('£');
      expect(displayState.incomeAmount).toBe('26,500.00');
      expect(displayState.payFrequency).toBe('yearly');
      expect(displayState.productHTML).toContain('Bulk crisps');
      expect(displayState.priceHTML).toContain('£');
      expect(displayState.priceHTML).toContain('24.99');
    });

    test('transitions from GBP to EUR', () => {
      // Get to GBP state first (requires two transitions)
      shiftExample(); // USD hourly -> USD yearly
      shiftExample(); // USD yearly -> GBP

      // Verify we're in GBP state
      let displayState = getDisplayState();
      expect(displayState.currencyCode).toBe('GBP');

      // Trigger transition to EUR
      shiftExample();

      // Get the new display state
      displayState = getDisplayState();

      // Verify transition to EUR
      expect(displayState.currencyCode).toBe('EUR');
      expect(displayState.currencySymbol).toBe('€');
      expect(displayState.productHTML).toContain('Kindle Paperwhite');
      expect(displayState.priceHTML).toContain('99,99');
      expect(displayState.priceHTML).toContain('EUR');
    });

    test('transitions from EUR to MXN', () => {
      // Get to EUR state first (requires three transitions)
      shiftExample(); // USD hourly -> USD yearly
      shiftExample(); // USD yearly -> GBP
      shiftExample(); // GBP -> EUR

      // Verify we're in EUR state
      let displayState = getDisplayState();
      expect(displayState.currencyCode).toBe('EUR');

      // Trigger transition to MXN
      shiftExample();

      // Get the new display state
      displayState = getDisplayState();

      // Verify transition to MXN
      expect(displayState.currencyCode).toBe('MXN');
      expect(displayState.currencySymbol).toBe('$');
      expect(displayState.productHTML).toContain('Licuadora Oster');
      expect(displayState.priceHTML).toContain('1,149.00');
    });

    test('transitions from MXN back to USD hourly', () => {
      // Get to MXN state first (requires four transitions)
      shiftExample(); // USD hourly -> USD yearly
      shiftExample(); // USD yearly -> GBP
      shiftExample(); // GBP -> EUR
      shiftExample(); // EUR -> MXN

      // Verify we're in MXN state
      let displayState = getDisplayState();
      expect(displayState.currencyCode).toBe('MXN');

      // Trigger transition back to USD hourly
      shiftExample();

      // Get the new display state
      displayState = getDisplayState();

      // Verify transition back to USD hourly (complete cycle)
      expect(displayState.currencyCode).toBe('USD');
      expect(displayState.currencySymbol).toBe('$');
      expect(displayState.incomeAmount).toBe('7.25');
      expect(displayState.payFrequency).toBe('hourly');
    });
  });

  describe('Error Handling', () => {
    test('throws error when DOM elements are missing', () => {
      // Remove a required element
      document.getElementById('currency-code')?.remove();

      // Call the function and expect it to throw
      expect(() => shiftExample()).toThrow();

      // Ensure other elements weren't modified
      expect(document.getElementById('pay-frequency')?.textContent).toBe('hourly');
    });
  });
});

// Tests for applyState DOM updates
describe('Apply State Functionality', () => {
  beforeEach(() => {
    _resetStateForTesting();

    // Set up DOM with standard container structure
    document.body.innerHTML = `
      <div id="container">
        <div id="currency-code">USD</div>
        <div id="currency-symbol">$</div>
        <div id="income-amount">7.25</div>
        <div id="pay-frequency">hourly</div>
        <div id="example-product"></div>
        <div id="example-price"></div>
      </div>
    `;
  });

  test('applyState correctly updates DOM with state data', () => {
    const container = document.getElementById('container') as HTMLElement;
    const eurState = currencyStates[3]; // EUR example

    // Apply the state to the container
    applyState(eurState, container);

    // Verify DOM elements were updated correctly
    expect(container.querySelector('#currency-code')?.textContent).toBe('EUR');
    expect(container.querySelector('#currency-symbol')?.textContent).toBe('€');
    expect(container.querySelector('#income-amount')?.textContent).toBe('9,61');
    expect(container.querySelector('#pay-frequency')?.textContent).toBe('hourly');
    expect(container.querySelector('#example-product')?.innerHTML).toContain('Kindle Paperwhite');
    expect(container.querySelector('#example-price')?.innerHTML).toContain('99,99');
    expect(container.querySelector('#example-price')?.innerHTML).toContain('EUR');
  });

  test('applyState handles different currency formatting correctly', () => {
    const container = document.getElementById('container') as HTMLElement;

    // Test EUR formatting
    const eurState = currencyStates[3]; // EUR example
    applyState(eurState, container);
    expect(container.querySelector('#example-price')?.innerHTML).toContain('99,99');
    expect(container.querySelector('#example-price')?.innerHTML).toContain('EUR');
    expect(container.querySelector('#example-price')?.innerHTML).not.toContain('€');

    // Test GBP formatting
    const gbpState = currencyStates[2]; // GBP example
    applyState(gbpState, container);
    expect(container.querySelector('#example-price')?.innerHTML).toContain('£');
    expect(container.querySelector('#example-price')?.innerHTML).toContain('24.99');

    // Test USD formatting
    const usdState = currencyStates[0]; // USD example
    applyState(usdState, container);
    expect(container.querySelector('#example-price')?.innerHTML).toContain('$');
    expect(container.querySelector('#example-price')?.innerHTML).toContain('445.00');
  });

  test('applyState handles invalid URLs safely', () => {
    // Create a spy on the log function
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const container = document.getElementById('container') as HTMLElement;
    const exampleProduct = container.querySelector('#example-product') as HTMLElement;

    // Create a state with an invalid URL that should be caught by security checks
    const invalidUrlState = {
      ...currencyStates[0],
      productUrl: 'javascript:alert("XSS attack")', // Invalid URL scheme
    };

    // Apply the state
    applyState(invalidUrlState, container);

    // Verify that link href is set to safe fallback
    const link = exampleProduct.querySelector('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('#');

    // Verify that the error was logged
    expect(logSpy).toHaveBeenCalled();

    // Clean up
    logSpy.mockRestore();
  });

  test('applyState throws error when container is missing required elements', () => {
    // Create a container with missing elements
    document.body.innerHTML = `
      <div id="incomplete-container">
        <div id="currency-code">USD</div>
        <!-- Missing currency-symbol -->
        <div id="income-amount">7.25</div>
        <div id="pay-frequency">hourly</div>
        <div id="example-product"></div>
        <!-- Missing example-price -->
      </div>
    `;

    const container = document.getElementById('incomplete-container') as HTMLElement;
    const gbpState = currencyStates[2];

    // Expect applying state to throw an error
    expect(() => applyState(gbpState, container)).toThrow(
      'Container missing required child elements',
    );
  });
});

// Tests for interval functionality
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
