/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Hero (hero26)
  const headerRow = ['Hero (hero26)'];

  // --- Row 2: Prominent image(s) ---
  const images = Array.from(element.querySelectorAll('img'));
  let imageCell = images.length === 1 ? images[0] : (images.length > 1 ? images : '');
  const imageRow = [imageCell];

  // --- Row 3: All visible text from source html, including visible CTA link text ---
  // Find visible CTA links (not in d-none or hidden)
  let ctaText = '';
  const ctaLinks = Array.from(element.querySelectorAll('a'));
  for (const link of ctaLinks) {
    let isHidden = false;
    let parent = link;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (style.display === 'none' || style.visibility === 'hidden' || parent.classList.contains('d-none')) {
        isHidden = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (!isHidden && link.textContent.trim()) {
      ctaText = link.textContent.trim();
      break;
    }
  }
  const contentRow = [ctaText];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
