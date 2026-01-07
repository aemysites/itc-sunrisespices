/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns3)'];

  // Find the main content wrapper
  const content = element.querySelector('.footer-brand__primary--content') || element;

  // --- LEFT COLUMN: Logos and all branding/license text ---
  const leftSection = content.querySelector('.footer-brand__left');
  let leftCell = document.createElement('div');
  if (leftSection) {
    // Move all children (logo link, secondary logo, etc.)
    Array.from(leftSection.childNodes).forEach(node => {
      leftCell.appendChild(node.cloneNode(true));
    });
    // Extract all visible text nodes from leftSection (including license and branding)
    // Find all text nodes (including those inside children)
    function extractTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        leftCell.appendChild(document.createTextNode(node.textContent.trim()));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(extractTextNodes);
      }
    }
    extractTextNodes(leftSection);
    // Also extract text from adjacent siblings if present (for 'fssai' and license)
    const parent = leftSection.parentNode;
    if (parent) {
      Array.from(parent.childNodes).forEach(sib => {
        if (sib !== leftSection && sib.nodeType === Node.TEXT_NODE && sib.textContent.trim()) {
          leftCell.appendChild(document.createTextNode(sib.textContent.trim()));
        }
      });
    }
  }

  // --- MIDDLE COLUMN: First row of navigation links ---
  // --- RIGHT COLUMN: Second row of navigation links ---
  let middleCell = document.createElement('div');
  let rightCell = document.createElement('div');
  const rightSection = content.querySelector('.footer-brand__right');
  if (rightSection) {
    const nav = rightSection.querySelector('nav');
    if (nav) {
      // Get all .footerList elements
      const lists = nav.querySelectorAll('.footerList');
      // Middle column: first two lists
      if (lists[0]) middleCell.appendChild(lists[0].cloneNode(true));
      if (lists[1]) middleCell.appendChild(lists[1].cloneNode(true));
      // Right column: last two lists
      if (lists[2]) rightCell.appendChild(lists[2].cloneNode(true));
      if (lists[3]) rightCell.appendChild(lists[3].cloneNode(true));
    }
  }

  // Compose table rows: 3 columns
  const rows = [
    headerRow,
    [leftCell, middleCell, rightCell]
  ];

  // Create the table using DOMUtils
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
