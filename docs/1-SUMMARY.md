# CHNS Nutrient Analysis Widget: Summary

## What is it?

A small "Tested by CHNS" card that a farm or food company can put on its own product web page.
When a shopper clicks the card, a popup opens on the same page and shows the nutrient test
results for that product.

This version is a **design prototype**. It is for showing the look and the way it works.
All products and numbers in it are made up.

## What it was built with

- **HTML** for the page structure
- **CSS** for the colours, layout and phone view
- **JavaScript** for the clicking, filtering and searching

Nothing else. No frameworks, no installs, no database and no internet connection needed.

## What it shows

- A card with the USU "U State" logo, "Tested by CHNS in OCT 2026" and "14 nutrients measured"
- A popup with:
  - USU logo and "Center for Human Nutrition Studies" in a navy header
  - A yellow notice: "DEMO: Not real CHNS laboratory results"
  - The product name and a dropdown to switch products
  - Category buttons: All Nutrients, Vitamins, Minerals, Macronutrients
  - A short explanation box that changes with each category
  - A search box with a clear button, a result count and a "no match" message
  - A list of nutrients with amount and unit (for example: Iron, 2.2, mg)
  - "How to read these results"
  - A testing and approval section: "Approval status: Demo / Not verified" and a signature placeholder
- Works on computers and phones
- Works with the keyboard: Escape closes the popup, and Tab stays inside it while it is open

## What it does not show (on purpose)

- No scores, ratings or pass/fail
- No real signatures, names of lab staff, or accreditation seals
- No real lab data

## Logo

The USU logos are the official public files from usu.edu, used unchanged. They are white, so
they always sit on USU navy. Before any public use, USU's brand office must approve it.

## Two demo products

- Ground Beef (14 nutrients)
- Pasture Eggs (13 nutrients)

## How to open it

Unzip the folder and double-click `index.html`. It opens in a web browser.
Click either "Tested by CHNS" card.

## What comes next (after approval)

1. Code review
2. Save the work in Git
3. Later: a one-line code snippet that any website can paste in, and connecting real, approved data
