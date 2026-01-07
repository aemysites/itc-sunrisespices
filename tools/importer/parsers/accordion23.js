/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion wrapper
  const accWrap = element.querySelector('.accordion-component__acc--wrap');
  if (!accWrap) return;

  // Select all accordion items (including hidden ones)
  const items = accWrap.querySelectorAll('.accordion-component__acc--item');

  // Table header row: must match block name exactly
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Extract each accordion item (title and content)
  items.forEach(item => {
    // Title from button > span.accordion-component__acc--title
    let title = '';
    const btn = item.querySelector('button');
    if (btn) {
      const titleSpan = btn.querySelector('.accordion-component__acc--title');
      title = titleSpan ? titleSpan.textContent.trim() : btn.textContent.trim();
    }
    // Content from panel
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      content = panel;
    }
    // Only add if title is present
    if (title) {
      rows.push([title, content]);
    }
  });

  // Also include the Load More button as a separate row (second column)
  const btnWrap = element.querySelector('.accordion-component__btnwrap');
  if (btnWrap) {
    const loadMoreBtn = btnWrap.querySelector('button');
    if (loadMoreBtn) {
      rows.push(['', loadMoreBtn]);
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
