function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Check if this is a submission request
  if (e && e.parameter && e.parameter.action === 'submit') {
    // to_vet sheet by GID
    const vetSheet = getSheetByGid(ss, 484390803);
    if (vetSheet) {
      const column = e.parameter.column;
      const value = e.parameter.value || '';

      // Map column names to column indices (A=1, B=2, C=3, D=4)
      const columnMap = {
        'location': 1,    // Column A
        'moment': 2,      // Column B
        'focus': 3,       // Column C
        'contributor': 4  // Column D
      };

      const colIndex = columnMap[column];
      if (colIndex && value) {
        // Append a new row with the value in the correct column
        const newRow = ['', '', '', ''];
        newRow[colIndex - 1] = value;
        vetSheet.appendRow(newRow);
      }
    }
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Otherwise return the ritual data from live sheet (first sheet)
  const sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const colA = [], colB = [], colC = [], colD = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) colA.push(data[i][0]);
    if (data[i][1]) colB.push(data[i][1]);
    if (data[i][2]) colC.push(data[i][2]);
    if (data[i][3]) colD.push(data[i][3]);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ colA, colB, colC, colD }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper function to get sheet by GID
function getSheetByGid(spreadsheet, gid) {
  const sheets = spreadsheet.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === gid) {
      return sheets[i];
    }
  }
  return null;
}
