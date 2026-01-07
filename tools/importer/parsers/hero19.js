/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for Hero block
  const headerRow = ['Hero (hero19)'];

  // 2. Background image row (none present in this HTML)
  const imageRow = ['']; // leave blank if no image

  // 3. Content row: Heading, Subheading, Supporting text, Search bar
  const contentFragments = [];

  // Extract headings and paragraph
  const headingContainer = element.querySelector('.article-listing__heading');
  if (headingContainer) {
    const headings = headingContainer.querySelectorAll('h2');
    const paragraph = headingContainer.querySelector('p');
    headings.forEach(h => contentFragments.push(h));
    if (paragraph) contentFragments.push(paragraph);
  }

  // Extract the search bar form
  const searchForm = element.querySelector('.article-listing__form');
  if (searchForm) {
    contentFragments.push(searchForm);
  }

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    [contentFragments]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
