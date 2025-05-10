import { log } from './logger';

/**
 * Starts the interval timer that cycles through example currency displays
 * Uses setInterval to call shiftExample at the defined interval
 */
export function startExampleInterval(): void {
  setInterval(shiftExample, EXAMPLE_CYCLE_INTERVAL_MS);
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
 */
export const EXAMPLE_CYCLE_INTERVAL_MS = 4000;

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
 */
export const currencyStates: CurrencyState[] = [
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
 * Calculate the next state index, cycling through available states
 * A pure function that takes the current index and total states as parameters
 * @param currentIndex - The current state index
 * @param totalStates - The total number of states in the cycle
 * @returns The index of the next state
 */
export function calculateNextStateIndex(currentIndex: number, totalStates: number): number {
  return (currentIndex + 1) % totalStates;
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

/**
 * Interface representing all required DOM elements for currency display
 * Used to group elements that are needed for updating the currency display
 */
interface DOMElements {
  currencyCode: HTMLElement;
  currencySymbol: HTMLElement;
  incomeAmount: HTMLElement;
  payFrequency: HTMLElement;
  exampleProduct: HTMLElement;
  examplePrice: HTMLElement;
}

/**
 * Retrieves all required DOM elements for the currency display
 * Centralizes DOM element access in one function
 * @returns Object containing all required elements, or null if any element is missing
 */
function getRequiredDOMElements(): DOMElements | null {
  const currencyCode = document.getElementById('currency-code');
  const currencySymbol = document.getElementById('currency-symbol');
  const incomeAmount = document.getElementById('income-amount');
  const payFrequency = document.getElementById('pay-frequency');
  const exampleProduct = document.getElementById('example-product');
  const examplePrice = document.getElementById('example-price');

  // Check which elements are missing
  const elementsToCheck = [
    { element: currencyCode, id: 'currency-code' },
    { element: currencySymbol, id: 'currency-symbol' },
    { element: incomeAmount, id: 'income-amount' },
    { element: payFrequency, id: 'pay-frequency' },
    { element: exampleProduct, id: 'example-product' },
    { element: examplePrice, id: 'example-price' },
  ];

  const missingElements = elementsToCheck.filter((item) => !item.element).map((item) => item.id);

  if (missingElements.length > 0) {
    log('warn', 'Some required DOM elements are missing', {
      component: 'getRequiredDOMElements',
      missingElements,
    });
    return null;
  }

  return {
    currencyCode: currencyCode as HTMLElement,
    currencySymbol: currencySymbol as HTMLElement,
    incomeAmount: incomeAmount as HTMLElement,
    payFrequency: payFrequency as HTMLElement,
    exampleProduct: exampleProduct as HTMLElement,
    examplePrice: examplePrice as HTMLElement,
  };
}

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
  // Get DOM elements
  const elements = getRequiredDOMElements();
  if (!elements) {
    log('error', 'Required DOM elements not found', {
      component: 'shiftExample',
      requiredElements: [
        'currency-code',
        'currency-symbol',
        'income-amount',
        'pay-frequency',
        'example-product',
        'example-price',
      ],
    });
    throw new Error(
      'Initialization failed: One or more required DOM elements not found. Check for elements: currency-code, currency-symbol, income-amount, pay-frequency, example-product, example-price',
    );
  }

  // Compute next state (pure logic)
  const nextState = getNextState();

  // Apply state to DOM
  applyState(
    nextState,
    elements.currencyCode,
    elements.currencySymbol,
    elements.incomeAmount,
    elements.payFrequency,
    elements.exampleProduct,
    elements.examplePrice,
  );
}

/**
 * @deprecated This function is deprecated and will be removed in the next major version.
 * Use the internal state tracking (currentDisplayStateIndex) instead of reading state from DOM.
 *
 * Finds the index of the current state based on DOM element values
 * @param currencyCode - Currency code element
 * @param currencySymbol - Currency symbol element
 * @param payFrequency - Pay frequency element
 * @returns Index of the current state in the currencyStates array, or -1 if no match
 */
export function findCurrentStateIndex(
  currencyCode: HTMLElement,
  currencySymbol: HTMLElement,
  payFrequency: HTMLElement,
): number {
  console.warn(
    'findCurrentStateIndex is deprecated and will be removed in the next major version. ' +
      'Use the internal state tracking instead of reading state from DOM.',
  );

  // Look for a matching state in the array
  return currencyStates.findIndex(
    (state) =>
      isElementText(currencyCode, state.currencyCode) &&
      isElementText(currencySymbol, state.currencySymbol) &&
      isElementText(payFrequency, state.payFrequency),
  );
}

/**
 * Applies a currency state to the DOM elements
 * Creates DOM elements programmatically to avoid HTML injection
 * @param state - The currency state to apply
 * @param currencyCode - The element to display the currency code
 * @param currencySymbol - The element to display the currency symbol
 * @param incomeAmount - The element to display the income amount
 * @param payFrequency - The element to display the pay frequency
 * @param exampleProduct - The element to display the product example
 * @param examplePrice - The element to display the price example
 */
export function applyState(
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
 */
export function isElementText(element: HTMLElement | null, val: string): boolean {
  return element !== null && element.textContent === val;
}

/**
 * Generates a copyright text string for the given year
 * @param year - The year to include in the copyright text
 * @returns A formatted copyright string with the year and link to Phaedrus
 */
export function getCopyrightText(year: number): string {
  return (
    'Copyright \u00A9 ' + year + ' <a href="https://www.phaedrus.io" target="_blank">Phaedrus</a>'
  );
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
 * Interface to augment Window with our application functions
 */
export interface AppWindow extends Window {
  initializeApplication?: () => void;
}

/**
 * Initializes the application by starting the example interval and setting the copyright text
 * Call this function to start the application functionality
 */
export function initializeApplication(): void {
  startExampleInterval();
  applyCopyrightText();
}

// Expose initializeApplication to the global scope for use in index.html
if (typeof window !== 'undefined') {
  (window as AppWindow).initializeApplication = initializeApplication;
}
