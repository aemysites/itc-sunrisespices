/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero19) block: 1 column, 3 rows
  // Row 1: block name
  // Row 2: background image (none in this case)
  // Row 3: heading, subheading, CTA, and search input

  // --- Row 1: Header ---
  const headerRow = ['Hero (hero19)'];

  // --- Row 2: Background Image (none present) ---
  const bgImageRow = [''];

  // --- Row 3: Content ---
  const contentElements = [];
  const headingContainer = element.querySelector('.article-listing__heading');
  if (headingContainer) {
    const headings = headingContainer.querySelectorAll('h2');
    headings.forEach(h => contentElements.push(h));
    const subheading = headingContainer.querySelector('p');
    if (subheading) contentElements.push(subheading);
  }
  // Add search form (including input placeholder and reset button)
  const searchForm = element.querySelector('.article-listing__form');
  if (searchForm) {
    contentElements.push(searchForm);
  }

  const contentRow = [contentElements];

  // Build table
  const cells = [
    headerRow,
    bgImageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
