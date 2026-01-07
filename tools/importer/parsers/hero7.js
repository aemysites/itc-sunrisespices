/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero7)
  const headerRow = ['Hero (hero7)'];

  // Find the main image for the hero background
  const picture = element.querySelector('picture');
  let imageEl = null;
  if (picture) {
    imageEl = picture.querySelector('img');
  }

  // Row 2: Background image (optional)
  const imageRow = [imageEl ? imageEl : ''];

  // Row 3: Title, subheading, CTA (optional)
  // The provided HTML does not contain any text content, so this row should be empty
  const contentRow = [''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
