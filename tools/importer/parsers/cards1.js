/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards1) block parser for Sunrise product carousel
  const wrapper = element.querySelector('.related-products__wrapper');
  if (!wrapper) return;

  const slides = Array.from(wrapper.querySelectorAll('.related-products__wrapper--slide'));
  if (!slides.length) return;

  const rows = [];
  rows.push(['Cards (cards1)']);

  slides.forEach((slide) => {
    const link = slide.querySelector('a.cta-analytics-card');
    if (!link) return;

    // Main image and hover image
    const imgContainer = link.querySelector('.related-products__images');
    let imgMain = null;
    let imgHover = null;
    if (imgContainer) {
      imgMain = imgContainer.querySelector('img.related-products__images--image.img-main');
      imgHover = imgContainer.querySelector('img.related-products__images--image.img-show-on-hover');
    }
    // Defensive fallback: if not found, use first/second img
    if (!imgMain && imgContainer) {
      imgMain = imgContainer.querySelector('img');
    }
    if (!imgHover && imgContainer) {
      const imgs = imgContainer.querySelectorAll('img');
      if (imgs.length > 1) imgHover = imgs[1];
    }

    // Compose image cell (main and hover images)
    let imageCell = null;
    if (imgMain && imgHover) {
      imageCell = document.createElement('div');
      imageCell.appendChild(imgMain.cloneNode(true));
      imageCell.appendChild(imgHover.cloneNode(true));
    } else if (imgMain) {
      imageCell = imgMain.cloneNode(true);
    }

    // Title (wrap in link)
    const title = link.querySelector('.related-products__card-title');
    let titleLink = null;
    if (title) {
      titleLink = document.createElement('a');
      titleLink.href = link.href;
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      titleLink.appendChild(strong);
    }

    rows.push([imageCell, titleLink]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
