/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion4)'];

  // Find the accordion items container
  const accWrap = element.querySelector('.accordion-component__acc--wrap');
  if (!accWrap) return;

  // Select all accordion items (including those with d-none)
  const items = Array.from(accWrap.querySelectorAll('.accordion-component__acc--item'));

  // Build rows for each accordion item
  const rows = items.map(item => {
    // Title cell: find the button and its title span
    const btn = item.querySelector('button');
    let titleSpan = btn ? btn.querySelector('.accordion-component__acc--title, .cmp-accordion__title') : null;
    // Defensive: fallback to button text if span not found
    let titleContent = titleSpan ? titleSpan : btn;

    // Content cell: find the panel and its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = null;
    if (panel) {
      // Use the inner .cmp-text div if present, else the panel itself
      const cmpText = panel.querySelector('.cmp-text');
      contentCell = cmpText ? cmpText : panel;
    }
    return [titleContent, contentCell];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Find the Load More button (outside accordion items)
  const btnWrap = element.querySelector('.accordion-component__btnwrap');
  if (btnWrap) {
    const loadMoreBtn = btnWrap.querySelector('button');
    if (loadMoreBtn) {
      // Place the button after the block (not inside the table)
      const wrapper = document.createElement('div');
      wrapper.appendChild(block);
      wrapper.appendChild(loadMoreBtn);
      element.replaceWith(wrapper);
      return;
    }
  }

  element.replaceWith(block);
}
