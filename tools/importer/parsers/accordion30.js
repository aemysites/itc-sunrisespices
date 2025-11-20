/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion30)'];
  const rows = [headerRow];

  // Find the accordion items container
  const accWrap = element.querySelector('.accordion-component__acc--wrap');
  if (accWrap) {
    // Find all accordion items (including those with .d-none)
    const items = Array.from(accWrap.querySelectorAll('.accordion-component__acc--item'));
    items.forEach((item) => {
      // Title cell: get the button title span
      const btn = item.querySelector('button');
      let titleSpan = btn && btn.querySelector('.accordion-component__acc--title');
      // Defensive fallback: if no span, use button text
      let titleCell = titleSpan || btn;
      // Content cell: get the panel content
      const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
      let contentCell = null;
      if (panel) {
        // Use the first child div inside panel (usually .RTE.text)
        const panelContent = panel.querySelector('.RTE, .cmp-text, div');
        contentCell = panelContent || panel;
      }
      rows.push([titleCell, contentCell]);
    });
  }

  // Do NOT include the Load More button in the table block

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
