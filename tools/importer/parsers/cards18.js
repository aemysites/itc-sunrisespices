/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards18) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Find the card list container
  const cardsList = element.querySelector('.article-listing__results--list');
  if (!cardsList) return;

  // Get all card items
  const cardItems = cardsList.querySelectorAll('.article-listing__results--item');
  cardItems.forEach((cardItem) => {
    // Card image
    const img = cardItem.querySelector('img.latestblog-cards__img');
    // Card text content: label, title, description, CTA, icons
    const details = cardItem.querySelector('.blog-details');
    if (!img || !details) return;

    // Label (Dry Spices)
    const label = cardItem.querySelector('.primary-tag');
    // Title (h3)
    const title = details.querySelector('.blog-details__title');
    // Description (p)
    const desc = details.querySelector('.blog-details__description');
    // CTA (div with link and arrow icon)
    let ctaLink = null;
    const cardLink = cardItem.querySelector('a.cta-analytics-card');
    if (cardLink) {
      ctaLink = document.createElement('a');
      ctaLink.href = cardLink.href;
      ctaLink.className = 'card-cta';
      ctaLink.textContent = 'READ NOW ';
      // Add the arrow icon from the original CTA
      const ctaIcon = details.querySelector('.blog-details__cta img');
      if (ctaIcon) {
        // Wrap the icon in a span for accessibility
        const iconSpan = document.createElement('span');
        iconSpan.appendChild(ctaIcon.cloneNode(true));
        ctaLink.appendChild(iconSpan);
      }
    }
    // Download/share icons
    const iconLinks = [];
    const downloadIcon = cardItem.querySelector('.icon-container-download a.download-icon__link');
    if (downloadIcon) {
      const dl = document.createElement('a');
      dl.href = downloadIcon.href;
      dl.textContent = 'Download';
      dl.className = 'card-download';
      iconLinks.push(dl);
    }
    const shareIcon = cardItem.querySelector('.icon-container-share img');
    if (shareIcon) {
      // Wrap the share icon in a span for accessibility
      const shareSpan = document.createElement('span');
      shareSpan.appendChild(shareIcon.cloneNode(true));
      shareSpan.className = 'card-share';
      iconLinks.push(shareSpan);
    }

    // Compose the text cell
    const textCell = [];
    if (label) textCell.push(label);
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    iconLinks.forEach((el) => textCell.push(el));
    if (ctaLink) textCell.push(ctaLink);

    rows.push([img, textCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);

  // Place Load More button after the table (not inside)
  const loadMoreBtn = element.querySelector('.article-listing__btn');
  if (loadMoreBtn) {
    block.after(loadMoreBtn);
  }
}
