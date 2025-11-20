/* global WebImporter */
export default function parse(element, { document }) {
  const mainBox = element.querySelector('.commercial-mainBox');
  if (!mainBox) return;

  // Left column: heading (extract all text content)
  const leftCol = mainBox.querySelector('.commercial-title');
  let leftCellContent = [];
  if (leftCol) {
    leftCellContent.push(leftCol.cloneNode(true));
    // Also extract and append all text nodes for completeness
    const textNodes = Array.from(leftCol.querySelectorAll('*'))
      .map(el => el.textContent.trim())
      .filter(Boolean);
    textNodes.forEach(txt => {
      if (!leftCellContent.some(e => e.textContent && e.textContent.includes(txt))) {
        leftCellContent.push(document.createTextNode(txt));
      }
    });
  }

  // Right column: extract image, play button, video link, and any visible overlay text
  const rightCol = mainBox.querySelector('.commercial-thumbnail');
  let rightCellContent = [];
  if (rightCol) {
    const thumbBox = rightCol.querySelector('.thumbnail-mainBox');
    if (thumbBox) {
      // Add the main image
      const img = thumbBox.querySelector('img');
      if (img) rightCellContent.push(img.cloneNode(true));
      // Add play button
      const playBtn = thumbBox.querySelector('button.vlb_playBtn');
      if (playBtn) {
        const btn = playBtn.cloneNode(true);
        btn.setAttribute('aria-label', 'Play Video');
        rightCellContent.push(btn);
      }
      // Add video link
      const videoDiv = thumbBox.querySelector('[data-youtube-id]');
      if (videoDiv) {
        let videoUrl = videoDiv.getAttribute('data-youtube-id');
        if (videoUrl && !videoUrl.startsWith('http')) {
          videoUrl = 'h' + videoUrl;
        }
        const videoLink = document.createElement('a');
        videoLink.href = videoUrl;
        videoLink.textContent = 'Watch Video';
        rightCellContent.push(videoLink);
      }
    }
    // Extract all visible text from rightCol (including overlays/logos if present in HTML)
    const overlayTexts = Array.from(rightCol.querySelectorAll('*'))
      .map(el => el.textContent.trim())
      .filter(Boolean);
    overlayTexts.forEach(txt => {
      if (!rightCellContent.some(e => e.textContent && e.textContent.includes(txt))) {
        rightCellContent.push(document.createTextNode(txt));
      }
    });
  }

  const headerRow = ['Columns (columns10)'];
  const contentRow = [leftCellContent, rightCellContent];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
