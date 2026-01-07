/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel wrapper
  const section = element.querySelector('section');
  if (!section) return;
  const swiperWrapper = section.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Build header row
  const headerRow = ['Carousel (carousel29)'];
  const rows = [headerRow];

  // --- Add the intro slide (first column in screenshot) ---
  // Find the intro card: .spices-main__card
  const introCard = swiperWrapper.querySelector('.spices-main__card');
  if (introCard) {
    // Image cell: always empty for intro slide
    const imgCell = '';
    // Text cell: collect all heading and swipe text
    const textCellContent = [];
    // Headings
    const headings = introCard.querySelectorAll('.spices-card__heading h2');
    headings.forEach(h => textCellContent.push(h));
    // SWIPE TO LEARN
    const swipeDiv = introCard.querySelector('.spices-card__swipe');
    if (swipeDiv) textCellContent.push(swipeDiv);
    rows.push([imgCell, textCellContent]);
  }

  // Get all product slide cards (excluding the intro)
  const slides = Array.from(swiperWrapper.querySelectorAll('.spices-card:not(.spices-main__card)'));

  slides.forEach((card) => {
    // Image cell: reference the real image element
    let imgCell = null;
    const imgWrap = card.querySelector('.spices-card__img');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imgCell = img;
    }

    // Text cell
    const details = card.querySelector('.spices-card__details');
    const textCellContent = [];
    if (details) {
      // Title
      const title = details.querySelector('.spices-card__details--title');
      if (title) textCellContent.push(title);
      // Description
      const desc = details.querySelector('.spices-card__details--description');
      if (desc) textCellContent.push(desc);
      // CTA
      const cta = details.querySelector('.spices-card__cta a');
      if (cta) textCellContent.push(cta);
    }
    rows.push([
      imgCell,
      textCellContent.length ? textCellContent : ['']
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
