const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false }); // Open browser
    const page = await browser.newPage(); // Create a new page
    await page.goto('https://example.com'); // Go to a website
    console.log(await page.title()); // Print the page title in the terminal
    await browser.close(); // Close the browser
})();
