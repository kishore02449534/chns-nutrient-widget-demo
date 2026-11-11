# 01: CHNS Nutrient Analysis Widget (UI prototype)

**Status: UI-only demo, waiting for design review.**
All products and numbers are fictional. Nothing here is a real CHNS laboratory result.

## Quick look (no setup)

Unzip the folder and double-click `index.html`. It opens in your web browser.
Click either "Tested by CHNS" card to open the popup.

## Run it with a local server (optional)

From the workspace root (`CHNS kishore's workspace`):

```bash
lsof -i :8765          # nothing printed means the port is free (pick another if busy)
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8765/01-Nutrient-Widget/index.html>. Stop the server with `Ctrl+C`.

No installs, frameworks, network calls or databases are used.

## Files

```
01-Nutrient-Widget/
├── index.html            pretend client shop page with two widget cards
├── README.md
├── docs/
│   ├── 1-SUMMARY.md          short overview in plain language
│   └── 2-STEP-BY-STEP.md     detailed guide: steps, files, tests, glossary
├── assets/usu/
│   ├── u-state-logo.svg      USU "U State" mark (white, from usu.edu, unedited)
│   ├── utah-state-logo.svg   USU wordmark (white, from usu.edu, unedited)
│   └── SOURCE.txt            where the logo files came from and usage notes
└── widget/
    ├── demo-data.js      two fictional demo products
    ├── widget.css        widget styles (all classes start with "chns-")
    └── widget.js         card + popup behaviour
```

## How a client page uses it (today)

```html
<link rel="stylesheet" href="widget/widget.css">
<div data-chns-widget data-product-id="demo-beef"></div>
<script src="widget/demo-data.js"></script>
<script src="widget/widget.js"></script>
```

## What's included

- **Card on the product page:** navy tile with the USU "U State" mark, "Tested by CHNS in OCT 2026"
  (date is a placeholder), a "DEMO" tag, and "14 nutrients measured →".
- **Popup:** navy header with the USU wordmark and "Center for Human Nutrition Studies", close button,
  yellow "DEMO: Not real CHNS laboratory results" banner, large product name, short intro,
  product dropdown, category pills (All Nutrients, Vitamins, Minerals, Macronutrients),
  an "Understanding ..." box that changes with the category, search with clear and reset,
  result count, empty state, results table (nutrient, amount, unit), a "How to read these results"
  panel, and a testing/approval section with "Approval status: Demo / Not verified" and a signature placeholder.
- **Accessibility:** close button, Escape closes, clicking the dimmed background closes,
  focus moves into the popup, stays inside while open, and returns to the card.
- **Phones (about 375 px):** the popup fills the screen and the category pills scroll sideways.

## Logo use

The two logo files are the public white versions shown on usu.edu. They are used unedited, at their
original proportions, on USU navy. Official files live in the USU Logo Library (staff login), and any
public use needs approval from University Marketing and Communications. See `assets/usu/SOURCE.txt`.

## Not included on purpose

- No nutrient scores, density scores, pass/fail, check marks, safety ratings, % Daily Value,
  real signatures, lab director names or accreditation seals.
- No `embed.js` one-line loader, iframe isolation, second client site, real data, React, backend,
  publishing or deployment. These wait until the UI is approved.
