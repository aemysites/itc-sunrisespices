/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a slide
  function getImage(slide) {
    const img = slide.querySelector('picture img');
    return img;
  }

  // Helper to extract text content from a slide (preserve all paragraphs, including empty ones)
  function getTextContent(slide) {
    const heading = slide.querySelector('h1');
    const desc = slide.querySelector('.banner-content__text');
    const frag = document.createElement('div');
    if (heading) frag.appendChild(heading.cloneNode(true));
    if (desc) frag.appendChild(desc.cloneNode(true));
    return frag.childNodes.length ? frag : null;
  }

  // Get all carousel slides
  const slides = Array.from(
    element.querySelectorAll('.swiper-slide.primary-swiper-slide')
  );

  // Build table rows for each slide
  const rows = slides.map((slide) => {
    const img = getImage(slide);
    const text = getTextContent(slide);
    return [img, text];
  });

  // Table header (must be a single cell)
  const headerRow = ['Carousel (carousel20)'];

  // Build the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
