/**
 * Google Apps Script: Webhook Receiver for Dispatch Reports
 * 
 * This script receives dispatch reports from Supabase and writes them to Google Sheets
 * Deploy as Web App and use the URL in Supabase webhook
 */

const DISPATCH_SHEET = 'Dispatch Reports'

/**
 * Handle POST requests from Supabase webhook
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const record = data.record // Supabase sends new record in 'record' field
    
    if (!record) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'No record data received'
      })).setMimeType(ContentService.MimeType.JSON)
    }
    
    // Get or create sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(DISPATCH_SHEET)
    
    if (!sheet) {
      sheet = ss.insertSheet(DISPATCH_SHEET)
      // Add headers
      const headers = [
        'ID', 'Batch Sequence', 'Cluster Name', 'Station Name', 'Region',
        'Count of TO', 'Total OID Loaded', 'Actual Docked Time', 'Dock Number',
        'Dock Confirmed', 'Actual Depart Time', 'Processor Name', 'LH Trip',
        'Plate Number', 'Fleet Size', 'Assigned Ops ID', 'Assigned Ops Name',
        'Notes', 'Status', 'Submitted By', 'Verified By', 'Verified At',
        'Created At', 'Updated At'
      ]
      sheet.appendRow(headers)
    }
    
    // Append new row
    const row = [
      record.id,
      record.batch_sequence,
      record.cluster_name,
      record.station_name,
      record.region,
      record.count_of_to,
      record.total_oid_loaded,
      record.actual_docked_time,
      record.dock_number,
      record.dock_confirmed,
      record.actual_depart_time,
      record.processor_name,
      record.lh_trip,
      record.plate_number,
      record.fleet_size,
      record.assigned_ops_id,
      record.assigned_ops_name,
      record.notes,
      record.status,
      record.submitted_by_ops_id,
      record.verified_by_ops_id,
      record.verified_at,
      record.created_at,
      record.updated_at
    ]
    
    sheet.appendRow(row)
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Dispatch report added to sheet'
    })).setMimeType(ContentService.MimeType.JSON)
    
  } catch (error) {
    Logger.log('Error: ' + error.toString())
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Test function
 */
function testWebhook() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        record: {
          id: 'test-123',
          cluster_name: 'Test Cluster',
          station_name: 'Test Station',
          region: 'NCR',
          count_of_to: 10,
          total_oid_loaded: 100,
          status: 'Pending',
          submitted_by_ops_id: 'TEST001',
          created_at: new Date().toISOString()
        }
      })
    }
  }
  
  const result = doPost(testData)
  Logger.log(result.getContent())
}
