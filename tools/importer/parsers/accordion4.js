/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block guidelines
  const headerRow = ['Accordion (accordion4)'];

  // Find the accordion items container
  const accWrap = element.querySelector('.accordion-component__acc--wrap');
  const itemNodes = accWrap ? accWrap.querySelectorAll('.accordion-component__acc--item') : [];

  // Prepare rows for each accordion item (include all, even if .d-none)
  const rows = [];
  itemNodes.forEach((item) => {
    // Title cell: find the button and its title span
    const btn = item.querySelector('button');
    let titleSpan = btn ? btn.querySelector('.accordion-component__acc--title, .cmp-accordion__title') : null;
    // Defensive fallback: use button text if no span
    const titleContent = titleSpan ? titleSpan : btn;

    // Content cell: find the panel and its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = null;
    if (panel) {
      // Find the rich text area inside panel
      const rte = panel.querySelector('.cmp-text');
      contentCell = rte ? rte : panel;
    }

    rows.push([titleContent, contentCell]);
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Find the Load More button (outside accordion items)
  const btnWrap = element.querySelector('.accordion-component__btnwrap');
  let loadMoreBtn = btnWrap ? btnWrap.querySelector('button') : null;
  if (loadMoreBtn) {
    // Create a wrapper div for the button label only
    const btnDiv = document.createElement('div');
    btnDiv.textContent = loadMoreBtn.textContent;
    table.after(btnDiv);
  }

  // Replace the original element with the new block table
  element.replaceWith(table);
}
