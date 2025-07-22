# Google Sheets Integration Setup for GitHub Pages

Since GitHub Pages only supports static files, we'll use Google Sheets as a backend to collect form submissions from all visitors.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "BBGS Form Entries"
4. Create these columns in the first row:
   - A: Timestamp
   - B: Name
   - C: Email
   - D: Phone
   - E: Company
   - F: Message
   - G: Form Type
   - H: IP Address
   - I: User Agent

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Replace the default code with this:

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prepare row data
    const rowData = [
      new Date(), // Timestamp
      data.name || '',
      data.email || '',
      data.phone || '',
      data.company || '',
      data.message || '',
      data.formType || '',
      data.ip || '',
      data.userAgent || ''
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Entry saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Form handler is working' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** and give it a name like "BBGS Form Handler"

## Step 3: Deploy the Script

1. Click **Deploy > New deployment**
2. Choose **Web app** as the type
3. Set **Execute as**: "Me"
4. Set **Who has access**: "Anyone"
5. Click **Deploy**
6. Copy the **Web app URL** (you'll need this for the next step)

## Step 4: Update the JavaScript File

1. Open `assets/js/form-handler.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual Web app URL
3. Save the file

## Step 5: Update Your Forms

Now update your forms to use this new system. The forms will:
- Send data to Google Sheets (accessible from anywhere)
- Save a backup locally (in case of network issues)
- Work with GitHub Pages (no server-side code needed)

## Benefits of This Approach

✅ **Works with GitHub Pages** - No server-side code needed
✅ **Centralized storage** - All entries in one Google Sheet
✅ **Accessible anywhere** - You can view entries from any device
✅ **Backup system** - Local storage as fallback
✅ **Real-time updates** - Entries appear immediately in the sheet
✅ **Export capabilities** - Easy to export from Google Sheets

## Alternative: Simple LocalStorage Solution

If you prefer a simpler approach without Google Sheets, we can use localStorage with a manual data collection system where you periodically check different devices/browsers and combine the data.

Would you like me to implement the Google Sheets integration, or would you prefer the simpler localStorage approach? 