/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract CTA link if present
  function extractCTA(rightContent) {
    const ctaSpan = rightContent.querySelector('.spice-corner__right--cta, span.position-absolute');
    if (ctaSpan) {
      const ctaLink = ctaSpan.querySelector('a');
      if (ctaLink) return ctaLink;
    }
    return null;
  }

  // Find all slides
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));

  // Table header
  const headerRow = ['Carousel (carousel24)'];
  const rows = [headerRow];

  slides.forEach(slide => {
    // Left: single featured image (with link) in .spice-corner__products
    const products = slide.querySelector('.spice-corner__products');
    let featuredLink = null;
    if (products) {
      // Prefer the one with 'active-link', else first
      featuredLink = products.querySelector('a.active-link') || products.querySelector('a');
    }
    // Defensive: fallback to first image in slide
    if (!featuredLink) {
      const img = slide.querySelector('img');
      if (img) featuredLink = img;
    }

    // Right: text content
    const right = slide.querySelector('.spice-corner__right');
    let rightContentArr = [];
    if (right) {
      const rightContent = right.querySelector('.spice-corner__right--content');
      if (rightContent) {
        // Heading
        const heading = rightContent.querySelector('h3');
        if (heading) rightContentArr.push(heading);
        // Description
        const desc = rightContent.querySelector('.spice-corner__right--desc');
        if (desc) rightContentArr.push(desc);
        // CTA
        const cta = extractCTA(rightContent);
        if (cta) rightContentArr.push(cta);
      } else {
        // Fallback: all children of right
        rightContentArr = Array.from(right.children);
      }
    }

    // Compose row: [featured image (with link), text content]
    rows.push([
      featuredLink || '',
      rightContentArr.length ? rightContentArr : ''
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
