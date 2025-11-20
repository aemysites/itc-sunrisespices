/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getChildByClass(cls) {
    return Array.from(element.children).find(el => el.classList.contains(cls));
  }

  // 1. Header row
  const headerRow = ['Carousel (carousel8)'];

  // 2. Slide row construction
  // Left column: image only
  // Right column: text content (heading + description) + navigation arrows

  // Get image element
  const packetDiv = getChildByClass('masalapacket');
  let imgEl = null;
  if (packetDiv) {
    imgEl = packetDiv.querySelector('img');
  }

  // Get heading
  const headingDiv = getChildByClass('masalaname');
  // Get description
  const descDiv = getChildByClass('masalsubtext');

  // Get navigation arrows
  const arrowContainer = getChildByClass('spicearrow-icons');
  let arrowImgs = [];
  if (arrowContainer) {
    arrowImgs = Array.from(arrowContainer.querySelectorAll('img')).map(img => img.cloneNode(true));
  }

  // Compose right cell content
  const rightCellContent = [];
  if (headingDiv) {
    const h2 = document.createElement('h2');
    h2.innerHTML = headingDiv.innerHTML;
    rightCellContent.push(h2);
  }
  if (descDiv) {
    const p = document.createElement('p');
    p.innerHTML = descDiv.innerHTML;
    rightCellContent.push(p);
  }
  if (arrowImgs.length) {
    const navDiv = document.createElement('div');
    navDiv.style.display = 'flex';
    navDiv.style.gap = '16px';
    arrowImgs.forEach(img => navDiv.appendChild(img));
    rightCellContent.push(navDiv);
  }

  // Build table rows
  const rows = [
    headerRow,
    [imgEl, rightCellContent]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
