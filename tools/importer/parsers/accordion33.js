/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Find the accordion items container
  const accWrap = element.querySelector('.accordion-component__acc--wrap');
  if (accWrap) {
    // Find all accordion items (visible and hidden)
    const items = accWrap.querySelectorAll('.accordion-component__acc--item');
    items.forEach((item) => {
      // Title cell: find the button with the title span
      const btn = item.querySelector('button');
      let titleSpan = btn && btn.querySelector('.accordion-component__acc--title');
      let titleCell = titleSpan ? titleSpan : btn;

      // Content cell: find the panel
      const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
      let contentCell = null;
      if (panel) {
        const cmpText = panel.querySelector('.cmp-text');
        contentCell = cmpText ? cmpText : panel;
      }
      if (titleCell && contentCell) {
        rows.push([titleCell, contentCell]);
      }
    });
  }

  // Find the Load More button (outside accordion items)
  const loadMoreWrap = element.querySelector('.accordion-component__btnwrap');
  let loadMoreBtn = null;
  if (loadMoreWrap) {
    loadMoreBtn = loadMoreWrap.querySelector('button');
  }

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element with table and Load More button (if present)
  if (loadMoreBtn) {
    element.replaceWith(table, loadMoreBtn);
  } else {
    element.replaceWith(table);
  }
}
