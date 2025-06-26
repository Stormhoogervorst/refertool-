# Referral Tool

This project sends confirmation emails using a Netlify Function (`send-email`).

The `NETLIFY_SITE_URL` constant in `index.html` is set to
`https://visionary-fox-2db954.netlify.app`. If you deploy the page under a
different Netlify domain, update this value so the serverless function can be
reached when the page is not hosted on Netlify.

In your Netlify dashboard, configure these environment variables:

```
SENDGRID_API_KEY     # Your SendGrid API key
SENDGRID_FROM_EMAIL  # The verified "from" email address
```

Without them the `send-email` function will fail and no invitation emails will be sent.
