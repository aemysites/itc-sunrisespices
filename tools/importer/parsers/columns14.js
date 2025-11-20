/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract left column content
  function getLeftColumnContent() {
    const leftCol = element.querySelector('.dishinfo-container');
    if (!leftCol) return null;
    // Compose left column: tags, icons, description, share button
    const tags = leftCol.querySelector('.dishinfo-tag__container');
    const icons = leftCol.querySelector('.dishinfo-brief__container');
    const description = leftCol.querySelector('.dishinfo-description');
    const shareBtn = leftCol.querySelector('.dishinfo-btns');
    // Compose into a single div
    const leftContent = document.createElement('div');
    if (tags) leftContent.appendChild(tags);
    if (icons) leftContent.appendChild(icons);
    if (description) leftContent.appendChild(description);
    if (shareBtn) leftContent.appendChild(shareBtn);
    return leftContent;
  }

  // Helper: extract right column content (ingredients)
  function getRightColumnContent() {
    const rightCol = element.querySelector('.dishinfo-ingredients');
    if (!rightCol) return null;
    const ingredientsCard = rightCol.querySelector('.ingredients-container');
    if (!ingredientsCard) return null;
    return ingredientsCard;
  }

  // Build table rows
  const headerRow = ['Columns (columns14)'];
  const leftContent = getLeftColumnContent();
  const rightContent = getRightColumnContent();

  // Defensive: If either column missing, fallback to whole element
  const cellsRow = [leftContent || element, rightContent || element];

  // Create block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
