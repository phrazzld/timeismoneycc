setInterval(shiftExample, 4000);

/**
 * Updates the example display to show different currency and income scenarios.
 * Cycles through different examples of prices converted to work hours.
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

  // Handle first transition: USD $ 15.00 hourly -> USD $ 100,000.00 yearly
  if (isDefaultConfig) {
    incomeAmount.textContent = '50,756.00';
    payFrequency.textContent = 'yearly';
    examplePrice.innerHTML = '<span class="example-money"><span>$</span>445.00 (18h 15m)</span>';
  } else if (isWealthyUSD) {
    currencyCode.textContent = 'GBP';
    currencySymbol.textContent = '£';
    incomeAmount.textContent = '26,500.00';
    exampleProduct.innerHTML =
      '<a href="https://www.britishfoodstoreonline.co.uk/products/McCoy%27s-Salted-Ridge-Cut-Potato-Crisps-30-x-50G.html" target="_blank">Bulk crisps</a>: ';
    examplePrice.innerHTML = '<span class="example-money"><span>£</span>24.99 (1h 58m)</span>';
  } else if (isGBP) {
    // Switch to x xxx,xx € notation and amazon.fr link
    currencyCode.textContent = 'EUR';
    currencySymbol.textContent = '€';
    incomeAmount.textContent = '9,61';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML =
      '<a href="http://amzn.to/2kEgPj2" target="_blank">Kindle Paperwhite</a>: ';
    examplePrice.innerHTML = '<span class="example-money">99,99 <span>EUR</span> (10h 25m)</span>';
  } else if (isEuro) {
    // Switch to MXN $ and Spanish product
    currencyCode.textContent = 'MXN';
    currencySymbol.textContent = dollarSign;
    incomeAmount.textContent = '31.30';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML =
      '<a href="http://bit.ly/2ldKpPN" target="_blank">Licuadora Oster</a>';
    examplePrice.innerHTML = '<span class="example-money"><span>$</span>1,149.00 (36h 43m)</span>';
  } else {
    currencyCode.textContent = 'USD';
    currencySymbol.textContent = dollarSign;
    incomeAmount.textContent = '7.25';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML =
      '<a href="https://shop.libiquity.com/product/taurinus-x200" target="_blank">Taurinus X200</a>: ';
    examplePrice.innerHTML = '<span class="example-money"><span>$</span>445.00 (61h 23m)</span>';
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

// Set copyright year in footer
const copyrightElement = document.getElementById('copyright');
if (copyrightElement) {
  copyrightElement.innerHTML =
    'Copyright \u00A9 ' +
    new Date().getFullYear() +
    ' <a href="https://www.phaedrus.io" target="_blank">Phaedrus</a>';
}
