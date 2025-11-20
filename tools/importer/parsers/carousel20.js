/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel20) block
  const headerRow = ['Carousel (carousel20)'];
  const rows = [headerRow];

  // Find the carousel wrapper
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Select all slides
  const slides = swiperWrapper.querySelectorAll('.swiper-slide');

  slides.forEach((slide) => {
    // Find the image (always in .banner-section picture img)
    const img = slide.querySelector('picture img');
    if (!img) return;

    // Find the banner content (text)
    const bannerContent = slide.querySelector('.banner-content');
    let textCell = '';
    if (bannerContent) {
      // Get heading (h1)
      const heading = bannerContent.querySelector('h1');
      // Get description (banner-content__text)
      const descDiv = bannerContent.querySelector('.banner-content__text');
      // Compose text cell
      const cellContent = [];
      if (heading) cellContent.push(heading);
      if (descDiv) {
        // Clone and preserve all <p>, including <p>&nbsp;</p>
        const descDivClone = descDiv.cloneNode(true);
        cellContent.push(descDivClone);
      }
      if (cellContent.length > 0) {
        textCell = cellContent;
      }
    }
    // Add row: [image, text content]
    rows.push([img, textCell]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
