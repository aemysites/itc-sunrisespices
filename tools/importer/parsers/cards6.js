/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block parser
  const cardsContainer = element.querySelector('.latestrecipe-container .swiper-wrapper');
  if (!cardsContainer) return;

  const cardNodes = Array.from(cardsContainer.querySelectorAll('.swiper-slide'));
  if (!cardNodes.length) return;

  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  cardNodes.forEach(cardNode => {
    // Card image (first cell)
    const img = cardNode.querySelector('img.latestrecipe-cards__img');
    if (!img) return;

    // Card link (wrap image in anchor if present)
    const cardLink = cardNode.querySelector('a.cta-analytics-card');
    let imgCell = img;
    if (cardLink && cardLink.href) {
      const a = document.createElement('a');
      a.href = cardLink.href;
      a.appendChild(img.cloneNode(true));
      imgCell = a;
    }

    // Card text (second cell)
    const details = cardNode.querySelector('.recipe-details');
    if (!details) return;

    // Compose text cell
    const textCell = document.createElement('div');

    // Pill label (e.g. Spicy, Savoury, Hot)
    const pill = cardNode.querySelector('.primary-tag');
    if (pill) {
      const pillEl = document.createElement('span');
      pillEl.textContent = pill.textContent.trim();
      pillEl.style.background = pill.style.background;
      pillEl.style.color = pill.style.color || 'white';
      pillEl.style.padding = '2px 8px';
      pillEl.style.borderRadius = '12px';
      pillEl.style.fontWeight = 'bold';
      pillEl.style.fontSize = '14px';
      pillEl.style.display = 'inline-block';
      pillEl.style.marginBottom = '8px';
      textCell.appendChild(pillEl);
    }

    // Title (h3)
    const title = details.querySelector('.recipe-details__title');
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      textCell.appendChild(h);
    }

    // Level (p)
    const level = details.querySelector('.recipe-details__level');
    if (level) {
      const pLevel = document.createElement('p');
      const icon = level.querySelector('img');
      if (icon) pLevel.appendChild(icon.cloneNode(true));
      // Only the text after the icon
      const levelText = level.childNodes[level.childNodes.length - 1].textContent.trim();
      pLevel.appendChild(document.createTextNode(' ' + levelText));
      textCell.appendChild(pLevel);
    }

    // Time (p)
    const time = details.querySelector('.recipe-details__time');
    if (time) {
      const pTime = document.createElement('p');
      const icon = time.querySelector('img');
      if (icon) pTime.appendChild(icon.cloneNode(true));
      // Only the text after the icon
      const timeText = time.childNodes[time.childNodes.length - 1].textContent.trim();
      pTime.appendChild(document.createTextNode(' ' + timeText));
      textCell.appendChild(pTime);
    }

    // Action icons (download/share)
    const actionsDiv = document.createElement('div');
    actionsDiv.style.marginTop = '8px';
    const downloadIcon = cardNode.querySelector('.icon-container-download a.download-icon__link');
    if (downloadIcon) {
      const a = document.createElement('a');
      a.href = downloadIcon.href;
      a.textContent = 'Download';
      a.setAttribute('download', '');
      actionsDiv.appendChild(a);
    }
    const shareIconContainer = cardNode.querySelector('.icon-container-share');
    if (shareIconContainer) {
      const shareImg = shareIconContainer.querySelector('img');
      if (shareImg) {
        const span = document.createElement('span');
        span.title = 'Share';
        span.appendChild(shareImg.cloneNode(true));
        actionsDiv.appendChild(span);
      }
    }
    if (actionsDiv.childNodes.length) {
      textCell.appendChild(actionsDiv);
    }

    rows.push([imgCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
