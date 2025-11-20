/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block: 2 columns, multiple rows, each row is a card (image, text)
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the cards container
  const cardsRow = element.querySelector('.productinfo__imgs--row');
  if (!cardsRow) return;

  // Each card is a .productinfo__imgs--col
  const cardEls = Array.from(cardsRow.querySelectorAll('.productinfo__imgs--col'));

  cardEls.forEach(cardEl => {
    // Image: inside .productinfo__imgs--col--img img
    const imgWrapper = cardEl.querySelector('.productinfo__imgs--col--img');
    let imgEl = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Title and link: the product name is in h4, the link is in the parent <a>
    const nameWrapper = cardEl.querySelector('.productinfo__imgs--col--name');
    let titleEl = nameWrapper ? nameWrapper.querySelector('h4') : null;
    let linkEl = cardEl.querySelector('.productinfo__imgs--col--img a');
    let textCell = [];
    if (titleEl) {
      // If there is a link, wrap the h4 in the link
      if (linkEl && linkEl.href) {
        // Clone the link and h4, and append h4 to link
        const link = linkEl.cloneNode(false); // shallow clone (no children)
        const h4 = titleEl.cloneNode(true);
        link.appendChild(h4);
        textCell.push(link);
      } else {
        textCell.push(titleEl);
      }
    }
    rows.push([imgEl, textCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
