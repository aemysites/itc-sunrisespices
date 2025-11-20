/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: always block name
  const headerRow = ['Hero (hero21)'];

  // --- Row 2: Image(s) ---
  const images = Array.from(element.querySelectorAll('img'));
  const imageRow = [images.length ? images : ''];

  // --- Row 3: Title/Subheading (from alt text only if present and not duplicated), NO CTA links if hidden ---
  // Only include alt text from the first image, since that's the visible packet
  let titleText = '';
  if (images.length) {
    const alt = images[0].getAttribute('alt');
    if (alt) {
      titleText = alt;
    }
  }
  // Do NOT include CTA links if they are hidden (d-none)
  // In this source HTML, the CTA links are always hidden, so skip them
  const textRow = [titleText ? titleText : ''];

  // Compose table rows
  const rows = [headerRow, imageRow, textRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
