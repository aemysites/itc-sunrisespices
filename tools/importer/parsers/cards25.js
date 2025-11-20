/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block parser
  const cardsContainer = element.querySelector('.swiper-wrapper');
  if (!cardsContainer) return;

  // Use all .swiper-slide elements (all cards)
  const cardEls = Array.from(cardsContainer.querySelectorAll('.swiper-slide'));
  if (!cardEls.length) return;

  const rows = [];
  rows.push(['Cards (cards25)']);

  cardEls.forEach(cardEl => {
    // Find the card anchor (main clickable area)
    const cardLink = cardEl.querySelector('a.cta-analytics-card');
    // Find the card image
    const cardImg = cardEl.querySelector('img.latestblog-cards__img');
    // Find the label (e.g., Dry Spices)
    const label = cardEl.querySelector('p.primary-tag');
    // Find the title
    const title = cardEl.querySelector('h3.blog-details__title');
    // Find the description
    const desc = cardEl.querySelector('p.blog-details__description');
    // Find the CTA (READ NOW)
    const cta = cardEl.querySelector('.blog-details__cta');
    // Find download link (anchor only)
    const downloadLink = cardEl.querySelector('.icon-container-download a.download-icon__link');
    // Find share icon (anchor or img)
    const shareIcon = cardEl.querySelector('.icon-container-share img');

    // --- First cell: image and label ---
    const firstCellContent = [];
    if (cardImg) firstCellContent.push(cardImg);
    if (label) firstCellContent.push(label);

    // --- Second cell: title, description, CTA, download, share ---
    const secondCellContent = [];
    if (title) secondCellContent.push(title);
    if (desc) secondCellContent.push(desc);
    // If there's a CTA and a cardLink, wrap CTA in the link
    if (cta && cardLink && cardLink.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = cardLink.href;
      ctaLink.append(...Array.from(cta.childNodes));
      secondCellContent.push(ctaLink);
    } else if (cta) {
      secondCellContent.push(cta);
    }
    // Add download link if present
    if (downloadLink) {
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = downloadLink.href;
      downloadAnchor.setAttribute('download', '');
      const downloadImg = downloadLink.querySelector('img');
      if (downloadImg) downloadAnchor.appendChild(downloadImg.cloneNode(true));
      secondCellContent.push(downloadAnchor);
    }
    // Add share icon if present
    if (shareIcon) {
      secondCellContent.push(shareIcon.cloneNode(true));
    }

    rows.push([
      firstCellContent,
      secondCellContent
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
