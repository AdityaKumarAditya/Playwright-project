const { chromium } = require('playwright');  // Import Playwright

(async () => {
  const browser = await chromium.launch();  // Launch the browser
  const page = await browser.newPage();     // Open a new page
  await page.goto('https://example.com');   // Go to a website
  const title = await page.title();         // Get the page title
  console.log('Page Title:', title);        // Print the title in the console
  await browser.close();                    // Close the browser
})();
