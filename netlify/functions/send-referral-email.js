// Import the SendGrid mail service
const sgMail = require('@sendgrid/mail');

// Set the SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return { statusCode: 400, body: 'Email is required.' };
    }

    // --- Generate a unique referral code ---
    const referralCode = 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // --- Construct the referral link ---
    // IMPORTANT: Replace this with your actual live site URL
    const siteUrl = 'https://your-live-site.netlify.app'; 
    const referralLink = `${siteUrl}?ref=${referralCode}`;

    // --- Email content ---
    const msg = {
      to: email, // The email address entered by the referrer
      from: fromEmail, // Your verified sender email in SendGrid
      subject: 'Jouw persoonlijke deellink voor de vacature',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hoi,</h2>
          <p>Bedankt voor je interesse in het aandragen van een kandidaat voor de functie van <strong>Business Development Officer</strong>.</p>
          <p>Hier is jouw unieke link die je kunt delen met je netwerk:</p>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 8px;">
            <a href="${referralLink}" style="font-size: 16px; color: #435776;">${referralLink}</a>
          </p>
          <p>Wanneer een kandidaat via deze link solliciteert en wordt aangenomen, kom jij in aanmerking voor de bonus van €1000.</p>
          <p>Met vriendelijke groet,<br>Het Team</p>
        </div>
      `,
    };

    // --- Send the email ---
    await sgMail.send(msg);

    // --- Return a success response ---
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };

  } catch (error) {
    console.error('Error sending email:', error);
    // It's good practice to check for more specific errors from SendGrid if possible
    if (error.response) {
      console.error(error.response.body);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email.' }),
    };
  }
};
