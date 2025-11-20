/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract visible text and images from a container
  function extractVisibleContent(container) {
    const nodes = [];
    if (!container) return nodes;
    // Tags
    const tags = container.querySelector('.dishinfo-tag__container');
    if (tags) {
      Array.from(tags.querySelectorAll('.dishinfo-tag__item')).forEach(e => {
        if (e.textContent.trim()) {
          const tagDiv = document.createElement('div');
          tagDiv.textContent = e.textContent.trim();
          nodes.push(tagDiv);
        }
      });
    }
    // Difficulty, Time, Serves
    const brief = container.querySelector('.dishinfo-brief__container');
    if (brief) {
      Array.from(brief.querySelectorAll('.dishinfo-brief__item')).forEach(item => {
        const rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';
        rowDiv.style.alignItems = 'center';
        // Icon (img)
        const img = item.querySelector('img');
        if (img) rowDiv.appendChild(img.cloneNode(true));
        // Text
        const txt = item.querySelector('.dishinfo-brief__item-text');
        if (txt) {
          const span = document.createElement('span');
          span.textContent = txt.textContent.trim();
          rowDiv.appendChild(span);
        }
        nodes.push(rowDiv);
      });
    }
    // Description (h1, paragraphs, fact check)
    const desc = container.querySelector('.dishinfo-description');
    if (desc) {
      let seenFactCheck = false;
      Array.from(desc.querySelectorAll('h1, p')).forEach(e => {
        const txt = e.textContent.trim();
        if (txt) {
          // Only include 'Sunrise Fact Check' heading once
          if (txt.replace(/\u00a0/g, '').trim() === 'Sunrise Fact Check' && seenFactCheck) return;
          if (txt.replace(/\u00a0/g, '').trim() === 'Sunrise Fact Check') seenFactCheck = true;
          nodes.push(e.cloneNode(true));
        }
      });
    }
    // Buttons (Share, Download)
    const btns = container.querySelector('.dishinfo-btns');
    if (btns) {
      Array.from(btns.querySelectorAll('button, a')).forEach(btn => {
        if (btn.textContent.trim()) nodes.push(btn.cloneNode(true));
      });
    }
    // Social media share section
    const shareComp = container.querySelector('.share-component');
    if (shareComp) {
      const socialSection = shareComp.querySelector('.social-media-share__wrapper');
      if (socialSection) {
        // Title
        const title = socialSection.querySelector('.social-media-share__wrapper--title');
        if (title) nodes.push(title.cloneNode(true));
        // Social icons and labels
        const icons = socialSection.querySelectorAll('.social-media-share__wrapper--icon-label');
        icons.forEach(icon => {
          const label = icon.querySelector('.social-media-share__wrapper--label');
          if (label) {
            const labelDiv = document.createElement('div');
            labelDiv.textContent = label.textContent.trim();
            nodes.push(labelDiv);
          }
        });
        // Copy button
        const copyBtn = socialSection.querySelector('.social-media-share__wrapper--button');
        if (copyBtn) nodes.push(copyBtn.cloneNode(true));
      }
    }
    return nodes;
  }

  function extractIngredientsContent(container) {
    const nodes = [];
    if (!container) return nodes;
    // Title
    const title = container.querySelector('.ingredients-title');
    if (title) nodes.push(title.cloneNode(true));
    // List as two-column flex rows (not a table)
    const list = container.querySelector('.ingredients-list');
    if (list) {
      Array.from(list.querySelectorAll('li')).forEach(li => {
        const name = li.querySelector('.ingredients-list__item--name');
        const qty = li.querySelector('.ingredients-list__item--quantity');
        const rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';
        rowDiv.style.justifyContent = 'space-between';
        if (name) {
          const nameSpan = document.createElement('span');
          nameSpan.textContent = name.textContent.trim();
          rowDiv.appendChild(nameSpan);
        }
        if (qty) {
          const qtySpan = document.createElement('span');
          qtySpan.textContent = qty.textContent.trim();
          rowDiv.appendChild(qtySpan);
        }
        nodes.push(rowDiv);
      });
    }
    // Product image and caption (first swiper card)
    const swiperCard = container.querySelector('.ingredients-swiper .swiper-slide-active, .ingredients-swiper .swiper-slide');
    if (swiperCard) {
      const img = swiperCard.querySelector('img');
      if (img) nodes.push(img.cloneNode(true));
      const caption = swiperCard.querySelector('.ingredients-swiper__card-title');
      if (caption) {
        const captionEl = document.createElement('div');
        captionEl.textContent = caption.textContent.trim();
        nodes.push(captionEl);
      }
    }
    return nodes;
  }

  // Find the main two columns
  const leftCol = element.querySelector('.dishinfo-container');
  const rightCol = element.querySelector('.dishinfo-ingredients');

  // Defensive: If not found, fallback to first two direct children
  let leftContent = leftCol;
  let rightContent = rightCol;
  if (!leftContent || !rightContent) {
    const directDivs = element.querySelectorAll(':scope > div > section > div > div');
    leftContent = leftContent || directDivs[0];
    rightContent = rightContent || directDivs[1];
  }

  // Compose left and right column cells
  const leftCell = extractVisibleContent(leftContent);
  const rightCell = extractIngredientsContent(rightContent);

  // Table structure
  const headerRow = ['Columns (columns28)'];
  const contentRow = [leftCell, rightCell];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
