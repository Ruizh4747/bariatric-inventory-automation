// Orchestrates PDF generation, Email routing, and Batch Database Export

const CONFIG = {
  ADMIN_EMAIL: "admin@companydomain.com",
  DRIVE_FOLDER_ID: "YOUR_DRIVE_FOLDER_ID",
  MASTER_DB_ID: "YOUR_MASTER_DB_ID",
  EXTERNAL_BILLING_DB_ID: "YOUR_EXTERNAL_BILLING_DB_ID"
};

function ejecutarCierreTotal() {
  const ui = SpreadsheetApp.getUi();
  try {
    enviarReportePDF(); 
    exportarConsumoBatch();
    ui.alert("✅ PROCESO COMPLETADO", "PDF generado, correo enviado y base de datos externa sincronizada.", ui.ButtonSet.OK);
  } catch(e) {
    ui.alert("❌ ERROR CRÍTICO", "El flujo se interrumpió: " + e.message, ui.ButtonSet.OK);
  }
}

function exportarConsumoBatch() {
  const ssOrigen = SpreadsheetApp.getActiveSpreadsheet();
  const hojaOrigen = ssOrigen.getSheetByName("Reporte Paciente");
  
  const fInicio = Utilities.formatDate(new Date(hojaOrigen.getRange("B1").getValue()), "GMT-4", "dd/MM/yyyy");
  const fFin = Utilities.formatDate(new Date(hojaOrigen.getRange("D1").getValue()), "GMT-4", "dd/MM/yyyy");

  // Batch read to memory for performance optimization
  const datosCrudos = hojaOrigen.getRange("I4:K180").getValues();
  const datosProcesados = [];
  
  datosCrudos.forEach(fila => {
    const codigo = fila[0];
    if (codigo && codigo.toString().trim() !== "") {
      datosProcesados.push([fInicio, fFin, codigo, fila[1], fila[2]]);
    }
  });
  
  if (datosProcesados.length === 0) return;

  try {
    const ssDestino = SpreadsheetApp.openById(CONFIG.EXTERNAL_BILLING_DB_ID);
    const hojaDestino = ssDestino.getSheetByName("Consumos_Externos");
    const proximaFila = hojaDestino.getLastRow() + 1;
    
    // Vectorized insert (1 single API call instead of loops)
    hojaDestino.getRange(proximaFila, 1, datosProcesados.length, 5).setValues(datosProcesados);
  } catch(e) {
    throw new Error("Fallo en transferencia de datos externos: " + e.message);
  }
}

function enviarReportePDF() {
  // Logic for PDF blob generation and GmailApp routing goes here...
}
