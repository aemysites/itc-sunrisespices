/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns28)'];

  // Get the left and right column containers
  const section = element.querySelector('section.container.dishinfo-wrapper');
  if (!section) return;

  // Left column: dish info, description, tags, meta-info, buttons
  const leftCol = section.querySelector('.dishinfo-container');
  // Right column: ingredients list and product card
  const rightCol = section.querySelector('.dishinfo-ingredients');

  // Defensive: If either column is missing, fallback to whole section
  const leftContent = leftCol || section;
  const rightContent = rightCol || section;

  // Compose left column content
  // We'll include all the main content: tags, meta-info, title, description, fact check, buttons
  const leftParts = [];
  // Tags
  const tags = leftContent.querySelector('.dishinfo-tag__container');
  if (tags) leftParts.push(tags);
  // Meta-info (difficulty, time, serves)
  const metaInfo = leftContent.querySelector('.dishinfo-brief__container');
  if (metaInfo) leftParts.push(metaInfo);
  // Title & description
  const description = leftContent.querySelector('.dishinfo-description');
  if (description) leftParts.push(description);
  // Buttons (Share, Download)
  const btns = leftContent.querySelector('.dishinfo-btns');
  if (btns) leftParts.push(btns);

  // Compose right column content
  // Ingredients list and product card
  const rightParts = [];
  // Ingredients container
  const ingredientsContainer = rightContent.querySelector('.ingredients-container');
  if (ingredientsContainer) rightParts.push(ingredientsContainer);

  // Create the table rows
  const rows = [
    headerRow,
    [leftParts, rightParts]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
