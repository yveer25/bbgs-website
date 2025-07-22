# Google Apps Script Code for Both Forms

## Instructions:
1. Create **TWO separate Google Sheets** (one for each form)
2. In each sheet, go to **Extensions > Apps Script**
3. Replace the default code with the code below
4. **Deploy as Web App** for each script
5. Copy the Web App URLs and provide them to me

---

## Google Apps Script Code (use this for BOTH sheets):

```javascript
// Google Apps Script for Form Data Collection
function doPost(e) {
  try {
    // Parse the incoming data
    const formData = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prepare row data
    const rowData = [
      new Date(), // Timestamp
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.company || '',
      formData.message || '',
      formData.formType || '',
      formData.ip || '',
      formData.userAgent || ''
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and convert to objects
    const entries = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      entries.push({
        timestamp: row[0] ? row[0].toISOString() : '',
        name: row[1] || '',
        email: row[2] || '',
        phone: row[3] || '',
        company: row[4] || '',
        message: row[5] || '',
        formType: row[6] || '',
        ip: row[7] || '',
        userAgent: row[8] || ''
      });
    }
    
    // Return the data as JSON
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, entries: entries }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
      
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Google Sheet Setup Instructions:

### Sheet 1: "BBGS Callback Form Entries"
**Headers (Row 1):**
- A1: Timestamp
- B1: Name  
- C1: Email
- D1: Phone
- E1: Company
- F1: Message
- G1: Form Type
- H1: IP Address
- I1: User Agent

### Sheet 2: "BBGS Let's Talk Form Entries"  
**Headers (Row 1):**
- A1: Timestamp
- B1: Name
- C1: Email  
- D1: Phone
- E1: Company
- F1: Message
- G1: Form Type
- H1: IP Address
- I1: User Agent

---

## Deployment Steps:

1. **For each Google Sheet:**
   - Go to **Extensions > Apps Script**
   - Replace default code with the script above
   - Click **Deploy > New deployment**
   - Choose **Web app**
   - Set **Execute as:** "Me"
   - Set **Who has access:** "Anyone"
   - Click **Deploy**
   - Copy the **Web app URL**

2. **Provide the URLs to me:**
   - Callback Form URL: `https://script.google.com/macros/s/...`
   - Let's Talk Form URL: `https://script.google.com/macros/s/...`

---

## Important Notes:

- **Two separate Google Sheets** are needed (one for each form)
- **Two separate Google Apps Scripts** are needed (one for each sheet)
- **Same script code** can be used for both
- **Different Web App URLs** will be generated for each
- **Headers must match exactly** as shown above 