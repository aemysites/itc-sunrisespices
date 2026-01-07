/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header
  const headerRow = ['Cards (cards25)'];

  // Find the parent container for cards
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all card slides
  const slides = swiperWrapper.querySelectorAll('.swiper-slide');
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each card is inside .card-outercontainer
    const card = slide.querySelector('.card-outercontainer');
    if (!card) return;

    // Image (mandatory)
    const img = card.querySelector('img.latestblog-cards__img');

    // Text content (mandatory)
    const textContent = document.createElement('div');
    // Tag (optional, shown visually)
    const tag = card.querySelector('p.primary-tag');
    if (tag) textContent.appendChild(tag.cloneNode(true));
    // Title (h3)
    const title = card.querySelector('h3.blog-details__title');
    if (title) textContent.appendChild(title.cloneNode(true));
    // Description (p)
    const desc = card.querySelector('p.blog-details__description');
    if (desc) textContent.appendChild(desc.cloneNode(true));
    // CTA (READ NOW) - must be a clickable link to the blog post
    const link = card.querySelector('a.cta-analytics-card');
    const cta = card.querySelector('.blog-details__cta');
    if (cta && link) {
      const ctaLink = document.createElement('a');
      ctaLink.href = link.href;
      ctaLink.innerHTML = cta.innerHTML;
      ctaLink.className = cta.className;
      textContent.appendChild(ctaLink);
    }
    // Do NOT include download/share icons in the card content cell

    rows.push([
      img ? img : '',
      textContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
