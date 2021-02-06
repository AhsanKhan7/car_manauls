export function manualUnlock(manualS3URL) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const s3URL = encodeURIComponent(manualS3URL.replace('s3://carmanualsorgcontent/', ''));
        const unlockLambdaURL = 'https://gsex0pzsjj.execute-api.us-east-2.amazonaws.com/beta/unlock/' + s3URL;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            } else if (xhr.status === 500) {
                reject('Lambda Error');
            }
        };
        xhr.open("GET", unlockLambdaURL, true);
        xhr.send();
    });
}

export function submitFormEmail(name, email, subject, message) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        console.log(`${name}, ${email}, ${subject}, ${message}`);
        const sendMailURL = 'https://mebrey2fki.execute-api.us-east-1.amazonaws.com/dev/email/send';
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            } else if (xhr.status === 500) {
                reject('Lambda Error');
            }
        };
        xhr.open('POST', sendMailURL, true);
        // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(JSON.stringify({name, email, subject, message}));
    });
}