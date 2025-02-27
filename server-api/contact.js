'use strict';

const aws = require('aws-sdk');
const ses = new aws.SES();
const myEmail = process.env.EMAIL;
const myDomain = process.env.DOMAIN;

function generateResponse(code, payload) {
    return {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': myDomain,
            'Access-Control-Allow-Headers': 'x-requested-with',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(payload)
    }
}

function generateError(code, err) {
    return {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': myDomain,
            'Access-Control-Allow-Headers': 'x-requested-with',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(err.message)
    }
}

function getParamsFromUrl(url) {
    decodeURIComponent(url)
        .split('&')
        .reduce((acc, curr) => {
            const [key, value] = curr.split('=');
            acc[key] = value;
            return acc;
        }, {});
}

function generateEmailParamsFromJSON(body) {
    console.log('-------------------------------'+body);
    const {name, email, subject, message} = JSON.parse(body);
    console.log(email, name, message);

    const replacedName = name.replace(/\+/g, ' ');
    const replacedContent = message.replace(/\+/g, ' ');

    return {
        Source: myEmail,
        Destination: {ToAddresses: [myEmail]},
        ReplyToAddresses: [email],
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: `Message sent from email ${email} by ${replacedName} \nContent: ${replacedContent}`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `${subject}`
            }
        }
    }
}

module.exports.send = async (event) => {
    try {
        const emailParams = generateEmailParamsFromJSON(event.body);
        const data = await ses.sendEmail(emailParams).promise();
        return generateResponse(200, data)
    } catch (err) {
        return generateError(500, err)
    }
};