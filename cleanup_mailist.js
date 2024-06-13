async function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

async function cleanSubject() {
  const subjectSpans = document.querySelectorAll('#MailList span[title]');

  for (const span of subjectSpans) {
    if (!(await isInViewport(span))) continue;
    if (span.dataset.subjectChecked === 'OK') continue;

    span.dataset.subjectChecked = 'OK';

    const cleanedText = span.innerText.replace(
      /^(?!.*Request\sID\s\[#RE-\d+#\]).*(R(e|E):\s)?\[#R(E|e)-\d+#\]\s?\:\s*/g,
      ''
    );
    span.innerText = cleanedText;

    const sender = span.parentElement?.parentElement?.nextElementSibling?.firstChild;
    if (sender && sender.innerText !== 'Support') {
      if (/.*((is CRITICAL)|(DOWN)!)/.test(cleanedText) || /(Failure on).*/.test(cleanedText)) {
        sender.append('..  🤬');
        sender.style.color = "#DC626D";
      } else if (/.*(((is OK)|(UP)!)|successful)/.test(cleanedText) || /(Success on).*/.test(cleanedText)) {
        sender.append('..  😍');
        sender.style.color = "#5EC75A";
      }
    }
  }
}

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const debouncedCleanSubject = debounce(cleanSubject, 100);

// Initial cleaning of existing subjects
cleanSubject().then(() => {
  console.log('Initial subject cleaning completed.');
});

// Observe the document for changes and run cleanSubject when changes occur
const observer = new MutationObserver(() => {
  debouncedCleanSubject();
});

observer.observe(document.body, { childList: true, subtree: true });
