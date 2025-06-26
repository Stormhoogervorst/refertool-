// This function uses the official SendGrid mail library
const sgMail = require('@sendgrid/mail');

// Set the API key from Netlify's environment variables.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { email } = JSON.parse(event.body);

        if (!email) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Email is required.' }) };
        }

        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Bedankt voor de samenwerking!',
            text: "Namens het team van Kwh People willen we je super bedanken voor het meedenken in onze zoektocht naar nieuw talent. Je hulp bij het vinden van geschikte kandidaten waarderen we enorm!\n\nWe houden jullie natuurlijk op de hoogte van de updates rondom de kandidaten die jullie hebben voorgedragen. Zodra er nieuws is, hoor je van ons.\n\nNogmaals bedankt en tot snel!\n\nMet vriendelijke groet,\n\nJoris van Nieuwenhuijze"
        };

        await sgMail.send(msg);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!' })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
          console.error(error.response.body)
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send email.' })
        };
    }
};
