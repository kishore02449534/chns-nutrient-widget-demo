// CHNS nutrient analysis widget (UI prototype, demo data only).
// Add <div data-chns-widget data-product-id="..."> to a page and load this script.

(() => {
  if (window.chnsWidgetLoaded) return;
  window.chnsWidgetLoaded = true;

  const products = window.CHNS_DEMO_DATA || {};

  // Logo paths are resolved from this script's URL so the widget works from any page.
  const scriptUrl = document.currentScript ? document.currentScript.src : '';
  const baseUrl = scriptUrl.replace(/widget\/widget\.js.*$/, '');
  const markSrc = `${baseUrl}assets/usu/u-state-logo.svg`;
  const wordmarkSrc = `${baseUrl}assets/usu/utah-state-logo.svg`;

  const categories = [
    {
      id: 'all',
      label: 'All Nutrients',
      help: 'Every nutrient measured in this sample. Use the buttons above to narrow the list, or search by name.',
    },
    {
      id: 'vitamin',
      label: 'Vitamins',
      help: 'Vitamins are needed in small amounts, so they are usually listed in milligrams (mg) or micrograms (µg).',
    },
    {
      id: 'mineral',
      label: 'Minerals',
      help: 'Minerals such as iron and zinc come from soil, water and feed. Amounts can change between farms and seasons.',
    },
    {
      id: 'macro',
      label: 'Macronutrients',
      help: "Protein, fat and carbohydrate make up most of a food's weight and are listed in grams (g).",
    },
  ];

  const categoryNames = { vitamin: 'Vitamin', mineral: 'Mineral', macro: 'Macronutrient' };

  const state = { productId: null, category: 'all', query: '' };
  const ui = {};
  let openedFrom = null;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[ch]);
  }

  // "Ground Beef (Demo Product A, fictional)" -> { title: "Ground Beef", note: "Demo Product A, fictional" }
  function splitProductName(name) {
    const match = /^(.*?)\s*\((.*)\)\s*$/.exec(name);
    return match ? { title: match[1], note: match[2] } : { title: name, note: '' };
  }

  function findCategory(id) {
    return categories.find((c) => c.id === id);
  }

  function createBadge(container) {
    const productId = container.dataset.productId;
    const product = products[productId];
    const testMonth = product ? product.testDate.replace(/\s*\(placeholder\)/, '') : 'N/A';
    const summary = product ? `${product.nutrients.length} nutrients measured` : 'Results not available';

    container.classList.add('chns-root');
    container.innerHTML = `
      <button type="button" class="chns-badge" aria-haspopup="dialog">
        <span class="chns-badge-mark"><img src="${escapeHtml(markSrc)}" alt="Utah State University"></span>
        <span class="chns-badge-text">
          <span class="chns-badge-line1">
            Tested by CHNS in <span class="chns-pill">${escapeHtml(testMonth)}</span>
            <span class="chns-demo-tag">DEMO</span>
          </span>
          <span class="chns-badge-line2">${summary} <span aria-hidden="true">→</span></span>
        </span>
      </button>`;

    container.querySelector('button').addEventListener('click', (event) => {
      openDialog(productId, event.currentTarget);
    });
  }

  function createDialog() {
    const productOptions = Object.keys(products)
      .map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(splitProductName(products[id].name).title)}</option>`)
      .join('');

    const categoryButtons = categories
      .map((c) => `<button type="button" class="chns-tab" data-category="${c.id}" aria-pressed="false">${c.label}</button>`)
      .join('');

    const overlay = document.createElement('div');
    overlay.className = 'chns-root chns-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="chns-dialog" role="dialog" aria-modal="true" aria-labelledby="chns-title" tabindex="-1">
        <header class="chns-header">
          <span aria-hidden="true"></span>
          <div class="chns-brand">
            <img class="chns-wordmark" src="${escapeHtml(wordmarkSrc)}" alt="Utah State University">
            <span class="chns-brand-sub">Center for Human Nutrition Studies</span>
          </div>
          <button type="button" class="chns-close" aria-label="Close nutrient analysis">✕</button>
        </header>

        <div class="chns-demo-banner" role="note">DEMO: Not real CHNS laboratory results</div>

        <div class="chns-body">
          <h2 class="chns-title" id="chns-title" data-ref="title"></h2>
          <p class="chns-subtitle" data-ref="subtitle"></p>
          <p class="chns-intro">
            This preview shows how a CHNS nutrient analysis could appear on a product page.
            All values are made up for design review.
          </p>

          <label for="chns-product-select" class="chns-visually-hidden">Choose a product</label>
          <div class="chns-select-wrap">
            <select id="chns-product-select" class="chns-select">${productOptions}</select>
          </div>

          <div class="chns-tabs" role="group" aria-label="Nutrient category">${categoryButtons}</div>

          <div class="chns-panel">
            <div class="chns-help">
              <div class="chns-help-title" data-ref="helpTitle"></div>
              <p data-ref="helpText"></p>
            </div>

            <div class="chns-search-row">
              <div class="chns-search-wrap">
                <label for="chns-search" class="chns-visually-hidden">Search nutrients</label>
                <input id="chns-search" class="chns-search" type="search" placeholder="Search nutrients, e.g. iron" autocomplete="off">
                <button type="button" class="chns-clear" aria-label="Clear search" hidden>✕</button>
              </div>
              <button type="button" class="chns-reset">Reset</button>
            </div>

            <p class="chns-count" aria-live="polite" data-ref="count"></p>
            <div data-ref="results"></div>
          </div>

          <section class="chns-info" aria-labelledby="chns-info-heading">
            <h3 id="chns-info-heading">How to read these results</h3>
            <ul>
              <li><strong>Amount</strong> is the measured value. The <strong>unit</strong> is g (grams), mg (milligrams) or µg (micrograms).</li>
              <li>All amounts are <strong data-ref="basis"></strong> of product.</li>
              <li>Results describe one tested sample. Natural products vary, so other batches may differ.</li>
            </ul>
          </section>

          <section class="chns-approval" aria-labelledby="chns-approval-heading">
            <h3 id="chns-approval-heading">Testing information and approval</h3>
            <dl data-ref="approval"></dl>
            <div class="chns-signature">Signature placeholder</div>
            <div class="chns-sig-label">Authorized sign-off will appear here after verification.</div>
          </section>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    ui.overlay = overlay;
    ui.dialog = overlay.querySelector('.chns-dialog');
    ui.body = overlay.querySelector('.chns-body');
    ui.closeButton = overlay.querySelector('.chns-close');
    ui.productSelect = overlay.querySelector('.chns-select');
    ui.searchInput = overlay.querySelector('.chns-search');
    ui.clearButton = overlay.querySelector('.chns-clear');
    ui.resetButton = overlay.querySelector('.chns-reset');
    ui.tabs = [...overlay.querySelectorAll('.chns-tab')];
    overlay.querySelectorAll('[data-ref]').forEach((el) => {
      ui[el.dataset.ref] = el;
    });

    ui.closeButton.addEventListener('click', closeDialog);
    overlay.addEventListener('keydown', handleKeydown);
    // Close when the dimmed area is clicked, but not when a click starts inside the dialog.
    overlay.addEventListener('mousedown', (event) => {
      if (event.target === overlay) closeDialog();
    });

    ui.productSelect.addEventListener('change', () => {
      state.productId = ui.productSelect.value;
      renderProduct();
    });
    ui.searchInput.addEventListener('input', () => {
      state.query = ui.searchInput.value;
      renderResults();
    });
    ui.clearButton.addEventListener('click', () => {
      setQuery('');
      ui.searchInput.focus();
    });
    ui.resetButton.addEventListener('click', resetFilters);
    ui.tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        state.category = tab.dataset.category;
        renderResults();
      });
    });
    // The empty-state button is re-rendered each time, so listen on its parent.
    ui.results.addEventListener('click', (event) => {
      if (event.target.closest('.chns-empty-reset')) {
        resetFilters();
        ui.searchInput.focus();
      }
    });
  }

  function setQuery(query) {
    state.query = query;
    ui.searchInput.value = query;
    renderResults();
  }

  function resetFilters() {
    state.category = 'all';
    setQuery('');
  }

  function renderProduct() {
    const product = products[state.productId];

    if (!product) {
      ui.title.textContent = 'Product not found';
      ui.subtitle.textContent = 'No demo results exist for this product ID.';
      ui.results.innerHTML = '';
      ui.count.textContent = '';
      ui.approval.innerHTML = '';
      return;
    }

    const { title, note } = splitProductName(product.name);
    ui.productSelect.value = state.productId;
    ui.title.textContent = title;
    ui.subtitle.textContent = [note, product.client, `Sample ${product.sampleId}`].filter(Boolean).join(' · ');
    ui.basis.textContent = product.basis;
    ui.approval.innerHTML = `
      <dt>Approval status</dt><dd><span class="chns-status">Demo / Not verified</span></dd>
      <dt>Sample ID</dt><dd>${escapeHtml(product.sampleId)}</dd>
      <dt>Test date</dt><dd>${escapeHtml(product.testDate)}</dd>
      <dt>Testing lab</dt><dd>Center for Human Nutrition Studies (demo placeholder)</dd>
      <dt>Reviewed by</dt><dd>Placeholder, pending verification</dd>`;

    renderResults();
  }

  function renderResults() {
    const product = products[state.productId];
    if (!product) return;

    const category = findCategory(state.category);
    const query = state.query.trim();
    const needle = query.toLowerCase();

    ui.tabs.forEach((tab) => {
      tab.setAttribute('aria-pressed', String(tab.dataset.category === state.category));
    });
    ui.clearButton.hidden = state.query === '';
    ui.helpTitle.textContent = `Understanding ${category.label.toLowerCase()}`;
    ui.helpText.textContent = category.help;

    const inCategory = product.nutrients.filter((n) => state.category === 'all' || n.category === state.category);
    const matches = inCategory.filter((n) => n.name.toLowerCase().includes(needle));

    ui.count.textContent = `Showing ${matches.length} of ${inCategory.length} in ${category.label}`
      + (query ? ` matching "${query}"` : '');

    if (matches.length === 0) {
      const what = query ? `“${escapeHtml(query)}”` : 'this filter';
      ui.results.innerHTML = `
        <div class="chns-empty">
          <strong>No nutrients match ${what}</strong>
          Try a different spelling or another category.<br>
          <button type="button" class="chns-reset chns-empty-reset">Show all nutrients</button>
        </div>`;
      return;
    }

    const showCategoryTag = state.category === 'all';
    const rows = matches.map((n) => `
      <tr>
        <td>${escapeHtml(n.name)}${showCategoryTag ? `<span class="chns-cat-tag">${categoryNames[n.category]}</span>` : ''}</td>
        <td class="chns-num">${escapeHtml(n.amount)}</td>
        <td class="chns-unit">${escapeHtml(n.unit)}</td>
      </tr>`).join('');

    ui.results.innerHTML = `
      <table class="chns-table">
        <caption class="chns-visually-hidden">${category.label}, amounts ${escapeHtml(product.basis)}</caption>
        <thead>
          <tr>
            <th scope="col">Nutrient</th>
            <th scope="col" class="chns-num">Amount</th>
            <th scope="col" class="chns-unit">Unit</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function openDialog(productId, trigger) {
    openedFrom = trigger;
    state.productId = productId;
    state.category = 'all';
    state.query = '';
    ui.searchInput.value = '';

    renderProduct();
    ui.overlay.hidden = false;
    ui.body.scrollTop = 0;
    document.body.classList.add('chns-scroll-lock');
    ui.closeButton.focus();
  }

  function closeDialog() {
    ui.overlay.hidden = true;
    document.body.classList.remove('chns-scroll-lock');
    if (openedFrom) openedFrom.focus();
  }

  function getFocusableElements() {
    const selector = 'button, input, select, [href], [tabindex]:not([tabindex="-1"])';
    return [...ui.dialog.querySelectorAll(selector)]
      .filter((el) => !el.disabled && !el.hidden && el.offsetParent !== null);
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key !== 'Tab') return;

    // Keep keyboard focus inside the dialog while it is open.
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function init() {
    createDialog();
    document.querySelectorAll('[data-chns-widget]').forEach(createBadge);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
