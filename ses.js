/***********AWS SES******************/
const aws = require('aws-sdk');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-west-1'
});

exports.sendEmail = function (to, subject, message) {
    return ses.sendEmail({
        Source: 'Sixth Carver <sixth.carver@spicedling.email>', //where the email is being sent from
        Destination: {
            //this has to be my email as used when signing up to spiced, or the aws email.
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: subject
            }
        }
    }).promise().then(() => {
        console.log('email sent');
    }).catch(err => {
        console.log('email error', err);
    })
}

