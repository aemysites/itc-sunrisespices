/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion23)'];

  // Find the main accordion container
  const accordionWrap = element.querySelector('.accordion-component__acc--wrap');
  if (!accordionWrap) return;

  // Get ALL accordion items (including those with d-none)
  const items = Array.from(accordionWrap.querySelectorAll('.accordion-component__acc--item'));

  // Build rows for each accordion item
  const rows = items.map(item => {
    // Title cell: find the button with the title span
    const button = item.querySelector('button');
    let titleSpan = button && button.querySelector('.accordion-component__acc--title');
    let titleContent = titleSpan ? titleSpan.textContent.trim() : (button ? button.textContent.trim() : '');

    // Content cell: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Use the panel's direct children (usually a div with class RTE text)
      if (panel.children.length === 1) {
        contentCell = panel.children[0];
      } else {
        contentCell = Array.from(panel.children);
      }
    } else {
      contentCell = document.createTextNode('');
    }
    return [titleContent, contentCell];
  });

  // Compose table cells
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);

  // Place Load More button after the table if present
  const btnWrap = element.querySelector('.accordion-component__btnwrap');
  if (btnWrap) {
    const loadMoreBtn = btnWrap.querySelector('button');
    if (loadMoreBtn) {
      table.parentNode.insertBefore(loadMoreBtn, table.nextSibling);
    }
  }
}
