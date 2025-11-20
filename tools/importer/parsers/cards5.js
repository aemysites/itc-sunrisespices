/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block: 2 columns, multiple rows, each row is a card with image and text
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Find all top-level grids containing cards
  const grids = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  grids.forEach((grid) => {
    // Each card is composed of two main columns: image (left), text (right)
    // The grid contains two children per card: one for image, one for text
    const cardColumns = Array.from(grid.children);
    for (let i = 0; i < cardColumns.length; i += 2) {
      const imageCol = cardColumns[i];
      const textCol = cardColumns[i + 1];
      if (!imageCol || !textCol) continue;

      // Get image element from imageCol
      let img = imageCol.querySelector('img');
      if (!img) continue;

      // Get text content block from textCol
      let textBlock = textCol.querySelector('.cmp-text');
      if (!textBlock) {
        textBlock = textCol.querySelector('div');
      }
      if (!textBlock) continue;

      rows.push([img, textBlock]);
    }
  });

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
