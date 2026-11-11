# CHNS Nutrient Analysis Widget: Step by Step

This guide explains how the prototype was built, one step at a time, and how each file works.
For a one-page overview, see `1-SUMMARY.md`.

## Part 1: The goal

CHNS (Center for Human Nutrition Studies) tests foods for their nutrients. Clients such as farms
want to show those results to shoppers on their own websites.

The idea:

1. The client adds a small piece of code to their product page.
2. A "Tested by CHNS" card appears on that page.
3. A shopper clicks the card.
4. A popup opens on the same page with the nutrient results for that product.

This first version only builds the **look and behaviour** (the user interface). It uses made-up
data so the design can be reviewed safely before any real data is involved.

### Rules followed throughout

- Made-up demo data only. No real lab or participant data.
- A clear "DEMO" notice everywhere results appear.
- No scores, ratings, pass/fail, real signatures or accreditation seals.
- No databases, no internet services, no installs, no publishing.
- The USU logo is never redrawn, recoloured or stretched.

## Part 2: The steps

### Step 1: Set up the project folder

A new folder called `01-Nutrient-Widget` was created inside the workspace. Everything for this
project lives there, so it stays separate from other projects.

### Step 2: Create the demo data

File: `widget/demo-data.js`

Two fictional products were written down as a simple list:

- **Ground Beef** from "Example Farm Co." with 14 nutrients
- **Pasture Eggs** from "Sample Hen House" with 13 nutrients

Each nutrient has four things:

| Field    | Example  | Meaning                                     |
|----------|----------|---------------------------------------------|
| name     | Iron     | The nutrient                                |
| category | mineral  | Which button it belongs to                  |
| amount   | 2.2      | The measured number                         |
| unit     | mg       | g (grams), mg (milligrams) or µg (micrograms) |

All amounts are "per 100 g" of product.

### Step 3: Build a pretend client web page

File: `index.html`

To show the widget in a realistic place, a fake shop page was made for "Example Farm Co." with a
product photo placeholder, a price and an "Add to cart" button. It has two widget cards, one for
each product, to prove the widget shows the right data for each product.

The only lines a client would need are:

```html
<div data-chns-widget data-product-id="demo-beef"></div>
<script src="widget/demo-data.js"></script>
<script src="widget/widget.js"></script>
```

### Step 4: Build the card (the "badge")

The card is what shoppers see first on the product page:

- Left: a navy square with the USU "U State" logo
- Right: "Tested by CHNS in OCT 2026", a small "DEMO" tag, and "14 nutrients measured →"

The JavaScript finds every spot on the page marked `data-chns-widget` and fills it with a card.

### Step 5: Build the popup

When a card is clicked, a popup opens and the page behind it goes dim. From top to bottom:

1. **Header:** USU wordmark, "Center for Human Nutrition Studies", and a close button (✕)
2. **Demo notice:** "DEMO: Not real CHNS laboratory results"
3. **Product name** and a short line: product note, client name and sample ID
4. **Short intro** saying the values are made up for design review
5. **Product dropdown** to switch between Ground Beef and Pasture Eggs
6. **Category buttons:** All Nutrients, Vitamins, Minerals, Macronutrients
7. **"Understanding ..." box** that explains the selected category in plain words
8. **Search box** with a clear button (✕) and a Reset button
9. **Result count**, for example "Showing 5 of 14 in Minerals"
10. **Results table:** Nutrient, Amount, Unit
11. **"How to read these results"** box
12. **Testing information and approval:** status "Demo / Not verified", sample ID, test date,
    testing lab, reviewer placeholder, and a dashed signature placeholder

### Step 6: Make filtering and searching work

- Clicking a category button shows only nutrients in that group.
- Typing in the search box filters by name as you type ("iron" shows Iron).
- If nothing matches, a friendly message appears with a "Show all nutrients" button.
- The count updates every time.

### Step 7: Make it accessible (usable for everyone)

- The close button is clearly visible.
- The **Escape** key closes the popup.
- Clicking the dark area outside the popup closes it.
- When the popup opens, keyboard focus moves into it.
- While it is open, the **Tab** key cycles only through the popup's controls.
- When it closes, focus goes back to the card that opened it.
- Screen readers get proper labels for buttons, the search box and the table.

### Step 8: Make it work on phones

At phone width (about 375 pixels), the popup fills the whole screen, the category buttons can be
scrolled sideways, and nothing spills off the edge of the screen.

### Step 9: Run it locally and test it

The page was served on the computer with Python's built-in web server:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then it was opened at `http://127.0.0.1:8765/01-Nutrient-Widget/index.html` and tested in a
browser (see Part 4 for the full checklist).

### Step 10: First review and changes

After the first review, these changes were made:

- **Real USU logo.** The official white logo files were taken from the public usu.edu website
  (https://www.usu.edu/brand/standards/logos/logos-and-wordmarks). The official Logo Library needs
  a USU staff login, so these public files were used. They are not edited. Because they are white,
  they are always placed on USU navy. Details are in `assets/usu/SOURCE.txt`.
- **New layout** inspired by a common product-testing popup style seen on other shop sites:
  a card with a logo tile, a centred product title, a wide dropdown, rounded category buttons and
  an explanation box. Only the general layout idea was used, not anyone else's brand or graphics.
  Green check marks were left out because they suggest pass/fail.
- **Writing style.** Long dashes were removed from all text.
- **Phone fix.** The product dropdown now shows a short name so it fits on small screens.

### Step 11: Code cleanup

The JavaScript was rewritten in a clear, modern style: plain names, short comments only where a
reason needs explaining, and no decorative comment lines. The look and behaviour stayed the same,
and all tests were run again.

### Step 12: Package for sharing

The whole folder was zipped so it can be emailed. The receiver unzips it and double-clicks
`index.html`. No setup is needed.

## Part 3: How each file works

```
01-Nutrient-Widget/
├── index.html              Pretend client shop page with two widget cards
├── README.md               Technical notes and run steps
├── docs/
│   ├── 1-SUMMARY.md        One-page overview
│   └── 2-STEP-BY-STEP.md   This guide
├── assets/usu/
│   ├── u-state-logo.svg    USU "U State" mark (white)
│   ├── utah-state-logo.svg USU wordmark (white)
│   └── SOURCE.txt          Where the logos came from and usage rules
└── widget/
    ├── demo-data.js        The two fictional products
    ├── widget.css          All the styling
    └── widget.js           All the behaviour
```

### `widget/widget.js` (the behaviour)

The main parts, in the order they run:

| Part                 | What it does                                                        |
|----------------------|---------------------------------------------------------------------|
| `init`               | Starts everything once the page has loaded                          |
| `createDialog`       | Builds the popup once and hides it until needed                     |
| `createBadge`        | Fills each `data-chns-widget` spot with a card                      |
| `openDialog`         | Shows the popup for the clicked product and moves focus into it     |
| `renderProduct`      | Fills in the product name, details and approval section             |
| `renderResults`      | Applies the category and search, then draws the table or empty message |
| `closeDialog`        | Hides the popup and returns focus to the card                       |
| `handleKeydown`      | Escape closes; Tab stays inside the popup                           |
| `escapeHtml`         | Makes text safe before putting it on the page                       |
| `splitProductName`   | Splits "Ground Beef (Demo Product A, fictional)" into title and note |

It also remembers three things while the popup is open: which product, which category, and the
search text.

The script protects itself from running twice if a page loads it twice.

### `widget/widget.css` (the styling)

- Every class name starts with `chns-` so it will not clash with the client's own website styles.
- Colours: USU navy (`#0f2439`), white, soft greys, and yellow for demo notices.
- Logos are sized by width only, so their proportions never change.
- A phone section at the bottom changes the layout for screens narrower than 560 pixels.

### `widget/demo-data.js` (the data)

A simple list of the two made-up products. Later, this is the part that would be replaced by real,
approved data from CHNS.

### `index.html` (the test page)

A fake shop page. It is not part of the widget. It only shows the widget in a realistic setting.

## Part 4: Testing checklist

All of these were tested in a web browser and passed:

| Check                                              | Result |
|----------------------------------------------------|--------|
| Card opens the popup                               | Pass   |
| Each category button filters the list              | Pass   |
| Search finds a nutrient by name                    | Pass   |
| Search with no match shows the empty message       | Pass   |
| Clear (✕) and Reset buttons restore the full list  | Pass   |
| Product dropdown switches products                 | Pass   |
| Close button closes the popup                      | Pass   |
| Escape key closes the popup                        | Pass   |
| Clicking outside the popup closes it               | Pass   |
| Focus moves into the popup and back to the card    | Pass   |
| Tab key stays inside the popup                     | Pass   |
| Phone width (375 px): nothing spills off screen    | Pass   |
| Logos load at the right proportions                | Pass   |
| No errors in the browser console                   | Pass   |
| Unzipped copy opens by double-clicking index.html  | Pass   |

## Part 5: Simple glossary

| Term          | Meaning                                                              |
|---------------|----------------------------------------------------------------------|
| HTML          | The structure of a web page (headings, buttons, tables)              |
| CSS           | The look of a web page (colours, sizes, layout)                      |
| JavaScript    | The behaviour of a web page (what happens when you click or type)    |
| Widget        | A small, self-contained piece that can be added to any website       |
| Badge / card  | The small "Tested by CHNS" box on the product page                   |
| Popup / dialog| The window that opens on top of the page                             |
| Prototype     | An early working version used to review the design                   |
| localhost / 127.0.0.1 | Your own computer acting as a web server, only visible to you |
| SVG           | An image format that stays sharp at any size; used for the logos     |
| Accessibility | Making sure people using keyboards or screen readers can use it      |

## Part 6: What comes next

1. Design approval
2. Code review
3. Save the project in Git
4. Later, only with approval:
   - A one-line code snippet clients can paste into Shopify, WordPress or any site
   - Running the widget in an isolated frame so it cannot affect the client's site
   - Connecting real, verified CHNS results through an approved data source
   - USU brand approval before any public use
