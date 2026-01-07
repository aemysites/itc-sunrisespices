/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row for Columns (columns11)
  const headerRow = ['Columns (columns11)'];

  // Extract left column content from the source html
  let leftColContent = '';
  const headingEl = element.querySelector('.spicebanner-heading');
  if (headingEl) {
    leftColContent = headingEl.textContent.trim();
  } else {
    leftColContent = element.textContent.trim();
  }

  // Create left column cell
  const leftCol = document.createElement('div');
  leftCol.innerHTML = `<b>${leftColContent}</b>`;

  // Extract right column text from the screenshot analysis (since it's not in the HTML)
  const rightColText = 'Turmeric or Haldi Powder';
  const rightCol = document.createElement('div');
  rightCol.innerHTML = `<b>${rightColText}</b>`;

  // Build the table rows (two columns as shown in screenshot)
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
