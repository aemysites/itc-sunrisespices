/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero26)
  const headerRow = ['Hero (hero26)'];

  // --- Row 2: Background Image (all visually relevant images) ---
  const images = [];
  element.querySelectorAll('img').forEach(img => {
    images.push(img.cloneNode(true));
  });
  const imageRow = [images.length ? images : ''];

  // --- Row 3: Title, Subheading, CTA ---
  // Only extract visible text from CTA link (if present)
  // Do NOT include alt text from images as visible text
  let contentRowCell = [];
  const ctaLink = element.querySelector('.buy-now__cta--links a');
  if (ctaLink) {
    contentRowCell.push(ctaLink.cloneNode(true));
    const ctaText = ctaLink.textContent.trim();
    if (ctaText) {
      contentRowCell.push(document.createTextNode(ctaText));
    }
  }
  const contentRow = [contentRowCell.length ? contentRowCell : ''];

  // Assemble table rows
  const rows = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
