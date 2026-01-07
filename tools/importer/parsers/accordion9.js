/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion9)'];
  const rows = [headerRow];

  // Find the accordion items container
  const accWrap = element.querySelector('.accordion-component__acc--wrap');
  if (accWrap) {
    const items = accWrap.querySelectorAll('.accordion-component__acc--item');
    items.forEach((item) => {
      // Title cell: find the button and its title span
      const button = item.querySelector('button');
      let titleContent = '';
      if (button) {
        const titleSpan = button.querySelector('.accordion-component__acc--title');
        titleContent = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
      }
      // Content cell: find the panel
      let contentCell = '';
      const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
      if (panel) {
        const cmpText = panel.querySelector('.cmp-text');
        if (cmpText) {
          contentCell = cmpText.cloneNode(true);
        } else {
          contentCell = panel.cloneNode(true);
        }
      }
      if (titleContent && contentCell) {
        rows.push([titleContent, contentCell]);
      }
    });
  }

  // Find the Load More button (outside accordion items)
  const loadMoreBtnWrap = element.querySelector('.accordion-component__btnwrap');
  if (loadMoreBtnWrap) {
    const loadMoreBtn = loadMoreBtnWrap.querySelector('button');
    if (loadMoreBtn) {
      // Add the button text as a separate row, single cell
      rows.push([loadMoreBtn.textContent.trim(), '']);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
