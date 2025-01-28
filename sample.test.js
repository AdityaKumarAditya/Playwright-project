const { test, expect, chromium } = require('@playwright/test');
const robot = require('robotjs');  // Importing robotjs for simulating keyboard actions

test('Dropdown Validation and Work Email Field Interaction', async ({ page }) => {
  // Step 1: Launch Chrome browser
  const chrome = await chromium.launch({ headless: false });  // headless: false allows you to see the browser
  const chromePage = await chrome.newPage();
  
  // Step 2: Simulate Alt + Space followed by X to maximize the window using robotjs
  robot.keyTap('space', 'alt');  // Press Alt + Space to open the system menu
  robot.keyTap('x');  // Press 'X' to maximize the window
  
  // Step 3: Open the sign-up page
  await chromePage.goto('https://app.circula.com/users/sign_up');
  
  // Step 3: Wait for and accept the cookie popup (if it exists)
  const cookieAcceptButton = chromePage.locator('button:has-text("Accept")');
  
  // Wait for the cookie button to be visible (and also clickable)
  await cookieAcceptButton.waitFor({ state: 'visible', timeout: 5000 }); // Wait for up to 5 seconds
  
  // Check if the button is visible and then click it
  if (await cookieAcceptButton.isVisible()) {
    await cookieAcceptButton.click();  // Click 'Accept' on the cookie popup if it's visible
  }
  
  // Step 4: Verify that the page title is correct after accepting the cookies
  const pageTitle = await chromePage.title();  // Get the page title
  console.log("Page Title:", pageTitle);  // Log the title to the console
  await expect(chromePage).toHaveTitle(/Signup - Circula/);  // Adjust the title to match the actual page title
  
  // Step 5: Verify that the text 'Start your 14-day free trial' is present on the page
  const trialTextLocator = chromePage.locator('text=Start your 14-day free trial');
  const trialText = await trialTextLocator.textContent();  // Get the text content
  console.log("Trial Text:", trialText);  // Log the trial text to the console
  await expect(trialTextLocator).toHaveText('Start your 14-day free trial');  // Verify the text is present
  
  // Step 6: Verify the "Work email" field becomes editable after accepting cookies
  const workEmailField = chromePage.locator('input[name="email"]');  // Assuming the name attribute for email is 'email'
  
  // Wait for the field to become visible and check if it's editable (i.e., it's ready to receive input)
  await workEmailField.waitFor({ state: 'visible', timeout: 5000 });
  const isEditable = await workEmailField.isEditable();
  
  // Log the result
  if (isEditable) {
    console.log("Work email field is editable.");
    
    // Step 6: Enter an invalid email address (e.g., Gmail) to simulate invalid input
    await workEmailField.fill('aditya.kumar@gmail.com');  // This should be invalid based on your condition
    console.log("Invalid email entered: aditya.kumar@gmail.com");
    
    // Step 7: Enter an invalid password (e.g., "Circula" which does not meet password conditions)
    const passwordField = chromePage.locator('input[name="password"]');
    await passwordField.fill('Circula');  // Invalid password based on your condition
    console.log("Invalid password entered: Circula");
	
	  // Step 8: Check the "Accept Terms and Conditions" checkbox
  const termsCheckbox = chromePage.locator('//input[@type="checkbox" and @name="acceptTos"]');
  await chromePage.evaluate(() => {
    const checkbox = document.querySelector('input[name="acceptTos"]');
    if (!checkbox.checked) {
      checkbox.click(); // Programmatically check the checkbox
      console.log("Checkbox is now checked.");
		}
	})
	  // Step 9: Click on the "Try for free" button
	const tryForFreeButton = chromePage.locator('//button[contains(text(), "Try for free")]');
	await tryForFreeButton.click();
	console.log('Clicked on the "Try for free" button.');
  
	
	  // Step 9: Check if the "Try for free" button is disabled
    const disabledCheck = chromePage.locator('//button[contains(text(), "Try for free")]');
    const isButtonDisabled = await disabledCheck.isDisabled();  // Check if the button is disabled
    
    if (isButtonDisabled) {
      console.log("Entered email address and password are incorrect. Enter the correct email address and password.");
    } else {
      await disabledCheck.click();  // If the button is not disabled, click it
      console.log('Clicked on the "Try for free" button.');
    }
	
	// Wait for the validation errors to appear
    await page.waitForTimeout(2000);  // Wait for the errors to show up
    
    // Now, we will enter the valid email and password after the errors show up
    console.log("Entering valid email and password...");
    
    // Step 10: Re-enter the correct work email address
    await workEmailField.fill('aditya.kumar@genisys-group.com');  // Enter valid email address
    console.log("Valid email entered: aditya.kumar@genisys-group.com");
    
    // Step 11: Enter a valid password (which satisfies the conditions)
    await passwordField.fill('Circula123');  // Enter valid password based on conditions
    console.log("Valid password entered: Circula123");
    
    // Step 12: Re-click the "Try for free" button (it should now be enabled)
    await tryForFreeButton.click();
    console.log("Clicked on 'Try for free' button with valid inputs.");
  } else {
    console.log("Work email field is not editable.");
  }
  
  
   // Test Case 1: Verify "Your contact details" text
  const step2TextLocator = chromePage.locator('text=Your contact details');
  await expect(step2TextLocator).toBeVisible();
  console.log('Navigated to Step 2 and verified text "Your contact details"');
  
  // Negative Test Case: Click "Next step" before entering first name, last name, and phone number
  const nextStepButton = chromePage.locator('button.sc-7f49027d-0.gZLAHz');
  const isNextStepButtonEnabled = await nextStepButton.isEnabled();

  if (isNextStepButtonEnabled) {
    // Click on the "Next step" button without filling the required fields
    await nextStepButton.click();
    console.log('Clicked on the "Next step" button without entering the details.');
    
    // Verify if an error message or validation is shown
    const errorMessage = chromePage.locator('text=First name is required.'); // Adjust this to match the actual error message on your app
    await expect(errorMessage).toBeVisible();
    console.log('Error message or validation is shown, as expected.');
  } else {
    console.log('The "Next step" button is disabled.');
  }

// Test Case 2: Fill in first name, last name, and phone number
  const firstNameField = chromePage.locator('input[name="firstname"]');
  const lastNameField = chromePage.locator('input[name="lastname"]');
  const phoneNumberField = chromePage.locator('input[name="phoneNumber"]');
  
	await firstNameField.waitFor({ state: 'visible', timeout: 5000 });
	await firstNameField.fill('Aditya');
	await page.waitForTimeout(2000);  // Wait 1 second after entering first name
   
	await lastNameField.waitFor({ state: 'visible', timeout: 5000 });
	await lastNameField.fill('Kumar');
	await page.waitForTimeout(2000);  // Wait 1 second after entering first name
   
	await phoneNumberField.waitFor({ state: 'visible', timeout: 5000 });
	await phoneNumberField.fill('1234567890');
	await page.waitForTimeout(2000);  // Wait 1 second after entering first name
  
  console.log('Filled first name, last name, and phone number.');
  
  
    // Check if the "Next step" button is enabled and click it if enabled
  const nextStepButtonn = chromePage.locator('button.sc-7f49027d-0.gZLAHz');
  const isNextStepButtonnEnabled = await nextStepButtonn.isEnabled();

  if (isNextStepButtonnEnabled) {
    await nextStepButtonn.click();
    console.log('Clicked on the "Next step" button.');
  } else {
    console.log('The "Next step" button is disabled.');
  }
  
  // Step 2: Wait for the "Company information" text to appear
const step3TextLocator = chromePage.locator('text=Company information');
await step3TextLocator.waitFor({ state: 'visible', timeout: 5000 });  // Wait for up to 5 seconds

// Step 3: Verify that the "Company information" text is visible
await expect(step3TextLocator).toBeVisible();
console.log('Verified that "Your contact details" text is visible on step 3.');
  await page.waitForTimeout(3000); 
  
  
  
  // Step: Enter the company name in the input field
const companyNameField = chromePage.locator('input[name="organizationName"]');
await companyNameField.fill('Circula');  // Replace with the actual company name
console.log('Entered company name: Circula');
   await page.waitForTimeout(3000); 
  
 
// Step: Click on the dropdown to open it
const dropdown = chromePage.locator('input[name="country"]');
await dropdown.click();
console.log('Clicked on the dropdown.');

// Step: Use evaluate() to select Sweden
await chromePage.evaluate(() => {
  const options = document.querySelectorAll('li[role="option"]');
  const swedenOption = Array.from(options).find(option => option.textContent === 'Sweden');
  if (swedenOption) {
    swedenOption.click();
  }
});
console.log('Selected Sweden from the dropdown.');
  
  // Close the browser
  await chrome.close();

  
   
  
  
  });