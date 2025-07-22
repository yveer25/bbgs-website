// Google Sheets Form Handler
const GOOGLE_SCRIPT_URL_CALLBACK = 'https://script.google.com/macros/s/AKfycbzEvl8cPCN93eNdc7KXu2rUMCGfsC2EXJNVQ_7ImTvc/dev'; // Home page form
const GOOGLE_SCRIPT_URL_LETSTALK = 'https://script.google.com/macros/s/AKfycbwjTh7CfrQpfjUro0q3hqF3lnfxkVsLQ3VsXV9urm3x/dev'; // Contact page form

// Send form data to Google Sheets
async function sendToGoogleSheets(formData) {
    try {
        const scriptUrl = formData.formType === 'callback' ? GOOGLE_SCRIPT_URL_CALLBACK : GOOGLE_SCRIPT_URL_LETSTALK;
        
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Since we're using no-cors, we can't read the response
        // But if we get here, the request was sent
        return { success: true };
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        throw error;
    }
}

// Fetch all entries from Google Sheets
async function fetchFromGoogleSheets(formType = null) {
    try {
        let scriptUrl;
        if (formType === 'callback') {
            scriptUrl = GOOGLE_SCRIPT_URL_CALLBACK;
        } else if (formType === 'letsTalk') {
            scriptUrl = GOOGLE_SCRIPT_URL_LETSTALK;
        } else {
            // Fetch from both sheets
            const callbackEntries = await fetchFromGoogleSheets('callback');
            const letsTalkEntries = await fetchFromGoogleSheets('letsTalk');
            return [...callbackEntries, ...letsTalkEntries];
        }

        const response = await fetch(`${scriptUrl}?action=getEntries&formType=${formType}`, {
            method: 'GET',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.entries || [];
    } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        // Fallback to localStorage
        return getAllEntries().filter(entry => !formType || entry.formType === formType);
    }
}

// Save entry locally as backup
function saveEntryLocally(formData) {
    const entry = {
        ...formData,
        timestamp: new Date().toISOString()
    };
    
    const existingEntries = JSON.parse(localStorage.getItem('formEntries') || '[]');
    existingEntries.push(entry);
    localStorage.setItem('formEntries', JSON.stringify(existingEntries));
    
    return entry;
}

// Handle form submission (send to Google Sheets + save locally)
async function handleFormSubmission(formData) {
    try {
        // Try to send to Google Sheets first
        await sendToGoogleSheets(formData);
        
        // Save locally as backup
        saveEntryLocally(formData);
        
        return { success: true, source: 'google-sheets' };
    } catch (error) {
        console.warn('Google Sheets failed, saving locally only:', error);
        
        // Fallback to local storage only
        saveEntryLocally(formData);
        
        return { success: true, source: 'local-storage' };
    }
}

// Get all entries from localStorage
function getAllEntries() {
    return JSON.parse(localStorage.getItem('formEntries') || '[]');
}

// Clear all entries from localStorage
function clearAllEntries() {
    localStorage.removeItem('formEntries');
}

// Export entries to CSV
function exportEntriesToCSV(entries) {
    if (entries.length === 0) {
        alert('No entries to export.');
        return;
    }

    const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Company', 'Message', 'Form Type', 'IP Address', 'User Agent'];
    const csvContent = [
        headers.join(','),
        ...entries.map(entry => [
            `"${entry.timestamp || ''}"`,
            `"${entry.name || ''}"`,
            `"${entry.email || ''}"`,
            `"${entry.phone || ''}"`,
            `"${entry.company || ''}"`,
            `"${entry.message || ''}"`,
            `"${entry.formType || ''}"`,
            `"${entry.ip || ''}"`,
            `"${entry.userAgent || ''}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `form-entries-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Refresh data from Google Sheets
async function refreshFromGoogleSheets() {
    try {
        const allEntries = await fetchFromGoogleSheets();
        
        // Update localStorage with fresh data
        localStorage.setItem('formEntries', JSON.stringify(allEntries));
        
        return allEntries;
    } catch (error) {
        console.error('Error refreshing from Google Sheets:', error);
        throw error;
    }
} 