/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for Hero block
  const headerRow = ['Hero (hero17)'];

  // 2. Extract background image (from <img> inside <picture>)
  let bgImg = null;
  const bgImgBox = element.querySelector('.page-breaker-banner__bgImage-box');
  if (bgImgBox) {
    const img = bgImgBox.querySelector('img');
    if (img) bgImg = img;
  }

  // 3. Extract text content and CTA
  const wrapper = element.querySelector('.page-breaker-banner__wrapper--details');
  let title = '', subtitle = '', cta = null;
  if (wrapper) {
    // Subtitle (pre-title)
    const preTitle = wrapper.querySelector('.page-breaker-banner__wrapper--pre-title');
    if (preTitle) subtitle = preTitle.textContent.trim();
    // Title
    const mainTitle = wrapper.querySelector('.page-breaker-banner__wrapper--title');
    if (mainTitle) title = mainTitle.textContent.trim();
    // CTA link
    const ctaLink = wrapper.querySelector('a');
    if (ctaLink) cta = ctaLink;
  }

  // 4. Compose content row
  // Second row: background image
  const imageRow = [bgImg ? bgImg : ''];

  // Third row: text content (title, subtitle, CTA)
  const textContent = [];
  if (subtitle) {
    const subtitleEl = document.createElement('div');
    subtitleEl.textContent = subtitle;
    textContent.push(subtitleEl);
  }
  if (title) {
    const titleEl = document.createElement('h1');
    titleEl.textContent = title;
    textContent.push(titleEl);
  }
  if (cta) {
    textContent.push(cta);
  }
  const contentRow = [textContent];

  // 5. Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element
  element.replaceWith(table);
}
