/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns3)'];

  // Find main content
  const content = element.querySelector('.footer-brand__primary--content');
  if (!content) return;

  // Get left and right sections
  const leftSection = content.querySelector('.footer-brand__left');
  const rightSection = content.querySelector('.footer-brand__right');

  // --- Left Column: Logos and License Info ---
  const leftItems = [];
  if (leftSection) {
    // Add all images
    leftItems.push(...leftSection.querySelectorAll('img'));
    // Add all text nodes (license number, etc.)
    Array.from(leftSection.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        leftItems.push(span);
      }
    });
    // Add all text from non-image, non-anchor elements (e.g., license number)
    leftSection.querySelectorAll('span, div').forEach(el => {
      if (
        el.textContent.trim() &&
        el.querySelectorAll('img').length === 0 &&
        el.querySelectorAll('a').length === 0
      ) {
        leftItems.push(el.cloneNode(true));
      }
    });
    // Ensure 'Lic. No. 10012031000312' is present
    if (!leftItems.some(item => item.textContent && item.textContent.match(/Lic\.?\s*No\.?\s*\d+/))) {
      const licenseMatch = leftSection.textContent.match(/Lic\.?\s*No\.?\s*\d+/);
      if (licenseMatch) {
        const span = document.createElement('span');
        span.textContent = licenseMatch[0];
        leftItems.push(span);
      }
    }
    // Ensure 'fssai' is present (from logo or text)
    if (!leftItems.some(item => item.textContent && item.textContent.toLowerCase().includes('fssai'))) {
      // Try to extract from alt attribute of second image
      const imgs = leftSection.querySelectorAll('img');
      if (imgs[1] && imgs[1].alt && imgs[1].alt.toLowerCase().includes('fssai')) {
        const span = document.createElement('span');
        span.textContent = imgs[1].alt;
        leftItems.push(span);
      }
    }
    // If still missing 'fssai', try to extract from leftSection text
    if (!leftItems.some(item => item.textContent && item.textContent.toLowerCase().includes('fssai'))) {
      const fssaiMatch = leftSection.textContent.match(/fssai/i);
      if (fssaiMatch) {
        const span = document.createElement('span');
        span.textContent = fssaiMatch[0];
        leftItems.push(span);
      }
    }
  }

  // --- Right Column: Navigation Links ---
  // Organize links into two rows as in the screenshots
  const navRows = [[], []];
  if (rightSection) {
    const nav = rightSection.querySelector('nav');
    if (nav) {
      const allLists = nav.querySelectorAll('.footerList');
      // First row: first <li> from each list
      // Second row: second <li> from first two lists (if present)
      allLists.forEach((listDiv, idx) => {
        const lis = listDiv.querySelectorAll('li');
        if (lis[0]) {
          const link = lis[0].querySelector('a');
          if (link) navRows[0].push(link);
        }
        if (lis[1]) {
          const link = lis[1].querySelector('a');
          if (link) navRows[1].push(link);
        }
      });
    }
  }

  // Build table: header, then one row with left and right columns, then navigation links row
  const rows = [headerRow];
  // First row: left branding/info, right top navigation links
  rows.push([
    leftItems.length ? leftItems : '',
    navRows[0].length ? navRows[0] : ''
  ]);
  // Second row: left column empty, right bottom navigation links (if present)
  if (navRows[1].length) {
    rows.push(['', navRows[1]]);
  }

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
