/**
 * Simple logger function for the application
 */
function log(level, message, context) {
  // Create timestamp in ISO 8601 format
  const timestamp = new Date().toISOString();

  // Build log entry with standard required fields
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  };

  // Output as JSON to appropriate console method based on level
  console[level](JSON.stringify(logEntry));
}

/**
 * Time interval in milliseconds for cycling through example states
 */
const EXAMPLE_CYCLE_INTERVAL_MS = 4000;

/**
 * Track the current display state index
 */
let currentDisplayStateIndex = 0;

/**
 * Collection of predefined currency states for the example cycle
 */
const currencyStates = [
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
 */
function calculateNextStateIndex(currentIndex, totalStates) {
  return (currentIndex + 1) % totalStates;
}

/**
 * Determines the next currency state
 */
function getNextState() {
  const nextIndex = calculateNextStateIndex(currentDisplayStateIndex, currencyStates.length);
  currentDisplayStateIndex = nextIndex;
  return currencyStates[nextIndex];
}

/**
 * Validates if a string is a valid HTTP or HTTPS URL
 */
function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Updates the example display to show different currency and income scenarios.
 */
function shiftExample() {
  // Get DOM container
  const container = document.body;
  if (!container) {
    log('error', 'Required DOM body not found', {
      component: 'shiftExample',
    });
    throw new Error('Initialization failed: document.body not found');
  }

  // Compute next state
  const nextState = getNextState();

  // Apply state to DOM
  applyState(nextState, container);
}

/**
 * Applies a currency state to DOM elements in a container
 */
function applyState(state, container) {
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

  // Update basic text fields
  currencyCodeElement.textContent = state.currencyCode;
  currencySymbolElement.textContent = state.currencySymbol;
  incomeAmountElement.textContent = state.incomeAmount;
  payFrequencyElement.textContent = state.payFrequency;

  // Clear any existing content
  exampleProductElement.innerHTML = '';
  examplePriceElement.innerHTML = '';

  // Create product element programmatically
  const productLink = document.createElement('a');

  // URL Validation
  if (isValidHttpUrl(state.productUrl)) {
    productLink.href = state.productUrl;
  } else {
    productLink.href = '#';
    log('error', `Invalid URL skipped: ${state.productUrl}`, { component: 'applyState' });
  }

  productLink.target = '_blank';
  productLink.textContent = state.productName;
  exampleProductElement.appendChild(productLink);

  // Add a colon after the product if not MXN (MXN example doesn't have one)
  if (state.currencyCode !== 'MXN') {
    exampleProductElement.appendChild(document.createTextNode(': '));
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
  examplePriceElement.appendChild(priceContainer);
}

/**
 * Updates the copyright element in the DOM with the current year
 */
function applyCopyrightText() {
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

/**
 * Starts the interval timer that cycles through example currency displays
 */
function startExampleInterval() {
  setInterval(shiftExample, EXAMPLE_CYCLE_INTERVAL_MS);
}

/**
 * Initializes the application
 */
function initializeApplication() {
  startExampleInterval();
  applyCopyrightText();
}

// Expose to global scope
window.initializeApplication = initializeApplication;
