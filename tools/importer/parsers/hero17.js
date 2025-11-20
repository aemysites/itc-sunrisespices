/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero17) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Title, Subheading, CTA (optional)

  // Helper: Find background image
  let bgImg = null;
  const bgImgBox = element.querySelector('.page-breaker-banner__bgImage-box');
  if (bgImgBox) {
    // Try to find <img> inside <picture>
    const img = bgImgBox.querySelector('img');
    if (img) bgImg = img;
  }

  // Helper: Find text content
  let preTitle = null;
  let title = null;
  let cta = null;
  const details = element.querySelector('.page-breaker-banner__wrapper--details');
  if (details) {
    // Subheading (pre-title)
    preTitle = details.querySelector('.page-breaker-banner__wrapper--pre-title');
    // Title
    title = details.querySelector('.page-breaker-banner__wrapper--title');
    // CTA (link)
    cta = details.querySelector('a');
  }

  // Compose content for row 3
  const row3Content = [];
  if (preTitle) row3Content.push(preTitle);
  if (title) row3Content.push(title);
  if (cta) row3Content.push(cta);

  // Table rows
  const headerRow = ['Hero (hero17)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [row3Content.length ? row3Content : ''];

  // Build the table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
