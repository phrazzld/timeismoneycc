# T005 · Refactor shiftExample Implementation Plan

## Objective

Refactor the `shiftExample` function to better separate concerns, making it only wire together pure logic and DOM manipulation.

## Current Implementation

Currently, the `shiftExample` function:

1. Gets DOM elements directly using `document.getElementById`
2. Validates that all required elements exist
3. Computes the next state using the pure function `getNextState`
4. Applies the state to the DOM using `applyState` with multiple element parameters

## Refactoring Approach

1. Extract the DOM element retrieval and validation into a separate function:

   ```typescript
   interface DOMElements {
     currencyCode: HTMLElement;
     currencySymbol: HTMLElement;
     incomeAmount: HTMLElement;
     payFrequency: HTMLElement;
     exampleProduct: HTMLElement;
     examplePrice: HTMLElement;
   }

   function getRequiredDOMElements(): DOMElements | null {
     const currencyCode = document.getElementById('currency-code');
     const currencySymbol = document.getElementById('currency-symbol');
     const incomeAmount = document.getElementById('income-amount');
     const payFrequency = document.getElementById('pay-frequency');
     const exampleProduct = document.getElementById('example-product');
     const examplePrice = document.getElementById('example-price');

     if (
       !currencyCode ||
       !currencySymbol ||
       !incomeAmount ||
       !payFrequency ||
       !exampleProduct ||
       !examplePrice
     ) {
       return null;
     }

     return {
       currencyCode,
       currencySymbol,
       incomeAmount,
       payFrequency,
       exampleProduct,
       examplePrice,
     };
   }
   ```

2. Refactor the `shiftExample` function to use these extracted functions:

   ```typescript
   export function shiftExample(): void {
     // Get DOM elements
     const elements = getRequiredDOMElements();
     if (!elements) {
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
   ```

## Benefits

1. Clear separation of concerns:
   - DOM element retrieval and validation
   - State computation (pure logic)
   - DOM updates
2. Improved readability of the `shiftExample` function
3. Better testability of each concern
4. Preparation for future tasks that will further simplify the DOM API
