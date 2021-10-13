// Maybe use this in the future: https://github.com/openbibleinfo/Bible-Passage-Reference-Parser
// Start with looking up the bible book and chapter.
// https://www.jw.org/en/library/bible/nwt/books/exodus/2/#v2002002
// https://www.jw.org/en/library/bible/nwt/books/exodus/2

var books = ['Genesis',
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
]

var bcv = new bcv_parser;

var recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.getElementById('diagnostic');
var inputButton = document.getElementById('input-button');
var link = document.getElementById('link-to-scripture');

inputButton.onclick = function () {
    recognition.start();
    inputButton.classList.remove('btn-primary');
    inputButton.classList.add('btn-danger');

    console.log('Ready to receive voice input.');
}

recognition.onaudioend = function () {
    inputButton.classList.remove('btn-danger');
    inputButton.classList.add('btn-primary');
    console.log('Audio capturing ended');
}

recognition.onresult = function (event) {
    inputButton.classList.remove('btn-danger');
    inputButton.classList.add('btn-primary');    
    var rawResult = event.results[0][0].transcript;
    var tempResult =rawResult;
    // Replace cardinal numbers.
    rawResult = rawResult.replace("1st", "1");
    rawResult = rawResult.replace("First", "1");
    rawResult = rawResult.replace("2nd", "2");
    rawResult = rawResult.replace("Second", "2");
    rawResult = rawResult.replace("3rd", "3");
    rawResult = rawResult.replace("Third", "2");



    var r = bcv.parse(rawResult);
    if (r.entities.length === 0) {
        diagnostic.textContent = `Invalid input. Please try again. This is what the browser recognized: ${tempResult}`;
        link.href = "";
        link.textContent = "";
        return;
    }
    if (r.entities[0].passages[0].start.c === undefined) {
        diagnostic.textContent = `Invalid input. Please try again. This is what the browser recognized: ${tempResult}`;
        link.href = "";
        link.textContent = "";
        return;
    }

    var book = r.entities[0].passages[0].start.b
    book = r.passage.books[0].value;
    var bookNumber = books.findIndex(item => book.toLowerCase() === item.toLowerCase());
    var chapter = r.entities[0].passages[0].start.c;
    var verse = undefined;
    // Detect if there is a number over 100 and not in the book of Psalms. If so then take the first digit and make it the chapter. So Matthew 633 would be Matthew 6:33.
    if (chapter > 100 && bookNumber !== 18) {
        var tempVerse = parseInt(chapter.toString().substring(1, chapter.length));
        verse = tempVerse;

        var tempChapter = parseInt(chapter.toString().substring(0, 1));
        chapter = tempChapter;       
    }

    var paddedChapter = chapter.toString().padStart(3, "0");

    if (r.entities[0].passages[0].start.v !== undefined || verse !== undefined) {
        if (verse === undefined)
        {
            verse = r.entities[0].passages[0].start.v; 
        }
        
        // var paddedVerse = verse.toString().padStart(3, "0");
        link.textContent = `View scripture on JW website : ${books[bookNumber]} ${chapter}:${verse}`;
        // Main site.
        //link.href = `https://www.jw.org/en/library/bible/nwt/books/${book}/${chapter}#v${bookNumber + 1}${paddedChapter}${paddedVerse}`;
        // Watchtower Online
        link.href = `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${bookNumber + 1}/${chapter}#s=${verse}&study=discover&v=${bookNumber + 1}:${chapter}:${verse}`;
        link.target = "_blank";
        window.open(link.href, '_blank');
    }
    else {
        link.textContent = `View scripture on JW website : ${books[bookNumber]} ${chapter}`;
        // Main site.
        //link.href = `https://www.jw.org/en/library/bible/nwt/books/${book}/${chapter}`;
        // Watchtower Online
        link.href = `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${bookNumber + 1}/${chapter}`;
        link.target = "_blank";
        window.open(link.href, '_blank');
    }
    diagnostic.textContent = `This is what the browser recognized: ${tempResult}`;
}
        // book number, chapter number, verse number.
        //v 1 001 001
        //https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/1/1#s=29&study=discover&v=1:1:26
        //https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/40/6#study=discover&v=40:6:33
        //https://www.jw.org/finder?wtlocale=E&pub=nwtsty&srctype=wol&bible=40006013&srcid=share