/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel29) block parsing
  // 1. Header row
  const headerRow = ['Carousel (carousel29)'];

  // 2. Find carousel cards (slides)
  // The cards are direct children of .swiper-wrapper
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // --- FIX: Extract the intro card (first child, not .spices-card) ---
  // The intro card is the first child of .swiper-wrapper and does not have class .spices-card
  const introCard = swiperWrapper.firstElementChild;
  let introRow = null;
  if (introCard && !introCard.classList.contains('spices-card')) {
    // Extract heading and swipe text
    const headingDiv = introCard.querySelector('.spices-card__heading');
    const swipeDiv = introCard.querySelector('.spices-card__swipe');
    const textCell = document.createElement('div');
    if (headingDiv) {
      // Get all heading text (h2)
      headingDiv.querySelectorAll('h2').forEach(h2 => {
        // Preserve bold styling for 'OF SPICES'
        if (h2.querySelector('b')) {
          const h2El = document.createElement('h2');
          const b = document.createElement('b');
          b.textContent = h2.querySelector('b').textContent;
          h2El.appendChild(b);
          textCell.appendChild(h2El);
        } else {
          const h2El = document.createElement('h2');
          h2El.textContent = h2.textContent;
          textCell.appendChild(h2El);
        }
      });
    }
    if (swipeDiv) {
      // Get swipe text (text + icon)
      const swipeText = swipeDiv.childNodes[0]?.textContent?.trim();
      if (swipeText) {
        const p = document.createElement('p');
        p.textContent = swipeText;
        textCell.appendChild(p);
      }
    }
    // Use empty cell for image (not 'null')
    introRow = ['', textCell];
  }

  // Get all .spices-card elements (product slides)
  const cardEls = Array.from(swiperWrapper.querySelectorAll('.spices-card'));
  if (!cardEls.length) return;

  // For each card, extract image and text content
  const rows = cardEls.map(card => {
    // Image: first .spices-card__img img
    const imgContainer = card.querySelector('.spices-card__img');
    let img = imgContainer ? imgContainer.querySelector('img') : null;
    if (!img) {
      img = card.querySelector('img');
    }
    // Text cell: title, description, CTA
    const details = card.querySelector('.spices-card__details');
    const textCell = document.createElement('div');
    if (details) {
      // Title (h3)
      const title = details.querySelector('.spices-card__details--title');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent;
        textCell.appendChild(h3);
      }
      // Description (p)
      const desc = details.querySelector('.spices-card__details--description');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        textCell.appendChild(p);
      }
      // CTA (link)
      const cta = details.querySelector('.spices-card__cta a');
      if (cta) {
        const label = cta.querySelector('.sunrise-cta__label');
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = label ? label.textContent : cta.textContent;
        textCell.appendChild(a);
      }
    }
    return [img, textCell];
  });

  // Compose table rows
  const tableRows = introRow ? [headerRow, introRow, ...rows] : [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(block);
}
