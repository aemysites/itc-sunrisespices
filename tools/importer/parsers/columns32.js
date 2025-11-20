/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // Find main columns container (the top-level section)
  const section = element.querySelector('section.container.dishinfo-wrapper');
  if (!section) return;

  // Get the main row (holds columns)
  const row = getDirectChild(section, '.row');
  if (!row) return;

  // Find left and right columns
  const leftCol = Array.from(row.children).find(el => el.classList.contains('dishinfo-container'));
  const rightCol = Array.from(row.children).find(el => el.classList.contains('dishinfo-ingredients'));

  // Defensive: If either column missing, fallback to section children
  const columns = [leftCol, rightCol].filter(Boolean);
  if (columns.length < 2) {
    // fallback: treat all direct children as columns
    columns.length = 0;
    columns.push(...Array.from(row.children));
  }

  // Header row
  const headerRow = ['Columns (columns32)'];

  // Second row: columns content
  // For resilience, reference the whole column element for each cell
  const contentRow = columns.map(col => col);

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
