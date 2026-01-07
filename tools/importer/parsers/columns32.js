/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns32)'];

  // Get the main columns: left (recipe info), right (ingredients)
  // Defensive: find the main row container
  const mainRow = element.querySelector('.row');
  if (!mainRow) return;

  // Left column: dish info
  const leftCol = mainRow.querySelector('.dishinfo-container');
  // Right column: ingredients
  const rightCol = mainRow.querySelector('.dishinfo-ingredients');

  // Defensive: ensure both columns exist
  if (!leftCol || !rightCol) return;

  // Compose left cell content
  // We'll include tags, icons, title, description, and buttons
  const leftContent = [];

  // Tags (Spicy, Bengali Recipes)
  const tagsContainer = leftCol.querySelector('.dishinfo-tag__container');
  if (tagsContainer) leftContent.push(tagsContainer);

  // Icons (Beginner, 40 Minutes, For 6 people)
  const briefContainer = leftCol.querySelector('.dishinfo-brief__container');
  if (briefContainer) leftContent.push(briefContainer);

  // Description (title + paragraphs)
  const descriptionContainer = leftCol.querySelector('.dishinfo-description');
  if (descriptionContainer) leftContent.push(descriptionContainer);

  // Buttons (Share, Download)
  const btns = leftCol.querySelector('.dishinfo-btns');
  if (btns) leftContent.push(btns);

  // Compose right cell content
  // We'll include the ingredients title, list, and product image
  const rightContent = [];

  // Ingredients box
  const ingredientsContainer = rightCol.querySelector('.ingredients-container');
  if (ingredientsContainer) {
    // Only keep the main ingredients list and product image
    // Title
    const ingredientsTitle = ingredientsContainer.querySelector('.ingredients-title');
    if (ingredientsTitle) rightContent.push(ingredientsTitle);
    // List
    const ingredientsList = ingredientsContainer.querySelector('.ingredients-list-wrapper');
    if (ingredientsList) rightContent.push(ingredientsList);
    // Product image (swiper)
    const swiper = ingredientsContainer.querySelector('.ingredients-swiper');
    if (swiper) rightContent.push(swiper);
  }

  // Second row: two columns, left and right
  const secondRow = [leftContent, rightContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
