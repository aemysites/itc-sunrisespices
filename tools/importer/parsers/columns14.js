/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: clone and clean content
  function cloneAndClean(node, selectorsToRemove = []) {
    const clone = node.cloneNode(true);
    selectorsToRemove.forEach(sel => {
      clone.querySelectorAll(sel).forEach(el => el.remove());
    });
    return clone;
  }

  // Get main columns
  const section = element.querySelector('section.container.dishinfo-wrapper');
  if (!section) return;
  const row = section.querySelector('.row');
  if (!row) return;

  // Left column: dish info
  const leftCol = row.querySelector('.dishinfo-container');
  // Right column: ingredients
  const rightCol = row.querySelector('.dishinfo-ingredients');
  if (!leftCol || !rightCol) return;

  // Compose left column content (only visible relevant blocks)
  const leftCellContent = [];
  // Tags
  const tagContainer = leftCol.querySelector('.dishinfo-tag__container');
  if (tagContainer) leftCellContent.push(cloneAndClean(tagContainer));
  // Brief info
  const briefContainer = leftCol.querySelector('.dishinfo-brief__container');
  if (briefContainer) leftCellContent.push(cloneAndClean(briefContainer));
  // Description
  const descContainer = leftCol.querySelector('.dishinfo-description');
  if (descContainer) leftCellContent.push(cloneAndClean(descContainer));
  // Share button
  const shareBtn = leftCol.querySelector('.dishinfo-btns');
  if (shareBtn) leftCellContent.push(cloneAndClean(shareBtn));
  // Social share modal (only visible content, remove input/button controls)
  const shareModal = leftCol.querySelector('.share-component');
  if (shareModal) {
    // Remove input fields and navigation buttons from modal
    leftCellContent.push(cloneAndClean(shareModal, [
      'input',
      'button',
      '.swiper-button-prev',
      '.swiper-button-next',
      '.swiper-scrollbar',
      '.swiper-pagination',
      '.ingredients-swiper__nav',
      '.ingredients-swiper__pagination'
    ]));
  }

  // Compose right column content (ingredients, remove hidden swiper controls)
  const ingredientsContainer = rightCol.querySelector('.ingredients-container');
  let rightCellContent = [];
  if (ingredientsContainer) {
    rightCellContent = [cloneAndClean(ingredientsContainer, [
      '.swiper',
      '.swiper-button-prev',
      '.swiper-button-next',
      '.swiper-scrollbar',
      '.swiper-pagination',
      '.ingredients-swiper__nav',
      '.ingredients-swiper__pagination',
      '.ingredients-list__gradient'
    ])];
  }

  // Build table rows
  const headerRow = ['Columns (columns14)'];
  const columnsRow = [leftCellContent, rightCellContent];
  const cells = [headerRow, columnsRow];

  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
