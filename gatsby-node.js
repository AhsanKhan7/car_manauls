const Papa = require('papaparse');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

exports.createPages = async ({actions}) => {
    const carPageData = await loadCSVFile();
    const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});
    const db = await connectToMongo(client);
    const combinedData = [];

    let collection = await db.collection('modifications');

    let index = 0;
    let nonPDFPages = 0;
    const populatedHits = [];

    for (const manual of carPageData) {

        let yearForPDF = parseInt(manual.year);
        await new Promise((resolve, reject) => {
            collection.find({
                    $and:
                        [
                            {$text: {$search: manual.make + ' ' + manual.model}},
                            {'modelYear.numeric': { $gt: yearForPDF - 3}},
                            {'modelYear.numeric': { $lt: yearForPDF + 3}}
                        ]
                }
            ).toArray(function (err, items) {
                if (err) throw err;
                console.log(`${index}: looking for [${manual.make}] and [${manual.model}] for [${manual.year}] -- Found in mongo: ${items.length} items, filtering...`);

                let searchHit;

                let currentHit = items[0];
                if(currentHit && currentHit.brand._text.toLowerCase() === manual.make.toLowerCase()) {
                    console.log(`Hit: modification ${currentHit.id._text}`);
                    searchHit = currentHit;
                }

                if (searchHit) {
                    manual.carDBAPIdata = searchHit;
                    populatedHits.push([searchHit._id]);
                }
                combinedData.push(manual);
                resolve('ok');
            });
        });
        index++;
    }

    fs.writeFile('searchfill.log', `Got data for ${populatedHits.length} from a total of ${index} PDFs` , function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('Log file saved');
    });

    // await client.close();

    //create a page for each PDF, populated with DB data
    combinedData.forEach(manual => {
        actions.createPage({
            path: `/${manual.year}/${manual.make}/${manual.model}.html`,
            component: require.resolve(`./src/templates/car-manual-template.js`),
            context: {manual}
        });
    });

    // collection = await db.collection('modifications');
    //
    // const docs = await collection.find().toArray();
    //
    // docs.forEach(function(entry, index) {
    //     if(entry.id) {
    //         if(!populatedHits[entry.id._text]) {
    //             console.log(`${index} out of ${docs.length}`);
    //
    //             const year = entry.modelYear ? entry.modelYear._text : (entry.yearstart ? entry.yearstart._text : '2000');
    //             entry.year = year;
    //             nonPDFPages++;
    //             actions.createPage( {
    //                 path: `/${year}/${entry.brand._text}/${entry.model._text}.html`,
    //                 component: require.resolve(`./src/templates/car-manual-template-no-pdf.js`),
    //                 context: {entry}
    //             });
    //         }
    //     }
    // });

    console.log(`Got data for ${populatedHits.length} from a total of ${index} PDFs`);
    console.log(`Created ${nonPDFPages} additional pages from DB`);
    console.log(`Total: ${index + nonPDFPages}`);
};

async function connectToMongo(client) {
    return new Promise((resolve, reject) => {
        client.connect(function (err) {
            if (err) throw err;
            const db = client.db('carDBAPI');
            resolve(db);
        });
    });
}

async function loadCSVFile() {
    return new Promise((resolve, reject) => {
        const file = fs.createReadStream('./tmp/car-manuals.csv');
        const arrayRows = [];
        Papa.parse(file, {
            header: true,
            step: function (results) {
                arrayRows.push(results.data);
            },
            complete: function (results, file) {
                resolve(arrayRows);
            }
        });
    });
}