/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from the left column
  function extractImage(cardCol) {
    const img = cardCol.querySelector('picture img');
    return img || null;
  }

  // Helper to extract the text content from the right column
  function extractText(cardCol) {
    // Prefer .cmp-text, fallback to .RTE
    const textContainer = cardCol.querySelector('.cmp-text') || cardCol.querySelector('.RTE');
    return textContainer || null;
  }

  // Find all grids that contain cards
  const grids = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  const cardRows = [];

  grids.forEach(grid => {
    // Each card is represented by a pair of columns: image (4) and text (8)
    const imgCol = grid.querySelector('.aem-GridColumn--default--4');
    const textCol = grid.querySelector('.aem-GridColumn--default--8');
    if (imgCol && textCol) {
      const img = extractImage(imgCol);
      const text = extractText(textCol);
      if (img && text) {
        cardRows.push([img, text]);
      }
    }
  });

  // Table header
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
