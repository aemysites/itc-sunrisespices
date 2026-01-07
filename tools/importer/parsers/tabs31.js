/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs block header row
  const headerRow = ['Tabs (tabs31)'];

  // Find all swiper-slide elements (each is a tab/question)
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));

  // For each slide, extract the tab label (question) and tab content (options)
  const rows = slides.map(slide => {
    // Tab label: use the question heading (h3)
    const tabLabel = slide.querySelector('h3')?.textContent?.trim() || '';

    // Tab content: create a container div for the options
    const tabContentDiv = document.createElement('div');
    // Only add visible option labels (no form, no hidden spans)
    const optionLabels = Array.from(slide.querySelectorAll('label.quiz-options__label'));
    optionLabels.forEach(label => {
      tabContentDiv.appendChild(label.cloneNode(true));
    });

    return [tabLabel, tabContentDiv];
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
