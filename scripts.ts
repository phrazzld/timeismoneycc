// Import logger in a way that works both for CommonJS/Node and browser
// @ts-ignore - Handle both module systems
const logger =
  typeof require !== 'undefined'
    ? require('./logger')
    : window.loggerModule || { log: console.error };
const { log } = logger;

/**
 * Starts the interval timer that cycles through example currency displays
 * Uses setInterval to call shiftExample at the defined interval
 * @internal Only used by initializeApplication
 */
function startExampleInterval(): void {
  setInterval(shiftExample, EXAMPLE_CYCLE_INTERVAL_MS);
}

/**
 * Export of startExampleInterval for testing purposes
 * @internal
 */
export function _startExampleIntervalForTesting(): void {
  startExampleInterval();
}

// Start the example cycling interval
// Moved to initializeApplication() function

/**
 * Interface defining the structure of a currency state configuration
 * Contains only raw data fields with no HTML to avoid XSS vulnerabilities
 *
 * Used for storing all information needed to display different currency examples
 * Each state represents a different income scenario (currency, amount, frequency)
 * along with a product example showing the time required to earn enough for that product
 *
 * @security Trust Boundary: The data in this interface is considered trusted within the application
 * as it's defined statically in the codebase. However, the productUrl field requires special handling:
 * - All productUrl values should be validated before use to prevent XSS attacks
 * - Only HTTP and HTTPS URLs are considered valid for security
 * - Invalid URLs are replaced with a safe fallback ('#') when rendered to the DOM
 *
 * This approach establishes a clear trust boundary where even data from known sources
 * is validated before being used in sensitive contexts like href attributes.
 */
export interface CurrencyState {
  /** Three-letter currency code (e.g., 'USD', 'GBP') */
  currencyCode: string;
  /** Currency symbol (e.g., '$', '£', '€') */
  currencySymbol: string;
  /** Income amount with formatting (e.g., '7.25', '50,756.00') */
  incomeAmount: string;
  /** Pay frequency - 'hourly' or 'yearly' */
  payFrequency: string;
  /** Name of the example product */
  productName: string;
  /** URL for the example product */
  productUrl: string;
  /** Price of the example product in the currency's format */
  priceValue: string;
  /** Time required to earn the product price */
  timeToEarn: string;
}

/**
 * Time interval in milliseconds for cycling through example states
 * @internal Implementation detail
 */
const EXAMPLE_CYCLE_INTERVAL_MS = 4000;

/**
 * Export of EXAMPLE_CYCLE_INTERVAL_MS for testing purposes
 * @internal
 */
export const _EXAMPLE_CYCLE_INTERVAL_MS_FOR_TESTING = EXAMPLE_CYCLE_INTERVAL_MS;

/**
 * Track the current display state index
 * Used for cycling through currency examples without reading the DOM
 * This is deliberately not exported to prevent external state manipulation
 */
let currentDisplayStateIndex = 0;

/**
 * Gets the current display state index
 * Internal accessor for the state variable
 * @internal
 * @returns The current state index
 */
function _getCurrentStateIndex(): number {
  return currentDisplayStateIndex;
}

/**
 * Resets the current display state index to 0
 * This function is only for use in tests to ensure a clean state
 * @internal
 */
export function _resetStateForTesting(): void {
  currentDisplayStateIndex = 0;
}

/**
 * Collection of predefined currency states for the example cycle
 *
 * This array contains all the currency examples that will be cycled through
 * in the application's demo mode. Each entry conforms to the CurrencyState interface.
 *
 * To add a new currency example:
 * 1. Create a new object following the CurrencyState interface
 * 2. Fill in all required fields with appropriate values
 * 3. Add the object to this array
 *
 * The order of elements in this array determines the cycling sequence.
 * @internal Implementation detail - the data is part of the application logic but not exposed API
 */
const currencyStates: CurrencyState[] = [
  {
    // Default USD hourly wage worker
    currencyCode: 'USD',
    currencySymbol: '$',
    incomeAmount: '7.25',
    payFrequency: 'hourly',
    productName: 'Taurinus X200',
    productUrl: 'https://shop.libiquity.com/product/taurinus-x200',
    priceValue: '445.00',
    timeToEarn: '61h 23m',
  },
  {
    // Medium USD yearly salary
    currencyCode: 'USD',
    currencySymbol: '$',
    incomeAmount: '50,756.00',
    payFrequency: 'yearly',
    productName: 'Taurinus X200',
    productUrl: 'https://shop.libiquity.com/product/taurinus-x200',
    priceValue: '445.00',
    timeToEarn: '18h 15m',
  },
  {
    // GBP example
    currencyCode: 'GBP',
    currencySymbol: '£',
    incomeAmount: '26,500.00',
    payFrequency: 'yearly',
    productName: 'Bulk crisps',
    productUrl:
      'https://www.britishfoodstoreonline.co.uk/products/McCoy%27s-Salted-Ridge-Cut-Potato-Crisps-30-x-50G.html',
    priceValue: '24.99',
    timeToEarn: '1h 58m',
  },
  {
    // EUR example
    currencyCode: 'EUR',
    currencySymbol: '€',
    incomeAmount: '9,61',
    payFrequency: 'hourly',
    productName: 'Kindle Paperwhite',
    productUrl: 'http://amzn.to/2kEgPj2',
    priceValue: '99,99',
    timeToEarn: '10h 25m',
  },
  {
    // MXN example
    currencyCode: 'MXN',
    currencySymbol: '$',
    incomeAmount: '31.30',
    payFrequency: 'hourly',
    productName: 'Licuadora Oster',
    productUrl: 'http://bit.ly/2ldKpPN',
    priceValue: '1,149.00',
    timeToEarn: '36h 43m',
  },
];

/**
 * Export of currencyStates for testing purposes
 * @internal
 */
export const _currencyStatesForTesting: CurrencyState[] = [...currencyStates];

/**
 * Calculate the next state index, cycling through available states
 * A pure function that takes the current index and total states as parameters
 * @param currentIndex - The current state index
 * @param totalStates - The total number of states in the cycle
 * @returns The index of the next state
 * @internal Used by getNextState function
 */
function calculateNextStateIndex(currentIndex: number, totalStates: number): number {
  return (currentIndex + 1) % totalStates;
}

/**
 * Export of calculateNextStateIndex for testing purposes
 * @internal
 */
export function _calculateNextStateIndexForTesting(
  currentIndex: number,
  totalStates: number,
): number {
  return calculateNextStateIndex(currentIndex, totalStates);
}

/**
 * Pure function that determines the next currency state
 * Handles only the state transition logic without DOM interactions
 * @returns The next currency state to display
 */
function getNextState(): CurrencyState {
  const nextIndex = calculateNextStateIndex(_getCurrentStateIndex(), currencyStates.length);
  currentDisplayStateIndex = nextIndex;
  return currencyStates[nextIndex];
}

// DOMElements interface removed as part of T015
// The interface was deprecated and is no longer needed now that we use the container-based API

// getRequiredDOMElements function removed as part of T015
// The function was deprecated and is no longer needed now that we use the container-based API

/**
 * Updates the example display to show different currency and income scenarios.
 * Uses a data-driven approach to cycle through different examples of prices converted to work hours.
 * Uses internal state tracking rather than reading from the DOM to determine the current state.
 *
 * This function orchestrates three separate concerns:
 * 1. DOM element retrieval
 * 2. Pure state calculation
 * 3. DOM updates
 */
export function shiftExample(): void {
  // Get DOM container
  const container = document.body;
  if (!container) {
    log('error', 'Required DOM body not found', {
      component: 'shiftExample',
    });
    throw new Error('Initialization failed: document.body not found');
  }

  // Compute next state (pure logic)
  const nextState = getNextState();

  // Apply state to DOM using container-based API
  applyState(nextState, container);
}

/**
 * Applies a currency state to DOM elements in a container or to individual elements
 * Creates DOM elements programmatically to avoid HTML injection
 * @param state - The currency state to apply
 * @param containerOrElement - The container element or first element
 * @param currencySymbol - (Optional) The currency symbol element if not using container
 * @param incomeAmount - (Optional) The income amount element if not using container
 * @param payFrequency - (Optional) The pay frequency element if not using container
 * @param exampleProduct - (Optional) The example product element if not using container
 * @param examplePrice - (Optional) The example price element if not using container
 */
export function applyState(
  state: CurrencyState,
  containerOrElement: HTMLElement,
  currencySymbol?: HTMLElement,
  incomeAmount?: HTMLElement,
  payFrequency?: HTMLElement,
  exampleProduct?: HTMLElement,
  examplePrice?: HTMLElement,
): void {
  // If we have additional parameters, assume we're using the old API
  if (arguments.length > 2) {
    // Call the legacy version with all arguments
    applyStateWithElements(
      state,
      containerOrElement, // This is actually currencyCode in the old API
      currencySymbol as HTMLElement,
      incomeAmount as HTMLElement,
      payFrequency as HTMLElement,
      exampleProduct as HTMLElement,
      examplePrice as HTMLElement,
    );
    return;
  }

  // Otherwise, use the container version
  const container = containerOrElement;
  // Find all required elements within the container
  const currencyCodeElement = container.querySelector('#currency-code');
  const currencySymbolElement = container.querySelector('#currency-symbol');
  const incomeAmountElement = container.querySelector('#income-amount');
  const payFrequencyElement = container.querySelector('#pay-frequency');
  const exampleProductElement = container.querySelector('#example-product');
  const examplePriceElement = container.querySelector('#example-price');

  // Check if all required elements exist
  const elementsToCheck = [
    { element: currencyCodeElement, id: 'currency-code' },
    { element: currencySymbolElement, id: 'currency-symbol' },
    { element: incomeAmountElement, id: 'income-amount' },
    { element: payFrequencyElement, id: 'pay-frequency' },
    { element: exampleProductElement, id: 'example-product' },
    { element: examplePriceElement, id: 'example-price' },
  ];

  const missingElements = elementsToCheck.filter((item) => !item.element).map((item) => item.id);

  if (missingElements.length > 0) {
    log('error', 'Required child elements not found in container', {
      component: 'applyState',
      containerId: container.id || '[unnamed]',
      missingElements,
    });
    throw new Error('Container missing required child elements');
  }

  // Since we've verified all elements exist, we can safely cast them
  const currencyCodeEl = currencyCodeElement as HTMLElement;
  const currencySymbolEl = currencySymbolElement as HTMLElement;
  const incomeAmountEl = incomeAmountElement as HTMLElement;
  const payFrequencyEl = payFrequencyElement as HTMLElement;
  const exampleProductEl = exampleProductElement as HTMLElement;
  const examplePriceEl = examplePriceElement as HTMLElement;

  // Update basic text fields
  currencyCodeEl.textContent = state.currencyCode;
  currencySymbolEl.textContent = state.currencySymbol;
  incomeAmountEl.textContent = state.incomeAmount;
  payFrequencyEl.textContent = state.payFrequency;

  // Clear any existing content
  exampleProductEl.innerHTML = '';
  examplePriceEl.innerHTML = '';

  // Create product element programmatically
  const productLink = document.createElement('a');

  // URL Validation: Apply strict URL validation to prevent XSS attacks
  // This is a critical security control that prevents malicious URLs like
  // javascript:, data:, or other non-http protocols from being injected
  if (isValidHttpUrl(state.productUrl)) {
    productLink.href = state.productUrl;
  } else {
    // Security measure: If URL is invalid, use a safe fallback
    // and log the issue for monitoring and investigation
    productLink.href = '#';
    log('error', `Invalid URL skipped: ${state.productUrl}`, { component: 'applyState' });
  }
  productLink.target = '_blank';
  productLink.textContent = state.productName;
  exampleProductEl.appendChild(productLink);

  // Add a colon after the product if not MXN (MXN example doesn't have one)
  if (state.currencyCode !== 'MXN') {
    exampleProductEl.appendChild(document.createTextNode(': '));
  }

  // Create price element programmatically
  const priceContainer = document.createElement('span');
  priceContainer.className = 'example-money';

  // Different formatting for EUR vs other currencies
  if (state.currencyCode === 'EUR') {
    priceContainer.textContent = state.priceValue + ' ';
    const currencySpan = document.createElement('span');
    currencySpan.textContent = 'EUR';
    priceContainer.appendChild(currencySpan);
  } else {
    const currencySpan = document.createElement('span');
    currencySpan.textContent = state.currencySymbol;
    priceContainer.appendChild(currencySpan);
    priceContainer.appendChild(document.createTextNode(state.priceValue));
  }

  // Add time to earn
  priceContainer.appendChild(document.createTextNode(' (' + state.timeToEarn + ')'));
  examplePriceEl.appendChild(priceContainer);
}

/**
 * Legacy version of applyState that accepts individual elements
 * @deprecated Use the container-based version instead.
 * This function will be removed in the next major version once all callers are updated
 * to use the container-based API (T013). All callers should be updated to use the
 * container-based version, which provides better element management and validation.
 * @param state - The currency state to apply
 * @param currencyCode - The element to display the currency code
 * @param currencySymbol - The element to display the currency symbol
 * @param incomeAmount - The element to display the income amount
 * @param payFrequency - The element to display the pay frequency
 * @param exampleProduct - The element to display the product example
 * @param examplePrice - The element to display the price example
 */
export function applyStateWithElements(
  state: CurrencyState,
  currencyCode: HTMLElement,
  currencySymbol: HTMLElement,
  incomeAmount: HTMLElement,
  payFrequency: HTMLElement,
  exampleProduct: HTMLElement,
  examplePrice: HTMLElement,
): void {
  // Update basic text fields
  currencyCode.textContent = state.currencyCode;
  currencySymbol.textContent = state.currencySymbol;
  incomeAmount.textContent = state.incomeAmount;
  payFrequency.textContent = state.payFrequency;

  // Clear any existing content
  exampleProduct.innerHTML = '';
  examplePrice.innerHTML = '';

  // Create product element programmatically
  const productLink = document.createElement('a');

  // URL Validation: Apply strict URL validation to prevent XSS attacks
  // This is a critical security control that prevents malicious URLs like
  // javascript:, data:, or other non-http protocols from being injected
  if (isValidHttpUrl(state.productUrl)) {
    productLink.href = state.productUrl;
  } else {
    // Security measure: If URL is invalid, use a safe fallback
    // and log the issue for monitoring and investigation
    productLink.href = '#';
    log('error', `Invalid URL skipped: ${state.productUrl}`, { component: 'applyState' });
  }
  productLink.target = '_blank';
  productLink.textContent = state.productName;
  exampleProduct.appendChild(productLink);

  // Add a colon after the product if not MXN (MXN example doesn't have one)
  if (state.currencyCode !== 'MXN') {
    exampleProduct.appendChild(document.createTextNode(': '));
  }

  // Create price element programmatically
  const priceContainer = document.createElement('span');
  priceContainer.className = 'example-money';

  // Different formatting for EUR vs other currencies
  if (state.currencyCode === 'EUR') {
    priceContainer.textContent = state.priceValue + ' ';
    const currencySpan = document.createElement('span');
    currencySpan.textContent = 'EUR';
    priceContainer.appendChild(currencySpan);
  } else {
    const currencySpan = document.createElement('span');
    currencySpan.textContent = state.currencySymbol;
    priceContainer.appendChild(currencySpan);
    priceContainer.appendChild(document.createTextNode(state.priceValue));
  }

  // Add time to earn
  priceContainer.appendChild(document.createTextNode(' (' + state.timeToEarn + ')'));
  examplePrice.appendChild(priceContainer);
}

/**
 * Validates if a string is a valid HTTP or HTTPS URL
 * Protects against XSS by ensuring URLs are properly formatted and use allowed protocols
 *
 * @security This function establishes a critical security boundary by:
 * 1. Validating URL syntax through the URL constructor (catches malformed URLs)
 * 2. Restricting to HTTP/HTTPS protocols only to prevent javascript: and data: URLs
 *    that could enable XSS attacks
 * 3. Providing consistent validation that can be applied across the application
 *
 * Common XSS attack vectors this prevents:
 * - javascript:alert('XSS')
 * - data:text/html,<script>alert('XSS')</script>
 * - vbscript:... (in older IE browsers)
 *
 * Trust assumption: This function should be used for all URLs before they are
 * assigned to href attributes or other DOM properties that can execute code.
 *
 * @param url - The URL string to validate
 * @returns True if the URL is a valid HTTP or HTTPS URL, false otherwise
 */
export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Safely checks if an HTML element's text content matches the expected value.
 * @param element - The HTML element to check
 * @param val - The expected text content
 * @returns True if the element exists and its text content matches the expected value
 * @internal Utility function for DOM element text validation
 */
function isElementText(element: HTMLElement | null, val: string): boolean {
  return element !== null && element.textContent === val;
}

/**
 * Export of isElementText for testing purposes
 * @internal
 */
export function _isElementTextForTesting(element: HTMLElement | null, val: string): boolean {
  return isElementText(element, val);
}

/**
 * Generates a copyright text string for the given year
 * @param year - The year to include in the copyright text
 * @returns A formatted copyright string with the year and link to Phaedrus
 * @internal Used by applyCopyrightText
 */
function getCopyrightText(year: number): string {
  return (
    'Copyright \u00A9 ' + year + ' <a href="https://www.phaedrus.io" target="_blank">Phaedrus</a>'
  );
}

/**
 * Export of getCopyrightText for testing purposes
 * @internal
 */
export function _getCopyrightTextForTesting(year: number): string {
  return getCopyrightText(year);
}

/**
 * Updates the copyright element in the DOM with the current year
 * Finds the copyright element and creates child nodes programmatically to avoid XSS risks
 */
export function applyCopyrightText(): void {
  const copyrightElement = document.getElementById('copyright');
  if (copyrightElement) {
    // Clear any existing content
    copyrightElement.innerHTML = '';

    // Add copyright symbol and year text
    const year = new Date().getFullYear();
    copyrightElement.appendChild(document.createTextNode('Copyright © ' + year + ' '));

    // Create and append the link to Phaedrus
    const link = document.createElement('a');
    link.href = 'https://www.phaedrus.io';
    link.target = '_blank';
    link.textContent = 'Phaedrus';
    copyrightElement.appendChild(link);
  }
}

// Set copyright year in footer
// Moved to initializeApplication() function

/**
 * Initializes the application by starting the example interval and setting the copyright text
 * Call this function to start the application functionality
 */
export function initializeApplication(): void {
  startExampleInterval();
  applyCopyrightText();
}

// Expose functions to the global scope for use in browser
declare global {
  interface Window {
    initializeApplication: () => void;
    loggerModule?: { log: (level: string, message: string, context?: any) => void };
  }
}

if (typeof window !== 'undefined') {
  window.initializeApplication = initializeApplication;
}
