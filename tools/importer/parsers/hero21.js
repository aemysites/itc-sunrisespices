/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero block
  const headerRow = ['Hero (hero21)'];

  // --- Row 2: Background Image(s) ---
  const images = Array.from(element.querySelectorAll('img'));
  const imageRow = [images.length === 1 ? images[0] : images];

  // --- Row 3: Title/CTA/Text ---
  // Extract CTA links (Amazon/Flipkart)
  const ctaLinks = Array.from(element.querySelectorAll('a[href]'));
  const ctas = ctaLinks.map(a => {
    const link = document.createElement('a');
    link.href = a.href;
    link.textContent = a.textContent.trim();
    if (a.target) link.target = a.target;
    return link;
  });

  // Compose cell: CTA links only (no heading/subheading visible in HTML or screenshot)
  const textRow = [ctas.length ? ctas : ''];

  // Compose table rows
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
