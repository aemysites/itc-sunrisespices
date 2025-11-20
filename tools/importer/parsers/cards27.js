/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards27) block: 2 columns, each row is a card with image and text
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  // Extract cards from ALL sections (not just first visible)
  const contentContainers = Array.from(element.querySelectorAll('.article-listing__results--content'));
  contentContainers.forEach((container) => {
    // Find the ul with cards
    const ul = container.querySelector('ul.article-listing__results--list');
    if (ul) {
      const cards = ul.querySelectorAll('li.article-listing__results--item');
      cards.forEach((card) => {
        // Image cell: get the main image (first .img-main)
        const imgContainer = card.querySelector('.related-products__images');
        let img = imgContainer && imgContainer.querySelector('img.img-main');
        if (!img) {
          img = imgContainer && imgContainer.querySelector('img');
        }
        // Text cell: get the card title
        const textContainer = card.querySelector('.related-products__card');
        let title = textContainer && textContainer.querySelector('h4');
        // Compose text cell
        let textCell = [];
        if (title) {
          textCell.push(title);
        }
        // If the card has a link, add it as a CTA at the bottom (optional)
        const link = card.querySelector('a.cta-analytics-card');
        if (link && link.href) {
          let linkText = link.textContent.trim();
          if (!linkText && title) linkText = title.textContent.trim();
          const cta = document.createElement('a');
          cta.href = link.href;
          cta.textContent = linkText;
          cta.setAttribute('target', '_blank');
          cta.setAttribute('rel', 'noopener');
          if (!title || linkText !== title.textContent.trim()) {
            textCell.push(cta);
          }
        }
        rows.push([
          img || '',
          textCell.length === 1 ? textCell[0] : textCell
        ]);
      });
    }
    // Do NOT add Load More button as a row
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
