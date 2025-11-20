/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards1) block: 2 columns, multiple rows, each row = card
  // 1st col: image (mandatory), 2nd col: text (title mandatory, description/CTA optional)
  // Header row
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Find the wrapper containing all cards
  const wrapper = element.querySelector('.related-products__wrapper');
  if (!wrapper) return;

  // Select all card slides
  const slides = wrapper.querySelectorAll('.related-products__wrapper--slide');
  slides.forEach((slide) => {
    // Card link (for possible CTA)
    const link = slide.querySelector('a.cta-analytics-card');
    // Card image: use the first image inside .related-products__images
    let img = null;
    const imagesContainer = link ? link.querySelector('.related-products__images') : null;
    if (imagesContainer) {
      img = imagesContainer.querySelector('img');
    }
    // Card title: h4 inside .related-products__card
    let title = null;
    const cardContent = link ? link.querySelector('.related-products__card') : null;
    if (cardContent) {
      title = cardContent.querySelector('h4');
    }
    // Compose text cell: wrap title in link if link exists
    let textCell = '';
    if (title && link && link.href) {
      // Wrap the title in an anchor with the correct href
      const h = document.createElement('h4');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = title.textContent.trim();
      h.appendChild(a);
      textCell = h;
    } else if (title) {
      const h = document.createElement('h4');
      h.textContent = title.textContent.trim();
      textCell = h;
    }
    // Add row: [image, text]
    rows.push([img, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
