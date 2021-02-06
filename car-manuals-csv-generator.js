const fs = require('fs');
const {basename} = require('path');
const Papa = require('papaparse');

const dropWords = [
    'owners', 'manual', 'compressed', 'unlimited', 'and', 'door', 'with',
    'information', 'maintenance', 'supplement', 'connected', 'touchscreen',
    'manual2', 'owner�s', 'owner', 'http', 'https', 'edited',
    'contentcatalogowner', 'information2017', 'en', 'us', 'version', 'om', 'fof', '001242',
    'warranty', 'guide', 'handbook', 'reference', 'quick', 'multimedia', 'navigation', 'mach.5337',
    'template', 'welcome', 'untitled', 'viewer', 'unnamed', 'file', 'stock', 'pricing', 'girls', 'nodia',
    'sepsisglossary', 'resume', 'passport', 'pdfurl', 'download', 'estimate', 'f1040a', 'fw4', 'csg memo', 'webview',
    'document', 'stove', 'safaridicor', 'showinspectionresultpdf', 'pdf export', 'pull', 'id card', '96broog1e', '96cromg1e',
    '99ecoog1e', '99f23og4e', '00ecoog1e', '00f23og3e', '01ecoog3e', '01f23og4e', '02ecoog4e', '02f23og5e', 'victoria', 'hundred',

    // URL parts in path
    'www.fordservicecontent.comford',
    'msmownerassets.z13.web', '.core',
    '.windows.netassetspublicationsen'
];

fs.readFile('./tmp/aws-manuals.txt', function(err, data) {
    const manuals =  data.toString().split(/\r?\n/);
    const s3baseUrl = 's3://carmanualsorgcontent/';
    const csvRows = [];

    const capitalizeAndFix = (s) => {
        if (s.indexOf(' ') >= 0) {
            s = s.replace(/\w\S*/g, function(subS) {
                if (subS.length == 2) {
                    return subS.toUpperCase();
                } else if (subS === 'USA') {
                    return 'USA';
                } else if (subS.startsWith('xdrive')) {
                    return subS.replace('xdrive', 'xDrive');
                } else if (subS.startsWith('sdrive')) {
                    return subS.replace('sdrive', 'sDrive');
                } else if (subS.endsWith('series')) {
                    return subS.replace('series', ' Series');
                } else {
                    return subS.charAt(0).toUpperCase() + subS.substr(1).toLowerCase();
                }
            });
        } else if (s.endsWith('series')) {
            s = s.replace('series', ' Series');
        } else {
            switch (s.toLowerCase()) {
                case ('bmw'): case ('gmc'): case ('ram'): case ('mini'):
                case ('mdx'): case ('rdx'): case ('rl'): case ('tl'): case ('tsx'): case ('ilx'): case ('zdx'): case ('rlx'):
                case ('tt'): case('tts'): case ('rs5'): case ('rs7'): case ('sq5'):
                    s = s.toUpperCase();
                    break;
                case ('rollsroyce'):
                    s = 'Rolls-Royce';
                    break;
                case ('harley'):
                    s = 'Harley-Davidson';
                    break;
                case ('1953'):
                    s = 'Citroën';
                    break;
                case ('1964'):
                    s = 'Ferrari';
                    break;
                case ('1977'):
                    s = 'Chevrolet';
                    break;
                case ('011243'): case ('021244'): case ('031245'): case ('041246'): case ('051247'): case ('061248'): case ('071249'): case ('081250'): case ('091251'):
                case ('101252'): case ('111253'): case ('121254'): case ('131255'): case ('141256'): case ('151257'): case ('161258'): case ('171259'): case ('181260'):
                case ('971239'): case ('981240'): case ('991241'):
                    s = 'Ford';
                    break;
                case ('tsxsportwagon'):
                    s = 'TSX Sport Wagon';
                    break;
                case ('fullline'):
                    s = 'Full Line';
                    break;
                case ('a4allroad'):
                    s = 'A4 Allroad';
                    break;
                case ('s8plus'):
                    s = 'S8 Plus';
                    break;
                case ('q5hybrid'):
                    s = 'Q5 Hybrid';
                    break;
                case ('a3etron'):
                    s = 'A3 e-tron';
                    break;
                case ('a3sportbacketron'):
                    s = 'A3 Sportback e-tron';
                    break;
                case ('John     GP'):
                    s = 'John GP';
                    break;
                case ('C     Amg'):
                    s = 'C Amg';
                    break;
                default:
                    s = s.charAt(0).toUpperCase() + s.slice(1);
                    break;
            }
        }

        return s;
    };

    manuals.forEach(m => {
        const source = rowToSource(m);
        const sourceUrl = s3baseUrl + source;
        const cells = validCells(source);

        if (cells[0] === 'carmanuals' || cells[0] === 'a1' || cells[0] === 'a2' || cells[0] === 'a3') {
            cells.splice(0,1);
        }
        let year = findYear(cells);

        let make = cells[0] ? cells[0] : '';
        let model = '';

        if (cells.length > 1) {
            const modelArray = source.split(/\//);
            const modelInfo = modelArray[modelArray.length - 1]; //just the end, we only care about model now, not directories
            // modelInfo.shift();
            model = modelInfo.replace(year, ''); //no longer needed for model
            let makeRegExp = new RegExp(make, 'ig');
            let alfaRomeo = new RegExp('(alfa-romeo-)', 'ig');
            model = model.replace(makeRegExp, ''); //no longer needed for model
            model = model.replace(alfaRomeo, ''); //for Alfa Romeo
            model = model.replace(/ë/g, 'e'); //for citroen
            model = model.replace(/\W/g, ' '); //retain just characters
            model = model.replace(/.pdf/i, ''); //remove extension
            model = model.replace(/[\s_]+/g, ' '); //remove double space '  '
            model = model.replace(/([A-Z.0-9]){5,}/g, ' '); //remove garbage values from beginning of filename, e.g.  'VOXC061686'
            model = model.replace(new RegExp('owner ?s manual', 'i'), '');
            model = model.replace(new RegExp('and maintenance information', 'i'), '');
            model = model.replace(new RegExp('quick reference guide', 'i'), '');
            model = model.trim();
            model = model.trimStart();
            // model = model.toLowerCase();
        }
        year = year.toString().replace(/\.5/, ''); //some years in source data are with nonsensical posfix .5 e.g. 2017.5
        year = year.toString().replace(/\.75/, ''); //some years in source data are with nonsensical posfix .5 e.g. 2017.5

        csvRows.push([capitalizeAndFix(make), sourceUrl, 'language-unspecified', capitalizeAndFix(model), year]);
    });

    generateFiles(csvRows)
});

function rowToSource(row) {
    const sanitizedRow = row.split(/ +/);
    const [date, hour, num, ...source] = sanitizedRow;

    return source.join(' ');
}

function validCells(source) {
    // let pdfName = basename(source, '.pdf');
    let pdfName = source.replace(/\.pdf/i, '');

    const used = new Set();

    return pdfName.split(/[_\-\/]/).filter((value, index, arr) => {
        let keep = value.length && !dropWords.includes(value.toLowerCase());

        if (keep) {
            // const lowered = value.toLowerCase();
            const lowered = value;

            if (used.has(lowered)) {
                keep = false;
            } else {
                used.add(lowered);
            }
        }

        // drop trailing index from duplicates
        if (keep && index === arr.length - 1 && value === '1') {
            keep = false;
        }

        const valueRegex = /^[A-Z0-9]+$/;

        if (keep && (value.length > 6 && valueRegex.test(value))) {
            keep = false;
        }

        return keep;
    });
}

function findYear(cells) {
    let year = 0;
    let yearIndex = -1;
    const eligibleYear = new Date().getFullYear() + 2;

    for (let i = 0, len = cells.length; i < len; i++) {
        const parsed = Number(cells[i]);

        if (parsed && !isNaN(parsed) && parsed > year && parsed > 1964 && parsed < 2025) {
            year = parsed;
            yearIndex = i;
        }
    }

    if (year && year < eligibleYear) {
        // Modify cells. Function is dirty but we don't care
        // Performance is more important.
        cells.splice(yearIndex, 1);
    }

    return year ? year : '';
}

function generateFiles(csvRows) {
    const validRows = [];
    const invalidRows = [];

    csvRows.forEach(r => {
        const [make, s3Url, language, year] = r;

        if (make && year) {
            validRows.push(r);
        } else {
            // check for empty folders
            if (s3Url.substr(-1) !== '/') {
                invalidRows.push(s3Url);
            }
        }
    });

    generateTxtFile(invalidRows);
    combineCsvData(validRows);
}

function generateTxtFile(invalidRows) {
    const time = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const timestamp = new Date().getTime();
    const rowsLength = 'Invalid rows :' + ' ' + invalidRows.length;
    const fileDetails = 'The file was created on ' + time + ' ' + timestamp + ' \n' +  rowsLength + '\n' + '\n';
    const txtFileName = './tmp/invalid-' + time + '-' + timestamp + '.txt';
    const dir = './tmp';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    fs.writeFile(txtFileName, [fileDetails + invalidRows.join('\n')] , function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('Invalid: The file was saved!');
    });
}

function generateCsvFile(csv) {
    fs.writeFile('./tmp/car-manuals.csv', csv, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('Valid: The file was saved!');
    });
}

function combineCsvData(validRows) {
    const filePath = null;
    // const filePath = fs.createReadStream('./car-manuals-sample.csv');

    if (filePath) {
        Papa.parse(filePath, {
            header: false,
            dynamicTyping: true,
            complete: function(results) {
                const sampleData = results.data.map(d => ([d[3], d[10], d[6], d[7], d[12]]));
                sampleData.shift();
                // const englishManuals = sampleData.filter(d => d[2].toLowerCase() === 'english');
                const csvData = [...validRows, ...englishManuals];

                const csv = Papa.unparse({
                    fields: ['make', 's3URL', 'language', 'model', 'year'],
                    data: csvData,
                });

                generateCsvFile(csv);
            }
        });
    } else {
        const csv = Papa.unparse({
            fields: ['make', 's3URL', 'language', 'model', 'year'],
            data: validRows,
        });

        generateCsvFile(csv);
    }

}