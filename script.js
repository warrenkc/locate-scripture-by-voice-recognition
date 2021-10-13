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
            console.log('Ready to receive voice input.');
        }

        recognition.onresult = function (event) {
            var rawResult = event.results[0][0].transcript;
            var r = bcv.parse(rawResult);
            if (r.entities.length === 0) {
                diagnostic.textContent = `Invalid input. Please try again. This is what the browser recognized: ${rawResult}`;
                link.href = "";
                link.textContent = "";
                return;
            }
            var book = r.entities[0].passages[0].start.b
            book = r.passage.books[0].value;
            var chapter = r.entities[0].passages[0].start.c;
            var verse = r.entities[0].passages[0].start.v;

         
            var bookNumber = books.findIndex(item => book.toLowerCase() === item.toLowerCase());
            var paddedChapter = chapter.toString().padStart(3, "0");
            var paddedVerse = verse.toString().padStart(3, "0");
            link.textContent = `View scripture on JW website : ${books[bookNumber]} ${chapter}:${verse}`;
            link.href = `https://www.jw.org/en/library/bible/nwt/books/${book}/${chapter}#v${bookNumber+1}${paddedChapter}${paddedVerse}`;
            link.target = "_blank";
        }
        // book number, chapter number, verse number.
        //v 1 001 001
        //https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/1/1#s=29&study=discover&v=1:1:26
        //https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/40/6#study=discover&v=40:6:33