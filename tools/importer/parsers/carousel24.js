/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract ONLY the active image from the left side of each slide
  function getActiveImage(productsDiv) {
    // The active image is inside the <a> with class 'active-link'
    const activeLink = productsDiv.querySelector('.active-link img');
    if (activeLink) return activeLink;
    // Fallback: first image if no active-link
    const firstImg = productsDiv.querySelector('img');
    return firstImg || null;
  }

  // Helper to extract the right content (title, description, CTA)
  function getRightContent(rightDiv) {
    const content = [];
    // Title
    const title = rightDiv.querySelector('h3');
    if (title) content.push(title);
    // Description (may be multiple paragraphs)
    const desc = rightDiv.querySelector('.spice-corner__right--desc');
    if (desc) {
      const paragraphs = Array.from(desc.querySelectorAll('p')).filter(p => p.textContent.trim());
      if (paragraphs.length) content.push(...paragraphs);
    }
    // CTA
    const ctaSpan = rightDiv.querySelector('.spice-corner__right--cta');
    if (ctaSpan) {
      const ctaLink = ctaSpan.querySelector('a');
      if (ctaLink) content.push(ctaLink);
    }
    return content;
  }

  // Find all slides
  const slides = element.querySelectorAll('.swiper-slide');
  const rows = [['Carousel (carousel24)']]; // Header row

  slides.forEach(slide => {
    // Left: only the active image
    const leftDiv = slide.querySelector('.spice-corner__left');
    let img = null;
    if (leftDiv) {
      const productsDiv = leftDiv.querySelector('.spice-corner__products');
      if (productsDiv) {
        img = getActiveImage(productsDiv);
      }
    }
    // Right: text content
    const rightDiv = slide.querySelector('.spice-corner__right');
    let rightContent = [];
    if (rightDiv) {
      rightContent = getRightContent(rightDiv);
    }
    // Add row: [image, right content]
    rows.push([img, rightContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
