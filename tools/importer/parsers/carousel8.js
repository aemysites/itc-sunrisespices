/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: must be a single cell row
  const headerRow = ['Carousel (carousel8)'];

  // Extract image (mandatory for carousel slide)
  const imgEl = element.querySelector('.masalapacket img');

  // Compose text cell: title (as heading) + description
  const textCell = [];
  const titleEl = element.querySelector('.masalaname');
  if (titleEl) {
    const h2 = document.createElement('h2');
    h2.innerHTML = titleEl.innerHTML;
    textCell.push(h2);
  }
  const descEl = element.querySelector('.masalsubtext');
  if (descEl) {
    textCell.push(descEl);
  }

  // Extract carousel navigation arrows (SVG images)
  const navIcons = Array.from(element.querySelectorAll('.spicearrow-icons img'));
  if (navIcons.length) {
    navIcons.forEach(icon => textCell.push(icon.cloneNode(true)));
  }

  // Build rows: only add if image exists
  const rows = [];
  if (imgEl) {
    rows.push([imgEl, textCell]);
  }

  // Final table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
