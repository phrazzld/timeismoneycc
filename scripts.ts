/**
 * Starts the interval timer that cycles through example currency displays
 * Uses setInterval to call shiftExample every 4000ms
 */
export function startExampleInterval(): void {
  setInterval(shiftExample, 4000);
}

// Start the example cycling interval
// Moved to initializeApplication() function

/**
 * Interface defining the structure of a currency state configuration
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
  /** HTML for the example product, including the link */
  exampleProductHTML: string;
  /** HTML for the example price, showing the currency and work time */
  examplePriceHTML: string;
}

/**
 * Collection of predefined currency states for the example cycle
 */
export const currencyStates: CurrencyState[] = [
  {
    // Default USD hourly wage worker
    currencyCode: 'USD',
    currencySymbol: '$',
    incomeAmount: '7.25',
    payFrequency: 'hourly',
    exampleProductHTML:
      '<a href="https://shop.libiquity.com/product/taurinus-x200" target="_blank">Taurinus X200</a>: ',
    examplePriceHTML: '<span class="example-money"><span>$</span>445.00 (61h 23m)</span>',
  },
  {
    // Medium USD yearly salary
    currencyCode: 'USD',
    currencySymbol: '$',
    incomeAmount: '50,756.00',
    payFrequency: 'yearly',
    exampleProductHTML:
      '<a href="https://shop.libiquity.com/product/taurinus-x200" target="_blank">Taurinus X200</a>: ',
    examplePriceHTML: '<span class="example-money"><span>$</span>445.00 (18h 15m)</span>',
  },
  {
    // GBP example
    currencyCode: 'GBP',
    currencySymbol: '£',
    incomeAmount: '26,500.00',
    payFrequency: 'yearly',
    exampleProductHTML:
      '<a href="https://www.britishfoodstoreonline.co.uk/products/McCoy%27s-Salted-Ridge-Cut-Potato-Crisps-30-x-50G.html" target="_blank">Bulk crisps</a>: ',
    examplePriceHTML: '<span class="example-money"><span>£</span>24.99 (1h 58m)</span>',
  },
  {
    // EUR example
    currencyCode: 'EUR',
    currencySymbol: '€',
    incomeAmount: '9,61',
    payFrequency: 'hourly',
    exampleProductHTML: '<a href="http://amzn.to/2kEgPj2" target="_blank">Kindle Paperwhite</a>: ',
    examplePriceHTML: '<span class="example-money">99,99 <span>EUR</span> (10h 25m)</span>',
  },
  {
    // MXN example
    currencyCode: 'MXN',
    currencySymbol: '$',
    incomeAmount: '31.30',
    payFrequency: 'hourly',
    exampleProductHTML: '<a href="http://bit.ly/2ldKpPN" target="_blank">Licuadora Oster</a>',
    examplePriceHTML: '<span class="example-money"><span>$</span>1,149.00 (36h 43m)</span>',
  },
];

/**
 * Updates the example display to show different currency and income scenarios.
 * Uses a data-driven approach to cycle through different examples of prices converted to work hours.
 */
export function shiftExample(): void {
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

  // Find the current state based on DOM element values
  const currentStateIndex = findCurrentStateIndex(currencyCode, currencySymbol, payFrequency);

  // Get the next state (cycling through the array)
  const nextState = currencyStates[(currentStateIndex + 1) % currencyStates.length];

  // Apply the next state to the DOM
  applyState(
    nextState,
    currencyCode,
    currencySymbol,
    incomeAmount,
    payFrequency,
    exampleProduct,
    examplePrice,
  );
}

/**
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
 * @param state - The currency state to apply
 * @param elements - The DOM elements to update
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
  currencyCode.textContent = state.currencyCode;
  currencySymbol.textContent = state.currencySymbol;
  incomeAmount.textContent = state.incomeAmount;
  payFrequency.textContent = state.payFrequency;
  exampleProduct.innerHTML = state.exampleProductHTML;
  examplePrice.innerHTML = state.examplePriceHTML;
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
 * Finds the copyright element and sets its innerHTML using the getCopyrightText function
 */
export function applyCopyrightText(): void {
  const copyrightElement = document.getElementById('copyright');
  if (copyrightElement) {
    copyrightElement.innerHTML = getCopyrightText(new Date().getFullYear());
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

// Expose initializeApplication to the global scope for use in index.html
if (typeof window !== 'undefined') {
  (window as any).initializeApplication = initializeApplication;
}
