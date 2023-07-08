// Maybe use this in the future: https://github.com/openbibleinfo/Bible-Passage-Reference-Parser
// Start with looking up the bible book and chapter.
// https://www.jw.org/en/library/bible/nwt/books/exodus/2/#v2002002
// https://www.jw.org/en/library/bible/nwt/books/exodus/2
const books = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Solomon (or Song of Songs)',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts of the Apostles',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation',
];

class ScriptureLookup {
  constructor() {
    this.bcv = new bcv_parser();
    this.recognition = this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    return recognition;
  }

  setRecognitionListeners(diagnostic, link, inputButton) {
    inputButton.onclick = () => {
      this.recognition.start();
      this.updateButtonStyle(inputButton, 'btn-primary', 'btn-danger');
      console.log('Ready to receive voice input.');
    };

    this.recognition.onaudioend = () => {
      this.updateButtonStyle(inputButton, 'btn-danger', 'btn-primary');
      console.log('Audio capturing ended');
    };

    this.recognition.onresult = (event) => {
      this.updateButtonStyle(inputButton, 'btn-danger', 'btn-primary');
      const rawResult = this.processRawResult(event.results[0][0].transcript);
      const parsedResult = this.bcv.parse(rawResult);

      if (this.isValidResult(parsedResult)) {
        const scriptureInfo = this.extractScriptureInfo(parsedResult);
        this.showScriptureLink(scriptureInfo, link);
        diagnostic.textContent = `This is what the browser recognized: ${rawResult}`;
      } else {
        this.showInvalidInputMessage(diagnostic, rawResult, link);
      }
    };
  }

  updateButtonStyle(button, oldClass, newClass) {
    button.classList.remove(oldClass);
    button.classList.add(newClass);
  }

  processRawResult(rawResult) {
    const replacements = [
      ['1st', '1'],
      ['First', '1'],
      ['2nd', '2'],
      ['Second', '2'],
      ['3rd', '3'],
      ['Third', '3'],
    ];

    replacements.forEach(([oldValue, newValue]) => {
      rawResult = rawResult.replace(oldValue, newValue);
    });

    return rawResult;
  }

  isValidResult(parsedResult) {
    const entity = parsedResult.entities[0];
    return entity && entity.passages[0].start.c !== undefined;
  }

  extractScriptureInfo(parsedResult) {
    const entity = parsedResult.entities[0];
    const start = entity.passages[0].start;
    const book = parsedResult.passage.books[0].value;
    const bookNumber = books.findIndex((item) =>
      book.toLowerCase() === item.toLowerCase()
    );
    let { c: chapter, v: verse } = start;

    if (chapter > 100 && bookNumber !== 18) {
      verse = parseInt(chapter.toString().substring(1));
      chapter = parseInt(chapter.toString().substring(0, 1));
    }

    return { bookNumber, chapter, verse };
  }

  showScriptureLink({ bookNumber, chapter, verse }, link) {
    const bookName = books[bookNumber];
    const paddedChapter = chapter.toString().padStart(3, '0');
    const labelText =
      verse !== undefined
        ? `View scripture on JW website: ${bookName} ${chapter}:${verse}`
        : `View scripture on JW website: ${bookName} ${chapter}`;

    link.textContent = labelText;
    link.href = verse !== undefined
      ? `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${bookNumber + 1}/${chapter}#s=${verse}&study=discover&v=${bookNumber + 1}:${chapter}:${verse}`
      : `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${bookNumber + 1}/${chapter}`;
    link.target = '_blank';
    // Removed unnecessary window.open() call
  }

  showInvalidInputMessage(diagnostic, rawResult, link) {
    diagnostic.textContent = `Invalid input. Please try again. This is what the browser recognized: ${rawResult}`;
    link.href = '';
    link.textContent = '';
  }
}

const scriptureLookup = new ScriptureLookup();

document.addEventListener('DOMContentLoaded', () => {
  const diagnostic = document.getElementById('diagnostic');
  const inputButton = document.getElementById('input-button');
  const link = document.getElementById('link-to-scripture');
  scriptureLookup.setRecognitionListeners(diagnostic, link, inputButton);
});
