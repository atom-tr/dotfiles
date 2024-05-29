async function cleanSubject() {
  const subjectSpans = document.querySelectorAll('#MailList span[title]');
  await Promise.all(Array.from(subjectSpans).map((span) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanedText = span.innerText.replace(
          /^(?!.*Request\sID\s\[#RE-\d+#\]).*(R(e|E):\s)?\[#R(E|e)-\d+#\]\s?\:\s*/g,
          ''
        );
        span.innerText = cleanedText;
        resolve();
      }, 50);
    });
  }));
}

const observer = new MutationObserver(cleanSubject);
observer.observe(document.body, { childList: true });
