/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs (tabs31) block: extract each swiper-slide as a tab
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // Get all immediate swiper-slide children (each is a tab)
  const slides = element.querySelectorAll(':scope > .swiper-slide');

  slides.forEach((slide) => {
    // Tab label: use the question heading (h3)
    const tabLabel = slide.querySelector('h3');

    // Tab content: gather the form with its options
    const tabContent = document.createElement('div');
    // Defensive: include heading and form in content
    if (tabLabel) tabContent.appendChild(tabLabel.cloneNode(true));
    const form = slide.querySelector('form');
    if (form) tabContent.appendChild(form.cloneNode(true));

    // If there's a decorative image (data-src), add it as an image
    const dataSrc = slide.getAttribute('data-src');
    if (dataSrc) {
      const img = document.createElement('img');
      img.src = dataSrc;
      img.alt = '';
      tabContent.appendChild(img);
    }

    // For the tab label cell: use the heading text only
    let labelText = tabLabel ? tabLabel.textContent.trim() : '';
    rows.push([labelText, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
