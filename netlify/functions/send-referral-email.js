// This line imports the official SendGrid mail library, which is a toolset for sending email.
const sgMail = require('@sendgrid/mail');

// This line tells the SendGrid library to use your secret API key.
// It securely retrieves the key from Netlify's environment variables, so it's never exposed in your public code.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This is the main serverless function that Netlify will run every time your webpage calls it.
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async function(event) {
    // Allow CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: 'OK' };
    }

    // A security check: This function should only be triggered by a POST request from your website,
    // not by someone just visiting the function's URL in their browser.
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    // The 'try...catch' block is for error handling. It will "try" to run the code inside.
    // If anything fails, it will "catch" the error and handle it gracefully.
    try {
        // The data sent from your website (the user's email) is in 'event.body'.
        // This line parses that data and extracts the email address.
        const { email } = JSON.parse(event.body);

        // A quick check to make sure an email was actually sent.
        if (!email) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Email is required.' }) };
            return { statusCode: 400, headers, body: JSON.stringify({ message: 'Email is required.' }) };
        }

        // --- This is where the email itself is prepared ---
        const msg = {
            to: email, // The recipient: The email address the user entered in the form.
            
            // The sender: The email address that the email will appear to come from.
            // This also securely retrieves your verified "from" email from Netlify's environment variables.
            from: process.env.SENDGRID_FROM_EMAIL, 
            
            subject: 'Bedankt voor de samenwerking!',
            
            // The main body of the email. The '\n' characters create new lines.
            text: "Namens het team van Kwh People willen we je super bedanken voor het meedenken in onze zoektocht naar nieuw talent. Je hulp bij het vinden van geschikte kandidaten waarderen we enorm!\n\nWe houden jullie natuurlijk op de hoogte van de updates rondom de kandidaten die jullie hebben voorgedragen. Zodra er nieuws is, hoor je van ons.\n\nNogmaals bedankt en tot snel!\n\nMet vriendelijke groet,\n\nJoris van Nieuwenhuijze"
        };

        // --- This is the command that actually sends the email ---
        // It tells the SendGrid library to send the message we just prepared.
        // The 'await' keyword makes the function pause and wait until SendGrid confirms the email is sent.
        await sgMail.send(msg);

        // If the line above was successful, the function sends a success message back to your website.
        // statusCode 200 means "OK / Success".
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Email sent successfully!' })
        };

    } catch (error) {
        // If any part of the 'try' block failed, the code jumps here.
        console.error('Error sending email:', error); // This logs the detailed error in your Netlify function log for debugging.
        if (error.response) {
          console.error(error.response.body) // If SendGrid provides specific errors, log those too.
        }

        // The function sends a failure message back to your website.
        // statusCode 500 means "Internal Server Error".
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Failed to send email.' })
        };
    }
};
