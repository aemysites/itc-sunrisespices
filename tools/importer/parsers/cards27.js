/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Cards (cards27) block
  const headerRow = ['Cards (cards27)'];

  // Helper to extract cards from a given ul list
  function extractCardsFromList(ul) {
    const rows = [];
    const cardItems = ul.querySelectorAll('li');
    cardItems.forEach((li) => {
      // Find anchor
      const anchor = li.querySelector('a');
      // Find images (main and hover)
      const imagesDiv = anchor.querySelector('.related-products__images');
      // Use both main and hover images if present
      const mainImg = imagesDiv.querySelector('img.img-main');
      const hoverImg = imagesDiv.querySelector('img.img-show-on-hover');
      let imageCell;
      if (mainImg && hoverImg) {
        // Put both images in a fragment
        const frag = document.createDocumentFragment();
        frag.appendChild(mainImg.cloneNode(true));
        frag.appendChild(hoverImg.cloneNode(true));
        imageCell = frag;
      } else if (mainImg) {
        imageCell = mainImg.cloneNode(true);
      } else {
        imageCell = document.createElement('span');
      }
      // Find title
      const cardTitle = anchor.querySelector('.related-products__card-title');
      // Compose text cell: title and CTA link
      let textCell;
      if (cardTitle && anchor.href) {
        // Wrap the title in a link for CTA
        const link = document.createElement('a');
        link.href = anchor.href;
        link.textContent = cardTitle.textContent.trim();
        textCell = link;
      } else if (cardTitle) {
        textCell = cardTitle.cloneNode(true);
      } else {
        textCell = document.createElement('span');
      }
      rows.push([imageCell, textCell]);
    });
    return rows;
  }

  // Extract cards from ALL sections (not just visible)
  const allRows = [];
  const allContents = element.querySelectorAll('.article-listing__results--content');
  allContents.forEach((content) => {
    const ul = content.querySelector('ul.article-listing__results--list');
    if (ul) {
      const cardRows = extractCardsFromList(ul);
      allRows.push(...cardRows);
    }
    // Extract the Load More button (if present)
    const loadMoreBtn = content.querySelector('.article-listing__btn');
    if (loadMoreBtn) {
      const emptyCell = document.createElement('span');
      allRows.push([emptyCell, loadMoreBtn.cloneNode(true)]);
    }
  });

  // Also extract all data-* text content from the root element
  ['data-load-more', 'data-no-result', 'data-error'].forEach(attr => {
    const val = element.getAttribute(attr);
    if (val) {
      const emptyCell = document.createElement('span');
      const txt = document.createElement('span');
      txt.textContent = val;
      allRows.push([emptyCell, txt]);
    }
  });

  // Compose final table
  const cells = [headerRow, ...allRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
