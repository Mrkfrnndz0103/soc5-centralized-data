/**
 * Google Apps Script: Sync Google Sheets to Supabase
 * 
 * This script syncs Users and Outbound Map data from Google Sheets to Supabase
 * Run this script on edit or on a time-based trigger
 */

// Configuration
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_KEY = 'your_supabase_anon_key'

// Sheet names
const USERS_SHEET = 'Users'
const OUTBOUND_MAP_SHEET = 'Outbound Map'

/**
 * Sync users from Google Sheets to Supabase
 */
function syncUsers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET)
  if (!sheet) {
    Logger.log('Users sheet not found')
    return
  }
  
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const rows = data.slice(1)
  
  const users = rows.map(row => {
    const user = {}
    headers.forEach((header, index) => {
      user[header.toLowerCase().replace(/ /g, '_')] = row[index]
    })
    return user
  }).filter(user => user.ops_id) // Filter out empty rows
  
  // Upsert to Supabase
  const url = `${SUPABASE_URL}/rest/v1/users`
  const options = {
    method: 'post',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    payload: JSON.stringify(users),
    muteHttpExceptions: true
  }
  
  const response = UrlFetchApp.fetch(url, options)
  Logger.log(`Users sync: ${response.getResponseCode()}`)
}

/**
 * Sync outbound map from Google Sheets to Supabase
 */
function syncOutboundMap() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OUTBOUND_MAP_SHEET)
  if (!sheet) {
    Logger.log('Outbound Map sheet not found')
    return
  }
  
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const rows = data.slice(1)
  
  const outboundData = rows.map(row => {
    const item = {}
    headers.forEach((header, index) => {
      item[header.toLowerCase().replace(/ /g, '_')] = row[index]
    })
    return item
  }).filter(item => item.cluster_name) // Filter out empty rows
  
  // Upsert to Supabase
  const url = `${SUPABASE_URL}/rest/v1/outbound_map`
  const options = {
    method: 'post',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    payload: JSON.stringify(outboundData),
    muteHttpExceptions: true
  }
  
  const response = UrlFetchApp.fetch(url, options)
  Logger.log(`Outbound Map sync: ${response.getResponseCode()}`)
}

/**
 * Main sync function - call this from triggers
 */
function syncAllData() {
  syncUsers()
  syncOutboundMap()
  Logger.log('Sync completed at ' + new Date())
}

/**
 * Setup time-based trigger (run once)
 */
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers()
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger))
  
  // Create new trigger - sync every hour
  ScriptApp.newTrigger('syncAllData')
    .timeBased()
    .everyHours(1)
    .create()
  
  Logger.log('Triggers setup complete')
}
