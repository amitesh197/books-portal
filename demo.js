import { google } from 'googleapis';

const clientId = '20689467619-l17cqbv9bi9g764kanae88qlq8i5lt6v.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'http://localhost:3005/login';

// Replace with your access token
const accessToken = 'ya29.a0AcM612xpiTx1Dp9LZLYa3SXsURhB_85YN6eInDgZ3e03eGxK-wmOLUFyW1yKTIDHddrigHToG9bIh18yEOWHDrHvLjQ0loP2UsldPwIvficmquV2XvBonnMYqClNZ7t2lAtEsk9l1F1yiw2CEwAtsVX-hXaW8VXJhy5UV_3KaCgYKAYQSARISFQHGX2Mir1WdVvkrs6nME72ZLFZATQ0175';

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
oAuth2Client.setCredentials({ access_token: accessToken });

const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

const updateSheet = async () => {
  try {
    // 1. Get existing data from the sheet
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: '1B7EwUZOPWCM3c8efLvOpqFs_sHVdqjzmY7N8mXJzPXU',
      range: 'Sheet1',
    });

    const rows = readResponse.data.values || [];
    let rowIndexToUpdate = -1;

    // 2. Find the row index with the matching email
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][15] === 'amiteshs197@gmail.com') { // Assuming 'P' column is index 15 (0-based)
        rowIndexToUpdate = i + 1; // 1-based index for Sheets API
        break;
      }
    }

    if (rowIndexToUpdate === -1) {
      console.log('Email not found.');
      return;
    }

    // 3. Update the specific row
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: '1B7EwUZOPWCM3c8efLvOpqFs_sHVdqjzmY7N8mXJzPXU',
      range: `Sheet1!U${rowIndexToUpdate}:V${rowIndexToUpdate}`, // Specify range in U and V columns
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          ["newTrackingID", "newCourierCompany"]
        ],
      },
    });

    console.log('Update successful:', updateResponse.data);
  } catch (error) {
    console.error('Error updating sheet:', error);
  }
};

updateSheet();
