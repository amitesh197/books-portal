import express from 'express';
import { google } from 'googleapis';

// OAuth 2.0 credentials
const clientId = '20689467619-l17cqbv9bi9g764kanae88qlq8i5lt6v.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'http://localhost:3005/login'; // Ensure this matches your authorized redirect URI

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// Create the Express app
const app = express();
const port = 3005;

// Route to generate the authorization URL
app.get('/authorize', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  res.send(`Authorize this app by visiting this <a href="${url}">url</a>`);
});

// Route to handle the OAuth 2.0 callback
app.get('/login', async (req, res) => {
  const code = req.query.code;
  if (code) {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Output the tokens
      console.log('Access Token:', tokens.access_token);
      console.log('Refresh Token:', tokens.refresh_token);

      res.send('Authorization successful! You can now close this window.');
    } catch (error) {
      res.send('Error during authorization: ' + error.message);
    }
  } else {
    res.send('No authorization code found.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log('Visit http://localhost:3005/authorize to start the OAuth 2.0 flow');
});
