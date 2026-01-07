/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block header row
  const headerRow = ['Columns (columns10)'];

  // Locate main content structure
  const mainBox = element.querySelector('.commercial-mainBox');
  if (!mainBox) return;

  // LEFT COLUMN: Extract all text content, including line and formatting
  const titleBox = mainBox.querySelector('.commercial-titleBox') || mainBox.querySelector('.commercial-title');
  let leftColContent = document.createElement('div');
  if (titleBox) {
    // Include the horizontal line if present
    const line = titleBox.querySelector('hr, .line, .commercial-titleBox > div');
    if (line) leftColContent.appendChild(line.cloneNode(true));
    // Include all heading text
    Array.from(titleBox.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        leftColContent.appendChild(node.cloneNode(true));
      }
    });
  }

  // RIGHT COLUMN: Extract image, play button, and video link
  const thumbnailBox = mainBox.querySelector('.commercial-thumbnail');
  let rightColContent = document.createElement('div');
  if (thumbnailBox) {
    // Add image
    const img = thumbnailBox.querySelector('img');
    if (img) rightColContent.appendChild(img.cloneNode(true));
    // Add play button overlay if present
    const playBtn = thumbnailBox.querySelector('button.vlb_playBtn');
    if (playBtn) rightColContent.appendChild(playBtn.cloneNode(true));
    // Add video link using CORRECTED data-youtube-id value from HTML
    const videoDiv = thumbnailBox.querySelector('[data-youtube-id]');
    if (videoDiv && videoDiv.getAttribute('data-youtube-id')) {
      let videoUrl = videoDiv.getAttribute('data-youtube-id');
      // If typo (starts with 'ttp'), fix to 'https'
      if (videoUrl.startsWith('ttp')) {
        videoUrl = 'h' + videoUrl;
      }
      const videoLink = document.createElement('a');
      videoLink.href = videoUrl;
      videoLink.textContent = 'Watch Video';
      rightColContent.appendChild(videoLink);
    }
  }

  // Build the columns block table
  const tableRows = [headerRow, [leftColContent, rightColContent]];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
