/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion block
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Find all accordion items (even if hidden)
  const itemSelector = '.accordion-component__acc--item';
  const items = element.querySelectorAll(itemSelector);

  items.forEach((item) => {
    // Title cell: Find the button and its title span
    const button = item.querySelector('button');
    let titleSpan = button && button.querySelector('.accordion-component__acc--title');
    // Defensive: fallback to button text if span not found
    let titleContent = titleSpan || button;

    // Content cell: Find the panel and its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = null;
    if (panel) {
      // Look for .cmp-text inside panel
      const cmpText = panel.querySelector('.cmp-text');
      content = cmpText || panel;
    }

    // Only add rows if title and content exist
    if (titleContent && content) {
      rows.push([titleContent, content]);
    }
  });

  // Replace the original element with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);

  // Insert Load More button after the table if present (no <hr> divider)
  const loadMoreBtn = element.querySelector('.accordion-component__btnwrap button');
  if (loadMoreBtn) {
    block.after(loadMoreBtn);
  }
}
