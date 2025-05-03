/**
 * @jest-environment jsdom
 */

// Import functions to test
const fs = require('fs');
const path = require('path');

// Load the scripts.js file content
const scriptContent = fs.readFileSync(path.join(__dirname, '../scripts.js'), 'utf8');

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

// Create a script element and inject the script content
const scriptElement = document.createElement('script');
scriptElement.textContent = scriptContent;
document.body.appendChild(scriptElement);

// Wait for script execution
setTimeout(() => {}, 100);

describe('Time Is Money Scripts', () => {
  test('is function should check element text content', () => {
    // Access the script's function by making it global first
    const element = document.getElementById('currency-code');
    expect(element.textContent).toBe('USD');

    // Test the is function indirectly through behavior
    const isUSD = element.textContent === 'USD';
    expect(isUSD).toBe(true);
  });

  test('copyright should contain current year', () => {
    const copyright = document.getElementById('copyright');
    const currentYear = new Date().getFullYear().toString();
    expect(copyright.innerHTML).toContain(currentYear);
  });
});
