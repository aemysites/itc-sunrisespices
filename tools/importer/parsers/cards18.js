/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards18) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Find the card list container
  const cardList = element.querySelector('.article-listing__results--list');
  if (!cardList) return;

  // Select all card items
  const cardItems = cardList.querySelectorAll('.article-listing__results--item');

  cardItems.forEach((cardItem) => {
    // Card main anchor (wraps image and text)
    const cardLink = cardItem.querySelector('a.cta-analytics-card');
    if (!cardLink) return;

    // --- IMAGE CELL ---
    // Find the main image inside the card
    const image = cardLink.querySelector('img.latestblog-cards__img');
    // Defensive: If no image, skip this card
    if (!image) return;

    // --- TEXT CELL ---
    // Build text cell content
    const textContent = [];

    // Tag/label (Dry Spices)
    const tag = cardLink.querySelector('p.primary-tag');
    if (tag) textContent.push(tag);

    // Title (h3)
    const title = cardLink.querySelector('h3.blog-details__title');
    if (title) textContent.push(title);

    // Description (p)
    const desc = cardLink.querySelector('p.blog-details__description');
    if (desc) textContent.push(desc);

    // CTA (READ NOW)
    const cta = cardLink.querySelector('.blog-details__cta');
    if (cta) textContent.push(cta);

    // Download icon (link)
    const downloadIconContainer = cardItem.querySelector('.icon-container-download');
    if (downloadIconContainer) {
      const downloadLink = downloadIconContainer.querySelector('a.download-icon__link');
      if (downloadLink) textContent.push(downloadLink);
    }

    // Share icon (img only, no link)
    const shareIconContainer = cardItem.querySelector('.icon-container-share');
    if (shareIconContainer) {
      const shareImg = shareIconContainer.querySelector('img');
      if (shareImg) textContent.push(shareImg);
    }

    // Add row: [image, text content]
    rows.push([image, textContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);

  // Place Load More button below the table, not inside it
  const loadMoreBtn = element.querySelector('.article-listing__btn');
  if (loadMoreBtn) {
    block.insertAdjacentElement('afterend', loadMoreBtn);
  }
}
