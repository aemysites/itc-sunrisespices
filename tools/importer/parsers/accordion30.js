/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row (must be a single cell)
  const headerRow = ['Accordion (accordion30)'];

  // Find all accordion items (including those with .d-none)
  const accWrap = element.querySelector('.accordion-component__acc--wrap');
  const items = accWrap ? accWrap.querySelectorAll('.accordion-component__acc--item') : [];

  // Build rows for each accordion item (2 columns: title, content)
  const rows = Array.from(items).map(item => {
    // Title cell: get the button text (the clickable header)
    const button = item.querySelector('button');
    let titleSpan = button ? button.querySelector('.accordion-component__acc--title, .cmp-accordion__title') : null;
    let titleContent = titleSpan ? titleSpan.textContent.trim() : (button ? button.textContent.trim() : '');
    // Use a <p> for the title for consistency
    const titleEl = document.createElement('p');
    titleEl.textContent = titleContent;

    // Content cell: get the panel content
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentEl = document.createElement('div');
    if (panel) {
      Array.from(panel.childNodes).forEach(node => {
        contentEl.appendChild(node.cloneNode(true));
      });
    }
    return [titleEl, contentEl];
  });

  // Compose final table rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);

  // Find the Load More button (outside accordion items)
  const btnWrap = element.querySelector('.accordion-component__btnwrap');
  let loadMoreBtn = btnWrap ? btnWrap.querySelector('button') : null;
  if (loadMoreBtn && block.parentNode) {
    // Place the button after the block table, not inside it
    block.parentNode.insertBefore(loadMoreBtn, block.nextSibling);
  }
}
