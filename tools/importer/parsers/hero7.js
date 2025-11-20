/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Hero (hero7)'];

  // Find the main image in the hero block
  let imgEl = element.querySelector('picture img');
  if (!imgEl) {
    imgEl = element.querySelector('img');
  }
  const imageRow = [imgEl ? imgEl : ''];

  // Extract ALL visible text content from the entire element, not just .banner-content
  // Only extract actual visible text from the HTML, do not add anything from screenshot analysis
  // If there is no visible text, leave the cell empty
  let textContent = '';
  element.querySelectorAll('*:not(script):not(style)').forEach(el => {
    if (el.childElementCount === 0 && el.textContent && el.textContent.trim().length > 0) {
      textContent += el.textContent.trim() + '\n';
    }
  });
  textContent = textContent.trim();

  // Only create a div if there is actual text content
  const textRow = [textContent ? (() => { const div = document.createElement('div'); div.textContent = textContent; return div; })() : ''];

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table block
  element.replaceWith(block);
}
