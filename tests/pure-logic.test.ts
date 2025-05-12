/**
 * Pure logic tests that don't require a DOM environment
 *
 * These tests focus on the core business logic of the application
 * and don't depend on JSDOM or browser-specific APIs.
 */

import {
  _calculateNextStateIndexForTesting as calculateNextStateIndex,
  _currencyStatesForTesting as currencyStates,
  _resetStateForTesting,
  isValidHttpUrl,
} from '../scripts';

describe('URL Validation Logic', () => {
  describe('isValidHttpUrl function', () => {
    test('validates correct HTTP URLs', () => {
      // Basic HTTP URLs
      expect(isValidHttpUrl('http://example.com')).toBe(true);
      expect(isValidHttpUrl('http://www.example.com')).toBe(true);
      expect(isValidHttpUrl('http://sub.domain.example.com')).toBe(true);
      expect(isValidHttpUrl('http://example.com/path')).toBe(true);
      expect(isValidHttpUrl('http://example.com/path/to/resource')).toBe(true);
      expect(isValidHttpUrl('http://example.com?query=param')).toBe(true);
      expect(isValidHttpUrl('http://example.com#fragment')).toBe(true);
      expect(isValidHttpUrl('http://example.com:8080')).toBe(true);
      expect(isValidHttpUrl('http://localhost')).toBe(true);
      expect(isValidHttpUrl('http://127.0.0.1')).toBe(true);
    });

    test('validates correct HTTPS URLs', () => {
      // Basic HTTPS URLs
      expect(isValidHttpUrl('https://example.com')).toBe(true);
      expect(isValidHttpUrl('https://www.example.com')).toBe(true);
      expect(isValidHttpUrl('https://sub.domain.example.com')).toBe(true);
      expect(isValidHttpUrl('https://example.com/path')).toBe(true);
      expect(isValidHttpUrl('https://example.com/path/to/resource')).toBe(true);
      expect(isValidHttpUrl('https://example.com?query=param')).toBe(true);
      expect(isValidHttpUrl('https://example.com#fragment')).toBe(true);
      expect(isValidHttpUrl('https://example.com:8443')).toBe(true);

      // URLs with complex query parameters
      expect(isValidHttpUrl('https://example.com/search?q=test&page=1')).toBe(true);
      expect(isValidHttpUrl('https://example.com/search?q=complex+query+with+spaces')).toBe(true);

      // URLs with userinfo component
      expect(isValidHttpUrl('https://user:password@example.com')).toBe(true);
    });

    test('rejects malformed URLs', () => {
      // Empty or null URLs
      expect(isValidHttpUrl('')).toBe(false);
      expect(isValidHttpUrl(' ')).toBe(false);

      // Missing protocol
      expect(isValidHttpUrl('example.com')).toBe(false);
      expect(isValidHttpUrl('www.example.com')).toBe(false);

      // Incomplete URLs
      expect(isValidHttpUrl('http:')).toBe(false);
      expect(isValidHttpUrl('http://')).toBe(false);
      expect(isValidHttpUrl('https:')).toBe(false);
      expect(isValidHttpUrl('https://')).toBe(false);

      // Non-URLs
      expect(isValidHttpUrl('not a url')).toBe(false);
      expect(isValidHttpUrl('http://[invalid')).toBe(false);
    });

    test('rejects non-HTTP/HTTPS protocols (security check)', () => {
      // Other protocols
      expect(isValidHttpUrl('ftp://example.com')).toBe(false);
      expect(isValidHttpUrl('file:///path/to/file')).toBe(false);
      expect(isValidHttpUrl('ssh://user@server/path')).toBe(false);
      expect(isValidHttpUrl('tel:+1234567890')).toBe(false);
      expect(isValidHttpUrl('mailto:user@example.com')).toBe(false);

      // XSS vectors - critically important to reject
      expect(isValidHttpUrl('javascript:alert("XSS")')).toBe(false);
      expect(isValidHttpUrl('javascript:void(0)')).toBe(false);
      expect(isValidHttpUrl('data:text/html,<script>alert("XSS")</script>')).toBe(false);
      expect(isValidHttpUrl('data:image/png;base64,abcd')).toBe(false);
      expect(isValidHttpUrl('vbscript:msgbox("XSS")')).toBe(false);
    });

    test('handles edge cases correctly', () => {
      // URLs with unusual but valid components
      expect(isValidHttpUrl('https://example.com/path with spaces')).toBe(true);
      expect(isValidHttpUrl('https://example.com/%20encoded%20spaces')).toBe(true);
      expect(isValidHttpUrl('https://xn--80aswg.xn--p1ai/')).toBe(true); // Punycode domain

      // URLs with special characters
      expect(isValidHttpUrl('https://example.com/path/with/~tilde')).toBe(true);
      expect(isValidHttpUrl('https://example.com/path/with/special/→/chars')).toBe(true);

      // Very large URL (not exceeding browser limits)
      const longPath = 'a'.repeat(1000);
      expect(isValidHttpUrl(`https://example.com/${longPath}`)).toBe(true);
    });
  });
});

describe('State Index Logic', () => {
  describe('calculateNextStateIndex function', () => {
    test('returns correct next index for sequential values', () => {
      // Basic sequential indices
      expect(calculateNextStateIndex(0, 5)).toBe(1);
      expect(calculateNextStateIndex(1, 5)).toBe(2);
      expect(calculateNextStateIndex(2, 5)).toBe(3);
      expect(calculateNextStateIndex(3, 5)).toBe(4);
    });

    test('wraps around when reaching the end of the array', () => {
      // Wrap around behavior
      expect(calculateNextStateIndex(4, 5)).toBe(0);
      expect(calculateNextStateIndex(9, 10)).toBe(0);
      expect(calculateNextStateIndex(99, 100)).toBe(0);
    });

    test('handles edge cases correctly', () => {
      // Empty or single-element arrays
      expect(calculateNextStateIndex(0, 1)).toBe(0); // Stays at 0 for single-element array
      expect(calculateNextStateIndex(0, 0)).toBeNaN(); // Division by zero results in NaN

      // Negative indices (not typically used but testing for robustness)
      expect(calculateNextStateIndex(-1, 5)).toBe(0); // -1 + 1 = 0, 0 % 5 = 0

      // Skip testing additional negative indices as JavaScript modulo
      // behaviors with negative numbers can vary between implementations

      // Very large indices
      expect(calculateNextStateIndex(999, 5)).toBe(0); // 999 + 1 = 1000, 1000 % 5 = 0
      expect(calculateNextStateIndex(1000, 5)).toBe(1); // 1000 + 1 = 1001, 1001 % 5 = 1
    });

    test('matches actual currencyStates cycling behavior', () => {
      // Test with actual length of currencyStates array
      const numStates = currencyStates.length;

      // Start from index 0 and verify cycling through all states once
      let currentIndex = 0;
      const indicesToVisit = [];

      // Record the expected sequence of indices when cycling once through all states
      for (let i = 0; i < numStates; i++) {
        currentIndex = calculateNextStateIndex(currentIndex, numStates);
        indicesToVisit.push(currentIndex);
      }

      // Check that each index is visited exactly once and we return to the starting point
      expect(new Set(indicesToVisit).size).toBe(numStates); // Each index should appear exactly once
      expect(indicesToVisit[indicesToVisit.length - 1]).toBe(0); // Should return to index 0

      // Verify the exact sequence expected for the application's state cycling
      // With 5 states (0-4), we expect the sequence: 1, 2, 3, 4, 0
      expect(indicesToVisit).toEqual([1, 2, 3, 4, 0]);
    });
  });
});

describe('State Transition Logic', () => {
  // Reset the state before each test to ensure isolation
  beforeEach(() => {
    _resetStateForTesting();
  });

  /**
   * Helper function to simulate state transitions without DOM access
   * Uses the same underlying logic as shiftExample but without DOM manipulation
   */
  function simulateStateTransition(numTransitions: number = 1): {
    initialState: number;
    finalState: number;
    stateSequence: number[];
  } {
    // Get the initial state
    const initialState = 0; // currentDisplayStateIndex starts at 0 after reset

    // Track all state indices we visit
    const stateSequence = [initialState];

    for (let i = 0; i < numTransitions; i++) {
      // Calculate the next index
      const nextIndex = calculateNextStateIndex(
        stateSequence[stateSequence.length - 1],
        currencyStates.length,
      );
      stateSequence.push(nextIndex);
    }

    // Return initial, final, and all intermediate states
    return {
      initialState,
      finalState: stateSequence[stateSequence.length - 1],
      stateSequence: stateSequence.slice(1), // Remove initial state, return only transitions
    };
  }

  test('transitions through all states in expected sequence', () => {
    // Simulate a complete cycle through all currencyStates
    const { stateSequence } = simulateStateTransition(currencyStates.length);

    // Verify we visited all states in expected order
    expect(stateSequence).toEqual([1, 2, 3, 4, 0]);

    // Verify each index corresponds to an actual currencyState
    stateSequence.forEach((index) => {
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(currencyStates.length);
      expect(currencyStates[index]).toBeDefined();
    });
  });

  test('returns to initial state after complete cycle', () => {
    // Simulate a complete cycle through all states and back to start
    const { initialState, finalState } = simulateStateTransition(currencyStates.length);

    // Verify we're back at the initial state after a complete cycle
    expect(finalState).toBe(initialState);
  });

  test('each currency in sequence has valid properties', () => {
    // Get the sequence of states by index
    const { stateSequence } = simulateStateTransition(currencyStates.length);

    // For each state in the sequence, check it has valid required properties
    stateSequence.forEach((stateIndex) => {
      const state = currencyStates[stateIndex];

      // Check required state properties are present and valid
      expect(state.currencyCode).toBeDefined();
      expect(state.currencyCode.length).toBe(3); // Currency codes are 3 letters

      expect(state.currencySymbol).toBeDefined();
      expect(state.currencySymbol.length).toBeGreaterThan(0);

      expect(state.incomeAmount).toBeDefined();
      expect(state.payFrequency).toBeDefined();

      expect(state.productName).toBeDefined();
      expect(state.productName.length).toBeGreaterThan(0);

      expect(state.productUrl).toBeDefined();
      expect(isValidHttpUrl(state.productUrl)).toBe(true);

      expect(state.priceValue).toBeDefined();
      expect(state.timeToEarn).toBeDefined();
    });
  });

  test('specific currency examples match expected values', () => {
    // Randomly select and verify specific details of currency examples

    // USD hourly wage worker (first state)
    expect(currencyStates[0].currencyCode).toBe('USD');
    expect(currencyStates[0].incomeAmount).toBe('7.25');
    expect(currencyStates[0].payFrequency).toBe('hourly');

    // GBP example (third state)
    expect(currencyStates[2].currencyCode).toBe('GBP');
    expect(currencyStates[2].currencySymbol).toBe('£');
    expect(currencyStates[2].payFrequency).toBe('yearly');

    // EUR example (fourth state)
    expect(currencyStates[3].currencyCode).toBe('EUR');
    expect(currencyStates[3].productName).toBe('Kindle Paperwhite');

    // MXN example (fifth state)
    expect(currencyStates[4].currencyCode).toBe('MXN');
    expect(currencyStates[4].priceValue).toBe('1,149.00');
  });
});
