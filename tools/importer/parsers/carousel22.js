/* global WebImporter */
export default function parse(element, { document }) {
  // Find all carousel slides
  const slides = Array.from(
    element.querySelectorAll('.video-description__wrapper--slide')
  );

  // Header row as per block spec
  const headerRow = ['Carousel (carousel22)'];

  // Parse each slide
  const rows = slides.map(slide => {
    // Find image (mandatory)
    const img = slide.querySelector('img');

    // Find video link (YouTube or DAM) as CTA if present
    const videoBox = slide.querySelector('.video-description__box--video');
    let videoUrl = '';
    if (videoBox) {
      const ytDiv = videoBox.querySelector('.video-lightbox__src--yt');
      const damDiv = videoBox.querySelector('.video-lightbox__src--html');
      if (ytDiv && ytDiv.getAttribute('data-youtube-id')) {
        videoUrl = ytDiv.getAttribute('data-youtube-id');
      } else if (damDiv && damDiv.getAttribute('data-video-src')) {
        videoUrl = damDiv.getAttribute('data-video-src');
      }
    }

    // Compose right cell: only include video link if present
    let rightCell = '';
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.textContent = 'Watch Video';
      rightCell = [link];
    }

    // Each row: [image, right cell]
    return [img, rightCell];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
