/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel22) block: 2 columns, first row is block name, each subsequent row is a slide
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // Locate the carousel slides container
  const wrapper = element.querySelector('.video-description__wrapper');
  if (!wrapper) return;

  // Find all slide elements
  const slides = wrapper.querySelectorAll('.video-description__wrapper--slide');
  slides.forEach((slide) => {
    // Each slide contains a .video-description__box
    const box = slide.querySelector('.video-description__box');
    if (!box) return;

    // Get image (mandatory)
    const imgContainer = box.querySelector('.video-description__box--video');
    let img = imgContainer ? imgContainer.querySelector('img') : null;
    if (!img) return;

    // Compose text cell
    let textCellContent = [];

    // Extract all visible text overlays and CTA from the slide (branding, regulatory, call-to-action)
    // Use less specific selectors to capture all visible text overlays and CTA
    // Only grab visible, non-empty text
    slide.querySelectorAll('div,span,a,button,h4').forEach((el) => {
      // Skip gradient overlays and play button icons
      if (
        el.textContent &&
        el.textContent.trim().length > 0 &&
        !el.classList.contains('video-description__gradient') &&
        !el.classList.contains('video-description__video--button') &&
        !el.querySelector('img') // skip icon-only buttons
      ) {
        // For CTA button or link, preserve link if present
        if ((el.tagName === 'A' || el.tagName === 'BUTTON') && el.href) {
          const link = document.createElement('a');
          link.href = el.href;
          link.textContent = el.textContent.trim();
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          textCellContent.push(link);
        } else {
          const div = document.createElement('div');
          div.textContent = el.textContent.trim();
          textCellContent.push(div);
        }
      }
    });
    // Regulatory icons: get alt text from images (e.g., green dot)
    slide.querySelectorAll('img').forEach((el) => {
      if (el.alt && el.alt.trim().length > 0) {
        const altDiv = document.createElement('div');
        altDiv.textContent = el.alt.trim();
        textCellContent.push(altDiv);
      }
    });
    // Aria-label from buttons
    slide.querySelectorAll('button').forEach((el) => {
      if (el.getAttribute('aria-label')) {
        const ariaDiv = document.createElement('div');
        ariaDiv.textContent = el.getAttribute('aria-label').trim();
        textCellContent.push(ariaDiv);
      }
    });
    // Play button SVG overlay (if present)
    const playBtn = imgContainer.querySelector('.video-description__video--button img');
    if (playBtn) {
      textCellContent.push(playBtn.cloneNode(true));
    }
    // Video link (optional, from data-youtube-id or data-video-src)
    let videoLink = null;
    const ytDiv = imgContainer.querySelector('.video-lightbox__src--yt');
    const damDiv = imgContainer.querySelector('.video-lightbox__src--html');
    if (ytDiv && ytDiv.dataset.youtubeId) {
      videoLink = ytDiv.dataset.youtubeId;
    } else if (damDiv && damDiv.dataset.videoSrc) {
      videoLink = damDiv.dataset.videoSrc;
    }
    // Only add video link if there is no other visible text content
    if (videoLink && textCellContent.length === 0) {
      const videoLinkEl = document.createElement('a');
      videoLinkEl.href = videoLink;
      videoLinkEl.textContent = videoLink;
      videoLinkEl.target = '_blank';
      videoLinkEl.rel = 'noopener noreferrer';
      textCellContent.push(videoLinkEl);
    }

    // If no text content, use empty string for second cell
    rows.push([
      img,
      textCellContent.length > 0 ? textCellContent : ''
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
