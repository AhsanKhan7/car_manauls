const fs = require('fs');
const convert = require('xml-js');


const inputFile = './externalData/data.xml';
const outputFile = './tmp/carDBAPI.json';

// The values on the left are from the <modification> children in our data.xml file. The values on the right are from the https://schema.org/Vehicles schema.
const semanticMapping = {
    coupe: 'bodyType',
    acceleration: 'accelerationTime',
    luggageMax: 'cargoVolume',
    drive: 'driveWheelConfiguration',
    co2: 'emissionsCO2',
    power: 'enginePower',
    powerHp: 'enginePower',
    engineDisplacement: 'engineDisplacement',
    tankVolume: 'fuelCapacity',
    fuelConsumptionCombined: 'fuelEfficiency',
    fuel: 'fuelType',
    emissionStandard: 'meetsEmissionStandard',
    yearstart: 'modelDate',
    doors: 'numberOfDoors',
    gearboxMT: 'numberOfForwardGears',
    gearboxAT: 'numberOfForwardGears',
    roofLoad: 'roofLoad',
    places: 'seatingCapacity',
    maxspeed: 'speed',
    powerRpm: 'torque',
    trailerLoadUNBraked: 'trailerWeight',
    wheelbase: 'wheelbase',
    maxWeight: 'weightTotal'
};

function addModifications(modifications, modelYear, modificationsArray, images) {
    if (modelYear) {
        modelYear.semantic = 'vehicleModelDate';
        modelYear.numeric = parseInt(modelYear._text);
    }

    if (modifications && Array.isArray(modifications.modification)) {
        modifications.modification.forEach(mod => {
            let modelYearSearchText = '';
            if (modelYear) {
                modelYearSearchText = modelYear._text;
            }
            let semantic = {};
            for (let [key, value] of Object.entries(mod)) {
                mod[key] = {_text: mod[key]._text, semantic: semanticMapping[key]}
            }

            modificationsArray.push({...mod, modelYear, images, searchHelper: `${mod.brand._text} ${mod.model._text}`});
        });
    } else {
        if (!modifications) {
            // console.log(JSON.stringify(modifications));
            modificationsArray.push({empty: 'invalid'});
        } else {
            modificationsArray.push({...modifications.modification, modelYear, images});
        }
    }
}

fs.readFile(inputFile, function (err, data) {
    const start = new Date();
    console.log(`Converting file ${inputFile} to ${outputFile}`);


    const result = convert.xml2js(data, {compact: true, spaces: 4});

    console.log('Converted. Writing to disk...');

    const modificationsArray = [];

    result.brands.brand.forEach(b => {
        if (Array.isArray(b.models.model)) {
            b.models.model.forEach(m => {
                if (Array.isArray(m.generations.generation)) {
                    m.generations.generation.forEach(gen => {
                        const {modelYear, images, modifications } = gen;
                        addModifications(modifications, modelYear, modificationsArray, images);
                    });
                } else {
                    const {modelYear, images, modifications } = m.generations.generation;
                    addModifications(modifications, modelYear, modificationsArray, images);
                }
            });
        } else {
            // const {modelYear, images, modifications } = b.models.model.generations.generation;
            // addModifications(modifications, modelYear, modificationsArray, images);
        }
    });

    console.log(`writing ${modificationsArray.length} objects`);
    fs.writeFile(outputFile, JSON.stringify(modificationsArray), function (err) {
        if (err) {
            return console.log(err);
        }
        const end = new Date() - start;
        console.log(`Converted to JSON in ${end}ms`);
    });
});