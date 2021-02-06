'use strict';
const AWS = require('aws-sdk')
console.log('Loading function');

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : res,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
    });

    switch (event.httpMethod) {

        case 'OPTIONS':
            console.log('OPTIONS call');
            done(null, 'OK');
            break;
        case 'GET':
            const s3 = new AWS.S3();
            //AWS.config.update({accessKeyId: 'AKIAW3C7CU6Q7WKO634L', secretAccessKey: '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'});

            const myBucket = 'carmanualsorgcontent';
            const myKey = decodeURIComponent(event.pathParameters.file);
            const signedUrlExpireSeconds = 60;

            let params = {
                Bucket: myBucket,
                Key: myKey,
                Expires: signedUrlExpireSeconds
            };

            s3.getSignedUrl('getObject', params, function(err, url) {
                if(err) {
                    done(new Error(err));
                }
                done(null, url);
            });
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
