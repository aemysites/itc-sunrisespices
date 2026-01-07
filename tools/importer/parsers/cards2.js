/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block: 2 columns, multiple rows, each row = [image, text+link]
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the main row of cards
  const row = element.querySelector('.productinfo__imgs--row');
  if (!row) return;

  // Each card is a .productinfo__imgs--col
  const cards = Array.from(row.querySelectorAll('.productinfo__imgs--col'));

  cards.forEach(card => {
    // Image: find the <a> wrapping the img
    const link = card.querySelector('a');
    let imageCell = null;
    if (link) {
      // Clone the <a> with its image inside
      imageCell = link.cloneNode(true);
    } else {
      // Fallback: just the image
      const img = card.querySelector('img');
      imageCell = img ? img.cloneNode(true) : document.createTextNode('');
    }

    // Title: find the h4 inside the card
    const title = card.querySelector('h4');
    // Compose the text cell (just the title, no description or CTA)
    let textCell = '';
    if (title) {
      textCell = title.cloneNode(true);
    } else {
      textCell = document.createTextNode('');
    }
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
