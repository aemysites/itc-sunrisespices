/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block parser
  const swiperContainer = element.querySelector('.latestrecipe-container .swiper-wrapper');
  if (!swiperContainer) return;

  const cardSlides = Array.from(swiperContainer.querySelectorAll('.swiper-slide'));
  const headerRow = ['Cards (cards6)'];

  const rows = cardSlides.map((slide) => {
    // Image cell
    const img = slide.querySelector('.latestrecipe-cards__img');
    const imageCell = img ? img : slide.querySelector('img');

    // Tag/label
    const tag = slide.querySelector('.primary-tag');

    // Card details
    const details = slide.querySelector('.recipe-details');
    const title = details?.querySelector('.recipe-details__title');
    const level = details?.querySelector('.recipe-details__level');
    const time = details?.querySelector('.recipe-details__time');

    // Compose card main content (tag, title, level, time)
    const cardContent = [];
    if (tag) cardContent.push(tag.cloneNode(true));
    if (title) {
      // Heading for title as in markdown example
      const heading = document.createElement('h3');
      heading.textContent = title.textContent;
      cardContent.push(heading);
    }
    if (level) {
      // Remove icon and keep only text
      const levelText = document.createElement('div');
      levelText.textContent = level.textContent.trim();
      cardContent.push(levelText);
    }
    if (time) {
      // Remove icon and keep only text
      const timeText = document.createElement('div');
      timeText.textContent = time.textContent.trim();
      cardContent.push(timeText);
    }

    return [imageCell, cardContent];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  element.replaceWith(table);
}
