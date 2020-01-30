import Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: "sandbox1049d2afab87441cb9c41c30b9b6cdc0.mailgun.org"
});

const sendEmail = (subject:string, html:string) => {
    const emailData: Mailgun.messages.SendData = {
        from: "julong01@naver.com",
        to: "julong01@naver.com",
        subject,
        html
    }
    return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
    const emailSubject = `Hello! ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">here</a>`;
    return sendEmail(emailSubject, emailBody);
};