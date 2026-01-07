/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns12)'];

  // Find the main content box that holds the two columns
  const contentBox = element.querySelector('.direction-contentBox');
  if (!contentBox) return;

  // First column: image only
  let leftColContent = [];
  const leftCol = contentBox.querySelector('.d-flex.align-items-lg-start.align-items-center');
  if (leftCol) {
    const imgBox = leftCol.querySelector('.direction-card__image img');
    if (imgBox) leftColContent.push(imgBox);
  }

  // Second column: step label (only if present and non-empty) + main text
  let rightColContent = [];
  if (leftCol) {
    const label = leftCol.querySelector('.direction-timingbox .direction-labelText');
    if (label && label.textContent.trim()) rightColContent.push(label);
  }
  const rightText = contentBox.querySelector('.gy-3 .font-default, .gy-3 .font-md-18, .gy-3 .font-default.font-md-18');
  if (rightText) rightColContent.push(rightText);

  // Build table rows
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
