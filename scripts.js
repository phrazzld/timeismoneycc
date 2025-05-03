setInterval(shiftExample, 4000);

function shiftExample() {
  var currencyCode = document.getElementById('currency-code');
  var currencySymbol = document.getElementById('currency-symbol');
  var incomeAmount = document.getElementById('income-amount');
  var payFrequency = document.getElementById('pay-frequency');
  var exampleProduct = document.getElementById('example-product');
  var examplePrice = document.getElementById('example-price');
  var isDefaultConfig = is(currencyCode, 'USD') && is(currencySymbol, '$') && is(payFrequency, 'hourly');
  var isWealthyUSD = is(currencyCode, 'USD') && is(currencySymbol, '$') && is(payFrequency, 'yearly');
  var isGBP = is(currencyCode, 'GBP') && is(currencySymbol, '£');
  var isEuro = is(currencyCode, 'EUR') && is(currencySymbol, '€');
  // Handle first transition: USD $ 15.00 hourly -> USD $ 100,000.00 yearly
  if (isDefaultConfig) {
    incomeAmount.textContent = '50,756.00';
    payFrequency.textContent = 'yearly';
    examplePrice.innerHTML = '<span class=\'example-money\'><span>$</span>445.00 (18h 15m)</span>';
  } else if (isWealthyUSD) {
    currencyCode.textContent = 'GBP';
    currencySymbol.textContent = '£';
    incomeAmount.textContent = '26,500.00';
    exampleProduct.innerHTML = '<a href=\'https://www.britishfoodstoreonline.co.uk/products/McCoy%27s-Salted-Ridge-Cut-Potato-Crisps-30-x-50G.html\' target=\'_blank\'>Bulk crisps</a>: ';
    examplePrice.innerHTML = '<span class=\'example-money\'><span>£</span>24.99 (1h 58m)</span>';
  } else if (isGBP) {
    // Switch to x xxx,xx € notation and amazon.fr link
    currencyCode.textContent = 'EUR';
    currencySymbol.textContent = '€';
    incomeAmount.textContent = '9,61';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML = '<a href=\'http://amzn.to/2kEgPj2\' target=\'_blank\'>Kindle Paperwhite</a>: ';
    examplePrice.innerHTML = '<span class=\'example-money\'>99,99 <span>EUR</span> (10h 25m)</span>';
  } else if (isEuro) {
    // Switch to MXN $ and Spanish product
    currencyCode.textContent = 'MXN';
    currencySymbol.textContent = '$';
    incomeAmount.textContent = '31.30';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML = '<a href=\'http://bit.ly/2ldKpPN\' target=\'_blank\'>Licuadora Oster</a>';
    examplePrice.innerHTML = '<span class=\'example-money\'><span>$</span>1,149.00 (36h 43m)</span>';
  } else {
    currencyCode.textContent = 'USD';
    currencySymbol.textContent = '$';
    incomeAmount.textContent = '7.25';
    payFrequency.textContent = 'hourly';
    exampleProduct.innerHTML = '<a href=\'https://shop.libiquity.com/product/taurinus-x200\' target=\'_blank\'>Taurinus X200</a>: ';
    examplePrice.innerHTML = '<span class=\'example-money\'><span>$</span>445.00 (61h 23m)</span>';
  }
}

function is(element, val) {
  return element.textContent == val;
}

document.getElementById('copyright').innerHTML = 'Copyright \u00A9 ' + new Date().getFullYear() + ' <a href=\'https://www.phaedrus.io\' target=\'_blank\'>Phaedrus</a>';
