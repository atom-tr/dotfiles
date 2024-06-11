async function cleanSubject() {
  const subjectSpans = document.querySelectorAll('#MailList span[title]');
  await Promise.all(Array.from(subjectSpans).map((span) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (span.dataset.subjectChecked == 'OK') return
        span.dataset.subjectChecked = 'OK'
        const cleanedText = span.innerText.replace(
          /^(?!.*Request\sID\s\[#RE-\d+#\]).*(R(e|E):\s)?\[#R(E|e)-\d+#\]\s?\:\s*/g,
          ''
        );
        span.innerText = cleanedText;
        const sender = span.parentElement?.parentElement?.nextElementSibling?.firstChild
        if  (/.*((is CRITICAL)|(DOWN)!)/.test(cleanedText)) {
          if (sender && sender.innerText !== 'Support') sender.append('..  🤬')
          if (sender) sender.style.color = "#DC626D"
        } else if ((/.*(((is OK)|(UP)!)|successful)/.test(cleanedText)) || (/(Success on).*/.test(cleanedText))) {
          sender?.append('..  😍')
          if (sender) sender.style.color = "#5EC75A"
        } 
        resolve();
      }, 50);
    });
  }));
}

const observer = new MutationObserver(cleanSubject);
observer.observe(document.body, { childList: true });
