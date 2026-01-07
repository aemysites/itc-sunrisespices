/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Hero (hero13)
  const headerRow = ['Hero (hero13)'];

  // --- Extract the background image ---
  // Find the <img> inside the <picture>
  let imgEl = null;
  const picture = element.querySelector('picture');
  if (picture) {
    imgEl = picture.querySelector('img');
  }

  // --- Extract the text content ---
  // Find the title (h1) and subheading (p inside banner-content__text)
  let titleEl = null;
  let subheadingEl = null;
  const bannerContent = element.querySelector('.banner-content');
  if (bannerContent) {
    titleEl = bannerContent.querySelector('h1');
    const subText = bannerContent.querySelector('.banner-content__text');
    if (subText) {
      // Use the paragraph inside the subText div
      subheadingEl = subText.querySelector('p');
    }
  }

  // --- Compose table rows ---
  // 1st row: header
  // 2nd row: background image
  // 3rd row: text content (title, subheading)
  const rows = [
    headerRow,
    [imgEl ? imgEl : ''],
    [
      [
        ...(titleEl ? [titleEl] : []),
        ...(subheadingEl ? [subheadingEl] : [])
      ]
    ]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
